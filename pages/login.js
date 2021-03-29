import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import styled from "styled-components";
import AppLayout from "layouts/AppLayout";
import auth from "helpers/auth";
import completeExternalLogin from "helpers/completeExternalLogin";

const ButtonProgress = styled(CircularProgress)`
  && {
    top: 50%;
    left: 50%;
    margin-top: -12px;
    margin-left: -12px;
    position: absolute;
  }
`;

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    completeExternalLogin().then((user) => {
      if (user) return router.push("/");
      setLoading(false);
    });
  }, []);

  return (
    <AppLayout>
      <Typography variant="h1" gutterBottom>
        Login
      </Typography>
      <Box>
        <Box position="relative" display="inline-block">
          <Button
            color="primary"
            variant="contained"
            size="large"
            disabled={loading}
            href={auth.loginExternalUrl("Google")}
          >
            Login with Google
          </Button>
          {loading && <ButtonProgress size={24} />}
        </Box>
      </Box>
    </AppLayout>
  );
};

import authenticate from "helpers/authenticate";

export async function getServerSideProps({ req, res }) {
  const user = await authenticate({ req, res });
  if (user) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: {} };
}

export default LoginPage;
