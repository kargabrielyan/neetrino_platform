// Простой тест импорта
const { demoData } = require('./lib/demo-data.ts');

console.log('Testing demo-data import...');
console.log('demoData:', demoData);
console.log('getAll method:', typeof demoData.getAll);
console.log('delete method:', typeof demoData.delete);

// Тест удаления
console.log('Before delete - total demos:', demoData.getAll().length);
const result = demoData.delete('1');
console.log('Delete result:', result);
console.log('After delete - total demos:', demoData.getAll().length);
