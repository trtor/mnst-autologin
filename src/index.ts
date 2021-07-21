require("dotenv").config();
import { headerCheckPassRegEx, loginHeaderRegEx, urlCheck } from "./config";
import { fetchURL } from "./fetch-url";
import { requestLogin } from "./request-login";

export async function autoLogin(): Promise<void> {
  const { statusCode, headers, errorCode } = await fetchURL(urlCheck);

  if (
    statusCode === 303 &&
    headers?.location &&
    loginHeaderRegEx.test(headers?.location)
  ) {
    console.log("Need login");
    const location: string = headers.location;
    const loginRes = await requestLogin({ location });

    console.log(loginRes.code);

    // TODO : setTimeout -> fetch keepalive immediately then before 3 hours
    // if keep alive res contain /keepalive/i => continue Countdown else (not contain) => remove timeout, redo fetchURL() every 20 seconds

    // if connection ok -> fetch siriraj.cloud:9001 every 10 s => if res = 303 => redo autologin
  } else if (
    statusCode === 302 &&
    headerCheckPassRegEx.test(headers?.location || "")
  ) {
    console.log("Do nothing");
  } else if (errorCode === "EAI_AGAIN") {
    console.log("No network connection");
  } else {
    console.log("No matche criteria", statusCode, headers, errorCode);
  }

  // const { statusCode, headers, body } = fetchRes;
}

/* 
301263cef6c254b3

# Keep alive
http://172.16.81.1:1000/keepalive?080a0b0a04070679

# Query every 3 hours

=> Host, Referrer

fetch("http://172.16.81.1:1000/keepalive?0e0f0d0b0a010679", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,* / *;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9,th;q=0.8",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "upgrade-insecure-requests": "1"
  },
  "referrer": "http://172.16.81.1:1000/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors"
});

# Logout
http://172.16.81.1:1000/logout?080a0b0a04070679


=> Keep alive res.data
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style type="text/css">html,body{height:100%;padding:0;margin:0;}.oc{display:table;width:100%;height:100%;}.ic{display:table-cell;vertical-align:middle;height:100%;}form{display:block;background:#ccc;border:2px solid red;padding:0 0 25px 0;width:500px;font-family:helvetica,sans-serif;font-size:14px;margin:10px auto;}.fel,.fer,.fec{text-align:center;width:350px;margin:0 auto;padding:10px;}.fel{text-align:left;}.fer{text-align:right;}h1{font-weight:bold;font-size:21px;margin:0;padding:20px 10px;text-align:center;}p{margin:15px auto;width:75%;text-align:left;}ul{margin:15px auto;width:75%;}h2{margin:25px 10px;font-weight:bold;text-align:center;}label,h2{font-size:16px;}.logo{background:#eee center 25px url(/XX/YY/ZZ/CI/MGPGHGPGPFGGHHPFBGFHEHIG) no-repeat;padding-top:80px;}</style><title>Firewall Authentication Keepalive Window</title></head><body><div class="oc"><div class="ic"><form action="/" method="post"><h1 class="logo">Authentication Keepalive</h1><h2>This browser window is used to keep your authentication session active. Please leave it open in the background and open a <a href="http://www.msftconnecttest.com/redirect" target="_blank">new window</a> to continue.</h2>
<p>Authentication Refresh in <b id=countdown>10800</b> seconds</p>
<p><a href="http://172.16.81.1:1000/logout?0e0f0d0b0a010679">logout</a></p>
<p></p>
<script language="javascript">
var countDownTime=10800 + 1;
function countDown(){
countDownTime--;
if (countDownTime <= 0){
    location.href="http://172.16.81.1:1000/keepalive?0e0f0d0b0a010679";
    return;
}
document.getElementById('countdown').innerHTML = countDownTime;
counter=setTimeout("countDown()", 1000);
}
function startit(){
    countDown();
}
window.onload=startit
</script>
</form></div></div></body></html>



=> Login success data 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style type="text/css">html,body{height:100%;padding:0;margin:0;}.oc{display:table;width:100%;height:100%;}.ic{display:table-cell;vertical-align:middle;height:100%;}form{display:block;background:#ccc;border:2px solid red;padding:0 0 25px 0;width:500px;font-family:helvetica,sans-serif;font-size:14px;margin:10px auto;}.fel,.fer,.fec{text-align:center;width:350px;margin:0 auto;padding:10px;}.fel{text-align:left;}.fer{text-align:right;}h1{font-weight:bold;font-size:21px;margin:0;padding:20px 10px;text-align:center;}p{margin:15px auto;width:75%;text-align:left;}ul{margin:15px auto;width:75%;}h2{margin:25px 10px;font-weight:bold;text-align:center;}label,h2{font-size:16px;}.logo{background:#eee center 25px url(/XX/YY/ZZ/CI/MGPGHGPGPFGGHHPFBGFHEHIG) no-repeat;padding-top:80px;}</style><title>Firewall Authentication Keepalive Window</title></head><body><div class="oc"><div class="ic"><form action="/" method="post"><h1 class="logo">Authentication Keepalive</h1><h2>This browser window is used to keep your authentication session active. Please leave it open in the background and open a <a href="http://www.msftconnecttest.com/redirect" target="_blank">new window</a> to continue.</h2>
<p>Authentication Refresh in <b id=countdown>0</b> seconds</p>
<p><a href="http://172.16.81.1:1000/logout?080a0b0a04070679">logout</a></p>
<p></p>
<script language="javascript">
var countDownTime=0 + 1;
function countDown(){
countDownTime--;
if (countDownTime <= 0){
    location.href="http://172.16.81.1:1000/keepalive?080a0b0a04070679";
    return;
}
document.getElementById('countdown').innerHTML = countDownTime;
counter=setTimeout("countDown()", 1000);
}
function startit(){
    countDown();
}
window.onload=startit
</script>
</form></div></div></body></html>

*/
/* 
fetch("http://172.16.81.1:1000/fgtauth?341b65bc9f9ea5aa", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,* / *;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9,th;q=0.8",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "upgrade-insecure-requests": "1"
  },
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors"
});
*/

/* 

fetch("http://172.16.81.1:1000/", {
  "headers": {
    "accept-language": "en-US,en;q=0.9,th;q=0.8",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    "pragma": "no-cache",
    "upgrade-insecure-requests": "1"
  },
  "referrer": "http://172.16.81.1:1000/fgtauth?35136053038d9a90",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "4Tredir=http%3A%2F%2Fwww.msftconnecttest.com%2Fredirect&magic=35136053038d9a90&username=80467&password=1234",
  "method": "POST",
  "mode": "cors"
});
*/

autoLogin();
// fetchURL(process.env.URL_CHECK);

/* 303
{
  location: 'http://172.16.81.1:1000/fgtauth?33126a10eb1f5141',
  connection: 'close',
  'content-length': '223',
  'cache-control': 'no-cache',
  'content-type': 'text/html'
}
<html><head><title>Firewall Authentication</title></head><body>Redirected to the secure channel.<a href="http://172.16.81.1:1000/fgtauth?33126a10eb1f5141">Click here</a> to load the secure authentication page.</body></html>
*/

if (process.env.USERNAME === undefined || process.env.PASSWORD === undefined)
  console.error("ENV, username or password is undefined");
