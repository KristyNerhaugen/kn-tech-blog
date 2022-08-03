const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");

// get all route
router.get("/", (req, res) => {
  console.log("=========================");
  Post.findAll({
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
      // must be loggedin for posts to render
      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one (by id) route
router.get("posts/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
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
      if (!dbPostData) {
        res.status(404).json({ message: "No post found." });
        return;
      }

      const post = dbPostData.get({ plain: true });

      res.render("single-post", {
        post,
        // only rendering if session confirms user is logged in
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// login route--if not logged in, prompt user to login
router.get("/login", (req, res) => {
  //accessing session information to verify login by checking for a session
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

module.exports = router;
