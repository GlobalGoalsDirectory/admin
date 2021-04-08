import GoTrue from "gotrue-js";

// Instantiate the GoTrue auth client
const auth = new GoTrue({
  APIUrl: "/api/auth",
  setCookie: true,
});

export default auth;
