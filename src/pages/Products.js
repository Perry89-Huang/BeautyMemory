// ========================================
// Products.js - 修復桌面版與手機版問題
// ========================================

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Leaf, CheckCircle, Clock, Star } from 'lucide-react';

const ProductCard = ({ product, index, onContactClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const getStatusInfo = (status) => {
    switch(status) {
      case 'available': 
        return { class: 'status-available', text: '現已上市', icon: <CheckCircle className="w-3 h-3" /> };
      case 'coming': 
        return { class: 'status-coming', text: '即將上市', icon: <Clock className="w-3 h-3" /> };
      default: 
        return { class: 'status-development', text: '開發中', icon: <Star className="w-3 h-3" /> };
    }
  };

  const statusInfo = getStatusInfo(product.status);

  return (
    <div
      ref={cardRef}
      className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 hover:shadow-3xl hover:-translate-y-2 h-full flex flex-col ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* 產品狀態標籤 */}
      <div className={`absolute top-4 right-4 ${statusInfo.class} z-10 flex items-center gap-1`}>
        {statusInfo.icon}
        <span className="text-xs">{statusInfo.text}</span>
      </div>

      {/* 產品圖片區 */}
      <div className={`relative h-80 ${product.bgGradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white/15"></div>
        </div>
        
        <div className="relative z-0 transform hover:scale-105 transition-transform duration-300">
          <div className="w-48 h-64 bg-gradient-to-b from-yellow-100 to-green-100 rounded-2xl shadow-xl flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <img 
                src={product.image} 
                alt={`荷顏 ${product.name} - 台灣製造天然護膚品`} 
                title={`荷顏 ${product.name} - 天然護膚專家`}
                className="w-36 h-48 object-contain" 
                loading="lazy"
              />
              <span className="text-caption mt-2">{product.name}</span>
            </div>
          </div>
        </div>

        {/* 裝飾元素 */}
        <div className="absolute top-6 left-6 animate-float">
          <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white/60" />
        </div>
        <div className="absolute bottom-8 left-8 animate-float-delayed">
          <Leaf className="w-3 h-3 md:w-5 md:h-5 text-white/50" />
        </div>
      </div>

      {/* 產品內容區 */}
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        {/* 產品名稱 */}
        <h3 className="product-name text-xl md:text-2xl mb-2">{product.name}</h3>
        
        {/* 產品描述 */}
        <p className="product-description mb-4 md:mb-6">{product.subtitle}</p>
        
        {/* 產品功效 */}
        <div className="space-y-3 mb-4 md:mb-6 flex-1">
          {product.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-heyan-green mt-0.5 flex-shrink-0" />
              <span className="description-text text-sm md:text-base text-left">{benefit}</span>
            </div>
          ))}
        </div>

        {/* 核心成分 */}
        {product.keyIngredients && (
          <div className="mb-4 md:mb-6">
            <h4 className="feature-title text-base md:text-lg mb-3">核心成分</h4>
            <div className="flex flex-wrap gap-2">
              {product.keyIngredients.map((ingredient, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-heyan-green-light/20 text-heyan-green rounded-full text-xs md:text-sm font-medium"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 行動按鈕區 */}
        <div className="mt-auto">
          {product.status === 'available' ? (
            <button 
              onClick={onContactClick}
              className="btn-primary w-full justify-center"
            >
              立即購買
            </button>
          ) : (
            <div className="text-center py-3">
              <span className="text-caption text-muted">敬請期待</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Products = ({ onContactClick }) => {
  const products = [
    {
      name: "荷顏靚膚液",
      image: "/images/prod1.png",
      subtitle: "全方位基礎護理",
      status: "available",
      bgGradient: "bg-gradient-to-br from-green-200 to-green-300",
      benefits: [
        "深層修護，激活肌底細胞再生",
        "抗老緊緻，撫平歲月痕跡",
        "亮白淨膚，均勻膚色色調",
        "舒緩抗痘，調理油脂平衡"
      ],
      keyIngredients: [
        "百年野山蔘幹細胞",
        "益生菌酵母",
        "積雪草萃取",
        "七合一美白植萃"
      ]
    },
    {
      name: "荷顏精華液",
      image: "/images/prod2.png",
      subtitle: "深層滲透修護",
      status: "available",
      bgGradient: "bg-gradient-to-br from-green-200 to-green-300",
      benefits: [
        "高濃度活性成分深度滲透",
        "專注修護受損肌膚屏障",
        "提升肌膚彈性與緊緻度",
        "加速細胞新陳代謝更新"
      ],
      keyIngredients: [
        "海茴香萃取",
        "玻尿酸",
        "六胜肽",
        "SOD酵素"
      ]
    },
    {
      name: "荷顏養顏液",
      image: "/images/prod3.png",
      subtitle: "奢華滋養護理",
      status: "coming",
      bgGradient: "bg-gradient-to-br from-yellow-200 to-yellow-300",
      benefits: [
        "深度滋養，重建肌膚屏障",
        "長效保濕，維持水潤光澤",
        "抗氧化護理，延緩肌膚衰老",
        "夜間修護，喚醒肌膚活力"
      ],
      keyIngredients: [
        "烏龍茶萃取",
        "海藻幹細胞",
        "氫化蓖麻油",
        "甘草萃取"
      ]
    }
  ];

  return (
    <section id="products" className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* 區段標題 */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-h2 md:text-h1 mb-4">
            產品系列規劃
          </h2>
          <div className="divider-brand mb-6 md:mb-8"></div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-body-lg md:text-body-xl leading-relaxed">
              從基礎護理到深層修護，再到奢華滋養<br className="hidden md:inline"/>
              <span className="highlight-text">打造完整的肌膚護理生態系統</span>
            </p>
          </div>
        </div>
        
        {/* 產品網格 - 響應式設計 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto mb-12 md:mb-20">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} index={index} onContactClick={onContactClick} />
          ))}
        </div>

        

        {/* SGS檢測認證 - 響應式優化 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">🛡️</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-text-primary">SGS安全檢測認證</h3>
            </div>
            <p className="description-text mb-6 max-w-3xl mx-auto">
              荷顏靚膚液已通過台灣SGS權威檢測，確保產品安全性與品質標準
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => window.open('/docs/SGS_report.pdf', '_blank')}
                className="btn-outline"
              >
                <span>📋</span>
                查看完整SGS檢測報告
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="feature-title">檢測項目完整</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="description-text">重金屬檢測（鉛、砷、汞、鎘）- 全數未檢出</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="description-text">微生物限量檢測 - 符合化妝品安全標準</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="description-text">有害細菌檢測 - 金黃色葡萄球菌等未檢出</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="feature-title">檢測資訊</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary font-medium">檢測機構：</span>
                  <span className="text-text-primary font-medium">SGS台灣檢驗科技股份有限公司</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary font-medium">報告編號：</span>
                  <span className="text-text-primary font-medium">PUG25601404</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary font-medium">檢測日期：</span>
                  <span className="text-text-primary font-medium">2025年07月18日</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary font-medium">檢測結果：</span>
                  <span className="text-success font-semibold">全項目合格</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;