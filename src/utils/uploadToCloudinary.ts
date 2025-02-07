import streamifier from "streamifier";
import cloudinary from "@/lib/cloudinary";

export const uploadToCloudinary = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
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

    const reader = file.stream().getReader();
    const chunks: Uint8Array[] = [];

    const processStream = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const buffer = Buffer.concat(chunks);
      streamifier.createReadStream(buffer).pipe(uploadStream);
    };

    processStream();
  });
};
