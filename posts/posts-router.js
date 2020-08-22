const router = require("express").Router();
const jwt_decode = require("jwt-decode");

const Posts = require("./posts-model");
const Comments = require("../comments/comments-model");
const restricted = require("../auth/restricted-middleware");

// --- api/posts

// GET all the posts

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.getAllPosts();
    // console.log({ posts });

    Promise.all(
      posts.map(async (post) => {
        const likes = await Posts.getVotingCountsByPostId(post.id);
        const comments = await Comments.getCommentsByPostId(post.id);
        console.log({ comments });
        post.likes = likes.count;
        post.comments = comments.length;
        // console.log({ post });
        return post;
      })
    )
      .then((posts) => {
        // console.log(posts);
        res.status(200).json({ posts });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Posts.getPostById(id);
    post.comments = await Comments.getCommentsByPostId(id);
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/search/:title", (req, res) => {
  const title = req.params.title;
  Posts.search(title)
    .then((searched) => {
      res.status(200).json(searched);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

router.post("/", restricted, (req, res) => {
  let post = req.body;
  const token = req.headers.authorization;
  const decoded = jwt_decode(token);
  post.user_id = decoded.subject;

  post.hashtags = post.hashtags.replace(",", "");
  post.hashtags = post.hashtags.replace("#", "");
  post.hashtags = post.hashtags.replace(
    /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.#@£\/]/g,
    ""
  );
  post.hashtags = post.hashtags
    .replace(/#/g, "")
    .replace(/([^" "]+)/g, "#" + "$1");
  post.hashtags = post.hashtags.split(" ");
  post.hashtags = post.hashtags.filter((hash) => {
    return hash != "";
  });
  console.log(post.hashtags);

  Posts.addNewPost(post)
    .then((newPost) => {
      res.status(201).json({ newPost });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
