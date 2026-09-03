import { manualPipeline } from "@/tasks/manual-pipeline";

manualPipeline().then((r) => {
  console.log("Manual pipeline was run successfully");
  process.exit(0);
})
.catch((err) => {
  console.error(err instanceof Error ? err.message : "Some error occured");
  process.exit(1);
})