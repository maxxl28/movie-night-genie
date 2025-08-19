/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Handle log out
*/

import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};