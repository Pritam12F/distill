export function errorDecoder(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error occured";
}
