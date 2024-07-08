import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import { UserController, PostController } from "./controllers/index.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

const MONGO_URL = 'mongodb+srv://stallev:wSzzG83Va7vvUg8h@cluster0.s9opxms.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected...'))
  .catch((error)=> console.error('it is a problem with connection', error));

const app = express();

const storage = multer.diskStorage({
  destination: ({}, _, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send(new Date())
})

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)

app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4444, (error) => {
  if(error) {
    console.error(error)
  }

  console.log("server OK")
})