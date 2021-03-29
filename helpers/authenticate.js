import Cookies from "cookies";
import auth from "helpers/auth";

// Return the user object if user is currently logged in
const authenticate = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  const auth_cookie = cookies.get("nf_jwt");

  try {
    return await auth.createUser({ access_token: auth_cookie });
  } catch (e) {
    return false;
  }
};

export default authenticate;
