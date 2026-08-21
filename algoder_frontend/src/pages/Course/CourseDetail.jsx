import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, HeadphonesIcon, RotateCcw, Clock, BarChart3, Globe } from "lucide-react";
import API from "../../utils/api";
import Navbar from "../../components/NavBar";
import Footer from "../../components/HomeSections/Footer";
import GlowOrb from "../../components/Effects/Gloworb";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/course/${id}/`)
      .then((res) => setCourse(res.data))
      .catch((err) => {
        console.error(err);
        setNotFound(true);
      });
  }, [id]);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes("youtube.com")) {
        const videoId = parsedUrl.searchParams.get("v");
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
      if (parsedUrl.hostname === "youtu.be") {
        const videoId = parsedUrl.pathname.substring(1);
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
      if (parsedUrl.pathname.startsWith("/embed/")) return url;
      return "";
    } catch {
      return "";
    }
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${course.id}/course`);
  };

  if (notFound) {
    return (
      <>
        <Navbar />
        <div className="relative flex items-center justify-center min-h-screen bg-neutral-900 px-5">
          <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl text-white p-8 rounded-2xl border border-white/10 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Course not found</h2>
            <p className="text-neutral-400 text-sm mb-6">
              This course may have been removed or the link is incorrect.
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-neutral-900 px-5 py-2.5 rounded-lg text-sm font-semibold"
            >
              Browse courses
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="relative bg-neutral-900 min-h-screen pt-24 px-4 sm:px-8 pb-24 overflow-hidden">
          <GlowOrb color="59,130,246" opacity={0.07} size={884} className="top-1/4 left-1/40" />
          <GlowOrb color="34,211,238" opacity={0.07} size={884} className="top-1/40 left-1/2" />
          <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="aspect-video rounded-2xl bg-white/[0.04] border border-white/10" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 bg-white/[0.04] rounded-lg" />
              <div className="h-24 rounded-2xl bg-white/[0.04]" />
              <div className="h-32 rounded-2xl bg-white/[0.04]" />
              <div className="h-16 rounded-2xl bg-white/[0.04]" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const hasDiscount =
    course.original_price && Number(course.original_price) > Number(course.price);
  const learningPoints = course.learning_objectives?.split("\n").filter(Boolean) || [];
  const requirementPoints = course.requirements?.split("\n").filter(Boolean) || [];

  return (
    <>
      <Navbar />
      <div className="relative bg-neutral-900 text-neutral-200 min-h-screen pt-24 px-4 sm:px-6 md:px-12 pb-24 overflow-hidden">
        <GlowOrb color="59,130,246" opacity={0.07} size={884} className="top-1/4 left-1/40" />
        <GlowOrb color="34,211,238" opacity={0.07} size={884} className="top-1/40 left-1/2" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-start">
          {/* LEFT: Video */}
          <div className="lg:sticky lg:top-24">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="text-neutral-400 text-sm sm:text-base mb-5">{course.subtitle}</p>
              )}
            </div>
            <div className="relative w-full h-[220px] sm:h-[320px] lg:h-[360px] bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              {course.video_url ? (
                <iframe
                  src={getYoutubeEmbedUrl(course.video_url)}
                  title={course.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  frameBorder="0"
                />
              ) : course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
                  No preview available
                </div>
              )}
            </div>

            {/* Meta row */}
            {(course.duration || course.level || course.language) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {course.level && (
                  <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-neutral-300 text-xs font-medium px-3 py-1.5 rounded-full">
                    <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                    {course.level}
                  </span>
                )}
                {course.duration && (
                  <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-neutral-300 text-xs font-medium px-3 py-1.5 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    {course.duration}
                  </span>
                )}
                {course.language && (
                  <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-neutral-300 text-xs font-medium px-3 py-1.5 rounded-full">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    {course.language}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Info */}
          <div className="space-y-5">


            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-2xl overflow-hidden">
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3">
                {Number(course.price) === 0 ? "Free" : `₹${course.price}`}
              </div>
              {hasDiscount && (
                <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                  <span className="text-neutral-500 line-through">₹{course.original_price}</span>
                  {course.discount_percent && (
                    <span className="bg-red-500/15 text-red-400 border border-red-400/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      {course.discount_percent}% off
                    </span>
                  )}
                  <span className="text-emerald-400 font-medium">
                    Save ₹{(course.original_price - course.price).toFixed(0)}
                  </span>
                </div>
              )}
              <button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-bold transition-all duration-200 shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:-translate-y-0.5 active:translate-y-0"
              >
                Purchase now
              </button>
            </div>

            {learningPoints.length > 0 && (
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-5 sm:p-6 rounded-2xl">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  What you'll learn
                </h3>
                <ul className="space-y-2 text-sm">
                  {learningPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 shrink-0" />
                      <span className="text-neutral-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(course.instructor_name || course.instructor_bio) && (
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-5 sm:p-6 rounded-2xl">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  About the instructor
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  {course.instructor_image_url && (
                    <img
                      src={course.instructor_image_url}
                      alt={course.instructor_name}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                    />
                  )}
                  <span className="font-semibold text-white">{course.instructor_name}</span>
                </div>
                {course.instructor_bio && (
                  <p className="text-neutral-400 text-sm leading-relaxed">{course.instructor_bio}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Requirements */}
        {requirementPoints.length > 0 && (
          <div className="relative max-w-7xl mx-auto mt-8 animate-element fade-in-up">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {requirementPoints.map((point, i) => (
                  <div className="flex items-center gap-3" key={i}>
                    <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" />
                    <span className="text-neutral-300 text-sm sm:text-base">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Full description */}
        {course.full_description && (
          <div className="relative max-w-7xl mx-auto mt-6 animate-element fade-in-up">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Course description</h2>
              <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
                {course.full_description}
              </p>
            </div>
          </div>
        )}

        {/* Trust cards */}
        <div className="relative max-w-7xl mx-auto mt-8 animate-element fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                icon: ShieldCheck,
                iconColor: "from-emerald-500 to-emerald-400",
                ring: "ring-emerald-400/20",
                title: "Lifetime access",
                desc: "One-time purchase with unlimited access and future updates",
              },
              {
                icon: HeadphonesIcon,
                iconColor: "from-blue-500 to-cyan-400",
                ring: "ring-blue-400/20",
                title: "Dedicated support",
                desc: "WhatsApp and email help whenever you get stuck",
              },
              {
                icon: RotateCcw,
                iconColor: "from-purple-500 to-fuchsia-400",
                ring: "ring-purple-400/20",
                title: "Self-paced learning",
                desc: "Learn on your own schedule, revisit lessons anytime",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-7 sm:p-8 rounded-2xl text-center transition-transform duration-300 hover:-translate-y-1 hover:border-white/20"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${item.iconColor} ring-4 ${item.ring} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="w-7 h-7 text-neutral-900" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}