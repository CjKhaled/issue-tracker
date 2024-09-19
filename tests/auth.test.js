const express = require("express");
const app = express();
const request = require("supertest");
const authRoutes = require("../routes/authRoutes");
const projectRoutes = require("../routes/projectRoutes");
const cookieParser = require("cookie-parser");
const userDB = require("../models/user");
const errorHandler = require("../middleware/errorHandler");
const authUtils = require("../config/authUtils");
const passport = require("passport");

// Middleware setup
require("../config/passportConfig")(passport);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRoutes);
app.use("/", projectRoutes);
app.use(errorHandler);

// Mocking database operations
jest.mock("../models/user", () => ({
  createNewUser: jest.fn().mockResolvedValue({
    id: 1,
    firstName: "Test",
    lastName: "User",
    email: "test@gmail.com",
    password: "hashedPassword",
  }),
  findUserByEmail: jest.fn().mockResolvedValue({
    id: 1,
    firstName: "Test",
    lastName: "User",
    email: "test@gmail.com",
    password: "hashedPassword",
  }),
}));

// Mocking authentication utilities
jest.mock("../config/authUtils", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashedPassword"),
  issueJWT: jest
    .fn()
    .mockReturnValue({ token: "testToken", expiresIn: 8 * 60 * 60 * 1000 }),
  compareHashes: jest.fn().mockResolvedValue(true),
}));

jest
  .spyOn(passport, "authenticate")
  .mockImplementation((strategy, options, callback) => {
    return (req, res, next) => {
      // Simulate successful authentication
      req.user = {
        id: "test-user-id",
        email: "test@example.com",
      };
      next();
    };
  });

test("signup functionality works", (done) => {
  request(app)
    .post("/signup")
    .send({
      firstName: "Test",
      lastName: "User",
      email: "test@gmail.com",
      password: "password123",
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      // Check response content
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe("test@gmail.com");
      expect(res.body.message).toBe("User created. Auto login...");

      // Check if JWT cookie is set
      expect(res.headers["set-cookie"]).toBeDefined();
    })
    .end(done);
});

test("login functionality works", (done) => {
  request(app)
    .post("/login")
    .send({ email: "test@gmail.com", password: "password123" })
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      // Check response content
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe("test@gmail.com");
      expect(res.body.message).toBe("You've successfully logged in!");

      // Check if JWT cookie is set
      expect(res.headers["set-cookie"]).toBeDefined();
    })
    .end(done);
});

test("logout functionality works", (done) => {
  request(app)
    .get("/logout")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body.message).toBe("You have logged out.");
    })
    .end(done);
});

test("failing login due to incorrect email", (done) => {
  userDB.findUserByEmail.mockResolvedValue(null); // Mock no user found

  request(app)
    .post("/login")
    .send({ email: "wrong@gmail.com", password: "password123" })
    .expect("Content-Type", /json/)
    .expect(401)
    .expect((res) => {
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Incorrect email.");
    })
    .end(done);
});

test("failing login due to incorrect password", (done) => {
  userDB.findUserByEmail.mockResolvedValue({
    id: 1,
    firstName: "Test",
    lastName: "User",
    email: "test@gmail.com",
    password: "hashedPassword",
  }); // mock found user
  authUtils.compareHashes.mockResolvedValue(false); // Mock password mismatch

  request(app)
    .post("/login")
    .send({ email: "test@gmail.com", password: "wrongPassword" })
    .expect("Content-Type", /json/)
    .expect(401)
    .expect((res) => {
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Incorrect password.");
    })
    .end(done);
});
