const express = require('express');

const userDb = require('./userDb');
const postDb = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  
  userDb.insert(req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {console.log(err); res.status(500).json({ error: "Error adding a new user"})})
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  postDb.insert({user_id: req.params.id, text: req.body.text})
    .then(newPost => res.status(200).json(newPost))
    .catch(err => {console.log(err); res.status(500).json({ error: "a generic error message"})})
});

router.get('/', (req, res) => {
  // do your magic!
  userDb.get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({error: "Error retrieving users."}))
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  userDb.getById(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({ error: "User could not be found."}))
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
  userDb.getUserPosts(req.params.id)
    .then(userPosts => {
      if(!userPosts){
        res.status(404).json({ message: 'That post does not exist.'})
        return null
      }
      res.status(200).json(userPosts)
    })
    .catch(err => res.status(500).json({ error: "There was an error looking for posts."}))
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  userDb.remove(req.params.id)
    .then(user => {
      res.status(204).json(user);
    })
    .catch(err => res.status(500).json({ error: "The user could not be removed."}))
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  userDb.update(req.params.id, req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({ error: "The user information could not be modified"}))
});

//custom middleware

function validateUserId(req, res, next) {
  const userId = req.params.id

  if(userId){
    req.user = userId;
    userDb.getById(req.params.id)
      .then(user => {
        if(!user){
          res.status(400).json({ message: "The user has been lost on the trail."})
        }else{
          next();
        }
      })
      .catch(err =>  res.status(500).json({ error: "Uh oh, there was a problem looking for that user."}));
  } else {
      res.status(400).json({message: "invalid user id"});
  }
}

function validateUser(req, res, next) {
  // do your magic!
  if(!req.body || !req.body.name) {
    res.status(400).json({ message: "Please provide a name for the new user."});
  }else{
    next();
  }  
}

function validatePost(req, res, next) {
  if(req.body && !req.body.text){
      res.status(400).json({message: "missing required text field"})
  }else if(!req.body){
      res.status(400).json({message: "missing post data"})
  }else{
      next();
  }
}

module.exports = router;
