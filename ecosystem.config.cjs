module.exports = {
  apps: [
    {
      name: "distill",
      script: "./.next/standalone/server.js", // Targets the native node server directly
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
