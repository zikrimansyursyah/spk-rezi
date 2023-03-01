import { NextResponse } from "next/server";
import { decryptCrypto } from "./utils/crypto";
import { verify } from "./utils/jwt";

export default async function middleware(req) {
  const access_token = req.cookies.get("access_token")?.value;
  const url = req.nextUrl.clone();

  if (access_token) {
    const validate = await verify(decryptCrypto(access_token))
      .then((data) => data)
      .catch(() => null);
    const userRole = validate?.user_type_name;

    const acceptMenuSiswa = /(\/)|(\/penerima-bantuan)/g;

    if (validate !== null) {
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
