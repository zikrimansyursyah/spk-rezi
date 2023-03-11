export default function Loading() {
  return (
    <div>
      <div className="p-4 flex justify-between items-center bg-white border-b shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex gap-3">
          <div className="w-1 h-12 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="flex flex-col">
            <span className="w-[20rem] h-4 my-1 bg-gray-300 rounded animate-pulse"></span>
            <span className="w-[30rem] h-4 mt-1 bg-gray-300 rounded animate-pulse"></span>
          </div>
        </div>
        <div className="w-[10rem] h-9 rounded-md bg-gray-300 animate-pulse"></div>
      </div>
      <div className="px-4 py-4">
        <div className="bg-white w-full mt-1 rounded-lg border shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)] flex flex-col">
          <div className="py-2 px-4">
            <div className="w-28 h-6 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <span className="border-b"></span>
          <div className="py-4 px-4 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <div className="bg-gray-300 h-5 w-24 rounded animate-pulse"></div>
              <div className="bg-gray-300 h-10 w-[10rem] rounded animate-pulse"></div>
            </div>
            <div className="bg-gray-300 h-10 w-[20rem] rounded animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white w-full mt-4 p-5 rounded-lg border shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)]">
          <div className="bg-gray-300 h-[20rem] w-full rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
