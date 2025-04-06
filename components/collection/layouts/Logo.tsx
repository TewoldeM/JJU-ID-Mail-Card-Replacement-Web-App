import { HandCoins, Landmark } from "lucide-react";
import React from "react";
import Link from "next/link";
const Logo = () => {
  return (
    <Link href="/" >
      <div className="flex items-center justify-center gap-2">
        {/* <HandCoins className="stroke w-11 h-11 stroke-green-500 stroke-[1.5] " /> */}
        <img
          src="/jjulogo.jpg"
          alt="Add Your Photo"
          className="object-cover rounded-full   w-50 h-50 border-none"
          width={60}
          height={50}
        />
     
      </div>
    </Link>
  );
};
export default Logo;
export function MobileLogo () {
  return (
    <a href="/" className="flex items-center justify-center gap-2">
  <p className=" bg-gradient-to-r from-emerald-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
      JJUMMMMM
      </p>
    </a>
  );
};