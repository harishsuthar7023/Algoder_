import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, ImageOff, Clock, BarChart3 } from "lucide-react";

const CourseCard = ({ course, index = 0 }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleViewCourse = () => {
    const loader = document.getElementById(`course-loader-${course.id}`);
    loader?.classList.remove("hidden");
    setTimeout(() => {
      loader?.classList.add("hidden");
      navigate(`/course/${course.id}`);
    }, 400);
  };

  const hasDiscount =
    course.original_price && Number(course.original_price) > Number(course.price);

  return (
    <div
      onClick={handleViewCourse}
      style={{ animationDelay: `${index * 0.05}s` }}
      className="group relative w-full text-left rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-white/[0.06] hover:-translate-y-1.5 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-neutral-800 overflow-hidden relative">
        {course.thumbnail_url && !imgError ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500">
            <div className="text-center">
              <ImageOff className="w-7 h-7 mx-auto mb-1.5 opacity-50" />
              <span className="text-xs">No image</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {hasDiscount && (
          <span className="absolute top-2.5 right-2.5 bg-red-500/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            {course.discount_percent}% off
          </span>
        )}

        {course.level && (
          <span className="absolute top-2.5 left-2.5 bg-neutral-900/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
            {course.level}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2.5 text-white relative">
        <h3 className="text-sm font-semibold leading-snug group-hover:text-blue-300 transition-colors duration-300 line-clamp-2">
          {course.title}
        </h3>

        {course.subtitle && (
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {course.subtitle}
          </p>
        )}

        {(course.duration || course.language) && (
          <div className="flex items-center gap-3 text-[11px] text-neutral-500 pt-0.5">
            {course.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.duration}
              </span>
            )}
            {course.language && (
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                {course.language}
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-1.5 border-t border-white/5">
          <span className="text-sm font-bold text-blue-300 pt-2">
            {Number(course.price) === 0 ? "Free" : `₹${course.price}`}
            {hasDiscount && (
              <span className="text-xs text-neutral-500 line-through ml-2 font-normal">
                ₹{course.original_price}
              </span>
            )}
          </span>
          <span className="flex items-center gap-1 text-blue-400 text-xs pt-2 group-hover:gap-1.5 transition-all duration-300">
            View course
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Loading overlay */}
        <div
          id={`course-loader-${course.id}`}
          className="hidden absolute inset-0 -m-4 bg-neutral-900/95 flex items-center justify-center rounded-2xl z-20"
        >
          <div className="flex items-center gap-2 text-blue-400">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400/30 border-t-blue-400" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;