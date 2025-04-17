import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBqyDoxC3OB1q3Ma0EGCjGyABU6jmJbqOk",
  authDomain: "kanban-board-607b5.firebaseapp.com",
  projectId: "kanban-board-607b5",
  storageBucket: "kanban-board-607b5.firebasestorage.app",
  messagingSenderId: "194559328975",
  appId: "1:194559328975:web:af964aae8fe73ac8e1edba"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 