import chalk from "chalk";
import cookieParser from "cookie-parser";
import "dotenv/config"
import express from "express";
import morgan from "morgan";
import connectToDb from "./config/connectDb.js";
import mongoSanitize from "express-mongo-sanitize";
import { errorHandler,notFound } from "./middleware/errorMiddleware.js";
import authRoutes from './routes/authRoutes.js'

await connectToDb();

const app = express()

if(process.env.NODE_ENV !== 'production'){
    app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cookieParser());
app.use(mongoSanitize())


app.use('/api/v1/auth',authRoutes);

app.get('/api/v1/test', (req, res) =>{
    res.send({data:"Welcome to invoice app"})
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(
        `${chalk.green.bold('✔')} 👍 Server running in ${chalk.yellow.bold(process.env.NODE_ENV)} mode on port ${chalk.blue.bold(process.env.PORT)}`
    )
})