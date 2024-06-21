import { Button } from "flowbite-react";
import React, { useState } from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../Redux/Slice/UserSlice";
import { app } from "../firebase";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const Oauth = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          profilePic: result.user.photoURL,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('Token',data.token)
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <Button type="button" gradientDuoTone="greenToBlue" onClick={handleSubmit}>
      <AiFillGoogleCircle className="w-6 h-6 mr-3" />
      Continue with Google
    </Button>
  );
};

export default Oauth;
