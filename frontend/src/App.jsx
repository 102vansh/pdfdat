import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [teams, setTeams] = useState([]);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      setTeams(response.data);
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await axios.get('http://localhost:5000/generate-pdf', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'teams.pdf');
      document.body.appendChild(link);
      link.click();
      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div>
      <h1>Team Generator</h1>
      <input type="file" onChange={onFileChange} />
      <button onClick={uploadFile}>Generate Teams</button>
      <button onClick={downloadPDF}>Download PDF</button>
      <div>
        <h2>Teams:</h2>
        <pre>{JSON.stringify(teams, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
