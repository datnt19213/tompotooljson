import {useNavigate} from "react-router-dom";
import HueAnimate from "../../components/hue-animate";
import {Icon} from "@iconify/react/dist/iconify.js";
import Modal from "../../components/modal";
import {
  ChangeEvent,
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import {DeleteData, GetData, PostData} from "../../apis";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setListProjects} from "../../store/ProjectSlice";
import {ContextMenu} from "../../components/context-menu";
import {processImageFile} from "../../utilities/images";
import {ToastError, ToastSuccess} from "../../components/toast";
import Grid from "../../components/background/gridBackground";
import {DocumentCardSkeleton} from "../../components/card/documentCard";
import CardSkeleton from "../../components/skeleton";
import {GetACookie, SaveACookie} from "../../utilities/cookies";
import {EncryptBasic} from "../../utilities/hash_aes";
import {Enum} from "../../config/common";

const HomePage = () => {
  const navigate = useNavigate();
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [projectImage, setProjectImage] = useState<any>();

  const [createLoading, setCreateLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);

  const {projectList} = useSelector((state: RootState) => state.projects);
  const dispatch = useDispatch();

  const fetchDataProjects = async () => {
    setGetLoading(true);
    try {
      const response = (await GetData(
        `${import.meta.env.VITE__API_HOST}/api/projects`
      )) as any;
      if (response) {
        dispatch(setListProjects(response));
      }
    } catch (error) {
    } finally {
      setGetLoading(false);
    }
  };
  useEffect(() => {
    fetchDataProjects();
  }, []);

  const handleClickProject = (id: string) => {
    SaveACookie({
      key: "pid",
      token: EncryptBasic(id, Enum.srkey).toString(),
      expired: 1,
    });
    navigate("/documents");
  };

  const handleNavigateProjectUrl = (
    e: MouseEvent<HTMLSpanElement>,
    projectUrl: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(projectUrl, "_blank");
  };

  const handleDeleteProject = async (id: any) => {
    const response = await DeleteData(
      `${import.meta.env.VITE__API_HOST}/api/projects/${id}`
    );
    if (response) {
      fetchDataProjects();
      ToastSuccess({msg: "Project deleted successfully"});
    }
  };

  const handleImageImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setProjectImage(file);
      } catch (error) {
        //
      }
    }
  };

  const handleSubmitCreateProject = async () => {
    if (!projectId || !projectName || !projectUrl || !websiteUrl) {
      ToastError({ msg: "Please fill all fields" });
      return;
    }
    const formData = {
      projectId: projectId.trim(),
      projectName: projectName,
      thumbnail: "",
      websiteUrl: websiteUrl.trim(),
      projectUrl: projectUrl.trim(),
    };
    setCreateLoading(true);
    try {
      const response = await PostData(
        `${import.meta.env.VITE__API_HOST}/api/projects`,
        formData
      );
      if (response) {
        fetchDataProjects();
        ToastSuccess({ msg: "Projects created successfully" });
      }
    } catch (error) {
      //
    } finally {
      setCreateLoading(false);
    }
  };

  useEffect(() => {
    if (getLoading) {
      const to = setTimeout(() => {
        setGetLoading(false);
      }, 10000);
      return () => {
        clearTimeout(to);
      };
    }
  }, [getLoading]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Grid size={200}>
        <Modal
          open={openProjectModal}
          onClose={() => setOpenProjectModal(false)}
          title="Create project"
          isFooter
          loading={createLoading}
          onCancel={() => setOpenProjectModal(false)}
          onSubmit={() => handleSubmitCreateProject()}
          className="max-w-lg"
          footerClassName="flex gap-4 justify-end">
          <div className="mb-4">
            <label
              htmlFor="id-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Project Id <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="id-input"
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              placeholder="PRISMIC_REPO_ID"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 h-10  "
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <label
                htmlFor="name-input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Project Name<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name-input"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="Your project name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 h-10  "
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="name-input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                thumbnail<span className="text-red-400">*</span>
              </label>
              <label htmlFor="input" className="w-full cursor-pointer">
                <div className="border w-full overflow-hidden rounded-lg h-10 bg-white grid grid-cols-3 ">
                  <div className=" bg-slate-100 flex items-center justify-center text-sm col-span-1">
                    Browse
                  </div>
                  <div className="flex items-center justify-start px-2 text-gray-400 text-sm text-nowrap col-span-2  w-full">
                    <span className="!truncate">{"No file choose"}</span>
                  </div>
                </div>
                <input
                  type="file"
                  hidden
                  id="input"
                  accept=".png,.jpg,.jpeg"
                  onChange={e => handleImageImport(e)}
                />
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="purl-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Project Url<span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="purl-input"
              value={projectUrl}
              onChange={e => setProjectUrl(e.target.value)}
              placeholder="PRISMIC_HOST_URL"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 h-10  "
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="wurl-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Website Url <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="wurl-input"
              value={websiteUrl}
              onChange={e => setWebsiteUrl(e.target.value)}
              placeholder="YOUR_WEBSITE_URL_TO_APPLY_THIS_LAYOUT"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 h-10 "
            />
          </div>
        </Modal>

        <HueAnimate
          growthX="70%"
          growthY="70%"
          positionX="-10%"
          positionY="110%"
        />
        <HueAnimate
          growthX="70%"
          growthY="70%"
          positionX="100%"
          positionY="0%"
        />

        <div className="w-full min-w-[1200px] h-screen relative pl-12 pb-12 pt-6 grid grid-cols-12 gap-48 overflow-hidden z-10">
          <div className="w-full col-span-7 h-[calc(100vh-10rem)] mt-12 overflow-y-scroll scrollbar-none">
            <div className=" w-full h-fit grid grid-cols-4 gap-4 p-6">
              {!getLoading ? (
                <>
                  {projectList?.length > 0 ? (
                    projectList?.map((project, index) => (
                      <ContextMenu
                        id={project._id}
                        key={index}
                        triggerElement={
                          <div
                            key={index}
                            onClick={() =>
                              handleClickProject(project?.projectId)
                            }
                            className="flex relative flex-col gap-2 w-full h-full p-4 aspect-[1.2] overflow-hidden hover:shadow-xl rounded-[2rem] hover:scale-105 hover:border-blue-400 border cursor-pointer bg-white shadow-md transition-all duration-500 hover:z-10">
                            <img
                              src={``}
                              className="rounded-xl object-center object-cover bg-slate-50 w-full aspect-[2.5]"
                              alt=""
                              loading="lazy"
                              crossOrigin="anonymous"
                            />
                            <h2 className="text-base font-semibold line-clamp-1">
                              {project?.projectName}
                            </h2>
                            <p className="text-xs line-clamp-1 text-gray-500">
                              {project?.createdAt &&
                                new Date(project?.createdAt).toLocaleString()}
                            </p>
                            <span
                              onClick={e =>
                                handleNavigateProjectUrl(e, project?.projectUrl)
                              }
                              className="text-xs hover:underline text-gray-300 line-clamp-1 w-fit">
                              {project?.projectUrl}
                            </span>
                            <Icon
                              icon="ph:mouse-right-click-fill"
                              fontSize={16}
                              className="bottom-5 right-5 absolute opacity-30"
                            />
                          </div>
                        }
                        options={[
                          {
                            label: "Delete",
                            handle: () =>
                              handleDeleteProject(project?.projectId),
                            className: "!bg-red-400",
                            icon: <Icon icon="ph:trash-simple" fontSize={20} />,
                          },
                        ]}
                      />
                    ))
                  ) : (
                    <h1 className="col-span-12 text-center text-gray-300 font-bold text-xl">
                      No project found
                    </h1>
                  )}
                </>
              ) : (
                <CardSkeleton count={4} size={3} />
              )}
            </div>
          </div>
          <div className="col-start-9 col-span-4 relative ">
            <div className="w-full h-[calc(100vh+10rem)] bg-white border-l border-gray-100 shadow-xl right-0 absolute rounded-tl-[80%] rounded-bl-[80%] top-1/2 -translate-y-1/2">
              <div className="absolute top-[10%] w-full flex flex-col items-center">
                <div className="w-fit">
                  <span className={`text-c1 font-bold text-[3rem] contrast-75`}>
                    TEK
                  </span>
                  <span className={`text-c2 font-bold text-[3rem] contrast-75`}>
                    NIX
                  </span>
                </div>
                <h3 className="w-fit font-semibold text-lg -mt-3">
                  Innovate The Future
                </h3>
                <p className="max-w-52 text-center leading-8 text-gray-300 font-extralight mt-16 text-[1rem] tracking-tight">
                  The UI component layout organizer allows for easy and flexible
                  arrangement, alignment, and optimization of interface layouts
                  through drag-and-drop, resizing, or visual component
                  positioning.
                </p>
              </div>
              <div className="absolute bottom-[10%] w-full flex flex-col items-center">
                <span className="text-sm text-gray-500 underline text-center">
                  TEKNIX Corporation Copyright &copy;
                </span>
              </div>

              <div className="absolute bg-white cursor-pointer shadow-lg border border-gray-100 w-16 h-16 rounded-full top-[40%] -translate-x-[44%] -translate-y-[50%] flex items-center justify-center hover:scale-125 transition-all duration-500 group">
                <Icon
                  icon="ph:dots-three"
                  fontSize={24}
                  className="group-hover:rotate-180 transition-all duration-300 ease-linear absolute"
                />
                <div className="pointer-events-none relative bg-white text-nowrap px-4 py-3 rounded-xl group-hover:scale-75 transition-all duration-500 shadow-lg right-[100%] group-hover:right-[150%] opacity-0 group-hover:opacity-100 ">
                  More info
                </div>
              </div>
              {/* <div
                onClick={() => setOpenProjectModal(true)}
                className="absolute bg-white shadow-lg cursor-pointer border border-gray-100 w-16 h-16 rounded-full top-[50%] -translate-x-[52%] -translate-y-[50%] flex items-center justify-center hover:scale-125 transition-all duration-500 group"
              >
                <Icon
                  icon="ph:plus"
                  fontSize={24}
                  className="group-hover:rotate-180 transition-all duration-300 ease-linear absolute"
                />
                <div className="pointer-events-none relative bg-white text-nowrap px-4 py-3 rounded-xl group-hover:scale-75 transition-all duration-500 shadow-lg right-[150%] group-hover:right-[200%] opacity-0 group-hover:opacity-100 ">
                  Create new project
                </div>
              </div> */}
              <div className="absolute bg-white shadow-lg cursor-pointer border border-gray-100 w-16 h-16 rounded-full top-[50%] -translate-x-[52%] -translate-y-[50%] flex items-center justify-center hover:scale-125 transition-all duration-500 group">
                <Icon
                  icon="ph:gear"
                  fontSize={24}
                  className="group-hover:rotate-180 transition-all duration-300 ease-linear absolute"
                />
                <div className="pointer-events-none relative bg-white text-nowrap px-4 py-3 rounded-xl group-hover:scale-75 transition-all duration-500 shadow-lg right-[100%] group-hover:right-[150%] opacity-0 group-hover:opacity-100 ">
                  Settings
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default HomePage;
