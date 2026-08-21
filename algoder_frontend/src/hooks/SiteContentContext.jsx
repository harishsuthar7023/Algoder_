import { createContext, useContext, useEffect, useState } from "react";
import API from "../utils/api";

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    API.get("/site-content/")
      .then((res) => {
        if (!mounted) return;

        setContent(res.data);
        setError(false);
      })
      .catch((err) => {
        if (!mounted) return;

        console.error("Site content error:", err);
        setError(true);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SiteContentContext.Provider
      value={{
        content,
        loading,
        error,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error(
      "useSiteContent must be used inside SiteContentProvider"
    );
  }

  return context;
}