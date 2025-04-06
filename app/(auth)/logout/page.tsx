// "use client";
// import { useRouter } from "next/navigation";

// function Logout() {
//   const router = useRouter();

//   const handleLogout = async () => {
//     const res = await fetch("/api/auth/logout", {
//       method: "DELETE",
//     });

//     if (res.ok) {
//       // Redirect to login or show logged-out state
//       router.push("/sign-up");
//     } else {
//       console.error("Failed to logout");
//     }
//   };
//   return (
//     <div className="flex justify-center items-center">
//       <div className="flex flex-col justify-center items-center">
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Logout;
