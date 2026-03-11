"use server";

import cloudinary from "@/lib/cloudinary";

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("image") as File;

    if (!file) {
      return { success: false, error: "No image provided" };
    }

    // Server-side validation
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      return { success: false, error: "Image size must be less than 3MB" };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "chat-app-uploads",
            
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    return { success: true, url: uploadResponse.secure_url };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: error.message || "Failed to upload image" };
  }
}
