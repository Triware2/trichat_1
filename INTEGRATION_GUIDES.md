# TriChat Integration Guides

Complete integration instructions for all TriChat integration types.

## 📋 Table of Contents

1. [Web Integrations](#web-integrations)
2. [API Integrations](#api-integrations)
3. [Platform Integrations](#platform-integrations)
4. [Messaging Integrations](#messaging-integrations)
5. [Mobile Integrations](#mobile-integrations)

---

## 🌐 Web Integrations

### Floating Widget

**Complexity:** Easy | **Time:** 2-5 minutes

**Features:**
- Always visible chat widget
- Customizable position
- Auto-open options
- Mobile responsive

**Generated Code:**
```html
<!-- TriChat Floating Widget Integration -->
<script>
(function() {
  window.TriChatConfig = {
    "widgetId": "your-widget-id",
    "title": "Chat with us",
    "subtitle": "We're here to help!",
    "primaryColor": "#3B82F6",
    "position": "bottom-right",
    "welcomeMessage": "Hello! How can we help you today?",
    "placeholder": "Type your message...",
    "showAvatar": true,
    "autoOpen": false,
    "department": "general",
    "allowFileUpload": true,
    "showTypingIndicator": true,
    "enableRating": true,
    "maxFileSize": 10,
    "allowedFileTypes": ["image/jpeg", "image/png", "image/gif", "application/pdf"],
    "language": "en",
    "timezone": "UTC"
  };
  
  // Load TriChat widget script
  var script = document.createElement('script');
  script.src = 'https://your-domain.com/widget.js';
  script.async = true;
  script.onload = function() {
    console.log('TriChat widget loaded successfully');
  };
  script.onerror = function() {
    console.error('Failed to load TriChat widget');
  };
  document.head.appendChild(script);
})();
</script>

<!-- Optional: Custom CSS -->
<style>
.trichat-widget {
  --primary-color: #3B82F6;
  --widget-position: bottom-right;
}
</style>
```

**Installation Steps:**
1. Copy the generated code
2. Paste before the closing `</body>` tag in your HTML
3. Replace `your-widget-id` with your actual widget ID
4. Update the script source URL to your domain
5. Customize colors and styling as needed

### Button Trigger

**Complexity:** Easy | **Time:** 3-7 minutes

**Features:**
- Custom button styling
- Modal popup
- Seamless integration
- Event tracking

**Generated Code:**
```html
<!-- TriChat Button Integration -->
<script>
(function() {
  window.TriChatConfig = {
    "widgetId": "your-widget-id",
    "title": "Chat with us",
    "subtitle": "We're here to help!",
    "primaryColor": "#3B82F6",
    "welcomeMessage": "Hello! How can we help you today?",
    "placeholder": "Type your message...",
    "showAvatar": true,
    "department": "general",
    "mode": "button",
    "buttonSelector": "#help-button"
  };
  
  // Load TriChat script
  var script = document.createElement('script');
  script.src = 'https://your-domain.com/widget.js';
  script.async = true;
  script.onload = function() {
    TriChat.initButtonMode('#help-button');
  };
  document.head.appendChild(script);
})();
</script>

<!-- Add this to your existing help button or create a new one -->
<button id="help-button" class="trichat-trigger">
  Get Help
</button>

<!-- Optional: Custom CSS -->
<style>
.trichat-modal {
  --primary-color: #3B82F6;
}

.trichat-trigger {
  background-color: #3B82F6;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.trichat-trigger:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
```

**Installation Steps:**
1. Copy the generated code
2. Paste before the closing `</body>` tag in your HTML
3. Ensure your button element matches the CSS selector (`#help-button`)
4. Customize button styling as needed
5. Update the script source URL to your domain

### Inline Chat

**Complexity:** Easy | **Time:** 5-10 minutes

**Features:**
- Page integration
- Custom sizing
- Responsive design
- Content flow

**Generated Code:**
```html
<!-- TriChat Inline Widget Integration -->
<div id="trichat-inline-your-widget-id" class="trichat-inline-widget"></div>

<script>
(function() {
  window.TriChatConfig = {
    "widgetId": "your-widget-id",
    "title": "Chat with us",
    "subtitle": "We're here to help!",
    "primaryColor": "#3B82F6",
    "welcomeMessage": "Hello! How can we help you today?",
    "placeholder": "Type your message...",
    "showAvatar": true,
    "department": "general",
    "mode": "inline",
    "containerId": "trichat-inline-your-widget-id"
  };
  
  var script = document.createElement('script');
  script.src = 'https://your-domain.com/inline-widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>

<!-- Optional: Custom CSS -->
<style>
.trichat-inline-widget {
  width: 100%;
  height: 500px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
</style>
```

**Installation Steps:**
1. Copy the generated code
2. Place the `<div>` element where you want the chat to appear
3. Paste the script before the closing `</body>` tag
4. Customize the widget size and styling
5. Update the script source URL to your domain

---

## 🔌 API Integrations

### REST API

**Complexity:** Advanced | **Time:** 15-30 minutes

**Features:**
- Full control
- Custom UI
- Server-side integration
- Real-time events

**Generated Code:**
```javascript
// TriChat REST API Integration
const TRICHAT_API_BASE = 'https://your-domain.com/api/v1';
const TRICHAT_API_KEY = 'YOUR_API_KEY_HERE';

// Initialize chat session
async function initChatSession(customerData) {
  const response = await fetch(`${TRICHAT_API_BASE}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TRICHAT_API_KEY}`
    },
    body: JSON.stringify({
      widgetId: 'your-widget-id',
      customer: customerData,
      department: 'general',
      language: 'en',
      timezone: 'UTC'
    })
  });
  return response.json();
}

// Send message
async function sendMessage(sessionId, message, attachments = []) {
  const response = await fetch(`${TRICHAT_API_BASE}/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TRICHAT_API_KEY}`
    },
    body: JSON.stringify({
      message,
      attachments,
      timestamp: new Date().toISOString()
    })
  });
  return response.json();
}

// Get messages
async function getMessages(sessionId, limit = 50) {
  const response = await fetch(`${TRICHAT_API_BASE}/sessions/${sessionId}/messages?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${TRICHAT_API_KEY}`
    }
  });
  return response.json();
}

// Subscribe to real-time updates
function subscribeToUpdates(sessionId, onMessage, onStatusChange) {
  const eventSource = new EventSource(`${TRICHAT_API_BASE}/sessions/${sessionId}/stream`);
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'message') {
      onMessage(data.message);
    } else if (data.type === 'status') {
      onStatusChange(data.status);
    }
  };
  
  return eventSource;
}

// Example usage
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize session when page loads
  const session = await initChatSession({
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  // Subscribe to real-time updates
  const eventSource = subscribeToUpdates(
    session.id,
    (message) => console.log('New message:', message),
    (status) => console.log('Status changed:', status)
  );
});
```

**Installation Steps:**
1. Replace `YOUR_API_KEY_HERE` with your actual API key
2. Update `TRICHAT_API_BASE` to your domain
3. Replace `your-widget-id` with your widget ID
4. Implement your custom UI using the API functions
5. Handle real-time updates with EventSource

### Webhooks

**Complexity:** Advanced | **Time:** 10-20 minutes

**Features:**
- Real-time updates
- Event-driven
- Server notifications
- Custom workflows

**Generated Code:**
```javascript
// TriChat Webhook Configuration
const WEBHOOK_URL = 'https://your-domain.com/webhook/trichat';
const WEBHOOK_SECRET = 'your-webhook-secret-here';

// Webhook endpoint to receive TriChat events
app.post('/webhook/trichat', (req, res) => {
  const signature = req.headers['x-trichat-signature'];
  const payload = req.body;
  
  // Verify webhook signature
  if (!verifyWebhookSignature(signature, payload, WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const event = payload.event;
  
  switch (event.type) {
    case 'message.received':
      handleMessageReceived(event.data);
      break;
    case 'session.started':
      handleSessionStarted(event.data);
      break;
    case 'session.ended':
      handleSessionEnded(event.data);
      break;
    case 'customer.typing':
      handleCustomerTyping(event.data);
      break;
    case 'agent.assigned':
      handleAgentAssigned(event.data);
      break;
    default:
      console.log('Unknown event type:', event.type);
  }
  
  res.status(200).json({ received: true });
});

function verifyWebhookSignature(signature, payload, secret) {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return signature === expectedSignature;
}

function handleMessageReceived(data) {
  console.log('New message received:', data);
  // Implement your message handling logic
  // Example: Send notification, update database, trigger workflow
}

function handleSessionStarted(data) {
  console.log('Chat session started:', data);
  // Implement your session start logic
  // Example: Create ticket, assign agent, send welcome email
}

function handleSessionEnded(data) {
  console.log('Chat session ended:', data);
  // Implement your session end logic
  // Example: Close ticket, send survey, update analytics
}

function handleCustomerTyping(data) {
  console.log('Customer is typing:', data);
  // Implement your typing indicator logic
  // Example: Update UI, notify agents
}

function handleAgentAssigned(data) {
  console.log('Agent assigned:', data);
  // Implement your agent assignment logic
  // Example: Send notification, update status
}
```

**Installation Steps:**
1. Set up a webhook endpoint on your server
2. Update `WEBHOOK_URL` to your endpoint
3. Set a secure `WEBHOOK_SECRET`
4. Configure webhook URL in TriChat dashboard
5. Implement event handlers for your use case

---

## 🏪 Platform Integrations

### WordPress Plugin

**Complexity:** Easy | **Time:** 5-10 minutes

**Installation Steps:**

#### 1. Download Plugin
```bash
# Download from WordPress admin
1. Go to WordPress Admin → Plugins → Add New
2. Search for "TriChat"
3. Click "Install Now" and then "Activate"
```

#### 2. Configure Plugin
```bash
# Plugin Configuration
1. Go to WordPress Admin → TriChat → Settings
2. Enter your API key: your-widget-id
3. Configure widget settings:
   - Title: Chat with us
   - Position: bottom-right
   - Department: general
4. Save settings
```

#### 3. Add to Theme
```php
# Shortcode Usage
[trichat_widget]

# Widget Area
1. Go to Appearance → Widgets
2. Add "TriChat Widget" to your sidebar or footer
3. Configure widget settings

# PHP Code (for theme developers)
<?php echo do_shortcode('[trichat_widget]'); ?>
```

#### 4. Custom Styling
```css
/* Add to your theme's style.css */
.trichat-widget {
  --primary-color: #3B82F6;
  --widget-position: bottom-right;
}

.trichat-widget .trichat-header {
  background: #3B82F6;
}
```

### Shopify App

**Complexity:** Easy | **Time:** 10-20 minutes

**Installation Steps:**

#### 1. Install from Shopify App Store
```bash
# Installation Steps
1. Go to Shopify Admin → Apps → Visit Shopify App Store
2. Search for "TriChat"
3. Click "Add app" and follow the installation process
4. Grant necessary permissions
```

#### 2. Configure App Settings
```bash
# App Configuration
1. Go to Shopify Admin → Apps → TriChat
2. Enter your API key: your-widget-id
3. Configure widget settings:
   - Title: Chat with us
   - Position: bottom-right
   - Department: general
4. Set up product support and order tracking
5. Save configuration
```

#### 3. Customize Theme
```css
/* Add to your theme's assets/theme.css */
.trichat-widget {
  --primary-color: #3B82F6;
  --widget-position: bottom-right;
}

.trichat-widget .trichat-header {
  background: #3B82F6;
}

/* Product page integration */
.product-chat-widget {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
```

#### 4. Enable Features
```bash
# Enable Product Support
1. Go to TriChat App → Settings → Product Support
2. Enable "Show product info in chat"
3. Configure product fields to display

# Enable Order Tracking
1. Go to TriChat App → Settings → Order Tracking
2. Enable "Order lookup in chat"
3. Configure order fields to display

# Enable Customer Sync
1. Go to TriChat App → Settings → Customer Sync
2. Enable "Sync customer data"
3. Configure sync settings
```

---

## 💬 Messaging Integrations

### Slack Bot

**Complexity:** Medium | **Time:** 15-25 minutes

**Installation Steps:**

#### 1. Create Slack App
```bash
# Create Slack App
1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Enter app name: "TriChat Bot"
4. Select your workspace
5. Click "Create App"
```

#### 2. Configure Bot Settings
```bash
# Bot Configuration
1. Go to "OAuth & Permissions"
2. Add Bot Token Scopes:
   - chat:write
   - channels:read
   - users:read
   - im:write
   - mpim:write
3. Install app to workspace
4. Copy Bot User OAuth Token
```

#### 3. Set Up Webhook
```bash
# Webhook Configuration
1. Go to "Event Subscriptions"
2. Enable Events
3. Subscribe to bot events:
   - message.im
   - message.channels
4. Set Request URL: https://your-domain.com/api/slack/webhook
5. Save changes
```

#### 4. Deploy Integration
```javascript
// Slack webhook handler
app.post('/api/slack/webhook', async (req, res) => {
  const { event } = req.body;
  
  if (event.type === 'message' && !event.bot_id) {
    // Forward message to TriChat
    await forwardToTriChat({
      channel: 'slack',
      userId: event.user,
      message: event.text,
      channelId: event.channel
    });
  }
  
  res.status(200).send('OK');
});

async function forwardToTriChat(data) {
  const response = await fetch('https://your-domain.com/api/v1/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your-widget-id'
    },
    body: JSON.stringify({
      widgetId: 'your-widget-id',
      channel: data.channel,
      customer: {
        id: data.userId,
        channel: data.channel
      },
      message: data.message
    })
  });
  return response.json();
}
```

### WhatsApp Business

**Complexity:** Advanced | **Time:** 30-45 minutes

**Installation Steps:**

#### 1. Set Up WhatsApp Business API
```bash
# WhatsApp Business Setup
1. Go to https://business.whatsapp.com/
2. Create a WhatsApp Business account
3. Apply for WhatsApp Business API access
4. Wait for approval (can take 1-2 weeks)
```

#### 2. Configure Webhook
```bash
# Webhook Configuration
1. Set up webhook endpoint on your server
2. Configure webhook URL in WhatsApp Business API
3. Verify webhook signature
4. Handle incoming messages
```

#### 3. Implement Message Handling
```javascript
// WhatsApp webhook handler
app.post('/api/whatsapp/webhook', async (req, res) => {
  const { entry } = req.body;
  
  for (const e of entry) {
    for (const change of e.changes) {
      if (change.value.messages) {
        for (const message of change.value.messages) {
          await handleWhatsAppMessage(message);
        }
      }
    }
  }
  
  res.status(200).send('OK');
});

async function handleWhatsAppMessage(message) {
  // Forward to TriChat
  await forwardToTriChat({
    channel: 'whatsapp',
    userId: message.from,
    message: message.text.body,
    messageId: message.id
  });
}
```

---

## 📱 Mobile Integrations

### Mobile SDK

**Complexity:** Advanced | **Time:** 30-60 minutes

**Installation Steps:**

#### 1. Install SDK

**iOS (CocoaPods):**
```ruby
# Add to Podfile
pod 'TriChatSDK', '~> 1.0.0'

# Install
pod install
```

**Android (Gradle):**
```gradle
# Add to build.gradle
implementation 'com.trichat:sdk:1.0.0'
```

#### 2. Initialize SDK

**iOS (Swift):**
```swift
import TriChatSDK

// Initialize in AppDelegate
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    TriChat.initialize(
        apiKey: "your-widget-id",
        config: TriChatConfig(
            title: "Chat with us",
            primaryColor: "#3B82F6",
            department: "general"
        )
    )
    return true
}
```

**Android (Kotlin):**
```kotlin
import com.trichat.sdk.TriChat

// Initialize in Application class
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        TriChat.initialize(
            apiKey = "your-widget-id",
            config = TriChatConfig(
                title = "Chat with us",
                primaryColor = "#3B82F6",
                department = "general"
            )
        )
    }
}
```

#### 3. Add Chat UI

**iOS (Swift):**
```swift
import TriChatSDK

class ChatViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Present chat
        TriChat.presentChat(
            from: self,
            customer: Customer(
                id: "user123",
                name: "John Doe",
                email: "john@example.com"
            )
        )
    }
}
```

**Android (Kotlin):**
```kotlin
import com.trichat.sdk.TriChat

class ChatActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Start chat
        TriChat.startChat(
            context = this,
            customer = Customer(
                id = "user123",
                name = "John Doe",
                email = "john@example.com"
            )
        )
    }
}
```

#### 4. Handle Push Notifications

**iOS (Swift):**
```swift
// Add to AppDelegate
func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    TriChat.registerForPushNotifications(deviceToken: deviceToken)
}

func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any]) {
    TriChat.handlePushNotification(userInfo: userInfo)
}
```

**Android (Kotlin):**
```kotlin
// Add to FirebaseMessagingService
class MyFirebaseMessagingService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        TriChat.registerForPushNotifications(token)
    }
    
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        TriChat.handlePushNotification(remoteMessage.data)
    }
}
```

---

## 🔧 Common Configuration

### Environment Variables
```bash
# Required for all integrations
VITE_WIDGET_BASE_URL=https://your-domain.com
VITE_WIDGET_API_KEY=your-widget-api-key
VITE_WIDGET_WEBHOOK_SECRET=your-webhook-secret

# Optional for file uploads
VITE_FILE_UPLOAD_ENABLED=true
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
```

### Security Considerations
- Always use HTTPS in production
- Validate webhook signatures
- Implement rate limiting
- Use secure API keys
- Enable CORS properly
- Validate user input

### Performance Optimization
- Use CDN for static assets
- Implement caching strategies
- Optimize image uploads
- Use lazy loading
- Monitor API usage

### Troubleshooting
- Check browser console for errors
- Verify API key configuration
- Test webhook endpoints
- Check network connectivity
- Review server logs

---

## 📞 Support

For technical support and questions:
- **Documentation:** Check this guide and inline code comments
- **Issues:** Report bugs via GitHub issues
- **Community:** Join our developer community
- **Enterprise:** Contact our enterprise support team

---

**TriChat Integration Guides** - Complete setup instructions for all integration types. 