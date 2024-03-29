import chalk from "chalk";
import mongoose from "mongoose";

const connectToDb = async()=>{
    try {
        const connectionParams={
            dbName:process.env.DB_NAME
        };
        const connect = await mongoose.connect(
            process.env.MONGO_URI,
            connectionParams
        );
        console.log(`${chalk.blue.bold(`MongoDB Connected: ${connect.connection.host}`)}`)
    } catch (error) {
        console.error(`${chalk.red.bold(`Error: ${error}`)}`)
        process.exit(1);
    }
}

export default connectToDb;