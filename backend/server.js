import express from 'express';
import cors from 'cors';
import "dotenv/config";
import ConnectDB from './config/mongo.js';
import  mobileRoute from './routes/phoneRoute.js';

const app = express();
const port = process.env.PORT || 5000;

ConnectDB();

app.use(cors());
app.use(express.json());

app.use('/api', mobileRoute);
 
app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});