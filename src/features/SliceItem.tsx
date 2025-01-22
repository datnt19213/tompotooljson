import _ from "lodash";
import ItemsRenderer, { ItemsRenderProps } from ".";
import Draggable from "../components/draggable";
import { SpanCol, SpanRow } from "../utilities";
import { formatText } from "../utilities/text";
import { isValidColor } from "./BoxLayout";
import { CSSProperties, useEffect, useState } from "react";

type SliceItemProps = ItemsRenderProps & {
  activeId?: string;
  emptyCells?: number | null;
  isParentBg?: React.CSSProperties;
};

const SliceItem = ({
  rowspan,
  colspan,
  style,
  id,
  childs,
  currentDepth,
  activeId,
  isParentBg,
  dataSlice,
}: SliceItemProps) => {
  const bgItems = isValidColor(isParentBg) ? "" : "bg-gray-100";

  const safeStyle = {
    ...style,
    backgroundColor: isValidColor(style?.backgroundColor)
      ? style.backgroundColor
      : undefined,
  };

  return (
    <div
      className={`p-2 border text-center h-full border-dashed flex justify-center items-center ${
        activeId === id && "border-2 border-green-500"
      } ${SpanRow(Number(rowspan))} ${SpanCol(
        Number(colspan)
      )} ${bgItems} animate-jump-in`}
      style={safeStyle}
    >
      <RenderContent id={id} dataSlice={dataSlice} style={style} />
      {childs.map((child: any) => (
        <Draggable
          {...child}
          key={child.id}
          dataSlice={dataSlice}
          id={child.id}
        >
          <ItemsRenderer {...child} currentDepth={currentDepth + 1} />
        </Draggable>
      ))}
    </div>
  );
};

const RenderContent = ({ id, dataSlice, style }) => {
  const title = _.get(dataSlice, "title");
  const url = _.get(dataSlice, "url");
  const isMedia = _.get(dataSlice, "isMedia");
  return (
    <div className="w-full">
      {/* <div className="w-full flex justify-end text-red-500 text-sm">{formatText(id)}</div> */}
      <div className="">{title}</div>
      <Media style={style} url={url} />
    </div>
  );
};

const Media = ({ url, style }: { url?: string; style }) => {
  const [isVisible, setIsVisible] = useState(false);

  const newStyle: CSSProperties | undefined = {
    ...style,
    inset: 0,
    objectFit: "fill",
  };

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("background-compo");
      const rect = element?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Kiểm tra ngay khi component được render

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!url) {
    return;
  }

  return (
    <div id="background-compo" style={{ minHeight: "200px" }}>
      {!_.isEmpty(url) &&
        isVisible &&
        (url?.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) ? (
          <img style={newStyle} src={url} alt="Preview" className="w-full" />
        ) : url?.match(/\.(mp4|mov|avi|mkv|webm)$/i) ? (
          <video
            style={newStyle}
            autoPlay
            loop
            muted
            playsInline
            className="w-full aspect-video absolute top-0 left-0"
            src={url}
            preload="metadata"
          >
            <source src={`${url}.webm`} type="video/webm" />
            <source src={url} type="video/mp4" />
          </video>
        ) : (
          <p>Unsupported media type</p>
        ))}
    </div>
  );
};

export default SliceItem;
