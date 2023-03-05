import { NextResponse } from "next/server";
import { decryptCrypto } from "./utils/crypto";
import { verify } from "./utils/jwt";

export default async function middleware(req) {
  const access_token = req.cookies.get("access_token")?.value;
  const menu = req.cookies.get("menu")?.value;
  const url = req.nextUrl.clone();
  const headers = new Headers(req.headers);

  if (access_token && menu) {
    const validate = await verify(decryptCrypto(access_token))
      .then((data) => data)
      .catch(() => null);
    const validateMenu = decryptCrypto(menu);

    const userRole = validate?.user_type_name;

    const acceptMenuSiswa = /(\/)|(\/penerima-bantuan)/g;

    if (validate !== null && validateMenu !== "") {
      // TER VALIDATE
      headers.set("access_token", JSON.stringify(validate));
      headers.set("menu", validateMenu);

      if (url.pathname === "/login") {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      if (userRole === "siswa") {
        if (!acceptMenuSiswa.test(url.pathname)) {
          url.pathname = "/";
          return NextResponse.redirect(url);
        }
        return NextResponse.next({ request: { headers } });
      }

      return NextResponse.next({ request: { headers } });
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
