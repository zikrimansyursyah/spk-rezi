import { NextResponse } from "next/server";
import { AUTH_VALIDATE } from "./services/constants";

export default async function middleware(req) {
  const access_token = req.cookies.get("access_token")?.value;
  const url = req.nextUrl.clone();
  const regexFile = /\.[a-zA-Z0-9]+$/;

  if (regexFile.test(url.pathname)) return NextResponse.next();

  if (access_token) {
    let validateHeader = new Headers();
    validateHeader.append("Content-Type", "application/json");
    const validate = await fetch(url.origin + AUTH_VALIDATE, { method: "POST", body: JSON.stringify({ access_token }), headers: validateHeader })
      .then((response) => response.json())
      .then((result) => result)
      .catch(() => ({ status: 500 }));

    const isValidate = validate?.status === 200;
    const userRole = validate?.user_type_name;

    const acceptMenuSiswa = /(\/)|(\/penerima-bantuan)/g;

    if (isValidate) {
      if (url.pathname === "/login") {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      if (userRole === "siswa") {
        if (!acceptMenuSiswa.test(url.pathname)) {
          url.pathname = "/";
          return NextResponse.redirect(url);
        }
        return NextResponse.next();
      }

      return NextResponse.next();
    } else {
      if (url.pathname !== "/login") {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }
  } else if (url.pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)"],
};
