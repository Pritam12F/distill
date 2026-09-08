// "use client";

// import { DigestPageProps } from "@/app/digest/[id]/page";
// import axios from "axios";
// import { createContext, useEffect, useState } from "react";

// const DigestContext = createContext<DigestPageProps | undefined>(undefined);

// export const DigestContextProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   return (
//     <DigestContext.Provider value={undefined}>
//       {children}
//     </DigestContext.Provider>
//   );
// };

// export const useDigestProvider = ({ digestId }: { digestId: string }) => {
//   const [digestDetails, setDigestDetails] = useState<
//     DigestPageProps | undefined
//   >(undefined);

//   useEffect(() => {
//     async function fetch() {
//       try {
//         const digestData = await axios.get(`/api/digests/${digestId}`);

//         setDigestDetails(digestData.data);
//         console.log("Digest details recovered successfully");
//       } catch (err) {
//         console.error(
//           err instanceof Error ? err.message : "Could not fetch digest",
//         );
//       }
//     }

//     fetch();
//   }, [digestId]);

//   if (DigestContext === undefined) {
//     throw new Error(
//       "useDigestProvider should be used inside DigestContextProvider",
//     );
//   }

//   return { digestDetails, setDigestDetails };
// };
