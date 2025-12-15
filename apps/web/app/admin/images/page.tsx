'use client';

import { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckCircle, XCircle, Loader2, Image, AlertTriangle } from 'lucide-react';

interface Stats {
  totalDemos: number;
  withExternalUrl: number;
  withLocalUrl: number;
  filesInFolder: number;
}

interface DownloadResult {
  success: boolean;
  stats?: {
    total: number;
    downloaded: number;
    skipped: number;
    errors: number;
    errorList?: string[];
  };
  message?: string;
  error?: string;
}

export default function AdminImagesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Загрузка статистики
  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/download-images');
      const data = await res.json();
      
      if (data.status === 'ok') {
        setStats(data.stats);
      } else {
        setError(data.message || 'Ошибка загрузки статистики');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  // Запуск скачивания
  const startDownload = async (limit: number = 100) => {
    setDownloading(true);
    setResult(null);
    setError(null);
    
    try {
      console.log('🚀 Начинаем скачивание изображений...');
      
      const res = await fetch(`/api/admin/download-images?limit=${limit}`, {
        method: 'POST',
      });
      
      const data = await res.json();
      console.log('📊 Результат:', data);
      
      if (data.success) {
        setResult(data);
        // Обновляем статистику
        await loadStats();
      } else {
        setError(data.error || 'Ошибка скачивания');
      }
    } catch (err: any) {
      console.error('❌ Ошибка:', err);
      setError(err.message || 'Ошибка сети');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Image className="w-7 h-7" />
        Управление изображениями
      </h1>

      {/* Статистика */}
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Статистика</h2>
          <button
            onClick={loadStats}
            disabled={loading}
            className="p-2 glass rounded-lg hover:glass-strong transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-a1" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-500 py-4">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-subtle rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-a1">{stats.totalDemos}</div>
              <div className="text-sm text-ink/60">Всего демо</div>
            </div>
            <div className="glass-subtle rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-500">{stats.withExternalUrl}</div>
              <div className="text-sm text-ink/60">Внешние URL</div>
            </div>
            <div className="glass-subtle rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-500">{stats.withLocalUrl}</div>
              <div className="text-sm text-ink/60">Локальные</div>
            </div>
            <div className="glass-subtle rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-500">{stats.filesInFolder}</div>
              <div className="text-sm text-ink/60">Файлов</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Действия */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Скачать изображения</h2>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => startDownload(50)}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Скачать 50
          </button>
          
          <button
            onClick={() => startDownload(100)}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
          >
            {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Скачать 100
          </button>
          
          <button
            onClick={() => startDownload(500)}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50"
          >
            {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Скачать 500
          </button>
          
          <button
            onClick={() => startDownload(10000)}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
          >
            {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Скачать ВСЕ
          </button>
        </div>

        {downloading && (
          <div className="flex items-center gap-2 text-a1 py-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Скачивание... Это может занять несколько минут.</span>
          </div>
        )}
      </div>

      {/* Результат */}
      {result && (
        <div className={`glass rounded-xl p-6 mb-6 ${result.success ? 'border-green-500/30' : 'border-red-500/30'} border`}>
          <div className="flex items-center gap-2 mb-4">
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <h2 className="text-lg font-semibold">Результат</h2>
          </div>

          {result.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="glass-subtle rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{result.stats.total}</div>
                <div className="text-xs text-ink/60">Обработано</div>
              </div>
              <div className="glass-subtle rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-500">{result.stats.downloaded}</div>
                <div className="text-xs text-ink/60">Скачано</div>
              </div>
              <div className="glass-subtle rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-500">{result.stats.skipped}</div>
                <div className="text-xs text-ink/60">Пропущено</div>
              </div>
              <div className="glass-subtle rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-500">{result.stats.errors}</div>
                <div className="text-xs text-ink/60">Ошибок</div>
              </div>
            </div>
          )}

          {result.message && (
            <p className="text-ink/80">{result.message}</p>
          )}

          {result.stats?.errorList && result.stats.errorList.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Ошибки ({result.stats.errorList.length}):</span>
              </div>
              <div className="max-h-40 overflow-y-auto glass-subtle rounded-lg p-3 text-sm font-mono">
                {result.stats.errorList.slice(0, 20).map((err, i) => (
                  <div key={i} className="text-red-400">{err}</div>
                ))}
                {result.stats.errorList.length > 20 && (
                  <div className="text-ink/60">... и еще {result.stats.errorList.length - 20}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Инструкция */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-3">Как это работает</h2>
        <ul className="space-y-2 text-ink/80">
          <li>1. Скрипт находит все демо с внешними URL изображений (https://...)</li>
          <li>2. Скачивает каждое изображение в папку <code className="bg-ink/10 px-1 rounded">/public/images/demos/</code></li>
          <li>3. Обновляет URL в базе данных на локальный путь</li>
          <li>4. Пропускает уже скачанные изображения</li>
        </ul>
      </div>
    </div>
  );
}




