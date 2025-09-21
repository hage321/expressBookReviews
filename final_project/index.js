const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// session for /customer routes
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Authentication middleware for protected routes under /customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
  try {
    // Check session object for stored authorization token
    if (!req.session || !req.session.authorization || !req.session.authorization.accessToken) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const token = req.session.authorization.accessToken;
    // verify token with the shared secret "access" (lab uses "access")
    jwt.verify(token, "access", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      // attach username to request so route handlers can use it
      req.username = decoded.username;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

const PORT = 5000;

// Mount routers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, "0.0.0.0", () => console.log(`Server is running on 0.0.0.0:${PORT}`));
