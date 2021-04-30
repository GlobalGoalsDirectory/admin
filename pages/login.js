import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@material-ui/core";
import AppLayout from "layouts/AppLayout";
import LoadingButton from "components/LoadingButton";
import useAuth from "helpers/useAuth";
import completeExternalLogin from "helpers/completeExternalLogin";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    // First, attempt to complete external login
    // This does not automatically set the needed cookie, so we need to force
    // JWT refresh afterwards.
    completeExternalLogin().then((user) => {
      // If no, then see if user is already saved in local storage
      if (!user) user = auth.currentUser();

      // If no, then let user log in
      if (!user) return setLoading(false);

      // If so, then check if the refresh token is valid by force-refreshing the
      // JWT. This will update the cookie needed on the serverside.
      user
        .jwt(true)
        .then(() => router.push("/"))
        // If JWT refresh fails, the session is removed from local storage and
        // the user can log in
        .catch(() => setLoading(false));
    });
  }, []);

  return (
    <AppLayout>
      <Typography variant="h1" gutterBottom>
        Login
      </Typography>
      <Box>
        <LoadingButton
          href={auth.loginExternalUrl("Google")}
          color="primary"
          variant="contained"
          size="large"
          loading={loading}
        >
          Login with Google
        </LoadingButton>
      </Box>
    </AppLayout>
  );
};

import withUser from "helpers/withUser";

export const getServerSideProps = withUser(async ({ user }) => {
  if (user) return { redirect: { destination: "/", permanent: false } };

  return { props: {} };
});

export default LoginPage;
