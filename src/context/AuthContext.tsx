import { Dispatch, SetStateAction, createContext } from 'react';
import { AppUser } from '../common/interfaces.ts';
import { User } from 'firebase/auth';
import { AppState } from '../helpers/useUserContext.ts';

export interface AuthContextType {
  user: User | null | undefined;
  isLoggedIn?: boolean;
  userData: AppUser | null;
  setUser: Dispatch<SetStateAction<AppState>>;
}

export const AuthContext = createContext({
  setUser:(() => {}) as Dispatch<SetStateAction<AppState>>,
  userData: {} as AppUser,
  user: {} as User,
});