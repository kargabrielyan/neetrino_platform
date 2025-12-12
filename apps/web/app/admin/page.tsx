'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import WordPressAdminLayout from '../../components/WordPressAdminLayout';
import WordPressDashboard from '../../components/WordPressDashboard';
import {
  Database,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Save,
  X,
  Download,
} from 'lucide-react';

// Интерфейс для Demo
interface Demo {
  id: string;
  title: string;
  description: string;
  url: string;
  status: 'active' | 'draft' | 'deleted';
  category: string;
  subcategory: string;
  imageUrl: string;
  screenshotUrl: string;
  viewCount: number;
  isAccessible: boolean;
  vendor: {
    id: string;
    name: string;
    website: string;
    logoUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');

  useEffect(() => {
    const tab = searchParams.get('tab') || 'dashboard';
    setActiveTab(tab);
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Состояния для модального окна
  const [showModal, setShowModal] = useState(false);
  const [editingDemo, setEditingDemo] = useState<Demo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    status: 'draft' as 'active' | 'draft' | 'deleted',
    category: '',
    subcategory: '',
    imageUrl: '',
    vendorName: '',
    vendorWebsite: '',
  });

  const tabs = [
    { id: 'demos', label: 'Demos', icon: Database },
  ];

  // Загрузка демо с API
  const fetchDemos = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery);
      if (statusFilter) params.append('status', statusFilter);

      // Сначала пробуем подключиться к NestJS API
      const nestApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      let response;
      
      try {
        console.log('🔄 Trying NestJS API:', `${nestApiUrl}/demos?${params.toString()}`);
        response = await fetch(`${nestApiUrl}/demos?${params.toString()}`);
        console.log('✅ NestJS API response status:', response.status);
        console.log('📋 NestJS API response headers:', Object.fromEntries(response.headers.entries()));
      } catch (nestError) {
        console.warn('⚠️ NestJS API unavailable, trying Next.js API:', nestError);
        console.log('🔄 Trying Next.js API:', `/api/admin/demos?${params.toString()}`);
        response = await fetch(`/api/admin/demos?${params.toString()}`);
        console.log('✅ Next.js API response status:', response.status);
        console.log('📋 Next.js API response headers:', Object.fromEntries(response.headers.entries()));
      }

      // Проверяем статус ответа
      if (!response.ok) {
        console.error('❌ API response not OK:', response.status, response.statusText);
        setDemos([]);
        return;
      }

      // Проверяем, есть ли контент для парсинга
      const contentType = response.headers.get('content-type');
      console.log('📋 Response Content-Type:', contentType);
      
      // Если Content-Type не установлен, пробуем парсить как JSON
      if (contentType && !contentType.includes('application/json') && !contentType.includes('text/plain')) {
        console.error('❌ Response is not JSON:', contentType);
        setDemos([]);
        return;
      }

      // Получаем текст ответа для проверки
      const responseText = await response.text();
      if (!responseText.trim()) {
        console.error('❌ Empty response from API');
        setDemos([]);
        return;
      }

      // Парсим JSON
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('✅ Successfully parsed JSON response');
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError);
        console.error('Response text:', responseText);
        
        // Если это не JSON, но статус 200, возможно это HTML страница ошибки
        if (responseText.includes('<html') || responseText.includes('<!DOCTYPE')) {
          console.error('❌ Received HTML instead of JSON - possible server error page');
        }
        
        setDemos([]);
        return;
      }

      if (result.data && Array.isArray(result.data)) {
        // Адаптируем ответ NestJS API
        setDemos(result.data);
      } else if (result.success) {
        setDemos(result.data);
      } else {
        console.error('Failed to fetch demos:', result.error);
        setDemos([]);
      }

    } catch (error) {
      console.error('Error in fetchDemos:', error);
      // Fallback данные для демонстрации
      setDemos([
        {
          id: '1',
          title: 'E-commerce Store',
          description: 'Modern online store with shopping cart',
          url: 'https://example-store.com',
          status: 'active',
          category: 'E-commerce',
          subcategory: 'Online Store',
          imageUrl: '/no image.png',
          screenshotUrl: '/no image.png',
          viewCount: 0,
          isAccessible: true,
          vendor: {
            id: 'temp-vendor-1',
            name: 'TechCorp',
            website: 'https://techcorp.com',
            logoUrl: '/no image.png'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Portfolio Website',
          description: 'Creative portfolio for designers',
          url: 'https://example-portfolio.com',
          status: 'draft',
          category: 'Portfolio',
          subcategory: 'Creative',
          imageUrl: '/no image.png',
          screenshotUrl: '/no image.png',
          viewCount: 0,
          isAccessible: true,
          vendor: {
            id: 'temp-vendor-2',
            name: 'DesignStudio',
            website: 'https://designstudio.com',
            logoUrl: '/no image.png'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  // Создание нового демо
  const createDemo = async () => {
    console.log('🆕 Начинаем создание нового демо');
    console.log('📝 Данные для создания:', formData);

    try {
      setLoading(true);
      
      // Используем только Next.js API для надежности
      const response = await fetch('/api/admin/demos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('📦 API Response data:', result);

      if (result.success && result.data) {
        console.log('✅ Демо успешно создано:', result.data);
        await fetchDemos(); // Обновляем список
        setShowModal(false);
        setEditingDemo(null);
        resetForm();
        alert('✅ Демо успешно создано!');
      } else {
        console.error('❌ Ошибка создания:', result.error || result.message);
        alert('❌ Ошибка создания: ' + (result.error || result.message));
      }
    } catch (error) {
      console.error('💥 Критическая ошибка при создании:', error);
      alert('💥 Критическая ошибка при создании демо');
    } finally {
      setLoading(false);
    }
  };

  // Обновление демо
  const updateDemo = async () => {
    if (!editingDemo) return;

    console.log('🔄 Начинаем обновление демо:', editingDemo.id);
    console.log('📝 Данные для обновления:', formData);

    try {
      setLoading(true);
      
      // Используем только Next.js API для надежности
      const response = await fetch(`/api/admin/demos/${editingDemo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('📦 API Response data:', result);

      if (result.success && result.data) {
        console.log('✅ Демо успешно обновлено:', result.data);
        await fetchDemos(); // Обновляем список
        setShowModal(false);
        setEditingDemo(null);
        resetForm();
        alert('✅ Демо успешно обновлено!');
      } else {
        console.error('❌ Ошибка обновления:', result.error || result.message);
        alert('❌ Ошибка обновления: ' + (result.error || result.message));
      }
    } catch (error) {
      console.error('💥 Критическая ошибка при обновлении:', error);
      alert('💥 Критическая ошибка при обновлении демо');
    } finally {
      setLoading(false);
    }
  };

  // Удаление демо
  const deleteDemo = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это демо?')) return;

    console.log('🗑️ Начинаем удаление демо:', id);

    try {
      setLoading(true);
      
      // Используем только Next.js API для надежности
      const response = await fetch(`/api/admin/delete-demo?id=${id}`, {
        method: 'DELETE',
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('📦 API Response data:', result);

      if (result.success) {
        console.log('✅ Демо успешно удалено');
        await fetchDemos(); // Обновляем список
        alert('✅ Демо успешно удалено!');
      } else {
        console.error('❌ Ошибка удаления:', result.error || result.message);
        alert('❌ Ошибка удаления: ' + (result.error || result.message));
      }
    } catch (error) {
      console.error('💥 Критическая ошибка при удалении:', error);
      alert('💥 Критическая ошибка при удалении демо');
    } finally {
      setLoading(false);
    }
  };

  // Открытие модального окна для редактирования
  const openEditModal = (demo: Demo) => {
    setEditingDemo(demo);
    setFormData({
      title: demo.title,
      description: demo.description,
      url: demo.url,
      status: demo.status,
      category: demo.category,
      subcategory: demo.subcategory,
      imageUrl: demo.imageUrl,
      vendorName: demo.vendor.name,
      vendorWebsite: demo.vendor.website,
    });
    setShowModal(true);
  };

  // Открытие модального окна для создания
  const openCreateModal = () => {
    setEditingDemo(null);
    resetForm();
    setShowModal(true);
  };

  // Сброс формы
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      status: 'draft',
      category: '',
      subcategory: '',
      imageUrl: '',
      vendorName: '',
      vendorWebsite: '',
    });
  };

  // Закрытие модального окна
  const closeModal = () => {
    setShowModal(false);
    setEditingDemo(null);
    resetForm();
  };

  useEffect(() => {
    if (activeTab === 'demos') {
      fetchDemos();
    }
  }, [activeTab, fetchDemos]);

  if (activeTab === 'dashboard' || !activeTab) {
    return (
      <WordPressAdminLayout currentPage="dashboard">
        <WordPressDashboard />
      </WordPressAdminLayout>
    );
  }

  return (
    <WordPressAdminLayout currentPage={activeTab}>
      <div className="space-y-6">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/30 dark:border-gray-700/30">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {tabs.find(tab => tab.id === activeTab)?.label || 'Admin Panel'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your platform content and settings</p>
        </div>


        {activeTab === 'demos' && (
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/30 dark:border-gray-700/30">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Demo Management</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500/80 text-white rounded-2xl font-semibold hover:bg-blue-600/80 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    Add Demo
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/30 dark:border-gray-700/30">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search demos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 border border-white/30 dark:border-gray-600/30 bg-white/40 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-xl shadow-lg shadow-blue-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-6 py-4 border border-white/30 dark:border-gray-600/30 bg-white/40 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-xl shadow-lg shadow-blue-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="draft">Drafts</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/30 dark:border-gray-700/30 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg">Loading demos...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                      <tr>
                        <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Title</th>
                        <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Vendor</th>
                        <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Status</th>
                        <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Views</th>
                        <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Created</th>
                        <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demos.length > 0 ? (
                        demos.map((demo) => (
                          <tr key={demo.id} className="border-t border-white/20 dark:border-gray-700/20 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300">
                            <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">{demo.title}</td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{demo.vendor?.name || 'Unknown'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                                demo.status === 'active'
                                  ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                                  : demo.status === 'draft'
                                  ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                                  : 'bg-red-500/20 text-red-700 dark:text-red-400'
                              }`}>
                                {demo.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{demo.viewCount || 0}</td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                              {new Date(demo.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => openEditModal(demo)}
                                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl hover:shadow-lg hover:shadow-green-500/10" 
                                  title="Edit"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => deleteDemo(demo.id)}
                                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl hover:shadow-lg hover:shadow-red-500/10" 
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                                <a
                                  href={demo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl hover:shadow-lg hover:shadow-purple-500/10"
                                  title="Open Demo"
                                >
                                  <ExternalLink className="w-5 h-5" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400 text-lg">
                            No demos found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal для создания/редактирования демо */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-blue-500/20 border border-white/30 dark:border-gray-700/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editingDemo ? 'Edit Demo' : 'Add New Demo'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 bg-white/40 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-xl"
                      placeholder="Demo title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'deleted' })}
                      className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 bg-white/40 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-xl"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="deleted">Deleted</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 bg-white/40 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-xl"
                    placeholder="Demo description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 bg-white/40 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-xl"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 bg-white/40 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-xl"
                      placeholder="E-commerce, Portfolio, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 bg-white/40 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-xl"
                      placeholder="Online Store, Creative, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 bg-white/40 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-xl"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      value={formData.vendorName}
                      onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 bg-white/40 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-xl"
                      placeholder="Shopify, WordPress, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vendor Website
                    </label>
                    <input
                      type="url"
                      value={formData.vendorWebsite}
                      onChange={(e) => setFormData({ ...formData, vendorWebsite: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 bg-white/40 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-xl"
                      placeholder="https://vendor.com"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 border border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-300 backdrop-blur-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={editingDemo ? updateDemo : createDemo}
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 ${
                    loading 
                      ? 'bg-gray-400/80 text-gray-200 cursor-not-allowed' 
                      : 'bg-blue-500/80 text-white hover:bg-blue-600/80'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {editingDemo ? 'Обновляем...' : 'Создаем...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingDemo ? 'Обновить демо' : 'Создать демо'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </WordPressAdminLayout>
  );
}

export default function Admin() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>}>
      <AdminContent />
    </Suspense>
  );
}