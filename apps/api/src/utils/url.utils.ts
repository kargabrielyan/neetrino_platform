export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Приводим к https
    urlObj.protocol = 'https:';
    
    // Убираем UTM параметры и другие трекинг параметры
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'gclid', 'fbclid', 'msclkid', 'ref', 'source'
    ];
    
    trackingParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    // Убираем hash
    urlObj.hash = '';
    
    // Убираем завершающий слеш
    let pathname = urlObj.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    urlObj.pathname = pathname;
    
    // Хост в нижнем регистре
    urlObj.hostname = urlObj.hostname.toLowerCase();
    
    return urlObj.toString();
  } catch {
    return url;
  }
}
