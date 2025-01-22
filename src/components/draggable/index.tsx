import { useDispatch, useSelector } from "react-redux";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import { CSSProperties } from "react";
import _ from "lodash";

import { RootState } from "../../store";
import { setActiveId } from "../../store/DndSlice";

interface DraggableProps {
  id: string;
  thumbnail?: string;
  colspan: string;
  rowspan: string;
  columns: string;
  gap: string;
  alignItems: string;
  justifyContent: string;
  type: string;
  rows: string;
  className?: string;
  children: React.ReactNode;
  style?: CSSProperties;
  identify?: string;
  styling?: CSSProperties;
}

const Draggable = ({
  colspan,
  rowspan,
  columns,
  type,
  rows,
  alignItems,
  gap,
  justifyContent,
  id,
  children,
  className = "",
  style,
  styling,
  thumbnail = "",
  identify,
}: DraggableProps) => {
  const { attributes, listeners, setNodeRef, over, transform } = useDraggable({
    id: _.toString(id),
    data: {
      colspan,
      rowspan,
      columns,
      rows,
      type,
      gap,
      alignItems,
      justifyContent,
      thumbnail,
    },
  });
  const { deepLevel } = useSelector((state: RootState) => state.dndSlice);

  const dispatch = useDispatch();

  const newStyleDiv = {
    transform: CSS.Translate.toString(transform),
    ...styling,
    ...style,
  };

  const newStyleIcon = {
    transform: CSS.Translate.toString(transform),
    ...styling,
  };

  const onActiveDraggle = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(setActiveId(id));
  };
  return (
    <div
      ref={setNodeRef}
      style={newStyleDiv}
      className={`${className} overflow-hidden cursor-pointer ${
        over ? "border-violet-500" : ""
      } relative group`}
      onClick={onActiveDraggle}
    >
      <Icon
        icon="ph:dots-six-vertical"
        style={{
          right: `${deepLevel > 1 ? deepLevel * 0.5 : "0"}rem`,
          ...newStyleIcon,
        }}
        className="z-[999] group-hover:block hidden transition-all rounded-bl-lg absolute top-0 text-gray-700 !bg-white border-none cursor-grab focus-visible:border-none hover:border-none focus:border-none outline-none focus-visible:outline-none focus:outline-none hover:outline-none"
        fontSize={24}
        {...listeners}
        {...attributes}
      />
      {children}
    </div>
  );
};

export default Draggable;
