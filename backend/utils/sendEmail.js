import "dotenv/config"
import fs from "fs"
import handlebars from "handlebars"
import path from "path"
import { fileURLToPath } from "url"
import transporter from '../helpers/emailTransport.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = async(email,subject,payload,template)=>{
    try {
        const sourceDirectory = fs.readFileSync(
            path.join(__dirname,template),
            "utf8"
        )
        const compiledTemplate = handlebars.compile(sourceDirectory);
        const emailOption={
            from:process.env.SENDER_MAIL,
            to:email,
            subject:subject,
            html:compiledTemplate(payload)
        };
        await transporter.sendMail(emailOption);
    } catch (error) {
        console.log(`Email not sent : ${error}`)
    }
}

export default sendEmail;