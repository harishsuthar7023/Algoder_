import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { Compass } from "lucide-react";

function NotFound() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-neutral-900 flex items-center justify-center px-5 overflow-hidden">
        <div className="pointer-events-none absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />

        <div className="relative w-full max-w-md bg-white/[0.03] backdrop-blur-xl text-white p-8 rounded-2xl border border-white/10 text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 flex items-center justify-center">
            <Compass className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">404</h1>
          <h2 className="text-lg font-semibold text-white mb-2">Page not found</h2>
          <p className="text-neutral-400 text-sm mb-6">
            The page you're looking for doesn't exist or may have moved.
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
          >
            Back to home
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotFound;