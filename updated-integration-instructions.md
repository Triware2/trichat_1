# Updated WordPress and Shopify Integration Instructions

## WordPress Setup Instructions (Direct Integration - No Plugin)

```typescript
wordpress: {
  title: 'WordPress Direct Integration Guide',
  steps: [
    {
      title: 'Step 1: Understand WordPress Integration',
      description: 'WordPress integration allows you to add TriChat directly to your WordPress website without any plugins.',
      code: null,
      details: [
        'Add TriChat code directly to your theme files',
        'No plugin installation required',
        'Full control over widget placement and styling',
        'Works with any WordPress theme',
        'Lightweight and fast loading'
      ]
    },
    {
      title: 'Step 2: Access Your Theme Files',
      description: 'You\'ll need to edit your WordPress theme files to add the TriChat code.',
      code: null,
      details: [
        'Log into your WordPress admin dashboard',
        'Go to Appearance → Theme Editor',
        'Select your active theme from the dropdown',
        'Choose the appropriate template file (usually footer.php or header.php)',
        'Make sure you have a backup of your theme files',
        'Consider using a child theme for safer customization'
      ]
    },
    {
      title: 'Step 3: Get Your API Key',
      description: 'Obtain your API key from the TriChat dashboard.',
      code: null,
      details: [
        'Log into your TriChat dashboard',
        'Navigate to Settings → API Keys',
        'Click "Create New API Key"',
        'Give your API key a descriptive name (e.g., "WordPress Site")',
        'Copy the generated API key (it starts with "trichat_live_")',
        'Store the API key securely - you won\'t be able to see it again'
      ]
    },
    {
      title: 'Step 4: Add TriChat Code to Your Theme',
      description: 'Add the TriChat widget code to your WordPress theme files.',
      code: `<!-- Add this code to your theme's footer.php file, just before </body> -->
<script>
(function() {
  window.TriChatConfig = {
    apiKey: 'YOUR_API_KEY_HERE',
    title: 'Need Help?',
    subtitle: 'We\'re here to help you',
    primaryColor: '#3B82F6',
    position: 'bottom-right',
    welcomeMessage: 'Hello! How can we help you today?',
    placeholder: 'Type your message...',
    showAvatar: true,
    autoOpen: false
  };
  
  // Load TriChat script
  var script = document.createElement('script');
  script.src = 'https://cdn.trichat.com/widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>`,
      details: [
        'Open your theme\'s footer.php file in the Theme Editor',
        'Add the TriChat code just before the closing </body> tag',
        'Replace YOUR_API_KEY_HERE with your actual API key',
        'Customize the widget configuration as needed',
        'Save the file and check for any syntax errors',
        'The widget will load from our CDN automatically'
      ]
    },
    {
      title: 'Step 5: Alternative - Add to Header',
      description: 'If you prefer to add the code to your header.php file instead.',
      code: `<!-- Add this code to your theme's header.php file, just before </head> -->
<script>
window.TriChatConfig = {
  apiKey: 'YOUR_API_KEY_HERE',
  title: 'Need Help?',
  subtitle: 'We\'re here to help you',
  primaryColor: '#3B82F6',
  position: 'bottom-right',
  welcomeMessage: 'Hello! How can we help you today?',
  placeholder: 'Type your message...',
  showAvatar: true,
  autoOpen: false
};
</script>
<script src="https://cdn.trichat.com/widget.js" async></script>`,
      details: [
        'Open your theme\'s header.php file in the Theme Editor',
        'Add the configuration script just before the closing </head> tag',
        'Add the widget script tag after the configuration',
        'This method loads the widget earlier in the page',
        'May provide slightly faster widget appearance',
        'Choose this method if you want the widget to load immediately'
      ]
    },
    {
      title: 'Step 6: Customize Widget Styling',
      description: 'Add custom CSS to match your WordPress theme design.',
      code: `/* Add this CSS to your theme's style.css file or Customizer */
.trichat-widget {
  font-family: inherit !important;
}

.trichat-button {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.trichat-chat-window {
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

/* Match your theme's color scheme */
.trichat-header {
  background: var(--your-theme-primary-color) !important;
}

/* Custom animations */
.trichat-button:hover {
  transform: scale(1.05) !important;
  transition: transform 0.2s ease !important;
}`,
      details: [
        'Go to Appearance → Customize → Additional CSS',
        'Add custom CSS to match your theme\'s design',
        'Use your theme\'s color variables if available',
        'Customize fonts, shadows, and animations',
        'Test the styling on different pages',
        'Ensure the widget looks good on mobile devices'
      ]
    },
    {
      title: 'Step 7: Test the Integration',
      description: 'Test the WordPress integration to ensure the chat widget works correctly.',
      code: null,
      details: [
        'Visit your WordPress website in a web browser',
        'Look for the TriChat widget on your pages',
        'Click the widget to test if it opens correctly',
        'Try typing a message to test the functionality',
        'Test on different pages where the widget should appear',
        'Test on mobile devices and different screen sizes',
        'Check that the widget styling matches your theme',
        'Verify that the widget loads without errors in browser console'
      ]
    },
    {
      title: 'Step 8: Troubleshooting',
      description: 'Common issues and solutions for WordPress integration.',
      code: null,
      details: [
        'If widget doesn\'t appear: Check browser console for JavaScript errors',
        'If styling is wrong: Verify CSS conflicts with your theme',
        'If API key doesn\'t work: Double-check the key and ensure it\'s active',
        'If widget loads slowly: Consider moving code to header.php',
        'If conflicts with other plugins: Test with plugins disabled',
        'If mobile issues: Test responsive design and touch interactions',
        'Backup your theme files before making changes',
        'Consider using a staging site for testing'
      ]
    }
  ]
}
```

## Shopify Setup Instructions (Direct Integration - No App)

```typescript
shopify: {
  title: 'Shopify Direct Integration Guide',
  steps: [
    {
      title: 'Step 1: Understand Shopify Integration',
      description: 'Shopify integration allows you to add TriChat directly to your Shopify store without any apps.',
      code: null,
      details: [
        'Add TriChat code directly to your Shopify theme',
        'No app installation required',
        'Full control over widget placement and styling',
        'Works with all Shopify themes',
        'No app store approval needed'
      ]
    },
    {
      title: 'Step 2: Access Your Shopify Theme',
      description: 'You\'ll need to edit your Shopify theme files to add the TriChat code.',
      code: null,
      details: [
        'Log into your Shopify admin dashboard',
        'Go to Online Store → Themes',
        'Click "Actions" → "Edit code" on your active theme',
        'This opens the theme editor where you can modify theme files',
        'Make sure you have a backup of your theme',
        'Consider duplicating your theme before making changes'
      ]
    },
    {
      title: 'Step 3: Get Your API Key',
      description: 'Obtain your API key from the TriChat dashboard.',
      code: null,
      details: [
        'Log into your TriChat dashboard',
        'Navigate to Settings → API Keys',
        'Click "Create New API Key"',
        'Give your API key a descriptive name (e.g., "Shopify Store")',
        'Copy the generated API key (it starts with "trichat_live_")',
        'Store the API key securely - you won\'t be able to see it again'
      ]
    },
    {
      title: 'Step 4: Add TriChat Code to Your Theme',
      description: 'Add the TriChat widget code to your Shopify theme files.',
      code: `<!-- Add this code to your theme's layout/theme.liquid file, just before </body> -->
<script>
(function() {
  window.TriChatConfig = {
    apiKey: 'YOUR_API_KEY_HERE',
    title: 'Need Help?',
    subtitle: 'We\'re here to help you',
    primaryColor: '{{ settings.primary_color | default: "#3B82F6" }}',
    position: 'bottom-right',
    welcomeMessage: 'Hello! How can we help you today?',
    placeholder: 'Type your message...',
    showAvatar: true,
    autoOpen: false,
    // Shopify-specific options
    shopify: {
      shop: '{{ shop.permanent_domain }}',
      customer: {{ customer | json }},
      cart: {{ cart | json }},
      product: {{ product | json }},
      collection: {{ collection | json }}
    }
  };
  
  // Load TriChat script
  var script = document.createElement('script');
  script.src = 'https://cdn.trichat.com/widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>`,
      details: [
        'Open your theme\'s layout/theme.liquid file in the Theme Editor',
        'Add the TriChat code just before the closing </body> tag',
        'Replace YOUR_API_KEY_HERE with your actual API key',
        'Customize the widget configuration as needed',
        'Save the file and check for any syntax errors',
        'The widget will load from our CDN automatically'
      ]
    },
    {
      title: 'Step 5: Alternative - Add to Header',
      description: 'If you prefer to add the code to your header instead.',
      code: `<!-- Add this code to your theme's layout/theme.liquid file, just before </head> -->
<script>
window.TriChatConfig = {
  apiKey: 'YOUR_API_KEY_HERE',
  title: 'Need Help?',
  subtitle: 'We\'re here to help you',
  primaryColor: '{{ settings.primary_color | default: "#3B82F6" }}',
  position: 'bottom-right',
  welcomeMessage: 'Hello! How can we help you today?',
  placeholder: 'Type your message...',
  showAvatar: true,
  autoOpen: false,
  shopify: {
    shop: '{{ shop.permanent_domain }}',
    customer: {{ customer | json }},
    cart: {{ cart | json }},
    product: {{ product | json }},
    collection: {{ collection | json }}
  }
};
</script>
<script src="https://cdn.trichat.com/widget.js" async></script>`,
      details: [
        'Open your theme\'s layout/theme.liquid file in the Theme Editor',
        'Add the configuration script just before the closing </head> tag',
        'Add the widget script tag after the configuration',
        'This method loads the widget earlier in the page',
        'May provide slightly faster widget appearance',
        'Choose this method if you want the widget to load immediately'
      ]
    },
    {
      title: 'Step 6: Add Customer Information (Optional)',
      description: 'Add customer data integration for better support experience.',
      code: `<!-- Add this to your theme to pass customer data to TriChat -->
<script>
window.TriChatCustomer = {
  id: {{ customer.id | default: 'null' }},
  email: {{ customer.email | json }},
  name: {{ customer.name | json }},
  orders: {{ customer.orders_count | default: 0 }},
  totalSpent: {{ customer.total_spent | default: 0 }}
};
</script>`,
      details: [
        'Add this code after the main TriChat configuration',
        'This passes customer information to the chat widget',
        'Support agents can see customer order history',
        'Enables personalized support experience',
        'Customer data is only shared when customer is logged in',
        'This is optional but recommended for better support'
      ]
    },
    {
      title: 'Step 7: Customize Widget Styling',
      description: 'Add custom CSS to match your Shopify store design.',
      code: `/* Add this CSS to your theme's assets/theme.css file */
.trichat-widget {
  font-family: {{ settings.font_family | default: 'inherit' }} !important;
}

.trichat-button {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.trichat-chat-window {
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

/* Match your Shopify theme colors */
.trichat-header {
  background: {{ settings.primary_color | default: '#3B82F6' }} !important;
}

/* Custom animations */
.trichat-button:hover {
  transform: scale(1.05) !important;
  transition: transform 0.2s ease !important;
}`,
      details: [
        'Go to Assets → theme.css in your Theme Editor',
        'Add custom CSS to match your store\'s design',
        'Use your theme\'s color variables if available',
        'Customize fonts, shadows, and animations',
        'Test the styling on different store pages',
        'Ensure the widget looks good on mobile devices'
      ]
    },
    {
      title: 'Step 8: Test the Integration',
      description: 'Test the Shopify integration to ensure everything works correctly.',
      code: null,
      details: [
        'Visit your Shopify store in a web browser',
        'Look for the TriChat widget on your store pages',
        'Test the chat functionality as a customer',
        'Verify that customer data is being shared correctly',
        'Test on different store pages (home, product, cart, checkout)',
        'Test on mobile devices and different screen sizes',
        'Check that the widget styling matches your store theme',
        'Verify that e-commerce features are working properly'
      ]
    },
    {
      title: 'Step 9: Troubleshooting',
      description: 'Common issues and solutions for Shopify integration.',
      code: null,
      details: [
        'If widget doesn\'t appear: Check browser console for JavaScript errors',
        'If styling is wrong: Verify CSS conflicts with your theme',
        'If API key doesn\'t work: Double-check the key and ensure it\'s active',
        'If customer data not showing: Verify customer is logged in',
        'If Liquid variables not working: Check theme file syntax',
        'If mobile issues: Test responsive design and touch interactions',
        'Backup your theme before making changes',
        'Consider using a development theme for testing'
      ]
    }
  ]
}
```

## Code Generation for WordPress and Shopify

### WordPress Code Generation:
```typescript
case 'wordpress':
  return `<!-- TriChat WordPress Integration -->
<!-- Add this code to your theme's footer.php file, just before </body> -->
<script>
(function() {
  window.TriChatConfig = {
    apiKey: 'YOUR_API_KEY_HERE',
    title: '${widgetConfig.title || 'Need Help?'}',
    subtitle: '${widgetConfig.subtitle || 'We\'re here to help you'}',
    primaryColor: '${widgetConfig.primaryColor || '#3B82F6'}',
    position: '${widgetConfig.position || 'bottom-right'}',
    welcomeMessage: '${widgetConfig.welcomeMessage || 'Hello! How can we help you today?'}',
    placeholder: '${widgetConfig.placeholder || 'Type your message...'}',
    showAvatar: ${widgetConfig.showAvatar || true},
    autoOpen: ${widgetConfig.autoOpen || false}
  };
  
  // Load TriChat script
  var script = document.createElement('script');
  script.src = 'https://cdn.trichat.com/widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>

<!-- Alternative: Add to header.php before </head> -->
<!--
<script>
window.TriChatConfig = {
  apiKey: 'YOUR_API_KEY_HERE',
  title: '${widgetConfig.title || 'Need Help?'}',
  subtitle: '${widgetConfig.subtitle || 'We\'re here to help you'}',
  primaryColor: '${widgetConfig.primaryColor || '#3B82F6'}',
  position: '${widgetConfig.position || 'bottom-right'}',
  welcomeMessage: '${widgetConfig.welcomeMessage || 'Hello! How can we help you today?'}',
  placeholder: '${widgetConfig.placeholder || 'Type your message...'}',
  showAvatar: ${widgetConfig.showAvatar || true},
  autoOpen: ${widgetConfig.autoOpen || false}
};
</script>
<script src="https://cdn.trichat.com/widget.js" async></script>
-->

<!-- Custom CSS for WordPress -->
<style>
.trichat-widget {
  font-family: inherit !important;
}
.trichat-button {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}
.trichat-chat-window {
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}
</style>`;
```

### Shopify Code Generation:
```typescript
case 'shopify':
  return `<!-- TriChat Shopify Integration -->
<!-- Add this code to your theme's layout/theme.liquid file, just before </body> -->
<script>
(function() {
  window.TriChatConfig = {
    apiKey: 'YOUR_API_KEY_HERE',
    title: '${widgetConfig.title || 'Need Help?'}',
    subtitle: '${widgetConfig.subtitle || 'We\'re here to help you'}',
    primaryColor: '{{ settings.primary_color | default: "${widgetConfig.primaryColor || '#3B82F6'}" }}',
    position: '${widgetConfig.position || 'bottom-right'}',
    welcomeMessage: '${widgetConfig.welcomeMessage || 'Hello! How can we help you today?'}',
    placeholder: '${widgetConfig.placeholder || 'Type your message...'}',
    showAvatar: ${widgetConfig.showAvatar || true},
    autoOpen: ${widgetConfig.autoOpen || false},
    // Shopify-specific options
    shopify: {
      shop: '{{ shop.permanent_domain }}',
      customer: {{ customer | json }},
      cart: {{ cart | json }},
      product: {{ product | json }},
      collection: {{ collection | json }}
    }
  };
  
  // Load TriChat script
  var script = document.createElement('script');
  script.src = 'https://cdn.trichat.com/widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>

<!-- Alternative: Add to header before </head> -->
<!--
<script>
window.TriChatConfig = {
  apiKey: 'YOUR_API_KEY_HERE',
  title: '${widgetConfig.title || 'Need Help?'}',
  subtitle: '${widgetConfig.subtitle || 'We\'re here to help you'}',
  primaryColor: '{{ settings.primary_color | default: "${widgetConfig.primaryColor || '#3B82F6'}" }}',
  position: '${widgetConfig.position || 'bottom-right'}',
  welcomeMessage: '${widgetConfig.welcomeMessage || 'Hello! How can we help you today?'}',
  placeholder: '${widgetConfig.placeholder || 'Type your message...'}',
  showAvatar: ${widgetConfig.showAvatar || true},
  autoOpen: ${widgetConfig.autoOpen || false},
  shopify: {
    shop: '{{ shop.permanent_domain }}',
    customer: {{ customer | json }},
    cart: {{ cart | json }},
    product: {{ product | json }},
    collection: {{ collection | json }}
  }
};
</script>
<script src="https://cdn.trichat.com/widget.js" async></script>
-->

<!-- Customer Information (Optional) -->
<script>
window.TriChatCustomer = {
  id: {{ customer.id | default: 'null' }},
  email: {{ customer.email | json }},
  name: {{ customer.name | json }},
  orders: {{ customer.orders_count | default: 0 }},
  totalSpent: {{ customer.total_spent | default: 0 }}
};
</script>

<!-- Custom CSS for Shopify -->
<style>
.trichat-widget {
  font-family: {{ settings.font_family | default: 'inherit' }} !important;
}
.trichat-button {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}
.trichat-chat-window {
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}
.trichat-header {
  background: {{ settings.primary_color | default: '#3B82F6' }} !important;
}
</style>`;
``` 