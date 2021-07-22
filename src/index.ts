require("dotenv").config();
import { autoLogin } from "./auto-login";
import { checkInternet } from "./check-internet";
import { requestKeepAlive } from "./request-keepalive";

const HOUR_ms = 1000 * 60 * 60;
const intervalCheckInternet_ms = 1000 * 60 * 5; // every 1 min

async function mainLogin2() {
  let keepAlive: NodeJS.Timer | null = null;

  setInterval(async () => {
    // console.log("Start Interval");
    const isInternetCon = await checkInternet();
    console.log(isInternetCon ? "Con OK" : "Con loss");
    if (!isInternetCon) {
      const res2 = await autoLogin();
      if (res2.code === "OK") {
        if (keepAlive !== null) {
          console.log("clear interval");
          clearInterval(keepAlive);
        }
        const magic = res2.magic;
        console.log("Login success, ", magic);

        keepAlive = setInterval(async () => {
          if (magic) await requestKeepAlive(magic);
          console.log("Send Keep alive", magic);
        }, 0.5 * HOUR_ms); //  2.8 * HOUR_ms
      } else {
        console.log("Login res", res2.code);
      }
    } else {
      console.log("Internet OK => do nothing");
    }
  }, intervalCheckInternet_ms);
}

mainLogin2();

if (process.env.USERNAME === undefined || process.env.PASSWORD === undefined)
  console.error("ENV, username or password is undefined");
