const express = require('express');
const cors = require('cors')
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');
const { logger } = require('./middleware');

const server = express();
server.use(express.json())
server.use(cors());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});


server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

//custom middleware
// middleware.js file

module.exports = server;
