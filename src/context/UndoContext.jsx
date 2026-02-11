import { createContext, useState } from "react";

export const UndoContext = createContext();

export const UndoProvider = ({ children }) => {
  const [undoData, setUndoData] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [timer, setTimer] = useState(null);

  const triggerUndo = (data, onUndo) => {
    setUndoData({ data, onUndo });
    setShowUndo(true);

    const t = setTimeout(() => {
      setShowUndo(false);
      setUndoData(null);
    }, 10000);

    setTimer(t);
  };

  const undo = () => {
    clearTimeout(timer);
    setShowUndo(false);
    setUndoData(null);
  };


  return (
    <UndoContext.Provider value={{ triggerUndo, undo, showUndo, undoData }}>
      {children}
    </UndoContext.Provider>
  );
};
