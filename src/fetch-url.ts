import axios, { AxiosError, AxiosResponse } from "axios";

export async function fetchURL(url: string): Promise<{
  statusCode: number | undefined;
  headers: { [key: string]: string } | undefined;
  body: string | undefined;
  errorCode?: string;
}> {
  try {
    const res: AxiosResponse<string> = await axios({
      method: "GET",
      url,
      maxRedirects: 0,
      timeout: 1000,
    });
    return {
      statusCode: res.status,
      headers: res.headers,
      body: res.data,
    };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error: AxiosError<string | undefined> = e;
      return {
        statusCode: error.response?.status,
        headers: error.response?.headers,
        body: error.response?.data,
        errorCode: error.code,
      };
    }
    return {
      statusCode: undefined,
      headers: undefined,
      body: undefined,
      errorCode: e.code,
    };
  }
}
