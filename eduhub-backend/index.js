import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import morgan from 'morgan';


const app = express();
const PORT = 3000;


app.use(morgan("tiny"));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL).then(() => console.log("MongoDB Connected")).catch((err) => console.log(err));



app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});