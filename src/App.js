// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BeautyMemoryWebsite from './BeautyMemoryWebsite';
import LotusBeautyLanding from './components/LotusBeautyLanding';

function App() {
  return (
    <Router>
      <Routes>
        {/* 首頁 */}
        <Route path="/" element={<BeautyMemoryWebsite />} />
        
        {/* 荷顏產品 Landing Page */}
        <Route path="/lotus-beauty" element={<LotusBeautyLanding />} />
        <Route path="/lotusbeauty" element={<LotusBeautyLanding />} />
        <Route path="/nine-fire-beauty" element={<LotusBeautyLanding />} />
      </Routes>
    </Router>
  );
}

export default App;