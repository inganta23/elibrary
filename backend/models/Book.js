const db = require("../config/database");

class Book {
  static async findAll({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const result = await db.query(
      `SELECT b.*, u.email as uploaded_by_email 
       FROM books b 
       LEFT JOIN users u ON b.uploaded_by = u.id 
       ORDER BY b.created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT b.*, u.email as uploaded_by_email 
       FROM books b 
       LEFT JOIN users u ON b.uploaded_by = u.id 
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async search(query, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    console.log(query);
    const result = await db.query(
      `SELECT b.*, u.email as uploaded_by_email 
       FROM books b 
       LEFT JOIN users u ON b.uploaded_by = u.id 
       WHERE b.title ILIKE $1 OR b.description ILIKE $1 
       ORDER BY b.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [`%${query}%`, limit, offset]
    );

    return result.rows;
  }

  static async create(bookData) {
    const { title, description, image_url, uploaded_by } = bookData;

    const result = await db.query(
      `INSERT INTO books (title, description, image_url, uploaded_by) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [title, description, image_url, uploaded_by]
    );

    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);

    const result = await db.query(
      `UPDATE books 
       SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} 
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      "DELETE FROM books WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Book;
