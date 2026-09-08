import { createContext, useContext, useState } from "react";

export type DialogStatesStoreType = {
  [key: string]: boolean | null | undefined;
};

export const DialogContext = createContext<
  | {
      state: DialogStatesStoreType;
      stateChangeHandler: ({ id, state }: DialogType) => void;
    }
  | undefined
>(undefined);

export type DialogType = {
  id: string;
  state?: boolean | null;
};

export const DialogContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dialogState, setDialogState] = useState<DialogStatesStoreType>({});

  const handleStateChange = ({ id, state }: DialogType) => {
    setDialogState((s) => {
      if (!(Object.hasOwn(s, id) && s[id] === state)) {
        const newState = { ...s, [id]: state } as DialogStatesStoreType;

        return newState;
      }

      return s;
    });
  };

  return (
    <DialogContext.Provider
      value={{ state: dialogState, stateChangeHandler: handleStateChange }}
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
