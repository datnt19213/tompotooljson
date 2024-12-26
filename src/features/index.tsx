import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {GridCol, GridRow, SpanCol, SpanRow} from "../utilities";
import {setActiveId, setDeepLevel} from "../store/DndSlice";
import {ToastBlank, ToastCustom, ToastDismiss} from "../components/toast";
import {convertAlign, convertJustify} from "../utilities/flex";
import {Gap} from "../utilities/grid";
import Droppable from "../components/droppable";
import Draggable from "../components/drangable";
import {Icon} from "@iconify/react/dist/iconify.js";
import {useEffect} from "react";
import {formatText} from "../utilities/text";

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
}: {
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
}) => {
  const { activeId } = useSelector((state: RootState) => state.dndSlice);
  const dispatch = useDispatch();

  const totalCells = Number(columns) * Number(rows);
  const totalChildren = childs.length + Number(colspan) + Number(rowspan);
  const emptyCells = Math.max(0, totalCells - totalChildren);

  if (currentDepth > 6) {
    ToastDismiss();
    ToastCustom({
      msg: "Maximum deep level is 6",
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

  return (
    <div className="w-full h-full">
      {type === "flex" && (
        <Droppable
          className={`p-2 w-full h-full border border-dashed bg-white animate-jump-in${
            activeId === id && "border-green-500 border-2 "
          }`}
          columns={columns}
          rows={rows}
          rowspan={rowspan}
          colspan={colspan}
          alignItems={alignItems}
          justifyContent={justifyContent}
          style={style}
          gap={gap}
          type={type}
          key={id}
          id={id}
          thumbnail={thumbnail}>
          <div
            className={`flex h-full w-full  animate-jump-in${convertJustify(
              justifyContent
            )} ${convertAlign(alignItems)} ${Gap(Number(gap))}`}
            style={style}>
            {childs.map((child: any) => (
              <Draggable
                className={`h-fit w-fit  animate-jump-in`}
                {...child}
                key={child.id}
                id={child.id}>
                <ItemsRenderer {...child} currentDepth={currentDepth + 1} />
              </Draggable>
            ))}
            {Array.from({ length: emptyCells }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="border border-dashed w-full border-gray-500"
              />
            ))}
          </div>
        </Droppable>
      )}
      {type === "grid" && (
        <Droppable
          className={`p-2 min-h-12 w-full h-full border border-dashed bg-white animate-fade-down ${
            activeId === id && "border-green-500 border-2  animate-jump-in"
          }`}
          columns={columns}
          rows={rows}
          rowspan={rowspan}
          colspan={colspan}
          alignItems={alignItems}
          justifyContent={justifyContent}
          gap={gap}
          type={type}
          style={style}
          key={id}
          id={id}
          thumbnail={thumbnail}>
          <div
            className={`grid gap-1   animate-jump-in  ${GridRow(
              Number(rows)
            )} ${GridCol(Number(columns))}`}
            style={style}>
            {childs.map((child: any) => (
              <Draggable
                className={`
                } ${SpanCol(Number(child.colspan))} ${SpanRow(
                  Number(child.rowspan)
                )}`}
                {...child}
                key={child.id}
                id={child.id}>
                <ItemsRenderer {...child} currentDepth={currentDepth + 1} />
              </Draggable>
            ))}
            {Array.from({ length: emptyCells }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="border border-dashed min-h-12 w-full border-gray-500 "
              />
            ))}
          </div>
        </Droppable>
      )}

      {type === "content" && (
        <div
          className={`p-2 border text-center h-full border-dashed  ${
            activeId === id && "border-2 border-green-500"
          } ${SpanRow(Number(rowspan))} ${SpanCol(
            Number(colspan)
          )} bg-gray-100 animate-jump-in`}
          style={style}
          onClick={() => {
            dispatch(setActiveId(id));
          }}>
          {formatText(id)}
          {childs.map((child: any) => (
            <Draggable {...child} key={child.id} id={child.id}>
              <ItemsRenderer {...child} currentDepth={currentDepth + 1} />
            </Draggable>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsRenderer;