import React, { useState, useEffect, useRef } from 'react';
import { Flower2 } from 'lucide-react';

const IngredientCard = ({ number, title, subtitle, description, delay }) => {
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

  return (
    <div
      ref={cardRef}
      className={`card-brand p-6 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* 數字標籤 - 使用數字標籤樣式 */}
        <span className="number-label">{number}.</span>
        <div className="flex-1">
          {/* 成分標題 - 使用功效標題樣式 */}
          <h3 className="feature-title mb-2">
            {title}
            {subtitle && (
              <span className="text-heyan-pink font-normal ml-2">
                （{subtitle}）
              </span>
            )}
          </h3>
          {description && (
            <p className="description-text">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const BenefitSection = ({ title, features, bgColor, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`py-16 ${bgColor} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transition: 'all 0.8s ease-out' }}
    >
      <div className="container mx-auto px-6">
        <div className={`flex flex-col md:flex-row items-center gap-12 ${
          index % 2 === 0 ? '' : 'md:flex-row-reverse'
        }`}>
          <div className="flex-1 text-center md:text-left">
            {/* 功效主標題 - 使用 H2 樣式 */}
            <h3 className="text-h2 text-heyan-green mb-6">{title}</h3>
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Flower2 className="w-5 h-5 text-heyan-pink mt-1 flex-shrink-0" />
                  {/* 功效描述 - 使用大段落樣式 */}
                  <p className="text-body-lg text-left">{feature}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-gradient-to-br from-pink-100 to-green-100 rounded-full flex items-center justify-center shadow-xl">
              <img 
                src="/images/logo2.png" 
                alt="荷顏 Lotus Beauty" 
                className="w-2/3 h-2/3 object-contain" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const ingredients = [
    { number: "1", title: "百年野山蔘幹細胞外秘體", subtitle: "抗老、激活細胞再生" },
    { number: "2", title: "益生菌酵母提取物", subtitle: "修復" },
    { number: "3", title: "積雪草萃取", subtitle: "修復、緊緻" },
    { number: "4", title: "芽孢桿菌發酵產物", subtitle: "美白、緊緻" },
    { number: "5", title: "菸鹼醯胺", subtitle: "美白、修護" },
    { number: "6", title: "甘草萃取液", subtitle: "亮白、舒緩" },
    { number: "7", title: "美白七合一植萃", subtitle: "淡斑、抗老" },
    { number: "8", title: "柳菊抗痘素", subtitle: "控油、抗痘" },
    { number: "9", title: "烏龍茶萃取", subtitle: "改善黑眼圈" },
    { number: "10", title: "超氧化物歧化酶簡稱(SOD)", subtitle: "還原自然健康肌膚" }
  ];

  const benefits = [
    {
      title: "深層修護力",
      features: [
        "益生菌酵母激活細胞代謝",
        "積雪草萃取強化肌膚屏障",
        "促進組織修護，恢復肌膚彈性"
      ],
      bgColor: "bg-gradient-to-r from-pink-50/50 to-transparent"
    },
    {
      title: "逆齡抗老化",
      features: [
        "百年野山蔘幹細胞促進膠原蛋白生成",
        "六胜肽撫平細紋，延緩肌膚老化",
        "海茴香萃取加速皮膚自我修復"
      ],
      bgColor: "bg-gradient-to-l from-green-50/50 to-transparent"
    },
    {
      title: "亮白淨斑效果",
      features: [
        "七合一美白植萃淡化暗沉",
        "菸鹼醯胺改善膚色不均",
        "甘草萃取提升肌膚透亮度"
      ],
      bgColor: "bg-gradient-to-r from-yellow-50/50 to-transparent"
    },
    {
      title: "舒緩抗痘配方",
      features: [
        "柳菊抗痘素調理油脂分泌",
        "多種植萃舒緩肌膚敏感",
        "減少粉刺痤瘡形成"
      ],
      bgColor: "bg-gradient-to-l from-pink-50/50 to-transparent"
    }
  ];

  return (
    <>
      {/* 成分特色區塊 */}
      <section id="ingredients" className="py-20 bg-brand-subtle relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
          <div className="w-full h-full bg-gradient-to-l from-green-200 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          {/* 區段標題 - 使用 H1 樣式 */}
          <h2 className="text-h1 text-center mb-4 text-heyan-green">
            十大主成分概覽
          </h2>
          <div className="divider-brand mb-12"></div>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {ingredients.map((ingredient, index) => (
              <IngredientCard
                key={index}
                {...ingredient}
                delay={index * 50}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 text-heyan-green font-semibold">
              {/* 品牌標語 - 使用品牌標語樣式 */}
              <span className="brand-tagline">素顏之美</span>
            </div>
            {/* 產品描述 - 使用大段落樣式 */}
            <p className="text-body-xl mt-4 text-heyan-gold">
              荷顏靚膚液 | 全方位修護 × 透亮新生
            </p>
          </div>
        </div>
      </section>

      {/* 產品功效區塊 */}
      <section id="benefits" className="bg-white">
        <div className="text-center py-16">
          {/* 區段標題 - 使用 H1 樣式 */}
          <h2 className="text-h1 text-heyan-green mb-4">
            四大功效 全面呵護
          </h2>
          <div className="divider-brand mb-8"></div>
          
          {/* 區段描述 - 使用大段落樣式 */}
          <p className="text-body-xl max-w-4xl mx-auto leading-relaxed">
            <span className="highlight-text">深層修護 × 逆齡抗老 × 亮白淨斑 × 舒緩抗痘</span><br/>
            四效合一，給您全方位的肌膚呵護體驗
          </p>
        </div>
        
        {benefits.map((benefit, index) => (
          <BenefitSection key={index} {...benefit} index={index} />
        ))}

        {/* 功效總結區塊 */}
        <div className="py-16 bg-brand-subtle">
          <div className="container mx-auto px-6 text-center">
            {/* 小節標題 - 使用 H3 樣式 */}
            <h3 className="text-h3 text-text-primary mb-8">全方位肌膚改善</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { icon: "修", title: "深層修護", desc: "激活細胞代謝，修復受損肌膚屏障" },
                { icon: "抗", title: "逆齡抗老", desc: "促進膠原蛋白生成，撫平歲月痕跡" },
                { icon: "白", title: "亮白淨斑", desc: "淡化暗沉斑點，提升肌膚透亮度" },
                { icon: "舒", title: "舒緩抗痘", desc: "調理油脂平衡，舒緩肌膚敏感" }
              ].map((item, index) => (
                <div key={index} className="card-brand p-6 text-center">
                  <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{item.icon}</span>
                  </div>
                  {/* 小標題 - 使用功效標題樣式 */}
                  <h4 className="feature-title mb-2">{item.title}</h4>
                  {/* 說明文字 - 使用說明文字樣式 */}
                  <p className="description-text">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;