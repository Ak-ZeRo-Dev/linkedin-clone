import streamifier from "streamifier";
import cloudinary from "@/lib/cloudinary";

export const uploadToCloudinary = async (file: File): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "linkedin",
        use_filename: true,
        quality: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    // Instead of manually reading chunks, use the streamifier directly
    streamifier
      .createReadStream(Buffer.from(await file.arrayBuffer()))
      .pipe(uploadStream);
  });
};

export const uploadWithRetry = async (
  file: File,
  retries = 3,
): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await uploadToCloudinary(file);
    } catch (error) {
      console.error(`Upload attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise((res) => setTimeout(res, 1000 * (i + 1))); // Exponential backoff
    }
  }
};
