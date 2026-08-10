import { Link } from "react-router";

function NotFound() {
  return (
    <main className="flex min-h-[650px] items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-blue-600">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-600">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;