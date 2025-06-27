import axios from "axios";
import { BASEURL } from "../../public/config";


const axiosInstance = axios.create({
  baseURL: BASEURL,
});

export default axiosInstance;
