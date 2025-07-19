require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');
const teamRouter = require('./routes/teamRoutes');

const app = express();  

app.use(express.json());
app.use('/v1/users', userRouter);
app.use('/v1/tasks', taskRouter);
app.use('/v1/teams', teamRouter);

const { PORT, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Database connection established');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });



