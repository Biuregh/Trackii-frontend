import { Axios } from "axios";

baseURL: import.meta.env.VITE_API_URL
withCredentials: false
Authorization: `Bearer ${storage.getToken()}`