import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import SignIn from "./Pages/SignIn";
import Blogs from "./Pages/Blogs";
import SignUp from "./Pages/SignUp";
import Header from "./Components/Header";
import FooterCom from "./Components/Footer";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";
import OnlyAdminPrivateRoute from "./Components/OnlyAdminPrivateRoute";
import CreatePost from "./Pages/CreatePost";

const App = () => {
  return (
    <>
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/about" element={<About />}/>
          <Route path="/blogs" element={<Blogs />}/>
          <Route element={<PrivateRoute />}>
          <Route path='/dashboard'element={<Dashboard />}/>

          </Route>
          <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/Create-post'element={<CreatePost />}/>

          </Route>
          <Route path='/signup' element={<SignUp />}/>
          <Route path="/signin" element={<SignIn />}/>
        </Routes>
        <FooterCom />
      </BrowserRouter>
    </>
  );
};

export default App;
