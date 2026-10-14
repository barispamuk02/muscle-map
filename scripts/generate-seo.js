// ============================================
// SEO-генератор для Muscle Map
// Запуск: node scripts/generate-seo.js
// ============================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'seo');

// Загрузка данных
function loadData() {
    const muscleDataRaw = fs.readFileSync(path.join(ROOT, 'muscle-data.js'), 'utf8');
    const exerciseDataRaw = fs.readFileSync(path.join(ROOT, 'exercise-data.js'), 'utf8');
    const muscleTranslationsRaw = fs.readFileSync(path.join(ROOT, 'muscle-translations.js'), 'utf8');
    const exerciseNameRURaw = fs.readFileSync(path.join(ROOT, 'exercise-name-ru.js'), 'utf8');
    const customExercisesRaw = fs.readFileSync(path.join(ROOT, 'custom-exercises.js'), 'utf8');

    const muscleDatabase = eval(muscleDataRaw.replace(/^const\s+muscleDatabase\s*=/, '') + '; muscleDatabase');
    const exerciseDatabase = eval(exerciseDataRaw.replace(/^const\s+exerciseDatabase\s*=/, '') + '; exerciseDatabase');
    const muscleTranslations = eval(muscleTranslationsRaw.replace(/^const\s+muscleTranslations\s*=/, '') + '; muscleTranslations');
    const exerciseNameRU = eval(exerciseNameRURaw.replace(/^const\s+exerciseNameRU\s*=/, '') + '; exerciseNameRU');
    const customExercises = eval(customExercisesRaw.replace(/^const\s+customExercises\s*=/, '') + '; customExercises');

    return { muscleDatabase, exerciseDatabase, muscleTranslations, exerciseNameRU, customExercises };
}

// Утилита: slug из английского имени
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Утилита: экранирование HTML
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Общий шаблон страницы
function renderPage({ title, description, canonical, hreflangRu, hreflangEn, content }) {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${canonical}">
    <link rel="alternate" hreflang="ru" href="${hreflangRu}">
    <link rel="alternate" hreflang="en" href="${hreflangEn}">
    <link rel="alternate" hreflang="x-default" href="${hreflangRu}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="https://muscle-map.app/icons/icon-512.png">
    
    <!-- Schema.org -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${escapeHtml(title)}",
        "description": "${escapeHtml(description)}",
        "url": "${canonical}",
        "publisher": {
            "@type": "Organization",
            "name": "Muscle Map",
            "url": "https://muscle-map.app/"
        }
    }
    </script>
    
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: #0a0a12;
            color: #e8e8f0;
            line-height: 1.6;
            padding: 20px;
        }
        .container { max-width: 800px; margin: 0 auto; }
        header { padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 30px; }
        header a { color: #6fb3ff; text-decoration: none; font-weight: 600; }
        h1 { font-size: 2em; margin-bottom: 8px; color: #fff; }
        h2 { font-size: 1.4em; margin: 24px 0 12px; color: #6fb3ff; }
        h3 { font-size: 1.1em; margin: 16px 0 8px; color: #e8e8f0; }
        .latin { font-style: italic; color: #8a8aa8; margin-bottom: 16px; }
        .meta { color: #8a8aa8; font-size: 0.9em; margin-bottom: 20px; }
        .card {
            background: #12122a;
            border: 1px solid rgba(111,179,255,0.15);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
        }
        .card img { max-width: 100%; border-radius: 8px; margin-bottom: 12px; }
        .exercise-link {
            display: block;
            padding: 12px 16px;
            background: #1a1a3a;
            border: 1px solid rgba(111,179,255,0.2);
            border-radius: 8px;
            color: #e8e8f0;
            text-decoration: none;
            margin-bottom: 8px;
            transition: all 0.2s;
        }
        .exercise-link:hover {
            background: #22224a;
            border-color: #6fb3ff;
            transform: translateX(4px);
        }
        ol, ul { padding-left: 24px; margin: 12px 0; }
        ol li, ul li { margin-bottom: 8px; }
        .cta {
            display: inline-block;
            padding: 14px 28px;
            background: linear-gradient(135deg, #6fb3ff, #5a9fee);
            color: #fff;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 700;
            margin-top: 24px;
            transition: transform 0.2s;
        }
        .cta:hover { transform: scale(1.05); }
        .attribution { font-size: 0.8em; color: #5a5a7a; margin-top: 16px; }
        footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #8a8aa8; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <a href="https://muscle-map.app/">💪 Muscle Map</a>
        </header>
        ${content}
        <footer>
            <p><a href="https://muscle-map.app/" style="color: #6fb3ff;">Открыть Muscle Map</a></p>
            <p>© 2026 Muscle Map</p>
        </footer>
    </div>
</body>
</html>`;
}

// Генератор страницы мышцы
function generateMusclePage(muscleId, muscle, translation, exercises, exerciseNameRU, customExercises) {
    const ruName = muscle.name;
    const latinName = muscle.latin || translation?.en?.name || '';
    const ruDesc = muscle.description;
    const ruFunc = muscle.function;

    // Упражнения из базы
    let exerciseList = exercises.filter(e => e.muscleId === muscleId);

    // + custom-упражнения
    if (customExercises && customExercises[muscleId]) {
        const custom = customExercises[muscleId];
        if (custom.primary && Array.isArray(custom.primary)) {
            custom.primary.forEach(ex => {
                exerciseList.push({
                    id: 'custom_' + muscleId + '_' + ex.name,
                    name: ex.name,
                    name_en: ex.name,
                    isCustom: true
                });
            });
        }
        if (custom.secondary && Array.isArray(custom.secondary)) {
            custom.secondary.forEach(ex => {
                exerciseList.push({
                    id: 'custom_' + muscleId + '_' + ex.name,
                    name: ex.name,
                    name_en: ex.name,
                    isCustom: true
                });
            });
        }
    }

    const exerciseLinks = exerciseList.slice(0, 30).map(e => {
        const slug = slugify(e.name_en || e.id || e.name);
        const ruExName = exerciseNameRU[e.name_en?.toLowerCase()] || e.name;
        return `<a href="../../exercises/${slug}/" class="exercise-link">${escapeHtml(ruExName)}</a>`;
    }).join('');

    const content = `
        <h1>${escapeHtml(ruName)}</h1>
        ${latinName ? `<p class="latin">${escapeHtml(latinName)}</p>` : ''}
        <p class="meta">${escapeHtml(muscle.group)} · ${exerciseList.length} упражнений</p>
        
        <div class="card">
            <p>${escapeHtml(ruDesc)}</p>
            <p style="margin-top: 12px;"><strong>Функция:</strong> ${escapeHtml(ruFunc)}</p>
        </div>

        <h2>Упражнения для ${escapeHtml(ruName)}</h2>
        ${exerciseLinks || '<p>Упражнения загружаются...</p>'}

        <a href="https://muscle-map.app/?muscle=${muscleId}" class="cta">Открыть в Muscle Map →</a>
    `;

    return renderPage({
        title: `${ruName} — упражнения, техника, анатомия | Muscle Map`,
        description: `${ruDesc} Упражнения и техника выполнения.`,
        canonical: `https://muscle-map.app/muscles/${muscleId}/`,
        hreflangRu: `https://muscle-map.app/muscles/${muscleId}/`,
        hreflangEn: `https://muscle-map.app/en/muscles/${muscleId}/`,
        content
    });
}

// Генератор страницы упражнения
function generateExercisePage(ex, exerciseNameRU) {
    const slug = slugify(ex.name_en || ex.id);
    const ruName = exerciseNameRU[ex.name_en?.toLowerCase()] || ex.name;
    const enName = ex.name_en || ex.name;
    const instructions = ex.instruction_steps_ru || [];
    const fullText = ex.instructions_ru || '';

    const stepsHtml = instructions.map(s => `<li>${escapeHtml(s)}</li>`).join('');
    const imageHtml = ex.image ? `<img src="https://muscle-map.app/${ex.image}" alt="${escapeHtml(ruName)}" loading="lazy">` : '';
    const gifHtml = ex.gif ? `<img src="https://muscle-map.app/${ex.gif}" alt="${escapeHtml(ruName)} (GIF)" loading="lazy">` : '';

    const content = `
        <h1>${escapeHtml(ruName)}</h1>
        <p class="latin">${escapeHtml(enName)}</p>
        <p class="meta">${escapeHtml(ex.equipment)} · ${escapeHtml(ex.target)}</p>

        <div class="card">
            ${gifHtml || imageHtml}
            <p>${escapeHtml(fullText)}</p>
        </div>

        <h2>Техника выполнения</h2>
        <ol>${stepsHtml}</ol>

        <a href="https://muscle-map.app/?exercise=${ex.id}" class="cta">Открыть в Muscle Map →</a>

        <p class="attribution">${escapeHtml(ex.attribution || '')}</p>
    `;

    return renderPage({
        title: `${ruName} — техника выполнения | Muscle Map`,
        description: `${ruName}: техника выполнения, ошибки, мышцы в работе.`,
        canonical: `https://muscle-map.app/exercises/${slug}/`,
        hreflangRu: `https://muscle-map.app/exercises/${slug}/`,
        hreflangEn: `https://muscle-map.app/en/exercises/${slug}/`,
        content
    });
}

// Главная функция
function main() {
    console.log('🚀 SEO-генератор запущен...');

    const { muscleDatabase, exerciseDatabase, muscleTranslations, exerciseNameRU, customExercises } = loadData();

    console.log(`📊 Мышц: ${Object.keys(muscleDatabase).length}`);
    console.log(`📊 Упражнений: ${exerciseDatabase.length}`);

    // Создаём выходные папки
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
    if (!fs.existsSync(path.join(OUTPUT_DIR, 'muscles'))) fs.mkdirSync(path.join(OUTPUT_DIR, 'muscles'));
    if (!fs.existsSync(path.join(OUTPUT_DIR, 'exercises'))) fs.mkdirSync(path.join(OUTPUT_DIR, 'exercises'));

    // Генерируем страницы мышц
    let muscleCount = 0;
    Object.entries(muscleDatabase).forEach(([id, muscle]) => {
        const dir = path.join(OUTPUT_DIR, 'muscles', id);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        const translation = muscleTranslations[id];
       const html = generateMusclePage(id, muscle, translation, exerciseDatabase, exerciseNameRU, customExercises);
        fs.writeFileSync(path.join(dir, 'index.html'), html);
        muscleCount++;
    });
    console.log(`✅ Сгенерировано страниц мышц: ${muscleCount}`);

    // Генерируем страницы упражнений (первые 30 для теста)
    let exerciseCount = 0;
    exerciseDatabase.slice(0, 30).forEach(ex => {
        const slug = slugify(ex.name_en || ex.id);
        const dir = path.join(OUTPUT_DIR, 'exercises', slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        const html = generateExercisePage(ex, exerciseNameRU);
        fs.writeFileSync(path.join(dir, 'index.html'), html);
        exerciseCount++;
    });
    console.log(`✅ Сгенерировано страниц упражнений: ${exerciseCount}`);

    // Генерируем sitemap
    const urls = [];
    Object.keys(muscleDatabase).forEach(id => {
        urls.push(`https://muscle-map.app/muscles/${id}/`);
    });
    exerciseDatabase.slice(0, 30).forEach(ex => {
        const slug = slugify(ex.name_en || ex.id);
        urls.push(`https://muscle-map.app/exercises/${slug}/`);
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `    <url><loc>${url}</loc><lastmod>2026-10-14</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(ROOT, 'sitemap-seo.xml'), sitemap);
    console.log(`✅ Sitemap сохранён: sitemap-seo.xml (${urls.length} URL)`);

    console.log('🎉 Готово!');
}

main();