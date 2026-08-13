// hooks/useSiteContent.js
import { useEffect, useState } from "react";
import API from "../utils/api";

export function useSiteContent() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/site-content/")
      .then((res) => setContent(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  // console.log(content)

  return { content, loading };
}