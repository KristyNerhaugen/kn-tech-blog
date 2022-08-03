const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// get route to get all posts on dashboard
router.get("/", withAuth, (req, res) => {
  Post.findAll({
    // only finds the user's posts
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["id", "title", "postContent", "createdAt"],
    include: [
      {
        model: Comment,
        attributes: ["id", "commentText", "post_id", "user_id", "createdAt"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("dashboard", { posts, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
