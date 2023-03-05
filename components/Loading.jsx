export default function Loading({ status }) {
  if (status?.visible === true) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-slate-700/10 z-[1000]">
        <div className="bg-white py-4 px-6 rounded-xl flex justify-center items-center gap-4 max-w-[30rem]">
          <i className="pi pi-spin pi-spinner text-[3rem] text-gray-700"></i>
          <div className="flex flex-col items-start">
            <span>Please Wait</span>
            {status?.text && <span className="text-sm text-gray-500">{status?.text}</span>}
          </div>
        </div>
      </div>
    );
  }
}
