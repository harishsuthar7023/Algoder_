// React Component: CourseAdmin.jsx
import React, { useState } from 'react';
import API from "../utils/api";

export default function CourseAdmin() {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!videoFile) return alert('Please select a video file.');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('upload_preset', 'unsigned_video'); // Create this in Cloudinary
    formData.append('resource_type', 'video');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dwagr8z7s/video/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      console.log('Uploaded:', data);
      console.log('Video URL:', data.secure_url);

      // Now send to your backend
      const payload = {
        title: title.trim(),
        topic: Number(topic),
        video_url: data.secure_url,
      };

      try {
        const backendRes = await API.post("/upload-video/", payload);
        console.log("Video uploaded:", backendRes.data);
      } catch (error) {
        console.error("Error uploading video:", error);
      }

      const result = await backendRes.json();
      console.log('Backend Response:', result);
      console.log('Uploaded:', data); // check for secure_url
    //   console.log('Backend Response:', await backendRes.json());
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Upload Course Video</h1>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full" />
      <input type="text" placeholder="Topic ID" value={topic} onChange={(e) => setTopic(e.target.value)} className="border p-2 w-full" />
      <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="border p-2 w-full" />
      <button onClick={handleUpload} disabled={uploading} className="bg-blue-500 text-white px-4 py-2 rounded">
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </div>
  );
}
