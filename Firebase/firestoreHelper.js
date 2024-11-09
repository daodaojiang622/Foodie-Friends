import { collection, addDoc, doc, getDocs, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore"; 
import { database } from "./firebaseSetup";

export async function writeToDB(data, collectionName) {
	try {
	     const docRef = await addDoc(collection(database, collectionName), data);
         return docRef;
	  }
	catch (err) {
	    console.log("Write to DB", err)
	  }
}

export async function fetchDataFromDB(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(database, collectionName));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return data;
    } catch (err) {
      console.log("Fetch from DB", err);
      return [];
    }
  }

export const updateDB = async (id, updatedData, collectionName) => {
  try {
    const docRef = doc(database, collectionName, id);
    await updateDoc(docRef, updatedData);
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteFromDB = async (id, collectionName) => {
  try {
  const docRef = doc(database, collectionName, id);
    await deleteDoc(docRef);
    console.log('Document deleted with ID: ', id);
  } catch (e) {
    console.error('Error deleting document: ', e);
  }
};

export const subscribeToMeetUps = (collectionName, callback) => {
  const unsubscribe = onSnapshot(collection(database, collectionName), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
  return unsubscribe;
};