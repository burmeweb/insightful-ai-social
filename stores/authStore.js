import { create } from 'zustand';
import { 
  loginUser, 
  registerUser, 
  logoutUser,
  signInWithGoogle,
  updateUserProfile,
  changePassword,
  deleteAccount
} from '../firebase/auth';
import { getUser } from '../firebase/firestore';

export const useAuthStore = create((set, get) => ({
  user: null,
  userData: null,
  loading: true,
  error: null,
  
  // Actions
  setUser: (user) => set({ user }),
  setUserData: (userData) => set({ userData }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    const result = await loginUser(email, password);
    
    if (result.success) {
      const userData = await getUser(result.user.uid);
      set({ 
        user: result.user, 
        userData,
        loading: false 
      });
    } else {
      set({ error: result.error, loading: false });
    }
    
    return result;
  },
  
  // Register
  register: async (email, password, displayName) => {
    set({ loading: true, error: null });
    const result = await registerUser(email, password, displayName);
    
    if (result.success) {
      const userData = await getUser(result.user.uid);
      set({ 
        user: result.user, 
        userData,
        loading: false 
      });
    } else {
      set({ error: result.error, loading: false });
    }
    
    return result;
  },
  
  // Google Sign In
  googleSignIn: async () => {
    set({ loading: true, error: null });
    const result = await signInWithGoogle();
    
    if (result.success) {
      const userData = await getUser(result.user.uid);
      set({ 
        user: result.user, 
        userData,
        loading: false 
      });
    } else {
      set({ error: result.error, loading: false });
    }
    
    return result;
  },
  
  // Logout
  logout: async () => {
    set({ loading: true });
    const result = await logoutUser();
    
    if (result.success) {
      set({ 
        user: null, 
        userData: null,
        loading: false 
      });
    } else {
      set({ error: result.error, loading: false });
    }
    
    return result;
  },
  
  // Update Profile
  updateProfile: async (data) => {
    set({ loading: true, error: null });
    const { user } = get();
    
    if (!user) {
      set({ error: "No user logged in", loading: false });
      return { success: false, error: "No user logged in" };
    }
    
    const result = await updateUserProfile(user.uid, data);
    
    if (result.success) {
      const userData = await getUser(user.uid);
      set({ userData, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    
    return result;
  },
  
  // Change Password
  updatePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null });
    const result = await changePassword(currentPassword, newPassword);
    
    if (result.success) {
      set({ loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    
    return result;
  },
  
  // Delete Account
  deleteAccount: async (password) => {
    set({ loading: true, error: null });
    const result = await deleteAccount(password);
    
    if (result.success) {
      set({ 
        user: null, 
        userData: null,
        loading: false 
      });
    } else {
      set({ error: result.error, loading: false });
    }
    
    return result;
  },
  
  // Check Auth State
  checkAuth: async () => {
    set({ loading: true });
    const { auth } = await import('../firebase/config');
    const { onAuthStateChange } = await import('../firebase/auth');
    
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChange(async (user) => {
        if (user) {
          const userData = await getUser(user.uid);
          set({ user, userData, loading: false });
        } else {
          set({ user: null, userData: null, loading: false });
        }
        unsubscribe();
        resolve();
      });
    });
  }
}));
