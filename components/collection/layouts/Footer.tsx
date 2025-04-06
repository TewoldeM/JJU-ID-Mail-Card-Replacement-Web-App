import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import React from "react";
import Dashboard from "../../../app/Admin/AdminDashboard/page";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <>
      <Separator className="mt-4"/>
      <div className="flex flex-col md:flex-row justify-between items-center p-32 gap-8 ">
      <div className="flex flex-row gap-14 md:gap-64 items-center justify-center">
        <div className="">
          <div className="flex flex-col gap-4 ">
            <h2 className="text-xl font-bold">Quick Links</h2>
            <h3 className="cursor-pointer  font-semibold">
              ID Card Replacment
            </h3>
            <h3 className="cursor-pointer  font-semibold">
              Mail Card Replacment
            </h3>
            <h3 className="cursor-pointer  font-semibold">My Application</h3>
            <h3 className="cursor-pointer  font-semibold">Dashboard</h3>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col gap-4 ">
            <h2 className="text-xl font-bold">Services</h2>
            <h3 className="cursor-pointer  font-semibold">About</h3>
            <h3 className="cursor-pointer  font-semibold">Term</h3>
            <h3 className="cursor-pointer  font-semibold">
              ID Card Replacment
            </h3>
            <h3 className="cursor-pointer  font-semibold">
              Mail Card Replacment
            </h3>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center">
        <h2 className="font-bold">Follows us</h2>
        <div className="flex flex-row gap-8 ">
          <Facebook
            className="bg-blue-400 text-gray-300 rounded-md"
            size={40}
          />
          <Instagram
            className="bg-red-400 text-gray-300 rounded-md"
            size={40}
          />
          <Youtube className="bg-red-600 text-gray-300 rounded-md" size={40} />
          <Linkedin
            className="bg-blue-500 text-gray-300 rounded-md"
            size={40}
          />
        </div>
      </div>
    </div>
    </>
    
  );
};

export default Footer;
