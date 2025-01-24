module.exports = {
  apps: [
    {
      name: "root-app",
      script: "./root.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      max_restarts: 10,
    },
    {
      name: "server-app",
      script: "./root.js", // Ensure this points to the correct file if needed
      watch: false,
      autorestart: true,
    },
  ],
};
