const express = require("express");
const app = express();
const request = require("supertest");
const authRoutes = require("../routes/authRoutes");
const issueRoutes = require("../routes/issueRoutes");
const cookieParser = require("cookie-parser");
const errorHandler = require("../middleware/errorHandler");
const passport = require("passport");
const issueDB = require("../models/prismaClient");

// Middleware setup
require("../config/passportConfig")(passport);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRoutes);
app.use("/projects/:projectId", issueRoutes);
app.use(errorHandler);

// mocks
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

jest.mock("../models/project", () => ({
  getProjectForUser: jest.fn().mockResolvedValue({
    id: "test-project-id",
    title: "Test Project",
    projectUser: [
      { userId: "test-user-id", role: "ADMIN" },
      { userId: "another-user-id", role: "DEVELOPER" },
    ],
  }),
}));

jest.mock("../models/issue", () => ({
  createNewIssue: jest.fn().mockResolvedValue({
    id: "test-issue-id",
    title: "Test Issue",
    description: "Test description",
    priority: "HIGH",
  }),
  getAllIssues: jest.fn().mockResolvedValue([
    { id: "test-issue-1", title: "Issue 1" },
    { id: "test-issue-2", title: "Issue 2" },
  ]),
  getSingleIssue: jest.fn().mockResolvedValue({
    id: "test-issue-id",
    title: "Test Issue",
    description: "Test description",
  }),
  updateSingleIssue: jest.fn().mockResolvedValue({
    id: "test-issue-id",
    title: "Updated Issue",
    description: "Updated description",
    priority: "MEDIUM",
  }),
  deleteSingleIssue: jest.fn().mockResolvedValue({
    id: "test-issue-id",
    title: "Test Issue",
  }),
}));

test("creating an issue works", (done) => {
  request(app)
    .post("/projects/test-project-id/tickets")
    .send({
      title: "Test Issue",
      description: "Test description",
      priority: "HIGH",
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.success).toBe(true);
      expect(res.body.issueCreated.title).toBe("Test Issue");
    })
    .end(done);
});

test("getting all issues works", (done) => {
  request(app)
    .get("/projects/test-project-id/tickets")
    .expect(200)
    .expect((res) => {
      expect(res.body.success).toBe(true);
      expect(res.body.issues.length).toBe(2);
      expect(res.body.issues[0].title).toBe("Issue 1");
    })
    .end(done);
});

test("getting a specific issue works", (done) => {
  request(app)
    .get("/projects/test-project-id/tickets/test-issue-id")
    .expect(200)
    .expect((res) => {
      expect(res.body.success).toBe(true);
      expect(res.body.issue.title).toBe("Test Issue");
    })
    .end(done);
});

test("updating an issue works", (done) => {
  request(app)
    .put("/projects/test-project-id/tickets/test-issue-id")
    .send({
      title: "Updated Issue",
      description: "Updated description",
      priority: "MEDIUM",
      status: "OPEN",
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.success).toBe(true);
      expect(res.body.updatedIssue.title).toBe("Updated Issue");
    })
    .end(done);
});

test("deleting an issue works", (done) => {
  request(app)
    .delete("/projects/test-project-id/tickets/test-issue-id")
    .expect(200)
    .expect((res) => {
      expect(res.body.success).toBe(true);
      expect(res.body.deletedIssue.title).toBe("Test Issue");
    })
    .end(done);
});

test("deleting an issue without the right role doesn't work", (done) => {

})

test("updating an issue without the right role doesn't work", (done) => {
    
})
