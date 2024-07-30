import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      // console.log("MongoDB Connected Successfully!");
    });
    connection.on("error", (err) => {
      // console.log(
      //   "MongoDB connection error , Please make sure MongDB is running" + err
      // );
    });
  } catch (error) {
    // console.log("Something Went Wrong!");
    // console.log(error);
  }
}
