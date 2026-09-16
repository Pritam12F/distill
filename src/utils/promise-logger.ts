export function promiseLogger<T>(
  promises: PromiseSettledResult<T>[],
  type: string,
) {
  promises.forEach((p, i) => {
    if (p.status === "rejected") {
      console.log(`Could not resolve ${type} promise. reason: ${p.reason}`);
    }
  });
}
