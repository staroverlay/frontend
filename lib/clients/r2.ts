import { Axios } from "axios";

const R2 = new Axios({
  baseURL: process.env["NEXT_PUBLIC_R2_WORKER"],
  headers: {
    "Content-Type": "application/json",
  },
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
});

export default R2;
