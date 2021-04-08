import Cookies from "cookies";
import GoTrue from "gotrue-js";

const auth = new GoTrue({
  APIUrl: "https://admin.globalgoals.directory/.netlify/identity",
  setCookie: false,
});

// Return the user object if user is currently logged in
const authenticate = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  const auth_cookie = cookies.get("nf_jwt");

  if (auth_cookie == null) return false;

  try {
    return await auth.createUser({ access_token: auth_cookie });
  } catch (e) {
    return false;
  }
};

export default authenticate;
