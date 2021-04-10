const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// post routes
router.get("/", (req, res) => {
    Post.findAll({
    attributes: ["id", "content", "title"],
    order: [
       ["created_at", "DESC"]
    ],
    include: [{
     model: User,
     attributes: ["username"],
     },
       {
     model: Comment,
      attributes: ["id", "comment_text", "post_id", "user_id"],
          include: {
          model: User,
        attributes: ["username"],
        },
        },
    ],
}).then((dbPostData) => res.json(dbPostData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});
// create post
router.post("/", withAuth, (req, res) => {
    Post.create({
            title: req.body.title,
            content: req.body.post_content,
            user_id: req.session.user_id
    }).then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
   res.status(500).json(err);
        });
});
// delete post
router.delete("/:id", withAuth, (req, res) => {
   Post.destroy({
    where: {
    id: req.params.id,
    },
    }) .then((dbPostData) => {
    if (!dbPostData) {
    res.status(404).json({
    message: "Nothing found"
    });
    return;
    }
  res.json(dbPostData);
  }).catch((err) => {
     console.log(err);
    res.status(500).json(err);
   });
});
// edit/update post
router.put("/:id", withAuth, (req, res) => {
    Post.update({
     title: req.body.title,
     content: req.body.post_content,
  }, {
      where: {
         id: req.params.id,
        },
 }).then((dbPostData) => {
     if (!dbPostData) {
     res.status(404).json({
       message: "Nothing found"
     });
    return;
  }
   res.json(dbPostData);
    }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
    });
});

module.exports = router;