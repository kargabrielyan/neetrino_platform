const https = require('https');

// Получаем информацию о туннелях ngrok
https.get('http://localhost:4040/api/tunnels', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const tunnels = JSON.parse(data);
      const httpsTunnel = tunnels.tunnels.find(tunnel => tunnel.proto === 'https');
      
      if (httpsTunnel) {
        console.log('🌐 Публичный URL:', httpsTunnel.public_url);
        console.log('🔗 Import endpoint:', httpsTunnel.public_url + '/import/push');
        console.log('✅ Используйте этот URL в плагине WordPress');
      } else {
        console.log('❌ Туннель не найден. Убедитесь, что ngrok запущен.');
      }
    } catch (error) {
      console.log('❌ Ошибка парсинга:', error.message);
    }
  });
}).on('error', (error) => {
  console.log('❌ Ошибка подключения к ngrok:', error.message);
  console.log('💡 Убедитесь, что ngrok запущен: ngrok http 3001');
});

