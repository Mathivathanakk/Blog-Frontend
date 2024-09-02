import React, { useEffect, useState } from "react";
import { Card} from "flowbite-react";


const Home = () => {
   

    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchData();
      }, []);
    
      const fetchData = async () => {
        const response = await fetch("https://blog-backend-3hx4.onrender.com/api/post/getposts");
        const data = await response.json();
        setBlogs(data);
        //console.log(data);
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
              
              </Card>
            </div>
          );
        })}
      </div>
   
    </div>
    );
};

export default Home;