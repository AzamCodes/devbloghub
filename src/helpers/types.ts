export interface Post {
  _id: string;
  title: string;
  desc: string;
  createdAt: string;
  img?: string;
  slug?: string;
  [key: string]: any; // Include any additional properties if needed
}
