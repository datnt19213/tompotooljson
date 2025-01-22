// import Droppable from "../components/droppable";
// import Draggable from "../components/draggable";
// import ItemsRenderer, { ItemsRenderProps } from ".";
// import { convertAlign, convertJustify } from "../utilities/flex";
// import { Gap } from "../utilities/grid";
// import _ from "lodash";

// type BoxLayoutProps = ItemsRenderProps & {
//   activeId?: string;
//   emptyCells?: number | null;
// };

// export const isValidColor = (color) => {
//   // Kiểm tra nếu color là chuỗi và có độ dài hợp lệ
//   return (
//     typeof color === "string" && /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color)
//   );
// };

// const BoxLayout = ({
//   columns,
//   rows,
//   rowspan,
//   colspan,
//   alignItems,
//   justifyContent,
//   style,
//   gap,
//   id,
//   childs,
//   type,
//   thumbnail,
//   currentDepth,
//   activeId,
//   emptyCells,
// }: BoxLayoutProps) => {
//   const safeStyle = {
//     ...style,
//     backgroundColor: isValidColor(style?.backgroundColor)
//       ? style.backgroundColor
//       : undefined,
//   };

//   const bg = "bg-white bg-opacity-30 backdrop-blur-sm";

//   if (style) {
//     console.log("styleBox", style);
//   }

//   return (
//     <Droppable
//       className={`p-2 w-full h-full border border-dashed ${bg} animate-jump-in ${
//         activeId === id && "border-green-500 border-2 "
//       }`}
//       columns={columns}
//       rows={rows}
//       rowspan={rowspan}
//       colspan={colspan}
//       alignItems={alignItems}
//       justifyContent={justifyContent}
//       style={style}
//       gap={gap}
//       type={type}
//       key={id}
//       id={id}
//       thumbnail={thumbnail}
//     >
//       <div
//         className={`flex gap-1 w-full h-full animate-jump-in ${convertJustify(
//           justifyContent
//         )} ${convertAlign(alignItems)} ${Gap(Number(gap))}`}
//         style={safeStyle}
//       >
//         {childs.map((child: any) => {
//           return (
//             <Draggable
//               className={`animate-jump-in h-fit w-fit`}
//               {...child}
//               key={child.id}
//               id={child.id}
//             >
//               <ItemsRenderer
//                 {...child}
//                 currentDepth={currentDepth + 1}
//                 // styleParent={style}
//               />
//             </Draggable>
//           );
//         })}
//         {Array.from({ length: emptyCells }).map((_, index) => (
//           <div
//             key={`empty-${index}`}
//             className="border border-dashed w-full border-gray-500"
//           />
//         ))}
//       </div>
//     </Droppable>
//   );
// };

// export default BoxLayout;

// export const isValidColor = (color) => {
//   // Kiểm tra nếu color là chuỗi và có độ dài hợp lệ
//   return (
//     typeof color === "string" && /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color)
//   );
// };

export const isValidColor = (color) => {
  // Kiểm tra nếu color là chuỗi và có độ dài hợp lệ
  return (
    typeof color === "string" && /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color)
  );
};

import Droppable from "../components/droppable";
import Draggable from "../components/draggable";
import ItemsRenderer, { ItemsRenderProps } from ".";
import { convertAlign, convertJustify } from "../utilities/flex";
import { Gap } from "../utilities/grid";
import _ from "lodash";

type BoxLayoutProps = ItemsRenderProps & {
  activeId?: string;
  emptyCells?: number | null;
};

const BoxLayout = ({
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
  currentDepth,
  activeId,
  emptyCells,
}: BoxLayoutProps) => {
  return (
    <Droppable
      className={`p-2 w-full h-full border border-dashed bg-white animate-jump-in ${
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
      thumbnail={thumbnail}
    >
      <div
        className={`flex  gap-1 w-full h-full animate-jump-in ${convertJustify(
          justifyContent
        )} ${convertAlign(alignItems)} ${Gap(Number(gap))}`}
        style={style}
      >
        {childs.map((child: any) => {
          return (
            <Draggable
              className={`animate-jump-in h-fit w-fit`}
              {...child}
              style={{ ...child.style, padding: "" }}
              key={child.id}
              id={child.id}
            >
              <ItemsRenderer {...child} currentDepth={currentDepth + 1} isParentBg={_.get(style, "backgroundColor")} />
            </Draggable>
          );
        })}
        {Array.from({ length: emptyCells }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="border border-dashed w-full border-gray-500"
          />
        ))}
      </div>
    </Droppable>
  );
};

export default BoxLayout;
