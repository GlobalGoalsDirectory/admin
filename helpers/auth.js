import GoTrue from "gotrue-js";

// Instantiate the GoTrue auth client
const auth = new GoTrue({
  APIUrl: "https://admin.globalgoals.directory/.netlify/identity",
  setCookie: false,
});

export default auth;
