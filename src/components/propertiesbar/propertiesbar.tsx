import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
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
import DimensionInput from "../commom/input";
import { splitDimensions, splitValueAndUnit } from "../../utilities/text";
import ColorPickerInput from "../commom/color";
import BackgroundChoosen from "../commom/background-choosen";
import {
  cacheDataToIndexedDB,
  getCachedDataFromIndexedDB,
} from "../../services/indexedDB/services";
import { saveDocument } from "../../services/documents/api";
import { transformData } from "../../utilities/formatData";
import { DecryptBasic } from "../../utilities/hash_aes";
import { GetACookie } from "../../utilities/cookies";
import { Enum } from "../../config/common";
import { GetData, PostData, PutData } from "../../apis";

const justifyList = [
  {
    title: "flex-start",
  },
  {
    title: "center",
  },
  {
    title: "flex-end",
  },
  {
    title: "space-between",
  },
  {
    title: "space-around",
  },
  {
    title: "space-evenly",
  },
];
const alignList = [
  {
    title: "flex-start",
  },
  {
    title: "center",
  },
  {
    title: "flex-end",
  },
  {
    title: "stretch",
  },
  {
    title: "baseline",
  },
];

const PropertiesBar = () => {
  const dispatch = useDispatch();
  const { activeData, activeId, data, thumbnail } = useSelector(
    (state: RootState) => state.dndSlice
  );

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
  const [imagePreview, setthumbnailPreview] = useState<string | null>(null);

  const [isLayout, setIsLayout] = useState<"grid" | "flex" | "content" | any>(
    "grid"
  );

  useEffect(() => {
    if (activeId) {
      if (data.id === activeId) {
        if (data.type === "grid") {
          setIsLayout("grid");
        } else if (data.type === "flex") {
          setIsLayout("flex");
        } else {
          setIsLayout("content");
        }
      }
      const getDetail = (childs: any[]) => {
        childs.map(child => {
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
          }
          if (child.childs) {
            getDetail(child.childs);
          }
        });
      };
      getDetail(data.childs);
    }
  }, [activeId]);

  // function store data to indexedDB
  const handleStoreDataToStorageAndState = (propsData: any) => {
    const serializedData = serializeFromJsonToString(propsData);
    cacheDataToIndexedDB(serializedData, "doc_1");
  };

  const SetPropertyJson = (id: any) => {
    const copyData: Obj = JSON.parse(JSON.stringify(data));
    if (id === copyData.id) {
      const childsList = copyData.childs;
      dispatch(
        setData({
          ...copyData,
          columns: columns.toString(),
          rows: rows.toString(),
          colspan: colspan.toString(),
          rowspan: rowspan.toString(),
          gap: gap.toString(),
          justifyContent: justifyContent.toString(),
          alignItems: alignItems.toString(),
          style: styles,
          childs: childsList,
          thumbnail: thumbnail,
        })
      );
      return;
    }

    function RefactorData(child: Obj[]): Obj[] {
      return child.map(item => {
        if (item.id === id) {
          return {
            ...item,
            columns: columns.toString(),
            rows: rows.toString(),
            colspan: colspan.toString(),
            rowspan: rowspan.toString(),
            gap: gap.toString(),
            justifyContent: justifyContent.toString(),
            alignItems: alignItems.toString(),
            style: styles,
            thumbnail: thumbnail,
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
    thumbnail,
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

  const handleDimensionChange = (
    value: string | number,
    property: "width" | "height" | "maxWidth" | "maxHeight",
    unit: string
  ) => {
    if (value === 0 || value === "0") {
      // Không trả về giá trị nếu là 0
      setStyles(prevStyles => {
        const newStyles = { ...prevStyles };
        delete newStyles[property]; // Xóa thuộc tính nếu giá trị là 0
        return newStyles;
      });
    } else {
      setStyles(prevStyles => ({
        ...prevStyles,
        [property]: `${value}${unit}`, // Cập nhật giá trị nếu khác 0
      }));
    }
  };

  const handlePaddingChange = (
    value: string | number,
    direction: "top" | "right" | "bottom" | "left",
    unit: string
  ) => {
    setStyles(prevStyles => {
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
          val =>
            val === "0px" || val === "0rem" || val === "0em" || val === "0%"
        )
      ) {
        const { padding, ...rest } = prevStyles; // Loại bỏ padding nếu tất cả giá trị là 0
        return rest;
      }

      return { ...prevStyles, padding: newPadding }; // Cập nhật padding nếu không phải 0
    });
  };

  const handleMarginChange = (
    value: string | number,
    direction: "top" | "right" | "bottom" | "left",
    unit: string
  ) => {
    setStyles(prevStyles => {
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
          val =>
            val === "0px" || val === "0rem" || val === "0em" || val === "0%"
        )
      ) {
        const { margin, ...rest } = prevStyles; // Loại bỏ margin nếu tất cả giá trị là 0
        return rest;
      }

      return { ...prevStyles, margin: newMargin }; // Cập nhật margin nếu không phải 0
    });
  };

  const handleBackgroundColorChange = newColor => {
    if (!newColor.startsWith("#")) {
      newColor = `#${newColor}`;
    }
    setStyles(prevStyles => {
      const updatedStyles = { ...prevStyles };
      delete updatedStyles.backgroundImage; // Xóa hình ảnh
      updatedStyles.backgroundColor = newColor; // Thêm màu mới
      return updatedStyles;
    });
  };

  const [backgroundImage, setBackgroundImage] = useState(
    "https://via.placeholder.com/300x200"
  );
  const handleBackgroundImageChange = newImage => {
    setBackgroundImage(newImage);
    setStyles(prevStyles => {
      const updatedStyles = { ...prevStyles };
      delete updatedStyles.backgroundColor; // Xóa màu nền
      updatedStyles.backgroundImage = `url(${newImage})`; // Thêm hình ảnh mới
      return updatedStyles;
    });
  };

  const handleStyleChange = (property, value) => {
    setStyles(prevStyles => ({
      ...prevStyles,
      [property]: value,
    }));
  };

  const handleBorderChange = (
    value: string | number,
    property: "width" | "style" | "color",
    unit?: string
  ) => {
    setStyles(prevStyles => {
      const newStyles = { ...prevStyles };

      // Khởi tạo border nếu chưa tồn tại
      if (!newStyles?.border) {
        newStyles.border = "none"; // Giá trị mặc định
      }

      // Kiểm tra nếu border là chuỗi, nếu không thì chuyển thành chuỗi
      const borderParts =
        typeof newStyles?.border === "string"
          ? newStyles?.border.split(" ")
          : ["0px", "solid", "black"];

      if (property === "width") {
        borderParts[0] = `${value}${unit || "px"}`; // Cập nhật width
      } else if (property === "style") {
        borderParts[1] = value as string; // Cập nhật style
      } else if (property === "color") {
        borderParts[2] = value as string; // Cập nhật color
      }

      // Cập nhật lại chuỗi border
      newStyles.border = borderParts.join(" ");

      return newStyles;
    });
  };

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
      setStyles(prevStyles => {
        const newStyles = { ...prevStyles };
        delete newStyles[corner];
        return newStyles;
      });
    } else {
      // Cập nhật giá trị của góc nếu giá trị khác 0
      setStyles(prevStyles => ({
        ...prevStyles,
        [corner]: `${value}${unit}`,
      }));
    }
  };

  useEffect(() => {
    if (styles) {
      console.log("🚀 ~ useEffect ~ styles:", styles);
    }
  }, [styles]);

  const handleDownloadAsJson = () => {
    const fileName = "JsonLayout";
    const exportType = exportFromJSON.types.json;

    exportFromJSON({ data, fileName, exportType });
  };

  const handlePublishJsonData = async () => {
    // const layoutJSON = await getCachedDataFromIndexedDB(
    //   DecryptBasic(GetACookie("did"), Enum.srkey)
    // );
    console.log(JSON.stringify(data));

    const getDoc = await axios.get(
      `${import.meta.env.VITE__API_HOST}/api/documents?dId=${DecryptBasic(
        GetACookie("did"),
        Enum.srkey
      )}`
    );
    const documentData = {
      projectId: DecryptBasic(GetACookie("pid"), Enum.srkey),
      documentId: DecryptBasic(GetACookie("did"), Enum.srkey),
      layoutJson: data,
      documentName:
        (getDoc.status === 200 || getDoc.status === 201) &&
        getDoc.data?.documentName,
      thumbnail: "_",
    };

    try {
      const finalData = transformData(
        data,
        DecryptBasic(GetACookie("pid"), Enum.srkey),
        DecryptBasic(GetACookie("did"), Enum.srkey)
      );

      if (finalData) {
        const saveDocResponse = await axios.post(
          `${import.meta.env.VITE__API_HOST}/api/documents`,
          documentData
        );

        const response = await axios.post(
          `${import.meta.env.VITE__API_HOST}/publish`,
          data
        );
        if (response.status === 200 || response.status === 201) {
          ToastSuccess({ msg: "Published successfully" });
        } else {
          ToastError({
            msg: "Oops! Something went wrong to available publish",
          });
        }
      }
    } catch (error) {
      //
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
      const currentActiveData = findActiveData(data);
      if (currentActiveData) {
        dispatch(setActiveData(currentActiveData));
      }
    }
  }, [activeId, data, dispatch]);

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
          setthumbnailPreview(uploadedImageUrl);
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

  if (!activeId || !activeData) {
    return null;
  }

  const uploadImageToServer = async (
    base64Image: string
  ): Promise<string | null> => {
    try {
      const response = await axios.post(
        "https://serverless-tn-layout-production.up.railway.app/api/upload",
        { image: base64Image },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server Response:", response.data);

      if (response.status === 200 || response.status === 201) {
        // ToastSuccess({ msg: "Upload successfully!" });

        return response.data?.imageUrl;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
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
              className="h-10 aspect-square group hover:px-3 flex items-center hover:bg-slate-500 transition-all duration-500 justify-center w-10 hover:w-full  text-sm bg-[#444] text-white rounded-full">
              <Icon icon="ph:arrow-line-down" fontSize={20} />
              <span className="text-nowrap opacity-0 select-none ml-0 group-hover:ml-2 pointer-events-none group-hover:opacity-100 w-0 group-hover:w-full transition-all duration-500">
                Download as JSON
              </span>
            </button>
            <button
              onClick={() => handlePublishJsonData()}
              className="h-10 px-4  text-sm bg-[#444] text-white rounded-full">
              Publish
            </button>
          </div>
          <span className="mx-auto w-full text-center font-semibold text-gray-500 capitalize text-normal  z-10 mt-12">
            Properties of
          </span>

          {isLayout === "content" && (
            <span
              className={`animate-fade-up w-full text-center font-semibold text-3xl capitalize px-4 py-2 z-10`}>
              {formatText(activeId)}
            </span>
          )}
          {isLayout === "grid" && (
            <span
              className={`animate-fade-up w-full text-center font-semibold text-3xl capitalize px-4 py-2 z-10`}>
              {isLayout + " layout"}
            </span>
          )}
          {isLayout === "flex" && (
            <span
              className={`animate-fade-up w-full text-center font-semibold text-3xl capitalize px-4 py-2 z-10`}>
              {isLayout + " layout"}
            </span>
          )}

          <div className="flex flex-col w-full z-10 mt-12">
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
              {isLayout === "flex" && (
                <div className="flex flex-col items-start mt-3 animate-fade-up z-[50]">
                  <span className="text-sm font-medium text-gray-400">
                    Justify Content
                  </span>
                  <div
                    className={`h-10 relative w-full border border-gray-300  rounded-lg flex-col px-3 py-2 bg-white`}
                    onClick={() =>
                      setJustifyShow(prev => {
                        !prev === true && setAlignShow(false);
                        return !prev;
                      })
                    }>
                    <span>{justifyContent}</span>
                    <div
                      className={`flex-col rounded-xl absolute w-full left-0 shadow-xl top-full bg-white  overflow-hidden ${
                        justifyShow ? "flex" : "hidden"
                      }`}>
                      {justifyList.map((item, index) => (
                        <span
                          key={index}
                          className={`w-full hover:bg-slate-100 transition-all duration-500 cursor-pointer px-4 py-2 ${
                            justifyContent === item.title && "bg-slate-100"
                          }`}
                          onClick={() =>
                            handleJustifyContentChange(item.title)
                          }>
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {isLayout === "flex" && (
                <div className="flex flex-col items-start mt-3 animate-fade-up z-[50]">
                  <span className="text-sm font-medium text-gray-400">
                    Align Items
                  </span>
                  <div
                    className={`h-10 relative w-full border border-gray-300 rounded-lg flex-col px-3 py-2 bg-white `}
                    onClick={() =>
                      setAlignShow(prev => {
                        !prev === true && setJustifyShow(false);
                        return !prev;
                      })
                    }>
                    <span>{alignItems}</span>
                    <div
                      className={`flex-col rounded-xl absolute top-full shadow-xl w-full left-0 bg-white overflow-hidden ${
                        alignShow ? "flex" : "hidden"
                      }`}>
                      {alignList.map((item, index) => (
                        <span
                          key={index}
                          className={`w-full hover:bg-slate-100 transition-all duration-500 cursor-pointer px-4 py-2 ${
                            alignItems === item.title && "bg-slate-100"
                          }`}
                          onClick={() => handleAlignItemsChange(item.title)}>
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
                    {!imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                    {imagePreview && activeData.thumbnail && (
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
                  <details
                    className="group w-full [&_summary::-webkit-details-marker]:hidden"
                    open>
                    <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
                      <span className="font-semibold text-gray-800 capitalize">
                        Dimension
                      </span>
                      <svg
                        className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <ul className="grid grid-cols-2 gap-3 w-full mt-2 p-4 border bg-white shadow-lg rounded-b-xl">
                      {["width", "height", "maxWidth", "maxHeight"].map(
                        property => {
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
                                onChange={value =>
                                  handleDimensionChange(
                                    value.inputValue,
                                    property as any,
                                    value.unit
                                  )
                                }
                              />
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </details>
                  {/* PADDING */}
                  <details className="group w-full [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center w-full justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
                      <span className="font-semibold text-gray-800 capitalize">
                        Padding
                      </span>
                      <svg
                        className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
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
                              <span className="text-sm font-medium text-gray-400">
                                Top
                              </span>
                              <DimensionInput
                                defaultValue={Number.parseInt(top)} // Chuyển đổi thành số
                                defaultUnit={top.replace(/[0-9]/g, "")} // Lấy đơn vị (px, em, rem, ...)
                                onChange={value =>
                                  handlePaddingChange(
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
                                onChange={value =>
                                  handlePaddingChange(
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
                                onChange={value =>
                                  handlePaddingChange(
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
                                onChange={value =>
                                  handlePaddingChange(
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
                        stroke="currentColor">
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
                                onChange={value =>
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
                                onChange={value =>
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
                                onChange={value =>
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
                                onChange={value =>
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
                        stroke="currentColor">
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
                        onClick={() => setBackgroundType("image")}>
                        <Icon icon="tabler:photo-filled" />
                      </button>
                      <button
                        title="Color"
                        className={`h-10 w-full ${
                          backGroundtype === "color" && "bg-slate-200"
                        } flex justify-center items-center`}
                        onClick={() => setBackgroundType("color")}>
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
                              onClick={() => setModalBackground(true)}>
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
                              onChange={e =>
                                handleStyleChange(
                                  "backgroundRepeat",
                                  e.target.value
                                )
                              }>
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
                              onChange={e =>
                                handleStyleChange(
                                  "backgroundSize",
                                  e.target.value
                                )
                              }>
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
                              onChange={e =>
                                handleStyleChange(
                                  "backgroundPosition",
                                  e.target.value
                                )
                              }>
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
                              onChange={e =>
                                handleStyleChange(
                                  "backgroundAttachment",
                                  e.target.value
                                )
                              }>
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
                  <details className="group w-full  [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
                      <span className="font-semibold text-gray-800 capitalize">
                        Border
                      </span>
                      <svg
                        className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <ul className="grid grid-cols-2 gap-3 w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
                      <li>
                        <span className="text-sm font-medium text-gray-400">
                          Width
                        </span>
                        <DimensionInput
                          defaultValue={parseInt(
                            styles?.border && typeof styles?.border === "string"
                              ? styles?.border.split(" ")[0]
                              : "0"
                          )}
                          onChange={value =>
                            handleBorderChange(
                              value?.inputValue,
                              "width",
                              value?.unit
                            )
                          }
                        />
                      </li>
                      <li>
                        <span className="text-sm font-medium text-gray-400">
                          Style
                        </span>
                        <select
                          value={
                            styles?.border && typeof styles?.border === "string"
                              ? styles?.border.split(" ")[1]
                              : "solid"
                          }
                          onChange={e =>
                            handleBorderChange(e.target.value, "style")
                          }
                          className="border border-gray-300 appearance-none h-10 px-2 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block cursor-pointer">
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
                        <span className="text-sm font-medium text-gray-400">
                          Color
                        </span>
                        <ColorPickerInput
                          value={
                            styles?.border && typeof styles?.border === "string"
                              ? styles?.border.split(" ")[2]
                              : "#000000"
                          }
                          onChange={color => handleBorderChange(color, "color")}
                        />
                      </li>
                    </ul>
                  </details>
                  {/* BORDER RADIUS */}
                  <details className="group w-full  [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
                      <span className="font-semibold text-gray-800 capitalize">
                        Radius
                      </span>
                      <svg
                        className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
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
                        const [topLeft, topRight, bottomRight, bottomLeft] =
                          splitDimensions(String(radiusValue));

                        return (
                          <div key={index + "radius"}>
                            <li key="topLeft">
                              <span className="text-sm font-medium text-gray-400">
                                Top Left
                              </span>
                              <DimensionInput
                                defaultValue={Number.parseInt(topLeft)}
                                defaultUnit={
                                  topLeft.replace(/[0-9]/g, "") || "px"
                                }
                                onChange={value =>
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
                                defaultUnit={
                                  topRight.replace(/[0-9]/g, "") || "px"
                                }
                                onChange={value =>
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
                                defaultUnit={
                                  bottomRight.replace(/[0-9]/g, "") || "px"
                                }
                                onChange={value =>
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
                                defaultUnit={
                                  bottomLeft.replace(/[0-9]/g, "") || "px"
                                }
                                onChange={value =>
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