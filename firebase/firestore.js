import { 
  db 
} from './config.js';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
  writeBatch,
  runTransaction
} from "firebase/firestore";

// Users
export const getUser = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      status,
      lastSeen: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

// Friends
export const sendFriendRequest = async (fromUserId, toUserId) => {
  try {
    const requestId = `${fromUserId}_${toUserId}`;
    
    await setDoc(doc(db, "friendRequests", requestId), {
      id: requestId,
      fromUserId,
      toUserId,
      status: "pending",
      createdAt: serverTimestamp()
    });
    
    // Create notification
    await setDoc(doc(db, "notifications", Date.now().toString()), {
      id: Date.now().toString(),
      userId: toUserId,
      type: "friend_request",
      title: "New Friend Request",
      message: `You have a new friend request from ${fromUserId}`,
      read: false,
      createdAt: serverTimestamp(),
      data: { fromUserId, requestId }
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const acceptFriendRequest = async (requestId, fromUserId, toUserId) => {
  try {
    const batch = writeBatch(db);
    
    // Update request status
    batch.update(doc(db, "friendRequests", requestId), {
      status: "accepted",
      acceptedAt: serverTimestamp()
    });
    
    // Add to friends list for both users
    batch.update(doc(db, "users", fromUserId), {
      friends: arrayUnion(toUserId),
      "stats.friendsCount": increment(1)
    });
    
    batch.update(doc(db, "users", toUserId), {
      friends: arrayUnion(fromUserId),
      "stats.friendsCount": increment(1)
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Chats
export const createChat = async (participants, type = "direct") => {
  try {
    const chatId = type === "direct" 
      ? participants.sort().join('_')
      : `group_${Date.now()}`;
    
    await setDoc(doc(db, "chats", chatId), {
      id: chatId,
      participants,
      type,
      lastMessage: "",
      lastMessageTime: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      unreadCount: {},
      settings: {}
    });
    
    return { success: true, chatId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const sendMessage = async (chatId, senderId, content, type = "text") => {
  try {
    const messageId = Date.now().toString();
    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    
    await setDoc(messageRef, {
      id: messageId,
      chatId,
      senderId,
      content,
      type,
      timestamp: serverTimestamp(),
      edited: false,
      deleted: false,
      reactions: {},
      readBy: [senderId],
      metadata: {}
    });
    
    // Update chat
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: type === "text" ? content : `Sent a ${type}`,
      lastMessageTime: serverTimestamp(),
      updatedAt: serverTimestamp(),
      [`unreadCount.${senderId}`]: 0
    });
    
    // Increment sender's message count
    await updateDoc(doc(db, "users", senderId), {
      "stats.messagesSent": increment(1)
    });
    
    return { success: true, messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Groups
export const createGroup = async (name, description, ownerId, isPublic = true) => {
  try {
    const groupId = `group_${Date.now()}`;
    
    await setDoc(doc(db, "groups", groupId), {
      id: groupId,
      name,
      description,
      ownerId,
      admins: [ownerId],
      members: [ownerId],
      isPublic,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      memberCount: 1,
      settings: {
        allowInvites: true,
        allowMemberPosts: true,
        requireApproval: false,
        allowVoiceChat: true,
        maxMembers: 100
      },
      stats: {
        messagesCount: 0,
        voiceSessions: 0
      }
    });
    
    // Create group chat
    await createChat([ownerId], "group");
    
    return { success: true, groupId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateGroupSettings = async (groupId, settings, adminId) => {
  try {
    const groupDoc = await getDoc(doc(db, "groups", groupId));
    const groupData = groupDoc.data();
    
    if (!groupData.admins.includes(adminId)) {
      throw new Error("Not authorized");
    }
    
    await updateDoc(doc(db, "groups", groupId), {
      settings: { ...groupData.settings, ...settings },
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const manageGroupMember = async (groupId, userId, action, adminId) => {
  try {
    const groupDoc = await getDoc(doc(db, "groups", groupId));
    const groupData = groupDoc.data();
    
    if (!groupData.admins.includes(adminId)) {
      throw new Error("Not authorized");
    }
    
    switch (action) {
      case "add":
        await updateDoc(doc(db, "groups", groupId), {
          members: arrayUnion(userId),
          memberCount: increment(1),
          updatedAt: serverTimestamp()
        });
        break;
        
      case "remove":
        await updateDoc(doc(db, "groups", groupId), {
          members: arrayRemove(userId),
          admins: arrayRemove(userId),
          memberCount: increment(-1),
          updatedAt: serverTimestamp()
        });
        break;
        
      case "promote":
        await updateDoc(doc(db, "groups", groupId), {
          admins: arrayUnion(userId),
          updatedAt: serverTimestamp()
        });
        break;
        
      case "demote":
        await updateDoc(doc(db, "groups", groupId), {
          admins: arrayRemove(userId),
          updatedAt: serverTimestamp()
        });
        break;
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Voice Chat
export const createVoiceRoom = async (groupId, name, hostId) => {
  try {
    const roomId = `voice_${Date.now()}`;
    
    await setDoc(doc(db, "voiceRooms", roomId), {
      id: roomId,
      groupId,
      name,
      hostId,
      participants: [hostId],
      maxParticipants: 50,
      isActive: true,
      createdAt: serverTimestamp(),
      settings: {
        muteOnJoin: false,
        allowScreenShare: true,
        recordingAllowed: false
      }
    });
    
    return { success: true, roomId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const joinVoiceRoom = async (roomId, userId) => {
  try {
    await updateDoc(doc(db, "voiceRooms", roomId), {
      participants: arrayUnion(userId),
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Real-time listeners
export const listenToMessages = (chatId, callback) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

export const listenToUserChats = (userId, callback) => {
  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("participants", "array-contains", userId),
    orderBy("lastMessageTime", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(chats);
  });
};

export const listenToOnlineUsers = (callback) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("status", "==", "online"));
  
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(users);
  });
};
