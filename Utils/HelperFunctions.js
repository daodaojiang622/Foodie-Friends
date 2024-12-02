import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../Firebase/firebaseSetup';
import axios from 'axios';

export const uploadImageToFirebase = async (uri) => {
  try {
    if (!uri) throw new Error('Invalid URI');

    const response = await fetch(uri);
    if (!response.ok) throw new Error(`Failed to fetch image. Status: ${response.statusText}`);
    const blob = await response.blob();

    const fileName = `${Date.now()}.jpg`;
    const storageRef = ref(storage, `images/${fileName}`);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const fetchSuggestions = async (query, apiKey) => {
  if (query.length <= 2) return [];
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=establishment&keyword=restaurant|cafe|bar&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.predictions.map((place) => ({
      id: place.place_id,
      description: place.description,
    }));
  } catch (error) {
    console.error('Error fetching restaurant suggestions:', error);
    throw error;
  }
};
