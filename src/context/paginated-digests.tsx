// "use client";

// import {
//   AllDigestsPerTopicType,
//   getAllDigests,
// } from "@/actions/get-all-digests";
// import {
//   createContext,
//   Dispatch,
//   ReactNode,
//   SetStateAction,
//   useCallback,
//   useEffect,
//   useState,
// } from "react";

// export type GroupType = {
//   name: string;
//   digests: AllDigestsPerTopicType[];
// };

// export const PaginatedContext = createContext<
//   | {
//       groups: GroupType[];
//       setStart: Dispatch<SetStateAction<number>>;
//       setEnd: Dispatch<SetStateAction<number>>;
//       startDay: number;
//       endDay: number;
//       error?: string;
//       setError: Dispatch<SetStateAction<string>>;
//       loading: boolean;
//       setLoading: Dispatch<SetStateAction<boolean>>;
//       initialLoad: boolean;
//       setInitialLoad: Dispatch<SetStateAction<boolean>>;
//       loadedGroups: GroupType[];
//       setLoadedGroups: Dispatch<SetStateAction<GroupType[]>>;
//     }
//   | undefined
// >(undefined);

// export function PaginatedContextProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const [groups, setGroups] = useState<GroupType[]>([]);
//   const [startDay, setStartDay] = useState<number>(0);
//   const [endDay, setEndDay] = useState<number>(5);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [initialLoad, setInitialLoad] = useState(true);
//   const [loadedGroups, setLoadedGroups] = useState<GroupType[]>([]);

//   const fetchData = useCallback(async () => {
//     const { groups, success, error } = await getAllDigests(startDay, endDay);

//     if (success) {
//       setGroups(groups ?? []);
//     } else {
//       setError(error ?? "Unknown error");
//     }

//     setInitialLoad((s) => (s ? s! : s));
//   }, [setGroups, setLoading, setError, startDay, endDay]);

//   const fetchPaginatedData = useCallback(async () => {
//     const { groups, success, error } = await getAllDigests(startDay, endDay);

//     if (success) {
//       setLoadedGroups(groups ?? []);
//     } else {
//       setError(error ?? "Unknown error");
//     }
//   }, [setGroups, setLoading, setError, startDay, endDay]);

//   useEffect(() => {
//     if (startDay !== 0 || endDay !== 5) {
//       return;
//     }

//     if (Math.abs(startDay - endDay) !== 5) {
//       return;
//     }

//     setLoading(true);
//     fetchData();
//     setLoading(false);
//   }, [startDay, endDay, setLoading, fetchPaginatedData]);

//   useEffect(() => {
//     if (startDay === 0 || endDay === 5) {
//       return;
//     }

//     if (Math.abs(startDay - endDay) !== 5) {
//       return;
//     }

//     setLoading(true);
//     fetchPaginatedData();
//     setLoading(false);
//   }, [startDay, endDay, setLoading, fetchPaginatedData]);

//   return (
//     <PaginatedContext.Provider
//       value={{
//         error,
//         groups,
//         startDay,
//         endDay,
//         loading,
//         setStart: setStartDay,
//         setEnd: setEndDay,
//         setError,
//         setLoading,
//         initialLoad,
//         setInitialLoad,
//         loadedGroups,
//         setLoadedGroups,
//       }}
//     >
//       {children}
//     </PaginatedContext.Provider>
//   );
// }
