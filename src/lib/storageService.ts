import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads a certificate PDF or image to Firebase Storage and returns the public download URL.
 */
export const uploadCertificateFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!storage) {
    throw new Error(
      "Firebase Storage is not initialized. Please ensure Firebase is configured and Cloud Storage is enabled in Firebase Console."
    );
  }

  // Sanitize filename to avoid weird character issues in URLs
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${Date.now()}_${cleanName}`;
  const fileRef = ref(storage, `certificates/${fileName}`);

  const uploadTask = uploadBytesResumable(fileRef, file, {
    contentType: file.type || "application/octet-stream",
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Storage upload error:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};
