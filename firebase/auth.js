import { 
  auth,
  db
} from './config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";

// Create new user
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName });
    await sendEmailVerification(user);
    
    // Create user document
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName,
      email,
      photoURL: "",
      bio: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
      status: "online",
      privacy: {
        profileVisible: true,
        searchable: true,
        showOnlineStatus: true,
        showLastSeen: true
      },
      settings: {
        theme: "light",
        language: "en",
        notifications: {
          messages: true,
          groups: true,
          friendRequests: true
        },
        security: {
          twoFactorEnabled: false,
          loginAlerts: true
        }
      },
      stats: {
        friendsCount: 0,
        groupsCount: 0,
        messagesSent: 0
      }
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateDoc(doc(db, "users", user.uid), {
      status: "online",
      lastSeen: serverTimestamp()
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Google sign in
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        bio: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        status: "online",
        privacy: {
          profileVisible: true,
          searchable: true,
          showOnlineStatus: true,
          showLastSeen: true
        },
        settings: {
          theme: "light",
          language: "en",
          notifications: {
            messages: true,
            groups: true,
            friendRequests: true
          }
        },
        stats: {
          friendsCount: 0,
          groupsCount: 0,
          messagesSent: 0
        }
      });
    } else {
      await updateDoc(doc(db, "users", user.uid), {
        status: "online",
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL
      });
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const logoutUser = async () => {
  try {
    if (auth.currentUser) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        status: "offline",
        lastSeen: serverTimestamp()
      });
    }
    
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update profile
export const updateUserProfile = async (uid, data) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    if (data.displayName || data.photoURL) {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName || auth.currentUser.displayName,
        photoURL: data.photoURL || auth.currentUser.photoURL
      });
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete account
export const deleteAccount = async (password) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    
    await reauthenticateWithCredential(user, credential);
    
    // Delete user data from Firestore
    await updateDoc(doc(db, "users", user.uid), {
      deleted: true,
      deletedAt: serverTimestamp()
    });
    
    // Delete auth account
    await user.delete();
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Auth state listener
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
