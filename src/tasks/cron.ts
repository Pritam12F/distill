import cron from "node-cron";
import { pipeline } from "../services/pipeline";

export async function scheduler() {
    cron.schedule("* 3 * * *", async () => {
    console.log("running a task every X");

    await pipeline();
  });
}

scheduler().then((r) => {
  console.log("CRON Job started");
}).catch((err) => {
  console.log("Error running cron job");
})
