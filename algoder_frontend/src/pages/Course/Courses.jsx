import { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/HomeSections/Footer";
import CourseCard from "../../components/Course/CourseCard";
import API from "../../utils/api";

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get("/courses/")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-neutral-800 min-h-screen px-4 sm:px-10 pb-10 pt-24">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">
          Courses
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Courses;