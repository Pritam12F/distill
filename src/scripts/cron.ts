import cron from "node-cron";
import { pipeline } from "../pipeline";
import { errorDecoder } from "@/utils/error-decoder";

let running = false;

cron.schedule(
  "0 2 * * *",
  async () => {
    if (!running) {
      running = true;

      try {
        const started = new Date().getTime();
        await pipeline();
        const ended = new Date().getTime();
        const durationInMs = new Date(ended - started).getTime();

        const minutes = Math.floor(durationInMs / (1000 * 60));
        const seconds = Math.floor((durationInMs % (1000 * 60)) / 1000);

        console.log(
          `Pipeline finished running ${minutes} minutes and ${seconds} seconds`,
        );
      } catch (err) {
        console.error(errorDecoder(err));
      } finally {
        running = false;
      }

      return;
    }

    console.log("Previous task still running");
  },
  { timezone: "UTC" },
);
