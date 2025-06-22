# AI Recommendation Setup

## Setup Instructions

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy the API key

### 2. Add API Key to Environment
Create a `.env` file in the root directory with:
```
VITE_OPENAI_API_KEY=your_actual_api_key_here
```

### 3. Restart Development Server
```bash
npm run dev
```

## How It Works

### Safety Features
- **Whitelist Approach**: AI can only suggest from predefined nutrient list
- **Product Filtering**: Only your actual NTS products are returned
- **No Made-up Information**: AI never invents new ingredients or product names
- **Fallback System**: If AI fails, keyword matching is used

### User Experience
1. User describes plant problem in natural language
2. AI analyzes the problem and suggests relevant nutrients
3. System filters your products based on AI suggestions
4. User gets recommendations with AI explanation

### Example Queries
- "My tomato plants have yellow leaves"
- "Citrus trees with small fruit"
- "Corn plants with purple leaves"
- "Stunted growth in vegetables"

## Troubleshooting

### AI Not Working?
1. Check your API key is correct
2. Ensure you have OpenAI credits
3. Check internet connection
4. The system will fallback to keyword matching

### No Products Found?
- Try different descriptions
- Use the manual filters instead
- Check that your product database is complete

## Security Notes
- API key is only used in the browser (for development)
- For production, use a backend API to protect your key
- No sensitive data is sent to OpenAI 