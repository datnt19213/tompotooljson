import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

interface DimensionInputProps {
  onChange: (value: { inputValue: number; unit: string }) => void;
  defaultValue?: number;
  defaultUnit?: string;
  hasPercents?: boolean;
  isMin?: boolean;
}

const DimensionInput: React.FC<DimensionInputProps> = ({
  onChange,
  defaultValue = 0,
  defaultUnit = "px",
  hasPercents = true,
  isMin = true,
}) => {
  const [inputValue, setInputValue] = useState<number | string>(defaultValue);
  const [unit, setUnit] = useState<string>(defaultUnit);

  useEffect(() => {
    setInputValue(defaultValue); // Cập nhật lại giá trị input khi defaultValue thay đổi
    setUnit(defaultUnit); // Cập nhật lại đơn vị khi defaultUnit thay đổi
  }, [defaultValue, defaultUnit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // Cho phép nhập số thập phân
    setInputValue(value);
    onChange({ inputValue: parseFloat(value) || 0, unit });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setUnit(value);
    onChange({
      inputValue: parseFloat(inputValue.toString()) || 0,
      unit: value,
    });
  };

  const setInputValueDefault = () => {
    if (isMin) {
      if (!inputValue || Number.parseFloat(inputValue.toString()) <= 0) {
        setInputValue(0);
      }
    }
  };

  return (
    <div className="flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden">
      <input
        type="number"
        step={0.1}
        min={isMin ? 0 : -1000}
        max={1000}
        className="h-10 w-full rounded-tl-lg rounded-bl-lg focus:ring-blue-500 focus:border-blue-500 pl-3"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={setInputValueDefault}
      />
      <select
        id="dimension"
        className="border border-gray-300 appearance-none h-10 px-2 text-sm rounded-tr-lg rounded-br-lg focus:ring-blue-500 focus:border-blue-500 block cursor-pointer"
        value={unit}
        onChange={handleSelectChange}
      >
        <option value="px">px</option>
        {hasPercents && <option value="%">%</option>}
        <option value="em">em</option>
        <option value="rem">rem</option>
        <option value="vw">vw</option>
        <option value="vh">vh</option>
      </select>
    </div>
  );
};

interface InputProps {
  onChange: (e: any) => void;
  defaultValue?: any;
  type?: string;
  placeholder?: string;
}

export const Input = ({
  onChange,
  type,
  defaultValue,
  placeholder,
}: InputProps) => {
  const [inputValue, setInputValue] = useState<number | string>(defaultValue);

  // Trong component DimensionInput
  const debouncedOnChange = useMemo(
    () => debounce((value: any) => onChange(value), 1000),
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // Cho phép nhập số thập phân
    setInputValue(value);
    debouncedOnChange(value);
  };

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="w-full flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden">
      <input
        type={type || "text"}
        step={0.1}
        min={0}
        max={1000}
        className="h-10 w-full rounded-tl-lg rounded-bl-lg focus:ring-blue-500 focus:border-blue-500 pl-3"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default DimensionInput;
