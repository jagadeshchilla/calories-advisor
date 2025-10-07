import React, { useEffect, useRef } from 'react';
import { TrendingUp, CheckCircle, Sparkles, Zap, Heart, BarChart3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AnalysisResult {
  success: boolean;
  analysis: string;
  filename: string;
  content_type: string;
}

interface AnalysisDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, isLoading }) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const foodItemsRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    const elements = [summaryRef.current, foodItemsRef.current, analysisRef.current].filter(Boolean);
    elements.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [result]);

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 to-blue-100/30 rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                <div className="h-8 bg-gray-200 rounded w-64"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="h-16 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="h-16 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="h-16 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-28 mx-auto"></div>
                </div>
            </div>
            
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Parse the analysis text to extract structured data
  const parseAnalysis = (analysis: string) => {
    const lines = analysis.split('\n').filter(line => line.trim());
    const foodItems: Array<{ name: string; calories: string }> = [];
    let totalCalories = '';
    let healthRating = '';
    let macronutrients = '';
    let recommendations = '';

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Detect food items (lines with numbers and calories) - handle markdown formatting
      if (trimmedLine.match(/^\d+\.\s+.+-\s*\d+\s*cal/i)) {
        const match = trimmedLine.match(/^\d+\.\s+(.+?)\s*-\s*(\d+)\s*cal/i);
        if (match) {
          // Clean up markdown formatting from food name
          const cleanName = match[1].trim().replace(/\*\*/g, '').replace(/\*/g, '');
          foodItems.push({
            name: cleanName,
            calories: match[2].trim()
          });
        }
      }
      // Also detect food items with markdown formatting like "**Dosa (1 large)** - 250-300 cal"
      else if (trimmedLine.match(/\*\*.+\*\*\s*-\s*\d+/i)) {
        const match = trimmedLine.match(/\*\*(.+?)\*\*\s*-\s*(\d+(?:-\d+)?)/i);
        if (match) {
          foodItems.push({
            name: match[1].trim(),
            calories: match[2].trim()
          });
        }
      }
      // Detect total calories - extract just the number
      else if (trimmedLine.toLowerCase().includes('total') && trimmedLine.toLowerCase().includes('calorie')) {
        // Look for patterns like "Total Calories: 1470" or "**Total Calories:** 1470" or "Total Estimated Calories: 1260 - 1680"
        const calorieMatch = trimmedLine.match(/(?:total.*?calories?[:\s]*\*?\*?)(\d+(?:-\d+)?)/i);
        if (calorieMatch) {
          totalCalories = calorieMatch[1];
        } else {
          // Fallback: look for any number in the line
          const numberMatch = trimmedLine.match(/(\d+(?:-\d+)?)/);
          if (numberMatch) {
            totalCalories = numberMatch[1];
          }
        }
      }
      // Detect health rating
      else if (trimmedLine.toLowerCase().includes('healthy') || trimmedLine.toLowerCase().includes('rating')) {
        healthRating = trimmedLine;
      }
      // Detect macronutrients
      else if (trimmedLine.toLowerCase().includes('carbohydrate') || 
               trimmedLine.toLowerCase().includes('protein') || 
               trimmedLine.toLowerCase().includes('fat')) {
        macronutrients = trimmedLine;
      }
      // Other recommendations
      else if (trimmedLine.length > 20 && !trimmedLine.match(/^\d+\./)) {
        recommendations = trimmedLine;
      }
    });

    return {
      foodItems,
      totalCalories,
      healthRating,
      macronutrients,
      recommendations,
      rawAnalysis: analysis
    };
  };

  const parsedData = parseAnalysis(result.analysis);

  // Calculate health rating based on food items
  const calculateHealthRating = (foodItems: Array<{ name: string; calories: string }>) => {
    if (foodItems.length === 0) return { stars: '⭐⭐⭐⭐⭐', color: 'text-green-600', description: 'No items detected' };
    
    const healthyKeywords = ['salad', 'vegetable', 'fruit', 'lean', 'grilled', 'steamed', 'boiled', 'fresh', 'organic'];
    const unhealthyKeywords = ['fried', 'deep fried', 'processed', 'sugary', 'sweet', 'dessert', 'cake', 'cookie', 'candy', 'soda'];
    
    let healthScore = 0;
    let totalItems = foodItems.length;
    
    foodItems.forEach(item => {
      const itemName = item.name.toLowerCase();
      
      // Check for healthy keywords
      if (healthyKeywords.some(keyword => itemName.includes(keyword))) {
        healthScore += 2;
      }
      // Check for unhealthy keywords
      else if (unhealthyKeywords.some(keyword => itemName.includes(keyword))) {
        healthScore -= 1;
      }
      // Neutral items get 1 point
      else {
        healthScore += 1;
      }
    });
    
    // Normalize score to 0-5 scale
    const normalizedScore = Math.max(0, Math.min(5, Math.round(healthScore / totalItems * 2.5 + 2.5)));
    
    const ratings = [
      { stars: '⭐', color: 'text-red-600', description: 'Very Poor' },
      { stars: '⭐⭐', color: 'text-orange-600', description: 'Poor' },
      { stars: '⭐⭐⭐', color: 'text-yellow-600', description: 'Fair' },
      { stars: '⭐⭐⭐⭐', color: 'text-blue-600', description: 'Good' },
      { stars: '⭐⭐⭐⭐⭐', color: 'text-green-600', description: 'Excellent' }
    ];
    
    return ratings[normalizedScore - 1] || ratings[2]; // Default to fair if calculation fails
  };

  const healthRating = calculateHealthRating(parsedData.foodItems);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 sm:space-y-12">
      {/* Summary Card */}
      <div ref={summaryRef} className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/30 to-primary-100/30 rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="flex items-center space-x-4 mb-8 sm:mb-12">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-gentle">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                <Sparkles className="w-3 h-3 text-white" />
        </div>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              <span className="bg-gradient-to-r from-green-600 to-primary-600 bg-clip-text text-transparent">
                Analysis Complete
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="group text-center transform hover:scale-105 transition-all duration-300">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:animate-bounce">
                <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-600 mb-2 sm:mb-3">
                {parsedData.foodItems.length}
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Food Items</div>
            </div>
            
            <div className="group text-center transform hover:scale-105 transition-all duration-300">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:animate-bounce">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
                {parsedData.totalCalories || 'N/A'}
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Total Calories</div>
          </div>
          
            <div className="group text-center transform hover:scale-105 transition-all duration-300">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:animate-bounce">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 ${healthRating.color}`}>
                {healthRating.stars}
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">{healthRating.description}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Items */}
      {parsedData.foodItems.length > 0 && (
        <div ref={foodItemsRef} className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-yellow-100/30 rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl">
            <div className="text-center mb-8 sm:mb-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Food Items Detected
                </span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {parsedData.foodItems.map((item, index) => (
                <div key={index} className="group transform hover:scale-105 transition-all duration-300">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-orange-600 transition-colors duration-300">
                        {item.name}
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                        {item.calories} cal
                      </span>
                    </div>
                  </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analysis */}
        <div ref={analysisRef} className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Detailed Analysis
              </span>
            </h3>
          </div>
          
          <div className="prose prose-sm sm:prose-base max-w-none">
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-inner">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
              >
                {parsedData.rawAnalysis}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;


