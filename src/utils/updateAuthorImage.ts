// src/utils/updateAuthorImage.ts
import Post from "@/models/PostModel";

// Function to update author images in old posts
export async function updateAuthorImage(userId: string, newImgUrl: string) {
  try {
    await Post.updateMany({ userId }, { $set: { authorImg: newImgUrl } });
    // console.log("Author images updated for old posts");
  } catch (error) {
    console.error("Error updating author images for old posts:", error);
  }
}
