const Book = require("../models/Book");
const Favorite = require("../models/Favorite");
const { validationResult } = require("express-validator");

const bookController = {
  async getAllBooks(req, res) {
    try {
      const { q, page = 1, limit = 10 } = req.query;
      if (q && q.length > 0) {
        const books = await Book.search(q, { page, limit });
        return res.json({
          success: true,
          data: books,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: books.length,
          },
        });
      }
      const books = await Book.findAll({ page, limit });

      res.json({
        success: true,
        data: books,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: books.length,
        },
      });
    } catch (error) {
      console.error("Get all books error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          error: "Book not found",
        });
      }

      res.json({
        success: true,
        data: book,
      });
    } catch (error) {
      console.error("Get book by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  async searchBooks(req, res) {
    try {
      const { q, page = 1, limit = 10 } = req.query;
      console.log(q);
      if (!q) {
        return res.status(400).json({
          success: false,
          error: "Search query is required",
        });
      }

      const books = await Book.search(q, { page, limit });

      res.json({
        success: true,
        data: books,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: books.length,
        },
      });
    } catch (error) {
      console.error("Search books error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  async createBook(req, res) {
    try {
      const { title, description } = req.body;
      const uploaded_by = req.user.id;

      // Handle file upload
      const image_url = req.file ? `/uploads/${req.file.filename}` : null;

      const book = await Book.create({
        title,
        description,
        image_url,
        uploaded_by,
      });

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error) {
      console.error("Create book error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      // Check if book exists
      const existingBook = await Book.findById(id);
      if (!existingBook) {
        return res.status(404).json({
          success: false,
          error: "Book not found",
        });
      }

      // Handle file upload
      const image_url = req.file
        ? `/uploads/${req.file.filename}`
        : existingBook.image_url;

      const updatedBook = await Book.update(id, {
        title,
        description,
        image_url,
      });

      res.json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } catch (error) {
      console.error("Update book error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  async deleteBook(req, res) {
    try {
      const { id } = req.params;

      // Check if book exists
      const existingBook = await Book.findById(id);
      if (!existingBook) {
        return res.status(404).json({
          success: false,
          error: "Book not found",
        });
      }

      await Book.delete(id);

      res.json({
        success: true,
        message: "Book deleted successfully",
      });
    } catch (error) {
      console.error("Delete book error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  async addToFavorites(req, res) {
    try {
      const { id: book_id } = req.params;
      const user_id = req.user.id;

      const favorite = await Favorite.add(user_id, book_id);

      res.json({
        success: true,
        message: "Book added to favorites",
        data: favorite,
      });
    } catch (error) {
      console.error("Add to favorites error:", error);
      if (error.message === "Book already in favorites") {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  async removeFromFavorites(req, res) {
    try {
      const { id: book_id } = req.params;
      const user_id = req.user.id;

      await Favorite.remove(user_id, book_id);

      res.json({
        success: true,
        message: "Book removed from favorites",
      });
    } catch (error) {
      console.error("Remove from favorites error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  async getBookFavorites(req, res) {
    try {
      const { id: book_id } = req.params;
      const favorites = await Favorite.getByBookId(book_id);

      res.json({
        success: true,
        data: favorites,
      });
    } catch (error) {
      console.error("Get book favorites error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
};

module.exports = bookController;
