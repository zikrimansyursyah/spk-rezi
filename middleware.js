import { NextResponse } from "next/server";
import { AUTH_VALIDATE } from "./services/constants";
import { decryptCrypto } from "./utils/crypto";

export default async function middleware(req) {
  const access_token = req.cookies.get("access_token")?.value;
  const url = req.nextUrl.clone();

  if (access_token) {
    const validate = await fetch(url.origin + AUTH_VALIDATE, { method: "POST", headers: { access_token: decryptCrypto(access_token) } })
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
  matcher: ["/((?!api/|_next/static|_next/image|.*\\.).*)"],
};
