import { Link } from "react-router";

function AccessDenied() {
  return (
    <main className="flex min-h-[600px] items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <div className="text-7xl">⛔</div>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          Access Denied
        </h1>

        <p className="mt-3 text-gray-600">
          Your account does not have permission to open this page.
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

export default AccessDenied;
