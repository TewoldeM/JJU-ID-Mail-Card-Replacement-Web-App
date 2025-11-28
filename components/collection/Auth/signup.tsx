// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// export default function SignUpForm() {
//   const router = useRouter();
//   const [Email, setEmail] = useState("");
//   const [FirstName, setFirstName] = useState("");
//   const [LastName, setLastName] = useState("");
//   const [Password, setPassword] = useState("");
//   const [StudentId, setStudentId] = useState("");
//   const [Year, setYear] = useState("");
//   const [PhoneNumber, setPhoneNumber] = useState("");
//   const [error, setError] = useState("");
//   const [isError, setIsError] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useAuth();

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setIsError(false);

//     try {
//       const cleanedStudentId = StudentId.replace(/\D+/g, "");
//       const cleanedYear = Year.replace(/\D+/g, "");
//       const cleanedPhoneNumber = PhoneNumber.replace(/\D+/g, "");

//       // Input validation
//       if (
//         !FirstName ||
//         !LastName ||
//         !Password ||
//         !cleanedStudentId ||
//         !Email ||
//         !cleanedYear
//       ) {
//         setError("Please fill in all required fields");
//         setIsError(true);
//         return;
//       }

//       if (cleanedStudentId.length !== 4) {
//         setError("Student ID must be exactly 4 digits");
//         setIsError(true);
//         return;
//       }

//       if (cleanedYear.length !== 2) {
//         setError("Year must be exactly 2 digits");
//         setIsError(true);
//         return;
//       }

//       if (cleanedPhoneNumber && cleanedPhoneNumber.length !== 10) {
//         setError("Phone number must be 10 digits if provided");
//         setIsError(true);
//         return;
//       }

//       const response = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           FirstName,
//           LastName,
//           StudentId: cleanedStudentId,
//           Password,
//           Email,
//           Year: cleanedYear,
//           PhoneNumber: cleanedPhoneNumber || undefined, // Send undefined if empty
//         }),
//       });

//       const data = await response.json();
//       if (response.status === 200) {
//         if (!data.token || !data.refreshToken) {
//           setError("Registration failed: Missing tokens");
//           setIsError(true);
//           return;
//         }

//         login(data.token, data.refreshToken, data.user);
//         router.push("/StudentDashboard");
//       } else {
//         setError(data.error || "Registration failed");
//         setIsError(true);
//       }
//     } catch{
//       setIsError(true);
//       setError(error.message || "An unexpected error occurred during signup");
//       console.error("Signup error:", error);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSignup}
//       className="p-8 shadow-xl border-2 dark:border-green-950"
//     >
//       <h2 className="text-3xl font-bold mb-4">Sign Up</h2>
//       <div className="mb-4">
//         <div className="flex flex-col md:flex-row md:gap-8">
//           <div className="flex flex-col">
//             <label
//               className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
//               htmlFor="FirstName"
//             >
//               First Name
//             </label>
//             <input
//               type="text"
//               value={FirstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               placeholder="First Name"
//               required
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label
//               className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
//               htmlFor="LastName"
//             >
//               Last Name
//             </label>
//             <input
//               type="text"
//               value={LastName}
//               onChange={(e) => setLastName(e.target.value)}
//               placeholder="Last Name"
//               required
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="mb-4">
//         <div className="flex flex-col md:flex-row md:gap-8">
//           <div className="flex flex-col">
//             <label
//               className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
//               htmlFor="StudentId"
//             >
//               Student ID
//             </label>
//             <input
//               type="text"
//               value={StudentId}
//               onChange={(e) => setStudentId(e.target.value)}
//               placeholder="6512"
//               required
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label
//               className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
//               htmlFor="Year"
//             >
//               Year
//             </label>
//             <input
//               type="text"
//               value={Year}
//               onChange={(e) => setYear(e.target.value)}
//               placeholder="13"
//               required
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="mb-4">
//         <label
//           className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
//           htmlFor="Email"
//         >
//           Email
//         </label>
//         <input
//           type="email"
//           value={Email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
//         />
//       </div>
//       <div className="mb-4">
//         <label
//           className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
//           htmlFor="PhoneNumber"
//         >
//           Phone Number (optional)
//         </label>
//         <input
//           type="tel"
//           value={PhoneNumber}
//           onChange={(e) => setPhoneNumber(e.target.value)}
//           placeholder="0912324567"
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
//         />
//       </div>
//       <div className="mb-4">
//         <label
//           className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
//           htmlFor="Password"
//         >
//           Password
//         </label>
//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             value={Password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             required
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline pr-10"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
//             aria-label={showPassword ? "Hide password" : "Show password"}
//           >
//             {showPassword ? (
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                 />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                 />
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>
//       <div className="flex justify-between">
//         <Button
//           type="submit"
//           className={cn(
//             "bg-green-800 hover:bg-green-900 border-green-700 hover:border-2 text-white hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md"
//           )}
//         >
//           Sign Up
//         </Button>
//         <Button
//           onClick={() => router.push("/sign-in")}
//           className={cn(
//             "bg-green-800 hover:bg-green-900 border-green-700 hover:border-2 text-white hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md"
//           )}
//         >
//           Sign In
//         </Button>
//       </div>
//       {isError && <p className="text-red-500 mt-4">{error}</p>}
//     </form>
//   );
// }
