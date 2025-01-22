import _ from "lodash";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setLayoutTypeScreen } from "../../../store/DndSlice";

const Reponsive = () => {
  const dispatch = useDispatch();
  const [sizeStyle, setSizeStyle] = useState("desktop");

  // Debounce function for dispatching the action
  const debouncedDispatch = useCallback(
    _.debounce((newType) => {
      dispatch(setLayoutTypeScreen(newType));
    }, 200),
    [dispatch] // Include dispatch as dependency
  );

  const handleChange = (title) => {
    setSizeStyle(title); // Update local state
    debouncedDispatch(title); // Dispatch the action
  };

  return (
    <div className="flex items-center justify-start p-4 gap-1.5">
      <div className="">Size Screen:</div>
      <select
        name="sizeScreen"
        id="sizeScreen"
        value={sizeStyle} // Bind the value to state
        onChange={(e) => handleChange(e.target.value)}
        className="flex-1 p-2 rounded-md"
      >
        <option value="desktop">Desktop</option>
        <option value="mobile">Mobile</option>
      </select>
    </div>
  );
};

export default Reponsive;
