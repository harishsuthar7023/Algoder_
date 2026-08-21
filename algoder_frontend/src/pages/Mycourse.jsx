import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import API from "../utils/api";
import {useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import GlowOrb from "../components/Effects/Gloworb";

import {
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Lock,
  FileText,
} from "lucide-react";

export default function AlgoCoursePlatform() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkLogin, setCheckLogin] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        await API.get("protected/");
      } catch (err) {
        console.error("Auth failed, redirecting to login:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setCheckLogin("You need to be logged in to continue.");
        setLoading(false);
      }
    };
    fetchProtected();
  }, [navigate]);

  useEffect(() => {
    if (checkLogin) return;
    API.get(`/course/${id}/content/`)
      .then((res) => {
        if (res.data.success === false) {
          setErrorMessage(
            "You haven't purchased this course yet. Please buy the course to unlock the content."
          );
          return;
        }

        const topics = res.data.data?.topics || [];   // 👈 fix: topics andar se nikalo

        if (topics.length === 0) {
          setErrorMessage("This course has no content yet. Please check back later.");
          return;
        }

        setCourseData(topics);
        setSelectedTopic(topics[0]);
        if (topics[0].videos?.length > 0) {
          setSelectedVideo(topics[0].videos[0]);
        }
        setExpandedTopics([0]);
      })
      .catch((err) => {
        console.error("Course fetch error:", err);
        setErrorMessage("Something went wrong. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [checkLogin, id]);

  useEffect(() => {
    Prism.highlightAll();
  }, [selectedVideo]);

  const handleLogin = () => navigate("/login");
  const handleBuyCourse = () => navigate("/courses");

  const handleTopicClick = (index) => {
    setSelectedTopic(courseData[index]);
    setSelectedVideo(courseData[index].videos[0]);
    setExpandedTopics((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    setMobileSidebarOpen(false);
  };

  const handleVideoClick = (topic, video) => {
    setSelectedTopic(topic);
    setSelectedVideo(video);
    setMobileSidebarOpen(false);
  };

  const convertToEmbedUrl = (url) => {
    if (!url) return "";

    // youtube.com/watch?v=VIDEO_ID
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // youtu.be/VIDEO_ID
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // already embed format ya kuch aur
    return url;
  };

  const handleCopy = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Shared centered-card shell for login / access-denied / loading states
  const StateCard = ({ children }) => (
    <>
      <Navbar />
      <div className="relative flex items-center justify-center min-h-screen bg-neutral-900 px-5 overflow-hidden">
        <GlowOrb color="59,130,246" opacity={0.07} size={884} className="top-1/4 left-1/40" />
        <GlowOrb color="34,211,238" opacity={0.07} size={884} className="top-1/40 left-1/2" />
        <div className="relative w-full max-w-md bg-white/[0.03] backdrop-blur-xl text-white p-8 rounded-2xl border border-white/10 text-center">
          {children}
        </div>
      </div>
    </>
  );

  if (checkLogin) {
    return (
      <StateCard>
        <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 flex items-center justify-center">
          <Lock className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Sign in required</h2>
        <p className="text-neutral-400 text-sm mb-6">
          {checkLogin || "You need to be logged in to continue."}
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 font-semibold py-2.5 rounded-lg transition-all"
        >
          Log in
        </button>
      </StateCard>
    );
  }

  if (loading) {
    return (
      <StateCard>
        <div className="w-8 h-8 mx-auto mb-5 border-[3px] border-white/10 border-t-blue-400 rounded-full animate-spin" />
        <h2 className="text-lg font-semibold text-white mb-1">Loading your course</h2>
        <p className="text-neutral-400 text-sm">Please wait while we prepare your content.</p>
      </StateCard>
    );
  }

  if (errorMessage) {
    return (
      <StateCard>
        <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-red-500/10 border border-red-400/20 flex items-center justify-center">
          <Lock className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Course access denied</h2>
        <p className="text-neutral-400 text-sm mb-6">{errorMessage}</p>
        <button
          onClick={handleBuyCourse}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 font-semibold py-2.5 rounded-lg transition-all"
        >
          Buy course now
        </button>
      </StateCard>
    );
  }

  // console.log(courseData)

  const TopicList = ({ mobile = false }) => (
    <div className="flex flex-col space-y-1.5">
      {courseData.map((topic, idx) => (
        <div key={idx}>
          <button
            onClick={() => handleTopicClick(idx)}
            className={`w-full flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
              selectedTopic === topic
                ? "bg-white/10 text-white border border-white/10"
                : "text-neutral-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            {topic.name}
            <ChevronDown
              className={`w-4 h-4 shrink-0 text-neutral-500 transition-transform duration-200 ${
                expandedTopics.includes(idx) ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedTopics.includes(idx) && (
            <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
              {topic.videos.map((video, vidx) => (
                <button
                  key={vidx}
                  onClick={() => handleVideoClick(topic, video)}
                  className={`block w-full text-left py-1.5 px-3 rounded-md text-xs sm:text-sm transition-colors ${
                    selectedVideo?.title === video.title
                      ? "bg-blue-500/15 text-blue-300 border border-blue-400/20"
                      : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                  }`}
                >
                  {video.title}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="h-screen bg-neutral-900 text-white flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex justify-between items-center px-4 py-4 pt-20 bg-white/[0.03] border-b border-white/10 backdrop-blur-xl shrink-0">
          <span className="text-base font-bold text-white">
            ALGO<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">DER</span> course
          </span>
          <button
            className="text-white p-1.5 rounded-lg hover:bg-white/5"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Toggle course menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile sidebar */}
        {mobileSidebarOpen && (
          <div className="md:hidden bg-neutral-900/95 backdrop-blur-xl px-4 py-4 border-b border-white/10 max-h-[60vh] overflow-y-auto shrink-0">
            <TopicList mobile />
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop sidebar */}
          <div className="hidden md:block w-72 shrink-0 bg-white/[0.02] border-r border-white/10 overflow-y-auto pt-24 px-4 pb-6">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-4 px-1">
              Course topics
            </h2>
            <TopicList />
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8 md:pt-24 pb-16">
              {selectedVideo && (
                <>
                  <motion.h1
                    key={selectedVideo.title}
                    className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-6 tracking-tight"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {selectedVideo.title}
                  </motion.h1>

                  <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black mb-10">
                    <iframe
                      key={selectedVideo.video_url}
                      src={convertToEmbedUrl(selectedVideo.video_url)}
                      className="w-full h-full"
                      title={selectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Documentation */}
                  {selectedVideo.documentation?.sections && (
                    <div className="mb-10">
                      <div className="flex items-center gap-2 mb-5">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <h2 className="text-lg md:text-xl font-bold text-white">
                          {selectedVideo.documentation.title}
                        </h2>
                      </div>

                      {selectedVideo.documentation.sections.map((section, idx) => (
                        <div key={idx} className="mb-6">
                          {section.heading && (
                            <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                              {section.heading}
                            </h3>
                          )}
                          {section.content && (
                            <ul className="space-y-1.5 text-neutral-400 text-sm md:text-base">
                              {section.content.map((point, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                  <span className="shrink-0 mt-2 w-1 h-1 rounded-full bg-blue-400" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          )}
                          {section.code && (
                            <div className="mt-4 rounded-xl border border-white/10 overflow-hidden bg-neutral-950">
                              {/* Terminal title bar */}
                              <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.04] border-b border-white/10">
                                <div className="flex items-center gap-4">
                                  <div className="flex gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                                  </div>
                                  <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                                    <FileText className="w-3.5 h-3.5" />
                                    {section.code.filename}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleCopy(section.code.code, `${idx}`)}
                                  className="flex items-center gap-1.5 text-neutral-400 hover:text-white text-xs transition-colors"
                                >
                                  {copiedIndex === `${idx}` ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Code area */}
                              <pre className="p-4 overflow-auto text-sm m-0 leading-relaxed">
                                <code className={`language-${section.code.language}`}>
                                  {section.code.code}
                                </code>
                              </pre>
                            </div>
                          )}


                        </div>
                      ))}
                    </div>
                  )}

                  {/* Prev / Next navigation */}
                  {selectedTopic && selectedTopic.videos.length > 1 && (
                    <div className="mt-10 pt-6 border-t border-white/10">
                      <div className="text-xs text-neutral-500 mb-4">
                        Compiled by Harish Suthar
                      </div>
                      <div className="flex justify-between items-center gap-4 text-sm">
                        {(() => {
                          const allVideos = selectedTopic.videos;
                          const currentIndex = allVideos.findIndex(
                            (v) => v.title === selectedVideo.title
                          );
                          const prevVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null;
                          return prevVideo ? (
                            <button
                              onClick={() => handleVideoClick(selectedTopic, prevVideo)}
                              className="flex items-center gap-2 text-neutral-300 hover:text-blue-400 transition-colors min-w-0"
                            >
                              <ChevronLeft className="w-4 h-4 shrink-0" />
                              <span className="truncate">{prevVideo.title}</span>
                            </button>
                          ) : (
                            <div />
                          );
                        })()}

                        {(() => {
                          const allVideos = selectedTopic.videos;
                          const currentIndex = allVideos.findIndex(
                            (v) => v.title === selectedVideo.title
                          );
                          const nextVideo =
                            currentIndex < allVideos.length - 1
                              ? allVideos[currentIndex + 1]
                              : null;
                          return nextVideo ? (
                            <button
                              onClick={() => handleVideoClick(selectedTopic, nextVideo)}
                              className="flex items-center gap-2 text-neutral-300 hover:text-blue-400 transition-colors min-w-0 text-right"
                            >
                              <span className="truncate">{nextVideo.title}</span>
                              <ChevronRight className="w-4 h-4 shrink-0" />
                            </button>
                          ) : (
                            <div />
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}