import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase-config.ts';

/**
 * Registers a new user with the provided email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<UserCredential>} - A promise that resolves with the user's authentication credential.
 */
export const registerUser = (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Logs in a user with the provided email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user.
 * @returns {Promise<UserCredential>} - A promise that resolves with the user's authentication credential.
 */
export const loginUser = (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the currently authenticated user.
 *
 * @returns {Promise<void>} - A promise that resolves when the user is successfully logged out.
 */
export const logoutUser = (): Promise<void> => {
  return signOut(auth);
};
