import { red } from "@mui/material/colors";
import { components } from "./components";

const themeOptions = {
  typography: {
    fontSize: 14,
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    body1: { fontSize: "14px" }
  },

  status: { danger: red[500] },
  components: { ...components }
};

export default themeOptions;
