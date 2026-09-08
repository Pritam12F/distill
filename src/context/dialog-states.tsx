import { createContext, useContext, useState } from "react";

export type DialogStatesStoreType = {
  [key: string]: boolean | null | undefined;
};

export const DialogContext = createContext<
  | {
      state: DialogStatesStoreType;
      stateChangeHandler: (value: DialogStatesStoreType) => void;
    }
  | undefined
>(undefined);

export const DialogContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dialogState, setDialogState] = useState<DialogStatesStoreType>({});

  return (
    <DialogContext.Provider
      value={{ state: dialogState, stateChangeHandler: setDialogState }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialogContextProvider = () => {
  const dialogStates = useContext(DialogContext);

  if (dialogStates === undefined) {
    throw new Error(
      "Wrap with <DialogContextProvider/> first before using useDialogContextProvider",
    );
  }

  return {
    states: dialogStates.state,
    stateChangeHandler: dialogStates.stateChangeHandler,
  };
};
