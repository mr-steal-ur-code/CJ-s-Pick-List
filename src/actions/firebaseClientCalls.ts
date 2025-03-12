import { setDoc, collection, doc, deleteDoc, getDoc, getDocs, limit, query, CollectionReference, where, orderBy, startAfter, getCountFromServer } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import generateUuidv4 from "../utils/uuidv4";
import { db, storage } from "../firebase";

const countDocs = async (collectionName: string, whereStatements?: WhereStatement[],) => {
  try {
    const collectionRef = collection(db, collectionName);
    let queryRef = query(collectionRef);
    if (whereStatements) {
      whereStatements?.forEach?.((whereStatement) => {
        queryRef = query(queryRef,
          where(
            whereStatement.key,
            whereStatement.conditional,
            whereStatement.value
          )
        )
      })
    }
    const count = (await getCountFromServer(queryRef))?.data()?.count;
    return { success: true, response: count };
  } catch (error: any) {
    console.error("Error counting documents:", error.message || error.code);
    return { success: false, response: error?.message || error?.code };
  }
};

const createDoc = async (collectionName: string, data: any, userId?: string, docId?: string) => {
  const id = docId ? docId : generateUuidv4(28);
  try {
    const documentData = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(userId ? { createdBy: doc(db, "users", userId) } : {})
    };

    await setDoc(doc(db, collectionName, id), documentData);

    return { success: true, doc: documentData };
  } catch (error: any) {
    console.warn("error saving Document", error?.message || error?.code)
    return { success: false, response: error?.message || error?.code };
  }
}

const findDocByPath = async (path: string) => {
  try {
    const docSnap = await getDoc(doc(db, path));
    if (docSnap) {
      return { success: true, doc: docSnap.data() };
    } else return { success: false, response: "No document found" }
  } catch (error: any) {
    console.log("error getting document:", error?.message || error?.code)
    return { success: false, response: error?.message || error?.code };
  }
}

const findDoc = async (collectionName: string, id: any) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, id));
    if (docSnap) {
      return { success: true, doc: docSnap.data() as any };
    } else return { success: false, response: "No document found" }
  } catch (error: any) {
    console.log("error getting document:", error?.message || error?.code)
    return { success: false, response: error?.message || error?.code };
  }
}

const updateDoc = async (collectionName: string, id: string, data: any) => {
  try {
    await setDoc(doc(db, collectionName, id), { ...data, updatedAt: new Date() }, { merge: true });
    return { success: true, response: "Document updated successfully" };
  } catch (error: any) {
    console.warn("error updating document:", error?.message || error?.code)
    return { success: false, response: error?.message || error?.code };
  }
}

const killDoc = async (collectionName: string, id: any) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return { success: true, response: "Document deleted successfully" };
  } catch (error: any) {
    console.log("error deleting document:", error?.message || error?.code)
    return { success: false, response: error?.message || error?.code };
  }
};

const listDocs = async (collectionName: string) => {
  try {
    const docs = (await getDocs(collection(db, collectionName))).docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    if (docs) {
      return { success: true, response: docs };
    } else return { success: false, response: "No Documents found" }
  } catch (error: any) {
    console.log("error getting documents:", error?.message || error?.code)
    return { success: false, response: error?.message || error?.code };
  }
};

const queryList = async (
  collectionName: string,
  whereStatements?: WhereStatement[],
  order?: OrderByCriteria[],
  limitBy?: number,
  lastDoc?: any,
) => {
  try {
    const collectionRef: CollectionReference = collection(db, collectionName);
    let queryRef = query(collectionRef);

    if (whereStatements) {
      whereStatements.forEach((whereStatement) => {
        queryRef = query(
          queryRef,
          where(
            whereStatement.key,
            whereStatement.conditional,
            whereStatement.value
          )
        );
      });
    }
    if (order) {
      order.forEach((orderByCriteria) => queryRef = query(
        queryRef,
        orderBy(orderByCriteria.field, orderByCriteria.direction)
      ));
    }
    if (limitBy) {
      queryRef = query(queryRef, limit(limitBy));
    }
    if (lastDoc) {
      queryRef = query(queryRef, startAfter(lastDoc));
    }
    const result = await getDocs(queryRef);
    const docs = result.docs.map((doc) => doc.data());
    const lastDocumentId = result.docs.length === 1 ? null : result.empty ? null : result.docs[result.docs.length - 1];
    return { success: true, response: { docs, lastDocumentId } };
  } catch (error: any) {
    console.error("Error getting query list", error?.message || error?.code)
    return { success: false, error: error?.message || error?.message };
  }
}

const fileUpload = async (file: File, path?: string) => {
  try {
    const fileRef = ref(storage, `${path || "files"}/${file?.name || generateUuidv4(10)}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return { success: true, response: downloadURL };
  } catch (error: any) {
    console.error("error storing file:", error?.message || error?.code)
    return { success: false, response: error?.message || error?.code };
  }
}

export {
  countDocs,
  createDoc,
  findDocByPath,
  findDoc,
  updateDoc,
  killDoc,
  listDocs,
  queryList,
  fileUpload
}