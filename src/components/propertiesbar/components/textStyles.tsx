import React from "react";
import _ from "lodash";
import DimensionInput, { Input } from "../../commom/input";
import { splitDimensions } from "../../../utilities/text";

const TextStyles = ({
  styles,
  setStyles,
}: {
  styles: React.CSSProperties;
  setStyles: any;
}) => {
  const handleFontSize = (value: number) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      fontSize: value,
    }));
  };

  const handleColorChange = (value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      color: value,
    }));
  };

  const handleFontStyleChange = (value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      fontStyle: value,
    }));
  };

  const handleFontWeightChange = (value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      fontWeight: value,
    }));
  };

  const handleOpacityChange = (value: number) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      opacity: value,
    }));
  };

  const handleBoxShadowChange = (value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      boxShadow: value,
    }));
  };

  const handleBackgroundChange = (value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      background: value,
    }));
  };

  const handleTextAlignChange = (value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      textAlign: value,
    }));
  };

  const handleLineClampChange = (value: number) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: value,
      overflow: "hidden",
    }));
  };

  const handleBorderChange = (value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      border: value,
    }));
  };

  const handlePaddingChange = (value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      padding: value,
    }));
  };

  const handleBorderRadiusChange = (value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      borderRadius: value,
    }));
  };

  const handleLetterSpacingChange = (value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      letterSpacing: value,
    }));
  };

  return (
    <details>
      <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
        <span className="font-semibold text-gray-800 capitalize">
          Text Styles
        </span>
        <svg
          className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>

      <ul className="flexgap-3 w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
        {["fontSize"].map((property, index) => {
          const fontSizePa = styles?.[property] || "0px"; // Kiểm tra từng thuộc tính cụ thể
          const [fontSize] = splitDimensions(String(fontSizePa));

          return (
            <div key={index + "positionXY"}>
              <li key={property}>
                <span className="text-sm font-medium text-gray-400">
                  {property.charAt(0).toUpperCase() + property.slice(1)}
                </span>
                <DimensionInput
                  defaultValue={Number.parseInt(fontSize)} // Chuyển đổi thành số
                  defaultUnit={fontSize.replace(/[0-9]/g, "")} // Lấy đơn vị (px, em, rem, ...)
                  onChange={(value) => handleFontSize(value.inputValue)}
                />
              </li>
            </div>
          );
        })}

        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Color:</div>
            <input
              type="text"
              onChange={(e) => handleColorChange(e.target.value)}
              defaultValue={_.get(styles, "color", "")}
              value={_.get(styles, "color", "")}
              placeholder="Enter color (#hex, rgba, etc.)"
              className="w-full border border-gray-300 p-2 rounded"
            />
            <input
              type="color"
              onChange={(e) => handleColorChange(e.target.value)}
              defaultValue={_.get(styles, "color", "#000000")}
              value={_.get(styles, "color", "")}
              className="mt-2"
            />
          </div>
        </li>

        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Style:</div>
            <select
              onChange={(e) => handleFontStyleChange(e.target.value)}
              defaultValue={_.get(styles, "fontStyle", "")}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">None</option>
              <option value="normal">Normal</option>
              <option value="italic">Italic</option>
              <option value="oblique">Oblique</option>
              <option value="bold">Bold</option>
              <option value="underline">Underline</option>
              <option value="line-through">Line-through</option>
            </select>
          </div>
        </li>

        {/* Font Weight */}
        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Font Weight:</div>
            <select
              onChange={(e) => handleFontWeightChange(e.target.value)}
              defaultValue={_.get(styles, "fontWeight", "")}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Default</option>
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="bolder">Bolder</option>
              <option value="lighter">Lighter</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
              <option value="900">900</option>
            </select>
          </div>
        </li>

        {/* Opacity */}
        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Opacity:</div>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
              value={_.get(styles, "opacity", 1)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </li>

        {/* Box shadow */}
        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Box Shadow:</div>
            <textarea
              onChange={(e) => handleBoxShadowChange(e.target.value)}
              defaultValue={_.get(styles, "boxShadow", "")}
              value={_.get(styles, "boxShadow", "")}
              placeholder="Enter box-shadow (e.g., '0px 1px 1px rgba(0, 0, 0, 0.1)')"
              className="w-full border border-gray-300 p-2 rounded"
              rows={3}
            />
          </div>
        </li>

        {/* Background */}
        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Background:</div>
            <textarea
              onChange={(e) => handleBackgroundChange(e.target.value)}
              defaultValue={_.get(styles, "background", "")}
              value={_.get(styles, "background", "")}
              placeholder="Enter background (e.g., 'radial-gradient(...)')"
              className="w-full border border-gray-300 p-2 rounded"
              rows={3}
            />
            <div className="text-sm text-gray-500">
              Example:{" "}
              <code>
                radial-gradient(50% 50% at 50% 50%, rgba(20, 20, 22, 0.00)
                50.27%, #141416 100%)
              </code>
            </div>
          </div>
        </li>

        {/* Border */}
        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Border:</div>
            <textarea
              onChange={(e) => handleBorderChange(e.target.value)}
              defaultValue={_.get(styles, "border", "")}
              value={_.get(styles, "border", "")}
              placeholder='e.g., "1px solid rgba(255, 255, 255, 0.16)"'
              className="w-full border border-gray-300 p-2 rounded"
              rows={2}
            />
            <div className="text-sm text-gray-500">
              Example: <code>1px solid rgba(255, 255, 255, 0.16)</code>
            </div>
          </div>
        </li>

        {/* Padding */}
        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Padding:</div>
            <textarea
              onChange={(e) => handlePaddingChange(e.target.value)}
              defaultValue={_.get(styles, "padding", "")}
              value={_.get(styles, "padding", "")}
              placeholder='e.g., "10px 20px 15px 5px"'
              className="w-full border border-gray-300 p-2 rounded"
              rows={2}
            />
            <div className="text-sm text-gray-500">
              Example: <code>10px 20px 15px 5px</code> (top right bottom left)
            </div>
          </div>
        </li>

        {/* Border Radius */}
        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Border Radius:</div>
            <textarea
              onChange={(e) => handleBorderRadiusChange(e.target.value)}
              defaultValue={_.get(styles, "borderRadius", "")}
              value={_.get(styles, "borderRadius", "")}
              placeholder='e.g., "10px" or "50%"'
              className="w-full border border-gray-300 p-2 rounded"
              rows={2}
            />
            <div className="text-sm text-gray-500">
              Example: <code>10px</code> or <code>50%</code> (for circular
              shapes)
            </div>
          </div>
        </li>

        {/* TEXT ALIGN */}
        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Text Align:</div>
            <select
              onChange={(e) => handleTextAlignChange(e.target.value)}
              defaultValue={_.get(styles, "textAlign", "left")}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
        </li>

        {/* Số dòng text */}
        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Line Clamp:</div>
            <input
              type="number"
              min="1"
              onChange={(e) =>
                handleLineClampChange(parseInt(e.target.value, 10))
              }
              defaultValue={_.get(styles, "WebkitLineClamp", 2)}
              value={_.get(styles, "WebkitLineClamp", 2)}
              placeholder="Enter number of lines"
              className="w-full border border-gray-300 p-2 rounded"
            />
            <div className="text-sm text-gray-500">
              Example: Limit to <code>2</code> lines with ellipsis.
            </div>
          </div>
        </li>

        {/* Letter spacing */}
        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Letter Spacing:</div>
            <input
              type="text"
              onChange={(e) => handleLetterSpacingChange(e.target.value)}
              defaultValue={_.get(styles, "letterSpacing", "0px")}
              value={_.get(styles, "letterSpacing", "")}
              placeholder='e.g., "1px", "0.1em", "0.05rem"'
              className="w-full border border-gray-300 p-2 rounded"
            />
            <div className="text-sm text-gray-500">
              Example: <code>1px</code>, <code>0.1em</code>, or{" "}
              <code>0.05rem</code>.
            </div>
          </div>
        </li>
      </ul>
    </details>
  );
};

export default TextStyles;
