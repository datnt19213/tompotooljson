import { useDispatch, useSelector } from "react-redux";
import { setActiveCreateFunction } from "../../../store/DndSlice";
import { RootState } from "../../../store";

const BtnHandleCreateFc = () => {
  const { activeCreateFunction } = useSelector(
    (state: RootState) => state.dndSlice
  );
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => {
        dispatch(setActiveCreateFunction(!activeCreateFunction));
      }}
      className="h-10 px-4  text-sm bg-[#444] text-white rounded-full"
    >
      {activeCreateFunction ? "Close" : "Create Function"}
    </button>
  );
};

export default BtnHandleCreateFc;
