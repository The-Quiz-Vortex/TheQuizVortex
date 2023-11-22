import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from "../config/firebase-config.ts";
import { DataSnapshot } from "firebase/database";
import { setFileToFirebaseStorage } from './storage.services.ts';

/**
 * Transforms the users document snapshot into an array of user objects.
 *
 * @param {DataSnapshot} snapshot - The snapshot of the users document.
 * @returns {Array} - An array of user objects.
 */
export const fromUsersDocument = (snapshot: DataSnapshot) => {
    const usersDocument = snapshot.val();

    return Object.keys(usersDocument).map((key) => {
        const post = usersDocument[key];

        return {
            ...post,
            username: key,
            createdOn: new Date(post.createdOn),
        };
    });
};

/**
 * Retrieves a user by their username.
 *
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves with the retrieved user object.
 */
export const getUserByUsername = (username: string): Promise<object> => {
    return get(ref(db, `users/${username}`));
};

/**
 * Gets user details by email address.
 * : Promise<object>
 * @param {string} email - The email address to search for.
 * @returns {Promise<Object>} A promise that resolves to the User object if found,
 * or undefined if no user exists with that email.
 */
export const getUserByEmail = (email: string): Promise<object> => {
    return get(query(ref(db, 'users'), orderByChild('email'), equalTo(email)));
};


/**
 * Creates a new user using their username as the key.
 *
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} uid - The user's UID.
 * @param {string} email - The user's email.
 * @param {string} username - The username of the user.
 * @param {string} profilePictureURL - The URL of the user's profile picture.
 * @returns {Promise<void>} - A promise that resolves after creating the user.
 */
export const createUserByUsername = (
    firstName: string,
    lastName: string,
    uid: string,
    email: string,
    username: string,
    profilePictureURL: string,
    phoneNumber: string
): Promise<void> => {
    return set(ref(db, `users/${username}`), {
        firstName,
        lastName,
        uid,
        username,
        profilePictureURL,
        email,
        phoneNumber,
        role: "user",
        createdOn: Date.now(),
    });
};

/**
 * Retrieves user data by UID.
 *
 * @param {string} uid - The UID of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves with the retrieved user object.
 */
export const getUserData = (uid: string): Promise<DataSnapshot> => {
    return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

/**
 * Retrieves all users.
 *
 * @returns {Promise<Array>} - A promise that resolves with an array of user objects.
 */
export const getAllUsers = (): Promise<Array<object>> => {
    return get(ref(db, "users")).then((snapshot) => {
        if (!snapshot.exists()) {
            return [];
        }

        return fromUsersDocument(snapshot);
    });
};

/**
 * Updates the profile picture URL for a user.
 *
 * @param {File} file - The new profile picture file.
 * @param {string} currentUser - The username of the current user.
 * @returns {Promise<string>} - A promise that resolves with the updated profile picture URL.
 */
export const updateProfilePic = async (
    file: File,
    currentUser: string
): Promise<string> => {
    const url = await setFileToFirebaseStorage(file);

    const updateProfilePic: { [key: string]: string } = {};
    updateProfilePic[`/users/${currentUser}/profilePictureURL`] = url;

    update(ref(db), updateProfilePic);
    return url;
};

/**
 * Updates the phone number for a user.
 *
 * @param {string} phone - The new phone number.
 * @param {string} currentUser - The username of the current user.
 * @returns {Promise<void>} - A promise that resolves after updating the phone number.
 */
export const updateProfilePhone = async (
    phone: string,
    currentUser: string
): Promise<void> => {
    const updatePhone: { [key: string]: string } = {};
    updatePhone[`/users/${currentUser}/phone`] = phone;

    return update(ref(db), updatePhone);
};


/**
 * Updates the email address for a user.
 *
 * @param {string} email - The new email address.
 * @param {string} currentUser - The username of the current user.
 * @returns {Promise<void>} - A promise that resolves after updating the email.
 */
export const updateProfileEmail = async (
    email: string,
    currentUser: string
): Promise<void> => {
    const updateEmail: { [key: string]: string } = {};
    updateEmail[`/users/${currentUser}/email`] = email;

    return update(ref(db), updateEmail);
};

/**
 * Blocks a user.
 *
 * @param {string} handle - The username of the user to block.
 * @returns {Promise<void>} - A promise that resolves after blocking the user.
 */
export const blockUser = (handle: string): Promise<void> => {
    const updateBlockedStatus: { [key: string]: boolean } = {};

    updateBlockedStatus[`/users/${handle}/blockedStatus`] = true;

    return update(ref(db), updateBlockedStatus);
};


/**
 * Unblocks a user.
 *
 * @param {string} handle - The username of the user to unblock.
 * @returns {Promise<void>} - A promise that resolves after unblocking the user.
 */
export const unblockUser = (handle: string): Promise<void> => {
    const updateBlockedStatus: { [key: string]: boolean } = {};

    updateBlockedStatus[`/users/${handle}/blockedStatus`] = false;

    return update(ref(db), updateBlockedStatus);
};


/**
 * Grants admin privileges to a user.
 *
 * @param {string} username - The username of the user to make an admin.
 * @returns {Promise<void>} - A promise that resolves after granting admin privileges.
 */

export const makeAdminUser = (username: string): Promise<void> => {
    const updateAdminStatus: { [key: string]: string } = {};

    updateAdminStatus[`/users/${username}/role`] = "admin";

    return update(ref(db), updateAdminStatus);
};


/**
 * Removes admin privileges from a user.
 *
 * @param {string} username - The username of the user to remove admin rights from.
 * @returns {Promise<void>} - A promise that resolves after removing admin privileges.
 */
export const removeAdminUser = (username: string): Promise<void> => {
    const updateAdminStatus: { [key: string]: string } = {};

    updateAdminStatus[`/users/${username}/role`] = "user";

    return update(ref(db), updateAdminStatus);
};











