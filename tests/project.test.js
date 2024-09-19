const express = require("express");
const app = express();
const request = require("supertest");
const authRoutes = require("../routes/authRoutes");
const projectRoutes = require("../routes/projectRoutes");
const cookieParser = require("cookie-parser");
const errorHandler = require("../middleware/errorHandler");
const passport = require("passport");

// Middleware setup
require("../config/passportConfig")(passport);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRoutes);
app.use("/", projectRoutes);
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

jest.mock("../models/user", () => ({
  findUserByEmail: jest.fn().mockResolvedValue({
    id: "test-user-id",
    email: "test@example.com",
  }),
}));

jest.mock("../models/project", () => ({
  createANewProject: jest.fn().mockResolvedValue({
    id: "test-project-id",
    title: "Test Project",
  }),
  getProjectsForUser: jest.fn().mockResolvedValue([
    { id: "test-project-1", title: "Project 1" },
    { id: "test-project-2", title: "Project 2" },
  ]),
  getProjectForUser: jest.fn().mockResolvedValue({
    id: "test-project-id",
    title: "Test Project",
    projectUser: [
      { userId: "test-user-id", role: "ADMIN" },
      { userId: "another-user-id", role: "DEVELOPER" },
    ],
  }),
  findUserByEmail: jest.fn().mockResolvedValue({
    id: "test-user-id",
    email: "test@example.com",
  }),
  findExistingProjectUser: jest.fn().mockResolvedValue(null),
  addUserToProject: jest.fn().mockResolvedValue({
    id: "test-project-user-id",
    userId: "test-user-id",
    projectId: "test-project-id",
    role: "DEVELOPER",
  }),
}));

jest.mock("../config/authUtils", () => ({
  issueInviteJWT: jest.fn(() => ({
    token: "test-invite-token",
    expiresIn: "1h",
  })),
  verifyJWT: jest.fn(() => ({
    subProject: "test-project-id",
    subUser: "test-user-id",
    role: "DEVELOPER",
  })),
}));

test("creating a project works", (done) => {
  request(app)
    .post("/projects")
    .send({ title: "Test Project" })
    .expect(200)
    .expect((res) => {
      expect(res.body.success).toBe(true);
      expect(res.body.projectCreated.title).toBe("Test Project");
    })
    .end(done);
});

test("getting projects works", (done) => {
  request(app)
    .get("/projects")
    .expect(200)
    .expect((res) => {
      expect(res.body.success).toBe(true);
      expect(res.body.projects).toHaveLength(2);
      expect(res.body.projects[0].title).toBe("Project 1");
    })
    .end(done);
});

test("getting a single project works", (done) => {
  request(app)
    .get("/projects/test-project-id")
    .expect(200)
    .expect((res) => {
      expect(res.body.success).toBe(true);
      expect(res.body.project.title).toBe("Test Project");
    })
    .end(done);
});

test("inviting a user works", (done) => {
  request(app)
    .post("/projects/test-project-id/invite-user")
    .send({
      email: "invitee@example.com",
      role: "DEVELOPER",
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.success).toBe(true);
      expect(res.body.inviteLink).toContain("projects/join-project/");
    })
    .end(done);
});

test("a user joining from an invite link works", (done) => {
  request(app)
    .post("/projects/join-project/test-token")
    .expect(200)
    .expect((res) => {
      expect(res.body.success).toBe(true);
      expect(res.body.projectUser.role).toBe("DEVELOPER");
    })
    .end(done);
});

test("inviting without the right role doesn't work", (done) => {
    jest.spyOn(require("../models/project"), "getProjectForUser").mockResolvedValueOnce({
      id: "test-project-id",
      title: "Test Project",
      projectUser: [
        { userId: "test-user-id", role: "DEVELOPER" }, 
      ],
    });
  
    request(app)
      .post("/projects/test-project-id/invite-user")
      .send({
        email: "invitee@example.com",
        role: "DEVELOPER",
      })
      .expect(403)
      .expect((res) => {
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("You are not authorized to perform this action.");
      })
      .end(done);
  });
