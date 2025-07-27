import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-python";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/NavBar';


export default function AlgoCoursePlatform() {
  const [courseData, setCourseData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [checkLogin, setCheckLogin] = useState("");

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const res = await API.get('protected/');
        // setMessage(res.data.message);
      } catch (err) {
        console.error('Auth failed, redirecting to login:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setCheckLogin("You need to be logged in to continue.")
        // navigate('/login');
      }
    };
  fetchProtected();
  }, [navigate]);

  const hendelLogin = (() => {
    // setCheckLogin("You need to be logged in to continue.")
    navigate("/login")
  }
  )

  const Buycourse = (() => {
    // setCheckLogin("You need to be logged in to continue.")
    navigate("/courses")
  }
  )

  useEffect(() => {
    API.get("/course-data/")
      .then((res) => {
        if (res.data.success === false || res.data.data?.length === 0) {
          setErrorMessage("🚫 You haven’t purchased this course yet. Please buy the course to unlock the content.");
          return;
        }

        const topics = res.data.data || res.data;

        setCourseData(topics);

        if (topics.length > 0) {
          setSelectedTopic(topics[0]);
          if (topics[0].videos && topics[0].videos.length > 0) {
            setSelectedVideo(topics[0].videos[0]);
          }
          setExpandedTopics([0]);
        }
      })
      .catch((err) => {
        console.error("Course fetch error:", err);
        setErrorMessage("❌ Something went wrong. Please try again later.");
      });
  }, []);

  useEffect(() => {
    Prism.highlightAll();
  }, [selectedVideo]);

  const handleTopicClick = (index) => {
    setSelectedTopic(courseData[index]);
    setSelectedVideo(courseData[index].videos[0]);
    setExpandedTopics((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    setMobileDropdownOpen(false); // close on select
  };

  const handleVideoClick = (topic, video) => {
    setSelectedTopic(topic);
    setSelectedVideo(video);
  };

  const convertToEmbedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  if (checkLogin) {
    return (
      <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[100vh] bg-neutral-800">
        <div className="w-full max-w-md bg-[#303030] text-white p-8 rounded-2xl shadow-2xl border border-neutral-700">
          <h2 className="text-2xl font-bold text-red-400 mb-3">LOGIN ALGODER</h2>
          <p className="text-gray-300 mb-6">
            {checkLogin || "You need to be logged in to continue."}
          </p>
          <button
            onClick={hendelLogin}
            className="w-full bg-red-500 hover:bg-red-600 transition text-white font-semibold py-2 rounded-lg shadow-md"
          >
            Login
          </button>
        </div>
      </div>
      </>
    );
  }

  if (errorMessage) {
    return (
      <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[100vh] bg-neutral-800">
        <div className="w-full max-w-md bg-[#303030] text-white p-8 rounded-2xl shadow-2xl border border-neutral-700">
          <h2 className="text-2xl font-bold text-red-400 mb-3">Course Access Denied</h2>
          <p className="text-gray-300 mb-6">
            {errorMessage || "You haven’t purchased this course yet. Please buy to unlock all content."}
          </p>
          <button
            onClick={Buycourse}
            className="w-full bg-red-500 hover:bg-red-600 transition text-white font-semibold py-2 rounded-lg shadow-md"
          >
            🔒 Buy Course Now
          </button>
        </div>
      </div>
      </>
    );
  }

  if (courseData.length === 0) {
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
    <div className="h-screen bg-[#303030]  text-white flex flex-col">
      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-neutral-800 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">Algo Course</h1>
        <button
          className="text-white focus:outline-none"
          onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileDropdownOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Dropdown Sidebar for Mobile */}
      {mobileDropdownOpen && (
        <div className="md:hidden bg-neutral-800 px-4 py-2 border-b border-gray-700 space-y-2 z-50">
          {courseData.map((topic, idx) => (
            <div key={idx}>
              <button
                onClick={() => handleTopicClick(idx)}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-blue-400 hover:text-black transition"
              >
                {topic.name}
              </button>
              {expandedTopics.includes(idx) && (
                <div className="ml-4 mt-2 space-y-1">
                  {topic.videos.map((video, vidx) => (
                    <button
                      key={vidx}
                      onClick={() => handleVideoClick(topic, video)}
                      className={`block w-full text-left py-1 px-3 rounded-md text-sm ${
                        selectedVideo?.title === video.title
                          ? "bg-blue-400 text-black"
                          : "bg-[#3a3a3a] hover:bg-blue-300 hover:text-black"
                      } transition`}
                    >
                      {video.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden ">
        {/* Sidebar for Desktop */}
        <div className="hidden md:block w-64 bg-neutral-800 p-4 border-r border-gray-700 overflow-y-auto pt-26">
          <h2 className="text-xl font-bold mb-6 text-blue-400">Course Topics</h2>
          <div className="flex flex-col space-y-2">
            {courseData.map((topic, idx) => (
              <div key={idx}>
                <button
                  onClick={() => handleTopicClick(idx)}
                  className="w-full text-left  py-2 px-3 rounded-lg hover:bg-blue-400 hover:text-black transition"
                >
                  {topic.name}
                </button>
                {expandedTopics.includes(idx) && (
                  <div className="ml-4 mt-2 space-y-1">
                    {topic.videos.map((video, vidx) => (
                      <button
                        key={vidx}
                        onClick={() => handleVideoClick(topic, video)}
                        className={`block w-full text-left py-1 px-3 rounded-md text-sm ${
                          selectedVideo?.title === video.title
                            ? "bg-blue-400 text-black"
                            : "bg-[#3a3a3a] hover:bg-blue-300 hover:text-black"
                        } transition`}
                      >
                        {video.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto ">
          {selectedVideo && (
            <>
              <motion.h1
                className="text-2xl md:text-3xl font-bold text-white mb-6 pt-18"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {selectedVideo.title}
              </motion.h1>

              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-700 bg-black mb-10">
                <iframe
                  key={selectedVideo.video_url}
                  src={convertToEmbedUrl(selectedVideo.video_url)}
                  className="w-full h-full"
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Documentation Section */}
              {selectedVideo.documentation?.sections && (
                <div className="mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-blue-400 mb-4">
                    📘 {selectedVideo.documentation.title}
                  </h2>
                  {selectedVideo.documentation.sections.map((section, idx) => (
                    <div key={idx} className="mb-8">
                      {section.heading && (
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                          {section.heading}
                        </h3>
                      )}
                      {section.content && (
                        <ul className="list-disc ml-6 space-y-1 text-gray-300 text-sm md:text-base">
                          {section.content.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      )}
                      {section.code && (
                        <div className="mt-4 relative group">
                          <div className="text-sm text-yellow-400 mb-2">
                            📄 {section.code.filename}
                          </div>
                          <pre className="bg-[#1e1e1e] p-4 rounded-xl overflow-auto text-sm border border-gray-600">
                            <code className={`language-${section.code.language}`}>
                              {section.code.code}
                            </code>
                          </pre>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(section.code.code)
                            }
                            className="absolute top-9 right-2 bg-blue-400 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition hover:bg-blue-300"
                          >
                            Copy
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedTopic && selectedTopic.videos.length > 1 && (
                <div className="mt-12 border-t border-gray-700 pt-6">
                  <div className="text-sm text-gray-400 mb-4">
                    ❤️ Compiled by: Harish Suthar
                  </div>
                  <div className="flex justify-between text-white text-sm font-medium">
                    {/* Previous Video */}
                    {(() => {
                      const allVideos = selectedTopic.videos;
                      const currentIndex = allVideos.findIndex(
                        (v) => v.title === selectedVideo.title
                      );
                      const prevVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null;
                      return prevVideo ? (
                        <button
                          onClick={() => handleVideoClick(selectedTopic, prevVideo)}
                          className="hover:text-blue-400 flex items-center space-x-1"
                        >
                          <span>← Previous</span>
                          <span className="font-normal text-gray-300 ml-2">{prevVideo.title}</span>
                        </button>
                      ) : <div></div>;
                    })()}

                    {/* Next Video */}
                    {(() => {
                      const allVideos = selectedTopic.videos;
                      const currentIndex = allVideos.findIndex(
                        (v) => v.title === selectedVideo.title
                      );
                      const nextVideo = currentIndex < allVideos.length - 1 ? allVideos[currentIndex + 1] : null;
                      return nextVideo ? (
                        <button
                          onClick={() => handleVideoClick(selectedTopic, nextVideo)}
                          className="hover:text-blue-400 flex items-center space-x-1"
                        >
                          <span className="font-normal text-gray-300 mr-2">{nextVideo.title}</span>
                          <span>Next →</span>
                        </button>
                      ) : <div></div>;
                    })()}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
