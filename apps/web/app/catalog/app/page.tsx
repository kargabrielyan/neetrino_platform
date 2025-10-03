import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'App Catalog - Neetrino',
  description: 'Browse our collection of mobile app demos and templates',
};

export default function AppCatalogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            App Catalog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore innovative mobile app demos and templates for iOS and Android
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder cards */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Mobile App Demo {item}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  A sleek and functional mobile app template for your next project.
                </p>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200">
                  View Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
