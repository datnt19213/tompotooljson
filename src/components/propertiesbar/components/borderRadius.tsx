import { splitDimensions } from "../../../utilities/text";
import DimensionInput from "../../commom/input";

const BorderRadius = ({ styles, setStyles }) => {
  const handleBorderRadiusChange = (
    value: string | number,
    corner:
      | "borderTopLeftRadius"
      | "borderTopRightRadius"
      | "borderBottomLeftRadius"
      | "borderBottomRightRadius",
    unit: string
  ) => {
    if (value === 0 || value === "0") {
      // Nếu giá trị là 0, xóa thuộc tính tương ứng
      setStyles((prevStyles) => {
        const newStyles = { ...prevStyles };
        delete newStyles[corner];
        return newStyles;
      });
    } else {
      // Cập nhật giá trị của góc nếu giá trị khác 0
      setStyles((prevStyles) => ({
        ...prevStyles,
        [corner]: `${value}${unit}`,
      }));
    }
  };
  return (
    <details className="group w-full  [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
        <span className="font-semibold text-gray-800 capitalize">Radius</span>
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
        {["borderRadius"].map((property, index) => {
          const radiusValue = styles?.hasOwnProperty(property)
            ? styles[property as keyof typeof styles]
            : "0px 0px 0px 0px";
          const [topLeft, topRight, bottomRight, bottomLeft] = splitDimensions(
            String(radiusValue)
          );

          return (
            <div key={index + "radius"}>
              <li key="topLeft">
                <span className="text-sm font-medium text-gray-400">
                  Top Left
                </span>
                <DimensionInput
                  defaultValue={Number.parseInt(topLeft)}
                  defaultUnit={topLeft.replace(/[0-9]/g, "") || "px"}
                  onChange={(value) =>
                    handleBorderRadiusChange(
                      value.inputValue,
                      "borderTopLeftRadius",
                      value.unit
                    )
                  }
                />
              </li>
              <li key="topRight">
                <span className="text-sm font-medium text-gray-400">
                  Top Right
                </span>
                <DimensionInput
                  defaultValue={Number.parseInt(topRight)}
                  defaultUnit={topRight.replace(/[0-9]/g, "") || "px"}
                  onChange={(value) =>
                    handleBorderRadiusChange(
                      value.inputValue,
                      "borderTopRightRadius",
                      value.unit
                    )
                  }
                />
              </li>
              <li key="bottomRight">
                <span className="text-sm font-medium text-gray-400">
                  Bottom Right
                </span>
                <DimensionInput
                  defaultValue={Number.parseInt(bottomRight)}
                  defaultUnit={bottomRight.replace(/[0-9]/g, "") || "px"}
                  onChange={(value) =>
                    handleBorderRadiusChange(
                      value.inputValue,
                      "borderBottomRightRadius",
                      value.unit
                    )
                  }
                />
              </li>
              <li key="bottomLeft">
                <span className="text-sm font-medium text-gray-400">
                  Bottom Left
                </span>
                <DimensionInput
                  defaultValue={Number.parseInt(bottomLeft)}
                  defaultUnit={bottomLeft.replace(/[0-9]/g, "") || "px"}
                  onChange={(value) =>
                    handleBorderRadiusChange(
                      value.inputValue,
                      "borderBottomLeftRadius",
                      value.unit
                    )
                  }
                />
              </li>
            </div>
          );
        })}
      </ul>
    </details>
  );
};

export default BorderRadius;
