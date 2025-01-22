const LoadingEditor = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-[90vh] z-2">
      <div className="bg-gray-400 top-0 left-0 w-full h-full opacity-5 absolute"></div>
      <div className="relative w-full h-full flex flex-col justify-center items-center">
        <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin"></div>
        <div className="">Loading Monaco Editor...</div>
      </div>
    </div>
  );
};

export default LoadingEditor;
