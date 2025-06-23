import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { compatibilityService } from '../services/compatibilityService.js';
import { loadProducts, searchProducts } from '../data/productDatabase';
import imageMappingService from '../services/imageMappingService';

const MAIN_GREEN = '#8cb43a';

const ProductCompatibilityTool = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [imageServiceInitialized, setImageServiceInitialized] = useState(false);

  // Load products from the database
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Initialize image mapping service
        await imageMappingService.initialize();
        setImageServiceInitialized(true);
        
        // Load products
        const loadedProducts = await loadProducts();
        setProducts(loadedProducts);
        setFilteredProducts(loadedProducts);
        setProductsLoading(false);
      } catch (error) {
        console.error('Error initializing data:', error);
        setProductsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = searchProducts(searchTerm);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  // Handle product selection
  const handleProductSelect = (product) => {
    if (selectedProducts.find(p => p.product_name === product.product_name)) {
      setSelectedProducts(selectedProducts.filter(p => p.product_name !== product.product_name));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  // Handle product removal
  const handleProductRemove = (productName) => {
    setSelectedProducts(selectedProducts.filter(p => p.product_name !== productName));
  };

  // Analyze compatibility using AI-powered service
  const handleAnalyzeCompatibility = async () => {
    if (selectedProducts.length < 2) {
      alert('Please select at least 2 products to analyze compatibility.');
      return;
    }
    
    setLoading(true);
    setCompatibilityResult(null);

    try {
      // Use the AI-powered compatibility service
      const result = await compatibilityService.analyzeCompatibility(selectedProducts);
      
      // Convert the result to match the expected format
      const formattedResult = {
        compatible: result.compatible,
        confidence: result.risk === 'low' ? 'high' : result.risk === 'medium' ? 'medium' : 'low',
        issues: result.warnings.map(warning => ({
          type: 'Compatibility Issue',
          products: result.products,
          reason: warning
        })),
        warnings: result.chemicalInteractions.map(interaction => ({
          type: 'Chemical Interaction',
          products: result.products,
          reason: interaction
        })),
        recommendations: result.recommendations.map(rec => ({
          type: 'Recommendation',
          reason: rec,
          benefit: 'positive'
        })),
        explanation: result.explanation,
        aiGenerated: result.aiGenerated
      };
      
      setCompatibilityResult(formattedResult);
    } catch (error) {
      console.error('Error analyzing compatibility:', error);
      setCompatibilityResult({
        compatible: false,
        confidence: 'low',
        issues: [{
          type: 'Analysis Error',
          products: selectedProducts.map(p => p.product_name),
          reason: 'Error occurred during analysis. Please try again.'
        }],
        warnings: [],
        recommendations: [],
        explanation: 'An error occurred during the compatibility analysis.',
        aiGenerated: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedProducts([]);
    setCompatibilityResult(null);
    setShowExplanation(false);
  };

  // Modal close handler
  const closeModal = () => setModalProduct(null);

  // Helper function to get the correct image path for a product
  const getProductImage = (product) => {
    if (!imageServiceInitialized) {
      return product.image || '/assets/default-product.webp';
    }
    return imageMappingService.getImagePath(product.image || product.product_name);
  };

  // Helper to render product details in modal
  const renderProductDetails = (product) => (
    <div style={{ maxWidth: 600, background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #0002', padding: '2rem', position: 'relative', overflowY: 'auto', maxHeight: '90vh' }}>
      <button onClick={closeModal} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 28, color: '#888', cursor: 'pointer', zIndex: 2 }}>&times;</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
        <img src={getProductImage(product)} alt={product.product_name} style={{ width: 90, height: 90, objectFit: 'contain', borderRadius: 12, border: '1px solid #eee', background: '#fafafa' }} />
        <div>
          <h2 style={{ color: MAIN_GREEN, margin: 0 }}>{product.product_name}</h2>
          {product.link && <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ color: MAIN_GREEN, textDecoration: 'underline', fontWeight: 500, fontSize: '1rem' }}>Product Webpage ↗</a>}
        </div>
      </div>
      <div style={{ marginBottom: 18, color: '#444', fontSize: '1.08rem' }}>{product.description}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        <span style={{ background: '#e8f5e8', color: '#2d5a2d', padding: '0.25rem 0.7rem', borderRadius: 6, fontSize: '0.95rem' }}>{product.product_form}</span>
        {product.organic_certified && <span style={{ background: '#fff3cd', color: '#856404', padding: '0.25rem 0.7rem', borderRadius: 6, fontSize: '0.95rem' }}>Organic Certified</span>}
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong style={{ color: '#1565c0' }}>Nutrients:</strong>
        <ul style={{ margin: '0.5rem 0 0 1.2rem', color: '#444' }}>{product.nutrients?.map((n, i) => <li key={i}>{n}</li>)}</ul>
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong style={{ color: '#2e7d32' }}>Application Methods:</strong>
        <ul style={{ margin: '0.5rem 0 0 1.2rem', color: '#444' }}>{product.application?.map((a, i) => <li key={i}>{a}</li>)}</ul>
      </div>
      {product.analysis && <div style={{ marginBottom: 18, background: '#f3f8ff', padding: '0.75rem', borderRadius: 8 }}>
        <strong style={{ color: '#1565c0' }}>Analysis:</strong>
        <ul style={{ margin: '0.5rem 0 0 1.2rem', color: '#444' }}>{Object.entries(product.analysis).map(([k, v], i) => <li key={i}><strong>{k}:</strong> {v}</li>)}</ul>
      </div>}
      {product.application_rates && <div style={{ marginBottom: 18, background: '#f0f8ff', padding: '0.75rem', borderRadius: 8 }}>
        <strong style={{ color: '#2c5aa0' }}>Application Rates:</strong>
        <ul style={{ margin: '0.5rem 0 0 1.2rem', color: '#444' }}>{Object.entries(product.application_rates).map(([k, v], i) => <li key={i}><strong>{k.replace(/_/g, ' ')}:</strong> {v}</li>)}</ul>
      </div>}
      {product.benefits && <div style={{ marginBottom: 18, background: '#edf7ed', padding: '0.75rem', borderRadius: 8 }}>
        <strong style={{ color: '#2e7d32' }}>Benefits:</strong>
        <ul style={{ margin: '0.5rem 0 0 1.2rem', color: '#444' }}>{product.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
      </div>}
      {product.instructions && <div style={{ marginBottom: 18, background: '#fff9e6', padding: '0.75rem', borderRadius: 8 }}>
        <strong style={{ color: '#b78103' }}>Instructions:</strong>
        <div style={{ color: '#444', marginTop: 6 }}>{product.instructions}</div>
      </div>}
      {product.storage_handling && <div style={{ marginBottom: 18, background: '#f8f9fa', padding: '0.75rem', borderRadius: 8 }}>
        <strong style={{ color: '#666' }}>Storage & Handling:</strong>
        <div style={{ color: '#444', marginTop: 6 }}>{product.storage_handling}</div>
      </div>}
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', background: '#f5f6f7', minHeight: '100vh' }}>
      {/* Navigation Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: `2px solid ${MAIN_GREEN}`,
            color: MAIN_GREEN,
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          ← Back to Main Menu
        </button>
        <h1 style={{ color: MAIN_GREEN, fontSize: '2rem', margin: 0 }}>
          🔬 Product Compatibility Tool
        </h1>
        <div style={{ width: '120px' }}></div> {/* Spacer for centering */}
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: 600, margin: '0 auto' }}>
          Select two or more NTS products to analyze their chemical compatibility for tank mixing.
          Our AI analyzes pH, nutrient interactions, and chemical properties to ensure optimal results.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Panel - Product Selection */}
        <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '12px' }}>
          <h2 style={{ color: MAIN_GREEN, marginBottom: '1.5rem' }}>Select Products</h2>
          {/* Search */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Search products by name, description, or nutrients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>Selected Products ({selectedProducts.length})</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedProducts.map((product) => (
                  <div
                    key={product.product_name}
                    style={{
                      background: MAIN_GREEN,
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>{product.product_name}</span>
                    <button
                      onClick={() => handleProductRemove(product.product_name)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        padding: '0',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleClearAll}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginTop: '1rem',
                  fontSize: '0.9rem'
                }}
              >
                Clear All
              </button>
            </div>
          )}
          {/* Product List */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {productsLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                Loading products...
              </div>
            ) : (
              filteredProducts.map((product) => {
                const isSelected = selectedProducts.find(p => p.product_name === product.product_name);
                return (
                  <div
                    key={product.product_name}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '12px',
                      padding: '1.2rem',
                      background: '#fff',
                      boxShadow: isSelected ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001',
                      transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                      outline: isSelected ? `2px solid ${MAIN_GREEN}` : 'none',
                      borderColor: isSelected ? MAIN_GREEN : '#ddd',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <img 
                      src={getProductImage(product)} 
                      alt={product.product_name}
                      style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, border: '1px solid #eee', background: '#fafafa' }}
                      onError={(e) => {
                        e.target.src = '/assets/default-product.webp';
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: MAIN_GREEN, fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>{product.product_name}</div>
                      <div style={{ color: '#666', fontSize: '0.97rem', marginBottom: 4 }}>{product.description?.substring(0, 80)}...</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {product.nutrients?.slice(0, 3).map((nutrient, index) => (
                          <span
                            key={index}
                            style={{
                              background: '#e9ecef',
                              color: '#495057',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.8rem'
                            }}
                          >
                            {nutrient}
                          </span>
                        ))}
                        {product.nutrients?.length > 3 && (
                          <span style={{ color: '#666', fontSize: '0.8rem' }}>
                            +{product.nutrients.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        onClick={() => setModalProduct(product)}
                        style={{
                          background: '#f8f9fa',
                          border: '1px solid #dee2e6',
                          color: '#495057',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e9ecef'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#f8f9fa'}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleProductSelect(product)}
                        style={{
                          background: isSelected ? '#dc3545' : MAIN_GREEN,
                          border: 'none',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = isSelected ? '#c82333' : '#7ba032'}
                        onMouseOut={(e) => e.currentTarget.style.background = isSelected ? '#dc3545' : MAIN_GREEN}
                      >
                        {isSelected ? 'Remove' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* Analyze Button */}
          <button
            onClick={handleAnalyzeCompatibility}
            disabled={selectedProducts.length < 2 || loading}
            style={{
              width: '100%',
              background: selectedProducts.length >= 2 ? MAIN_GREEN : '#ccc',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: selectedProducts.length >= 2 ? 'pointer' : 'not-allowed',
              marginTop: '1.5rem',
              transition: 'background 0.2s'
            }}
          >
            {loading ? '🔬 Analyzing...' : `🔬 Analyze Compatibility (${selectedProducts.length} products)`}
          </button>
        </div>
        {/* Right Panel - Results */}
        <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '12px' }}>
          <h2 style={{ color: MAIN_GREEN, marginBottom: '1.5rem' }}>Compatibility Analysis</h2>
          {!compatibilityResult ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 2rem',
              color: '#666'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔬</div>
              <h3>Ready to Analyze</h3>
              <p>Select 2 or more products from the left panel to begin compatibility analysis.</p>
            </div>
          ) : (
            <div>
              {/* Overall Result */}
              <div style={{
                background: compatibilityResult.compatible ? '#d4edda' : '#f8d7da',
                border: `2px solid ${compatibilityResult.compatible ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {compatibilityResult.compatible ? '✅' : '❌'}
                </div>
                <h3 style={{ 
                  color: compatibilityResult.compatible ? '#155724' : '#721c24',
                  margin: '0 0 0.5rem 0'
                }}>
                  {compatibilityResult.compatible ? 'Compatible' : 'Incompatible'}
                </h3>
                <p style={{ 
                  color: compatibilityResult.compatible ? '#155724' : '#721c24',
                  margin: '0',
                  fontSize: '0.9rem'
                }}>
                  Confidence: {compatibilityResult.confidence.charAt(0).toUpperCase() + compatibilityResult.confidence.slice(1)}
                </p>
                {compatibilityResult.aiGenerated && (
                  <div style={{ 
                    background: '#007bff', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    marginTop: '0.5rem',
                    display: 'inline-block'
                  }}>
                    AI-Powered Analysis
                  </div>
                )}
              </div>
              {/* Issues */}
              {compatibilityResult.issues.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#dc3545', marginBottom: '1rem' }}>❌ Issues Found</h4>
                  {compatibilityResult.issues.map((issue, index) => (
                    <div
                      key={index}
                      style={{
                        background: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        borderRadius: '6px',
                        padding: '1rem',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <strong style={{ color: '#721c24' }}>{issue.type}</strong>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#721c24' }}>
                        {issue.products.join(' + ')}: {issue.reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {/* Warnings */}
              {compatibilityResult.warnings.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#856404', marginBottom: '1rem' }}>⚠️ Warnings</h4>
                  {compatibilityResult.warnings.map((warning, index) => (
                    <div
                      key={index}
                      style={{
                        background: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '6px',
                        padding: '1rem',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <strong style={{ color: '#856404' }}>{warning.type}</strong>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#856404' }}>
                        {warning.products.join(' + ')}: {warning.reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {/* Recommendations */}
              {compatibilityResult.recommendations.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#155724', marginBottom: '1rem' }}>💡 Recommendations</h4>
                  {compatibilityResult.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      style={{
                        background: rec.benefit === 'positive' ? '#d4edda' : '#e2e3e5',
                        border: `1px solid ${rec.benefit === 'positive' ? '#c3e6cb' : '#d6d8db'}`,
                        borderRadius: '6px',
                        padding: '1rem',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <strong style={{ 
                        color: rec.benefit === 'positive' ? '#155724' : '#383d41'
                      }}>
                        {rec.type}
                      </strong>
                      <p style={{ 
                        margin: '0.5rem 0 0 0', 
                        color: rec.benefit === 'positive' ? '#155724' : '#383d41'
                      }}>
                        {rec.reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {/* Detailed Explanation Toggle */}
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                style={{
                  background: 'none',
                  border: `2px solid ${MAIN_GREEN}`,
                  color: MAIN_GREEN,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                {showExplanation ? 'Hide' : 'Show'} Detailed Chemical Analysis
              </button>
              {showExplanation && (
                <div style={{
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  padding: '1.5rem',
                  marginTop: '1rem'
                }}>
                  <h4 style={{ color: '#333', marginBottom: '1rem' }}>🔬 Chemical Analysis Details</h4>
                  <div style={{ 
                    whiteSpace: 'pre-line', 
                    lineHeight: '1.6',
                    color: '#333',
                    fontSize: '0.9rem'
                  }}>
                    {compatibilityResult.explanation}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Modal for product details */}
      {modalProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0007', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {renderProductDetails(modalProduct)}
        </div>
      )}

      {/* Disclaimer at the bottom */}
      <div style={{
        marginTop: '2rem',
        padding: '0.5rem 1rem',
        background: '#fffde7',
        border: '1px solid #ffe58f',
        borderRadius: '6px',
        color: '#a68c2a',
        fontSize: '0.85rem',
        textAlign: 'center',
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: 'none'
      }}>
        <strong>Disclaimer:</strong> This tool is in <b>beta mode</b>. Always perform a <b>jar test</b> before mixing. This tool is for guidance only and does not make the company responsible for any adverse outcomes.
      </div>
    </div>
  );
};

export default ProductCompatibilityTool; 