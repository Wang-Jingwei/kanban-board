import { db } from '../firebase';
import { 
  collection, 
  doc,  
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';


const BOARDS_COLLECTION = 'boards';

// Add real-time listening function for boards
export const subscribeToBoardsUpdates = (onUpdate) => {
  const boardsRef = collection(db, BOARDS_COLLECTION);
  
  // Return the unsubscribe function
  return onSnapshot(boardsRef, (snapshot) => {
    const boards = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    onUpdate(boards);
  }, (error) => {
    console.error("Error listening to boards:", error);
  });
};

export const getBoard = async (boardId) => {
  try {
    const boardDoc = await getDoc(doc(db, BOARDS_COLLECTION, boardId));
    if (boardDoc.exists()) {
      return {
        id: boardDoc.id,
        ...boardDoc.data()
      };
    } else {
      throw new Error(`Board with ID ${boardId} does not exist`);
    }
  } catch (error) {
    console.error("Error getting board: ", error);
    throw error;
  }
};


export const createBoard = async (boardData) => {
  try {
    const now = new Date().toISOString();
    const boardWithTimestamp = {
      ...boardData,
      createdAt: now,
      updatedAt: now
    };
    const docRef = await addDoc(collection(db, BOARDS_COLLECTION), boardWithTimestamp);
    return {
      id: docRef.id,
      ...boardWithTimestamp
    };
  } catch (error) {
    console.error("Error creating board: ", error);
    throw error;
  }
};


export const updateBoard = async (boardId, boardData) => {
  try {
    const now = new Date().toISOString();
    const updateData = {
      ...boardData,
      updatedAt: now
    };
    const boardRef = doc(db, BOARDS_COLLECTION, boardId);
    await updateDoc(boardRef, updateData);
    return {
      id: boardId,
      ...updateData
    };
  } catch (error) {
    console.error("Error updating board: ", error);
    throw error;
  }
};


export const deleteBoard = async (boardId) => {
  try {
    await deleteDoc(doc(db, BOARDS_COLLECTION, boardId));
    return boardId;
  } catch (error) {
    console.error("Error deleting board: ", error);
    throw error;
  }
}; 