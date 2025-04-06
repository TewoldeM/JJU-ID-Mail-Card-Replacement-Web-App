import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

const HeroImageslaider = ({}) => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat"
      // style={{ backgroundImage: `url('/Hero2.png')` }}
    >
      {/* Add your content here */}
      <div className="flex flex-col gap-2 md:gap-12 justify-center items-center ">
        <h1 className="text-2xl md:text-6xl dark:text-gray-300 font-bold text-center pt-48">
          Wel come to JJU Id and Mail
          <br /> Crad replacment system
        </h1>
        <h3 className="text-xl dark:text-gray-200 px-4 ml-2">
          Apply for Id card and mail card replacment and pay from any where
          <br />
          and Keep your time{" "}
        </h3>
        <Button
          variant={"outline"}
          className="border-gray-500 dark:bg-black bg-gray-200 text-black
                    dark:text-white dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default HeroImageslaider;
