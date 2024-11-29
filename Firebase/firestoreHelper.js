import { collection, addDoc, doc, getDocs, updateDoc, deleteDoc, onSnapshot, query, where, setDoc } from "firebase/firestore"; 
import { database } from "./firebaseSetup";

export async function writeToDB(data, collectionName) {
  try {
    console.log("Data being written:", data); // Log data before writing
    const docRef = await addDoc(collection(database, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (err) {
    console.error("Error writing to DB", err);
    throw err;  // Rethrow to let the caller handle it if needed
  }
}


export async function fetchDataFromDB(collectionName, filter = {}) {
  try {
    let q = collection(database, collectionName);

    // Apply filters if provided
    if (filter.username) {
      q = query(q, where("username", "==", filter.username));
    }

    const querySnapshot = await getDocs(q);
    let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Ensure the result has an even number of items
    if (data.length % 2 !== 0) {
      data = data.slice(0, data.length - 1);
    }

    return data;
  } catch (err) {
    console.error("Fetch from DB error", err);
    return [];
  }
}


  export const updateDB = async (id, updatedData, collectionName) => {
    try {
      const docRef = doc(database, collectionName, id);
      await updateDoc(docRef, updatedData);
      console.log(`Document ${id} updated successfully`);
    } catch (e) {
      console.error('Error updating document: ', e);
      throw e;
    }
  };

  export const deleteFromDB = async (id, collectionName) => {
    try {
      const docRef = doc(database, collectionName, id);
      await deleteDoc(docRef);
      console.log('Document deleted with ID: ', id);
    } catch (e) {
      console.error('Error deleting document: ', e);
      throw e;
    }
  };

export const subscribeToMeetUps = (collectionName, callback) => {
  const unsubscribe = onSnapshot(collection(database, collectionName), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
  return unsubscribe;
};

// Function to create or update user profile
export async function addUserProfile(userId, data) {
  try {
    const userDocRef = doc(database, 'users', userId);
    await setDoc(userDocRef, {
      ...data,
      createdAt: new Date().toISOString(), // Add the creation date
    });
    console.log('User profile created successfully.');
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}