import React, { useState } from 'react';
import { Award, Shield, Check, Star } from 'lucide-react';

const SciencePage = ({ onClose }) => {
  // Add close button at the top
  const CloseButton = () => (
    <button 
      onClick={onClose}
      className="fixed top-4 right-4 z-50 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
  const antiAgingRankings = [
    { rank: 1, name: 'SOD', description: '超氧化物歧化酶' },
    { rank: 2, name: '羊胎素', description: '' },
    { rank: 3, name: '幹細胞', description: '' },
    { rank: 4, name: '酵素', description: '' },
    { rank: 5, name: '蝦青素', description: '' }
  ];

  const certifications = [
    '不含防腐劑酸類 (水楊酸、苯甲酸、對羥基苯甲酸、去水醋酸、己二烯酸)',
    '不含雌激素',
    '不含四大重金屬 (鉛砷汞鎘)'
  ];

  return (
    <div className="min-h-screen bg-white">
      <CloseButton />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            科學原理與產品特色
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            麗芙戀採用全球領先的SOD技術，結合七種植物中草藥發酵提取，
            打造純天然、安全有效的護膚產品。
          </p>
        </div>
      </section>

      {/* Anti-aging Rankings */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            全球公認抗衰成分排行榜
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {antiAgingRankings.map((item) => (
              <div key={item.rank} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition relative">
                <div className="absolute -top-3 -right-3 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {item.rank}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOD Technology */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">SOD科技突破</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start space-x-4 mb-6">
                <Shield className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">什麼是SOD？</h3>
                  <p className="text-gray-600">
                    SOD（SuperOxide Dismutase, 超氧化物歧化酶）是一種人體內會自行合成的酵素，
                    用來對抗細胞的氧化損傷，維持細胞年輕，防止老化！
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Award className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">獨特專利技術</h3>
                  <p className="text-gray-600">
                    我們的產品是7種植物中草藥發酵提取，其中紫蒜提取物含有SOD，
                    這是目前全球公認最好的抗衰成分。我們擁有將其應用於護膚領域的獨家專利。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Natural & Safe */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            純天然安全認證
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center mb-8">
                <img 
                  src="/api/placeholder/120/120"
                  alt="SGS認證"
                  className="rounded-lg"
                />
                <h3 className="text-xl font-bold ml-4">通過SGS權威認證</h3>
              </div>
              <ul className="space-y-4">
                {certifications.map((cert, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-600">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product Comparison */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            產品優勢對比
          </h2>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-4 text-left">比較項目</th>
                  <th className="p-4 text-center">麗芙戀</th>
                  <th className="p-4 text-center">其他品牌</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">主要成分</td>
                  <td className="p-4 text-center">天然SOD</td>
                  <td className="p-4 text-center">化學合成</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">安全性</td>
                  <td className="p-4 text-center">SGS認證</td>
                  <td className="p-4 text-center">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">價格</td>
                  <td className="p-4 text-center">親民</td>
                  <td className="p-4 text-center">高昂</td>
                </tr>
                <tr>
                  <td className="p-4">效果</td>
                  <td className="p-4 text-center">快速明顯</td>
                  <td className="p-4 text-center">效果不明顯</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SciencePage;