"use client";

export default function PenerimaBantuan() {
  return (
    <>
      <div className="p-4 flex fixed w-full justify-between items-center bg-white border-b shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.02)] z-50">
        <div className="flex gap-3">
          <div className="w-1 h-12 bg-sky-500 rounded-full"></div>
          <div className="flex flex-col">
            <span className="font-semibold">Penerima Bantuan</span>
            <span className="text-sm text-gray-600">Data Siswa Penerima Bantuan Kesejahteraan</span>
          </div>
        </div>
        <button type="submit" className="flex items-center gap-3 bg-[#2293EE] py-2 px-4 rounded-lg hover:bg-[#4da5ed] active:scale-[0.97] focus:ring focus:ring-blue-200">
          <i className="pi pi-refresh text-white text-xs font-medium"></i>
          <span className="text-sm font-medium text-white">Refresh</span>
        </button>
      </div>
      <div className="px-4 pb-4 pt-24">
        <span className="text-2xl font-medium">Under Construction</span>
      </div>
    </>
  );
}
