// /helpers/action.ts

import axios from "axios";

export const deletePost = async (id: string) => {
  try {
    const response = await axios.delete(`/api/posts/${id}`);
    if (response.status === 200) {
      // console.log("Deleted from db");
    }
  } catch (error: any) {
    // console.log("Something Went Wrong:", error.message);
  }
};
