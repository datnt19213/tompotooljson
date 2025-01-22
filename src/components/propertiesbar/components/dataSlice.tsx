import _ from "lodash";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Input } from "../../commom/input";
import { ToastDismiss, ToastError, ToastSuccess } from "../../toast";
import { setActiveData } from "../../../store/DndSlice";

const DataSlice = ({ activeData, activeId, dataSlice, setDataSlice }) => {
  const dispatch = useDispatch();
  const [titles, setTitles] = useState(_.get(dataSlice, "titles", {}));

  useEffect(() => {
    setDataSlice((prev) => ({ ...prev, titles }));
  }, [titles, setDataSlice]);

  // useEffect(() => {
  //   setTitles(_.get(dataSlice, "titles", {}));
  // }, [dataSlice]);

  const debouncedDispatch = useCallback(
    _.debounce((newDataSlice) => {
      dispatch(setActiveData({ ...activeData, dataSlice: newDataSlice }));
    }, 1000),
    []
  );

  const handleTitleSingleChange = (title: any) => {
    setDataSlice((prev) => ({ ...prev, title }));
    debouncedDispatch({ ...dataSlice, title });
  };

  const uploadMediaToServer = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("media", file); // The key must match "media" in the backend

      const response = await axios.post(
        `${import.meta.env.VITE__API_HOST}/api/uploadMedia`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        return response.data?.mediaUrl; // Adjusted to match the updated backend response
      }
    } catch (error) {
      ToastError({ msg: "Error uploading media to server." });
      return null;
    }
  };

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      ToastError({ msg: "Please upload a valid image or video file." });
      return;
    }

    if (activeId) {
      const idCopy = activeId;
      const reader = new FileReader();
      reader.onload = async () => {
        const uploadedMediaUrl = await uploadMediaToServer(file);

        if (uploadedMediaUrl) {
          const newdataSlice = {
            ...dataSlice,
            url: uploadedMediaUrl,
          };
          setDataSlice((prev) => ({ ...prev, url: uploadedMediaUrl }));
          dispatch(setActiveData({ ...activeData, dataSlice: newdataSlice }));
          ToastDismiss();
          ToastSuccess({
            msg: `${isImage ? "Image" : "Video"} uploaded successfully!`,
          });
          e.target.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDirectorChange = (field: string, value: string) => {
    setDataSlice((prev) => ({
      ...prev,
      [field]: value,
    }));

    debouncedDispatch({
      ...dataSlice,
      [field]: value,
    });
  };

  const handleInputChange = (key, value) => {
    setTitles((prev) => ({
      ...prev,
      [key]: { ...prev[key], text: value },
    }));
    debouncedDispatch({
      ...dataSlice,
      titles: { ...titles, [key]: { ...titles[key], text: value } },
    });
  };

  const handleColorChange = (key, color) => {
    setTitles((prev) => ({
      ...prev,
      [key]: { ...prev[key], color },
    }));
    debouncedDispatch({
      ...dataSlice,
      titles: { ...titles, [key]: { ...titles[key], color } },
    });
  };

  const addTitle = () => {
    const newKey = `title_${Object.keys(titles).length + 1}`;
    setTitles((prev) => ({
      ...prev,
      [newKey]: { text: "", color: "#000000" },
    }));
  };

  const removeTitle = (key) => {
    const updatedTitles = { ...titles };
    delete updatedTitles[key];
    setTitles(updatedTitles);
    debouncedDispatch({ ...dataSlice, titles: updatedTitles });
  };

  const handleGradientChange = (key, value) => {
    setTitles((prev) => ({
      ...prev,
      [key]: { ...prev[key], gradient: value },
    }));
    debouncedDispatch({
      ...dataSlice,
      titles: { ...titles, [key]: { ...titles[key], gradient: value } },
    });
  };

  return (
    <details>
      <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
        <span className="font-semibold text-gray-800 capitalize">Data</span>
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
          <div className="flex items-center justify-start p-4 gap-1.5">
            <div className="">Title:</div>
            <Input
              onChange={handleTitleSingleChange}
              defaultValue={_.get(dataSlice, "title", "")}
            />
          </div>
        </li>
        <li>
          <div className="flex flex-col mt-3 mb-4 p-4  animate-fade-up ">
            <label className="text-sm font-medium text-gray-400">
              Upload Image/Videos
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="h-10 w-full border rounded-lg px-3 mt-2"
            />
            {!_.isEmpty(activeData.dataSlice) && (
              <div className="mt-2">
                {_.get(activeData, "dataSlice.url")?.match(
                  /\.(jpeg|jpg|gif|png|svg|webp)$/i
                ) ? (
                  <img
                    src={_.get(activeData, "dataSlice.url")}
                    alt="Preview"
                    className="w-full h-auto rounded-lg"
                  />
                ) : _.get(activeData, "dataSlice.url")?.match(
                    /\.(mp4|mov|avi|mkv|webm)$/i
                  ) ? (
                  <video
                    src={_.get(activeData, "dataSlice.url")}
                    controls
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <p>Unsupported media type</p>
                )}
              </div>
            )}
          </div>
        </li>

        {/* Link & Routes */}
        <li>
          <div className="flex flex-col mt-3 mb-4 p-4 animate-fade-up">
            <label className="text-sm font-medium text-gray-400">Link</label>
            <Input
              onChange={(value) => handleDirectorChange("link", value)}
              defaultValue={_.get(dataSlice, "link", "")}
              // className="h-10 w-full border rounded-lg px-3 mt-2"
            />
          </div>
        </li>
        <li>
          <div className="flex flex-col mt-3 mb-4 p-4 animate-fade-up">
            <label className="text-sm font-medium text-gray-400">Routes</label>
            <Input
              onChange={(value) => handleDirectorChange("route", value)}
              defaultValue={_.get(dataSlice, "route", "")}
              // className="h-10 w-full border rounded-lg px-3 mt-2"
            />
          </div>
        </li>

        {/* TITLE SECTION */}
        <li>
          <div className="flex flex-col p-4 gap-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Title Sections:</span>
              <button
                onClick={addTitle}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Title
              </button>
            </div>

            {Object.keys(_.get(dataSlice, "titles", {})).map((key) => {
              const item = _.get(dataSlice, "titles")[key];
              console.log("dataSlice1", item);

              return (
                <div key={key} className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Input
                      onChange={(e) => handleInputChange(key, e)}
                      defaultValue={item?.text || ""}
                    />
                    <input
                      type="color"
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      defaultValue={item?.color || "#000000"}
                      className="w-10 h-10 rounded-full border"
                    />
                    <button
                      onClick={() => removeTitle(key)}
                      className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    onChange={(e) => handleGradientChange(key, e)}
                    defaultValue={item?.gradient || ""}
                  />
                </div>
              );
            })}
          </div>
        </li>
      </ul>
    </details>
  );
};

export default DataSlice;
