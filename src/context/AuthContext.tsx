import { Dispatch, SetStateAction, createContext } from 'react';
import { AppUser } from '../common/interfaces.ts';
import { User, UserCredential } from 'firebase/auth';
import { AppState } from '../helpers/useUserContext.ts';

export interface AuthContextType {
  user: User | UserCredential | null | undefined;
  isLoggedIn?: boolean;
  userData?: AppUser | null;
  setUser: Dispatch<SetStateAction<AppState>>;
}

export const AuthContext = createContext<AuthContextType>({
  setUser:(() => {}),
  userData: {} as AppUser,
  user: {} as User,
});