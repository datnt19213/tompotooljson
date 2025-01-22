import React from "react";
import DimensionInput from "../../commom/input";
import { splitDimensions } from "../../../utilities/text";

const Padding = ({ styles, setStyles }) => {
  const handlePaddingChange = (
    value: string | number,
    direction: "top" | "right" | "bottom" | "left",
    unit: string
  ) => {
    setStyles((prevStyles) => {
      const paddingValues = (prevStyles?.padding || "0px 0px 0px 0px")
        .toString() // Đảm bảo là chuỗi
        .split(" "); // Chuyển thành mảng

      const directionIndex = { top: 0, right: 1, bottom: 2, left: 3 }[
        direction
      ]; // Lấy vị trí
      paddingValues[directionIndex] = `${value}${unit}`; // Cập nhật giá trị kèm unit

      const newPadding = paddingValues.join(" "); // Gộp lại thành chuỗi

      // Kiểm tra nếu tất cả các giá trị là 0
      if (
        paddingValues.every(
          (val) =>
            val === "0px" || val === "0rem" || val === "0em" || val === "0%"
        )
      ) {
        // const { padding, ...rest } = prevStyles; // Loại bỏ padding nếu tất cả giá trị là 0
        // return rest;
      }

      return { ...prevStyles, padding: newPadding }; // Cập nhật padding nếu không phải 0
    });
  };

  return (
    <details className="group w-full [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center w-full justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
        <span className="font-semibold text-gray-800 capitalize">Padding</span>
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

      <ul className="grid grid-cols-2 gap-3 w-full mt-2 border p-4 bg-white shadow-lg rounded-b-xl">
        {["padding"].map((property, index) => {
          const paddingValue = styles?.hasOwnProperty(property)
            ? styles[property as keyof typeof styles]
            : "0px 0px 0px 0px";
          const [top, right, bottom, left] = splitDimensions(
            String(paddingValue)
          );

          return (
            <div key={index + "padding"}>
              <li key="top">
                <span className="text-sm font-medium text-gray-400">Top</span>
                <DimensionInput
                  defaultValue={Number.parseInt(top)} // Chuyển đổi thành số
                  defaultUnit={top.replace(/[0-9]/g, "")} // Lấy đơn vị (px, em, rem, ...)
                  onChange={(value) =>
                    handlePaddingChange(value.inputValue, "top", value.unit)
                  }
                />
              </li>
              <li key="right">
                <span className="text-sm font-medium text-gray-400">Right</span>
                <DimensionInput
                  defaultValue={Number.parseInt(right)}
                  defaultUnit={right.replace(/[0-9]/g, "")}
                  onChange={(value) =>
                    handlePaddingChange(value.inputValue, "right", value.unit)
                  }
                />
              </li>
              <li key="bottom">
                <span className="text-sm font-medium text-gray-400">
                  Bottom
                </span>
                <DimensionInput
                  defaultValue={Number.parseInt(bottom)}
                  defaultUnit={bottom.replace(/[0-9]/g, "")}
                  onChange={(value) =>
                    handlePaddingChange(value.inputValue, "bottom", value.unit)
                  }
                />
              </li>
              <li key="left">
                <span className="text-sm font-medium text-gray-400">Left</span>
                <DimensionInput
                  defaultValue={Number.parseInt(left)}
                  defaultUnit={left.replace(/[0-9]/g, "")}
                  onChange={(value) =>
                    handlePaddingChange(value.inputValue, "left", value.unit)
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

export default Padding;
