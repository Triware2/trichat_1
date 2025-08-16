# Updated WordPress and Shopify Integration Instructions

## WordPress Direct Integration (No Plugin Required)

### Updated Setup Instructions:

1. **Step 1: Understand WordPress Integration**
   - Add TriChat code directly to your theme files
   - No plugin installation required
   - Full control over widget placement and styling
   - Works with any WordPress theme
   - Lightweight and fast loading

2. **Step 2: Access Your Theme Files**
   - Log into your WordPress admin dashboard
   - Go to Appearance → Theme Editor
   - Select your active theme from the dropdown
   - Choose the appropriate template file (usually footer.php or header.php)
   - Make sure you have a backup of your theme files
   - Consider using a child theme for safer customization

3. **Step 3: Get Your API Key**
   - Log into your TriChat dashboard
   - Navigate to Settings → API Keys
   - Click "Create New API Key"
   - Give your API key a descriptive name (e.g., "WordPress Site")
   - Copy the generated API key (it starts with "trichat_live_")
   - Store the API key securely - you won't be able to see it again

4. **Step 4: Add TriChat Code to Your Theme**
   ```html
   <!-- Add this code to your theme's footer.php file, just before </body> -->
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
   </script>
   ```

5. **Step 5: Alternative - Add to Header**
   ```html
   <!-- Add this code to your theme's header.php file, just before </head> -->
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
   <script src="https://cdn.trichat.com/widget.js" async></script>
   ```

6. **Step 6: Customize Widget Styling**
   ```css
   /* Add this CSS to your theme's style.css file or Customizer */
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
   ```

## Shopify Direct Integration (No App Required)

### Updated Setup Instructions:

1. **Step 1: Understand Shopify Integration**
   - Add TriChat code directly to your Shopify theme
   - No app installation required
   - Full control over widget placement and styling
   - Works with all Shopify themes
   - No app store approval needed

2. **Step 2: Access Your Shopify Theme**
   - Log into your Shopify admin dashboard
   - Go to Online Store → Themes
   - Click "Actions" → "Edit code" on your active theme
   - This opens the theme editor where you can modify theme files

3. **Step 3: Get Your API Key**
   - Log into your TriChat dashboard
   - Navigate to Settings → API Keys
   - Click "Create New API Key"
   - Give your API key a descriptive name (e.g., "Shopify Store")
   - Copy the generated API key (it starts with "trichat_live_")
   - Store the API key securely - you won't be able to see it again

4. **Step 4: Add TriChat Code to Your Theme**
   ```liquid
   <!-- Add this code to your theme's layout/theme.liquid file, just before </body> -->
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
         cart: {{ cart | json }}
       }
     };
     
     // Load TriChat script
     var script = document.createElement('script');
     script.src = 'https://cdn.trichat.com/widget.js';
     script.async = true;
     document.head.appendChild(script);
   })();
   </script>
   ```

5. **Step 5: Alternative - Add to Header**
   ```liquid
   <!-- Add this code to your theme's layout/theme.liquid file, just before </head> -->
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
       cart: {{ cart | json }}
     }
   };
   </script>
   <script src="https://cdn.trichat.com/widget.js" async></script>
   ```

6. **Step 6: Add Customer Information (Optional)**
   ```liquid
   <!-- Add this to your theme to pass customer data to TriChat -->
   <script>
   window.TriChatCustomer = {
     id: {{ customer.id | default: 'null' }},
     email: {{ customer.email | json }},
     name: {{ customer.name | json }},
     orders: {{ customer.orders_count | default: 0 }},
     totalSpent: {{ customer.total_spent | default: 0 }}
   };
   </script>
   ```

7. **Step 7: Customize Widget Styling**
   ```css
   /* Add this CSS to your theme's assets/theme.css file */
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
   ```

8. **Step 8: Test the Integration**
   - Visit your Shopify store in a web browser
   - Look for the TriChat widget on your pages
   - Click the widget to test if it opens correctly
   - Try typing a message to test the functionality
   - Test on different pages (home, product, cart, checkout)
   - Test on mobile devices and different screen sizes
   - Check that the widget styling matches your theme
   - Verify that customer data is being passed correctly

## Key Benefits of Direct Integration:

### WordPress Benefits:
- **No Plugin Dependencies**: No need to install or maintain plugins
- **Better Performance**: Direct code integration is faster than plugin loading
- **Full Control**: Complete control over widget placement and styling
- **No Plugin Conflicts**: Avoid conflicts with other WordPress plugins
- **Easier Updates**: Update widget code directly without plugin updates
- **Better Security**: No third-party plugin code in your site

### Shopify Benefits:
- **No App Store Approval**: Skip the app store review process
- **No App Fees**: No monthly app subscription fees
- **Full Control**: Complete control over widget integration
- **Better Performance**: Direct integration is faster than app loading
- **No App Dependencies**: No reliance on third-party app maintenance
- **Custom Styling**: Full control over widget appearance and behavior

## Important Notes:

1. **Backup Your Files**: Always backup your theme files before making changes
2. **Test Thoroughly**: Test the integration on staging sites first
3. **API Key Security**: Keep your API key secure and don't share it publicly
4. **CDN Loading**: The widget loads from our CDN for optimal performance
5. **Mobile Responsive**: The widget is automatically mobile-responsive
6. **Customization**: You can customize colors, text, and behavior via the config object 