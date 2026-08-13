import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import DashboardLayout from "../../components/Dashboard/Dashboardlayout";
import { Card, Field, TextArea, Button } from "../../components/Dashboard/ui";
import { X } from "lucide-react";

const AddAdminProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    types: "",
    price: "",
    original_price: "",
    discount: "",
    is_active: true,
    homepage: false,
    file_url: "",
    video_url_1: "",   // 👈 naya
    video_url_2: "",   // 👈 naya
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [details, setDetails] = useState([""]);
  const [descriptions, setDescriptions] = useState([{ heading: "", content: "" }]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const CLOUDINARY_CLOUD_NAME = "dwagr8z7s";
  const CLOUDINARY_UPLOAD_PRESET = "wedding_card";

  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const json = await res.json();
    return json.secure_url;
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await API.get("/user-profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data.is_superuser) {
          alert("❌ You are not authorized to access this page");
          navigate("/");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("User check failed:", err);
        navigate("/login");
      }
    };
    checkUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index, value) => {
    const updated = [...details];
    updated[index] = value;
    setDetails(updated);
  };

  const addDetail = () => setDetails([...details, ""]);

  const removeDetail = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index, field, value) => {
    const updated = [...descriptions];
    updated[index][field] = value;
    setDescriptions(updated);
  };

  const addDescription = () =>
    setDescriptions([...descriptions, { heading: "", content: "" }]);

  const removeDescription = (index) => {
    setDescriptions(descriptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    setUploading(true);

    try {
      let uploadedImageUrls = [];
      if (images.length > 0) {
        uploadedImageUrls = await Promise.all(
          images.map((img) => uploadToCloudinary(img))
        );
      }

      const cleanDetails = details.filter((d) => d.trim() !== "");
      const cleanDescriptions = descriptions.filter(
        (d) => d.heading.trim() !== "" || d.content.trim() !== ""
      );

      const payload = {
        ...formData,
        images: uploadedImageUrls,
        details: cleanDetails,
        descriptions: cleanDescriptions,
      };

      const res = await API.post("/create-product/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        alert("✅ Product created successfully");
        setFormData({
          name: "",
          description: "",
          types: "",
          price: "",
          original_price: "",
          discount: "",
          is_active: true,
          homepage: false,
          file_url: "",
        });
        setImages([]);
        setPreviewImages([]);
        setDetails([""]);
        setDescriptions([{ heading: "", content: "" }]);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error creating product");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Add Product">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Add New Product" subtitle="Create a new product or course listing" wide={false}>
      <Card className="p-5 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
          />

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Write a short description..."
          />

          <Field
            label="Product Type (product / course)"
            name="types"
            value={formData.types}
            onChange={handleChange}
            placeholder="product / course"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field
              label="Price (₹)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
              placeholder="0.00"
            />
            <Field
              label="Original Price (₹)"
              name="original_price"
              type="number"
              value={formData.original_price}
              onChange={handleChange}
              step="0.01"
              placeholder="0.00"
            />
            <Field
              label="Discount (%)"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              step="0.01"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Video URL 1 (YouTube, optional)</label>
            <input
              type="url"
              name="video_url_1"
              value={formData.video_url_1}
              onChange={handleChange}
              placeholder="https://youtu.be/..."
              className="w-full px-4 py-2 rounded-md bg-neutral-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Product Url</label>
            <input
              type="url"
              name="video_url_2"
              value={formData.video_url_2}
              onChange={handleChange}
              placeholder="https://youtu.be/..."
              className="w-full px-4 py-2 rounded-md bg-neutral-700 text-white"
            />
          </div>

          {/* ---- Dynamic Images ---- */}
          <div>
            <label className="block mb-2 text-sm font-medium text-neutral-300">
              Product Images (upload as many as needed)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="block w-full text-sm text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-neutral-100 file:text-sm hover:file:bg-white/15 mb-3"
            />
            <div className="flex flex-wrap gap-3">
              {previewImages.map((src, idx) => (
                <div key={idx} className="relative">
                  <img src={src} alt={`preview-${idx}`} className="h-24 w-24 object-cover rounded-lg border border-white/10" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Dynamic Details ---- */}
          <div>
            <label className="block mb-2 text-sm font-medium text-neutral-300">Details (bullet points)</label>
            {details.map((detail, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={detail}
                  onChange={(e) => handleDetailChange(idx, e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:border-blue-400/50"
                  placeholder={`Detail ${idx + 1}`}
                />
                {details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDetail(idx)}
                    className="px-3 bg-rose-500/90 hover:bg-rose-500 rounded-lg text-sm text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addDetail} className="text-sm font-medium text-blue-400 hover:text-cyan-300">
              + Add Detail
            </button>
          </div>

          {/* ---- Dynamic Descriptions ---- */}
          <div>
            <label className="block mb-2 text-sm font-medium text-neutral-300">Full Descriptions</label>
            {descriptions.map((desc, idx) => (
              <div key={idx} className="mb-4 p-3 border border-white/10 rounded-lg bg-white/[0.02]">
                <input
                  type="text"
                  value={desc.heading}
                  onChange={(e) => handleDescriptionChange(idx, "heading", e.target.value)}
                  className="w-full mb-2 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:border-blue-400/50"
                  placeholder="Heading (optional)"
                />
                <textarea
                  value={desc.content}
                  onChange={(e) => handleDescriptionChange(idx, "content", e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:border-blue-400/50"
                  placeholder="Content"
                />
                {descriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDescription(idx)}
                    className="mt-2 text-sm font-medium text-rose-400 hover:text-rose-300"
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addDescription} className="text-sm font-medium text-blue-400 hover:text-cyan-300">
              + Add Description Section
            </button>
          </div>

          <Field
            label="Product File (Google Drive Link)"
            name="file_url"
            type="url"
            value={formData.file_url}
            onChange={handleChange}
            placeholder="https://drive.google.com/..."
          />

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="accent-blue-400 w-4 h-4"
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input
                type="checkbox"
                name="homepage"
                checked={formData.homepage}
                onChange={handleChange}
                className="accent-blue-400 w-4 h-4"
              />
              Show on Homepage
            </label>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading…" : "Save Product"}
            </Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
};

export default AddAdminProduct;