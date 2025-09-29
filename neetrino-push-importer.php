<?php
/**
 * Plugin Name: Neetrino Push Importer
 * Description: Пушит товары из WooCommerce на локальный Neetrino API (POST /import/push). Просто: задал лимит и нажал кнопку.
 * Version: 0.1.3
 * Author: Neetrino
 */

if (!defined('ABSPATH')) exit;

class Neetrino_Push_Importer {
  const OPTION = 'neetrino_push_importer_settings';

  public function __construct() {
    add_action('admin_menu', array($this, 'menu'));
    add_action('admin_init', array($this, 'register_settings'));
    add_action('wp_ajax_neetrino_push_import', array($this, 'ajax_import'));
  }

  public function menu() {
    add_menu_page(
      'Neetrino Import',
      'Neetrino Import',
      'manage_woocommerce',
      'neetrino-push-importer',
      array($this, 'render_page'),
      'dashicons-upload',
      58
    );
  }

  public function register_settings() { 
    register_setting(self::OPTION, self::OPTION); 
  }

  private function get_settings() {
    $defaults = array(
      'api_url' => 'http://localhost:3001/import/push',
      'token' => 'changeme',
      'batch' => 100,
      'limit' => 0,
      'category_slug' => '',
      'include_variations' => 0
    );
    $options = get_option(self::OPTION, array());
    return array_merge($defaults, is_array($options) ? $options : array());
  }

  public function render_page() {
    if (!current_user_can('manage_woocommerce')) return;
    
    $settings = $this->get_settings();
    ?>
    <div class="wrap">
      <h1>Neetrino Push Importer</h1>
      
      <form method="post" action="options.php">
        <?php settings_fields(self::OPTION); ?>
        <table class="form-table">
          <tr>
            <th>API URL</th>
            <td>
              <input class="regular-text" name="<?php echo self::OPTION; ?>[api_url]" 
                     value="<?php echo esc_attr($settings['api_url']); ?>">
            </td>
          </tr>
          <tr>
            <th>Shared Token</th>
            <td>
              <input class="regular-text" name="<?php echo self::OPTION; ?>[token]" 
                     value="<?php echo esc_attr($settings['token']); ?>">
            </td>
          </tr>
          <tr>
            <th>Batch size</th>
            <td>
              <input type="number" min="1" max="500" name="<?php echo self::OPTION; ?>[batch]" 
                     value="<?php echo (int)$settings['batch']; ?>">
            </td>
          </tr>
          <tr>
            <th>Limit (0 = all)</th>
            <td>
              <input type="number" min="0" name="<?php echo self::OPTION; ?>[limit]" 
                     value="<?php echo (int)$settings['limit']; ?>">
            </td>
          </tr>
        </table>
        <?php submit_button('Save Settings'); ?>
      </form>

      <hr>
      <h2>Настройка подключения</h2>
      <div class="notice notice-info">
        <p><strong>Для подключения к локальному серверу:</strong></p>
        <ol>
          <li>На локальном компьютере запустите: <code>node test-server.js</code></li>
          <li>Создайте туннель: <code>lt --port 3001</code> (или используйте ngrok)</li>
          <li>Скопируйте публичный URL (например: https://abc123.loca.lt)</li>
          <li>Замените API URL выше на: <code>[ПУБЛИЧНЫЙ_URL]/import/push</code></li>
        </ol>
        <p><strong>Пример:</strong> <code>https://abc123.loca.lt/import/push</code></p>
      </div>
      
      <h2>Run import</h2>
      <p>Нажми кнопку, чтобы отправить товары в Neetrino API батчами.</p>
      <button id="neetrino-run" class="button button-primary">Start Import</button>
      <pre id="neetrino-log" style="max-height:400px;overflow:auto;background:#f6f7f7;padding:12px;"></pre>

      <script>
        document.addEventListener('DOMContentLoaded', function() {
          const btn = document.getElementById('neetrino-run');
          const log = document.getElementById('neetrino-log');
          
          function logMessage(message) {
            log.textContent += message + "\n";
          }
          
          btn.addEventListener('click', function() {
            btn.disabled = true;
            log.textContent = 'Starting...\n';
            
            const formData = new FormData();
            formData.append('action', 'neetrino_push_import');
            formData.append('_ajax_nonce', '<?php echo wp_create_nonce('neetrino_push_import'); ?>');
            
            fetch(ajaxurl, {
              method: 'POST',
              body: formData,
              headers: {
                'X-Requested-With': 'XMLHttpRequest'
              }
            })
            .then(function(response) {
              logMessage('Response status: ' + response.status);
              if (!response.ok) {
                throw new Error('HTTP ' + response.status + ': ' + response.statusText);
              }
              return response.text();
            })
            .then(function(text) {
              logMessage('Raw response: ' + text.substring(0, 500));
              try {
                const json = JSON.parse(text);
                logMessage('Parsed JSON: ' + JSON.stringify(json, null, 2));
              } catch(e) {
                logMessage('JSON Parse Error: ' + e.message);
                logMessage('Response is not JSON: ' + text.substring(0, 200) + '...');
              }
            })
            .catch(function(error) {
              logMessage('Error: ' + error.message);
            })
            .finally(function() {
              btn.disabled = false;
            });
          });
        });
      </script>
    </div>
    <?php
  }

  public function ajax_import() {
    // Устанавливаем правильный Content-Type для JSON
    header('Content-Type: application/json; charset=utf-8');
    
    try {
      // Проверяем nonce
      if (!isset($_POST['_ajax_nonce']) || !wp_verify_nonce($_POST['_ajax_nonce'], 'neetrino_push_import')) {
        wp_send_json_error('Security check failed', 403);
      }
      
      // Проверяем права пользователя
      if (!current_user_can('manage_woocommerce')) {
        wp_send_json_error('forbidden', 403);
      }
      
      // Проверяем, что WooCommerce активен
      if (!class_exists('WooCommerce')) {
        wp_send_json_error('WooCommerce not active', 400);
      }

      $settings = $this->get_settings();
      $api_url = esc_url_raw($settings['api_url']);
      $token = sanitize_text_field($settings['token']);
      $batch = max(1, (int)$settings['batch']);
      $limit = max(0, (int)$settings['limit']);

      // Простой тест - получаем только первые 5 товаров
      $args = array(
        'status' => array('publish'),
        'limit' => min($batch, 5),
        'paginate' => true,
        'return' => 'ids'
      );

      $products = wc_get_products($args);
      $items = array();

      if (!empty($products)) {
        foreach ($products as $product_id) {
          $product = wc_get_product($product_id);
          if (!$product) continue;

          $items[] = array(
            'wcId' => (int)$product_id,
            'title' => $product->get_name(),
            'slug' => $product->get_slug(),
            'price' => $product->get_price() ? (string)$product->get_price() : null,
            'currency' => 'USD',
            'description' => $product->get_description() ?: $product->get_short_description(),
            'isActive' => true
          );
        }
      }

      // Отправляем на API
      if (!empty($items)) {
        $response = wp_remote_post($api_url, array(
          'timeout' => 30,
          'headers' => array(
            'Content-Type' => 'application/json; charset=utf-8',
            'X-NEETRINO-TOKEN' => $token
          ),
          'body' => wp_json_encode(array('items' => $items))
        ));
        
        if (is_wp_error($response)) {
          wp_send_json_error(array('error' => $response->get_error_message()), 500);
        }
        
        $code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        
        if ($code >= 400) {
          wp_send_json_error(array('status' => $code, 'body' => $body), $code);
        }
        
        $result = json_decode($body, true);
        wp_send_json_success(array(
          'sent' => count($items),
          'api_response' => $result
        ), 200);
      } else {
        wp_send_json_success(array('sent' => 0, 'message' => 'No products found'), 200);
      }
      
    } catch (Exception $e) {
      wp_send_json_error(array('error' => $e->getMessage()), 500);
    }
  }
}

// Инициализируем плагин
new Neetrino_Push_Importer();