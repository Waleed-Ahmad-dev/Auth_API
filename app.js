import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import DatabaseURI from './config/index.js';
import Router from './routes/index.js';

const app = express();

app.use(cors());
app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
     .connect(DatabaseURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
     })
     .then(() => console.log('Connected to database'))
     .catch((err) => console.error(err));

Router(app);

app.listen(3000, () => console.log('Server is running on port 3000'));
