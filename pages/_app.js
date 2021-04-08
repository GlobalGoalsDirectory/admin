import App from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider } from "styled-components";
import NextNProgress from "nextjs-progressbar";
import { AuthProvider } from "helpers/useAuth";
import { theme } from "helpers/getTheme";
import auth from "helpers/auth";

function MyApp({ Component, pageProps }) {
  // Remove the server-side injected CSS.
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  // Refresh user's JWT every couple of minutes to make sure that our SSR
  // requests do not fail
  // Netlify identity is smart and will only request a new token when the
  // current JWT is nearing its expiration time.
  useEffect(() => {
    const REFRESH_INTERVAL_IN_MINS = 5;
    let jwtRefreshInterval = setInterval(
      () => auth.currentUser()?.jwt(),
      REFRESH_INTERVAL_IN_MINS * 60 * 1000
    );

    return () => clearInterval(jwtRefreshInterval);
  }, []);

  return (
    <>
      <Head>
        <title>Global Goals Directory - Admin Dashboard</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <NextNProgress />
      <AuthProvider auth={auth}>
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </MuiThemeProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
