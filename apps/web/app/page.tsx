import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Neetrino Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Современная платформа для поиска и просмотра демо-сайтов с автоматическим импортом и проверкой доступности
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/catalog"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Каталог демо
            </Link>
            <Link 
              href="/admin"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-block"
            >
              Админ-панель
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Масштабируемость</h3>
            <p className="text-gray-600">50,000+ демо с перспективой до 100,000+</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Автоматический импорт</h3>
            <p className="text-gray-600">CSV импорт с DIFF-интерфейсом</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Проверка доступности</h3>
            <p className="text-gray-600">Автоматические проверки с автоудалением неработающих демо</p>
          </div>
        </div>
      </div>
    </main>
  )
}
