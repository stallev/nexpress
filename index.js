import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

const MONGO_URL = 'mongodb+srv://stallev:wSzzG83Va7vvUg8h@cluster0.s9opxms.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected...'))
  .catch((error)=> console.error('it is a problem with connection', error));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send(new Date())
})

app.post('/auth/login', loginValidation, UserController.login)

app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/auth/register', registerValidation, UserController.register);

app.get('/posts', PostController.getAll);
// app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
// app.delete('/posts', PostController.remove);
// app.patch('/posts', PostController.update);

app.listen(4444, (error) => {
  if(error) {
    console.error(error)
  }

  console.log("server OK")
})