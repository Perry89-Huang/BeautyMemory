// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BeautyMemoryWebsiteWithAuth from './BeautyMemoryWebsiteWithAuth';
import LotusBeautyLanding from './components/LotusBeautyLanding';
import Heyan28DaysLanding from './components/Heyan28DaysLanding';
import LotusBeautyLanding3 from './components/LotusBeautyLanding3';
import VerifySuccess from './components/VerifySuccess';
import PaymentConfirm from './components/PaymentConfirm';


function App() {
  return (
    <Router>
      <Routes>
        {/* 首頁 */}
        <Route path="/" element={<BeautyMemoryWebsiteWithAuth />} />
        
        {/* Email 驗證成功頁面 */}
        <Route path="/verify-success" element={<VerifySuccess />} />
        
        {/* LINE Pay 付款確認頁面 */}
        <Route path="/payment/confirm" element={<PaymentConfirm />} />
        
        {/* 荷顏產品 Landing Page */}
        <Route path="/lotusbeauty" element={<LotusBeautyLanding />} />
        <Route path="/lotusbeauty-2" element={<Heyan28DaysLanding />} />
        <Route path="/lotusbeauty-3" element={<LotusBeautyLanding3 />} />
      </Routes>
    </Router>
  );
}

export default App;