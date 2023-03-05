// AUTH
export const AUTH_LOGIN = "/api/auth/login";
export const AUTH_LOGOUT = "/api/logout";

// USERS
export const USERS_GET_ALL = "/api/user/get-all";

// API RESPONSE
export const RES_METHOD_NOT_ALLOWED = { status: 405, message: "Method Not Allowed" };
export const RES_BAD_REQUEST = { status: 400, message: "BAD REQUEST" };
export const RES_INTERNAL_SERVER_ERROR = { status: 500, message: "Internal Server Error" };
export const RES_UNAUTHORIZE = { status: 401, message: "Unauthorize" };
