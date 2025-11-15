// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BeautyMemoryWebsite from './BeautyMemoryWebsite';
import LotusBeautyLanding from './components/LotusBeautyLanding';
import Heyan28DaysLanding from './components/Heyan28DaysLanding';

function App() {
  return (
    <Router>
      <Routes>
        {/* 首頁 */}
        <Route path="/" element={<BeautyMemoryWebsite />} />
        
        {/* 荷顏產品 Landing Page */}
        <Route path="/lotusbeauty" element={<LotusBeautyLanding />} />
        <Route path="/lotusbeauty-2" element={<Heyan28DaysLanding />} />
      </Routes>
    </Router>
  );
}

export default App;