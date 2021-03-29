const LogoutPage = () => null;

import redirectToLoginPage from "helpers/redirectToLoginPage";

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Set-Cookie",
    "nf_jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );

  return redirectToLoginPage();
}

export default LogoutPage;
