const router = require('express').Router();
const { User, Post } = require('../../models');

// creating User 
router.post('/', (req, res) => {
User.create({
   username: req.body.username,
   password: req.body.password
 }) .then(dbUserData => {
    req.session.save(() => {
    req.session.user_id = dbUserData.id;
    req.session.username = dbUserData.username;
    req.session.loggedIn = true;
    res.json(dbUserData);
   });
 }).catch(err => {
   console.log(err);
    res.status(500).json(err);
    });
})
//finding one user
router.post('/login', (req, res) => {
User.findOne({
 where: {
    username: req.body.username
         }
 }).then(dbUserData => {
       if (!dbUserData) {
          res.status(400).json({
              message: 'No User!'
           });
     return;
 }
    req.session.save(() => {
    req.session.user_id = dbUserData.id;
    req.session.username = dbUserData.username;
    req.session.loggedIn = true;
       res.json({
        user: dbUserData,
        message: 'Logged in!'
         });
  });
  const validPassword = dbUserData.checkPassword(req.body.password)
     if (!validPassword) {
     res.status(400).json({
      message: 'Incorrect password!'
     });
     return;
     }
        req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
             res.json({
                user: dbUserData,
                 message: 'Logged in!'
                });
            });
        });
});
//  get specific user
router.get('/:id', (req, res) =>{
    user.findOne({
        attributes : {
            exclude: ["password"]
        },
        where : {
            id: req.params.id
        },
        include: [{
            model: Post,
            attributes : ['id', 'title', 'content', 'created_at'],
        },
        {
         model : Comment,
         attributes: ['id', 'comment_text', 'created_at'], 
            include: {
                model : Post,
                attributes: [ "title"]
            }
        }
    ]
}).then(dbUserData => {
    if (!dbUserData) {
        res.status(404).json({
            message: 'Nope'
        });
        return;
    }
    res.json(dbUserData);
})
.catch(err => {
    console.log(err);
    res.status(500).json(err);
});
});
//needs logout 
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// All Users
router.get('/', (req, res) => {
    User.findAll({
            attributes: {
                exclude: ['password']
            }
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
