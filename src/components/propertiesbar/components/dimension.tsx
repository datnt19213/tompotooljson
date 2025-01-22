import { splitValueAndUnit } from "../../../utilities/text";
import DimensionInput from "../../commom/input";

const Dimension = ({ styles, setStyles }) => {
  const handleDimensionChange = (
    value: string | number,
    property: "width" | "height" | "maxWidth" | "maxHeight",
    unit: string
  ) => {
    if (value === 0 || value === "0") {
      // Không trả về giá trị nếu là 0
      setStyles((prevStyles) => {
        const newStyles = { ...prevStyles };
        delete newStyles[property]; // Xóa thuộc tính nếu giá trị là 0
        return newStyles;
      });
    } else {
      setStyles((prevStyles) => ({
        ...prevStyles,
        [property]: `${value}${unit}`, // Cập nhật giá trị nếu khác 0
      }));
    }
  };

  return (
    <details
      className="group w-full [&_summary::-webkit-details-marker]:hidden"
      open
    >
      <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
        <span className="font-semibold text-gray-800 capitalize">
          Dimension
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
      <ul className="grid grid-cols-2 gap-3 w-full mt-2 p-4 border bg-white shadow-lg rounded-b-xl">
        {["width", "height", "maxWidth", "maxHeight"].map((property) => {
          // Kiểm tra xem property có tồn tại trong styles hay không
          const styleValue = styles?.hasOwnProperty(property)
            ? styles[property as keyof typeof styles]
            : "0";

          // Tách giá trị và đơn vị
          const [defaultValue, defaultUnit] = styleValue
            ? splitValueAndUnit(String(styleValue))
            : ["", ""]; // Sử dụng chuỗi rỗng nếu không có giá trị
          return (
            <li key={property}>
              <span className="text-sm font-medium text-gray-400 capitalize">
                {property.replace(/([A-Z])/g, " $1")}{" "}
                {/* Format to "maxWidth" as "Max Width" */}
              </span>
              <DimensionInput
                defaultValue={Number.parseInt(defaultValue)} // Set default value if available
                defaultUnit={defaultUnit} // Set default unit if available
                onChange={(value) =>
                  handleDimensionChange(
                    value.inputValue,
                    property as any,
                    value.unit
                    // "px"
                  )
                }
              />
            </li>
          );
        })}
      </ul>
    </details>
  );
};

export default Dimension;
