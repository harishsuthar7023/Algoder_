import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';

export default function CourseOverview() {
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/course/1/")
      .then(res => setCourse(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleBuyNow = () => {
    navigate(`/checkout/${course.id}/${course.types}`);
  };

  const split = (text) => text?.split(/\\n|\\r\\n|<br>|\\r/).filter(Boolean);

  // 👉 Updated Stylish Loader
  if (!course) {
    return (
      <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[100vh] bg-neutral-800">
        <div className="w-full max-w-md bg-[#303030] text-white p-8 rounded-2xl shadow-2xl border border-neutral-700 text-center">
          <h2 className="text-2xl font-semibold text-blue-400 mb-3">Loading Your Course</h2>
          <p className="text-gray-300 mb-6">Please wait while we prepare your content...</p>
          <div className="w-10 h-10 mx-auto border-4 border-blue-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <Navbar />
    <div className="bg-neutral-800 min-h-screen py-10 px-4 pt-26 text-white font-sans">
      <div className="max-w-6xl mx-auto bg-[#303030] rounded-3xl shadow-2xl p-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Course Preview Image/Video */}
          <div className="md:w-1/2 w-full">
            <div className="aspect-video overflow-hidden rounded-xl border border-gray-700 shadow-md">
              <iframe
                src={course.video_url}
                className="w-full h-full"
                title="Course Preview"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Course Info */}
          <div className="md:w-1/2 w-full">
            <h1 className="text-4xl font-extrabold text-white mb-2 leading-snug">{course.title}</h1>
            <p className="text-lg text-gray-400 mb-5">{course.subtitle}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-green-400 text-3xl font-bold">₹{course.price}</span>
              <span className="line-through text-gray-500 text-xl">₹{course.original_price}</span>
              <span className="text-pink-500 text-lg font-medium">({course.discount_percent}% OFF)</span>
            </div>

            <button onClick={handleBuyNow} className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-xl text-white font-bold shadow-lg tracking-wide">BUY NOW</button>

            <div className="mt-6 space-y-2 text-sm text-gray-300">
              {split(course.learning_objectives).map((item, i) => (
                <p key={i}>✅ {item}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-gray-700" />

        {/* Key Sections */}
        <div className="grid md:grid-cols-2 gap-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Requirements</h2>
            <ul className="list-disc ml-6 space-y-1">
              {split(course.requirements).map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Who This Course is For</h2>
            <ul className="list-disc ml-6 space-y-1">
              {split(course.target_audience).map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
        </div>

        {/* Full Description */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-white mb-3">Course Description</h2>
          <p className="text-gray-400 whitespace-pre-line leading-relaxed">{course.full_description}</p>
        </section>

        {/* Curriculum */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-white mb-3">Course Curriculum</h2>
          <ol className="list-decimal ml-6 text-gray-300 space-y-1">
            {split(course.curriculum).map((item, i) => <li key={i}>{item}</li>)}
          </ol>
        </section>

        {/* Instructor Info */}
        <section className="mt-12 flex items-center gap-6 bg-neutral-900 p-6 rounded-xl shadow-md">
          {course.instructor_image && (
            <img src={course.instructor_image} alt="Instructor" className="w-20 h-20 rounded-full border-2 border-gray-700 object-cover" />
          )}
          <div>
            <h3 className="text-xl font-semibold text-white">{course.instructor_name}</h3>
            <p className="text-gray-400 text-sm">{course.instructor_bio}</p>
          </div>
        </section>

        {/* Footer Info */}
        <div className="mt-8 text-sm text-gray-500 text-center">
          Language: {course.language} | Level: {course.level} | Duration: {course.duration}
        </div>
      </div>
    </div>
    </>
  );
}
