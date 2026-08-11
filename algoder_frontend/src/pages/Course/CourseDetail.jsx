import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import Navbar from "../../components/NavBar";
import Footer from "../../components/HomeSections/Footer";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/course/${id}/`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="text-center text-white pt-40">Loading...</div>
        <Footer />
      </>
    );
  }

  const handleBuyNow = () => {
    navigate(`/checkout/${course.id}/course`);
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
        const parsedUrl = new URL(url);

        // https://www.youtube.com/watch?v=VIDEO_ID
        if (parsedUrl.hostname.includes("youtube.com")) {
        const videoId = parsedUrl.searchParams.get("v");

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        }

        // https://youtu.be/VIDEO_ID
        if (parsedUrl.hostname === "youtu.be") {
        const videoId = parsedUrl.pathname.substring(1);

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        }

        // Already embed URL
        if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
        }

        return "";
    } catch {
        return "";
    }
    };
//   console.log(course.video_url);

  return (
    <>
      <Navbar />
      <div className="bg-neutral-900 min-h-screen text-white pt-24 px-4 sm:px-8 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            {/* {course.thumbnail_url && (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full rounded-xl mb-4"
              />
            )} */}
            {course.video_url && (
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                    src={getYoutubeEmbedUrl(course.video_url)}
                    title={course.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    />
                </div>
                )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-neutral-400">{course.subtitle}</p>
            </div>

            <div className="bg-neutral-800 p-6 rounded-xl">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                ₹{course.price}
                <span className="text-base text-neutral-500 line-through ml-3">
                  ₹{course.original_price}
                </span>
                <span className="text-sm bg-red-600 px-2 py-0.5 rounded-full ml-3">
                  {course.discount_percent}% OFF
                </span>
              </div>
              <button
                onClick={handleBuyNow}
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold mt-4"
              >
                Purchase
              </button>
            </div>

            <div className="bg-neutral-800 p-6 rounded-xl">
              <h3 className="font-bold mb-3">What you'll learn</h3>
              <ul className="space-y-1.5 text-neutral-300 text-sm">
                {course.learning_objectives.split("\n").filter(Boolean).map((point, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-400 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-800 p-6 rounded-xl">
              <h3 className="font-bold mb-3">About the instructor</h3>
              <div className="flex items-center gap-3 mb-2">
                {course.instructor_image_url && (
                  <img
                    src={course.instructor_image_url}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <span className="font-semibold">{course.instructor_name}</span>
              </div>
              <p className="text-neutral-400 text-sm">{course.instructor_bio}</p>
            </div>

            <div className="bg-neutral-800 p-6 rounded-xl">
              <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
                {course.full_description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}