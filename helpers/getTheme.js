import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";

const theme = responsiveFontSizes(
  createMuiTheme({
    // Set a color palette
    palette: {
      primary: {
        main: "#2197d4",
      },
    },
    typography: {
      h1: {
        fontSize: "3.7rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "2.2rem",
        fontWeight: 500,
      },
      h3: {
        fontSize: "1.66rem",
        fontWeight: 300,
        textDecoration: "underline",
      },
      h4: {
        fontSize: "1.15rem",
        fontWeight: 400,
      },
      subtitle1: {
        fontSize: "1.5rem",
        fontWeight: 300,
        lineHeight: 1.2,
      },
      subtitle2: {
        fontSize: "1rem",
      },
      caption: {
        fontSize: ".7rem",
        letterSpacing: 0,
        lineHeight: 1.2,
      },
      overline: {
        fontSize: ".7rem",
        letterSpacing: 0,
        textTransform: "uppercase",
        lineHeight: 1,
        marginBottom: 8,
      },
    },
    props: {
      MuiTypography: {
        variantMapping: {
          h1: "h1",
          h2: "h2",
          h3: "h3",
          h4: "h4",
          subtitle1: "p",
          subtitle2: "p",
          caption: "p",
          overline: "p",
        },
      },
    },
  })
);

export { theme };
