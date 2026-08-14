import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Dashboard/Dashboardlayout";
import API from "../../utils/api";

const KNOWN_SECTIONS = [
  { key: "hero", label: "Hero Section" },
  { key: "about_header", label: "About - Header" },
  { key: "about_tool_features", label: "About - Tool Features" },
  { key: "about_mission", label: "About - Mission" },
  { key: "about_reasons", label: "About - Why Choose Us Reasons" },
  { key: "about_cta", label: "About - Call To Action" },
  { key: "why_choose_us", label: "Home - Why Choose Us" },
  { key: "testimonials", label: "Home - Testimonials" },
  { key: "trust_indicators", label: "Home - Trust Indicators" },
  { key: "cta_banner", label: "Home - CTA Banner" },
  { key: "footer", label: "Footer" },
  { key: "contact_info", label: "Contact Page - Info & FAQs" },
];

// Admin CRUD endpoint — matches SiteContentAdminViewSet (router: 'admin/site-content')
const ADMIN_ENDPOINT = "/admin/site-content/";

const SiteContentAdmin = () => {
  const [contents, setContents] = useState([]); // array of {id, section, label, data, updated_at}
  const [selectedSection, setSelectedSection] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jsonError, setJsonError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const checkAndFetch = async () => {
      try {
        const res = await API.get("/user-profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data.is_superuser) {
          alert("❌ You are not authorized to access this page");
          navigate("/");
          return;
        }
        fetchContents();
      } catch (err) {
        navigate("/login/home/0/dashboard");
      }
    };
    checkAndFetch();
  }, []);

  const fetchContents = async () => {
    try {
      const res = await API.get(ADMIN_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSection = (sectionKey) => {
    setSelectedSection(sectionKey);
    setJsonError("");
    const existing = contents.find((c) => c.section === sectionKey);
    const known = KNOWN_SECTIONS.find((s) => s.key === sectionKey);

    if (existing) {
      setJsonText(JSON.stringify(existing.data, null, 2));
      setLabel(existing.label || known?.label || sectionKey);
    } else {
      setJsonText("{\n  \n}");
      setLabel(known?.label || sectionKey);
    }
  };

  const handleSave = async () => {
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
      setJsonError("");
    } catch (err) {
      setJsonError("Invalid JSON — please check syntax");
      return;
    }

    setSaving(true);
    try {
      const existing = contents.find((c) => c.section === selectedSection);
      const payload = { section: selectedSection, label, data: parsed };

      if (existing) {
        const res = await API.put(`${ADMIN_ENDPOINT}${existing.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContents(contents.map((c) => (c.id === existing.id ? res.data : c)));
      } else {
        const res = await API.post(ADMIN_ENDPOINT, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContents([...contents, res.data]);
      }
      alert("✅ Saved successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Site Content Manager">
        <p className="text-white p-6">Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Site Content Manager"
      subtitle="Edit JSON content for each section of your site"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section list */}
        <div className="md:col-span-1 space-y-1.5">
          {KNOWN_SECTIONS.map((s) => {
            const exists = contents.find((c) => c.section === s.key);
            return (
              <button
                key={s.key}
                onClick={() => handleSelectSection(s.key)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedSection === s.key
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {s.label}
                {!exists && <span className="text-xs text-yellow-400 ml-2">(empty)</span>}
              </button>
            );
          })}
        </div>

        {/* Editor */}
        <div className="md:col-span-2">
          {!selectedSection ? (
            <div className="bg-neutral-800 rounded-xl p-8 text-center text-neutral-400">
              ← Select a section to edit
            </div>
          ) : (
            <div className="bg-neutral-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 text-white">{label}</h3>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={20}
                spellCheck={false}
                className="w-full px-4 py-3 rounded-md bg-neutral-950 text-green-400 font-mono text-sm leading-relaxed"
              />
              {jsonError && <p className="text-red-400 text-sm mt-2">{jsonError}</p>}
              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-6 py-2 rounded-lg font-medium text-white"
              >
                {saving ? "Saving..." : "Save Section"}
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SiteContentAdmin;