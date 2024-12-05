const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./src/db/conndb');
const userRoutes = require('./src/route/userRoutes');
const app = express();

app.use(bodyParser.json());

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;

connectDB();

app.use('/users', userRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the user registration API');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});