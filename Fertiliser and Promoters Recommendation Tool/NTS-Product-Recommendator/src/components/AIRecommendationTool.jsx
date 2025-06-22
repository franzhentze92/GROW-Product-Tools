import React, { useState, useEffect } from 'react';
import { getAIRecommendations, getFallbackRecommendations } from '../services/aiRecommendationService.js';
import { applicationMethods, matchApplicationMethod } from '../data/applicationMethods.js';

const AIRecommendationTool = ({ onRecommendationsReceived }) => {
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: nutrient search, 2: app method, 3: form, 4: organic

  // State for search results and filters
  const [baseProducts, setBaseProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [aiExplanation, setAiExplanation] = useState('');
  const [suggestedNutrients, setSuggestedNutrients] = useState([]);

  // Filter states
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedProductForm, setSelectedProductForm] = useState(null);
  const [isOrganicOnly, setIsOrganicOnly] = useState(false);

  // Effect to apply filters whenever products or filter criteria change
  useEffect(() => {
    let products = [...baseProducts];

    if (selectedApplication && selectedApplication !== 'Show All') {
      products = products.filter(p => matchApplicationMethod(selectedApplication, p.application));
    }
    if (selectedProductForm && selectedProductForm !== 'All Forms') {
      products = products.filter(p => p.product_form === selectedProductForm);
    }
    if (isOrganicOnly) {
      products = products.filter(p => p.organic_certified);
    }

    setFilteredProducts(products);

    // Pass the final filtered list to the parent component
    if (onRecommendationsReceived) {
      onRecommendationsReceived(products, aiExplanation, suggestedNutrients);
    }
  }, [baseProducts, selectedApplication, selectedProductForm, isOrganicOnly, onRecommendationsReceived, aiExplanation, suggestedNutrients]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    resetSearch();
    setIsLoading(true);

    try {
      let result = await getAIRecommendations(userQuery);
      if (!result.success && !result.isFallback) {
        result = getFallbackRecommendations(userQuery);
      }

      setBaseProducts(result.products || []);
      setFilteredProducts(result.products || []);
      setAiExplanation(result.explanation || '');
      setSuggestedNutrients(result.suggestedNutrients || []);

      if (result.products && result.products.length > 0) {
        setStep(2);
      }
    } catch (err) {
      setError('Unable to process your request. Please try again.');
      console.error('AI recommendation error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApplicationMethodSelect = (method) => {
    setSelectedApplication(method);
    setStep(3); // Move to next step
  };
  
  const handleProductFormSelect = (form) => {
    setSelectedProductForm(form);
    setStep(4); // Move to next step
  };

  const handleOrganicSelect = (isChecked) => {
    setIsOrganicOnly(isChecked);
  };
  
  const resetSearch = () => {
    setUserQuery('');
    setError('');
    setStep(1);
    setBaseProducts([]);
    setFilteredProducts([]);
    setAiExplanation('');
    setSuggestedNutrients([]);
    setSelectedApplication(null);
    setSelectedProductForm(null);
    setIsOrganicOnly(false);
    if (onRecommendationsReceived) {
      onRecommendationsReceived([], '', []);
    }
  };
  
  const getUniqueProductForms = () => {
    const forms = new Set(baseProducts.map(p => p.product_form));
    return Array.from(forms);
  };

  // Helper function to check if a step is completed
  const isStepCompleted = (stepNumber) => {
    switch (stepNumber) {
      case 2: return selectedApplication !== null;
      case 3: return selectedProductForm !== null;
      case 4: return true; // Organic is optional
      default: return false;
    }
  };

  // Helper function to get step status
  const getStepStatus = (stepNumber) => {
    if (step > stepNumber) return 'completed';
    if (step === stepNumber) return 'current';
    return 'pending';
  };

  return (
    <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', padding: '1.5rem', marginBottom: '1.5rem' }}>
       {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ width: '32px', height: '32px', background: '#8cb43a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem' }}>
          <svg style={{ width: '20px', height: '20px', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#333' }}>NTS Product Finder</h3>
      </div>

      {/* Step 1: Nutrient Search */}
      {step === 1 && (
        <>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Tell us what nutrients or soil-life components you're looking for in an NTS product.
          </p>
          <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="e.g., Calcium and Boron, or Fulvic acid for soil health"
                style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !userQuery.trim()}
                className="btn-main"
                style={{ padding: '0.5rem 1.5rem', cursor: (isLoading || !userQuery.trim()) ? 'not-allowed' : 'pointer' }}
              >
                {isLoading ? 'Searching...' : 'Find Products'}
              </button>
            </div>
          </form>
        </>
      )}

      {/* Filtering Steps */}
      {step > 1 && (
        <div style={{ marginBottom: '1rem' }}>
          {/* Summary */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ background: '#8cb43a', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', marginRight: '0.5rem' }}>
              1
            </div>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              Found {baseProducts.length} products for "{userQuery}"
            </span>
          </div>

          {/* Step 2: Application Method */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              background: getStepStatus(2) === 'completed' ? '#8cb43a' : getStepStatus(2) === 'current' ? '#ffa500' : '#ccc', 
              color: '#fff', 
              borderRadius: '50%', 
              width: '24px', 
              height: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.8rem', 
              marginRight: '0.5rem' 
            }}>
              2
            </div>
            <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '600' }}>
              {getStepStatus(2) === 'completed' ? `Selected: ${selectedApplication}` : 'How do you want to apply these products?'}
            </span>
          </div>

          {step >= 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem', paddingLeft: '30px' }}>
              {applicationMethods.map((method) => (
                <button 
                  key={method.name} 
                  onClick={() => handleApplicationMethodSelect(method.name)} 
                  disabled={isLoading} 
                  style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px', 
                    background: selectedApplication === method.name ? '#eef6e2' : '#fff', 
                    cursor: 'pointer', 
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: '600' }}>{method.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{method.description}</div>
                </button>
              ))}
              <button 
                onClick={() => handleApplicationMethodSelect('Show All')} 
                disabled={isLoading} 
                style={{ 
                  padding: '0.75rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px', 
                  background: selectedApplication === 'Show All' ? '#eef6e2' : '#fff', 
                  cursor: 'pointer', 
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: '600' }}>Show All</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Display all application types</div>
              </button>
            </div>
          )}

          {/* Step 3: Product Form */}
          {step >= 3 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  background: getStepStatus(3) === 'completed' ? '#8cb43a' : getStepStatus(3) === 'current' ? '#ffa500' : '#ccc', 
                  color: '#fff', 
                  borderRadius: '50%', 
                  width: '24px', 
                  height: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.8rem', 
                  marginRight: '0.5rem' 
                }}>
                  3
                </div>
                <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '600' }}>
                  {getStepStatus(3) === 'completed' ? `Selected: ${selectedProductForm}` : 'What is the product form?'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', paddingLeft: '30px' }}>
                {getUniqueProductForms().map(form => (
                  <button 
                    key={form} 
                    onClick={() => handleProductFormSelect(form)} 
                    disabled={isLoading} 
                    style={{ 
                      padding: '0.5rem 1rem', 
                      border: '1px solid #ddd', 
                      borderRadius: '6px', 
                      background: selectedProductForm === form ? '#eef6e2' : '#fff', 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {form}
                  </button>
                ))}
                <button 
                  onClick={() => handleProductFormSelect('All Forms')} 
                  disabled={isLoading} 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px', 
                    background: selectedProductForm === 'All Forms' ? '#eef6e2' : '#fff', 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  All Forms
                </button>
              </div>
            </>
          )}

          {/* Step 4: Organic Certification */}
          {step >= 4 && (
            <>
               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  background: '#8cb43a', 
                  color: '#fff', 
                  borderRadius: '50%', 
                  width: '24px', 
                  height: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.8rem', 
                  marginRight: '0.5rem' 
                }}>
                  4
                </div>
                <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '600' }}>
                  Any other preferences?
                </span>
              </div>
              <div style={{ paddingLeft: '30px', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={isOrganicOnly} 
                    onChange={(e) => handleOrganicSelect(e.target.checked)} 
                    style={{ marginRight: '0.5rem', height: '18px', width: '18px' }}
                  />
                  Show Certified Organic products only
                </label>
              </div>
            </>
          )}

          <button onClick={resetSearch} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '0.9rem' }}>
            ← Start New Search
          </button>
        </div>
      )}

      {error && (
        <div style={{ padding: '0.75rem', background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* Results Section */}
      {step > 1 && (
        <div style={{ background: '#f9f9f9', borderRadius: '4px', padding: '1rem', marginTop: '1rem' }}>
          <h4 style={{ fontWeight: '600', color: '#333', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            {filteredProducts.length} Matching Products
          </h4>
          
          {isLoading ? (
            <p>Loading...</p>
          ) : filteredProducts.length > 0 ? (
            <>
              {suggestedNutrients.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>Nutrients Found:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {suggestedNutrients.map(nutrient => (
                      <span key={nutrient} style={{ background: '#eef6e2', color: '#5a7c2a', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                        {nutrient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* The parent component will now render the filtered product list */}
            </>
          ) : (
            <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', padding: '1rem' }}>
              <p style={{ color: '#856404', fontSize: '0.9rem', margin: 0 }}>
                <strong>No products match your selected filters.</strong> Try changing your filter criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecommendationTool; 