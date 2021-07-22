import axios from "axios";

export async function checkInternet(): Promise<boolean> {
  try {
    const res = await axios({
      method: "get",
      url: "http://www.gstatic.com/generate_204",
      timeout: 1000,
    });
    return res.status === 204;
  } catch (error) {
    return false;
  }
}
