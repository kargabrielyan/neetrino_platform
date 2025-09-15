import Link from 'next/link';

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Каталог демо</h1>
            <p className="text-gray-600 mt-2">Найдите идеальное демо для вашего проекта</p>
          </div>
          <Link 
            href="/"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Назад
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">Фильтры</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
              <input 
                type="text" 
                placeholder="Введите название..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Вендор</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Все вендоры</option>
                <option>ThemeForest</option>
                <option>TemplateMonster</option>
                <option>Creative Market</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Все категории</option>
                <option>Бизнес</option>
                <option>Портфолио</option>
                <option>E-commerce</option>
                <option>Блог</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Активные</option>
                <option>Черновики</option>
                <option>Все</option>
              </select>
            </div>
          </div>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Demo Card 1 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Demo Preview</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">ThemeForest</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Активно</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Modern Business Template</h3>
              <p className="text-gray-600 text-sm mb-4">Современный шаблон для бизнеса с адаптивным дизайном</p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                  Смотреть
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50 transition-colors">
                  Открыть
                </button>
              </div>
            </div>
          </div>

          {/* Demo Card 2 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Demo Preview</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">TemplateMonster</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Активно</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Portfolio Showcase</h3>
              <p className="text-gray-600 text-sm mb-4">Элегантное портфолио для креативных профессионалов</p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                  Смотреть
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50 transition-colors">
                  Открыть
                </button>
              </div>
            </div>
          </div>

          {/* Demo Card 3 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Demo Preview</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Creative Market</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Черновик</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">E-commerce Store</h3>
              <p className="text-gray-600 text-sm mb-4">Полнофункциональный интернет-магазин</p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                  Смотреть
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50 transition-colors">
                  Открыть
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">←</button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">→</button>
          </div>
        </div>
      </div>
    </main>
  );
}
