// Smart Image Mapping Service
// Automatically finds the best matching image file regardless of naming differences

class ImageMappingService {
  constructor() {
    this.cache = new Map();
    this.availableImages = null;
    this.initialized = false;
  }

  // Initialize by scanning available images
  async initialize() {
    if (this.initialized) return;
    
    try {
      // In a real app, you'd fetch this from your backend
      // For now, we'll use a hardcoded list based on what we know exists
      this.availableImages = [
        'Aloe-Tech20L.webp',
        'Amino-Max20L.webp',
        'b-sub.webp',
        'Boron_FarmEssentials_20L.webp',
        'Brix-Fix20L.webp',
        'CAL-TECH_20L_AC-2025.webp',
        'CalMag-LifeOrganic15L.webp',
        'Citrus-Tech20L.webp',
        'CloakSprayOil20L.webp',
        'Cobalt_Shuttle_5L_23092024_ebd95139-99cc-4ea6-bceb-e5aa35a27d72.webp',
        'Copper_FarmEssentials_20L.webp',
        'Dia-LifeOrganic15L.webp',
        'Dominate-B-5L.webp',
        'Dominate-F20L.webp',
        'FastFulvic20L.webp',
        'FlyBye20L.webp',
        'FulvX_5Kg_11072024.webp',
        'Gyp-LifeOrganic15L.webp',
        'Horse-Saver.webp',
        'Iron_FarmEssentials_20L.webp',
        'K-Rich20L.webp',
        'Life-ForceGoldPellets.webp',
        'Life_Force_Carbon_30_L_FEB25.webp',
        'Lime-LifeOrganic15L.webp',
        'LiquidHumus20L.webp',
        'LMF20L.webp',
        'Mag-LifeOrganic15L.webp',
        'Manganese_FarmEssentials_20L.webp',
        'Multi-Boost_FarmEssentials_20L.webp',
        'Multi-MinFarmEssentials20L.webp',
        'Multi-PlexFarmEssentials20L.webp',
        'NTS-Fulvic-Acid-Powder.webp',
        'NTS_20L_ActivateCharCondensate-ACC_NOV24_5c220e99-9040-49a1-932a-a20b00988fb3.webp',
        'NTS_20L_Micro_Amino_Drive_MAD_MAR_25_5a0f53a6-4f89-4de1-969f-e0522bf67cf7.webp',
        'NTS_20L_Premium_CALCIUM_FULVATE_FEB25_e26ec202-b955-4107-93b6-27bb3c57126a.webp',
        'NTS_Livestock_Tonic_5L_Mother_Love_ACV_AC-2025.webp',
        'nts-soft-rock.webp',
        'Nutri-Carb-N20L.webp',
        'Nutri-Gyp.webp',
        'Nutri-Kelp5kg.webp',
        'Nutri-KeyBoronShuttle20L.webp',
        'Nutri-KeyCalciumShuttle20L.webp',
        'Nutri-KeyCopperShuttle20L.webp',
        'Nutri-KeyHydroShuttle20L.webp',
        'Nutri-KeyIronShuttle20L.webp',
        'Nutri-KeyMagnesiumShuttle20L.webp',
        'Nutri-KeyManganeseShuttle20L.webp',
        'Nutri-KeyMolyShuttle20L.webp',
        'Nutri-KeyShuttleSeven20L.webp',
        'Nutri-KeyZincShuttle20L.webp',
        'Nutri-LifeBAM20L.webp',
        'Nutri-LifeBio-N5L.webp',
        'Nutri-LifeBio-P5L_11109878-ee20-4f0c-b071-ca0d55fc945a.webp',
        'Nutri-LifeBio-Plex5L.webp',
        'Nutri-LifeMicro-Force20kg.webp',
        'Nutri-LifeMyco-Force5kg.webp',
        'Nutri-LifeRoot-Guard5kg_63a9e3d1-daed-420e-ba4c-70d41fc8ad3e.webp',
        'Nutri-LifeTricho-Shield1kg.webp',
        'Nutri-Phos_Super_Active_20_Kg_OCT24_6c2ce95a-3f91-43ca-8c3c-97c88f67f054.webp',
        'Nutri-SeaLiquidFish20L.webp',
        'Nutri-Stim-Saponins.webp',
        'Nutri-StimTriacontanol1L.webp',
        'Nutri-TechBlackGold20L.webp',
        'Path-X20L.webp',
        'PetSaver.webp',
        'Phos-Force20L.webp',
        'Phos-LifeOrganic15L.webp',
        'Photo-Finish20L.webp',
        'Platform_1Kg_03122024.webp',
        'PotassiumSilicate20L.webp',
        'Root_Shoot20L.webp',
        'SeaChangeKFF20L_8b22b03d-68a4-41d9-bd22-17a60a201e75.webp',
        'SeaChangeLiquidKelp20L.webp',
        'SeaChangeStockBoosterLiquid20L.webp',
        'Seed-Start20L.webp',
        'Sili-Cal-B_15_L.webp',
        'Soluble-Humate-Granules.webp',
        'Stabilised-Boron-Granules.webp',
        'Stock-Saver-Vet.webp',
        'Sudo-Shield_5kg_FEB25.webp',
        'Super-Soluble-Humates.webp',
        'Tri-Kelp1kg.webp',
        'Trio_CMB_20L.webp',
        'TripleTen20L.webp',
        'TsunamiSuperSpreader20L.webp',
        'Zinc_FarmEssentials_20L.webp'
      ];
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize image mapping service:', error);
      this.availableImages = [];
    }
  }

  // Normalize a filename for comparison (remove extension, lowercase, replace special chars)
  normalizeFilename(filename) {
    return filename
      .replace(/\.[^.]+$/, '') // Remove extension
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ''); // Remove all non-alphanumeric chars
  }

  // Calculate similarity score between two strings
  calculateSimilarity(str1, str2) {
    const normalized1 = this.normalizeFilename(str1);
    const normalized2 = this.normalizeFilename(str2);
    
    // Exact match after normalization
    if (normalized1 === normalized2) return 1.0;
    
    // Check if one contains the other
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
      return 0.8;
    }
    
    // Calculate Levenshtein distance for fuzzy matching
    const distance = this.levenshteinDistance(normalized1, normalized2);
    const maxLength = Math.max(normalized1.length, normalized2.length);
    return 1 - (distance / maxLength);
  }

  // Levenshtein distance algorithm for fuzzy matching
  levenshteinDistance(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  }

  // Find the best matching image for a given product name or image path
  findBestMatch(target) {
    if (!this.initialized) {
      console.warn('ImageMappingService not initialized. Call initialize() first.');
      return '/assets/default-product.webp';
    }

    // Check cache first
    if (this.cache.has(target)) {
      return this.cache.get(target);
    }

    // --- NEW: Try exact normalized match first ---
    const normalizedTarget = this.normalizeFilename(target);
    for (const image of this.availableImages) {
      if (this.normalizeFilename(image) === normalizedTarget) {
        const exactResult = `/assets/${image}`;
        this.cache.set(target, exactResult);
        return exactResult;
      }
    }
    // --- END NEW ---

    let bestMatch = null;
    let bestScore = 0;

    // Try to match against each available image
    for (const image of this.availableImages) {
      const score = this.calculateSimilarity(target, image);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = image;
      }
    }

    // Only return a match if similarity is above threshold
    const threshold = 0.3;
    const result = bestScore >= threshold ? `/assets/${bestMatch}` : '/assets/default-product.webp';
    
    // Cache the result
    this.cache.set(target, result);
    
    return result;
  }

  // Get image path for a product (can be called with product name or image path)
  getImagePath(productNameOrPath) {
    // If it's already a path, extract the filename
    const filename = productNameOrPath.includes('/') 
      ? productNameOrPath.split('/').pop()
      : productNameOrPath;
    
    return this.findBestMatch(filename);
  }

  // Clear cache (useful for testing or if images change)
  clearCache() {
    this.cache.clear();
  }
}

// Create singleton instance
const imageMappingService = new ImageMappingService();

export default imageMappingService; 