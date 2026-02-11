import { useContext } from "react";
import { UndoContext } from "../context/UndoContext";
import { ExpenseContext } from "../context/ExpenseContext";

const UndoSnackbar = () => {
  const { showUndo, undo, undoData } = useContext(UndoContext);
  const { restoreExpense, restoreMultiple } = useContext(ExpenseContext);

  if (!showUndo) return null;

  const handleUndo = () => {
    if (!undoData) return;

    if (Array.isArray(undoData.data)) {
      restoreMultiple(undoData.data);
    } else {
      restoreExpense(undoData.data);
    }

    undo();
  };

  return (
    <div className="undo-bar">
      <span>Deleted – You can undo within 10 seconds</span>
      <button onClick={handleUndo}>Undo</button>
    </div>
  );
};

export default UndoSnackbar;
