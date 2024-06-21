import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiInformationCircle } from "react-icons/hi";
import {
  signoutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
} from "../Redux/Slice/UserSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const DashboardProfile = () => {

  const { currentuser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
console.log(currentuser)
  const [imageFile, setImageFile] = useState(null); //image file
  const [imageFileUrl, setImageFileUrl] = useState(null); //url of uploading image
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); //progressbar state
  const [imageFileUploadError, setImageFileUploadError] = useState(null); //IMAGE FILE UPLOAD ERROR
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filePickerRef = useRef();

  //onChange in the image uploading
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  //uploading process
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  //firebase image upload and storage part
  const uploadImage = async () => {
    setImageFileUploadError(null);
    setImageFileUploading(true);
    const storage = getStorage(app);
    const filename = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0)); //10.8787
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload the image (File size must be less than 2MB)"
        );
        setImageFileUrl(null);
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  //onchange in the input fields

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //updating user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No Changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait while the image is uploading");
      return;
    }

    try {
      dispatch(updateStart());
      const response = await fetch(
        `http://localhost:5000/api/user/update/${currentuser.rest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("Token"),
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User Profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  //handle SignOut
  const handleSignout = () => {
    dispatch(signoutSuccess());
    localStorage.removeItem("Token");
  };
  //delete account
  const handleDelete = async () => {
    setShowModal(false);
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/delete/${currentuser.rest._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("Token"),
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 w-full">
      <h1 className="text-center my-7 font-semibold text-3xl">PROFILE</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/.*"
          ref={filePickerRef}
          onChange={handleImageChange}
          hidden
        />

        <div
          className="relative w-32 h-32 self-center curser-pointer shadow-md overflow-hidden rounded"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,190,${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}

          <img
            src={imageFileUrl || currentuser.rest.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-40"
            }`}
          />
        </div>

        {imageFileUploadError && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium">🥴 OOPS !</span>
            {imageFileUploadError}
          </Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentuser.rest.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentuser.rest.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="*********"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="greenToBlue"
          className="w-full"
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
        {currentuser.rest.isAdmin && (<Link to='/create-post'> <Button
          type="submit"
          gradientDuoTone="greenToBlue"
          className="w-full"
          
        >
          Create Post
        </Button></Link>)}
      </form>
      <div className="text-red-600 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign Out
        </span>
      </div>

      {updateUserSuccess && (
        <Alert color="success" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium">👍 Yaaa!</span>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium">🥴 OOPS !</span>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium">🥴 OOPS !</span>
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="text-lg mb-5 text-gray-500 dark:text-gray-200">
              Are you Sure you want to delete this Account
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes,I'm Sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No Changed My Mind
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardProfile;
