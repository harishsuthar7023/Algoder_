import { Link } from "react-router-dom";
import { Star, ArrowRight, ImageOff } from "lucide-react";

const CourseCard = ({ course }) => {
  return (
    <Link
      to={`/course/${course.id}`}
      className="group relative w-full text-left rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-white/[0.06] hover:-translate-y-1.5"
    >
      <div className="aspect-video bg-neutral-800 overflow-hidden relative">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500">
            <ImageOff className="w-8 h-8 opacity-50" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-2 text-white">
        <h3 className="text-sm font-semibold leading-snug group-hover:text-blue-300">
          {course.title}
        </h3>
        <p className="text-xs text-neutral-400 line-clamp-2">{course.subtitle}</p>

        <div className="flex justify-between items-center pt-1">
          <span className="text-sm font-bold text-blue-300">
            ₹{course.price}
            {course.original_price > course.price && (
              <span className="text-xs text-neutral-500 line-through ml-2">
                ₹{course.original_price}
              </span>
            )}
          </span>
          <span className="flex items-center gap-1 text-blue-400 text-xs">
            View course <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;