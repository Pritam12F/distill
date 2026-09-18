import "dotenv/config";

module.exports = {
  apps: [
    {
      name: "distill",
      script: "pnpm",
      args: "start",
      cwd: "./", // Path to your project directory
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0", // Essential if proxying via Nginx
      },
    },
  ],
};
