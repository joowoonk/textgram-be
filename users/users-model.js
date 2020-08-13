const db = require("../database/db");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  addNewUser,
  getAllUsers,
  findBy,
  getUserById,
  getPostsByUserId,
  updateUser,
  deleteUser,
  getFollowedUsersByUserId,
  getFollowersByUserId,
};

function getAllUsers() {
  return db("users");
}

function getUserById(id) {
  return db("users").where({ id }).first();
}

function findBy(filter) {
  return db("users").where(filter);
}

function getPostsByUserId(id) {
  return db("posts").where({ user_id: id });
}

async function addNewUser(user) {
  const [id] = await db("users").insert(user, "id");

  return getUserById(id);
}

async function updateUser(id, changes) {
  await db("users").where({ id }).update(changes);

  return getUserById(id);
}

function deleteUser(id) {
  return db("users").where({ id }).del();
}

function getFollowedUsersByUserId(id) {
  return db("followers")
    .join("users", "followers.following_id", "users.id")
    .where("followers.follower_id", "=", id)
    .select(
      "followers.created_at",
      "users.id",
      "users.fake_id",
      "users.email",
      "users.profile_picture",
      "users.location"
    );
}

function getFollowersByUserId(id) {
  return db("followers")
    .join("users", "followers.follower_id", "users.id")
    .where("followers.following_id", "=", id)
    .select(
      "followers.created_at",
      "users.id",
      "users.fake_id",
      "users.email",
      "users.profile_picture",
      "users.location"
    );
}
