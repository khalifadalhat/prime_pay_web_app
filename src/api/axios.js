import axios from "axios";

export const randomUserApi = axios.create({
  baseURL: "https://randomuser.me/api",
});

export const movieApi = axios.create({
  baseURL: "https://mflix-movies.onrender.com/api",
});
