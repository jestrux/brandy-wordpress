<?php
if (!class_exists('CreateBrandyPlugin')) :

    class CreateBrandyPlugin
    {
        public function __construct()
        {
            if (is_admin())
                add_action('admin_enqueue_scripts', [$this, 'include_home_resources']);
        }

        public function include_home_resources()
        {
            $plugin_url = plugin_dir_url(__FILE__);
            $current_page_url = (empty($_SERVER['HTTPS']) ? 'http://' : 'https://') . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

            if (str_contains($current_page_url, "wp-admin/upload.php")) {
                wp_enqueue_style('brandy-plugin-css', $plugin_url . 'front/styles.css', [], wp_rand());
                wp_enqueue_script('brandy-plugin-js', $plugin_url . 'front/app.js', ['jquery', 'wp-element'], wp_rand(), true);
            }
        }
    }

    new CreateBrandyPlugin();

endif;
