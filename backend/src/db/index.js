import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.mongodbURI}`);
    console.log(conn.connection.host);
    console.log("Database connected successfully......");
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
