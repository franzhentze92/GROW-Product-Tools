# NTS Product Recommendator

A React-based web application that helps users find the best Nutri-Tech Solutions fertilizer products based on their specific nutrient needs, application methods, and organic preferences.

## Features

- **Nutrient Selection**: Choose from individual nutrients (N, P, K, Ca, Mg, S, Fe, Zn, Mn, Cu, B, Mo) or predefined combinations (NPK, NP, NK, PK, Micronutrients, Ca & Mg)
- **Application Methods**: Select from various application methods including soil application, foliar spray, drench, seed treatment, compost, and hydroponic
- **Organic Preferences**: Filter products by organic certification status
- **Smart Recommendations**: Get personalized product recommendations based on your selections
- **Product Details**: View detailed product information including benefits, application methods, and organic certification status

## Getting Started

### Prerequisites:

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

### Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── data/
│   ├── nutrients.js        # Nutrient definitions and combinations
│   ├── applicationMethods.js # Application method definitions
│   └── fertilizerProducts.js # Product database
├── assets/                 # Product images and static assets
└── index.css              # Application styles
```

## How It Works

1. **Step 1**: Users select their nutrient requirements (single nutrients or combinations)
2. **Step 2**: Users choose their preferred application method
3. **Step 3**: Users specify their organic certification preference
4. **Step 4**: The application provides personalized product recommendations

## Technologies Used

- React 18
- Vite (build tool)
- CSS3 with custom styling
- JavaScript ES6+

## Contributing

This project is designed to help users find the most suitable NTS fertilizer products. The product database can be updated to include new products or modify existing ones by editing the `fertilizerProducts.js` file.

## License

This project is part of the Smart Tools collection and is designed for educational and practical use in agricultural product selection.

<!-- Last updated: 2024-06-24 --> 