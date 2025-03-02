import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";

const getStorageUrl = async (urlRef: string) => {
  const url = await getDownloadURL(ref(storage, urlRef));
  return url;
}

export default getStorageUrl;