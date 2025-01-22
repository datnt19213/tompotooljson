import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  Obj,
  setActiveData,
  setData,
  setSidebar,
  setthumbnail,
} from "../../store/DndSlice";
import { RootState } from "../../store";
import exportFromJSON from "export-from-json";
import axios from "axios";
import { ToastDismiss, ToastError, ToastSuccess } from "../toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  extractImageUrl,
  formatText,
  serializeFromJsonToString,
} from "../../utilities/text";
import DimensionInput, { Input } from "../commom/input";
import { splitDimensions, splitValueAndUnit } from "../../utilities/text";
import ColorPickerInput from "../commom/color";
import { cacheDataToIndexedDB } from "../../services/indexedDB/services";
import { transformData } from "../../utilities/formatData";
import { DecryptBasic } from "../../utilities/hash_aes";
import { GetACookie } from "../../utilities/cookies";
import { Enum } from "../../config/common";
import { GetData, PutData } from "../../apis";
import { alignList, justifyList } from "./const";
import _ from "lodash";
import DataSlice from "./components/dataSlice";
import Position from "./components/position";
import TextStyles from "./components/textStyles";
import Reponsive from "./components/responsive";
import BtnPublish from "./components/btnPublish";
import BtnHandleCreateFc from "./components/btnHandleCreateFc";
import Border from "./components/border";
import Padding from "./components/padding";
import Dimension from "./components/dimension";
import BorderRadius from "./components/borderRadius";

const PropertiesBar = () => {
  const dispatch = useDispatch();
  const { activeData, activeId, data, layoutTypeScreen } = useSelector(
    (state: RootState) => state.dndSlice
  );

  const dataLayout = data[layoutTypeScreen];

  const [justifyShow, setJustifyShow] = useState<boolean>(false);
  const [alignShow, setAlignShow] = useState<boolean>(false);

  // properties state
  const [columns, setColumnsState] = useState<number | string>(
    Number(activeData?.columns) || ""
  );
  const [rows, setRowsState] = useState<number | string>(
    Number(activeData?.rows) || ""
  );
  const [colspan, setColspanState] = useState<number | string>(
    Number(activeData?.colspan) || ""
  );
  const [rowspan, setRowspanState] = useState<number | string>(
    Number(activeData?.rowspan) || ""
  );
  const [gap, setGap] = useState<number | string>(
    Number(activeData?.rowspan) || ""
  );
  const [justifyContent, setJustifyContent] = useState<number | string>(
    Number(activeData?.rowspan) || ""
  );
  const [alignItems, setAlignItems] = useState<number | string>(
    Number(activeData?.rowspan) || ""
  );

  const [styles, setStyles] = useState<React.CSSProperties>(activeData?.style);

  const [backGroundtype, setBackgroundType] = useState<"image" | "color">(
    "color"
  );
  const [modalBackground, setModalBackground] = useState<boolean>(false);
  // const [imagePreview, setthumbnailPreview] = useState<string | null>(null);

  const [isLayout, setIsLayout] = useState<"grid" | "flex" | "content" | any>(
    "grid"
  );

  const [dataSlice, setDataSlice] = useState<any>({
    title: "",
    url: "",
  });

  useEffect(() => {
    if (activeId) {
      if (dataLayout.id === activeId) {
        if (dataLayout.type === "grid") {
          setIsLayout("grid");
        } else if (dataLayout.type === "flex") {
          setIsLayout("flex");
        } else {
          setIsLayout("content");
        }
        setColumnsState(Number(dataLayout.columns));
        setRowsState(Number(dataLayout.rows));
        setColspanState(Number(dataLayout.colspan));
        setRowspanState(Number(dataLayout.rowspan));
        setGap(Number(dataLayout.gap));
        setJustifyContent(dataLayout.justifyContent);
        setAlignItems(dataLayout.alignItems);
        setStyles(dataLayout.style);
        setDataSlice(_.get(data, "dataSlice"));
        return; // Kết thúc sớm, không cần kiểm tra các `childs`
      }
      const getDetail = (childs: any) => {
        childs.map((child) => {
          if (child.id === activeId) {
            if (child.type === "grid") {
              setIsLayout("grid");
            } else if (child.type === "flex") {
              setIsLayout("flex");
            } else {
              setIsLayout("content");
            }
            setColumnsState(Number(child.columns));
            setRowsState(Number(child.rows));
            setColspanState(Number(child.colspan));
            setRowspanState(Number(child.rowspan));
            setGap(Number(child.gap));
            setJustifyContent(child.justifyContent);
            setAlignItems(child.alignItems);
            setStyles(child.style);
            setDataSlice(_.get(child, "dataSlice"));
          }
          if (child.childs) {
            getDetail(child.childs);
          }
        });
      };
      getDetail(dataLayout.childs);
    }
  }, [activeId]);

  // function store data to indexedDB
  const handleStoreDataToStorageAndState = (propsData: any) => {
    const serializedData = serializeFromJsonToString(propsData);
    cacheDataToIndexedDB(serializedData, "doc_1");
  };

  const SetPropertyJson = (id: any) => {
    const copyData: Obj = JSON.parse(JSON.stringify(dataLayout));

    if (id === copyData.id) {
      const childsList = copyData.childs;
      const newData = {
        ...copyData,
        columns: columns?.toString(),
        rows: rows?.toString(),
        colspan: colspan?.toString(),
        rowspan: rowspan?.toString(),
        gap: gap?.toString(),
        justifyContent: justifyContent?.toString(),
        alignItems: alignItems?.toString(),
        style: styles,
        childs: childsList,
        dataSlice,
        // thumbnail: thumbnail,
      };
      dispatch(setData(newData));
      return;
    }

    function RefactorData(child: Obj[]): Obj[] {
      return _.map(child, (item) => {
        if (item.id === id) {
          return {
            ...item,
            columns: columns?.toString(),
            rows: rows?.toString(),
            colspan: colspan?.toString(),
            rowspan: rowspan?.toString(),
            gap: gap?.toString(),
            justifyContent: justifyContent?.toString(),
            alignItems: alignItems?.toString(),
            style: styles,
            dataSlice,
            // thumbnail: thumbnail,
          };
        }

        if (item.childs) {
          return {
            ...item,
            childs: RefactorData(item.childs),
          };
        }

        return item;
      });
    }

    const updatedChilds = RefactorData(copyData.childs);

    const newData = { ...copyData, childs: updatedChilds };

    dispatch(setData(newData));
    if (newData?.childs?.length > 0) {
      handleStoreDataToStorageAndState({ ...copyData, childs: updatedChilds });
    }
  };

  useEffect(() => {
    SetPropertyJson(activeId);
  }, [
    colspan,
    rowspan,
    columns,
    rows,
    gap,
    justifyContent,
    alignItems,
    styles,
    dataSlice,
  ]);

  const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumnsState(e.target.value);
  };

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsState(e.target.value);
  };

  const handleColspanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColspanState(e.target.value);
  };

  const handleRowspanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowspanState(e.target.value);
  };
  const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGap(e.target.value);
  };
  const handleJustifyContentChange = (value: string) => {
    setJustifyContent(value);
  };
  const handleAlignItemsChange = (value: string) => {
    setAlignItems(value);
  };

  const handleMarginChange = (
    value: string | number,
    direction: "top" | "right" | "bottom" | "left",
    unit: string
  ) => {
    setStyles((prevStyles) => {
      const marginValues = (prevStyles?.margin || "0px 0px 0px 0px")
        .toString() // Đảm bảo là chuỗi
        .split(" "); // Chuyển thành mảng

      const directionIndex = { top: 0, right: 1, bottom: 2, left: 3 }[
        direction
      ]; // Lấy vị trí
      marginValues[directionIndex] = `${value}${unit}`; // Cập nhật giá trị kèm unit

      const newMargin = marginValues.join(" "); // Gộp lại thành chuỗi

      // Kiểm tra nếu tất cả các giá trị là 0
      if (
        marginValues.every(
          (val) =>
            val === "0px" || val === "0rem" || val === "0em" || val === "0%"
        )
      ) {
        const { margin, ...rest } = prevStyles; // Loại bỏ margin nếu tất cả giá trị là 0
        return rest;
      }

      return { ...prevStyles, margin: newMargin }; // Cập nhật margin nếu không phải 0
    });
  };

  const handleBackgroundColorChange = (newColor) => {
    if (!newColor.startsWith("#")) {
      newColor = `#${newColor}`;
    }
    setStyles((prevStyles) => {
      const updatedStyles = { ...prevStyles };
      delete updatedStyles.backgroundImage; // Xóa hình ảnh
      updatedStyles.backgroundColor = newColor; // Thêm màu mới
      return updatedStyles;
    });
  };

  const [backgroundImage, setBackgroundImage] = useState(
    "https://via.placeholder.com/300x200"
  );
  const handleBackgroundImageChange = (newImage) => {
    setBackgroundImage(newImage);
    setStyles((prevStyles) => {
      const updatedStyles = { ...prevStyles };
      delete updatedStyles.backgroundColor; // Xóa màu nền
      updatedStyles.backgroundImage = `url(${newImage})`; // Thêm hình ảnh mới
      return updatedStyles;
    });
  };

  const handleStyleChange = (property, value) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      [property]: value,
    }));
  };

  const handleDownloadAsJson = () => {
    const fileName = "JsonLayout";
    const exportType = exportFromJSON.types.json;

    exportFromJSON({ data, fileName, exportType });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      ToastError({ msg: "Please upload a valid image file." });
      return;
    }

    if (activeId) {
      const idCopy = activeId;
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;

        // Upload ảnh lên server
        const uploadedImageUrl = await uploadImageToServer(base64Image);

        if (uploadedImageUrl) {
          dispatch(setthumbnail(uploadedImageUrl));
          // setthumbnailPreview(uploadedImageUrl);
          ToastDismiss();
          ToastSuccess({ msg: "Image uploaded successfully!" });
          e.target.value = "";

          await PutData(`${import.meta.env.VITE__API_HOST}/api/slices`, {
            sliceId: idCopy,
            thumbnail: uploadedImageUrl,
          });

          const reloadSidebar = await GetData(
            `${import.meta.env.VITE__API_HOST}/api/slices?pId=${DecryptBasic(
              GetACookie("pid"),
              Enum.srkey
            )}&dId=${DecryptBasic(GetACookie("did"), Enum.srkey)}`
          );
          if (reloadSidebar) {
            dispatch(setSidebar(reloadSidebar));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (activeId) {
      const findActiveData = (data: Obj): Obj | null => {
        if (data.id === activeId) return data;
        if (data.childs) {
          for (const child of data.childs) {
            const found = findActiveData(child);
            if (found) return found;
          }
        }
        return null;
      };
      const currentActiveData = findActiveData(dataLayout);
      if (currentActiveData) {
        dispatch(setActiveData(currentActiveData));
      }
    }
  }, [activeId, dataLayout, dispatch]);

  if (!activeId || !activeData) {
    return null;
  }

  const uploadImageToServer = async (
    base64Image: string
  ): Promise<string | null> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE__API_HOST}/api/upload`,
        { image: base64Image, sliceId: activeId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // ToastSuccess({ msg: "Upload successfully!" });

        return response.data?.imageUrl;
      }
    } catch (error) {
      ToastError({ msg: "Error uploading image to server." });
      return null;
    }
  };

  return (
    <>
      {activeId && (
        <div className="h-[calc(100vh)] w-full animate-fade-left animate-duration-500 sticky top-4 right-0 rounded-l-xl flex-col flex items-center bg-gray-100 rounded-lg p-6 max-w-96 z-20 before:absolute before:content[] before:rounded-full before:w-full before:aspect-square before:bg-white before:z-0 before:-translate-y-[57%] overflow-scroll">
          <div className="flex items-center justify-center gap-4 h-fit z-10">
            <button
              onClick={() => handleDownloadAsJson()}
              className="h-10 aspect-square group hover:px-3 flex items-center hover:bg-slate-500 transition-all duration-500 justify-center w-10 hover:w-full  text-sm bg-[#444] text-white rounded-full"
            >
              <Icon icon="ph:arrow-line-down" fontSize={20} />
              <span className="text-nowrap opacity-0 select-none ml-0 group-hover:ml-2 pointer-events-none group-hover:opacity-100 w-0 group-hover:w-full transition-all duration-500">
                Download as JSON
              </span>
            </button>
            <BtnPublish />
            <BtnHandleCreateFc />
          </div>
          <span className="mx-auto w-full text-center font-semibold text-gray-500 capitalize text-normal  z-10 mt-12">
            Properties of
          </span>

          {isLayout === "content" && (
            <span
              className={`animate-fade-up w-full text-center font-semibold text-3xl capitalize px-4 py-2 z-10`}
            >
              {formatText(activeId)}
            </span>
          )}
          {isLayout === "grid" && (
            <span
              className={`animate-fade-up w-full text-center font-semibold text-3xl capitalize px-4 py-2 z-10`}
            >
              {isLayout + " layout"}
            </span>
          )}
          {isLayout === "flex" && (
            <span
              className={`animate-fade-up w-full text-center font-semibold text-3xl capitalize px-4 py-2 z-10`}
            >
              {isLayout + " layout"}
            </span>
          )}

          <div className="flex flex-col w-full z-10 mt-12">
            <Reponsive />

            <div className="grid grid-cols-2 gap-6">
              {isLayout && (
                <div className="flex flex-col items-start mt-3 animate-fade-up">
                  <span className="text-sm font-medium text-gray-400">
                    Columns span
                  </span>
                  <input
                    type="number"
                    value={colspan}
                    onChange={handleColspanChange}
                    className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
                    min="1"
                  />
                </div>
              )}
              {isLayout && (
                <div className="flex flex-col items-start mt-3 animate-fade-up">
                  <span className="text-sm font-medium text-gray-400">
                    Rows span
                  </span>
                  <input
                    type="number"
                    value={rowspan}
                    onChange={handleRowspanChange}
                    className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
                    min="1"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6">
              {isLayout === "grid" && (
                <div className="flex flex-col items-start mt-3 animate-fade-up">
                  <span className="text-sm font-medium text-gray-400">
                    Columns
                  </span>
                  <input
                    type="number"
                    value={columns}
                    onChange={handleColumnChange}
                    className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
                    min="0"
                  />
                </div>
              )}
              {isLayout === "grid" && (
                <div className="flex flex-col items-start mt-3 animate-fade-up">
                  <span className="text-sm font-medium text-gray-400">
                    Rows
                  </span>
                  <input
                    type="number"
                    value={rows}
                    onChange={handleRowChange}
                    className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
                    min="0"
                  />
                </div>
              )}
            </div>
            {(isLayout === "grid" || isLayout === "flex") && (
              <div className="flex flex-col items-start mt-3 animate-fade-up">
                <span className="text-sm font-medium text-gray-400">Gap</span>
                <input
                  type="number"
                  value={gap}
                  onChange={handleGapChange}
                  className="h-10 w-full border appearance-none rounded-lg focus-visible:outline-none px-3"
                  min="1"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              {(isLayout === "flex" || isLayout === "grid") && (
                <div className="flex flex-col items-start mt-3 animate-fade-up z-[50]">
                  <span className="text-sm font-medium text-gray-400">
                    Justify Content
                  </span>
                  <div
                    className={`h-10 relative w-full border border-gray-300  rounded-lg flex-col px-3 py-2 bg-white`}
                    onClick={() =>
                      setJustifyShow((prev) => {
                        !prev === true && setAlignShow(false);
                        return !prev;
                      })
                    }
                  >
                    <span>{justifyContent}</span>
                    <div
                      className={`flex-col rounded-xl absolute w-full left-0 shadow-xl top-full bg-white  overflow-hidden ${
                        justifyShow ? "flex" : "hidden"
                      }`}
                    >
                      {justifyList.map((item, index) => (
                        <span
                          key={index}
                          className={`w-full hover:bg-slate-100 transition-all duration-500 cursor-pointer px-4 py-2 ${
                            justifyContent === item.title && "bg-slate-100"
                          }`}
                          onClick={() => handleJustifyContentChange(item.title)}
                        >
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {(isLayout === "flex" || isLayout === "grid") && (
                <div className="flex flex-col items-start mt-3 animate-fade-up z-[50]">
                  <span className="text-sm font-medium text-gray-400">
                    Align Items
                  </span>
                  <div
                    className={`h-10 relative w-full border border-gray-300 rounded-lg flex-col px-3 py-2 bg-white `}
                    onClick={() =>
                      setAlignShow((prev) => {
                        !prev === true && setJustifyShow(false);
                        return !prev;
                      })
                    }
                  >
                    <span>{alignItems}</span>
                    <div
                      className={`flex-col rounded-xl absolute top-full shadow-xl w-full left-0 bg-white overflow-hidden ${
                        alignShow ? "flex" : "hidden"
                      }`}
                    >
                      {alignList.map((item, index) => (
                        <span
                          key={index}
                          className={`w-full hover:bg-slate-100 transition-all duration-500 cursor-pointer px-4 py-2 ${
                            alignItems === item.title && "bg-slate-100"
                          }`}
                          onClick={() => handleAlignItemsChange(item.title)}
                        >
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* SYTLING */}
            </div>
            <div className="flex flex-col w-full mt-6">
              <div className="border border-slate-300 h-[1px]"></div>
              <div className="flex flex-col items-start mt-3 animate-fade-up">
                <span className="text-xl font-medium text-gray-700">
                  Styling
                </span>
                {isLayout === "content" && (
                  <div className="flex flex-col mt-3 mb-4  animate-fade-up ">
                    <label className="text-sm font-medium text-gray-400">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="h-10 w-full border rounded-lg px-3 mt-2"
                    />
                    {!activeData.thumbnail && (
                      <div className="mt-2">
                        <img
                          src={activeData.thumbnail}
                          alt="Preview"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                    {activeData.thumbnail && (
                      <div className="mt-2">
                        <img
                          src={activeData.thumbnail}
                          alt="Preview"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-4 w-full mt-6">
                  {/* DIMENSION */}
                  <Dimension styles={styles} setStyles={setStyles} />

                  {/* PADDING */}
                  <Padding styles={styles} setStyles={setStyles} />

                  {/* MARGIN */}
                  <details className="group w-full [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
                      <span className="font-semibold text-gray-800 capitalize">
                        Margin
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

                    <ul className="grid grid-cols-2 gap-3 w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
                      {["margin"].map((property, index) => {
                        const marginValue = styles?.hasOwnProperty(property)
                          ? styles[property as keyof typeof styles]
                          : "0px 0px 0px 0px";
                        const [top, right, bottom, left] = splitDimensions(
                          String(marginValue)
                        );

                        return (
                          <div key={index + "Margin"}>
                            <li key="top">
                              <span className="text-sm font-medium text-gray-400">
                                Top
                              </span>
                              <DimensionInput
                                defaultValue={Number.parseInt(top)} // Chuyển đổi thành số
                                defaultUnit={top.replace(/[0-9]/g, "")} // Lấy đơn vị (px, em, rem, ...)
                                onChange={(value) =>
                                  handleMarginChange(
                                    value.inputValue,
                                    "top",
                                    value.unit
                                  )
                                }
                              />
                            </li>
                            <li key="right">
                              <span className="text-sm font-medium text-gray-400">
                                Right
                              </span>
                              <DimensionInput
                                defaultValue={Number.parseInt(right)}
                                defaultUnit={right.replace(/[0-9]/g, "")}
                                onChange={(value) =>
                                  handleMarginChange(
                                    value.inputValue,
                                    "right",
                                    value.unit
                                  )
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
                                  handleMarginChange(
                                    value.inputValue,
                                    "bottom",
                                    value.unit
                                  )
                                }
                              />
                            </li>
                            <li key="left">
                              <span className="text-sm font-medium text-gray-400">
                                Left
                              </span>
                              <DimensionInput
                                defaultValue={Number.parseInt(left)}
                                defaultUnit={left.replace(/[0-9]/g, "")}
                                onChange={(value) =>
                                  handleMarginChange(
                                    value.inputValue,
                                    "left",
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

                  {/* BACKGROUND */}
                  <details className="group w-full  [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg border bg-white p-4 text-gray-900">
                      <span className="font-semibold text-gray-800 capitalize">
                        Background
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
                    <div className="flex items-center justify-center border border-slate-100 bg-white">
                      <button
                        title="Image"
                        className={`h-10 w-full ${
                          backGroundtype === "image" && "bg-slate-200"
                        } flex justify-center items-center`}
                        onClick={() => setBackgroundType("image")}
                      >
                        <Icon icon="tabler:photo-filled" />
                      </button>
                      <button
                        title="Color"
                        className={`h-10 w-full ${
                          backGroundtype === "color" && "bg-slate-200"
                        } flex justify-center items-center`}
                        onClick={() => setBackgroundType("color")}
                      >
                        <Icon icon="tabler:color-filter" />
                      </button>
                    </div>
                    {backGroundtype === "color" ? (
                      <ul className="grid grid-cols-1 gap-3 w-full p-4 bg-white shadow-lg rounded-b-xl">
                        <li>
                          <span className="text-sm font-medium text-gray-400">
                            Color
                          </span>
                          <ColorPickerInput
                            value={styles?.backgroundColor}
                            onChange={handleBackgroundColorChange}
                          />
                        </li>
                      </ul>
                    ) : (
                      <ul className="grid grid-cols-2 gap-3 w-full p-4 bg-white shadow-lg rounded-b-xl">
                        <li className="col-span-2">
                          <div className="aspect-[6/2]">
                            <div
                              className="w-full h-full bg-slate-300 flex justify-center items-center cursor-pointer"
                              onClick={() => setModalBackground(true)}
                            >
                              <img
                                src={
                                  (styles &&
                                    styles?.backgroundImage &&
                                    extractImageUrl(styles?.backgroundImage)) ||
                                  "https://via.placeholder.com/300x200"
                                }
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </li>
                        <li>
                          <span className="text-sm font-medium text-gray-400">
                            Repeat
                          </span>
                          <div className="flex items-center justify-center gap-2">
                            <select
                              id="repeat"
                              className="border border-gray-300 appearance-none h-10 px-2 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block cursor-pointer"
                              value={styles?.backgroundRepeat}
                              onChange={(e) =>
                                handleStyleChange(
                                  "backgroundRepeat",
                                  e.target.value
                                )
                              }
                            >
                              <option value="no-repeat">None repeat</option>
                              <option value="repeat">Repeat</option>
                              <option value="repeat-x">Repeat X</option>
                              <option value="repeat-y">Repeat Y</option>
                              <option value="space">Space</option>
                              <option value="round">Round</option>
                            </select>
                          </div>
                        </li>
                        <li>
                          <span className="text-sm font-medium text-gray-400">
                            Size
                          </span>
                          <div className="flex items-center justify-center gap-2">
                            <select
                              id="size"
                              className="border border-gray-300 appearance-none h-10 px-2 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block cursor-pointer"
                              value={styles?.backgroundSize}
                              onChange={(e) =>
                                handleStyleChange(
                                  "backgroundSize",
                                  e.target.value
                                )
                              }
                            >
                              <option value="auto">Auto</option>
                              <option value="cover">Cover</option>
                              <option value="contain">Contain</option>
                            </select>
                          </div>
                        </li>
                        <li>
                          <span className="text-sm font-medium text-gray-400">
                            Position
                          </span>
                          <div className="flex items-center justify-center gap-2">
                            <select
                              id="position"
                              className="border border-gray-300 appearance-none h-10 px-2 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block cursor-pointer"
                              value={styles?.backgroundPosition}
                              onChange={(e) =>
                                handleStyleChange(
                                  "backgroundPosition",
                                  e.target.value
                                )
                              }
                            >
                              <option value="center">Center</option>
                              <option value="top">Top</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                              <option value="bottom">Bottom</option>
                            </select>
                          </div>
                        </li>
                        <li>
                          <span className="text-sm font-medium text-gray-400">
                            Attachment
                          </span>
                          <div className="flex items-center justify-center gap-2">
                            <select
                              id="attachment"
                              className="border border-gray-300 appearance-none h-10 px-2 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block cursor-pointer"
                              value={styles?.backgroundAttachment}
                              onChange={(e) =>
                                handleStyleChange(
                                  "backgroundAttachment",
                                  e.target.value
                                )
                              }
                            >
                              <option value="scroll">Scroll</option>
                              <option value="fixed">Fixed</option>
                              <option value="local">Local</option>
                            </select>
                          </div>
                        </li>
                      </ul>
                    )}
                  </details>

                  {/* BORDER */}
                  <Border styles={styles} setStyles={setStyles} />

                  {/* BORDER RADIUS */}
                  <BorderRadius styles={styles} setStyles={setStyles} />

                  {/* DATA */}
                  <DataSlice
                    dataSlice={dataSlice}
                    setDataSlice={setDataSlice}
                    activeData={activeData}
                    activeId={activeId}
                  />

                  {/* POSITION */}
                  <Position styles={styles} setStyles={setStyles} />

                  {/* Text Styles */}
                  <TextStyles styles={styles} setStyles={setStyles} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertiesBar;
