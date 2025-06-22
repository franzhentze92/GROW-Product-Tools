import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import EnhancedMicrobeTool from './components/EnhancedMicrobeTool';
import GrowthPromotersTool from './components/GrowthPromotersTool';
import { fertilizerProducts } from './data/fertilizerProducts';
import { nutrients, nutrientCombinations } from './data/nutrients';
import { applicationMethods } from './data/applicationMethods';
import { growthPromoters, productGrowthPromoterRecommendations } from './data/growthPromoters';

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
        <div style={{
          padding: '2rem',
          borderRadius: 16,
          border: '2px solid #e0e0e0',
          background: '#f7faef',
          color: MAIN_GREEN,
          fontWeight: 700,
          fontSize: '1.25rem',
          cursor: 'not-allowed',
          boxShadow: '0 2px 12px #8cb43a11',
          transition: 'box-shadow 0.2s, border 0.2s',
          opacity: 0.6,
        }}>
          🌱 Growth Promoters
          <br />
          <span style={{ fontWeight: 400, color: '#444', fontSize: '1.05rem' }}>
            Get recommendations for biostimulants and enhancers
          </span>
          <br />
          <span style={{ fontWeight: 700, color: '#8cb43a', fontSize: '1rem', marginTop: '0.5rem', display: 'inline-block' }}>
            (Coming Soon)
          </span>
        </div>
        <div style={{
          padding: '2rem',
          borderRadius: 16,
          border: '2px solid #e0e0e0',
          background: '#f7faef',
          color: MAIN_GREEN,
          fontWeight: 700,
          fontSize: '1.25rem',
          cursor: 'not-allowed',
          boxShadow: '0 2px 12px #8cb43a11',
          transition: 'box-shadow 0.2s, border 0.2s',
          opacity: 0.6,
        }}>
          🌾 Fertilisers
          <br />
          <span style={{ fontWeight: 400, color: '#444', fontSize: '1.05rem' }}>
            Find the best NTS fertiliser products for your needs
          </span>
          <br />
          <span style={{ fontWeight: 700, color: '#8cb43a', fontSize: '1rem', marginTop: '0.5rem', display: 'inline-block' }}>
            (Coming Soon)
          </span>
        </div>
      </div>
    </div>
  );
}

function FertiliserTool() {
  // Step state
  const [step, setStep] = useState(1);
  
  // User selections
  const [selectedNutrients, setSelectedNutrients] = useState([]);
  const [selectedCombination, setSelectedCombination] = useState('');
  const [productForm, setProductForm] = useState('');
  const [applicationMethod, setApplicationMethod] = useState('');
  const [organicPreference, setOrganicPreference] = useState('');

  // Track nutrient type
  const [nutrientType, setNutrientType] = useState('');

  // Debug: log current step and state
  console.log('Current step:', step, 'selectedNutrients:', selectedNutrients, 'selectedCombination:', selectedCombination, 'productForm:', productForm, 'applicationMethod:', applicationMethod, 'organicPreference:', organicPreference);

  // Step 1: Select nutrient type (single or combination)
  const handleNutrientTypeChange = (type) => {
    setNutrientType(type);
    setSelectedCombination('');
    setSelectedNutrients([]);
  };

  // Step 2: Select specific nutrients or combination
  const handleNutrientChange = (nutrient) => {
    if (nutrientType === 'single') {
      setSelectedNutrients([nutrient]);
    } else {
      setSelectedNutrients((prev) =>
        prev.includes(nutrient)
          ? prev.filter((n) => n !== nutrient)
          : [...prev, nutrient]
      );
    }
  };

  const handleCombinationChange = (combination) => {
    setSelectedCombination(combination);
  };

  // Step 3: Product form preference
  const handleProductFormChange = (e) => setProductForm(e.target.value);

  // Step 4: Application method
  const handleAppMethodChange = (e) => setApplicationMethod(e.target.value);

  // Step 5: Organic preference
  const handleOrganicChange = (e) => setOrganicPreference(e.target.value);

  // Recommendation logic
  const getRecommendations = () => {
    let filteredProducts = fertilizerProducts;

    // Filter by nutrients
    if (selectedCombination) {
      const combination = nutrientCombinations.find(c => c.name === selectedCombination);
      if (combination) {
        filteredProducts = filteredProducts.filter(product => 
          combination.nutrients.every(nutrient => product.nutrients.includes(nutrient))
        );
      }
    } else if (selectedNutrients.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        selectedNutrients.some(nutrient => product.nutrients.includes(nutrient))
      );
    }

    // Filter by product form
    if (productForm && productForm !== 'Either') {
      filteredProducts = filteredProducts.filter(product => 
        product.product_form.toLowerCase() === productForm.toLowerCase()
      );
    }

    // Filter by application method
    if (applicationMethod) {
      const appMethodMap = {
        'Soil Application': 'Soil',
        'Foliar Spray': 'Foliar',
        'Drench': 'Drench',
        'Seed Treatment': 'Seed treatment',
        'Compost': 'Compost',
        'Hydroponic': 'Hydroponic'
      };
      const mappedAppMethod = appMethodMap[applicationMethod];
      if (mappedAppMethod) {
        filteredProducts = filteredProducts.filter(product => 
          product.application.includes(mappedAppMethod)
        );
      }
    }

    // Filter by organic preference
    if (organicPreference === 'organic') {
      filteredProducts = filteredProducts.filter(product => product.organic_certified);
    } else if (organicPreference === 'non-organic') {
      filteredProducts = filteredProducts.filter(product => !product.organic_certified);
    }

    return filteredProducts;
  };

  // Step navigation handlers
  const handleStart = () => setStep(2);
  const handleNextFromStep2 = () => setStep(3);
  const handleNextFromStep3 = () => setStep(4);
  const handleNextFromStep4 = () => setStep(5);
  const handleNextFromStep5 = () => setStep(6);
  const prevStep = () => setStep((s) => s - 1);

  // Validation
  const canContinueStep2 = selectedCombination || selectedNutrients.length > 0;
  const canContinueStep3 = productForm !== '';
  const canContinueStep4 = applicationMethod !== '';
  const canContinueStep5 = organicPreference !== '';

  const navigate = useNavigate();

  // UI
  return (
    <div>
      <div className="card">
        {step === 1 && (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <h1 style={{ color: MAIN_GREEN, fontSize: '2.2rem', marginBottom: 16 }}>Welcome to the NTS Fertiliser Recommendation Tool</h1>
            <p style={{ fontSize: '1.15rem', color: '#444', maxWidth: 520, margin: '0 auto 1.5rem auto' }}>
              This tool helps you find the best Nutri-Tech Solutions fertiliser products for your specific nutrient needs. Answer a few quick questions and get tailored recommendations.
            </p>
            <ul style={{ textAlign: 'left', display: 'inline-block', margin: '0 auto 2rem auto', color: '#666', fontSize: '1.05rem', lineHeight: 1.7 }}>
              <li>Step 1: Choose your nutrient requirements</li>
              <li>Step 2: Select your preferred product form</li>
              <li>Step 3: Choose your application method</li>
              <li>Step 4: Choose organic or non-organic preference</li>
              <li>Step 5: Get your recommendations!</li>
            </ul>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={() => navigate('/')} style={{ minWidth: 120 }}>
                Main Menu
              </button>
              <button className="btn-main" style={{ fontSize: '1.15rem', padding: '0.7em 2.2em', minWidth: 120 }} onClick={handleStart}>Start</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="step-title">1. What nutrients do you need?</div>
            <div className="step-desc">Choose whether you want a single nutrient or a combination.</div>
            <div style={{ display: 'flex', gap: '2rem', margin: '1.5rem 0 2rem 0', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                <input
                  type="radio"
                  name="nutrientType"
                  value="single"
                  checked={nutrientType === 'single'}
                  onChange={() => handleNutrientTypeChange('single')}
                  style={{ width: 18, height: 18, accentColor: MAIN_GREEN }}
                />
                Single Nutrient
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                <input
                  type="radio"
                  name="nutrientType"
                  value="combination"
                  checked={nutrientType === 'combination'}
                  onChange={() => handleNutrientTypeChange('combination')}
                  style={{ width: 18, height: 18, accentColor: MAIN_GREEN }}
                />
                Nutrient Combination
              </label>
            </div>

            {nutrientType === 'single' && (
              <div>
                <h3 style={{ color: MAIN_GREEN, marginBottom: 16, fontWeight: 700, fontSize: '1.15rem', letterSpacing: 0.5 }}>Select Individual Nutrients:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.2rem' }}>
                  {nutrients.map((nutrient) => (
                    <label
                      key={nutrient.symbol}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.7rem',
                        padding: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 1px 6px #0001',
                        background: '#fcfcfc',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border 0.2s',
                        position: 'relative',
                      }}
                      onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 12px #8cb43a22'}
                      onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 6px #0001'}
                    >
                      <input
                        type="checkbox"
                        checked={selectedNutrients.includes(nutrient.symbol)}
                        onChange={() => handleNutrientChange(nutrient.symbol)}
                        style={{ marginTop: 2, width: 18, height: 18 }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.08rem', color: '#222', marginBottom: 2 }}>{nutrient.name}</div>
                        <div style={{ fontSize: '0.98rem', color: '#666', lineHeight: 1.4 }}>{nutrient.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {nutrientType === 'combination' && (
              <>
                <h3 style={{ color: MAIN_GREEN, marginBottom: 16, fontWeight: 700, fontSize: '1.15rem', letterSpacing: 0.5 }}>Select Individual Nutrients:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.2rem', marginBottom: 24 }}>
                  {nutrients.map((nutrient) => (
                    <label
                      key={nutrient.symbol}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.7rem',
                        padding: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 1px 6px #0001',
                        background: '#fcfcfc',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border 0.2s',
                        position: 'relative',
                      }}
                      onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 12px #8cb43a22'}
                      onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 6px #0001'}
                    >
                      <input
                        type="checkbox"
                        checked={selectedNutrients.includes(nutrient.symbol)}
                        onChange={() => handleNutrientChange(nutrient.symbol)}
                        style={{ marginTop: 2, width: 18, height: 18 }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.08rem', color: '#222', marginBottom: 2 }}>{nutrient.name}</div>
                        <div style={{ fontSize: '0.98rem', color: '#666', lineHeight: 1.4 }}>{nutrient.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={() => setStep(1)} style={{ minWidth: 120 }}>
                Back
              </button>
              <button className="btn-secondary" onClick={() => window.location.href = '/'} style={{ minWidth: 120 }}>
                Main Menu
              </button>
              <button
                className="btn-main"
                onClick={handleNextFromStep2}
                disabled={!canContinueStep2}
                style={{ minWidth: 120 }}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="step-title">2. What product form do you prefer?</div>
            <div className="step-desc">Choose your preferred product form for easier handling and application.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '2rem 0 2.5rem 0' }}>
              {[
                {
                  value: 'Liquid',
                  label: 'Liquid',
                  desc: 'Easy to mix, quick absorption, suitable for foliar and soil application',
                },
                {
                  value: 'Powder',
                  label: 'Powder',
                  desc: 'Long shelf life, concentrated, suitable for seed treatment and soil application',
                },
                {
                  value: 'Either',
                  label: 'Either (Show all options)',
                  desc: 'Show me products in both liquid and powder forms',
                },
              ].map(opt => (
                <label
                  key={opt.value}
                  htmlFor={`productForm-${opt.value}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    border: productForm === opt.value ? `2px solid ${MAIN_GREEN}` : '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '1.2rem 2rem',
                    background: productForm === opt.value ? '#f7faef' : '#fff',
                    boxShadow: productForm === opt.value ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                    fontWeight: 500,
                  }}
                  onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 12px #8cb43a22'}
                  onMouseOut={e => e.currentTarget.style.boxShadow = productForm === opt.value ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001'}
                >
                  <input
                    id={`productForm-${opt.value}`}
                    type="radio"
                    name="productForm"
                    value={opt.value}
                    checked={productForm === opt.value}
                    onChange={handleProductFormChange}
                    style={{ width: 22, height: 22, accentColor: MAIN_GREEN, marginRight: 8 }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.13rem', color: '#222', marginBottom: 2 }}>{opt.label}</span>
                    <span style={{ fontSize: '1.01rem', color: '#666', fontWeight: 400 }}>{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={prevStep} style={{ minWidth: 120 }}>
                Back
              </button>
              <button className="btn-secondary" onClick={() => navigate('/')} style={{ minWidth: 120 }}>
                Main Menu
              </button>
              <button
                className="btn-main"
                onClick={handleNextFromStep3}
                disabled={!canContinueStep3}
                style={{ minWidth: 120 }}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="step-title">3. How do you plan to apply the product?</div>
            <div className="step-desc">Choose the main method you will use to apply the product.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '2rem 0 2.5rem 0' }}>
              {applicationMethods.map(method => (
                <label
                  key={method.name}
                  htmlFor={`appMethod-${method.name}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    border: applicationMethod === method.name ? `2px solid ${MAIN_GREEN}` : '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '1.2rem 2rem',
                    background: applicationMethod === method.name ? '#f7faef' : '#fff',
                    boxShadow: applicationMethod === method.name ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                    fontWeight: 500,
                  }}
                  onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 12px #8cb43a22'}
                  onMouseOut={e => e.currentTarget.style.boxShadow = applicationMethod === method.name ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001'}
                >
                  <input
                    id={`appMethod-${method.name}`}
                    type="radio"
                    name="applicationMethod"
                    value={method.name}
                    checked={applicationMethod === method.name}
                    onChange={handleAppMethodChange}
                    style={{ width: 22, height: 22, accentColor: MAIN_GREEN, marginRight: 8 }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.13rem', color: '#222', marginBottom: 2 }}>{method.name}</span>
                    <span style={{ fontSize: '1.01rem', color: '#666', fontWeight: 400 }}>{method.description}</span>
                  </div>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={prevStep} style={{ minWidth: 120 }}>
                Back
              </button>
              <button className="btn-secondary" onClick={() => navigate('/')} style={{ minWidth: 120 }}>
                Main Menu
              </button>
              <button
                className="btn-main"
                onClick={handleNextFromStep4}
                disabled={!canContinueStep4}
                style={{ minWidth: 120 }}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="step-title">4. Do you prefer organic or non-organic products?</div>
            <div className="step-desc">Choose your preference for organic certification.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '2rem 0 2.5rem 0' }}>
              {[
                {
                  value: 'organic',
                  label: 'Organic Certified',
                  desc: 'Show only products with organic certification',
                },
                {
                  value: 'non-organic',
                  label: 'Non-Organic',
                  desc: 'Show only products that are not organic certified',
                },
                {
                  value: 'either',
                  label: 'Either (Show all options)',
                  desc: 'Show me both organic and non-organic products',
                },
              ].map(opt => (
                <label
                  key={opt.value}
                  htmlFor={`organicPref-${opt.value}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    border: organicPreference === opt.value ? `2px solid ${MAIN_GREEN}` : '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '1.2rem 2rem',
                    background: organicPreference === opt.value ? '#f7faef' : '#fff',
                    boxShadow: organicPreference === opt.value ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                    fontWeight: 500,
                  }}
                  onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 12px #8cb43a22'}
                  onMouseOut={e => e.currentTarget.style.boxShadow = organicPreference === opt.value ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001'}
                >
                  <input
                    id={`organicPref-${opt.value}`}
                    type="radio"
                    name="organic"
                    value={opt.value}
                    checked={organicPreference === opt.value}
                    onChange={handleOrganicChange}
                    style={{ width: 22, height: 22, accentColor: MAIN_GREEN, marginRight: 8 }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.13rem', color: '#222', marginBottom: 2 }}>{opt.label}</span>
                    <span style={{ fontSize: '1.01rem', color: '#666', fontWeight: 400 }}>{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={prevStep} style={{ minWidth: 120 }}>
                Back
              </button>
              <button className="btn-secondary" onClick={() => navigate('/')} style={{ minWidth: 120 }}>
                Main Menu
              </button>
              <button
                className="btn-main"
                onClick={handleNextFromStep5}
                disabled={!canContinueStep5}
                style={{ minWidth: 120 }}
              >
                Get Recommendations
              </button>
            </div>
          </>
        )}

        {step === 6 && (
          <Recommendations
            selectedNutrients={selectedNutrients}
            selectedCombination={selectedCombination}
            productForm={productForm}
            applicationMethod={applicationMethod}
            organicPreference={organicPreference}
            products={getRecommendations()}
            onBack={prevStep}
          />
        )}
      </div>
    </div>
  );
}

function Recommendations({ selectedNutrients, selectedCombination, productForm, applicationMethod, organicPreference, products, onBack }) {
  const getNutrientDisplay = () => {
    if (selectedCombination) {
      return selectedCombination;
    } else if (selectedNutrients.length > 0) {
      return selectedNutrients.join(', ');
    }
    return 'Any nutrients';
  };

  const getOrganicDisplay = () => {
    switch (organicPreference) {
      case 'organic': return 'Organic Certified';
      case 'non-organic': return 'Non-Organic';
      case 'either': return 'Any certification';
      default: return 'Any certification';
    }
  };

  const getProductFormDisplay = () => {
    switch (productForm) {
      case 'Liquid': return 'Liquid form';
      case 'Powder': return 'Powder form';
      case 'Either': return 'Any form';
      default: return 'Any form';
    }
  };

  // Helper to get growth promoter recommendations for a product
  const getGrowthPromoterRecommendations = (product) => {
    const productRecommendation = productGrowthPromoterRecommendations.find(p => p.product_name === product.product_name);
    if (productRecommendation) {
      return {
        promoters: productRecommendation.recommended_promoters.map(name => 
          growthPromoters.find(gp => gp.name === name)
        ).filter(Boolean),
        notes: productRecommendation.notes
      };
    }
    return null;
  };

  return (
    <div>
      <div className="step-title">Recommended Products</div>
      <div className="step-desc">
        Based on your selections: <strong>{getNutrientDisplay()}</strong>
        {productForm && productForm !== 'Either' && <> in <strong>{getProductFormDisplay()}</strong></>}
        {applicationMethod && <> via <strong>{applicationMethod}</strong></>}
        {organicPreference && organicPreference !== 'either' && (
          <> with preference: <strong>{getOrganicDisplay()}</strong></>
        )}
      </div>
      {products.length === 0 && <div style={{ color: 'crimson', margin: '1.5rem 0' }}>No products found for your selection.</div>}
      {products.map((product) => {
        const growthPromoterRecs = getGrowthPromoterRecommendations(product);
        return (
          <div key={product.product_name} style={{ border: '1px solid #e0e0e0', borderRadius: 8, margin: '1.2rem 0', padding: '1rem', background: '#fafcf7' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: MAIN_GREEN }}>{product.product_name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '0.5rem 0' }}>
              <img src={product.image} alt={product.product_name} style={{ maxWidth: 120, maxHeight: 120, margin: '0.5rem 0', borderRadius: 6, background: '#fff', objectFit: 'contain' }} />
              <div>
                <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ color: MAIN_GREEN, fontWeight: 600, textDecoration: 'underline', marginRight: 12 }}>Product Page</a>
              </div>
            </div>
            <div style={{ margin: '0.5rem 0' }}>
              <strong>Nutrients:</strong> {product.nutrients.join(', ')}
            </div>
            <div style={{ margin: '0.5rem 0' }}>
              <strong>Application Methods:</strong> {product.application.join(', ')}
            </div>
            <div style={{ margin: '0.5rem 0' }}>
              <strong>Form:</strong> {product.product_form} | <strong>Organic:</strong> {product.organic_certified ? 'Yes' : 'No'}
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
              <strong>Why recommended?</strong> This product matches your needs for: {getNutrientDisplay()}.
              {productForm && productForm !== 'Either' && product.product_form.toLowerCase() === productForm.toLowerCase() && (
                <div style={{ marginTop: 4 }}>It comes in {productForm.toLowerCase()} form as requested.</div>
              )}
              {applicationMethod && product.application.includes(applicationMethod) && (
                <div style={{ marginTop: 4 }}>It can be applied via {applicationMethod.toLowerCase()} as requested.</div>
              )}
              {organicPreference === 'organic' && product.organic_certified && (
                <div style={{ marginTop: 4 }}>This product is organic certified as requested.</div>
              )}
              {organicPreference === 'non-organic' && !product.organic_certified && (
                <div style={{ marginTop: 4 }}>This product is non-organic as requested.</div>
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLandingPage />} />
        <Route path="/microbes" element={<EnhancedMicrobeTool />} />
        <Route path="/growth-promoters" element={<GrowthPromotersTool />} />
        <Route path="/fertilisers" element={<FertiliserTool />} />
      </Routes>
    </Router>
  );
}

export default App;