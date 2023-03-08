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
    </div>
  );
}
