import {
  DragStartEvent,
  DragEndEvent,
  DndContext,
  pointerWithin,
  DragOverlay,
} from "@dnd-kit/core";
import _ from "lodash";
import React, { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import Droppable from "../../components/droppable";
import Sidebar from "../../components/sidebar";
import TrashBin from "../../components/trashBin";
import ItemsRenderer from "../../features";
import { RootState } from "../../store";
import { Obj, setData, setDataFetchData, setScrollLock, setSidebar } from "../../store/DndSlice";
import PropertiesBar from "../../components/propertiesbar";
import { GetData } from "../../apis";
import { DecryptBasic } from "../../utilities/hash_aes";
import { GetACookie } from "../../utilities/cookies";
import { Enum } from "../../config/common";
import BtnHandleCreateFc from "../../components/propertiesbar/components/btnHandleCreateFc";
import MonacoEditor from "../../components/monacoEditor";
import BtnPublish from "../../components/propertiesbar/components/btnPublish";
import { setDocumentName } from "../../store/documents/documentSlice";

const Editor = () => {
  const {
    activeId,
    data,
    sidebar,
    deepLevel,
    activeCreateFunction,
    layoutTypeScreen,
  } = useSelector((state: RootState) => state.dndSlice);

  const dataLayout = data[layoutTypeScreen];

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const response = (await GetData(
        `${import.meta.env.VITE__API_HOST}/api/documents?dId=${DecryptBasic(
          GetACookie("did"),
          Enum.srkey
        )}`
      )) as any;
      if (response && response?.layoutJson) {
        console.log("Editorresponse", response);

        dispatch(setDocumentName(response?.documentName));
        const newLayout = response?.layoutJson;
        dispatch(setDataFetchData(newLayout));
        return;
      }
      dispatch(
        setData({
          id: "root",
          thumnail: "_",
          type: "grid",
          columns: "1",
          gap: "1",
          rows: "1",
          colspan: "1",
          rowspan: "1",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          style: {},
          childs: [],
          dataSlice: {},
        })
      );
      return;
    };

    fetchData();
  }, []);

  const FindToAdd = ({
    id,
    detail,
    parent_id,
  }: {
    id: string;
    detail: any;
    parent_id: string;
  }) => {
    const newData = JSON.parse(JSON.stringify(dataLayout));

    let layoutChilds: Obj[] = [];

    const removeChildFromParent = (nodes: Obj[]) => {
      nodes.forEach((node) => {
        const targetChild = node.childs.find((child) => child.id === id);
        if (targetChild) {
          layoutChilds = targetChild.childs;
        }
        node.childs = node.childs.filter((child) => child.id !== id);

        if (node.childs.length > 0) {
          removeChildFromParent(node.childs);
        }
      });
    };

    removeChildFromParent([newData]);

    const addChildToParent = (nodes: Obj[]) => {
      nodes.forEach((node) => {
        if (
          node.id === parent_id &&
          !node.childs.some((child) => child.id === id)
        ) {
          node.childs.push({
            id,
            columns: detail.columns,
            rows: detail.rows,
            colspan: detail.colspan,
            rowspan: detail.rowspan,
            gap: detail.gap,
            justifyContent: detail.justifyContent,
            alignItems: detail.alignItems,
            type: detail.type,
            childs: layoutChilds,
            thumbnail: detail.thumbnail,
            dataSlice: detail.dataSlice,
          });
        } else if (node.childs.length > 0) {
          addChildToParent(node.childs);
        }
      });
    };

    if (newData.id === parent_id) {
      newData.childs.push({
        id,
        columns: detail.columns,
        rows: detail.rows,
        colspan: detail.colspan,
        rowspan: detail.rowspan,
        gap: detail.gap,
        justifyContent: detail.justifyContent,
        alignItems: detail.alignItems,
        type: detail.type,
        childs: layoutChilds,
        thumbnail: detail.thumbnail,
      });
    } else {
      addChildToParent(newData.childs);
    }
    dispatch(setData(newData));
  };

  const hideBin = () => {
    const bin = document.getElementById("bin_id");
    if (!bin) return;
    bin.style.display = "none";
  };
  const showBin = () => {
    const bin = document.getElementById("bin_id");
    if (!bin) return;
    bin.style.display = "flex";
  };

  const handleDragStart = (event: DragStartEvent) => {
    showBin();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    dispatch(setScrollLock(false));

    const { over, active } = event;
    hideBin();

    if (over?.id === "trash-bin") {
      const newData = JSON.parse(JSON.stringify(dataLayout));
      const removeItemFromLayout = (nodes: Obj[]): Obj[] => {
        return nodes
          .filter((node) => node.id !== active.id)
          .map((node) => ({
            ...node,
            childs: removeItemFromLayout(node.childs),
          }));
      };

      const collectAllChildren = (nodes: Obj[]): Obj[] => {
        return nodes.flatMap((node) => [
          node,
          ...collectAllChildren(node.childs),
        ]);
      };

      const findNodeAndCollectChildren = (
        nodes: Obj[],
        nodeId: string
      ): Obj[] | null => {
        for (const node of nodes) {
          if (node.id === nodeId) {
            if (node.childs.length === 0) {
              return [node];
            }
            return collectAllChildren(node.childs);
          } else if (node.childs.length > 0) {
            const result = findNodeAndCollectChildren(node.childs, nodeId);
            if (result) return result;
          }
        }
        return null;
      };

      const removedChildren = findNodeAndCollectChildren(
        [newData],
        String(active.id)
      );
      console.log("🚀 ~ handleDragEnd ~ removedChildren:", removedChildren);

      newData.childs = removeItemFromLayout(newData.childs);
      let updatedSidebar = [...sidebar];

      if (removedChildren) {
        const newChildren = removedChildren
          .map((child) => {
            if (child.type !== "grid" && child.type !== "flex") {
              return {
                ...child,
                columns: "1",
                rows: "1",
                colspan: "1",
                rowspan: "1",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: "1",
                thumbnail: child.thumbnail || "",
              };
            }
            return null;
          })
          .filter(Boolean);

        newChildren.forEach((newChild) => {
          if (
            !updatedSidebar.some(
              (existingItem) => existingItem.id === newChild.id
            )
          ) {
            updatedSidebar.push(newChild);
          }
        });
      }

      dispatch(setSidebar(updatedSidebar));
      dispatch(setData(newData));

      return;
    }

    if (over && active.id !== over.id) {
      FindToAdd({
        id: active.id.toString(),
        detail: active.data.current,
        parent_id: over.id.toString(),
      });

      if (deepLevel <= 6) {
        const updatedSidebar = sidebar.filter((sb) => sb.id !== active.id);
        dispatch(setSidebar(updatedSidebar));
      }
    }
  };

  const renderBin = (
    <div
      id="bin_id"
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-[6.25rem] hidden justify-center items-center"
      style={{
        zIndex: 9999,
      }}
    >
      <TrashBin />
    </div>
  );

  const renderSidebar = !activeCreateFunction && <Sidebar />;
  const renderPropertiesBar = !activeCreateFunction && <PropertiesBar />;

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <RenderToolbarMonaco hidden={!activeCreateFunction} />
      <div className="flex items-start w-full relative">
        {renderBin}
        {renderSidebar}
        <div
          className={`${
            activeCreateFunction ? "w-1/3" : "w-full"
          } bg-white p-6 z-10`}
        >
          <div className="bg-white mx-auto max-w-[75rem] w-full min-h-[calc(100vh-7rem)]">
            <Droppable
              columns={_.get(dataLayout, "columns")}
              rows={_.get(dataLayout, "rows")}
              colspan={_.get(dataLayout, "colspan")}
              rowspan={_.get(dataLayout, "rowspan")}
              alignItems={_.get(dataLayout, "alignItems")}
              justifyContent={_.get(dataLayout, "justifyContent")}
              gap={_.get(dataLayout, "gap")}
              type={_.get(dataLayout, "type")}
              id={_.get(dataLayout, "id")}
              thumbnail={_.get(dataLayout, "thumbnail")}
              dataSlice={_.get(dataLayout, "dataSlice")}
            >
              {dataLayout && (
                <ItemsRenderer
                  childs={_.get(dataLayout, "childs")}
                  id={_.get(dataLayout, "id")}
                  columns={_.get(dataLayout, "columns")}
                  rows={_.get(dataLayout, "rows")}
                  colspan={_.get(dataLayout, "colspan")}
                  rowspan={_.get(dataLayout, "rowspan")}
                  alignItems={_.get(dataLayout, "alignItems")}
                  justifyContent={_.get(dataLayout, "justifyContent")}
                  gap={_.get(dataLayout, "gap")}
                  currentDepth={1}
                  type={_.get(dataLayout, "type")}
                  dataSlice={_.get(data, "dataSlice")}
                  thumbnail={_.get(dataLayout, "thumbnail")}
                />
              )}
            </Droppable>
          </div>
        </div>
        <RenderMonacoEditor hidden={!activeCreateFunction} />
        {renderPropertiesBar}
      </div>
      <DragOverlay
        style={{
          zIndex: 999,
          pointerEvents: "none",
          position: "fixed",
          opacity: 0.4,
        }}
      >
        {activeId ? (
          <div
            className="bg-slate-50 opacity-40 w-full h-full rounded-xl"
            style={{ zIndex: 999 }}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

const RenderMonacoEditor = ({ hidden }) => {
  return (
    !hidden && (
      <div className="w-2/3">
        <MonacoEditor />
      </div>
    )
  );
};

const RenderToolbarMonaco = ({ hidden }) => {
  return (
    !hidden && (
      <div className="w-full flex justify-end items-center gap-2 p-2">
        <BtnHandleCreateFc />
        <BtnPublish />
      </div>
    )
  );
};

export default Editor;
