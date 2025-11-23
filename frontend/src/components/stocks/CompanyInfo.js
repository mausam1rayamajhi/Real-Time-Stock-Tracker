// frontend/src/components/stocks/CompanyInfo.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

function CompanyInfo({ symbol }) {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setError("");
        const res = await axios.get(`${API_BASE_URL}/api/profile/${symbol}`);
        setInfo(res.data);
      } catch (err) {
        console.error("Profile load error:", err);
        setError("Unable to load company profile.");
      }
    };

    fetchInfo();
  }, [symbol]);

  if (error) return <p style={{ color: "salmon" }}>{error}</p>;
  if (!info) return <p>Loading company info...</p>;

  return (
    <div style={{ marginTop: "1rem" }}>
      {info.logo && (
        <img
          src={info.logo}
          alt="logo"
          width={50}
          style={{ borderRadius: "4px", background: "#fff" }}
        />
      )}
      {info.name && <h3>{info.name}</h3>}
      {info.finnhubIndustry && <p>{info.finnhubIndustry}</p>}
      {info.weburl && (
        <a href={info.weburl} target="_blank" rel="noreferrer">
          Website
        </a>
      )}
    </div>
  );
}

export default CompanyInfo;
