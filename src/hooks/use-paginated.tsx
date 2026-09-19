// "use client";

// import { PaginatedContext } from "@/context/paginated-digests";
// import { useContext } from "react";

// export function usePaginated() {
//   const data = useContext(PaginatedContext);

//   if (data === undefined) {
//     throw new Error(
//       "usePaginated should be used inside <PaginatedContextProvider>",
//     );
//   }

//   return {
//     groups: data.groups,
//     setStart: data.setStart,
//     setEnd: data.setEnd,
//     startDay: data.startDay,
//     endDay: data.endDay,
//     error: data.error,
//     setError: data.setError,
//     isLoading: data.loading,
//     setIsLoading: data.setLoading,
//     initialLoad: data.initialLoad,
//     setInitialLoad: data.setInitialLoad,
//     loadedGroups: data.loadedGroups,
//     setLoadedGroups: data.setLoadedGroups,
//   };
// }
