import axios from "axios";

const api = axios.create({
  baseURL: "http://secret-tundra-55967.herokuapp.com/api"
});

export default api;
