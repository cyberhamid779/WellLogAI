import { useState, useCallback } from "react";
import axios from "axios";
import WellChart from "./components/WellChart";
import AISummary from "./components/AISummary";
import ChatBox from "./components/ChatBox";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDepth, setSelectedDepth] = useState(null);

  const doUpload = useCallback(async (file) => {
    if (!file) return;
    setLoading(true);
    setError("");
    setLogData(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await axios.post(`${API}/upload`, form);
      setLogData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Fayl yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileInput = (e) => doUpload(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    doUpload(e.dataTransfer.files[0]);
  };

  return (
    <div className="app">
      <header className="header">
        <span className="logo">⛽ WellLogAI</span>
        <span className="tagline">LAS loq analizi · AI ilə gücləndirilmiş</span>
      </header>

      <main className="main">
        {!logData ? (
          <div className="upload-zone" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <div className="upload-icon">📂</div>
            <p>LAS faylını buraya sürüşdür və ya seç</p>
            <label className="btn">
              Fayl seç
              <input type="file" accept=".las" onChange={handleFileInput} hidden />
            </label>
            {loading && <p className="status">Analiz edilir, zəhmət olmasa gözləyin...</p>}
            {error && <p className="error">{error}</p>}
          </div>
        ) : (
          <div className="workspace">
            <div className="top-bar">
              <div className="well-info">
                <strong>{logData.well_info?.well || "Quyu"}</strong>
                {logData.well_info?.field && <span> · {logData.well_info.field}</span>}
                {logData.well_info?.company && <span> · {logData.well_info.company}</span>}
              </div>
              <label className="btn small">
                Yeni fayl
                <input type="file" accept=".las" onChange={handleFileInput} hidden />
              </label>
            </div>

            <div className="content-grid">
              <div className="chart-panel">
                <WellChart logData={logData} onDepthSelect={setSelectedDepth} selectedDepth={selectedDepth} />
              </div>
              <div className="side-panel">
                <AISummary summary={logData.ai_summary} />
                <ChatBox logData={logData} selectedDepth={selectedDepth} apiBase={API} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
