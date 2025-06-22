import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import EnhancedMicrobeTool from './components/EnhancedMicrobeTool';
import GrowthPromotersTool from './components/GrowthPromotersTool';
import AIRecommendationTool from './components/AIRecommendationTool';
import { fertilizerProducts } from './data/fertilizerProducts';

const MAIN_GREEN = '#8cb43a';

function MainLandingPage() {
  const navigate = useNavigate();
  return (
    <div className="card" style={{ maxWidth: 600, margin: '3rem auto', textAlign: 'center', padding: '3rem 2rem' }}>
      <h1 style={{ color: MAIN_GREEN, fontSize: '2.2rem', marginBottom: 16 }}>NTS Product Recommendation Tool</h1>
      <p style={{ fontSize: '1.15rem', color: '#444', maxWidth: 520, margin: '0 auto 2.5rem auto' }}>
        Choose a category below to get tailored recommendations for your needs.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <button
          onClick={() => navigate('/microbes')}
          style={{
            padding: '2rem',
            borderRadius: 16,
            border: '2px solid #e0e0e0',
            background: '#f7faef',
            color: MAIN_GREEN,
            fontWeight: 700,
            fontSize: '1.25rem',
            cursor: 'pointer',
            boxShadow: '0 2px 12px #8cb43a11',
            transition: 'box-shadow 0.2s, border 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px #8cb43a33'}
          onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px #8cb43a11'}
        >
          🦠 Microbes<br /><span style={{ fontWeight: 400, color: '#444', fontSize: '1.05rem' }}>Find the best microbial products for your crop or soil</span>
        </button>
        <button
          onClick={() => navigate('/growth-promoters')}
          style={{
            padding: '2rem',
            borderRadius: 16,
            border: '2px solid #e0e0e0',
            background: '#f7faef',
            color: MAIN_GREEN,
            fontWeight: 700,
            fontSize: '1.25rem',
            cursor: 'pointer',
            boxShadow: '0 2px 12px #8cb43a11',
            transition: 'box-shadow 0.2s, border 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px #8cb43a33'}
          onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px #8cb43a11'}
        >
          🌱 Growth Promoters<br /><span style={{ fontWeight: 400, color: '#444', fontSize: '1.05rem' }}>Get recommendations for biostimulants and enhancers</span>
        </button>
        <button
          onClick={() => navigate('/fertilisers')}
          style={{
            padding: '2rem',
            borderRadius: 16,
            border: '2px solid #e0e0e0',
            background: '#f7faef',
            color: MAIN_GREEN,
            fontWeight: 700,
            fontSize: '1.25rem',
            cursor: 'pointer',
            boxShadow: '0 2px 12px #8cb43a11',
            transition: 'box-shadow 0.2s, border 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px #8cb43a33'}
          onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px #8cb43a11'}
        >
          🌾 Fertilisers<br /><span style={{ fontWeight: 400, color: '#444', fontSize: '1.05rem' }}>Find the best NTS fertiliser products for your needs</span>
        </button>
      </div>
    </div>
  );
}

function FertiliserTool() {
  const [recommendations, setRecommendations] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [suggestedNutrients, setSuggestedNutrients] = useState([]);

  const handleRecommendationsReceived = (products, explanation, nutrients) => {
    setRecommendations(products);
    setExplanation(explanation);
    setSuggestedNutrients(nutrients || []);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginRight: '1rem',
            color: MAIN_GREEN
          }}
        >
          ←
        </button>
        <h1 style={{ color: MAIN_GREEN, margin: 0 }}>NTS Fertiliser Finder</h1>
      </div>

      <AIRecommendationTool onRecommendationsReceived={handleRecommendationsReceived} />

      {recommendations.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', padding: '1.5rem', marginTop: '2rem' }}>
          <h2 style={{ color: MAIN_GREEN, marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
            Recommended Products ({recommendations.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {recommendations.map((product, index) => (
              <ProductCard key={index} product={product} suggestedNutrients={suggestedNutrients} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// A new, detailed component for displaying a single product
const ProductCard = ({ product, suggestedNutrients }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to convert values to percentage
  const convertToPercent = (value) => {
    if (typeof value !== 'string') return value;

    const cleanedValue = value.trim().toLowerCase();

    if (cleanedValue.endsWith('%')) {
      return value; // Already in percent
    }
    
    const number = parseFloat(cleanedValue);
    if (isNaN(number)) return value; // Cannot parse

    if (cleanedValue.includes('mg/l') || cleanedValue.includes('ppm')) {
      const percentage = number / 10000;
      // Format to a reasonable number of decimal places
      return `${percentage.toFixed(4)}%`;
    }
    
    // Return original value if no conversion rule matches
    return value;
  };

  const renderObject = (obj) => {
    return (
      <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.85rem' }}>
        {Object.entries(obj).map(([key, value]) => (
          <li key={key}>
            <strong>{key.replace(/_/g, ' ')}:</strong> {convertToPercent(value)}
          </li>
        ))}
      </ul>
    );
  };

  const getNutrientAnalysis = () => {
    if (!product.analysis || !suggestedNutrients || suggestedNutrients.length === 0) {
      return null;
    }

    const relevantAnalyses = new Map();
    suggestedNutrients.forEach(nutrient => {
      const searchTerm = nutrient.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${searchTerm}\\b`, 'i');
      
      Object.keys(product.analysis).forEach(key => {
        if (regex.test(key)) {
            if (!relevantAnalyses.has(key)) {
                 relevantAnalyses.set(key, {
                    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    value: product.analysis[key]
                });
            }
        }
      });
    });

    const analysesToShow = Array.from(relevantAnalyses.values());
    if (analysesToShow.length === 0) return null;

    return (
      <div style={{ background: '#eef6e2', padding: '0.75rem', borderRadius: '8px', margin: '1rem 0' }}>
        <h5 style={{ margin: '0 0 0.5rem 0', color: '#5a7c2a', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Analysis</h5>
        {analysesToShow.map((item, index) => (
          <div key={item.name} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '0.9rem', 
            borderTop: index > 0 ? '1px solid #dce8c7' : 'none',
            paddingTop: index > 0 ? '0.5rem' : 0, 
            marginTop: index > 0 ? '0.5rem' : 0 
          }}>
            <span style={{ textTransform: 'capitalize', color: '#333' }}>{item.name}</span>
            <strong style={{ color: MAIN_GREEN }}>{convertToPercent(item.value)}</strong>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: '1rem' }}>
        <h3 style={{ color: '#333', marginBottom: '0.75rem', fontSize: '1.2rem' }}>
          {product.product_name}
          {product.organic_certified && (
            <span title="Certified Organic" style={{ background: MAIN_GREEN, color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '10px', marginLeft: '0.5rem', verticalAlign: 'middle' }}>
              Organic
            </span>
          )}
        </h3>

        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          <strong>Form:</strong> {product.product_form}
        </p>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <strong>Nutrients:</strong> {product.nutrients.join(', ')}
        </p>

        {getNutrientAnalysis()}

        {product.description && (
          <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1rem', borderLeft: `3px solid ${MAIN_GREEN}`, paddingLeft: '0.75rem' }}>
            {product.description}
          </p>
        )}
      </div>

      <div style={{ borderTop: '1px solid #e0e0e0' }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '100%',
            background: '#f7f7f7',
            border: 'none',
            padding: '0.75rem',
            cursor: 'pointer',
            fontWeight: '600',
            color: '#444',
            borderBottomLeftRadius: isExpanded ? '0' : '12px',
            borderBottomRightRadius: isExpanded ? '0' : '12px',
          }}
        >
          {isExpanded ? 'Show Less' : 'Show More Details'}
        </button>

        {isExpanded && (
          <div style={{ padding: '1rem', background: '#fafafa', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
            {product.benefits && product.benefits.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>Benefits:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.85rem' }}>
                  {product.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                </ul>
              </div>
            )}
            
            {product.application_rates && (
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>Application Rates:</h4>
                {renderObject(product.application_rates)}
              </div>
            )}

            {product.analysis && (
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>Typical Analysis:</h4>
                {renderObject(product.analysis)}
              </div>
            )}

            {product.instructions && (
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>Instructions:</h4>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>{product.instructions}</p>
              </div>
            )}

            {product.storage_handling && (
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>Storage & Handling:</h4>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>{product.storage_handling}</p>
              </div>
            )}
            
            {product.link && (
              <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ color: MAIN_GREEN, fontWeight: 'bold', textDecoration: 'none' }}>
                More Info →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainLandingPage />} />
          <Route path="/microbes" element={<EnhancedMicrobeTool />} />
          <Route path="/growth-promoters" element={<GrowthPromotersTool />} />
          <Route path="/fertilisers" element={<FertiliserTool />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;