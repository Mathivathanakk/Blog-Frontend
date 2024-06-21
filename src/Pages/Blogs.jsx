import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("http://localhost:5000/api/post/getposts");
    const data = await response.json();
    setBlogs(data);
    //console.log(data);
  };
  return (
    <div className="max-w-6xl mx-auto  p-4 flex flex-col flex-wrap gap-8 py-7">
      <div className="flex flex-col sm:flex-row gap-6 flex-wrap">
        {blogs.map((ele, i) => {
          return (
            <div key={i}>
              <Card
                className="max-w-sm flex flex-wrap "
                imgAlt="image"
                imgSrc={ele.image}
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {ele.title}
                  </h3>
                </div>
                <div className="flex-1">
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {ele.category}
                  </h5>
                </div>
                <div className="flex-1 ">
                  {" "}
                  <p className="font-normal text-gray-700 dark:text-gray-400 ">
                    {ele.content}
                  </p>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Blogs;
