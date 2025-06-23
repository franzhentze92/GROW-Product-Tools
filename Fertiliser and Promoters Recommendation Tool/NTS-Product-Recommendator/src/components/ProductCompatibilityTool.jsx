import React, { useState, useEffect } from 'react';
import { fertilizerProducts } from '../data/fertilizerProducts.js';
import { compatibilityService } from '../services/compatibilityService.js';

const MAIN_GREEN = '#8cb43a';

const ProductCompatibilityTool = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [useAI, setUseAI] = useState(false);

  // Filter products based on search term
  const filteredProducts = fertilizerProducts.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nutrients.some(nutrient => 
      nutrient.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const addProduct = (product) => {
    if (!selectedProducts.find(p => p.product_name === product.product_name)) {
      setSelectedProducts([...selectedProducts, product]);
      setSearchTerm('');
    }
  };

  const removeProduct = (productName) => {
    setSelectedProducts(selectedProducts.filter(p => p.product_name !== productName));
    setCompatibilityResult(null);
  };

  const analyzeCompatibility = async () => {
    if (selectedProducts.length < 2) return;

    setIsAnalyzing(true);
    setCompatibilityResult(null);

    try {
      // Set API key if provided
      if (useAI && apiKey) {
        compatibilityService.setApiKey(apiKey);
      } else {
        compatibilityService.setApiKey(null);
      }

      // Use the compatibility service
      const result = await compatibilityService.analyzeCompatibility(selectedProducts);
      
      setCompatibilityResult(result);
    } catch (error) {
      console.error('Error analyzing compatibility:', error);
      setCompatibilityResult({
        compatible: false,
        risk: 'high',
        explanation: 'Error occurred during analysis. Please try again.',
        recommendations: ['Check your internet connection and try again.'],
        products: selectedProducts.map(p => p.product_name),
        aiGenerated: false
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getCompatibilityIcon = (compatible) => {
    return compatible ? '✅' : '❌';
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
        <h1 style={{ color: MAIN_GREEN, margin: 0 }}>NTS Product Compatibility Tool</h1>
      </div>

      <div style={{ 
        background: '#f8f9fa', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        marginBottom: '2rem',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ color: MAIN_GREEN, marginBottom: '1rem' }}>🔬 Chemical Compatibility Analysis</h3>
        <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
          Select multiple NTS products to analyze their chemical compatibility for tank mixing. 
          Our advanced analysis considers pH compatibility, nutrient interactions, and potential precipitation issues.
        </p>
        
        {/* AI Settings */}
        <div style={{ 
          background: '#fff', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #dee2e6',
          marginBottom: '1rem'
        }}>
          <h4 style={{ color: MAIN_GREEN, marginBottom: '0.5rem' }}>Analysis Options</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
              />
              Use AI-powered analysis (requires API key)
            </label>
          </div>
          {useAI && (
            <div style={{ marginTop: '0.5rem' }}>
              <input
                type="password"
                placeholder="Enter OpenAI or Claude API key (optional)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              />
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                Leave empty to use local analysis. API key enables advanced AI-powered chemical compatibility assessment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Product Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: MAIN_GREEN, marginBottom: '1rem' }}>Select Products</h3>
        
        {/* Search Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search products by name or nutrients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Search Results */}
        {searchTerm && filteredProducts.length > 0 && (
          <div style={{ 
            background: '#fff', 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            maxHeight: '300px', 
            overflowY: 'auto',
            marginBottom: '1rem'
          }}>
            {filteredProducts.map((product, index) => (
              <div
                key={index}
                onClick={() => addProduct(product)}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
              >
                <div style={{ fontWeight: 'bold', color: MAIN_GREEN }}>{product.product_name}</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Nutrients: {product.nutrients.join(', ')}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                  Form: {product.product_form} | pH: {product.analysis?.pH || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ color: MAIN_GREEN, marginBottom: '0.5rem' }}>Selected Products ({selectedProducts.length})</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {selectedProducts.map((product, index) => (
                <div
                  key={index}
                  style={{
                    background: MAIN_GREEN,
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>{product.product_name}</span>
                  <button
                    onClick={() => removeProduct(product.product_name)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: '0',
                      marginLeft: '0.5rem'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyze Button */}
        {selectedProducts.length >= 2 && (
          <button
            onClick={analyzeCompatibility}
            disabled={isAnalyzing}
            style={{
              background: MAIN_GREEN,
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              opacity: isAnalyzing ? 0.7 : 1
            }}
          >
            {isAnalyzing ? '🔬 Analyzing...' : '🔬 Analyze Compatibility'}
          </button>
        )}
      </div>

      {/* Compatibility Results */}
      {compatibilityResult && (
        <div style={{ 
          background: '#fff', 
          borderRadius: '12px', 
          padding: '2rem', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: `3px solid ${getRiskColor(compatibilityResult.risk)}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem', marginRight: '1rem' }}>
              {getCompatibilityIcon(compatibilityResult.compatible)}
            </span>
            <div>
              <h2 style={{ 
                color: getRiskColor(compatibilityResult.risk), 
                margin: '0 0 0.5rem 0' 
              }}>
                {compatibilityResult.compatible ? 'Compatible' : 'Incompatible'}
              </h2>
              <div style={{ 
                background: getRiskColor(compatibilityResult.risk), 
                color: 'white', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '12px', 
                fontSize: '0.8rem', 
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                Risk Level: {compatibilityResult.risk}
              </div>
              {compatibilityResult.aiGenerated && (
                <div style={{ 
                  background: '#007bff', 
                  color: 'white', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  marginTop: '0.5rem'
                }}>
                  AI-Powered Analysis
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: MAIN_GREEN, marginBottom: '0.5rem' }}>Analysis</h4>
            <p style={{ lineHeight: '1.6', color: '#333' }}>{compatibilityResult.explanation}</p>
          </div>

          {compatibilityResult.chemicalInteractions && compatibilityResult.chemicalInteractions.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: MAIN_GREEN, marginBottom: '0.5rem' }}>Chemical Interactions</h4>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                {compatibilityResult.chemicalInteractions.map((interaction, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem', color: '#333' }}>{interaction}</li>
                ))}
              </ul>
            </div>
          )}

          {compatibilityResult.warnings && compatibilityResult.warnings.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#dc3545', marginBottom: '0.5rem' }}>⚠️ Warnings</h4>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                {compatibilityResult.warnings.map((warning, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem', color: '#dc3545' }}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: MAIN_GREEN, marginBottom: '0.5rem' }}>Recommendations</h4>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              {compatibilityResult.recommendations.map((rec, index) => (
                <li key={index} style={{ marginBottom: '0.5rem', color: '#333' }}>{rec}</li>
              ))}
            </ul>
          </div>

          {compatibilityResult.alternativeStrategies && compatibilityResult.alternativeStrategies.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: MAIN_GREEN, marginBottom: '0.5rem' }}>Alternative Strategies</h4>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                {compatibilityResult.alternativeStrategies.map((strategy, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem', color: '#333' }}>{strategy}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h5 style={{ color: MAIN_GREEN, marginBottom: '0.5rem' }}>Analyzed Products</h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {compatibilityResult.products.map((product, index) => (
                <span
                  key={index}
                  style={{
                    background: '#e9ecef',
                    color: '#495057',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem'
                  }}
                >
                  {product}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{ 
        background: '#e7f3ff', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        marginTop: '2rem',
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ color: '#0066cc', marginBottom: '1rem' }}>💡 How to Use</h4>
        <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.6', color: '#333' }}>
          <li>Search and select the NTS products you want to mix</li>
          <li>Optionally enable AI-powered analysis for more detailed chemical assessment</li>
          <li>Click "Analyze Compatibility" to get comprehensive chemical analysis</li>
          <li>Review the compatibility assessment, warnings, and recommendations</li>
          <li>Always perform a jar test before large-scale mixing</li>
          <li>Follow label instructions and safety guidelines</li>
        </ol>
      </div>
    </div>
  );
};

export default ProductCompatibilityTool; 