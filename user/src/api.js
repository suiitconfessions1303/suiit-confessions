import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  // Never wait forever: a sleeping or unreachable server must end in an
  // error the UI can handle instead of an endless loading screen.
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;