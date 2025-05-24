import React from "react";
import { Button } from "../../ui/button";
import Link from "next/link";

const AboutTheWebApp = () => {
  return (
    <div className="flex justify-center items-center p-0 gap-2 flex-col md:flex-row md:p-20">
      <div className="bg-green-300 w-4/5 md:w-[90rem] h-80 rounded-[1rem] overflow-hidden ">
        <img
          src="/apply6.webp"
          alt="Apply Online"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex justify-center items-center gap-6 flex-col mb-2">
        <h1 className="md:text-4xl text-gray-800 dark:text-gray-100 text-2xl px-4 ml-4 md:ml-0 md:p-2 font-bold flex justify-center items-center ">
          Apply For ID & MEAL Card Online & Save Your Time
        </h1>
        <p className="flex justify-center items-center w-2/3 font-medium dark:text-gray-200 text-sm md:text-lg pl-5">
          This platform allows Jigjiga University students to submit
          applications for lost or expired ID and meal card quickly and easily.
          Submit your request online from anywhere, without standing in long
          queues or visiting offices in person. After applying, track your
          application's status in real-time and receive notifications once it's
          approved or rejected. For approved applications, you'll be given a
          secure approval code to collect your card directly from the Student
          Dean's Office — with full transparency and no hassle.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="applications/IdandMailCardReplacement">
            <Button className="px-6 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition dark:bg-green-500 dark:hover:bg-green-600">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
    ///applications/IdandMailCardReplacement
  );
};

export default AboutTheWebApp;

{
  /* <p className="flex justify-center items-center w-2/3 font-medium dark:text-gray-200 text-sm md:text-lg"> */
}
