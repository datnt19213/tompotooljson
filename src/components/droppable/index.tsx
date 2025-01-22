// Droppable component
import { useDroppable } from "@dnd-kit/core";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setActiveId } from "../../store/DndSlice";

const Droppable = ({
  id,
  columns,
  rows,
  colspan,
  rowspan,
  gap,
  alignItems,
  justifyContent,
  type,
  style,
  children,
  className = "",
  thumbnail = "",
  dataSlice,
}: {
  id: string;
  columns: string;
  rows: string;
  colspan: string;
  rowspan: string;
  gap: string;
  alignItems: string;
  justifyContent: string;
  type: string;
  style?: React.CSSProperties;
  className?: string;
  children: ReactNode;
  thumbnail?: string;
  dataSlice?: {
    title?: string;
    url?: string;
  };
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      columns,
      rows,
      colspan,
      rowspan,
      type,
      gap,
      style,
      alignItems,
      justifyContent,
      thumbnail,
      dataSlice,
    },
  });

  const { activeData, activeId } = useSelector(
    (state: RootState) => state.dndSlice
  );
  const dispatch = useDispatch();

  return (
    <div
      ref={setNodeRef}
      onDragOver={(e) => e.preventDefault()}
      className={`${className} ${
        isOver ? "border-red-400" : "border-gray-400"
      } p-2 z-[9999]`}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        dispatch(setActiveId(id));
      }}
    >
      {children}
    </div>
  );
};

export default Droppable;
