require("dotenv").config();
import { autoLogin } from "./auto-login";
import { checkInternet } from "./check-internet";
import { requestKeepAlive } from "./request-keepalive";

const HOUR_ms = 1000 * 60 * 60;
const intervalCheckInternet_ms = 1000 * 60 * 5; // every 1 min

async function mainLogin2() {
  let keepAlive: NodeJS.Timer | null = null;

  // First attemp when run script
  const res1 = await autoLogin();
  if (res1.code === "OK") {
    const magic = res1.magic;
    console.log("Login success, ", magic);
  }

  // Start Interval
  setInterval(async () => {
    const isInternetCon = await checkInternet();
    console.log(isInternetCon ? "Internet ✔" : "Internet loss");
    if (!isInternetCon) {
      const res2 = await autoLogin();
      if (res2.code === "OK") {
        if (keepAlive !== null) {
          console.log("Clear interval");
          clearInterval(keepAlive);
        }
        const magic = res2.magic;
        console.log("Login success, ", magic);

        keepAlive = setInterval(async () => {
          if (magic) await requestKeepAlive(magic);
          console.log("Send keepalive", magic);
        }, 0.5 * HOUR_ms); //  2.8 * HOUR_ms
      } else {
        console.log("Login status", res2.code);
      }
    }
    // Internet OK => do nothing
  }, intervalCheckInternet_ms);
}

mainLogin2();

if (process.env.USERNAME === undefined || process.env.PASSWORD === undefined)
  console.error("ENV, username or password is undefined");
