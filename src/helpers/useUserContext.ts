import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase-config.ts";
import { useEffect, useState } from "react";
import { getUserByEmail } from "../services/users.services.ts";
import { onValue, ref } from "firebase/database";
import { AppUser } from "../common/interfaces.ts";
import { User, UserCredential } from 'firebase/auth';

export interface AppState {
  user: User | UserCredential | null | undefined;
  userData?: AppUser | null;
  isLoggedIn?: boolean;
  isAdmin?: boolean; 
}

export const useUserContext = () => {
  const [user, loading] = useAuthState(auth);
  const [appState, setAppState] = useState<AppState>({
    userData: {} as AppUser,
    isLoggedIn: undefined,
    user,
    isAdmin: false,
  });

  if (appState.user !== user) {
    setAppState(prevState => ({ ...prevState, user }));
  }

  useEffect(() => {
    if (user === null && !loading) {
      setAppState({
        ...appState,
        userData: {} as AppUser,
        isLoggedIn: false,
        isAdmin: false,
      });
      return;
    }
    !loading && (async () => {
      try {
        if (user?.email) {
          const result = await getUserByEmail(user.email);
          const isAdmin = result && result.val()?.role === 'admin';
          setAppState((prev) => ({
            ...prev,
            userData: Object.values(result.val())[0] as AppUser,
            isLoggedIn: !!result,
            isAdmin,
          }));
        }
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [user, loading, appState.userData?.profilePictureURL]);

  useEffect(() => {
    if (appState.userData && user) {
      const userRef = ref(db, `users/${appState.userData.username}`);

      const userListener = onValue(userRef, (snapshot) => {
        setAppState((prev) => ({ ...prev, userData: snapshot.val() }));
      });
      return () => {
        userListener();
      };
    }
  }, [appState.userData?.profilePictureURL]);

  return {
    loading,
    user,
    appState,
    setAppState,
  };
};
