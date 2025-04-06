import React from "react";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ArrowRight } from "lucide-react";

const GuideSteps = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <h1 className="text-2xl md:text-4xl font-bold mb-12 gap-2 items-center justify-center">
        Steps Follow
      </h1>
      {/* <div className="flex items-center justify-center ml-4 md:px-0 h-screen md:mb-0 md:flex-col lg:flex-row flex-wrap"> */}
      <div className="flex flex-col lg:flex-row justify-center gap-2 p-2">
        <Card className="dark:bg-gray-950 justify-center items-center border-green-900">
          <CardHeader>
            <h2 className="text-lg font-bold mb-2">Step 1: Signup/Signin</h2>
          </CardHeader>
          <CardContent>
            <img
              src="/Signupandsignin2.png"
              alt="Arrow"
              className="w-72 h-44 mb-2"
            />
            <p className="text-gray-400 mb-4">Create an account or login</p>
          </CardContent>
        </Card>
        <ArrowRight
          className="lg:mt-44 hidden lg:inline-block md:inline-block sm:inline-block font-bold text-6xl text-green-700"
          size={40}
        />
        <Card className="dark:bg-gray-950 justify-center items-center  border-green-900">
          <CardHeader>
            <h2 className="text-lg font-bold mb-2">
              Step 2:Submit Application
            </h2>
          </CardHeader>
          <CardContent>
            <img src="/Apply1.webp" alt="Arrow" className="w-72 h-44 mb-2" />
            <p className="text-gray-400 mb-4">Fill out the application form</p>
          </CardContent>
        </Card>
        <ArrowRight
          className="lg:mt-44 hidden lg:inline-block md:inline-block sm:inline-block font-bold text-6xl text-green-700"
          size={40}
        />

        <Card className="dark:bg-gray-950 justify-center items-center  border-green-900">
          <CardHeader>
            <h2 className="text-lg font-bold mb-2">
              Step 3:Pay and collect your Card
            </h2>
          </CardHeader>
          <CardContent>
            <img
              src="/premium_photo-1681928677639-44267dea6af7.avif"
              alt="Arrow"
              className="w-72 h-44 mb-2"
            />
            <p className="text-gray-400 mb-4">Pay and collect your Card.</p>
          </CardContent>
        </Card>
        {/* </div> */}
      </div>
    </div>
  );
};

export default GuideSteps;
