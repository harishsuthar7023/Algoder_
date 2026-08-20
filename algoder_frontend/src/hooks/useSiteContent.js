import { useEffect, useState } from "react";
import API from "../utils/api";

export function useSiteContent() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    API.get("/site-content/")
      .then((res) => {
        setContent(res.data);
        setError(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return { content, loading, error };
}