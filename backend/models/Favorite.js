const db = require("../config/database");

class Favorite {
  static async add(user_id, book_id) {
    try {
      const result = await db.query(
        `INSERT INTO favorites (user_id, book_id) 
         VALUES ($1, $2) 
         RETURNING *`,
        [user_id, book_id]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505") {
        throw new Error("Book already in favorites");
      }
      throw error;
    }
  }

  static async remove(user_id, book_id) {
    const result = await db.query(
      "DELETE FROM favorites WHERE user_id = $1 AND book_id = $2 RETURNING id",
      [user_id, book_id]
    );
    return result.rows[0];
  }

  static async getByUserId(user_id, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const result = await db.query(
      `SELECT f.*, b.title, b.description, b.image_url 
       FROM favorites f 
       JOIN books b ON f.book_id = b.id 
       WHERE f.user_id = $1 
       ORDER BY f.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [user_id, limit, offset]
    );

    return result.rows;
  }

  static async getByBookId(book_id) {
    const result = await db.query(
      `SELECT f.*, u.email 
       FROM favorites f 
       JOIN users u ON f.user_id = u.id 
       WHERE f.book_id = $1 
       ORDER BY f.created_at DESC`,
      [book_id]
    );

    return result.rows;
  }

  static async isFavorite(user_id, book_id) {
    const result = await db.query(
      "SELECT 1 FROM favorites WHERE user_id = $1 AND book_id = $2",
      [user_id, book_id]
    );
    return result.rows.length > 0;
  }
}

module.exports = Favorite;
