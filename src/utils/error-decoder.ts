export function errorDecoder(
  error: unknown,
  message = "Unknown error occured",
) {
  return error instanceof Error ? error.message : message;
}
