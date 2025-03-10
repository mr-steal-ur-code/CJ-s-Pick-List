import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

export const copyAndDeleteCollection = async (fromCollection: string, toCollection: string) => {
  try {
    // Reference to the source collection
    const itemsCollectionRef = collection(db, fromCollection);

    // Get all documents from the items collection
    const itemsSnapshot = await getDocs(itemsCollectionRef);

    // Check if there are documents to copy
    if (itemsSnapshot.empty) {
      console.log('No items to copy and delete');
      return;
    }

    // Create batch to perform multiple writes atomically
    const batch = writeBatch(db);

    // Process each document
    itemsSnapshot.docs.forEach(document => {
      const itemData = document.data();

      // Create a reference to the destination document with the same ID
      const sharedItemRef = doc(db, toCollection, document.id);

      // Add document to batch for copying
      batch.set(sharedItemRef, itemData);

      // Add document to batch for deletion from original location
      const originalDocRef = doc(db, fromCollection, document.id);
      batch.delete(originalDocRef);
    });

    // Commit the batch
    await batch.commit();

    console.log(`Successfully copied ${itemsSnapshot.size} items to shared collection`);
  } catch (error) {
    console.error('Error copying items to shared collection:', error);
    throw error;
  }
};