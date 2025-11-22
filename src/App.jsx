import "./App.css";
import React from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";
import PhotoDetail from "./components/PhotoDetail";


const App = () => {
  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TopBar />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid size={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>
          <Grid size={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="/user/:userId" element={<UserDetail />} />
                <Route path="/photos/:userId" element={<UserPhotos />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/comments/:userId" element={<UserComments />} />
                <Route path="/photo/:photoId" element={<PhotoDetail />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
