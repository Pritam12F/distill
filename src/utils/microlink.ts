import { errorDecoder } from "@/utils/error-decoder";
import createClient from "microlink.io";
import { Metadata } from "next";

const microlink = createClient();

export const getMetadata = async (
  url: string,
): Promise<{ error?: string; data?: Metadata }> => {
  try {
    new URL(url);
  } catch {
    return {
      error: "Invalid url",
    };
  }
  try {
    const metadata = await microlink.metadata(url);

    return {
      data: metadata,
    };
  } catch (err) {
    return {
      error: errorDecoder(err),
    };
  }
};
