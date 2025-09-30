import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';

interface Demo {
  id: string;
  title: string;
  description: string;
  url: string;
  normalizedUrl: string;
  category: string;
  subcategory?: string;
  imageUrl: string;
  status: string;
  vendorId: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

let demos: Demo[] = [];

// Загружаем демо из файла
function loadDemos(): void {
  const demosFilePath = path.join(__dirname, '..', '..', '..', '..', 'data', 'demos.json');
  
  if (fs.existsSync(demosFilePath)) {
    try {
      const data = fs.readFileSync(demosFilePath, 'utf8');
      demos = JSON.parse(data);
      console.log(`📚 Загружено ${demos.length} демо из файла`);
    } catch (error) {
      console.error('Ошибка при загрузке демо:', error);
      demos = [];
    }
  } else {
    console.log('Файл с демо не найден');
    demos = [];
  }
}

// Создаем Express приложение
const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoints
app.get('/api/demos', (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const category = req.query.category as string;
  const search = req.query.search as string;
  
  let filteredDemos = demos;
  
  // Фильтрация по категории
  if (category) {
    filteredDemos = filteredDemos.filter(demo => 
      demo.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  // Поиск по названию
  if (search) {
    filteredDemos = filteredDemos.filter(demo => 
      demo.title.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Пагинация
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedDemos = filteredDemos.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedDemos,
    total: filteredDemos.length,
    page,
    limit,
    totalPages: Math.ceil(filteredDemos.length / limit)
  });
});

app.get('/api/demos/:id', (req, res) => {
  const demo = demos.find(d => d.id === req.params.id);
  if (!demo) {
    return res.status(404).json({ error: 'Demo not found' });
  }
  res.json(demo);
});

app.get('/api/categories', (req, res) => {
  const categories = [...new Set(demos.map(demo => demo.category))].sort();
  res.json(categories);
});

app.get('/api/stats', (req, res) => {
  const stats = {
    totalDemos: demos.length,
    categories: [...new Set(demos.map(demo => demo.category))].length,
    activeDemos: demos.filter(demo => demo.status === 'active').length,
    totalVendors: [...new Set(demos.map(demo => demo.vendorId))].length
  };
  res.json(stats);
});

// Статический файл для просмотра
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Neetrino Platform - Каталог демо</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: #f5f5f5;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            .header {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }
            .stat-card {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
            }
            .stat-number {
                font-size: 2em;
                font-weight: bold;
                color: #2563eb;
            }
            .filters {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .filter-group {
                display: flex;
                gap: 15px;
                align-items: center;
                flex-wrap: wrap;
            }
            .filter-group input, .filter-group select {
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            .demo-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }
            .demo-card {
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: transform 0.2s;
            }
            .demo-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }
            .demo-image {
                width: 100%;
                height: 200px;
                object-fit: cover;
            }
            .demo-content {
                padding: 15px;
            }
            .demo-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #1f2937;
            }
            .demo-category {
                color: #6b7280;
                font-size: 14px;
                margin-bottom: 8px;
            }
            .demo-url {
                color: #2563eb;
                text-decoration: none;
                font-size: 14px;
            }
            .demo-url:hover {
                text-decoration: underline;
            }
            .pagination {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 20px;
            }
            .pagination button {
                padding: 8px 12px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 4px;
                cursor: pointer;
            }
            .pagination button:hover {
                background: #f5f5f5;
            }
            .pagination button.active {
                background: #2563eb;
                color: white;
                border-color: #2563eb;
            }
            .loading {
                text-align: center;
                padding: 40px;
                color: #6b7280;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Neetrino Platform - Каталог демо</h1>
                <p>Просмотр импортированных товаров из CSV файла</p>
            </div>
            
            <div class="stats" id="stats">
                <div class="loading">Загрузка статистики...</div>
            </div>
            
            <div class="filters">
                <div class="filter-group">
                    <input type="text" id="search" placeholder="Поиск по названию..." />
                    <select id="category">
                        <option value="">Все категории</option>
                    </select>
                    <button onclick="loadDemos()">Поиск</button>
                </div>
            </div>
            
            <div id="demos" class="loading">
                Загрузка демо...
            </div>
            
            <div class="pagination" id="pagination"></div>
        </div>

        <script>
            let currentPage = 1;
            let currentCategory = '';
            let currentSearch = '';

            async function loadStats() {
                try {
                    const response = await fetch('/api/stats');
                    const stats = await response.json();
                    
                    document.getElementById('stats').innerHTML = \`
                        <div class="stat-card">
                            <div class="stat-number">\${stats.totalDemos.toLocaleString()}</div>
                            <div>Всего демо</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">\${stats.categories}</div>
                            <div>Категорий</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">\${stats.activeDemos.toLocaleString()}</div>
                            <div>Активных</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">\${stats.totalVendors}</div>
                            <div>Вендоров</div>
                        </div>
                    \`;
                } catch (error) {
                    console.error('Ошибка загрузки статистики:', error);
                }
            }

            async function loadCategories() {
                try {
                    const response = await fetch('/api/categories');
                    const categories = await response.json();
                    
                    const select = document.getElementById('category');
                    select.innerHTML = '<option value="">Все категории</option>';
                    categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category;
                        option.textContent = category;
                        select.appendChild(option);
                    });
                } catch (error) {
                    console.error('Ошибка загрузки категорий:', error);
                }
            }

            async function loadDemos() {
                currentSearch = document.getElementById('search').value;
                currentCategory = document.getElementById('category').value;
                currentPage = 1;
                
                try {
                    const params = new URLSearchParams({
                        page: currentPage,
                        limit: 20,
                        ...(currentSearch && { search: currentSearch }),
                        ...(currentCategory && { category: currentCategory })
                    });
                    
                    const response = await fetch(\`/api/demos?\${params}\`);
                    const data = await response.json();
                    
                    displayDemos(data.data);
                    displayPagination(data.page, data.totalPages);
                } catch (error) {
                    console.error('Ошибка загрузки демо:', error);
                    document.getElementById('demos').innerHTML = '<div class="loading">Ошибка загрузки демо</div>';
                }
            }

            function displayDemos(demos) {
                if (demos.length === 0) {
                    document.getElementById('demos').innerHTML = '<div class="loading">Демо не найдены</div>';
                    return;
                }
                
                const demosHtml = demos.map(demo => \`
                    <div class="demo-card">
                        <img src="\${demo.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                             alt="\${demo.title}" class="demo-image" 
                             onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                        <div class="demo-content">
                            <div class="demo-title">\${demo.title}</div>
                            <div class="demo-category">\${demo.category}\${demo.subcategory ? ' > ' + demo.subcategory : ''}</div>
                            <a href="\${demo.url}" target="_blank" class="demo-url">Открыть демо →</a>
                        </div>
                    </div>
                \`).join('');
                
                document.getElementById('demos').innerHTML = \`<div class="demo-grid">\${demosHtml}</div>\`;
            }

            function displayPagination(page, totalPages) {
                if (totalPages <= 1) {
                    document.getElementById('pagination').innerHTML = '';
                    return;
                }
                
                let paginationHtml = '';
                
                // Предыдущая страница
                if (page > 1) {
                    paginationHtml += \`<button onclick="changePage(\${page - 1})">←</button>\`;
                }
                
                // Номера страниц
                for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
                    paginationHtml += \`<button class="\${i === page ? 'active' : ''}" onclick="changePage(\${i})">\${i}</button>\`;
                }
                
                // Следующая страница
                if (page < totalPages) {
                    paginationHtml += \`<button onclick="changePage(\${page + 1})">→</button>\`;
                }
                
                document.getElementById('pagination').innerHTML = paginationHtml;
            }

            function changePage(page) {
                currentPage = page;
                loadDemos();
            }

            // Обработчики событий
            document.getElementById('search').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    loadDemos();
                }
            });

            // Инициализация
            loadStats();
            loadCategories();
            loadDemos();
        </script>
    </body>
    </html>
  `);
});

// Запускаем сервер
function startServer() {
  loadDemos();
  
  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📊 Загружено ${demos.length} демо`);
    console.log(`🌐 Откройте http://localhost:${PORT} для просмотра каталога`);
  });
}

// Запускаем если файл вызван напрямую
if (require.main === module) {
  startServer();
}

export { startServer };
