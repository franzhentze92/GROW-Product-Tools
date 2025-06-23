# AI Integration Setup Guide

## OpenAI API Key Configuration

To enable AI-powered compatibility analysis, you need to set up your OpenAI API key:

### Option 1: Environment Variable (Recommended)
1. Create a `.env` file in the root directory
2. Add your OpenAI API key:
```
VITE_OPENAI_API_KEY=your-actual-openai-api-key-here
```

### Option 2: Direct Configuration
1. Open `src/services/compatibilityService.js`
2. Replace `'your-default-api-key-here'` on line 6 with your actual OpenAI API key:
```javascript
this.apiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY || 'your-actual-openai-api-key-here';
```

## How It Works

- **AI-Powered Analysis**: When an API key is configured, the tool uses GPT-4 to analyze product compatibility
- **Fallback**: If no API key is provided or AI fails, it falls back to advanced local analysis
- **Open Analysis**: The AI considers all product information (pH, nutrients, sulfates, phosphates, chelators, etc.)
- **No User Input Required**: Users don't need to enter API keys - it's configured by default

## Features

- ✅ **Automatic AI Analysis**: No user input required
- ✅ **Comprehensive Analysis**: Considers all chemical parameters
- ✅ **Fallback Protection**: Works even without API key
- ✅ **Open Thinking**: AI analyzes beyond just pH rules
- ✅ **Detailed Results**: Chemical interactions, warnings, recommendations

## Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your configuration

## Security Note

- Never commit your actual API key to version control
- Use environment variables for production deployments
- The API key is only used for compatibility analysis 