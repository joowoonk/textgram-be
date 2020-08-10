const router = require("express").Router();
const jwt_decode = require("jwt-decode");

const Comments = require("./comments-router");

// GET comment by ID //

router.get("/id", (req, res) => {
  const id = req.params.id;

  Comments.getCommentById(id)
    .then((comment) => {
      res.status(200).json({ comment });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// GET comment by Post_id //

router.get("/id", (req, res) => {
  const id = req.params.id;

  Comments.getCommentsByPostId(id)
    .then((comments) => {
      res.status(200).json({ comments });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// GET comment by User_id //

router.get("/id", (req, res) => {
  const id = req.params.id;

  Comments.getCommentsByUserId(id)
    .then((comments) => {
      res.status(200).json({ comments });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});