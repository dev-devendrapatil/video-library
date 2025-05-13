import mongoose from 'mongoose';


export const connectDB = async () => {
    try {
        console.log("in",process.env.APP_MONGO_URL)
        const conn = await mongoose.connect(process.env.APP_MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
    }