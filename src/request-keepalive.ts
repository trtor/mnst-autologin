import axios, { AxiosError, AxiosResponse } from "axios";
import { loginURL } from "./config";

export async function requestKeepAlive(magic: string) {
  try {
    const res: AxiosResponse<string> = await axios({
      method: "GET",
      url: loginURL + "/keepalive?" + magic,
      headers: {
        Referrer: loginURL,
      },
      timeout: 1000,
    });
    // console.log(res.status);
    // console.log(res.headers);
    // console.log(res.data);

    if (/keepalive/i.test(res.data)) return { code: "OK", magic };
    else return { code: "AUTH_FAIL" };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error: AxiosError<string> = e;
      if (e.code === "ECONNRESET") {
        return { code: "REJECT" };
      }
    }
    return { code: "ERROR" };
  }
}
