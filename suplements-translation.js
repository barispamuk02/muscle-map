
const supplementsTranslations = {
  en: {
    whey_protein: {
      shortDesc: "Fast-digesting protein for muscle growth and recovery",
      whatIs: "A concentrated protein derived from milk whey. It contains all essential amino acids and is highly digestible.",
      effect: "Helps increase high-quality protein intake, supports muscle protein synthesis, and promotes post-workout recovery.",
      dose: "20-40 g",
      timing: "After workouts or between meals",
      naturalAlternatives: [
        { product: "Chicken breast", amount: "150 g = approximately 30 g of protein" },
        { product: "Eggs", amount: "5 eggs = approximately 30 g of protein" },
        { product: "Cottage cheese", amount: "200 g = approximately 30-34 g of protein" },
        { product: "Tuna", amount: "130 g = approximately 30 g of protein" }
      ],
      warnings: "May cause digestive discomfort in people with lactose intolerance, especially whey concentrate. Does not replace a balanced and varied diet.",
      research: "Research shows that adequate protein intake combined with resistance training supports gains in muscle mass and strength."
    },

    casein_protein: {
      shortDesc: "Slow-digesting milk protein for lasting satiety",
      whatIs: "Casein is the main protein found in milk and is digested more slowly than whey protein. It provides a gradual supply of amino acids.",
      effect: "Helps maintain amino acid availability for several hours and supports daily protein intake goals.",
      dose: "25-40 g",
      timing: "Between meals or before bedtime",
      naturalAlternatives: [
        { product: "Cottage cheese", amount: "200 g = approximately 30-34 g of protein" },
        { product: "Greek yogurt", amount: "300 g = approximately 25-30 g of protein" },
        { product: "Skyr", amount: "300 g = approximately 30 g of protein" },
        { product: "Milk", amount: "750 ml = approximately 24 g of protein" }
      ],
      warnings: "Not suitable for people with a milk protein allergy. May cause gastrointestinal discomfort in those who cannot tolerate dairy products.",
      research: "Casein is a complete protein source. Its main advantages are convenient protein intake and slower digestion."
    },

    whey_isolate: {
      shortDesc: "Highly purified protein with minimal fat and lactose",
      whatIs: "Whey protein isolate is a more extensively filtered form of whey protein. It typically contains a high percentage of protein with very little fat, carbohydrate, or lactose.",
      effect: "Provides complete protein and essential amino acids to support muscle recovery and growth.",
      dose: "20-35 g",
      timing: "After workouts or throughout the day",
      naturalAlternatives: [
        { product: "Chicken fillet", amount: "150 g = approximately 32 g of protein" },
        { product: "Egg whites", amount: "250 g = approximately 27 g of protein" },
        { product: "Lean fish", amount: "150 g = approximately 30 g of protein" },
        { product: "Shrimp", amount: "150 g = approximately 30 g of protein" }
      ],
      warnings: "Not suitable for people with a milk protein allergy. Protein from supplements should be included when calculating total daily protein intake.",
      research: "Whey protein is well studied and effectively supports muscle protein synthesis when combined with sufficient training stimulus."
    },

    egg_protein: {
      shortDesc: "Complete protein derived from egg whites",
      whatIs: "A protein supplement typically made from dried egg whites. It contains the full range of essential amino acids.",
      effect: "Helps increase total high-quality protein intake and supports muscle recovery.",
      dose: "20-35 g",
      timing: "After workouts or between meals",
      naturalAlternatives: [
        { product: "Eggs", amount: "5 eggs = approximately 30 g of protein" },
        { product: "Egg whites", amount: "300 g = approximately 33 g of protein" },
        { product: "Chicken breast", amount: "150 g = approximately 30 g of protein" },
        { product: "Tuna", amount: "130 g = approximately 30 g of protein" }
      ],
      warnings: "Not suitable for people with an egg allergy. Protein intake should be considered as part of the overall diet.",
      research: "Egg protein has high biological value and contains all essential amino acids."
    },

    plant_protein: {
      shortDesc: "Plant-based protein source for an active lifestyle",
      whatIs: "A protein supplement made from peas, soy, rice, or a blend of plant sources. Combining different sources can improve the amino acid profile.",
      effect: "Helps meet daily protein requirements and supports post-workout recovery.",
      dose: "25-40 g",
      timing: "After workouts or between meals",
      naturalAlternatives: [
        { product: "Tofu", amount: "250 g = approximately 30 g of protein" },
        { product: "Cooked lentils", amount: "350 g = approximately 30 g of protein" },
        { product: "Cooked chickpeas", amount: "350 g = approximately 30 g of protein" },
        { product: "Soybeans", amount: "200 g = approximately 30-35 g of protein" }
      ],
      warnings: "Consider individual tolerance to specific plant ingredients. Some blends may contain sweeteners and thickeners.",
      research: "When consumed in sufficient amounts, high-quality plant protein blends can support muscular adaptations to training."
    },

    creatine_monohydrate: {
      shortDesc: "Improves strength and power during training",
      whatIs: "The most extensively studied form of creatine. It increases muscle phosphocreatine stores, which help rapidly regenerate ATP.",
      effect: "Improves performance during repeated high-intensity efforts and supports increases in strength and muscle mass when combined with training.",
      dose: "3-5 g per day",
      timing: "Daily; timing is not critical",
      naturalAlternatives: [
        { product: "Herring", amount: "500 g = approximately 3-5 g of creatine" },
        { product: "Beef", amount: "700-1000 g = approximately 3-5 g of creatine" },
        { product: "Pork", amount: "700-1000 g = approximately 3-5 g of creatine" },
        { product: "Salmon", amount: "700-1000 g = approximately 3-5 g of creatine" }
      ],
      warnings: "May slightly increase body weight due to increased water retention within muscle cells. Maintain normal hydration habits.",
      research: "Creatine monohydrate is among the most thoroughly researched sports supplements, with strong evidence supporting its benefits for strength and high-intensity exercise performance."
    },

    creatine_hcl: {
      shortDesc: "Highly soluble form of creatine for exercise performance",
      whatIs: "Creatine hydrochloride is creatine bonded with hydrochloric acid to improve solubility. It is marketed as an alternative to creatine monohydrate.",
      effect: "May increase creatine availability in muscle tissue, but no convincing advantage over monohydrate has been demonstrated.",
      dose: "1.5-3 g per day",
      timing: "Daily, regardless of training schedule",
      naturalAlternatives: [
        { product: "Herring", amount: "300-500 g = a significant dietary source of creatine" },
        { product: "Beef", amount: "500 g = approximately 2 g of creatine" },
        { product: "Pork", amount: "500 g = approximately 2 g of creatine" },
        { product: "Salmon", amount: "500 g = approximately 2 g of creatine" }
      ],
      warnings: "A higher price does not necessarily mean greater effectiveness. Gastrointestinal discomfort may occur.",
      research: "Creatine itself is well studied, but evidence supporting the superiority of creatine HCL over monohydrate remains insufficient."
    },

    bcaa: {
      shortDesc: "Three amino acids involved in muscle protein metabolism",
      whatIs: "A combination of leucine, isoleucine, and valine. These essential amino acids are naturally present in complete protein foods.",
      effect: "Leucine helps initiate muscle protein synthesis, but the remaining essential amino acids are also required for the process to proceed effectively.",
      dose: "5-10 g",
      timing: "Before, during, or after workouts",
      naturalAlternatives: [
        { product: "Whey protein from dairy foods", amount: "250-300 g of cottage cheese or yogurt as a protein-rich meal" },
        { product: "Chicken breast", amount: "150 g provides all essential amino acids" },
        { product: "Eggs", amount: "4-5 eggs provide BCAAs and the other essential amino acids" },
        { product: "Beef", amount: "150 g provides a complete amino acid profile" }
      ],
      warnings: "When complete protein intake is adequate, additional benefits from BCAA supplementation are generally limited. BCAAs should not replace complete protein sources.",
      research: "Studies do not consistently demonstrate that BCAAs provide additional muscle growth benefits compared with adequate complete protein or essential amino acid intake."
    },

    eaa: {
      shortDesc: "Complete blend of essential amino acids for muscles",
      whatIs: "A combination of all nine essential amino acids that must be obtained through the diet. They serve as building blocks for proteins.",
      effect: "Provides the amino acids required for muscle protein synthesis, particularly when dietary intake of complete protein is insufficient.",
      dose: "8-15 g",
      timing: "Before, during, or after workouts",
      naturalAlternatives: [
        { product: "Eggs", amount: "4-5 eggs = complete amino acid profile" },
        { product: "Chicken breast", amount: "120-150 g = complete protein" },
        { product: "Cottage cheese", amount: "150-200 g = complete protein" },
        { product: "Fish", amount: "150 g = complete protein" }
      ],
      warnings: "Additional EAA supplementation is less necessary when dietary intake of high-quality protein is sufficient. Does not replace balanced nutrition.",
      research: "Essential amino acids are necessary for muscle protein synthesis, but complete protein foods typically provide them in sufficient quantities."
    },

    glutamine: {
      shortDesc: "Amino acid with limited benefits for muscle growth",
      whatIs: "Glutamine is one of the most abundant amino acids in the human body. It participates in numerous metabolic processes.",
      effect: "In healthy athletes, additional glutamine supplementation generally does not produce meaningful increases in muscle mass or strength.",
      dose: "5-10 g",
      timing: "After workouts or between meals",
      naturalAlternatives: [
        { product: "Beef", amount: "150-200 g = a protein-rich source of glutamine" },
        { product: "Chicken", amount: "150-200 g = a source of glutamine" },
        { product: "Eggs", amount: "4-5 eggs = a source of amino acids" },
        { product: "Cottage cheese", amount: "200 g = a source of glutamine and complete protein" }
      ],
      warnings: "Do not expect significant anabolic effects. Additional supplementation is generally unnecessary when dietary intake is adequate.",
      research: "Studies involving healthy, physically active individuals do not support a significant effect of glutamine supplementation on strength or muscle mass gains."
    },

    beta_alanine_amino: {
      shortDesc: "Increases muscle carnosine and exercise endurance",
      whatIs: "Beta-alanine is an amino acid and a precursor to carnosine. Higher muscle carnosine levels help buffer acidity during intense exercise.",
      effect: "May improve performance during intense physical efforts lasting approximately one to several minutes.",
      dose: "3.2-6.4 g per day",
      timing: "Daily, divided into several smaller doses",
      naturalAlternatives: [
        { product: "Chicken", amount: "200 g = a source of carnosine and its components" },
        { product: "Turkey", amount: "200 g = a source of carnosine" },
        { product: "Beef", amount: "200 g = a source of carnosine" },
        { product: "Pork", amount: "200 g = a source of carnosine" }
      ],
      warnings: "Large single doses may cause temporary skin tingling (paresthesia). Dividing the daily dose can reduce this effect.",
      research: "Research supports increased muscle carnosine levels and modest improvements in certain types of high-intensity exercise performance."
    },

    l_carnitine: {
      shortDesc: "Involved in transporting fatty acids into cells",
      whatIs: "Carnitine helps transport long-chain fatty acids into mitochondria. The body can also synthesize it naturally.",
      effect: "It does not act as a direct fat burner in most healthy individuals. Fat loss primarily depends on maintaining an energy deficit.",
      dose: "1-3 g per day",
      timing: "With meals; timing relative to exercise is not critical",
      naturalAlternatives: [
        { product: "Beef", amount: "150-200 g = a rich source of carnitine" },
        { product: "Lamb", amount: "150-200 g = a rich source of carnitine" },
        { product: "Pork", amount: "200 g = a source of carnitine" },
        { product: "Milk", amount: "500 ml = a small dietary source of carnitine" }
      ],
      warnings: "May cause gastrointestinal discomfort. Significant fat loss should not be expected without managing overall energy balance.",
      research: "Evidence for substantial fat-burning effects in healthy, physically active individuals is mixed and considerably weaker than marketing claims suggest."
    },

    caffeine_fat_burner: {
      shortDesc: "Stimulant for alertness and increased energy expenditure",
      whatIs: "Caffeine is a natural central nervous system stimulant found in coffee, tea, cocoa, and certain plants.",
      effect: "Temporarily increases alertness and may slightly increase energy expenditure. A calorie deficit remains the main factor in fat loss.",
      dose: "1-3 mg/kg of body weight",
      timing: "30-60 minutes before physical activity",
      naturalAlternatives: [
        { product: "Coffee", amount: "1-2 cups = approximately 80-200 mg of caffeine" },
        { product: "Black tea", amount: "2-3 cups = approximately 80-150 mg of caffeine" },
        { product: "Green tea", amount: "3-4 cups = approximately 80-160 mg of caffeine" },
        { product: "Matcha", amount: "2-4 g of powder = approximately 40-140 mg of caffeine" }
      ],
      warnings: "May cause insomnia, anxiety, palpitations, and increased blood pressure. Avoid taking it close to bedtime.",
      research: "Caffeine can moderately increase thermogenesis and exercise performance, but its independent effect on body fat reduction is relatively small."
    },

    green_tea_extract: {
      shortDesc: "Source of catechins with modest thermogenic effects",
      whatIs: "A concentrated source of green tea polyphenols, including EGCG. Some products also contain caffeine.",
      effect: "May have a small effect on energy metabolism but cannot replace a calorie deficit and regular physical activity.",
      dose: "250-500 mg of extract per day",
      timing: "With food, preferably earlier in the day",
      naturalAlternatives: [
        { product: "Green tea", amount: "3-5 cups per day = a source of catechins" },
        { product: "Matcha", amount: "2-4 g = a concentrated source of tea polyphenols" },
        { product: "Apples", amount: "2 apples = a source of polyphenols" },
        { product: "Berries", amount: "150-200 g = a source of polyphenols" }
      ],
      warnings: "Concentrated extracts should not be taken on an empty stomach. High doses of EGCG may be unsafe, so do not exceed the manufacturer's recommended dosage.",
      research: "Studies show small and inconsistent effects of green tea catechins on body weight and energy metabolism."
    },

    vitamin_d: {
      shortDesc: "Supports bone health, muscle function, and immunity",
      whatIs: "A fat-soluble vitamin that the body can produce in the skin through sunlight exposure. It plays a role in calcium metabolism and muscle function.",
      effect: "Helps maintain normal bone health and muscle function, especially in individuals with insufficient vitamin D levels.",
      dose: "600-2000 IU per day",
      timing: "With a meal containing fat",
      naturalAlternatives: [
        { product: "Salmon", amount: "100-150 g = a significant source of vitamin D" },
        { product: "Herring", amount: "100-150 g = a significant source of vitamin D" },
        { product: "Egg yolks", amount: "3-4 yolks = a small dietary source" },
        { product: "Fortified milk", amount: "500 ml = amount varies by manufacturer" }
      ],
      warnings: "Avoid taking high doses for extended periods without a clear medical reason. Vitamin D can accumulate in the body.",
      research: "Benefits are most evident in people with insufficient vitamin D levels. Additional performance benefits are much less pronounced when vitamin D status is already adequate."
    },

    omega_3: {
      shortDesc: "Fatty acids for heart health and general recovery",
      whatIs: "Omega-3 supplements typically contain EPA and DHA from fish oil or algae oil. These fatty acids are important components of cell membranes.",
      effect: "Support normal cardiovascular function and may influence recovery processes.",
      dose: "1-2 g of EPA+DHA per day",
      timing: "With meals",
      naturalAlternatives: [
        { product: "Mackerel", amount: "100-150 g = approximately 1.5-3 g of EPA+DHA" },
        { product: "Herring", amount: "100-150 g = approximately 1.5-3 g of EPA+DHA" },
        { product: "Salmon", amount: "150 g = approximately 1.5-3 g of EPA+DHA" },
        { product: "Sardines", amount: "150 g = approximately 1.5-2.5 g of EPA+DHA" }
      ],
      warnings: "High doses should not be used without a clear need. Pay attention to the actual EPA and DHA content rather than the total fish oil weight.",
      research: "EPA and DHA have been extensively studied for cardiovascular health, while their effects on athletic performance remain less certain."
    },

    magnesium: {
      shortDesc: "Essential mineral for muscle and nerve function",
      whatIs: "Magnesium is an essential mineral involved in hundreds of enzymatic reactions. It is required for normal muscle function, nervous system activity, and energy metabolism.",
      effect: "Helps maintain normal muscle function. Additional benefits are most likely when dietary magnesium intake is insufficient.",
      dose: "200-350 mg of elemental magnesium per day from supplements",
      timing: "With food, often in the evening",
      naturalAlternatives: [
        { product: "Pumpkin seeds", amount: "50 g = approximately 250 mg of magnesium" },
        { product: "Almonds", amount: "50 g = approximately 130 mg of magnesium" },
        { product: "Cooked buckwheat", amount: "300 g = approximately 150 mg of magnesium" },
        { product: "Spinach", amount: "200 g cooked = a significant source of magnesium" }
      ],
      warnings: "High doses of certain magnesium forms may cause diarrhea. Always check the amount of elemental magnesium.",
      research: "Supplementation is most beneficial when magnesium intake is insufficient or deficiency is present. Significant improvements in athletic performance are not guaranteed in individuals with adequate intake."
    },

    zinc: {
      shortDesc: "Essential mineral for metabolism and immune function",
      whatIs: "Zinc is an essential trace mineral involved in numerous enzyme systems. It is necessary for normal protein metabolism and immune function.",
      effect: "Correcting zinc deficiency helps maintain normal physiological processes, but excessive zinc intake does not increase muscle growth.",
      dose: "10-15 mg per day",
      timing: "With meals",
      naturalAlternatives: [
        { product: "Oysters", amount: "50-100 g = an exceptionally rich source of zinc" },
        { product: "Beef", amount: "150 g = approximately 6-10 mg of zinc" },
        { product: "Pumpkin seeds", amount: "50 g = approximately 3-4 mg of zinc" },
        { product: "Cheese", amount: "100 g = approximately 3-4 mg of zinc" }
      ],
      warnings: "Long-term intake of high doses may interfere with copper metabolism. Avoid regularly exceeding recommended amounts without a clear need.",
      research: "Zinc is essential for health, but supplementation beyond physiological requirements has not consistently been shown to increase strength or testosterone levels."
    },

    vitamin_c: {
      shortDesc: "Antioxidant essential for the body's collagen synthesis",
      whatIs: "A water-soluble vitamin involved in antioxidant defense and collagen synthesis. The human body cannot produce it on its own.",
      effect: "Supports normal connective tissue function and helps meet daily vitamin C requirements.",
      dose: "100-500 mg per day",
      timing: "Any time, with food",
      naturalAlternatives: [
        { product: "Red bell pepper", amount: "100 g = approximately 120-150 mg of vitamin C" },
        { product: "Kiwi", amount: "2 fruits = approximately 120-150 mg of vitamin C" },
        { product: "Oranges", amount: "2 fruits = approximately 100-140 mg of vitamin C" },
        { product: "Blackcurrants", amount: "100 g = approximately 150-200 mg of vitamin C" }
      ],
      warnings: "Very high doses may cause gastrointestinal discomfort. Megadoses generally provide no additional athletic performance benefits.",
      research: "Vitamin C is essential for health, but high-dose supplementation in people without deficiency has not consistently improved athletic performance."
    },

    multivitamin: {
      shortDesc: "Combination of vitamins and minerals for nutritional support",
      whatIs: "Multivitamins combine various vitamins and minerals in a single product. Ingredients and dosages vary considerably between manufacturers.",
      effect: "May help address specific nutritional gaps but cannot replace a varied and balanced diet.",
      dose: "1 serving according to the manufacturer's instructions",
      timing: "With a main meal",
      naturalAlternatives: [
        { product: "Colorful vegetables", amount: "400-500 g per day = a broad range of micronutrients" },
        { product: "Fruits and berries", amount: "200-300 g per day = vitamins and polyphenols" },
        { product: "Nuts and seeds", amount: "30-50 g = minerals and vitamin E" },
        { product: "Fish", amount: "150-200 g several times per week = various vitamins and minerals" },
        { product: "Eggs", amount: "2-3 eggs = a wide range of micronutrients" }
      ],
      warnings: "Avoid products containing excessively high doses of individual vitamins or minerals. Taking multiple supplements together increases the risk of exceeding nutritional requirements.",
      research: "Multivitamins may help correct insufficient micronutrient intake but do not directly increase strength or muscle mass."
    },

    glucosamine: {
      shortDesc: "Connective tissue compound with mixed evidence",
      whatIs: "Glucosamine is a substance involved in the structure of connective tissue. Glucosamine sulfate is commonly used in supplements.",
      effect: "Does not directly improve athletic performance. Evidence regarding its effects on perceived joint comfort is inconsistent.",
      dose: "1500 mg per day",
      timing: "With meals; may be divided into several doses",
      naturalAlternatives: [
        { product: "Bone broth", amount: "300-500 ml = a source of connective tissue components" },
        { product: "Meat aspic", amount: "150-200 g = a source of gelatin and connective tissue amino acids" },
        { product: "Chicken cartilage", amount: "50-100 g = a natural source of cartilage components" }
      ],
      warnings: "Individual responses vary, and benefits are not guaranteed. Consider the source of ingredients if you have food allergies.",
      research: "Research findings are mixed, and convincing evidence of athletic performance benefits in healthy individuals is lacking."
    },

    chondroitin: {
      shortDesc: "Cartilage component for joint support",
      whatIs: "Chondroitin is a naturally occurring component of cartilage. It is often combined with glucosamine in sports supplements.",
      effect: "Does not directly improve strength or endurance. Potential benefits for perceived joint comfort are not experienced by everyone.",
      dose: "800-1200 mg per day",
      timing: "Daily, with meals",
      naturalAlternatives: [
        { product: "Meat aspic", amount: "150-200 g = a source of connective tissue components" },
        { product: "Bone broth", amount: "300-500 ml = a source of cartilage and collagen components" },
        { product: "Cartilage-rich cuts of meat", amount: "100-150 g = natural connective tissue components" }
      ],
      warnings: "Benefits may be small or absent. Supplements should not replace appropriate management of training loads.",
      research: "Studies have produced mixed results, and evidence supporting improvements in athletic performance remains weak."
    },

    collagen: {
      shortDesc: "Connective tissue peptides for ligaments and tendons",
      whatIs: "Hydrolyzed collagen contains peptides and amino acids commonly found in connective tissue, including glycine and proline. It is not a complete replacement for dietary protein.",
      effect: "May support the synthesis of connective tissue components when combined with physical loading.",
      dose: "10-15 g",
      timing: "Daily, often 30-60 minutes before exercise",
      naturalAlternatives: [
        { product: "Gelatin", amount: "10-15 g = a source of collagen-related amino acids" },
        { product: "Meat aspic", amount: "150-200 g = a source of gelatin and collagen" },
        { product: "Bone broth", amount: "300-500 ml = a source of collagen components" },
        { product: "Chicken skin", amount: "50-100 g = a dietary source of collagen" }
      ],
      warnings: "Collagen should not replace complete protein sources for muscle growth. Consider the source of ingredients if you have allergies.",
      research: "Some evidence suggests potential benefits for connective tissue, but outcomes depend on mechanical loading and overall nutrition."
    },

    caffeine_pre_workout: {
      shortDesc: "Stimulant for focus, strength, and endurance",
      whatIs: "Caffeine blocks adenosine receptors and reduces the perception of fatigue. It is one of the most extensively studied ergogenic stimulants.",
      effect: "May improve alertness, strength performance, aerobic performance, and perceived exertion.",
      dose: "1-3 mg/kg of body weight",
      timing: "30-60 minutes before a workout",
      naturalAlternatives: [
        { product: "Coffee", amount: "1-2 cups = approximately 80-200 mg of caffeine" },
        { product: "Espresso", amount: "2 shots = approximately 100-160 mg of caffeine" },
        { product: "Black tea", amount: "3 cups = approximately 100-150 mg of caffeine" },
        { product: "Matcha", amount: "2-4 g = approximately 40-140 mg of caffeine" }
      ],
      warnings: "May disrupt sleep and cause anxiety, tremors, or palpitations. Individual sensitivity to caffeine varies considerably.",
      research: "Caffeine has strong scientific support for improving several measures of athletic performance."
    },

    beta_alanine_pre_workout: {
      shortDesc: "Increases carnosine for high-intensity exercise",
      whatIs: "Regular beta-alanine supplementation increases carnosine levels in muscle tissue. Its effects depend on sustained intake, so taking a single dose immediately before exercise is not the main factor.",
      effect: "May improve the ability to perform intense exercise, particularly efforts of moderate duration.",
      dose: "3.2-6.4 g per day",
      timing: "Daily, regardless of workout timing",
      naturalAlternatives: [
        { product: "Chicken breast", amount: "200 g = a source of carnosine" },
        { product: "Turkey", amount: "200 g = a source of carnosine" },
        { product: "Beef", amount: "200 g = a source of carnosine" },
        { product: "Pork", amount: "200 g = a source of carnosine" }
      ],
      warnings: "May cause temporary skin tingling. Dividing the daily dose can help reduce this effect.",
      research: "Regular supplementation increases muscle carnosine concentrations and may improve certain measures of high-intensity exercise performance."
    },

    citrulline: {
      shortDesc: "Arginine precursor for blood flow and exercise performance",
      whatIs: "Citrulline is an amino acid that the body converts into arginine, supporting nitric oxide production. It is commonly used on its own or as citrulline malate.",
      effect: "May improve blood flow and, in some cases, increase the amount of training work performed.",
      dose: "3-6 g of L-citrulline or 6-8 g of citrulline malate",
      timing: "30-60 minutes before a workout",
      naturalAlternatives: [
        { product: "Watermelon", amount: "500-1000 g = a natural source of citrulline" },
        { product: "Watermelon juice", amount: "500-750 ml = a source of citrulline" },
        { product: "Pumpkin", amount: "300-500 g = a small source of citrulline" },
        { product: "Cucumber", amount: "300-500 g = a small source of related amino acid compounds" }
      ],
      warnings: "Large single doses may cause gastrointestinal discomfort. Effects on exercise performance vary between individuals.",
      research: "Some studies report improvements in repeated resistance exercise performance and blood flow, but findings are less consistent than those for creatine or caffeine."
    },

    zma: {
      shortDesc: "Combination of zinc, magnesium, and vitamin B6",
      whatIs: "ZMA combines magnesium, zinc, and vitamin B6. It is primarily intended to help meet requirements for these micronutrients.",
      effect: "May be useful when magnesium or zinc intake is insufficient, but it is not a proven testosterone booster.",
      dose: "Typically 200-400 mg of magnesium and 10-30 mg of zinc, depending on the formulation",
      timing: "In the evening, according to the manufacturer's instructions",
      naturalAlternatives: [
        { product: "Pumpkin seeds", amount: "50 g = magnesium and zinc" },
        { product: "Beef", amount: "150 g = a rich source of zinc and vitamin B6" },
        { product: "Almonds", amount: "50 g = a source of magnesium" },
        { product: "Buckwheat", amount: "250-300 g cooked = a source of magnesium and B vitamins" }
      ],
      warnings: "Account for magnesium and zinc obtained from other supplements. Excessive long-term zinc intake should be avoided.",
      research: "There is no convincing evidence that ZMA increases testosterone, strength, or muscle mass in individuals without mineral deficiencies."
    },

    glycine: {
      shortDesc: "Amino acid for connective tissue and recovery",
      whatIs: "Glycine is an amino acid and an important component of collagen. The body can produce it naturally and also obtains it from protein-containing foods.",
      effect: "May contribute to connective tissue maintenance. Some studies have also investigated its effects on subjective sleep quality.",
      dose: "3-5 g",
      timing: "In the evening or before bedtime",
      naturalAlternatives: [
        { product: "Gelatin", amount: "10-15 g = a rich source of glycine" },
        { product: "Meat aspic", amount: "150-200 g = a source of glycine" },
        { product: "Bone broth", amount: "300-500 ml = a source of collagen-related amino acids" },
        { product: "Connective tissue-rich meat", amount: "150-200 g = a source of glycine" }
      ],
      warnings: "High doses may cause gastrointestinal discomfort. Glycine is not a direct muscle-building supplement.",
      research: "Preliminary studies suggest potential benefits for certain sleep-related outcomes, but the evidence is considerably weaker than that supporting major sports supplements."
    },

    tribulus_terrestris: {
      shortDesc: "Herbal extract without proven anabolic benefits",
      whatIs: "Tribulus terrestris is a plant extract commonly marketed as a natural testosterone booster. It contains various saponins and other plant compounds.",
      effect: "In healthy, resistance-trained men, it generally does not produce convincing increases in testosterone, strength, or muscle mass.",
      dose: "500-1500 mg of extract per day",
      timing: "With meals, according to the manufacturer's instructions",
      naturalAlternatives: [
        { product: "Eggs", amount: "2-4 eggs = protein, fats, and micronutrients for a balanced diet" },
        { product: "Beef", amount: "150-200 g = protein and zinc" },
        { product: "Pumpkin seeds", amount: "30-50 g = a source of zinc and magnesium" },
        { product: "Fatty fish", amount: "150-200 g = protein, vitamin D, and omega-3 fatty acids" }
      ],
      warnings: "Do not expect effects comparable to hormone medications. The quality and standardization of herbal extracts may vary.",
      research: "Most studies in healthy, physically active individuals do not confirm meaningful improvements in testosterone levels or athletic performance."
    },

    d_aspartic_acid: {
      shortDesc: "Amino acid compound with conflicting scientific evidence",
      whatIs: "D-aspartic acid is a form of aspartic acid involved in certain physiological signaling processes. It is commonly marketed as a natural testosterone booster.",
      effect: "Consistent increases in testosterone, strength, or muscle mass have not been demonstrated in resistance-trained individuals.",
      dose: "3 g per day",
      timing: "Once daily, according to the product instructions",
      naturalAlternatives: [
        { product: "Eggs", amount: "3-4 eggs = a source of protein-bound aspartic acid" },
        { product: "Beef", amount: "150-200 g = a source of aspartic acid and complete protein" },
        { product: "Chicken", amount: "150-200 g = a source of amino acids" },
        { product: "Fish", amount: "150-200 g = a complete amino acid profile" }
      ],
      warnings: "Should not be considered a proven method of increasing testosterone. Higher doses do not guarantee greater effects.",
      research: "Early studies reported promising findings, but subsequent research in resistance-trained men has not confirmed consistent increases in testosterone or strength."
    }
  }
};
// ============================================
// SUPPLEMENTS TRANSLATIONS — HELPERS
// ============================================

function getSupplementTranslation(supplementId) {
    if (currentLang === 'ru') return null;
    if (typeof supplementsTranslations === 'undefined') return null;
    return supplementsTranslations.en[supplementId] || null;
}

function getSupplementField(supplement, field) {
    const tr = getSupplementTranslation(supplement.id);
    if (!tr) return supplement[field];
    return tr[field] || supplement[field];
}

function getSupplementAlternatives(supplement) {
    const tr = getSupplementTranslation(supplement.id);
    if (!tr || !tr.naturalAlternatives) return supplement.naturalAlternatives;
    return tr.naturalAlternatives;
}

function getSupplementName(supplement) {
    if (currentLang === 'en' && supplement.nameEn) return supplement.nameEn;
    return supplement.name;
}