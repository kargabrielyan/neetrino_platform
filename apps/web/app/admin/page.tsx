'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Users, 
  Database, 
  Settings, 
  BarChart3, 
  Plus,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('demos');

  const tabs = [
    { id: 'demos', label: 'Demos', icon: Database },
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const demos = [
    {
      id: 1,
      title: 'E-commerce Platform',
      vendor: 'Shopify',
      status: 'active',
      url: 'https://example.com',
      lastChecked: '2024-01-15',
    },
    {
      id: 2,
      title: 'Portfolio Website',
      vendor: 'Webflow',
      status: 'draft',
      url: 'https://example.com',
      lastChecked: '2024-01-14',
    },
    {
      id: 3,
      title: 'Blog Platform',
      vendor: 'WordPress',
      status: 'active',
      url: 'https://example.com',
      lastChecked: '2024-01-13',
    },
  ];

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white/70">Manage demos, vendors, and settings</p>
        </div>

        {/* Вкладки */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-black'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Контент вкладок */}
        {activeTab === 'demos' && (
          <div>
            {/* Header and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-white">Demo Management</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Demo
                </button>
                <button className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors">
                  Import
                </button>
              </div>
            </div>

            {/* Фильтры */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search demos..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary/50"
                />
              </div>
              <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50">
                <option value="" className="text-black">All Statuses</option>
                <option value="active" className="text-black">Active</option>
                <option value="draft" className="text-black">Drafts</option>
                <option value="deleted" className="text-black">Deleted</option>
              </select>
            </div>

            {/* Таблица демо */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-white/70 font-medium">ID</th>
                      <th className="px-4 py-3 text-left text-white/70 font-medium">Title</th>
                      <th className="px-4 py-3 text-left text-white/70 font-medium">Vendor</th>
                      <th className="px-4 py-3 text-left text-white/70 font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-white/70 font-medium">Last Checked</th>
                      <th className="px-4 py-3 text-left text-white/70 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demos.map((demo) => (
                      <tr key={demo.id} className="border-t border-white/10">
                        <td className="px-4 py-3 text-white/80">{demo.id}</td>
                        <td className="px-4 py-3 text-white">{demo.title}</td>
                        <td className="px-4 py-3 text-white/80">{demo.vendor}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            demo.status === 'active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {demo.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/80">{demo.lastChecked}</td>
                        <td className="px-4 py-3">
                          <button className="p-1 text-white/50 hover:text-white transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Vendor Management</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
              <Database className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">Vendor section in development</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-white/70 text-sm mb-2">Total Demos</h3>
                <p className="text-2xl font-bold text-white">1,234</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-white/70 text-sm mb-2">Active</h3>
                <p className="text-2xl font-bold text-green-400">1,100</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-white/70 text-sm mb-2">Drafts</h3>
                <p className="text-2xl font-bold text-yellow-400">134</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
              <Settings className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">Settings section in development</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}