import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connect_mongo() {
  mongoose
    .connect(
      "mongodb+srv://prathameshgayake2021comp:XmdRxglgE0wN3J5T@chat.najc4ev.mongodb.net/?retryWrites=true&w=majority&appName=chat"
    )
    .then(() => {
      console.log("Connected Database");
    })
    .catch((err) => {
      console.log("err ---> \n", err);
    });
}
