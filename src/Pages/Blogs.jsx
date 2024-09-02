import React, { useEffect, useState } from "react";
import { Card, Button, Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const { currentuser } = useSelector((state) => state.user);

  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deletepost, setDeletePost] = useState("");
  const navigate = useNavigate();
  //console.log(currentuser);

  useEffect(() => {
    fetchData();
  }, [deletepost]);

  const fetchData = async () => {
    const response = await fetch("https://blog-backend-3hx4.onrender.com/api/post/getposts");
    const data = await response.json();
    setBlogs(data);
    //console.log(data);
  };

  const handleDelete = async () => {
    setShowModal(false);

    const response = await fetch(
      `https://blog-backend-3hx4.onrender.com/api/post/deletepost/${deletepost}/${currentuser.rest._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("Token"),
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.log(data.message);
    } else {
      setBlogs((prev) => prev.filter((post) => post._id !== deletepost));
    }
  };

  const handleEdit = (id) => {
    navigate(`/update-post/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {blogs.map((ele, i) => {
          return (
            <div key={i}>
              <Card className="max-w-sm flex flex-wrap p-1 rounded-lg">
                <img src={ele.image} alt="" className="rounded-lg" />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {ele.title}
                  </h3>
                </div>
                <div className="flex-1">
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {ele.category}
                  </h5>
                </div>
                <div className="flex-1 ">
                  <p className="font-normal text-gray-700 dark:text-gray-400 ">
                    {ele.content}
                  </p>
                </div>
                {currentuser.rest.isAdmin && (
                  <Button
                    className="cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setDeletePost(ele._id);
                    }}
                  >
                    Delete
                  </Button>
                )}
                {currentuser.rest.isAdmin && (
                  <Button
                    className="cursor-pointer"
                    onClick={() => {
                      handleEdit(ele._id);
                    }}
                  >
                    Update Post
                  </Button>
                )}
              </Card>
            </div>
          );
        })}
      </div>
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
              Are you Sure you want to delete this post
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

export default Blogs;
