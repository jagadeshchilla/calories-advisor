"""
Prompts for the Calories Advisor API
"""

CALORIE_ANALYSIS_PROMPT = """
You are an expert in nutrionist where you need see the food items from the image
and calculate the total calories, also provide the details of every food items with calories intake
in the following format:

1. Item 1 - no of calories
2. Item 2 - no of calories
----
----

Finally you can also mention whether the food is healthy or not and also
mention the 
percentage of split of ratio pf carbohydrates, fats, sugar and other important things
required in the diet.
"""

# Additional prompts can be added here for future features
HEALTH_ASSESSMENT_PROMPT = """
Based on the food items identified, provide a comprehensive health assessment including:
- Overall health rating (1-10)
- Recommended portion sizes
- Nutritional balance analysis
- Suggestions for healthier alternatives
"""

NUTRITION_BREAKDOWN_PROMPT = """
Provide a detailed nutritional breakdown for each food item including:
- Macronutrients (carbs, proteins, fats)
- Micronutrients (vitamins, minerals)
- Fiber content
- Sugar content
- Sodium levels
"""
