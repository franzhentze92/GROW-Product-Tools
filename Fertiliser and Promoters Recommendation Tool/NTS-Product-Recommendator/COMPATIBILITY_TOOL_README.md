# NTS Product Compatibility Tool

## Overview

The NTS Product Compatibility Tool is an advanced chemical compatibility analyzer designed to help users determine if NTS fertilizer products can be safely mixed together for tank mixing applications. The tool uses both local chemical analysis algorithms and optional AI-powered analysis to provide comprehensive compatibility assessments.

## Features

### 🔬 Chemical Analysis
- **pH Compatibility**: Analyzes pH differences between products to detect potential precipitation issues
- **Nutrient Interactions**: Identifies chemical conflicts like calcium-phosphate precipitation
- **Salt Buildup Detection**: Monitors for excessive sulfate or salt concentrations
- **Micronutrient Antagonism**: Checks for potential micronutrient conflicts
- **Form Compatibility**: Considers mixing order for different product forms (liquid, powder, granules)

### 🤖 AI-Powered Analysis (Optional)
- **Advanced Chemical Knowledge**: Uses AI models trained on agricultural chemistry
- **Comprehensive Assessment**: Provides detailed chemical interaction analysis
- **Alternative Strategies**: Suggests alternative application methods when products are incompatible
- **Real-time Analysis**: Connects to OpenAI or Claude APIs for enhanced analysis

### 📊 Risk Assessment
- **Low Risk**: Products appear compatible with standard precautions
- **Medium Risk**: Some concerns detected, requires careful monitoring
- **High Risk**: Significant incompatibilities detected, separate application recommended

## How to Use

### 1. Product Selection
- Search for NTS products by name or nutrient content
- Select multiple products you want to mix
- View product details including pH, nutrients, and form

### 2. Analysis Options
- **Local Analysis**: Uses built-in chemical compatibility rules (default)
- **AI Analysis**: Enable for enhanced analysis with API key (OpenAI/Claude)

### 3. Compatibility Assessment
- Click "Analyze Compatibility" to run the analysis
- Review the comprehensive compatibility report
- Check warnings, recommendations, and alternative strategies

### 4. Safety Guidelines
- Always perform a jar test before large-scale mixing
- Follow label instructions for mixing order
- Monitor for precipitation or color changes
- Test on a small area before full application

## Technical Implementation

### Local Analysis Algorithm

The local analysis performs the following checks:

1. **pH Compatibility**
   - Extracts pH values from product analysis
   - Calculates pH differences between products
   - Flags incompatibilities when pH difference > 4 units

2. **Nutrient Interaction Analysis**
   - Identifies calcium-phosphate precipitation risks
   - Monitors sulfate buildup from multiple sources
   - Checks for micronutrient antagonism

3. **Form Compatibility**
   - Considers mixing order for different product forms
   - Provides recommendations for proper agitation

### AI Integration

The tool supports integration with:
- **OpenAI GPT-4**: For advanced chemical analysis
- **Anthropic Claude**: Alternative AI provider
- **Fallback System**: Automatically falls back to local analysis if AI fails

### API Configuration

```javascript
// Set API key for AI analysis
compatibilityService.setApiKey('your-api-key-here');

// Change AI provider
compatibilityService.setProvider('anthropic'); // or 'openai'
```

## Chemical Compatibility Rules

### pH Compatibility
- **Compatible**: pH difference ≤ 2 units
- **Caution**: pH difference 2-4 units
- **Incompatible**: pH difference > 4 units

### Nutrient Interactions
- **Calcium + Phosphate**: Forms insoluble precipitates
- **Multiple Sulfates**: Risk of salt buildup
- **High Micronutrient Mix**: Potential antagonism

### General Guidelines
- Always perform jar tests
- Monitor for visual changes
- Follow mixing order instructions
- Apply within 24 hours of mixing

## Safety Warnings

⚠️ **Important Safety Notes:**
- This tool provides guidance but does not replace professional advice
- Always follow product label instructions
- Perform jar tests before large-scale mixing
- Monitor crops for adverse reactions
- Consult with agronomists for complex mixing scenarios

## File Structure

```
src/
├── components/
│   └── ProductCompatibilityTool.jsx    # Main compatibility tool component
├── services/
│   └── compatibilityService.js         # AI and local analysis service
└── data/
    ├── fertilizerProducts.js           # Product database
    └── nutrients.js                    # Nutrient definitions
```

## Integration

The compatibility tool is integrated into the main NTS Product Recommendation Tool:

- **Route**: `/compatibility`
- **Navigation**: Added to main landing page
- **Dependencies**: Uses existing fertilizer product database

## Future Enhancements

### Planned Features
- **Batch Analysis**: Analyze multiple product combinations
- **Custom Product Input**: Allow users to input custom product specifications
- **Historical Analysis**: Save and compare previous compatibility assessments
- **Mobile Optimization**: Enhanced mobile interface
- **Export Reports**: Generate PDF compatibility reports

### AI Improvements
- **Enhanced Training**: More comprehensive chemical knowledge base
- **Real-time Updates**: Live chemical database updates
- **Multi-language Support**: Support for international users

## Contributing

To contribute to the compatibility tool:

1. Review the chemical compatibility rules
2. Test with various product combinations
3. Validate AI analysis accuracy
4. Update chemical interaction database
5. Improve user interface and experience

## Support

For technical support or questions about the compatibility tool:
- Check the main README.md for general setup instructions
- Review the chemical compatibility rules in the code
- Test with known compatible/incompatible product combinations

---

**Note**: This tool is designed to assist with product compatibility decisions but should not replace professional agricultural advice or product label instructions. 