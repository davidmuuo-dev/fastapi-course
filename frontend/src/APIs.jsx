import axios from "axios";

const mainApi = axios.create({
    baseURL: "http://127.0.0.1:8000/posts"
});

export default mainApi;
