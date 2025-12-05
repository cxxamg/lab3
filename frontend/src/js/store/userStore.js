import { Store } from '@tanstack/react-store';

export const userStore = new Store({
  user: null, 
  isAuthenticated: false,
  error: null
});