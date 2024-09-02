import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../Redux/Slice/UserSlice";
import Oauth from "../Components/Oauth";

const SignIn = () => {

    const [formData, setFormData] = useState({});
   const dispatch=useDispatch();
   const {loading,error:errorMessage}=useSelector((state)=>state.user)


    const navigate = useNavigate();
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
      //  console.log(formData)
      // console.log(formData.username)
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if ( !formData.email || !formData.password) {
        return dispatch(signInFailure(("please fill out the fields")));
      }
      try {
        dispatch(signInStart())
        const response = await fetch(
          "https://blog-backend-3hx4.onrender.com/api/auth/login-user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        const data = await response.json();
        if (data.success === false) {
          return dispatch(signInFailure((data.message)));
        }
        if (response.ok) {
          localStorage.setItem('Token',data.token)
          dispatch(signInSuccess(data))
          navigate("/");
        }
      } catch (error) {
        dispatch(signInFailure((error.message)));
      }
    };




    return (
        <div className="min-h-screen mt-20">
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center  gap-5 ">
          <div className="flex-1">
            <div to="/" className="font-bold dark:text-white text-4xl">
              <span className="px-2 py-1 bg-gradient-to-r from-blue-600 via-pink to-green-500 rounded-lg text-white">
                Blogger
              </span>
              Blog!
            </div>
            <p className="text-sm mt-6">
              You can sign in with your Email and password or you can use the
              Google.
            </p>
          </div>
          <div className="flex-1">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              
  
              <div>
                <Label value="Email" />
                <TextInput
                  type="email"
                  placeholder="name@company.com"
                  id="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Password" />
                <TextInput
                  type="password"
                  placeholder="Enter Your password"
                  id="password"
                  onChange={handleChange}
                />
              </div>
  
              <Button
                gradientDuoTone="greenToBlue"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      color="success"
                      aria-label="Success spinner example"
                      size="sm"
                    />
  
                    <span className="px-3">Loading...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <Oauth />
            </form>
            <div className="flex gap-2 text-sm mt-6">
              <span>Don't have an Account ?</span>
  
              <Link to="/signup" className="text-blue-700 ">
                Sign Up
              </Link>
            </div>
            {errorMessage && (
              <Alert color="failure" icon={HiInformationCircle} className="mt-5">
                <span className="font-medium">🥴 OOPS !</span> {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    );
};

export default SignIn;