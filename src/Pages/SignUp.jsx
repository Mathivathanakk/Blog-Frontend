import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
import Oauth from "../Components/Oauth";
const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    //  console.log(formData)
    // console.log(formData.username)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("please fill out the fields");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(
        "http://localhost:5000/api/auth/register-user",
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
        return setErrorMessage(data.message);
      }
      if (response.ok) {
        navigate("/signin");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
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
            You can sign up with your Email and password or you can use the
            Google.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder="Enter Your User Name"
                id="username"
                onChange={handleChange}
              />
            </div>

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
                "Sign Up"
              )}
            </Button>
            <Oauth />
          </form>

          <div className="flex gap-2 text-sm mt-6">
            <span>Already have an Account ?</span>

            <Link to="/signin" className="text-blue-700 ">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert color="failure" icon={HiInformationCircle}>
              <span className="font-medium">🥴 OOPS !</span> {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
