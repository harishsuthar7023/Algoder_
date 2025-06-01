import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashNav from "../components/DashNav";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    discount: "",
    detail_1: "",
    detail_2: "",
    detail_3: "",
    detail_4: "",
    detail_5: "",
    full_description1: "",
    full_description2: "",
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    is_active: true,
    homepage: false,
    file: null,
  });

  const [previewImages, setPreviewImages] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔒 Superuser check
  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:8000/api/user-profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.data.is_superuser) {
          alert("❌ You are not authorized to access this page");
          navigate("/");  // ya kisi aur public page par
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

  // 🔃 Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      if (file && name !== "file") {
        setPreviewImages((prev) => ({
          ...prev,
          [name]: URL.createObjectURL(file),
        }));
      }
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    const form = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    }

    try {
      const res = await axios.post("http://localhost:8000/api/create-product/", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        alert("✅ Product created successfully");
        setFormData({
        name: "",
        description: "",
        price: "",
        original_price: "",
        discount: "",
        detail_1: "",
        detail_2: "",
        detail_3: "",
        detail_4: "",
        detail_5: "",
        full_description1: "",
        full_description2: "",
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        is_active: true,
        homepage: false,
        file: null,
      });
        setPreviewImages({});
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error creating product");
    }
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;
  
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4">
      <DashNav />
      <div className="max-w-3xl mx-auto bg-neutral-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">🛒 Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-neutral-700 text-white"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 rounded-md bg-neutral-700 text-white"
              placeholder="Write a short description..."
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 text-sm font-medium">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
              className="w-full px-4 py-2 rounded-md bg-neutral-700 text-white"
              placeholder="Enter price"
            />
          </div>

          {/* Images */}
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num}>
              <label className="block mb-1 text-sm font-medium">Image {num}</label>
              <input
                type="file"
                name={`image${num}`}
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-300"
              />
              {previewImages[`image${num}`] && (
                <img
                  src={previewImages[`image${num}`]}
                  alt={`Preview ${num}`}
                  className="mt-2 h-24 rounded shadow"
                />
              )}
            </div>
          ))}

          {/* File Upload */}
            <div>
            <label className="block mb-1 text-sm font-medium">Product File</label>
            <input
                type="file"
                name="file"
                accept=".pdf,.doc,.docx,.zip,.csv,.xlsx,.txt"
                onChange={handleChange}
                className="block w-full text-sm text-gray-300"
            />
            </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="accent-green-500"
              />
              <span className="text-sm">Active</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="homepage"
                checked={formData.homepage}
                onChange={handleChange}
                className="accent-blue-500"
              />
              <span className="text-sm">Show on Homepage</span>
            </label>
          </div>

          {/* Original Price */}
          <div>
            <label className="block mb-1 text-sm font-medium">Original Price (₹)</label>
            <input
              type="number"
              name="original_price"
              value={formData.original_price}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 rounded-md bg-neutral-700 text-white"
              placeholder="Enter original price"
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block mb-1 text-sm font-medium">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 rounded-md bg-neutral-700 text-white"
              placeholder="Enter discount"
            />
          </div>

          {/* Detail Fields */}
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num}>
              <label className="block mb-1 text-sm font-medium">{`Detail ${num}`}</label>
              <input
                type="text"
                name={`detail_${num}`}
                value={formData[`detail_${num}`]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-neutral-700 text-white"
                placeholder={`Enter detail ${num}`}
              />
            </div>
          ))}

          {/* Full Description 1 */}
          <div>
            <label className="block mb-1 text-sm font-medium">Full Description 1</label>
            <textarea
              name="full_description1"
              value={formData.full_description1}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 rounded-md bg-neutral-700 text-white"
              placeholder="Enter full description 1"
            />
          </div>

          {/* Full Description 2 */}
          <div>
            <label className="block mb-1 text-sm font-medium">Full Description 2</label>
            <textarea
              name="full_description2"
              value={formData.full_description2}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 rounded-md bg-neutral-700 text-white"
              placeholder="Enter full description 2"
            />
          </div>
          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
