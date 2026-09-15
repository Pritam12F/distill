import crypto from "crypto";

export const hashUrl = (u: string) =>
  crypto.createHash("sha256").update(u).digest("hex");
