// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BeautyMemoryWebsiteWithAuth from './BeautyMemoryWebsiteWithAuth';
import LotusBeautyLanding from './components/LotusBeautyLanding';
import Heyan28DaysLanding from './components/Heyan28DaysLanding';
import LotusBeautyLanding3 from './components/LotusBeautyLanding3';


function App() {
  return (
    <Router>
      <Routes>
        {/* 首頁 */}
        <Route path="/" element={<BeautyMemoryWebsiteWithAuth />} />
        
        {/* 荷顏產品 Landing Page */}
        <Route path="/lotusbeauty" element={<LotusBeautyLanding />} />
        <Route path="/lotusbeauty-2" element={<Heyan28DaysLanding />} />
        <Route path="/lotusbeauty-3" element={<LotusBeautyLanding3 />} />
      </Routes>
    </Router>
  );
}

export default App;