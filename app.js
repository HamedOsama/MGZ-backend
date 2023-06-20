const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('dotenv').config();
require('./models/db');
const userRouter = require('./routes/user');


const User = require('./models/user');
const ServerError = require('./utils/ErrorInterface');
const errorMiddleWare = require('./middlewares/error.middleware');

const app = express();


app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:3001' , 'http://localhost:19000']
}));

app.use(cookieParser())
app.use(express.json());
app.use(userRouter);

app.use('/api/v1', require('./routes/index'));

// const test = async (email, password) => {
//   const user = await User.findOne({ email: email });
//   const result = await user.comparePassword(password);
//   console.log(result);
// };

// test('niraj@email.com', 'niraj12');

app.get('/test', (req, res) => {
  res.send('Hello world');
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to backend zone!' });
});


app.use((req, res, next) => {
  next(ServerError.badRequest(404, 'page not found'))
})
app.use(errorMiddleWare);

app.listen(8000, () => {
  console.log('port is listening');
});
