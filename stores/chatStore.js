import { create } from 'zustand';
import { 
  createChat,
  sendMessage,
  listenToMessages,
  listenToUserChats
} from '../firebase/firestore';

export const useChatStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
  unsubscribeMessages: null,
  unsubscribeChats: null,
  
  // Actions
  setChats: (chats) => set({ chats }),
  setCurrentChat: (chat) => set({ currentChat: chat }),
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Initialize chat listeners
  initChats: (userId) => {
    const { unsubscribeChats } = get();
    
    if (unsubscribeChats) {
      unsubscribeChats();
    }
    
    const unsubscribe = listenToUserChats(userId, (chats) => {
      set({ chats });
    });
    
    set({ unsubscribeChats: unsubscribe });
  },
  
  // Select chat
  selectChat: (chat) => {
    const { unsubscribeMessages, currentChat } = get();
    
    // Unsubscribe from previous chat
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }
    
    // If same chat, don't resubscribe
    if (currentChat?.id === chat?.id) {
      return;
    }
    
    set({ currentChat: chat, messages: [] });
    
    if (chat) {
      const unsubscribe = listenToMessages(chat.id, (messages) => {
        set({ messages });
      });
      
      set({ unsubscribeMessages: unsubscribe });
    }
  },
  
  // Create new chat
  createNewChat: async (participants, type = "direct") => {
    set({ loading: true, error: null });
    const result = await createChat(participants, type);
    
    set({ loading: false });
    return result;
  },
  
  // Send message
  sendNewMessage: async (content, type = "text") => {
    const { currentChat, userData } = get();
    
    if (!currentChat || !userData) {
      set({ error: "No chat selected or user not logged in" });
      return { success: false, error: "No chat selected" };
    }
    
    set({ loading: true, error: null });
    const result = await sendMessage(currentChat.id, userData.id, content, type);
    
    set({ loading: false });
    return result;
  },
  
  // Clear chat
  clearChat: () => {
    const { unsubscribeMessages } = get();
    
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }
    
    set({ 
      currentChat: null, 
      messages: [],
      unsubscribeMessages: null 
    });
  },
  
  // Cleanup
  cleanup: () => {
    const { unsubscribeMessages, unsubscribeChats } = get();
    
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }
    
    if (unsubscribeChats) {
      unsubscribeChats();
    }
    
    set({
      chats: [],
      currentChat: null,
      messages: [],
      unsubscribeMessages: null,
      unsubscribeChats: null
    });
  }
}));
