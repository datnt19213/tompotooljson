import {
  DragStartEvent,
  DragEndEvent,
  DndContext,
  pointerWithin,
  DragOverlay,
} from "@dnd-kit/core";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Droppable from "../../components/droppable";
import Sidebar from "../../components/sidebar";
import TrashBin from "../../components/trashBin";
import ItemsRenderer from "../../features";
import { RootState } from "../../store";
import { Obj, setData, setSidebar, setThumnail } from "../../store/DndSlice";
import PropertiesBar from "../../components/propertiesbar/propertiesbar";
import { GetData } from "../../apis";

const Editor = () => {
  const { activeId, data, sidebar, deepLevel } = useSelector(
    (state: RootState) => state.dndSlice
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetData(
        `${import.meta.env.VITE__API_HOST}/api/documents`
      );
      if (response) {
        dispatch(setData(response[0]?.layoutJson));
      }
    };

    fetchData();
  }, []);

  const FindToAdd = (id: string, detail: any, parent_id: string) => {
    const newData = JSON.parse(JSON.stringify(data));

    let layoutChilds: Obj[] = [];

    const removeChildFromParent = (nodes: Obj[]) => {
      nodes.forEach(node => {
        const targetChild = node.childs.find(child => child.id === id);
        if (targetChild) {
          layoutChilds = targetChild.childs;
        }
        node.childs = node.childs.filter(child => child.id !== id);

        if (node.childs.length > 0) {
          removeChildFromParent(node.childs);
        }
      });
    };

    removeChildFromParent([newData]);

    const addChildToParent = (nodes: Obj[]) => {
      nodes.forEach(node => {
        if (
          node.id === parent_id &&
          !node.childs.some(child => child.id === id)
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
            thumnail: detail.thumnail,
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
        thumnail: detail.thumnail,
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
    const { over, active } = event;
    hideBin();

    if (over?.id === "trash-bin") {
      const newData = JSON.parse(JSON.stringify(data));

      const removeItemFromLayout = (nodes: Obj[]): Obj[] => {
        return nodes
          .filter(node => node.id !== active.id)
          .map(node => ({
            ...node,
            childs: removeItemFromLayout(node.childs),
          }));
      };

      newData.childs = removeItemFromLayout(newData.childs);

      const updatedSidebar = [
        ...sidebar,
        {
          columns: "1",
          rows: "1",
          type: "content",
          colspan: "1",
          rowspan: "1",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: "1",
          id: active.id,
          thumnail: "_",
        },
      ];
      dispatch(setSidebar(updatedSidebar));
      dispatch(setData(newData));

      return;
    }

    if (over && active.id !== over.id) {
      FindToAdd(active.id.toString(), active.data.current, over.id.toString());

      if (deepLevel <= 6) {
        const updatedSidebar = sidebar.filter(sb => sb.id !== active.id);
        dispatch(setSidebar(updatedSidebar));
      }
    }
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className="flex items-start w-full relative">
        {
          <div
            id="bin_id"
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-[6.25rem] hidden justify-center items-center"
            style={{
              zIndex: 9999,
            }}>
            <TrashBin />
          </div>
        }

        <Sidebar />
        <div className="bg-white w-full p-6 z-10">
          <div className="bg-white mx-auto max-w-[75rem] w-full min-h-[calc(100vh-7rem)]">
            <Droppable
              columns={data.columns}
              rows={data.rows}
              colspan={data.colspan}
              rowspan={data.rowspan}
              alignItems={data.alignItems}
              justifyContent={data.justifyContent}
              gap={data.gap}
              type={data.type}
              id={data.id}
              thumnail={data.thumnail}>
              <ItemsRenderer
                childs={data.childs}
                id={data.id}
                columns={data.columns}
                rows={data.rows}
                colspan={data.colspan}
                rowspan={data.rowspan}
                alignItems={data.alignItems}
                justifyContent={data.justifyContent}
                gap={data.gap}
                currentDepth={1}
                type={data.type}
                thumnail={data.thumnail}
              />
            </Droppable>
          </div>
        </div>
        <PropertiesBar />
      </div>
      <DragOverlay
        style={{
          zIndex: 999,
          pointerEvents: "none",
          position: "fixed",
          opacity: 0.4,
        }}>
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

export default Editor;
