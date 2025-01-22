import { useDispatch, useSelector } from "react-redux";
import ResponsiveModalDrawer from "../../../components/modal/responsiveModalDrawer";
import { RootState } from "../../../store";
import { Icon } from "@iconify/react/dist/iconify.js";
import { deleteDocument } from "../../../services/documents/api";
import { setTriggerFetchListDocument } from "../../../store/global/globalSlice";
import { IDocument } from "../../../store/documents/type";
import { useState } from "react";
import _ from "lodash";

type ResponsiveModalDrawerType = {
  document: IDocument;
};

export const DeleteDocumentModal = (props: ResponsiveModalDrawerType) => {
  // redux
  const documentState = useSelector((state: RootState) => state.documentSlice);
  const dispatch = useDispatch();

  // state
  const [opened, setOpened] = useState(false);

  const handleOnCloseModal = () => setOpened(false);

  const handleDeleteDocument = async () => {
    await deleteDocument(props.document?.documentId);
    dispatch(setTriggerFetchListDocument(true));
  };

  return (
    <ResponsiveModalDrawer
      title="Delete Document"
      opened={opened}
      onClose={handleOnCloseModal}
      openButton={
        <Icon
          icon="mdi:delete"
          className="text-red-600 size-6"
          onClick={() => setOpened(true)}
        />
        // <Icon
        //   icon="weui:delete-on-fi lled"
        //   className="text-red-600 size-6 opacity-100 lg:opacity-0 block lg:hidden transition-all duration-150 ease-in-out group-hover:delay-150 group-hover:opacity-100 group-hover:animate-jump-in group-hover:block"
        // />
      }
      confirmAction={handleDeleteDocument}
    >
      <h5 className="text-sm font-medium text-neutral-500">
        This action cannot be undo, please be careful.
      </h5>
      <h2 className="text-lg font-normal">
        Are you sure, you want to delete document{" "}
        <span className="font-bold">
          "{_.get(documentState, "activeDocument.documentName") || ""}"
        </span>
      </h2>
    </ResponsiveModalDrawer>
  );
};
