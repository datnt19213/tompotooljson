import { splitDimensions } from "../../../utilities/text";
import ColorPickerInput from "../../commom/color";
import DimensionInput from "../../commom/input";

const Border = ({ styles, setStyles }) => {
  const handleBorderChange = (
    value,
    property,
    unit = "px",
    side = "border"
  ) => {
    setStyles((prevStyles) => {
      const newStyles = { ...prevStyles };

      // Initialize border if not present
      if (!newStyles[side]) {
        newStyles[side] = "0px solid black"; // Default value
      }

      const borderParts =
        typeof newStyles[side] === "string"
          ? newStyles[side].split(" ")
          : ["0px", "solid", "black"];

      if (property === "width") {
        borderParts[0] = `${value}${unit}`;
      } else if (property === "style") {
        borderParts[1] = value;
      } else if (property === "color") {
        borderParts[2] = value;
      }

      newStyles[side] = borderParts.join(" ");
      return newStyles;
    });
  };

  return (
    <details className="group w-full  [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
        <span className="font-semibold text-gray-800 capitalize">Border</span>
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

      <ul className="grid grid-cols-2 gap-3 w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
        {/* General Border */}
        <li>
          <span className="text-sm font-medium text-gray-400">Width</span>
          <DimensionInput
            defaultValue={parseInt(
              styles?.border && typeof styles?.border === "string"
                ? styles?.border.split(" ")[0]
                : "0"
            )}
            onChange={(value) =>
              handleBorderChange(value?.inputValue, "width", value?.unit)
            }
          />
        </li>
        <li>
          <span className="text-sm font-medium text-gray-400">Style</span>
          <select
            value={
              styles?.border && typeof styles?.border === "string"
                ? styles?.border.split(" ")[1]
                : "solid"
            }
            onChange={(e) => handleBorderChange(e.target.value, "style")}
            className="border border-gray-300 appearance-none h-10 px-2 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block cursor-pointer"
          >
            <option value="none">None</option>
            <option value="solid">Solid</option>
            <option value="dotted">Dotted</option>
            <option value="dashed">Dashed</option>
            <option value="double">Double</option>
            <option value="groove">Groove</option>
            <option value="ridge">Ridge</option>
            <option value="inset">Inset</option>
            <option value="outset">Outset</option>
          </select>
        </li>
        <li className="col-span-2">
          <span className="text-sm font-medium text-gray-400">Color</span>
          <ColorPickerInput
            value={
              styles?.border && typeof styles?.border === "string"
                ? styles?.border.split(" ")[2]
                : "#000000"
            }
            onChange={(color) => handleBorderChange(color, "color")}
          />
        </li>

        {/* Individual Borders */}
        {["borderTop", "borderRight", "borderBottom", "borderLeft"].map(
          (side, index) => (
            <div key={index} className="col-span-2">
              <h4 className="font-semibold text-gray-700">
                {side.replace("border", "")} Border
              </h4>
              <li>
                <span className="text-sm font-medium text-gray-400">Width</span>
                <DimensionInput
                  defaultValue={parseInt(
                    styles?.[side] && typeof styles?.[side] === "string"
                      ? styles?.[side].split(" ")[0]
                      : "0"
                  )}
                  onChange={(value) =>
                    handleBorderChange(
                      value?.inputValue,
                      "width",
                      value?.unit,
                      side
                    )
                  }
                />
              </li>
              <li>
                <span className="text-sm font-medium text-gray-400">Style</span>
                <select
                  value={
                    styles?.[side] && typeof styles?.[side] === "string"
                      ? styles?.[side].split(" ")[1]
                      : "solid"
                  }
                  onChange={(e) =>
                    handleBorderChange(e.target.value, "style", "px", side)
                  }
                  className="border border-gray-300 appearance-none h-10 px-2 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block cursor-pointer"
                >
                  <option value="none">None</option>
                  <option value="solid">Solid</option>
                  <option value="dotted">Dotted</option>
                  <option value="dashed">Dashed</option>
                  <option value="double">Double</option>
                  <option value="groove">Groove</option>
                  <option value="ridge">Ridge</option>
                  <option value="inset">Inset</option>
                  <option value="outset">Outset</option>
                </select>
              </li>
              <li className="col-span-2">
                <span className="text-sm font-medium text-gray-400">Color</span>
                <ColorPickerInput
                  value={
                    styles?.[side] && typeof styles?.[side] === "string"
                      ? styles?.[side].split(" ")[2]
                      : "#000000"
                  }
                  onChange={(color) =>
                    handleBorderChange(color, "color", "px", side)
                  }
                />
              </li>
            </div>
          )
        )}
      </ul>
    </details>
  );
};

export default Border;
