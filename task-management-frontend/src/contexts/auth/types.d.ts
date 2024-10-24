import type { User } from '@/types/user';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession: () => Promise<void>;
  setUser: (user: User | null) => void;  // Add setUser method
}
