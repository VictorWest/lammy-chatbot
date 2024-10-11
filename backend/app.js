import express from 'express'
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
dotenv.config();

const app = express()
const port = 3000

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log(req.body);
  res.status(200).json({message: 'success' });
})

app.post('/', (req, res) => {
  const message = req.body.transcript;
  const run = async () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  
    async function run() {
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        res.json({message: text})
        console.log("response: " + text);
      }
    run();
  }
  run()
})
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})