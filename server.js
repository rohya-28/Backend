import express from 'express';
import  mongoose  from 'mongoose';
import { APP_PORT,DB_URL } from './config';
import errorHandler from './middleware/errorhandlar';
const app = express();
import routes from './routes';
import path from 'path'

//Database connection
mongoose.connect(DB_URL, {useNewUrlParser:true, useUnifiedTopology:true,useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'))
db.once('open',() => {
    console.log('DB connected...')
});

  
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use('/api',routes);
app.use('/uploads',express.static('uploads'))


app.use(errorHandler);
app.listen(APP_PORT, ()=> console.log(`Listening on Port ${APP_PORT}`));