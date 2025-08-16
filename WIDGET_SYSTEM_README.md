# TriChat Widget System

A comprehensive, production-ready chat widget system for integrating TriChat into any website or application.

## 🚀 Features

### **Integration Types**
- **Floating Widget**: Always visible chat widget
- **Button Trigger**: Opens when users click your help button
- **Inline Chat**: Embedded directly in page content
- **Popup Modal**: Centered modal window
- **Fullscreen Chat**: Takes over entire browser window
- **iFrame Embed**: Cross-domain iframe integration
- **REST API**: Full control via API endpoints
- **Webhooks**: Real-time event notifications
- **React Component**: Pre-built React component
- **Platform Integrations**: WordPress, Shopify, etc.
- **Messaging Apps**: Slack, Teams, WhatsApp, etc.
- **Mobile SDK**: Native mobile app integration

### **Configuration Options**

#### **General Settings**
- Chat title and subtitle
- Welcome message customization
- Department routing
- Language and timezone settings
- Company branding
- Advanced features (typing indicators, ratings, file uploads)

#### **Appearance**
- Color scheme customization
- Position and layout options
- Typography settings
- Animation effects
- Custom CSS support
- Dark mode support
- Responsive design

#### **Behavior**
- Auto-open triggers
- Working hours configuration
- Auto-responders
- Sound and desktop notifications
- Advanced interaction settings

### **Production Features**
- Real-time chat functionality
- File upload support
- Typing indicators
- Conversation ratings
- Agent assignment
- Analytics tracking
- Webhook integration
- Custom fields
- Multi-language support

## 🛠️ Setup Instructions

### 1. Database Setup

Run the widget schema in your Supabase database:

```sql
-- Execute the WIDGET_SCHEMA.sql file
-- This creates all necessary tables and functions
```

### 2. Environment Variables

Add these to your `.env` file:

```env
# Widget System
VITE_WIDGET_BASE_URL=https://your-domain.com
VITE_WIDGET_API_KEY=your-widget-api-key
VITE_WIDGET_WEBHOOK_SECRET=your-webhook-secret

# File Upload (if using)
VITE_FILE_UPLOAD_ENABLED=true
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
```

### 3. Component Integration

The widget system is integrated into the admin dashboard. Access it via:

```
/admin/widget-generator
```

## 📋 Usage Guide

### **Creating a Widget**

1. **Select Integration Type**
   - Choose from web, API, platform, messaging, or mobile integrations
   - Each type has different complexity levels and features

2. **Configure General Settings**
   - Set chat title, subtitle, and welcome message
   - Choose department for routing
   - Configure language and timezone
   - Add company branding

3. **Customize Appearance**
   - Choose colors and theme
   - Set position and layout
   - Configure typography
   - Add animations and effects
   - Include custom CSS

4. **Set Behavior Rules**
   - Configure auto-open triggers
   - Set working hours
   - Add auto-responders
   - Enable notifications

5. **Generate Code**
   - Click "Generate Code" to create integration code
   - Copy or download the generated code
   - Integrate into your website/application

### **Widget Management**

#### **Dashboard Features**
- View all created widgets
- Monitor widget analytics
- Manage widget status (active/inactive/draft)
- Share widgets with team members
- Track conversation metrics

#### **Analytics**
- Total conversations
- Message count
- Response times
- Satisfaction scores
- Resolution rates
- Visitor tracking

### **Advanced Configuration**

#### **Custom Fields**
Add custom form fields to collect additional customer information:

```typescript
const customFields = [
  {
    id: 'company',
    label: 'Company Name',
    type: 'text',
    required: false
  },
  {
    id: 'priority',
    label: 'Priority Level',
    type: 'select',
    required: true,
    options: ['Low', 'Medium', 'High', 'Urgent']
  }
];
```

#### **Auto-Responders**
Configure automatic responses for different scenarios:

```typescript
const autoResponders = [
  {
    trigger: 'welcome',
    response: 'Welcome! How can we help you today?',
    enabled: true
  },
  {
    trigger: 'offline',
    response: 'We\'re currently offline. We\'ll respond within 24 hours.',
    enabled: true
  }
];
```

#### **Working Hours**
Set up business hours for automatic offline messages:

```typescript
const workingHours = {
  enabled: true,
  timezone: 'America/New_York',
  schedule: {
    monday: { start: '09:00', end: '17:00', enabled: true },
    tuesday: { start: '09:00', end: '17:00', enabled: true },
    // ... other days
  }
};
```

## 🔧 API Integration

### **REST API Endpoints**

```typescript
// Initialize chat session
POST /api/v1/sessions
{
  "widgetId": "your-widget-id",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "department": "general"
}

// Send message
POST /api/v1/sessions/{sessionId}/messages
{
  "message": "Hello, I need help",
  "attachments": []
}

// Get messages
GET /api/v1/sessions/{sessionId}/messages?limit=50

// Subscribe to real-time updates
GET /api/v1/sessions/{sessionId}/stream
```

### **Webhook Events**

Configure webhooks to receive real-time events:

```typescript
// Webhook endpoint
POST /your-webhook-endpoint
{
  "event": "message.received",
  "data": {
    "sessionId": "session-id",
    "message": "Customer message",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 🎨 Customization

### **Custom CSS**

Add custom styling to match your brand:

```css
.trichat-widget {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.trichat-message {
  font-family: 'Your Custom Font', sans-serif;
}

.trichat-button {
  background: linear-gradient(45deg, #your-color-1, #your-color-2);
}
```

### **Theme Integration**

The widget automatically adapts to your website's theme:

- Light/dark mode detection
- Color scheme matching
- Font family inheritance
- Responsive design

## 📊 Analytics & Monitoring

### **Real-time Metrics**
- Active conversations
- Response times
- Customer satisfaction
- Agent performance
- Department workload

### **Export & Reporting**
- Conversation history
- Performance reports
- Customer feedback
- Agent analytics
- Department metrics

## 🔒 Security & Privacy

### **Data Protection**
- End-to-end encryption
- GDPR compliance
- Data retention policies
- Secure file uploads
- Privacy controls

### **Access Control**
- Role-based permissions
- API key management
- Webhook signature verification
- Rate limiting
- IP whitelisting

## 🚀 Deployment

### **Production Checklist**

- [ ] Database schema deployed
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] CDN configured for assets
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented
- [ ] Performance optimization completed
- [ ] Security audit passed

### **Performance Optimization**

- Widget assets cached via CDN
- Lazy loading for non-critical features
- Image optimization
- Code minification
- Database query optimization

## 🐛 Troubleshooting

### **Common Issues**

1. **Widget not appearing**
   - Check if widget is active
   - Verify CSS selectors
   - Check browser console for errors

2. **Messages not sending**
   - Verify API key configuration
   - Check network connectivity
   - Review server logs

3. **Styling issues**
   - Check custom CSS syntax
   - Verify CSS specificity
   - Test in different browsers

### **Debug Mode**

Enable debug mode for detailed logging:

```javascript
window.TriChatConfig = {
  ...config,
  debug: true
};
```

## 📞 Support

For technical support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub issues
- **Community**: Join our developer community
- **Enterprise**: Contact our enterprise support team

## 🔄 Updates & Maintenance

### **Version Updates**
- Regular security patches
- Feature enhancements
- Performance improvements
- Bug fixes

### **Migration Guide**
- Backward compatibility maintained
- Migration scripts provided
- Documentation updated
- Support for legacy versions

---

**TriChat Widget System** - Production-ready chat integration for modern applications. 