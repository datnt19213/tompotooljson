import React from "react";
import { splitDimensions } from "../../../utilities/text";
import DimensionInput, { Input } from "../../commom/input";
import _ from "lodash";

const Position = ({
  styles,
  setStyles,
}: {
  styles: React.CSSProperties;
  setStyles: any;
}) => {
  const changePosition = (value: any) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      position: value,
    }));
  };

  const handlePositionXY = (
    value: string | number,
    property: keyof React.CSSProperties,
    unit: string
  ) => {
    if (value === 0 || value === "0") {
      setStyles((prevStyles) => {
        const newStyles = { ...prevStyles };
        delete newStyles[property];
        return newStyles;
      });
    } else {
      setStyles((prevStyles) => ({
        ...prevStyles,
        [property]: `${value}${unit}`,
      }));
    }
  };

  const handleZindex = (value: any) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      zIndex: value,
    }));
  };

  const handleTransform = (value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      transform: value,
    }));
  };

  const handleOverviewChange = (property: string, value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      [property]: value,
    }));
  };

  return (
    <details>
      <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
        <span className="font-semibold text-gray-800 capitalize">Position</span>
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
        <li>
          <span className="text-sm font-medium text-gray-400">Position</span>
          <div className="flex items-center justify-center gap-2">
            <select
              id="position"
              className="border border-gray-300 appearance-none h-10 px-2 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block cursor-pointer"
              value={_.get(styles, "position")}
              onChange={(e) => changePosition(e.target.value)}
            >
              <option value="static">static</option>
              <option value="fixed">fixed</option>
              <option value="absolute">absolute</option>
              <option value="relative">relative</option>
              <option value="sticky">sticky</option>
            </select>
          </div>
        </li>

        {/* {["top", "right", "bottom", "left"].map((property, index) => {
          const paddingValue = styles?.[property] || "0px"; // Kiểm tra từng thuộc tính cụ thể
          const [top, right, bottom, left] = splitDimensions(
            String(paddingValue)
          );

          return (
            <div key={index + "positionXY"}>
              <li key={property}>
                <span className="text-sm font-medium text-gray-400">
                  {property.charAt(0).toUpperCase() + property.slice(1)}
                </span>
                <DimensionInput
                  isMin={false}
                  defaultValue={Number.parseInt(paddingValue)} // Chuyển đổi thành số
                  defaultUnit={paddingValue.replace(/[0-9]/g, "")} // Lấy đơn vị (px, em, rem, ...)
                  onChange={(value) =>
                    handlePositionXY(value.inputValue, property, value.unit)
                  }
                />
              </li>
            </div>
          );
        })} */}
        {["top", "right", "bottom", "left"].map((property, index) => {
          const propertyValue = styles?.[property] || "0px"; // Kiểm tra giá trị thuộc tính
          return (
            <div key={index + "positionXY"}>
              <li key={property}>
                <span className="text-sm font-medium text-gray-400">
                  {property.charAt(0).toUpperCase() + property.slice(1)}
                </span>
                <DimensionInput
                  isMin={false}
                  defaultValue={Number.parseInt(propertyValue)} // Chuyển đổi thành số
                  defaultUnit={propertyValue.replace(/[0-9]/g, "")} // Lấy đơn vị (px, em, rem, ...)
                  onChange={(value) =>
                    handlePositionXY(
                      value.inputValue,
                      property as keyof React.CSSProperties,
                      value.unit
                    )
                  }
                />
              </li>
            </div>
          );
        })}

        <li>
          <div className="flex items-center justify-start p-4 gap-1.5">
            <div className="w-[100px]">Z-index:</div>
            <Input
              onChange={handleZindex}
              defaultValue={_.get(styles, "zIndex", "")}
            />
          </div>
        </li>

        {/* Transform */}
        <li>
          <div className="flex items-center justify-start p-4 gap-1.5">
            <div className="w-[100px]">Transform:</div>
            <Input
              onChange={(value) => handleTransform(value)}
              defaultValue={_.get(styles, "transform", "")}
              placeholder="e.g. translateY(-10%)"
            />
          </div>
        </li>

        {/* Overview Properties */}
        <li>
          <div className="flex flex-col gap-4">
            {/* Overflow */}
            <div className="flex items-center justify-start p-4 gap-1.5">
              <div className="w-[100px]">Overflow:</div>
              <select
                onChange={(e) =>
                  handleOverviewChange("overflow", e.target.value)
                }
                value={_.get(styles, "overflow", "visible")}
                className="border border-gray-300 h-10 px-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="visible">visible</option>
                <option value="hidden">hidden</option>
                <option value="scroll">scroll</option>
                <option value="auto">auto</option>
              </select>
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-start p-4 gap-1.5">
              <div className="w-[100px]">Visibility:</div>
              <select
                onChange={(e) =>
                  handleOverviewChange("visibility", e.target.value)
                }
                value={_.get(styles, "visibility", "visible")}
                className="border border-gray-300 h-10 px-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="visible">visible</option>
                <option value="hidden">hidden</option>
                <option value="collapse">collapse</option>
              </select>
            </div>

            {/* Clip */}
            <div className="flex items-center justify-start p-4 gap-1.5">
              <div className="w-[100px]">Clip:</div>
              <input
                type="text"
                placeholder="e.g. rect(0, 0, 100px, 100px)"
                value={_.get(styles, "clip", "")}
                onChange={(e) => handleOverviewChange("clip", e.target.value)}
                className="border border-gray-300 h-10 px-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
          </div>
        </li>
      </ul>
    </details>
  );
};

export default Position;
