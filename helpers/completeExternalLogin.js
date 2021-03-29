import auth from "helpers/auth";

// Check if the login is complete. If so, save auth cookie for user and return
// user object.
// From: https://github.com/netlify/netlify-identity-widget/blob/bf72002a14876b02cd1a4d05e6de94546dd2952b/src/netlify-identity.js#L197
const completeExternalLogin = async () => {
  const hash = (document.location.hash || "").replace(/^#\/?/, "");
  if (!hash) {
    return;
  }

  const accessTokenRoute = /access_token=/;
  const am = hash.match(accessTokenRoute);
  if (am) {
    const params = {};
    hash.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      params[key] = value;
    });
    if (!!document && params["access_token"]) {
      document.cookie = `nf_jwt=${params["access_token"]}`;
    }
    if (params["state"]) {
      try {
        // skip initialization for implicit auth
        const state = decodeURIComponent(params["state"]);
        const { auth_type } = JSON.parse(state);
        if (auth_type === "implicit") {
          return;
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
    document.location.hash = "";
    try {
      return await auth.createUser(params, true);
    } catch (e) {
      return false;
    }
  }
};

export default completeExternalLogin;
