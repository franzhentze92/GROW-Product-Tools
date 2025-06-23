import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enhancedMicrobeProducts } from '../data/enhancedMicrobeProducts';
import { enhancedMicrobeRecommendationLogic } from '../data/enhancedRecommendationLogic';
import { benefits } from '../data/benefits';
import imageMappingService from '../services/imageMappingService';

const MAIN_GREEN = '#8cb43a';

function EnhancedMicrobeTool() {
  const navigate = useNavigate();
  // Step state
  const [step, setStep] = useState(1);
  // User selections
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [applicationMethod, setApplicationMethod] = useState('');
  const [productFormPreference, setProductFormPreference] = useState('');
  const [organicCertifiedPreference, setOrganicCertifiedPreference] = useState('');
  const [showPathogen, setShowPathogen] = useState(false);
  const [showInsect, setShowInsect] = useState(false);
  const [pathogenScope, setPathogenScope] = useState('');
  const [pathogenTypes, setPathogenTypes] = useState([]);
  const [insectTypes, setInsectTypes] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
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
  console.log('Current step:', step, 'showPathogen:', showPathogen, 'showInsect:', showInsect, 'selectedBenefits:', selectedBenefits, 'applicationMethod:', applicationMethod, 'pathogenScope:', pathogenScope, 'pathogenTypes:', pathogenTypes, 'insectTypes:', insectTypes);

  // Step 1: Select benefits
  const handleBenefitChange = (benefit) => {
    setSelectedBenefits((prev) => {
      const newBenefits = prev.includes(benefit)
        ? prev.filter((b) => b !== benefit)
        : [...prev, benefit];
      
      // Update pathogen and insect flags based on the new benefits list
      if (benefit === 'Pathogen suppression') {
        setShowPathogen(!prev.includes(benefit));
      }
      if (benefit === 'Insect pest biocontrol') {
        setShowInsect(!prev.includes(benefit));
      }
      
      return newBenefits;
    });
  };

  // Step 2: Application method
  const handleAppMethodChange = (e) => setApplicationMethod(e.target.value);

  // Step 3: Product form preference
  const handleProductFormChange = (e) => setProductFormPreference(e.target.value);

  // Step 4: Organic certification preference
  const handleOrganicCertifiedChange = (e) => setOrganicCertifiedPreference(e.target.value);

  // Step 5: Pathogen questions
  const handlePathogenScopeChange = (e) => setPathogenScope(e.target.value);
  const handlePathogenTypeChange = (type) => {
    setPathogenTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Step 4: Insect pest questions
  const handleInsectTypeChange = (type) => {
    setInsectTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Enhanced recommendation logic using our new system
  const getRecommendations = () => {
    const filters = {
      selectedBenefits: selectedBenefits,
      applicationMethod: applicationMethod,
      productFormPreference: productFormPreference,
      organicCertifiedPreference: organicCertifiedPreference,
      pathogenTypes: pathogenTypes,
      insectTypes: insectTypes
    };

    return enhancedMicrobeRecommendationLogic.getRecommendations(enhancedMicrobeProducts, filters);
  };

  // Step navigation handlers
  const handleStart = () => setStep(2);
  const handleNextFromStep2 = () => setStep(3);
  const handleNextFromStep3 = () => setStep(4);
  const handleNextFromStep4 = () => setStep(5);
  const handleNextFromStep5 = () => {
    if (showPathogen) {
      setStep(6);
    } else if (showInsect) {
      setStep(7);
    } else {
      setStep(8);
    }
  };
  const handleNextFromStep6 = () => {
    if (showInsect) {
      setStep(7);
    } else {
      setStep(8);
    }
  };
  const handleNextFromStep7 = () => setStep(8);
  const prevStep = () => setStep(s => getPrevStep(s));

  // Helper to determine the correct previous step
  function getPrevStep(currentStep) {
    if (currentStep === 8) {
      if (showInsect) return 7;
      if (showPathogen) return 6;
      return 5;
    }
    if (currentStep === 7) {
      if (showPathogen) return 6;
      return 5;
    }
    if (currentStep === 6) {
      return 5;
    }
    return currentStep - 1;
  }

  // Validation
  const canContinueStep2 = selectedBenefits.length > 0;
  const canContinueStep3 = applicationMethod !== '';
  const canContinueStep4 = productFormPreference !== '';
  const canContinueStep5 = organicCertifiedPreference !== '';
  const canContinueStep6 = !showPathogen || (pathogenTypes.length > 0);
  const canContinueStep7 = !showInsect || (insectTypes.length > 0);

  // UI
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', background: '#f5f6f7', minHeight: '100vh' }}>
      <div className="card">
        {step === 1 && (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <h1 style={{ color: MAIN_GREEN, fontSize: '2.2rem', marginBottom: 16 }}>Enhanced Microbe Recommendation Tool</h1>
            <p style={{ fontSize: '1.15rem', color: '#444', maxWidth: 520, margin: '0 auto 1.5rem auto' }}>
              This enhanced tool uses direct control targeting for more accurate recommendations. Answer a few quick questions and get tailored recommendations with science-backed explanations.
            </p>
            <ul style={{ textAlign: 'left', display: 'inline-block', margin: '0 auto 2rem auto', color: '#666', fontSize: '1.05rem', lineHeight: 1.7 }}>
              <li>Step 1: Select the function or problem you want to address</li>
              <li>Step 2: Choose your application method</li>
              <li>Step 3: Select your preferred product form</li>
              <li>Step 4: Choose your organic certification preference</li>
              <li>Step 5: (If relevant) Specify pathogen details</li>
              <li>Step 6: (If relevant) Specify pest details</li>
              <li>Step 7: Get your recommendations!</li>
            </ul>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={() => window.location.href = '/'} style={{ minWidth: 120 }}>
                Main Menu
              </button>
              <button className="btn-main" style={{ fontSize: '1.15rem', padding: '0.7em 2.2em', minWidth: 120 }} onClick={handleStart}>Start</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <>
            <div className="step-title">1. What problem or function do you want to target?</div>
            <div className="step-desc">Select one or more functions you want to address.</div>
            <div>
              {benefits.map((b) => (
                <label key={b.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{b.name}</span>
                    <span style={{ color: '#888', fontSize: '0.95em', marginLeft: 6 }}>{b.description}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedBenefits.includes(b.name)}
                    onChange={() => handleBenefitChange(b.name)}
                    style={{ marginLeft: 12, width: 18, height: 18 }}
                  />
                </label>
              ))}
            </div>
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
            <div className="step-title">2. How do you plan to apply the product?</div>
            <div className="step-desc">Choose the main method you will use to apply the product.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '2rem 0 2.5rem 0' }}>
              {[
                {
                  value: 'Soil application',
                  label: 'Soil Application',
                  desc: 'Applied directly to the soil around plant roots',
                },
                {
                  value: 'Foliar spray',
                  label: 'Foliar Spray',
                  desc: 'Applied directly to plant leaves for quick absorption',
                },
                {
                  value: 'Seed treatment',
                  label: 'Seed Treatment',
                  desc: 'Applied to seeds before planting',
                },
                {
                  value: 'Compost inoculant',
                  label: 'Compost Inoculant',
                  desc: 'Added to compost piles to enhance decomposition',
                },
                {
                  value: 'Hydroponic system',
                  label: 'Hydroponic System',
                  desc: 'Added to nutrient solutions in hydroponic systems',
                },
              ].map(opt => (
                <label
                  key={opt.value}
                  htmlFor={`appMethod-${opt.value}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    border: applicationMethod === opt.value ? `2px solid ${MAIN_GREEN}` : '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '1.2rem 2rem',
                    background: applicationMethod === opt.value ? '#f7faef' : '#fff',
                    boxShadow: applicationMethod === opt.value ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                    fontWeight: 500,
                  }}
                  onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 12px #8cb43a22'}
                  onMouseOut={e => e.currentTarget.style.boxShadow = applicationMethod === opt.value ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001'}
                >
                  <input
                    id={`appMethod-${opt.value}`}
                    type="radio"
                    name="applicationMethod"
                    value={opt.value}
                    checked={applicationMethod === opt.value}
                    onChange={handleAppMethodChange}
                    style={{ width: 18, height: 18 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{opt.label}</div>
                    <div style={{ color: '#666', fontSize: '0.95em' }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={() => setStep(1)} style={{ minWidth: 120 }}>
                Back
              </button>
              <button className="btn-secondary" onClick={() => window.location.href = '/'} style={{ minWidth: 120 }}>
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
            <div className="step-title">3. What product form do you prefer?</div>
            <div className="step-desc">Choose your preferred product form.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '2rem 0 2.5rem 0' }}>
              {[
                {
                  value: 'Liquid',
                  label: 'Liquid',
                  desc: 'Ready-to-use liquid formulations',
                },
                {
                  value: 'Solid',
                  label: 'Solid',
                  desc: 'Powder, granular, or talc-based formulations',
                },
                {
                  value: 'No preference',
                  label: 'No Preference',
                  desc: 'Show me all product forms',
                },
              ].map(opt => (
                <label
                  key={opt.value}
                  htmlFor={`productForm-${opt.value}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    border: productFormPreference === opt.value ? `2px solid ${MAIN_GREEN}` : '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '1.2rem 2rem',
                    background: productFormPreference === opt.value ? '#f7faef' : '#fff',
                    boxShadow: productFormPreference === opt.value ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                    fontWeight: 500,
                  }}
                  onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 12px #8cb43a22'}
                  onMouseOut={e => e.currentTarget.style.boxShadow = productFormPreference === opt.value ? '0 2px 12px #8cb43a22' : '0 1px 6px #0001'}
                >
                  <input
                    id={`productForm-${opt.value}`}
                    type="radio"
                    name="productFormPreference"
                    value={opt.value}
                    checked={productFormPreference === opt.value}
                    onChange={handleProductFormChange}
                    style={{ width: 18, height: 18 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{opt.label}</div>
                    <div style={{ color: '#666', fontSize: '0.95em' }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={() => setStep(1)} style={{ minWidth: 120 }}>
                Back
              </button>
              <button className="btn-secondary" onClick={() => window.location.href = '/'} style={{ minWidth: 120 }}>
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
            <div className="step-title">4. Do you need organic certified products?</div>
            <div className="step-desc">Select your organic certification preference.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '2rem 0' }}>
              {[
                { value: 'organic', label: 'Yes - Only show organic certified products' },
                { value: 'non-organic', label: 'No - Show non-organic products' },
                { value: 'no-preference', label: 'No preference - Show all products' }
              ].map(option => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1.2rem 2rem',
                    border: organicCertifiedPreference === option.value ? `2px solid ${MAIN_GREEN}` : '1px solid #ddd',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: organicCertifiedPreference === option.value ? '#f7faef' : '#fff',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="organicCertified"
                    value={option.value}
                    checked={organicCertifiedPreference === option.value}
                    onChange={handleOrganicCertifiedChange}
                    style={{ marginRight: '1.5rem', width: '20px', height: '20px' }}
                  />
                  <span style={{ fontSize: '1.05rem' }}>{option.label}</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={prevStep} style={{ minWidth: 120 }}>Back</button>
              <button className="btn-secondary" onClick={() => window.location.href = '/'} style={{ minWidth: 120 }}>Main Menu</button>
              <button 
                className="btn-main" 
                onClick={handleNextFromStep5} 
                disabled={!canContinueStep5} 
                style={{ minWidth: 120 }}
              >
                Next
              </button>
            </div>
          </>
        )}
        {step === 6 && showPathogen && (
          <>
            <div className="step-title">5. What type of pathogens do you need to control?</div>
            <div className="step-desc">Select the specific pathogens you want to target.</div>
            <div>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Fungi</span>
                <input type="checkbox" checked={pathogenTypes.includes('fungi')} onChange={() => handlePathogenTypeChange('fungi')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Bacteria</span>
                <input type="checkbox" checked={pathogenTypes.includes('bacteria')} onChange={() => handlePathogenTypeChange('bacteria')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Nematodes</span>
                <input type="checkbox" checked={pathogenTypes.includes('nematodes')} onChange={() => handlePathogenTypeChange('nematodes')} style={{ width: 18, height: 18 }} />
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={prevStep} style={{ minWidth: 120 }}>Back</button>
              <button className="btn-secondary" onClick={() => window.location.href = '/'} style={{ minWidth: 120 }}>Main Menu</button>
              <button 
                className="btn-main" 
                onClick={handleNextFromStep6} 
                disabled={!canContinueStep6} 
                style={{ minWidth: 120 }}
              >
                Next
              </button>
            </div>
          </>
        )}
        {step === 7 && showInsect && (
          <>
            <div className="step-title">6. What type of insects do you need to control?</div>
            <div className="step-desc">Select the specific insects you want to target.</div>
            <div>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Aphid</span>
                <input type="checkbox" checked={insectTypes.includes('aphid')} onChange={() => handleInsectTypeChange('aphid')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Thrip</span>
                <input type="checkbox" checked={insectTypes.includes('thrip')} onChange={() => handleInsectTypeChange('thrip')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Whitefly</span>
                <input type="checkbox" checked={insectTypes.includes('whitefly')} onChange={() => handleInsectTypeChange('whitefly')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Psyllid/Leafhopper</span>
                <input type="checkbox" checked={insectTypes.includes('psyllid/leafhopper')} onChange={() => handleInsectTypeChange('psyllid/leafhopper')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Mite</span>
                <input type="checkbox" checked={insectTypes.includes('mite')} onChange={() => handleInsectTypeChange('mite')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Caterpillar/Moth Larva</span>
                <input type="checkbox" checked={insectTypes.includes('caterpillar/moth larva')} onChange={() => handleInsectTypeChange('caterpillar/moth larva')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Beetle Grub</span>
                <input type="checkbox" checked={insectTypes.includes('beetle grub')} onChange={() => handleInsectTypeChange('beetle grub')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Grasshopper/Locust</span>
                <input type="checkbox" checked={insectTypes.includes('grasshopper/locust')} onChange={() => handleInsectTypeChange('grasshopper/locust')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Termite</span>
                <input type="checkbox" checked={insectTypes.includes('termite')} onChange={() => handleInsectTypeChange('termite')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Scale Insect</span>
                <input type="checkbox" checked={insectTypes.includes('scale insect')} onChange={() => handleInsectTypeChange('scale insect')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Mealybug</span>
                <input type="checkbox" checked={insectTypes.includes('mealybug')} onChange={() => handleInsectTypeChange('mealybug')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Fungus Gnat</span>
                <input type="checkbox" checked={insectTypes.includes('fungus gnat')} onChange={() => handleInsectTypeChange('fungus gnat')} style={{ width: 18, height: 18 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <span>Soil-borne Grub</span>
                <input type="checkbox" checked={insectTypes.includes('soil-borne grub')} onChange={() => handleInsectTypeChange('soil-borne grub')} style={{ width: 18, height: 18 }} />
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
              <button className="btn-secondary" onClick={prevStep} style={{ minWidth: 120 }}>Back</button>
              <button className="btn-secondary" onClick={() => window.location.href = '/'} style={{ minWidth: 120 }}>Main Menu</button>
              <button 
                className="btn-main" 
                onClick={handleNextFromStep7} 
                disabled={!canContinueStep7} 
                style={{ minWidth: 120 }}
              >
                Next
              </button>
            </div>
          </>
        )}
        {step === 8 && (
          <EnhancedRecommendations
            selectedBenefits={selectedBenefits}
            applicationMethod={applicationMethod}
            productFormPreference={productFormPreference}
            organicCertifiedPreference={organicCertifiedPreference}
            pathogenTypes={pathogenTypes}
            insectTypes={insectTypes}
            products={getRecommendations()}
            onBack={prevStep}
          />
        )}
      </div>
    </div>
  );
}

function EnhancedRecommendations({ selectedBenefits, applicationMethod, productFormPreference, organicCertifiedPreference, products, onBack, pathogenTypes = [], insectTypes = [] }) {
  const filters = {
    selectedBenefits,
    applicationMethod,
    productFormPreference,
    organicCertifiedPreference,
    pathogenTypes,
    insectTypes
  };

  return (
    <>
      <div className="step-title">Your Recommendations</div>
      <div className="step-desc">
        Based on your selections, here are the best products for your needs.
      </div>
      
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>No products found matching your criteria.</p>
          <p>Try adjusting your selections or contact us for personalized advice.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '2rem 0' }}>
          {products.map((product, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                margin: '1.2rem 0',
                padding: '1rem',
                background: '#fafcf7'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: MAIN_GREEN }}>{product.product_name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '0.5rem 0' }}>
                <img 
                  src={getProductImage(product)} 
                  alt={product.product_name} 
                  style={{ maxWidth: 120, maxHeight: 120, margin: '0.5rem 0', borderRadius: 6, background: '#fff', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.src = '/assets/default-product.webp';
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: MAIN_GREEN, marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                    {product.product_name}
                  </h3>
                  <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95rem' }}>
                    {product.description}
                  </p>

                  {/* Microbes Section */}
                  <div style={{ 
                    background: '#edf7ed', 
                    padding: '0.75rem', 
                    borderRadius: '6px', 
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                  }}>
                    <strong style={{ color: '#2e7d32' }}>Active Microbes:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', color: '#444' }}>
                      {product.microbes.map((microbe, idx) => (
                        <li key={idx} style={{ marginBottom: '0.3rem', fontStyle: 'italic' }}>{microbe}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits Section */}
                  <div style={{ 
                    background: '#f3f8ff', 
                    padding: '0.75rem', 
                    borderRadius: '6px', 
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                  }}>
                    <strong style={{ color: '#1565c0' }}>Some Benefits:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', color: '#444' }}>
                      {product.benefits.map((benefit, idx) => (
                        <li key={idx} style={{ marginBottom: '0.3rem' }}>{benefit}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Why Recommended Section */}
                  <div style={{ 
                    background: '#fff9e6', 
                    padding: '0.75rem', 
                    borderRadius: '6px', 
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                  }}>
                    <strong style={{ color: '#b78103' }}>Why recommended:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', color: '#444' }}>
                      {product.benefits
                        .filter(b => selectedBenefits.includes(b))
                        .map((benefit, idx) => (
                          <li key={idx} style={{ marginBottom: '0.3rem' }}>
                            Provides: {benefit}
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Notes Section */}
                  <div style={{ marginTop: '1rem' }}>
                    <strong style={{ color: '#666' }}>Notes:</strong>
                    <p style={{ color: '#666', margin: '0.5rem 0', fontSize: '0.95rem' }}>{product.notes}</p>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ 
                      background: '#e8f5e8', 
                      color: '#2d5a2d', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem' 
                    }}>
                      {product.product_form}
                    </span>
                    <span style={{ 
                      background: '#e8f5e8', 
                      color: '#2d5a2d', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem' 
                    }}>
                      {product.application.join(', ')}
                    </span>
                    {product.organic_certified && (
                      <span style={{ 
                        background: '#fff3cd', 
                        color: '#856404', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem' 
                      }}>
                        Organic Certified
                      </span>
                    )}
                  </div>
                  
                  {/* Recommended Foods Section */}
                  {product.recommended_foods && product.recommended_foods.length > 0 && (
                    <div style={{ 
                      background: '#f0f8ff', 
                      padding: '0.75rem', 
                      borderRadius: '6px', 
                      marginBottom: '1rem',
                      fontSize: '0.9rem'
                    }}>
                      <strong style={{ color: '#2c5aa0' }}>Recommended Microbial Foods:</strong>
                      <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', color: '#444' }}>
                        {product.recommended_foods.map((food, idx) => (
                          <li key={idx} style={{ marginBottom: '0.25rem' }}>{food}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Application Rates Section */}
                  {product.application_rates && (
                    <div style={{ 
                      background: '#f0f8ff', 
                      padding: '0.75rem', 
                      borderRadius: '6px', 
                      marginBottom: '1rem',
                      fontSize: '0.9rem'
                    }}>
                      <strong style={{ color: '#2c5aa0' }}>Application Rates:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        {Object.entries(product.application_rates).map(([method, rates]) => (
                          <div key={method} style={{ marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#444', textTransform: 'capitalize' }}>
                              {method.replace('_', ' ')}:
                            </strong>
                            {typeof rates === 'string' ? (
                              <span style={{ color: '#666', marginLeft: '0.5rem' }}>{rates}</span>
                            ) : (
                              <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.5rem', color: '#666' }}>
                                {Object.entries(rates).map(([crop, rate]) => (
                                  <li key={crop} style={{ marginBottom: '0.25rem' }}>
                                    <strong style={{ color: '#444' }}>
                                      {crop.replace('_', ' ').replace(/([A-Z])/g, ' $1').trim()}:
                                    </strong> {rate}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      background: MAIN_GREEN,
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 32 }}>
        <button className="btn-secondary" onClick={onBack} style={{ minWidth: 120 }}>
          Back
        </button>
        <button className="btn-secondary" onClick={() => window.location.href = '/'} style={{ minWidth: 120 }}>
          Main Menu
        </button>
      </div>
    </>
  );
}

export default EnhancedMicrobeTool; 