import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

function TopBar() {
  const { userId } = useParams();
  const location = useLocation();

  let context = location.pathname.split("/").pop();

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          Pham Minh Tam - Photo Sharing App
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
