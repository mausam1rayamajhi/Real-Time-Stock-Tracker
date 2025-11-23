import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

function CompanyInfo({ symbol }) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/profile/${symbol}`)
      .then(res => setInfo(res.data))
      .catch(err => console.error(err));
  }, [symbol]);

  if (!info) return <p>Loading company info...</p>;

  return (
    <div>
      <img src={info.logo} alt="logo" width={50} />
      <h3>{info.name}</h3>
      <p>{info.finnhubIndustry}</p>
      <a href={info.weburl} target="_blank" rel="noreferrer">Website</a>
    </div>
  );
}

export default CompanyInfo;
