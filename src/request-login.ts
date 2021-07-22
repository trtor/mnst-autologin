require("dotenv").config();
import axios, { AxiosError, AxiosResponse } from "axios";
import qs from "qs";
import { loginHost, loginOrigin, loginURL } from "./config";

type RequestLoginRes =
  | { code: "OK"; magic: string }
  | { code: "AUTH_FAIL" | "REJECT" | "ERROR" | "UNKNOWN" };
export async function requestLogin({
  location,
}: {
  location: string;
}): Promise<RequestLoginRes> {
  const magic = exportMagic(location);
  try {
    await axios({
      method: "GET",
      url: location,
      headers: {
        Host: loginHost,
      },
      timeout: 1000,
    });

    const res: AxiosResponse<string> = await axios({
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Referrer: location,
        Host: loginHost,
        Origin: loginOrigin,
      },
      maxRedirects: 0,
      url: loginURL,
      data: qs.stringify({
        "4Tredir": "http://www.msftconnecttest.com/redirect",
        magic: magic,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      }),
      xsrfCookieName: undefined,
      xsrfHeaderName: undefined,
      timeout: 500,
    });
    if (/authentication failed/i.test(res.data)) {
      return { code: "AUTH_FAIL" };
    } else if (/keepalive/i.test(res.data) && magic) {
      return { code: "OK", magic };
    }
    return { code: "UNKNOWN" };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error: AxiosError<string> = e;
      // console.error("requestLogin(), ", error.response?.status);
      if (e.code === "ECONNRESET") {
        // console.error("Connection loss");
        return { code: "REJECT" };
      }
    }
    return { code: "ERROR" };
  }
}

function exportMagic(location: string): string | null {
  if (!location) return null;
  const reg = /\?(.*?)$/i;
  const match = location.match(reg);
  if (match && match[1]) return match[1];
  return null;
}
