import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import DashboardLayout from "../../components/Dashboard/Dashboardlayout";
import { Card, Field, Button } from "../../components/Dashboard/ui";

const emptyVideoForm = {
  title: "",
  video_url: "",
  order: 0,
  sections: [{ heading: "", content: [""], code: null }],
};

const CourseContentManager = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTopicName, setNewTopicName] = useState("");
  const [expandedTopic, setExpandedTopic] = useState(null);

  const [editingVideo, setEditingVideo] = useState(null);
  const [videoForm, setVideoForm] = useState(emptyVideoForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await API.get(`/course/${courseId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(res.data);
      setTopics(res.data.topics || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = async () => {
    if (!newTopicName.trim()) return;
    try {
      const res = await API.post(
        "/topics/",
        { course: courseId, name: newTopicName, order: topics.length },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTopics([...topics, { ...res.data, videos: [] }]);
      setNewTopicName("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add topic");
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Delete this topic and all its videos?")) return;
    try {
      await API.delete(`/topics/${topicId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopics(topics.filter((t) => t.id !== topicId));
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete topic");
    }
  };

  const openAddVideo = (topicId) => {
    setEditingVideo({ topicId, videoId: null });
    setVideoForm(emptyVideoForm);
  };

  const openEditVideo = (topicId, video) => {
    setEditingVideo({ topicId, videoId: video.id });
    const doc = video.documentation || {};
    setVideoForm({
      title: video.title,
      video_url: video.video_url,
      order: video.order,
      sections:
        doc.sections?.length > 0
          ? doc.sections.map((s) => ({
              heading: s.heading || "",
              content: s.content?.length > 0 ? s.content : [""],
              code: s.code || null,
            }))
          : [{ heading: "", content: [""], code: null }],
    });
  };

  const closeVideoForm = () => {
    setEditingVideo(null);
    setVideoForm(emptyVideoForm);
  };

  const handleDeleteVideo = async (topicId, videoId) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await API.delete(`/videos/${videoId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopics(
        topics.map((t) =>
          t.id === topicId ? { ...t, videos: t.videos.filter((v) => v.id !== videoId) } : t
        )
      );
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete video");
    }
  };

  const updateSection = (idx, field, value) => {
    const updated = [...videoForm.sections];
    updated[idx][field] = value;
    setVideoForm({ ...videoForm, sections: updated });
  };

  const updateBullet = (sIdx, bIdx, value) => {
    const updated = [...videoForm.sections];
    updated[sIdx].content[bIdx] = value;
    setVideoForm({ ...videoForm, sections: updated });
  };

  const addBullet = (sIdx) => {
    const updated = [...videoForm.sections];
    updated[sIdx].content.push("");
    setVideoForm({ ...videoForm, sections: updated });
  };

  const removeBullet = (sIdx, bIdx) => {
    const updated = [...videoForm.sections];
    updated[sIdx].content = updated[sIdx].content.filter((_, i) => i !== bIdx);
    setVideoForm({ ...videoForm, sections: updated });
  };

  const addSection = () => {
    setVideoForm({
      ...videoForm,
      sections: [...videoForm.sections, { heading: "", content: [""], code: null }],
    });
  };

  const removeSection = (idx) => {
    setVideoForm({ ...videoForm, sections: videoForm.sections.filter((_, i) => i !== idx) });
  };

  const toggleCode = (sIdx) => {
    const updated = [...videoForm.sections];
    updated[sIdx].code = updated[sIdx].code
      ? null
      : { filename: "", language: "python", code: "" };
    setVideoForm({ ...videoForm, sections: updated });
  };

  const updateCode = (sIdx, field, value) => {
    const updated = [...videoForm.sections];
    updated[sIdx].code[field] = value;
    setVideoForm({ ...videoForm, sections: updated });
  };

  const handleSaveVideo = async () => {
    setSaving(true);
    const documentation = {
      title: videoForm.title,
      sections: videoForm.sections
        .filter((s) => s.heading.trim() || s.content.some((c) => c.trim()) || s.code)
        .map((s) => ({
          heading: s.heading,
          content: s.content.filter((c) => c.trim()),
          ...(s.code && s.code.code.trim() ? { code: s.code } : {}),
        })),
    };

    const payload = {
      title: videoForm.title,
      video_url: videoForm.video_url,
      order: videoForm.order,
      documentation,
    };

    try {
      if (editingVideo.videoId) {
        const res = await API.put(`/videos/${editingVideo.videoId}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopics(
          topics.map((t) =>
            t.id === editingVideo.topicId
              ? { ...t, videos: t.videos.map((v) => (v.id === editingVideo.videoId ? res.data : v)) }
              : t
          )
        );
      } else {
        const res = await API.post(
          "/videos/",
          { ...payload, topic: editingVideo.topicId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTopics(
          topics.map((t) =>
            t.id === editingVideo.topicId ? { ...t, videos: [...t.videos, res.data] } : t
          )
        );
      }
      closeVideoForm();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save video");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Course Content">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={course?.title}
      subtitle="Manage topics and videos"
      wide={false}
      actions={
        <Button variant="ghost" onClick={() => navigate("/courseadmin")}>
          ← Back to courses
        </Button>
      }
    >
      {/* Add topic */}
      <div className="flex flex-col sm:flex-row gap-2 mb-8">
        <input
          type="text"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          placeholder="New topic name"
          className="flex-1 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:border-blue-400/50"
        />
        <Button onClick={handleAddTopic}>+ Add Topic</Button>
      </div>

      {/* Topics list */}
      <div className="space-y-4">
        {topics.map((topic) => (
          <Card key={topic.id} className="overflow-hidden">
            <div
              className="flex justify-between items-center gap-3 p-4 cursor-pointer hover:bg-white/[0.04] transition-colors"
              onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
            >
              <h3 className="font-semibold text-neutral-100 truncate">
                {topic.name}{" "}
                <span className="text-xs text-neutral-500 font-normal">
                  ({topic.videos?.length || 0} videos)
                </span>
              </h3>
              <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="secondary"
                  className="!py-1.5 !px-3 !text-xs bg-emerald-500/90 hover:bg-emerald-500 text-white border-0"
                  onClick={() => openAddVideo(topic.id)}
                >
                  + Video
                </Button>
                <Button
                  variant="danger"
                  className="!py-1.5 !px-3 !text-xs"
                  onClick={() => handleDeleteTopic(topic.id)}
                >
                  Delete Topic
                </Button>
              </div>
            </div>

            {expandedTopic === topic.id && (
              <div className="border-t border-white/10 p-4 space-y-2">
                {(!topic.videos || topic.videos.length === 0) && (
                  <p className="text-neutral-500 text-sm">No videos yet.</p>
                )}
                {topic.videos?.map((video) => (
                  <div
                    key={video.id}
                    className="flex justify-between items-center gap-3 bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2.5"
                  >
                    <span className="text-sm text-neutral-200 truncate">{video.title}</span>
                    <div className="flex gap-3 shrink-0">
                      <button
                        onClick={() => openEditVideo(topic.id, video)}
                        className="text-xs font-medium text-blue-400 hover:text-cyan-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(topic.id, video.id)}
                        className="text-xs font-medium text-rose-400 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Video editor modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              {editingVideo.videoId ? "Edit Video" : "Add Video"}
            </h2>

            <div className="space-y-4">
              <Field
                label="Video Title"
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
              />

              <Field
                label="YouTube URL"
                value={videoForm.video_url}
                onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                placeholder="https://youtu.be/..."
              />

              <Field
                label="Order"
                type="number"
                value={videoForm.order}
                onChange={(e) => setVideoForm({ ...videoForm, order: e.target.value })}
                className="w-28"
              />

              <div className="border-t border-white/10 pt-4">
                <label className="block mb-2 text-sm font-medium text-neutral-300">
                  Documentation Sections
                </label>

                {videoForm.sections.map((section, sIdx) => (
                  <div key={sIdx} className="mb-4 p-3 border border-white/10 rounded-lg bg-white/[0.02] space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => updateSection(sIdx, "heading", e.target.value)}
                        placeholder="Section heading (optional)"
                        className="flex-1 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                      />
                      {videoForm.sections.length > 1 && (
                        <button
                          onClick={() => removeSection(sIdx)}
                          className="px-2 bg-rose-500/90 hover:bg-rose-500 rounded-md text-xs text-white"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Bullets */}
                    <div className="space-y-1.5">
                      {section.content.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex gap-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => updateBullet(sIdx, bIdx, e.target.value)}
                            placeholder={`Point ${bIdx + 1}`}
                            className="flex-1 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                          />
                          {section.content.length > 1 && (
                            <button
                              onClick={() => removeBullet(sIdx, bIdx)}
                              className="px-2 bg-rose-500/70 hover:bg-rose-500 rounded-md text-xs text-white"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addBullet(sIdx)}
                        className="text-xs font-medium text-blue-400 hover:text-cyan-300"
                      >
                        + Add point
                      </button>
                    </div>

                    {/* Code toggle */}
                    <div>
                      <button
                        onClick={() => toggleCode(sIdx)}
                        className="text-xs font-medium text-purple-400 hover:text-purple-300"
                      >
                        {section.code ? "− Remove code block" : "+ Add code block"}
                      </button>

                      {section.code && (
                        <div className="mt-2 space-y-2 bg-neutral-950 border border-white/10 p-3 rounded-md">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={section.code.filename}
                              onChange={(e) => updateCode(sIdx, "filename", e.target.value)}
                              placeholder="filename.py"
                              className="flex-1 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                            />
                            <select
                              value={section.code.language}
                              onChange={(e) => updateCode(sIdx, "language", e.target.value)}
                              className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                            >
                              <option value="python" className="bg-neutral-900">Python</option>
                              <option value="javascript" className="bg-neutral-900">JavaScript</option>
                              <option value="json" className="bg-neutral-900">JSON</option>
                              <option value="bash" className="bg-neutral-900">Bash</option>
                            </select>
                          </div>
                          <textarea
                            value={section.code.code}
                            onChange={(e) => updateCode(sIdx, "code", e.target.value)}
                            rows={6}
                            placeholder="Paste your code here..."
                            className="w-full px-3 py-2 rounded-md bg-black text-emerald-400 font-mono text-sm border border-white/10"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button onClick={addSection} className="text-sm font-medium text-blue-400 hover:text-cyan-300">
                  + Add Section
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
              <Button onClick={handleSaveVideo} disabled={saving}>
                {saving ? "Saving…" : "Save Video"}
              </Button>
              <Button variant="secondary" onClick={closeVideoForm}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CourseContentManager;