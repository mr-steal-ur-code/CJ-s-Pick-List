import { createDoc, findDoc } from "./firebaseClientCalls";


export default async function handleUserDocument(user: User | any) {
  if (!user?.uid) {
    console.error("no user id");
    return { success: false, response: "No user Id" };
  }
  try {
    const userDoc = await findDoc("users", user?.uid) || null;
    if (!userDoc.doc) {
      const userData = {
        id: user?.uid,
        email: user?.email || null,
        avatar: user?.photoURL || null,
        createdAt: new Date() || null,
        createdBy: user?.uid,
      };
      await createDoc("users", userData, userData?.id)
      return { success: true, response: userData };
    } else return {
      success: true, response:
        userDoc?.doc
    };
  } catch (error: any) {
    console.error("error handling user doc", error.message || error?.code)
    return { success: false, response: error?.message || error?.code };
  }
}