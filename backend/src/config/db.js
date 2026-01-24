import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB(){
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MONGO-DB CONNECTED SUCCESSFULLY !!!")
    } catch (error) {
        console.log("ERROR : ",error);
    }
} 

export default connectDB;