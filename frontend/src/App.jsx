import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./Pages/Auth/Login";

import ProtectedLayout from "./Pages/Auth/ProtectedLayout";
import Register from "./Pages/Auth/Register";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/Profile/EditProfile";
import Card from "./Pages/Card/Card"
import EditCard from "./Pages/Card/EditCard"

import { Routes, Route } from "react-router-dom";
import Target from "./Pages/Target/Target";
function App() {
  return (
    <>
      <div>
        <div className=" col-md-12 col-lg-12 rounded  ">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Profile />} />
              <Route path="/card" element={<Card />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/target" element={<Target />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/card" element={<Card/>} />
              <Route path="/edit-card" element={<EditCard/>} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
