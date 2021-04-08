import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import AppLayout from "layouts/AppLayout";
import useUser from "helpers/useUser";

const LogoutPage = () => {
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    // Clear session
    if (user) user.clearSession();

    setLoading(false);
  }, []);

  return (
    <AppLayout>
      <Typography variant="h1" gutterBottom>
        {loading ? "Logging out..." : "Logout"}
      </Typography>
      <Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography variant="body1">
            You have been successfully logged out. Have a nice day!
          </Typography>
        )}
      </Box>
    </AppLayout>
  );
};

import withUser from "helpers/withUser";
export const getServerSideProps = withUser(({ res, user }) => {
  res.setHeader(
    "Set-Cookie",
    "nf_jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );

  // .logout() terminates the current user's session, not all sessions
  // where the user is signed in. It invalidates all refresh tokens (so no new
  // JWTs can be issued), but any JWTs continue to work until their expiry
  // (1 hour). This is a SECURITY RISK.
  // In the future, we can possibly set the lastLoggedOut time in the user's
  // app metadata and then check if the JWT was created after the last log out
  // (expiry date - 3600 seconds > last log out)
  // We can only write app metadata from within a deployed Netlify function.
  // See: https://github.com/netlify/gotrue-js#admin-methods
  // For now, we skip this and just manually remove the refresh token on the
  // client
  // if (user) user.logout();

  // Internally, sets currentUser to null. Necessary for our useUser hook to
  // produce the correct result.
  if (user) user.clearSession();

  return { props: {} };
});

export default LogoutPage;
