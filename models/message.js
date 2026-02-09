// models/message.js
const pool = require("../config/db");

async function createMessage(userId, content) {
  const result = await pool.query(
    "INSERT INTO messages (user_id, content) VALUES ($1, $2) RETURNING *",
    [userId, content],
  );
  return result.rows[0];
}

async function getMessages() {
  const result = await pool.query(
    `SELECT messages.id, messages.content, messages.created_at, signed_up.username 
     FROM messages 
     JOIN signed_up ON messages.user_id = signed_up.id
     ORDER BY messages.created_at DESC`,
  );
  return result.rows;
}

async function deleteMessageById(id) {
  return pool.query("DELETE FROM messages WHERE id = $1", [id]);
}

module.exports = { createMessage, getMessages, deleteMessageById };
