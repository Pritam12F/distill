import cron from "node-cron";

cron.schedule("* 3 * * *", () => {
  console.log("running a task every minute");
});
