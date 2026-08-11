import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { Card, Field, TextArea, Button, Badge } from "../../components/Dashboard/ui";

const emptyForm = {
  title: "",
  subtitle: "",
  price: "",
  original_price: "",
  discount_percent: "",
  video_url: "",
  thumbnail_url: "",
  features: "",
  learning_objectives: "",
  requirements: "",
  target_audience: "",
  full_description: "",
  instructor_name: "",
  instructor_bio: "",
  instructor_image_url: "",
  language: "English",
  level: "Beginner",
  duration: "",
  is_active: true,
};

const CourseAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await API.get("/user-profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data.is_superuser) {
          alert("❌ You are not authorized to access this page");
          navigate("/");
          return;
        }
        fetchCourses();
      } catch (err) {
        console.error(err);
        navigate("/login/home/0/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({ ...emptyForm, ...course });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course? This will also delete all its topics and videos.")) return;
    try {
      await API.delete(`/admin/courses/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete course");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        const res = await API.put(`/admin/courses/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(courses.map((c) => (c.id === editingId ? res.data : c)));
        alert("✅ Course updated");
      } else {
        const res = await API.post("/admin/courses/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses([...courses, res.data]);
        alert("✅ Course created");
      }
      handleCancelEdit();
    } catch (err) {
      console.error(err);
      alert("❌ Error saving course");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Courses">
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
      title={editingId ? "Edit Course" : "Add New Course"}
      subtitle="Create and manage the courses shown to students"
      wide={false}
    >
      <Card className="p-5 sm:p-8 mb-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Title" name="title" value={formData.title} onChange={handleChange} required />
          <TextArea label="Subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} rows={2} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Price (₹)" name="price" type="number" value={formData.price} onChange={handleChange} required />
            <Field label="Original Price (₹)" name="original_price" type="number" value={formData.original_price} onChange={handleChange} />
            <Field label="Discount %" name="discount_percent" type="number" value={formData.discount_percent} onChange={handleChange} />
          </div>

          <Field label="Intro Video URL (YouTube)" name="video_url" value={formData.video_url} onChange={handleChange} />
          <Field label="Thumbnail URL" name="thumbnail_url" value={formData.thumbnail_url} onChange={handleChange} />

          <TextArea label="Features (one per line)" name="features" value={formData.features} onChange={handleChange} rows={3} />
          <TextArea label="Learning Objectives (one per line)" name="learning_objectives" value={formData.learning_objectives} onChange={handleChange} rows={3} />
          <TextArea label="Requirements (one per line)" name="requirements" value={formData.requirements} onChange={handleChange} rows={2} />
          <TextArea label="Target Audience (one per line)" name="target_audience" value={formData.target_audience} onChange={handleChange} rows={2} />
          <TextArea label="Full Description" name="full_description" value={formData.full_description} onChange={handleChange} rows={4} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Instructor Name" name="instructor_name" value={formData.instructor_name} onChange={handleChange} />
            <Field label="Instructor Image URL" name="instructor_image_url" value={formData.instructor_image_url} onChange={handleChange} />
          </div>
          <TextArea label="Instructor Bio" name="instructor_bio" value={formData.instructor_bio} onChange={handleChange} rows={2} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Language" name="language" value={formData.language} onChange={handleChange} />
            <Field label="Level" name="level" value={formData.level} onChange={handleChange} />
            <Field label="Duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 8 hours" />
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="accent-blue-400 w-4 h-4" />
            Active (visible to users)
          </label>

          <div className="pt-2 flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Update Course" : "Create Course"}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Course list */}
      <h2 className="text-lg font-semibold text-white mb-4">All Courses</h2>
      {courses.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-neutral-500 text-sm">No courses yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <Card key={course.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-neutral-100 truncate">{course.title}</h3>
                <p className="text-sm text-neutral-400 flex items-center gap-2 mt-1 flex-wrap">
                  <span>₹{course.price}</span>
                  <span className="text-neutral-600">·</span>
                  <span>{course.level}</span>
                  <Badge tone={course.is_active ? "emerald" : "rose"}>
                    {course.is_active ? "Active" : "Inactive"}
                  </Badge>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="secondary" onClick={() => navigate(`/courseadmin/${course.id}/content`)}>
                  Manage Content
                </Button>
                <Button variant="secondary" onClick={() => handleEdit(course)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(course.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default CourseAdmin;