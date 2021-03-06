const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const sequelize = require('../config/connection');

router.get('/', (req, res) => {
  Post.findAll({
   attributes: [ 'id','title', 'content' ],
   include: [{
    model: Comment,
   attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
    include: {
    model: User,
    attributes: ['username']}
    },
   {
    model: User,
    attributes: ['username']
    }
  ]
}).then(dbPostData => {
    if (!dbPostData) {
   res.status(404).json({
     message: "No Posts Available"
    });
       return;
  }
const posts = dbPostData.map(post => post.get({
     plain: true
  }));
res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn
    });
}).catch(err => {
  console.log(err);
  res.status(500).json(err);
    });
});

router.get('/post/:id', (req, res) => {
  Post.findOne({
    where : {
      id : req.params.id
    },
    attributes: [ "id", "title", "content", 'created_at'],
    include: [{
      model: Comment,
      attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
      include: {
          model: User,
          attributes: ['username']
      }
    },
  {
      model: User,
      attributes: ['username']
  }
]
}).then((dbPostData) => {      
  if (!dbPostData) {
      res.status(404).json({
          message: "No Posts Available"
      });
      return;
  }
  const post = dbPostData.get({
      plain: true
  }); 
  res.render("userpost", {
      post,
      loggedIn: req.session.loggedIn,
  });
})
.catch((err) => {
  res.status(500).json(err);
});

//signing up
router.get('/sign-up', (req, res) => {
  if (req.session.loggedIn) {
      res.redirect('/');
      return;
  }
  res.render('sign-up');
});

//login 
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
      res.redirect('/');
      return;
  }
  res.render('login');
});
});
module.exports = router;