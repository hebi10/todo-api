import express from "express";
import mongoose from 'mongoose';
import Task from './models/Task.js';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'https://my-todo.com'],
};

app.use(cors(corsOptions));
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else if (e.name === "CastError" && e.kind === "ObjectId") {
        res.status(404).send({ message: "Cannot find given id." });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.get('/tasks', async (req, res) => {
  const sort = req.query.sort;
  const count = Number(req.query.count) || 0;

  // 오타 수정: createAp -> createdAt
  const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc' };
  const tasks = await Task.find().sort(sortOption).limit(count);

  res.send(tasks);
});

app.get('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);

  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
}));

app.post('/tasks', asyncHandler(async (req, res) => {
  const newTask = await Task.create(req.body);
  res.status(201).send(newTask);
}));

app.patch('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);

  if (task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    await task.save();
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
}));

app.delete('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findByIdAndDelete(id);

  if (task) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
}));

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
