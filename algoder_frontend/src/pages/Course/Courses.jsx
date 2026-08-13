import { useEffect, useState } from "react";
import { GraduationCap, RefreshCw } from "lucide-react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/HomeSections/Footer";
import CourseCard from "../../components/Course/CourseCard";
import API from "../../utils/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    API.get("/courses/")
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-neutral-900 text-white px-4 sm:px-10 pb-16 pt-28 overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute top-24 left-1/4 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
              Learn algo trading
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
              Courses
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
              Structured courses to take you from beginner to building your own trading systems.
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-white/5" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 bg-white/5 rounded" />
                    <div className="h-3 w-full bg-white/5 rounded" />
                    <div className="h-3 w-1/2 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error state */
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-400/20 flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">Couldn't load courses</h3>
              <p className="text-neutral-400 text-sm max-w-xs">
                Something went wrong. Please refresh the page or try again shortly.
              </p>
            </div>
          ) : courses.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">No courses available yet</h3>
              <p className="text-neutral-400 text-sm max-w-xs">
                Check back soon — new courses are on the way.
              </p>
            </div>
          ) : (
            /* Courses grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, i) => (
                <div
                  key={course.id}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  className="animate-in fade-in duration-500"
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Courses;