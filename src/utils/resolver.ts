export const promiseResolver = <T>(promises: PromiseSettledResult<T>[]) => {
  return promises
    .filter(
      (promise): promise is PromiseFulfilledResult<T> =>
        promise.status === "fulfilled",
    )
    .map((promise) => promise.value)
    .filter((value): value is NonNullable<T> => value != null);
};
