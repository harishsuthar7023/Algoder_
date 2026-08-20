import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../utils/api";

function RequireAdmin({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async () => {
      // Login hi nahi hai
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        if (mounted) {
          setIsAdmin(false);
        }
        return;
      }

      try {
        const response = await API.get("/user-profile/");

        if (mounted) {
          setIsAdmin(response.data?.is_superuser === true);
        }
      } catch (error) {
        console.error("Admin check failed:", error);

        if (mounted) {
          setIsAdmin(false);
        }
      }
    };

    checkAdmin();

    return () => {
      mounted = false;
    };
  }, []);

  // Check chal raha hai
  if (isAdmin === null) {
    return (
      <div className="fixed inset-0 bg-neutral-900 flex items-center justify-center z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-[3px] border-white/10 border-t-blue-400 rounded-full animate-spin" />

          <p className="text-white/70 text-sm">
            Checking authorization...
          </p>
        </div>
      </div>
    );
  }

  // Admin nahi hai
  if (isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  // Admin hai
  return children;
}

export default RequireAdmin;