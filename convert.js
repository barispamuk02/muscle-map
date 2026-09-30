// convert.js — устойчивый конвертер (FIX)
const fs = require('fs');

let raw = fs.readFileSync('exercise-name-ru.json', 'utf8').trim();

// Убираем BOM
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);

// Убираем [ в начале и ] в конце
raw = raw.replace(/^\s*\[/, '').replace(/\]\s*$/, '');

// Убираем trailing comma
raw = raw.replace(/,\s*$/, '');

// Разбиваем на строки
const lines = raw.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

const items = [];
const broken = [];

for (let line of lines) {
    // Убираем запятую в конце
    line = line.replace(/,\s*$/, '');
    
    // Пропускаем пустые
    if (!line) continue;
    
    try {
        const obj = JSON.parse(line);
        if (obj.en && obj.ru) items.push(obj);
    } catch (e) {
        broken.push(line);
    }
}

console.log('📊 Всего строк:', lines.length);
console.log('✅ Успешно:', items.length);
console.log('❌ Битых:', broken.length);

if (broken.length > 0) {
    console.log('\n❌ Первые 5 битых:');
    broken.slice(0, 5).forEach(l => console.log('  ', l.slice(0, 80)));
}

// Генерируем JS
const out = `// Автоматически сгенерированный файл
// Всего переводов: ${items.length}

const exerciseNameRU = {
${items.map(item => `    ${JSON.stringify(item.en)}: ${JSON.stringify(item.ru)}`).join(',\n')}
};
`;

fs.writeFileSync('exercise-name-ru.js', out);
console.log('\n✅ Файл exercise-name-ru.js создан!');
console.log('📊 Первый ключ:', items[0]?.en);
console.log('📊 Последний ключ:', items[items.length - 1]?.en);