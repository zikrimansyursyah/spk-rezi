// INITIAL
export const JWT_SECRET_KEY = "gamblingperson";
export const CRYPTO_SECRET_KEY = "jumpingdolphin";

// SYSTEMS
export const COOKIES = "/api/cookies";
export const TITLE_PAGE = " - SDN Duri Kepa 02";

// AUTH
export const AUTH_LOGIN = "/api/authorize/login";
export const AUTH_LOGOUT = "/api/authorize/logout";
export const AUTH_VALIDATE = "/api/authorize/validasi";

// USERS
export const USERS_GET_ALL = "/api/user/get-all";

// API
export const API_METHOD_NOT_ALLOWED = { status: 400, message: "Request Method Not Allowed" };
export const API_UNAUTHORIZED = { status: 401, message: "Access Token invalid" };
export const API_INTERNAL_SERVER_ERROR = { status: 500, message: "Internal Server Error" };
