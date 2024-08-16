import express from "express";
import mongoose from 'mongoose';
import Task from './models/Task.js';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// 직접 연결 문자열을 사용하여 MongoDB에 연결
const DATABASE_URL = "mongodb+srv://asdlkj0104:FRIDyj4HUlfmVx35@todo-api.l0aepsl.mongodb.net/todo-api?retryWrites=true&w=majority";

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to DB'))
  .catch((error) => {
    console.error('DB connection error:', error.message);
    console.error('Stack trace:', error.stack);
  });

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
