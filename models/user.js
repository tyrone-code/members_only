// models/user.js
const pool = require("../config/db"); // your DB pool

const User = {
  async findByUsernameOrEmail(username, email) {
    const result = await pool.query(
      `SELECT * FROM signed_up
     WHERE username = $1 OR email = $2`,
      [username, email],
    );
    return result.rows[0];
  },
  async create({ username, email, password }) {
    const result = await pool.query(
      `INSERT INTO signed_up (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, password],
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      "SELECT id, username, email FROM signed_up WHERE id = $1",
      [id],
    );
    return result.rows[0];
  },
  // async findByLogin(login) {
  //   const result = await pool.query(
  //     `
  //     SELECT id, username, email, password
  //     FROM signed_up
  //     WHERE email = $1 OR username = $1
  //     `,
  //     [login],
  //   );
  //   return result.rows[0]; // undefined if not found
  // },
};

module.exports = User;
