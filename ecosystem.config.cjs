module.exports = {
  apps: [
    {
      name: "root-app",
      script: "./src/root.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      max_restarts: 10,
    },
  ],
};
