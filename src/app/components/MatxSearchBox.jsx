import { useState, Fragment } from "react";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled";
import { topBarHeight } from "app/utils/constant";

// STYLED COMPONENTS
const SearchContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 9,
  width: "100%",
  display: "flex",
  alignItems: "center",
  height: topBarHeight,
  color: "black",
  background: "white",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  "&::placeholder": {
    color: "black"
  }
}));

const SearchInput = styled("input")(({ theme }) => ({
  width: "100%",
  border: "none",
  outline: "none",
  fontSize: "1rem",
  paddingLeft: "20px",
  height: "calc(100% - 5px)",
  background: "white",
  color: "black",
  "&::placeholder": { color: "black" }
}));

export default function MatxSearchBox() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <Fragment>
      {!open && (
        <IconButton onClick={toggle}>
          <Icon sx={{ color: "black" }}>search</Icon>
        </IconButton>
      )}

      {open && (
        <SearchContainer>
          <SearchInput type="text" placeholder="Search here..." autoFocus />
          <IconButton onClick={toggle} sx={{ mx: 2, verticalAlign: "middle", color: "black" }}>
            <Icon sx={{ color: "black" }}>close</Icon>
          </IconButton>
        </SearchContainer>
      )}
    </Fragment>
  );
}
