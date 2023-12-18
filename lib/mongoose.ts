import { log } from "console";
import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) return "Mongoose Url Is Not Defiend";
  if (isConnected) return console.log("=> Data base already connected");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;

    console.log("Connect to Database ");
  } catch (error) {
    console.log(error);
  }
};
