// ============================================
// 🍎 ПЕРЕВОДЫ ПИТАНИЯ (RU / EN)
// ============================================
const nutritionTranslations = {
    en: {
        activityLevels: {
            'sedentary': { name: 'Sedentary lifestyle', description: 'Little or no physical activity' },
            'light': { name: 'Lightly active', description: 'Exercise 1-3 times per week' },
            'moderate': { name: 'Moderately active', description: 'Exercise 3-5 times per week' },
            'active': { name: 'Very active', description: 'Exercise 6-7 times per week' },
            'very_active': { name: 'Extremely active', description: 'Twice-daily workouts + physical labor' }
        },
        goals: {
            'lose': { name: '🔻 Weight Loss', description: '20% calorie deficit' },
            'maintain': { name: '⚖️ Maintenance', description: 'Maintain current weight' },
            'gain': { name: '💪 Muscle Gain', description: '15% calorie surplus' },
            'bulk': { name: '🔥 Aggressive Bulking', description: '25% calorie surplus' }
        },
        mealPlanExample: {
            title: 'Sample 2000 kcal Meal Plan',
            meals: [
                { time: '🌅 Breakfast (8:00)', items: ['Oatmeal 80 g + berries', '2 eggs', 'Coffee/tea'] },
                { time: '🍎 Snack (11:00)', items: ['Greek yogurt 200 g', 'Handful of almonds 20 g'] },
                { time: '🍽️ Lunch (14:00)', items: ['Chicken breast 200 g', 'Rice 100 g', 'Vegetable salad'] },
                { time: '🥜 Snack (17:00)', items: ['Cottage cheese 5% fat 150 g', 'Banana'] },
                { time: '🌙 Dinner (20:00)', items: ['Salmon 150 g', 'Broccoli 200 g', 'Olive oil 1 tbsp'] }
            ]
        },
        foodExamples: {
            protein: ['Chicken breast', 'Lean beef', 'Cottage cheese 5% fat', 'Chicken egg', 'Salmon', 'Tuna in its own juice', 'Greek yogurt'],
            fat: ['Avocado', 'Olive oil', 'Almonds', 'Walnuts', 'Cheese', 'Chia seeds'],
            carbs: ['Brown rice (cooked)', 'Buckwheat (cooked)', 'Oatmeal', 'Potatoes (boiled)', 'Pasta (cooked)', 'Banana', 'Whole grain bread']
        }
    }
};

// ============================================
// ФУНКЦИИ
// ============================================
function getActivityName(activity) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return activity.name;
    return nutritionTranslations.en.activityLevels[activity.id]?.name || activity.name;
}

function getActivityDescription(activity) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return activity.description;
    return nutritionTranslations.en.activityLevels[activity.id]?.description || activity.description;
}

function getGoalName(goal) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return goal.name;
    return nutritionTranslations.en.goals[goal.id]?.name || goal.name;
}

function getGoalDescription(goal) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return goal.description;
    return nutritionTranslations.en.goals[goal.id]?.description || goal.description;
}

function getMealTitle() {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return mealPlanExample.title;
    return nutritionTranslations.en.mealPlanExample.title || mealPlanExample.title;
}

function getMealTime(index) {
    const lang = currentLang || 'ru';
    const orig = mealPlanExample.meals[index];
    if (!orig) return '';
    if (lang === 'ru') return orig.time;
    return nutritionTranslations.en.mealPlanExample.meals[index]?.time || orig.time;
}

function getMealItems(index) {
    const lang = currentLang || 'ru';
    const orig = mealPlanExample.meals[index];
    if (!orig) return [];
    if (lang === 'ru') return orig.items;
    return nutritionTranslations.en.mealPlanExample.meals[index]?.items || orig.items;
}

function getFoodName(food, category) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return food.name;
    const list = foodExamples[category];
    if (!list) return food.name;
    const idx = list.indexOf(food);
    if (idx === -1) return food.name;
    return nutritionTranslations.en.foodExamples[category]?.[idx] || food.name;
}

console.log('✅ nutrition-translations.js loaded');