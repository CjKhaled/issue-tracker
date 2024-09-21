module.exports = {
  apps: [
    {
      name: "issue-tracker",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "development",
        ENV_VAR1: "environment-variable",
      },
    },
  ],
};
