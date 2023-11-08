const router = require('express').Router();
const { User, Post } = require('../../models');

// Create new user
router.post('/signup', async (req, res) => {
  try {
    const dbUserData = await User.create(req.body);
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.loggedIn = true;
      res.status(200).json(dbUserData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Login
router.post('/login', async (req, res) => {

    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData) {
      return res.status(400).json('Incorrect email or password, please try again');
    }
    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      return res.status(400).json('Incorrect email or password, please try again');
    }
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;
      res.status(200).json('You are now logged in!');
    });
  
});

// Update a post
router.put('/', async (req, res) => {});

// Delete a post
router.delete('/', async (req, res) => {});

// Create new post
router.post('/api/create', async (req, res) => {
  try{
    const postData = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });
    res.status(200).json(postData);
  }catch(err){
    res.status(400).json(err);
  }
});

// User Logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
