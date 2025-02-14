import React, { useState } from "react";
import { uploadFile } from "../api";

const UploadForm = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file.");
        try {
            await uploadFile(file);
            alert("File uploaded successfully.");
            onUploadSuccess("upload");  // Set source to "upload"
        } catch (error) {
            alert("Error uploading file.");
        }
    };

    return (
        <div>
            <h2>Upload Video</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadForm;
