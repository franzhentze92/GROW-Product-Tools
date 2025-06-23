import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { growthPromoterProducts } from '../data/growthPromoterProducts';
import { growthPromoterBenefits } from '../data/growthPromoterBenefits';
import { growthPromoterTypes } from '../data/growthPromoterTypes';
import imageMappingService from '../services/imageMappingService';

const MAIN_GREEN = '#8cb43a';

function GrowthPromotersTool() {
  const navigate = useNavigate();
  
  // Step state
  const [step, setStep] = useState(0);
  
  // User selections
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [applicationMethod, setApplicationMethod] = useState('');
  const [productForm, setProductForm] = useState('');
  const [organicPreference, setOrganicPreference] = useState('');
  const [imageServiceInitialized, setImageServiceInitialized] = useState(false);

  useEffect(() => {
    const initializeImageService = async () => {
      await imageMappingService.initialize();
      setImageServiceInitialized(true);
    };
    initializeImageService();
  }, []);

  // Helper function to get the correct image path for a product
  const getProductImage = (product) => {
    if (!imageServiceInitialized) {
      return product.image || '/assets/default-product.webp';
    }
    return imageMappingService.getImagePath(product.image || product.product_name);
  };

  // Debug: log current step and state
  console.log('Current step:', step, 'selectedBenefits:', selectedBenefits, 'applicationMethod:', applicationMethod, 'productForm:', productForm, 'organicPreference:', organicPreference);

  // Step 1: Select benefits
  const handleBenefitChange = (benefit) => {
    setSelectedBenefits((prev) =>
      prev.includes(benefit)
        ? prev.filter((b) => b !== benefit)
        : [...prev, benefit]
    );
    console.log('Selected benefits:', selectedBenefits);
  };

  // Step 2: Application method
  const handleAppMethodChange = (e) => setApplicationMethod(e.target.value);

  // Step 3: Product form
  const handleProductFormChange = (e) => setProductForm(e.target.value);

  // Step 4: Organic preference
  const handleOrganicPreferenceChange = (e) => setOrganicPreference(e.target.value);

  // Recommendation logic
  const getRecommendations = () => {
    let filtered = growthPromoterProducts;

    // Filter by application method
    if (applicationMethod) {
      filtered = filtered.filter(product => product.application.includes(applicationMethod));
    }
    // Filter by product form
    if (productForm && productForm !== 'Either') {
      filtered = filtered.filter(product => product.product_form.toLowerCase() === productForm.toLowerCase());
    }
    // Filter by organic preference
    if (organicPreference === 'organic') {
      filtered = filtered.filter(product => product.organic_certified);
    } else if (organicPreference === 'non-organic') {
      filtered = filtered.filter(product => !product.organic_certified);
    }
    // Filter by selected benefits
    if (selectedBenefits.length > 0) {
      filtered = filtered.filter(product => product.benefits.some(b => selectedBenefits.includes(b)));
    }
    return filtered;
  };

  // Helper to determine the correct previous step
  function getPrevStep(currentStep) {
    if (currentStep === 8) {
      return 7;
    }
    return currentStep - 1;
  }

  // Step navigation handlers
  const handleStart = () => setStep(1);
  const handleNextFromStep2 = () => setStep(2);
  const handleNextFromStep3 = () => setStep(3);
  const handleNextFromStep4 = () => setStep(4);
  const prevStep = () => setStep(s => getPrevStep(s));

  // Validation
  const canContinueStep2 = selectedBenefits.length > 0;
  const canContinueStep3 = applicationMethod !== '';
  const canContinueStep4 = productForm !== '';
  const canContinueStep5 = organicPreference !== '';

  // UI
  return (
    <div>
      <div className="card">
        {step === 0 && (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <h1 style={{ color: MAIN_GREEN, fontSize: '2.2rem', marginBottom: 16 }}>Welcome to the Growth Promoters Recommendation Tool</h1>
            <p style={{ fontSize: '1.15rem', color: '#444', maxWidth: 520, margin: '0 auto 1.5rem auto' }}>
              This tool helps you find the best Nutri-Tech Solutions biostimulant and growth promoter products for your crop needs. Answer a few quick questions and get tailored recommendations with science-backed explanations.
            </p>
            <ul style={{ textAlign: 'left', display: 'inline-block', margin: '0 auto 2rem auto', color: '#666', fontSize: '1.05rem', lineHeight: 1.7 }}>
              <li>Step 1: Select the growth enhancement you want to achieve</li>
              <li>Step 2: Choose your application method</li>
              <li>Step 3: Choose your product form</li>
              <li>Step 4: Choose your organic preference</li>
              <li>Step 5: Get your recommendations!</li>
            </ul>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={() => navigate('/')} style={{ minWidth: 120 }}>Main Menu</button>
              <button className="btn-main" style={{ fontSize: '1.15rem', padding: '0.7em 2.2em', minWidth: 120 }} onClick={() => setStep(1)}>Start</button>
            </div>
          </div>
        )}
        
        {step === 1 && (
          <>
            <div className="step-title">1. What growth enhancement do you want to achieve?</div>
            <div className="step-desc">Select one or more enhancements you want to target.</div>
            <div>
              {growthPromoterBenefits.map((b) => {
                const checked = selectedBenefits.includes(b.name);
                return (
                  <label
                    key={b.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      border: checked ? '2px solid #8cb43a' : '1px solid #e0e0e0',
                      borderRadius: 12,
                      padding: '1.2rem 1.5rem',
                      background: checked ? '#f7faef' : '#fff',
                      marginBottom: 18,
                      boxShadow: checked ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                      fontWeight: 500,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleBenefitChange(b.name)}
                      style={{ width: 22, height: 22, accentColor: '#8cb43a', marginRight: 12 }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#222', marginBottom: 4 }}>{b.name}</div>
                      <div style={{ fontSize: '1.01rem', color: '#666', fontWeight: 400, marginTop: 2 }}>{b.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={() => setStep(0)} style={{ minWidth: 120 }}>Back</button>
              <button className="btn-secondary" onClick={() => navigate('/')} style={{ minWidth: 120 }}>Main Menu</button>
              <button className="btn-main" disabled={!canContinueStep2} onClick={() => setStep(step + 1)}>Next</button>
            </div>
          </>
        )}
        
        {step === 2 && (
          <>
            <div className="step-title">2. How do you want to apply the growth promoters?</div>
            <div className="step-desc">Select your preferred application method.</div>
            <div>
              {[
                'Soil application',
                'Foliar spray',
                'Seed treatment',
                'Compost enhancement',
                'Hydroponic system'
              ].map((method) => {
                const checked = applicationMethod === method;
                return (
                  <label
                    key={method}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      border: checked ? '2px solid #8cb43a' : '1px solid #e0e0e0',
                      borderRadius: 12,
                      padding: '1.2rem 1.5rem',
                      background: checked ? '#f7faef' : '#fff',
                      marginBottom: 18,
                      boxShadow: checked ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                      fontWeight: 500,
                    }}
                  >
                    <input
                      type="radio"
                      name="applicationMethod"
                      value={method}
                      checked={checked}
                      onChange={handleAppMethodChange}
                      style={{ width: 22, height: 22, accentColor: '#8cb43a', marginRight: 12 }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '1.13rem', color: '#222' }}>{method}</span>
                  </label>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={prevStep}>Back</button>
              <button className="btn-secondary" onClick={() => navigate('/')} style={{ minWidth: 120 }}>Main Menu</button>
              <button className="btn-main" disabled={!canContinueStep3} onClick={() => setStep(step + 1)}>Next</button>
            </div>
          </>
        )}
        
        {step === 3 && (
          <>
            <div className="step-title">3. What product form do you prefer?</div>
            <div className="step-desc">Choose your preferred product form for easier handling and application.</div>
            <div>
              {[
                { value: 'Liquid', label: 'Liquid', desc: 'Easy to mix, quick absorption, suitable for foliar and soil application' },
                { value: 'Powder', label: 'Powder', desc: 'Long shelf life, concentrated, suitable for seed treatment and soil application' },
                { value: 'Either', label: 'Either (Show all options)', desc: 'Show me products in both liquid and powder forms' }
              ].map(opt => {
                const checked = productForm === opt.value;
                return (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      border: checked ? '2px solid #8cb43a' : '1px solid #e0e0e0',
                      borderRadius: 12,
                      padding: '1.2rem 1.5rem',
                      background: checked ? '#f7faef' : '#fff',
                      marginBottom: 18,
                      boxShadow: checked ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                      fontWeight: 500,
                    }}
                  >
                    <input
                      type="radio"
                      name="productForm"
                      value={opt.value}
                      checked={checked}
                      onChange={handleProductFormChange}
                      style={{ width: 22, height: 22, accentColor: '#8cb43a', marginRight: 12 }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#222', marginBottom: 4 }}>{opt.label}</div>
                      <div style={{ fontSize: '1.01rem', color: '#666', fontWeight: 400, marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={prevStep}>Back</button>
              <button className="btn-secondary" onClick={() => navigate('/')} style={{ minWidth: 120 }}>Main Menu</button>
              <button className="btn-main" disabled={!canContinueStep4} onClick={() => setStep(step + 1)}>Next</button>
            </div>
          </>
        )}
        
        {step === 4 && (
          <>
            <div className="step-title">4. Do you prefer organic or non-organic products?</div>
            <div className="step-desc">Choose your preference for organic certification.</div>
            <div>
              {[
                { value: 'organic', label: 'Organic', desc: 'Show only organic certified products' },
                { value: 'non-organic', label: 'Non-organic', desc: 'Show only non-organic products' },
                { value: 'either', label: 'Either (Show all options)', desc: 'Show me both organic and non-organic products' }
              ].map(opt => {
                const checked = organicPreference === opt.value;
                return (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      border: checked ? '2px solid #8cb43a' : '1px solid #e0e0e0',
                      borderRadius: 12,
                      padding: '1.2rem 1.5rem',
                      background: checked ? '#f7faef' : '#fff',
                      marginBottom: 18,
                      boxShadow: checked ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                      fontWeight: 500,
                    }}
                  >
                    <input
                      type="radio"
                      name="organicPreference"
                      value={opt.value}
                      checked={checked}
                      onChange={handleOrganicPreferenceChange}
                      style={{ width: 22, height: 22, accentColor: '#8cb43a', marginRight: 12 }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#222', marginBottom: 4 }}>{opt.label}</div>
                      <div style={{ fontSize: '1.01rem', color: '#666', fontWeight: 400, marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={prevStep}>Back</button>
              <button className="btn-secondary" onClick={() => navigate('/')} style={{ minWidth: 120 }}>Main Menu</button>
              <button className="btn-main" disabled={!canContinueStep5} onClick={() => setStep(step + 1)}>Next</button>
            </div>
          </>
        )}
        
        {step === 5 && (
          <GrowthPromoterRecommendations
            selectedBenefits={selectedBenefits}
            applicationMethod={applicationMethod}
            productForm={productForm}
            organicPreference={organicPreference}
            products={getRecommendations()}
            allPromoters={growthPromoterTypes}
            allBenefits={growthPromoterBenefits}
            onBack={prevStep}
          />
        )}
        {step > 7 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'crimson' }}>
            <h2>Something went wrong. Please go back and try again.</h2>
            <button className="btn-secondary" onClick={() => setStep(1)} style={{ marginTop: 24 }}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
}

function GrowthPromoterRecommendations({ selectedBenefits, applicationMethod, productForm, organicPreference, products, allPromoters, allBenefits, onBack }) {
  const getPromoterTypes = (product) => {
    return product.promoters.map(promoter => {
      const promoterObj = allPromoters.find(p => p.name === promoter);
      return promoterObj ? `${promoter} (${promoterObj.type})` : promoter;
    }).join(', ');
  };

  const getBenefitDisplay = () => {
    return selectedBenefits.join(', ');
  };

  const getApplicationDisplay = () => {
    return applicationMethod || 'Any application method';
  };

  return (
    <div>
      <div className="step-title">Recommended Products</div>
      <div className="step-desc">
        Based on your selections: <strong>{getBenefitDisplay()}</strong>
        {applicationMethod && <> via <strong>{getApplicationDisplay()}</strong></>}
      </div>
      {products.length === 0 && <div style={{ color: 'crimson', margin: '1.5rem 0' }}>No products found for your selection.</div>}
      {products.map((product) => {
        return (
          <div key={product.product_name} style={{ border: '1px solid #e0e0e0', borderRadius: 8, margin: '1.2rem 0', padding: '1rem', background: '#fafcf7' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: MAIN_GREEN }}>{product.product_name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '0.5rem 0' }}>
              <img src={getProductImage(product)} alt={product.product_name} style={{ maxWidth: 120, maxHeight: 120, margin: '0.5rem 0', borderRadius: 6, background: '#fff', objectFit: 'contain' }} />
              <div>
                <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ color: MAIN_GREEN, fontWeight: 600, textDecoration: 'underline', marginRight: 12 }}>Product Page</a>
              </div>
            </div>
            <div style={{ margin: '0.5rem 0' }}>
              <strong>Growth Promoters:</strong> {getPromoterTypes(product)}
            </div>
            <div style={{ margin: '0.5rem 0' }}>
              <strong>Application Methods:</strong> {product.application.join(', ')}
            </div>
            <div style={{ margin: '0.5rem 0' }}>
              <strong>Key Benefits:</strong>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {product.benefits.map((benefit, idx) => (
                  <li key={idx} style={{ color: '#333', fontWeight: 400 }}>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ margin: '0.5rem 0', color: '#555', fontSize: '0.97em' }}>
              <strong>Why recommended?</strong> This product matches your needs for: {getBenefitDisplay()}.
              {applicationMethod && product.application.includes(applicationMethod) && (
                <div style={{ marginTop: 4 }}>It can be applied via {applicationMethod.toLowerCase()} as requested.</div>
              )}
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
        <button className="btn-secondary" onClick={onBack} style={{ minWidth: 120 }}>
          Back
        </button>
        <button className="btn-secondary" onClick={() => window.location.href = '/'} style={{ minWidth: 120 }}>
          Main Menu
        </button>
      </div>
    </div>
  );
}

export default GrowthPromotersTool; 