import { Icon } from "@iconify/react/dist/iconify.js";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { DeleteDocumentModal } from "../../pages/documents/components/deleteDocumentModal";
import {
  setActiveDocument,
  setDocumentName,
  setUID,
} from "../../store/documents/documentSlice";
import { IDocument } from "../../store/documents/type";
import { formatDateTimeAgo } from "../../utilities/dateTime";
import DocumentDropdown from "../dropdown/documentDropdown";
import { GetACookie, SaveACookie } from "../../utilities/cookies";
import { EncryptBasic } from "../../utilities/hash_aes";
import { Enum } from "../../config/common";
import _ from "lodash";

const colors = ["#DA4D1D", "#2b26c3", "#01a439", "#394ca6", "#ffbe00"];

const DocumentCard = ({
  document,
  index,
}: {
  document: IDocument;
  index?: number;
}) => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function navigationEditor(): void {
    SaveACookie({
      key: "did",
      token: EncryptBasic(document.documentId, Enum.srkey).toString(),
      expired: 1,
    });
    navigate("/editor");
  }

  return (
    <div
      className="transition-all overflow-hidden group duration-500 ease-in-out rounded-md hover:rounded-xl hover:shadow-xl 
        bg-white/90 backdrop-blur-[3.7px] w-full min-h-[15.625rem] h-full border border-white/15 p-5 cursor-pointer relative"
    >
      <div className="min-w-full w-full h-full flex flex-col justify-between items-start gap-3">
        {/* Header */}
        <div className="w-full flex-grow z-10">
          {/* Header tool bar */}
          <div className=" flex justify-between items-center gap-3">
            <Link
              to={`/editor`}
              className="font-medium text-neutral-400 text-lg mb-2 border-[0.0781rem] border-neutral-400 rounded-full w-fit"
            >
              <span className="y-2 mx-3">
                {Number(index) < 10 ? `0${index}` : index || "01"}
              </span>
            </Link>

            {/* TOOL BAR */}
            <div
              className="flex items-center gap-3"
              onClick={() => {
                dispatch(setActiveDocument(document));
              }}
            >
              <DocumentDropdown
                controlChildren={
                  <Icon
                    icon="fluent:line-horizontal-1-dot-20-regular"
                    className="opacity-100 size-6 lg:opacity-0 block lg:hidden transition-all duration-150 ease-in-out group-hover:delay-75 group-hover:opacity-100 group-hover:animate-jump-in group-hover:block"
                  />
                }
              />

              <DeleteDocumentModal document={document} />
            </div>
          </div>

          {/* MAIN NAME */}
          <div onClick={() => navigationEditor()}>
            <div className="font-bold text-2xl">{_.get(document, "documentName")}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full flex justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm z-10">
            Last updated:{" "}
            <span className="text-neutral-800 font-medium">
              {formatDateTimeAgo(document?.updatedAt)}
            </span>
          </p>
          <div onClick={() => navigationEditor()}>
            <div
              className={`opacity-70 w-4 h-4 rounded-full relative transition-transform group-hover:scale-[20] z-[1]`}
              style={{
                backgroundColor: randomColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Icon */}
      <div className="absolute bottom-2 right-2 flex justify-center items-center opacity-0 group-hover:animate-slide-in-left group-hover:opacity-100 transition-opacity duration-300 z-10">
        <div
          onClick={() => {
            dispatch(setDocumentName(_.get(document, "documentName")));
            dispatch(setUID(_.get(document, "uid")));
            navigationEditor();
          }}
        >
          <Icon icon="ph:arrow-right" className="text-4xl text-white" />
        </div>
      </div>
    </div>
  );
};

export const DocumentCardSkeleton = () => {
  return (
    <div className="animate-pulse transition-all overflow-hidden rounded-md bg-white/90 backdrop-blur-[3.7px] w-full min-h-[15.625rem] h-full border border-white/15 p-5">
      <div className="flex flex-col justify-between items-start gap-3 h-full">
        {/* Index Placeholder */}
        <div className="flex-grow">
          <div className="w-12 h-6 bg-gray-300 rounded-full mb-3"></div>
          {/* Title Placeholder */}
          <div className="min-w-full w-56 h-8 bg-gray-300 rounded mb-3"></div>
        </div>
        {/* Footer */}
        <div className="w-full flex justify-between items-center">
          <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
          {/* Shining Circle */}
          <div className="relative w-4 h-4 rounded-full bg-gray-300">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-70 animate-shine"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
