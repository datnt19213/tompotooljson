import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect } from "react";

import { RootState } from "../store";
import { setDeepLevel } from "../store/DndSlice";
import { ToastCustom, ToastDismiss } from "../components/toast";
import GridLayout from "./GridLayout";
import SliceItem from "./SliceItem";
import BoxLayout from "./BoxLayout";
import _ from "lodash";

export interface ItemsRenderProps {
  id: string;
  thumbnail?: string;
  columns: string;
  rows: string;
  colspan: string;
  rowspan: string;
  gap: string;
  alignItems: string;
  justifyContent: string;
  type: string;
  style?: React.CSSProperties;
  childs: any[];
  currentDepth: number;
  dataSlice?: {
    title?: string;
    url?: string;
  };
  isParentBg?: React.CSSProperties;
}

const ItemsRenderer = ({
  id,
  columns,
  rows,
  colspan,
  rowspan,
  alignItems,
  justifyContent,
  gap,
  type,
  style,
  childs,
  currentDepth,
  thumbnail,
  dataSlice,
  isParentBg,
}: ItemsRenderProps) => {
  
  const { activeId } = useSelector((state: RootState) => state.dndSlice);
  const dispatch = useDispatch();

  const totalCells = Number(columns) * Number(rows);
  const totalChildren = childs.length + Number(colspan) + Number(rowspan);
  const emptyCells = Math.max(0, totalCells - totalChildren);

  if (currentDepth > 10) {
    ToastDismiss();
    ToastCustom({
      msg: "Maximum deep level is 10",
      icon: (
        <Icon
          icon="ph:warning-fill"
          className="text-yellow-400"
          fontSize={16}
        />
      ),
    });
    return <></>;
  }
  useEffect(() => {
    dispatch(setDeepLevel(currentDepth));
  }, []);

  const propsChildCommon = {
    columns,
    rows,
    rowspan,
    colspan,
    alignItems,
    justifyContent,
    style,
    gap,
    id,
    childs,
    type,
    thumbnail,
    dataSlice,
    currentDepth,
    activeId,
    emptyCells,
  };
  return (
    <div className="w-full h-full">
      {type === "flex" && <BoxLayout {...propsChildCommon} />}
      {type === "grid" && <GridLayout {...propsChildCommon} />}
      {type === "content" && (
        <SliceItem {...propsChildCommon} isParentBg={isParentBg} />
      )}
    </div>
  );
};

export default ItemsRenderer;
