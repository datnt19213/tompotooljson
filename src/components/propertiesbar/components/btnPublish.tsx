import axios from "axios";
import { transformData } from "../../../utilities/formatData";
import { DecryptBasic } from "../../../utilities/hash_aes";
import { GetACookie } from "../../../utilities/cookies";
import { Enum } from "../../../config/common";
import { ToastError, ToastSuccess } from "../../toast";
import { RootState } from "../../../store";
import { shallowEqual, useSelector } from "react-redux";
import { useState } from "react";

const BtnPublish = () => {
  const [dndSlice, documentSlice] = useSelector(
    (state: RootState) => [state.dndSlice, state.documentSlice],
    shallowEqual
  );

  const [isLoading, setIsLoading] = useState(false);

  const { data, activeId, dataComponent } = dndSlice as any;
  const { uid } = documentSlice as any;

  const handlePublishJsonData = async () => {
    setIsLoading(true);
    const getDoc = await axios.get(
      `${import.meta.env.VITE__API_HOST}/api/documents?dId=${DecryptBasic(
        GetACookie("did"),
        Enum.srkey
      )}`
    );
    console.log("handlePublishJsonData", getDoc);

    const documentData = {
      projectId: DecryptBasic(GetACookie("pid"), Enum.srkey),
      documentId: DecryptBasic(GetACookie("did"), Enum.srkey),
      layoutJson: data,
      documentName:
        (getDoc.status === 200 || getDoc.status === 201) &&
        getDoc.data?.documentName,
      thumbnail: "",
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
          {
            uid: uid || "",
            layout: data,
            component: dataComponent,
          }
        );

        const saveComponent = await axios.post(
          `${import.meta.env.VITE__API_HOST}/api/components-config`,
          {
            sliceId: activeId,
            component: dataComponent,
          }
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
    setIsLoading(false);
  };

  return (
    <button
      disabled={isLoading}
      onClick={() => handlePublishJsonData()}
      className={`h-10 px-4 text-sm text-white rounded-full relative bg-[#444]`}
    >
      Publish
      {isLoading && <Loading />}
    </button>
  );
};

const Loading = () => {
  return (
    <div
      role="status"
      className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
    >
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default BtnPublish;
