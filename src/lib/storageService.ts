/**
 * storageService.ts
 * Handles certificate file uploads via Cloudinary (free tier).
 * Firebase Auth + Firestore remain unchanged — only file hosting moves here.
 */

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ng8dfldv";
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "My_portfolio";

// resource_type=auto handles images (JPG, PNG, WEBP) AND raw files (PDF)
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

/**
 * Uploads a certificate PDF or image to Cloudinary and returns the secure URL.
 * Uses an unsigned upload preset so no backend / secret key is needed.
 *
 * @param file       The File object selected by the user
 * @param onProgress Optional callback receiving 0-100 upload progress
 * @returns          The permanent Cloudinary secure_url for the file
 */
export const uploadCertificateFile = (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    // Store all certificates in a dedicated folder inside your Cloudinary account
    formData.append("folder", "portfolio/certificates");

    const xhr = new XMLHttpRequest();

    // --- Progress ---
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress(pct);
      }
    });

    // --- Success / Error response ---
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as {
            secure_url?: string;
            error?: { message: string };
          };

          if (data.error) {
            reject(
              new Error(
                `Cloudinary error: ${data.error.message}. ` +
                  'Make sure the upload preset "' +
                  CLOUDINARY_UPLOAD_PRESET +
                  '" exists and is set to Unsigned in your Cloudinary dashboard ' +
                  "(Settings → Upload → Upload presets)."
              )
            );
            return;
          }

          if (!data.secure_url) {
            reject(new Error("Cloudinary did not return a file URL. Check your upload preset settings."));
            return;
          }

          resolve(data.secure_url);
        } catch {
          reject(new Error("Failed to parse Cloudinary response."));
        }
      } else {
        // e.g. 400 Bad Request when preset name is wrong
        let msg = `Upload failed (HTTP ${xhr.status}).`;
        try {
          const err = JSON.parse(xhr.responseText) as { error?: { message: string } };
          if (err.error?.message) msg += " " + err.error.message;
        } catch { /* ignore */ }

        if (xhr.status === 400) {
          msg +=
            ' This usually means the upload preset "' +
            CLOUDINARY_UPLOAD_PRESET +
            '" was not found or is not set to Unsigned. ' +
            "Check Cloudinary dashboard → Settings → Upload → Upload presets.";
        }
        reject(new Error(msg));
      }
    });

    // --- Network error ---
    xhr.addEventListener("error", () => {
      reject(
        new Error(
          "Network error during upload. Check your internet connection and that " +
            "your Cloudinary cloud name is correct (" +
            CLOUDINARY_CLOUD_NAME +
            ")."
        )
      );
    });

    // --- Timeout (60 s) ---
    xhr.timeout = 60_000;
    xhr.addEventListener("timeout", () => {
      xhr.abort();
      reject(new Error("Upload timed out after 60 seconds. Check your internet connection."));
    });

    xhr.open("POST", CLOUDINARY_UPLOAD_URL);
    xhr.send(formData);
  });
};
