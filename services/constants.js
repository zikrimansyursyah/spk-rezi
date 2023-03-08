// AUTH
export const AUTH_LOGIN = "/api/auth/login";
export const AUTH_LOGOUT = "/api/logout";

// USERS
export const USERS_GET_ALL = "/api/user/get-all";
export const USERS_GET_NAMA_SISWA = "/api/user/get-name";
export const USERS_GET_DETAIL_SISWA = "/api/user/get-detail";
export const USERS_PUT_EDIT_USER = "/api/user/edit-user";
export const USERS_ADD_USER = "/api/user/add-user";
export const USERS_DELETE_USER = "/api/user/delete-user";
export const USERS_DROPDOWN_SISWA = "/api/user/get-dropdown-siswa";

// ABSENSI
export const ABSENSI_TAMBAH = "/api/absensi/add-absen";
export const ABSENSI_EDIT = "/api/absensi/edit-absen";
export const ABSENSI_GET_ALL = "/api/absensi/get-absen";
export const ABSENSI_DELETE = "/api/absensi/hapus-absen";

// API RESPONSE
export const RES_METHOD_NOT_ALLOWED = { status: 405, message: "Method Not Allowed" };
export const RES_BAD_REQUEST = { status: 400, message: "BAD REQUEST" };
export const RES_INTERNAL_SERVER_ERROR = { status: 500, message: "Internal Server Error" };
export const RES_UNAUTHORIZE = { status: 401, message: "Unauthorize" };
