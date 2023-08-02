import chalk from "chalk";
import cookieParser from "cookie-parser";
import "dotenv/config"
import express from "express";
import morgan from "morgan";

const app = express()

if(process.env.NODE_ENV !== 'production'){
    app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cookieParser());

app.get('/api/v1/test', (req, res) =>{
    res.send({data:"Welcome to invoice app"})
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(
        `${chalk.green.bold('✔')} 👍 Server running in ${chalk.yellow.bold(process.env.NODE_ENV)} mode on port ${chalk.blue.bold(process.env.PORT)}`
    )
})