import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const AboutTheWebApp = () => {
  return (
    <div className="flex justify-center items-center p-0 gap-4 flex-col md:flex-row md:p-20">
      <div className="bg-green-300 w-2/3 md:w-1/3 h-80 rounded-full ">
        <img
          src="/apply6.webp"
          alt="Add Your Photo"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="flex justify-center items-center gap-6 flex-col mb-2">
        <h1 className="md:text-5xl text-gray-800 dark:text-gray-100 text-2xl px-4 ml-4 md:ml-0 md:p-2 font-bold flex justify-center items-center ">
          Apply for Id & Mail card Online & Download
        </h1>
        <p className="flex justify-center items-center w-2/3 font-medium dark:text-gray-200 text-sm md:text-lg">
          VolunteerHub helps you effect positive change.you get volunteers
          matched with the right cause at the right moment. you get the a larger
          number of highly qulified volunteers because you are matched withe
          pepole who are both passionate about and committed to your type Class.{" "}
          <br />
          And because volunteers are often interested in contributing thier
          moneyas well as thier time, we make it easy for them to donate to your
          cause. <br />
        </p>
        <Button
          variant={"outline"}
          className="border-gray-500 dark:bg-black bg-gray-200 text-black
             dark:text-white dark:hover:bg-gray-800 dark:hover:text-white"
        >
          {" "}
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default AboutTheWebApp;
