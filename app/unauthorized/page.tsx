// app/unauthorized/page.tsx
export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-500">Unauthorized Access</h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        You do not have permission to access this page.
        
      </p>
      <a
        href="/sign-in"
        className="mt-6 dark:bg-gray-900 dark:hover:bg-gray-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md dark:border-gray-800 border-gray-500 hover:border-2 bg-gray-700 hover:bg-gray-800"
      >
        Back to Sign In
      </a>
    </div>
  );
}
