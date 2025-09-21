const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// in-memory users store (exported so general.js can read)
let users = [];

/* returns boolean: true if username is valid for registration (i.e. not already taken) */
const isValid = (username) => {
  if (!username) return false;
  return !users.some(u => u.username === username);
}

/* returns boolean: true if username/password match a registered user */
const authenticatedUser = (username, password) => {
  if (!username || !password) return false;
  return users.some(u => u.username === username && u.password === password);
}

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // create JWT (secret 'access' as used in middleware)
  const accessToken = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });

  // store token and username in session
  req.session.authorization = {
    accessToken: accessToken,
    username: username
  };

  return res.status(200).json({ message: "User successfully logged in", accessToken: accessToken });
});

// Add or modify a book review
// route path is /customer/auth/review/:isbn because router is mounted at /customer and path is '/auth/review/:isbn'
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    // username is set by auth middleware as req.username
    const username = req.username || (req.session && req.session.authorization && req.session.authorization.username);
    if (!username) return res.status(401).json({ message: "Not logged in" });

    const reviewText = req.query.review || (req.body && req.body.review);
    if (!reviewText) {
      return res.status(400).json({ message: "Review text is required (use ?review= or JSON body {review})" });
    }

    const book = books[isbn];
    if (!book) return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });

    if (!book.reviews) book.reviews = {};
    const isUpdate = !!book.reviews[username];
    book.reviews[username] = reviewText;

    return res.status(200).json({
      message: isUpdate ? "Review updated successfully" : "Review added successfully",
      reviews: book.reviews
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
