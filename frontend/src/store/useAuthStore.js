import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';
import {io} from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:5001' : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
        const res = await axiosInstance.get('/auth/check');
        set({authUser: res.data});
        get().connectSocket(); // Assuming you have a method to connect to socket
    } catch (error) {
        set({authUser: null});
        console.error("Error in checkAuth:", error);
    }finally {
        set({isCheckingAuth: false});
    }
  },
  signup: async (data) => {
    set({isSigningUp: true});
    try {
        const res = await axiosInstance.post('/auth/signup', data);
        set({authUser: res.data});
        toast.success('Account created successfully');
        get().connectSocket(); // Assuming you have a method to connect to socket
    } catch (error) {
        toast.error('Failed to create account');
        console.error("Error in signup:", error);
    } finally {
        set({isSigningUp: false});
    }
  },
  login: async(data) => {
    set({isLoggingIn: true})
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({authUser: res.data});
      toast.success('Logged in successfully');
      get().connectSocket(); // Assuming you have a method to connect to socket
    } catch (error) {
      toast.error('Invalid email or password');
      console.error("Error in login:", error);
    } finally {
      set({isLoggingIn: false});
    }
  },
  logout: async () => {
    try{
      await axiosInstance.post('/auth/logout');
      set({authUser: null});
      toast.success('Logged out successfully');
      get().disconnectSocket(); // Assuming you have a method to disconnect from socket
    }catch (error) {
      toast.error('Failed to logout');
      console.error("Error in logout:", error);
    }
  },

  updateProfile: async (data) => {
    set({isUpdatingProfile: true});
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      set({authUser: res.data});
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error("Error in updateProfile:", error);
    } finally {
      set({isUpdatingProfile: false});
    }
  },
  connectSocket: () => {
    const {authUser} = get();
    if (!authUser || get().socket?.connected) {
      console.error("Cannot connect to socket, user is not authenticated");
      return;
    }
    const socket = io(BASE_URL,{
      query: {
        userId: authUser._id
      },
    });
    socket.connect();
    set({socket});
    socket.on('getOnlineUsers', (userIds) => {
      set({onlineUsers: userIds});
    })
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
})); 