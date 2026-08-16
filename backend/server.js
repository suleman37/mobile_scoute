import express from 'express';
import cors from 'cors';
import "dotenv/config";
import ConnectDB from './config/mongo.js';
import  mobileRoute from './routes/phoneRoute.js';
import { startCatalogRefreshSchedule } from './services/catalogRefresh.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static('public'));

app.use('/api', mobileRoute);
 
const startServer = async () => {
  try {
    await ConnectDB();
    app.listen(port, () => {
      console.log(`Server is Running on port ${port}`);
      startCatalogRefreshSchedule();
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();
