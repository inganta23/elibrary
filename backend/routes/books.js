const express = require("express");
const bookController = require("../controllers/bookController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Public routes
router.get("/", bookController.getAllBooks);
router.get("/search", bookController.searchBooks);
router.get("/:id", bookController.getBookById);

// Protected routes
router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  upload.single("image"),
  bookController.createBook
);
router.put(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  upload.single("image"),
  bookController.updateBook
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  bookController.deleteBook
);

// Favorites
router.get(
  "/:id/favorites",
  authenticateToken,
  bookController.getBookFavorites
);
router.post("/:id/favorite", authenticateToken, bookController.addToFavorites);
router.delete(
  "/:id/favorite",
  authenticateToken,
  bookController.removeFromFavorites
);

module.exports = router;
