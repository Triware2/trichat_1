import express from 'express';
import { ChatService } from '../services/chat.js';
import { CustomerService } from '../services/customer.js';
import { AnalyticsService } from '../services/analytics.js';
import { NotificationService } from '../services/notifications.js';

const router = express.Router();
const chatService = new ChatService();
const customerService = new CustomerService();
const analyticsService = new AnalyticsService();
const notificationService = new NotificationService();

// Get all conversations for a shop
router.get('/conversations', async (req, res) => {
  try {
    const { shop } = req.session;
    const { status, page = 1, limit = 20 } = req.query;
    
    const conversations = await chatService.getConversations(shop, {
      status,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Get a specific conversation
router.get('/conversations/:conversationId', async (req, res) => {
  try {
    const { shop } = req.session;
    const { conversationId } = req.params;
    
    const conversation = await chatService.getConversation(shop, conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json(conversation);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

// Create a new conversation
router.post('/conversations', async (req, res) => {
  try {
    const { shop } = req.session;
    const { customerId, initialMessage, customerInfo } = req.body;
    
    const conversation = await chatService.createConversation(shop, {
      customerId,
      initialMessage,
      customerInfo
    });
    
    // Track conversation start
    await analyticsService.trackConversationStart(shop, {
      conversationId: conversation.id,
      customerId,
      timestamp: conversation.createdAt
    });
    
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Update conversation status
router.patch('/conversations/:conversationId/status', async (req, res) => {
  try {
    const { shop } = req.session;
    const { conversationId } = req.params;
    const { status, agentId } = req.body;
    
    const conversation = await chatService.updateConversationStatus(
      shop, 
      conversationId, 
      status, 
      agentId
    );
    
    res.json(conversation);
  } catch (error) {
    console.error('Update conversation status error:', error);
    res.status(500).json({ error: 'Failed to update conversation status' });
  }
});

// Get messages for a conversation
router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { shop } = req.session;
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await chatService.getMessages(shop, conversationId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send a message (agent response)
router.post('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { shop } = req.session;
    const { conversationId } = req.params;
    const { content, type = 'text', agentId } = req.body;
    
    const message = await chatService.saveMessage({
      shop,
      conversationId,
      content,
      type,
      sender: 'agent',
      agentId,
      timestamp: new Date()
    });
    
    // Track agent response
    await analyticsService.trackAgentResponse(shop, {
      conversationId,
      agentId,
      messageType: type,
      timestamp: message.timestamp
    });
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get customer information
router.get('/customers/:customerId', async (req, res) => {
  try {
    const { shop } = req.session;
    const { customerId } = req.params;
    
    const customer = await customerService.getCustomer(shop, customerId);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Failed to get customer' });
  }
});

// Update customer information
router.patch('/customers/:customerId', async (req, res) => {
  try {
    const { shop } = req.session;
    const { customerId } = req.params;
    const customerData = req.body;
    
    const customer = await customerService.updateCustomer(shop, customerId, customerData);
    
    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Get chat settings
router.get('/settings', async (req, res) => {
  try {
    const { shop } = req.session;
    
    const settings = await chatService.getChatSettings(shop);
    
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// Update chat settings
router.put('/settings', async (req, res) => {
  try {
    const { shop } = req.session;
    const settings = req.body;
    
    const updatedSettings = await chatService.updateChatSettings(shop, settings);
    
    res.json(updatedSettings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get chat analytics
router.get('/analytics', async (req, res) => {
  try {
    const { shop } = req.session;
    const { startDate, endDate, period = '7d' } = req.query;
    
    const analytics = await analyticsService.getChatAnalytics(shop, {
      startDate,
      endDate,
      period
    });
    
    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Upload file
router.post('/upload', async (req, res) => {
  try {
    const { shop } = req.session;
    const { file } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    const fileUrl = await chatService.uploadFile(file);
    
    res.json({ fileUrl });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get chat widget code
router.get('/widget-code', async (req, res) => {
  try {
    const { shop } = req.session;
    
    const widgetCode = await chatService.generateWidgetCode(shop);
    
    res.json({ widgetCode });
  } catch (error) {
    console.error('Get widget code error:', error);
    res.status(500).json({ error: 'Failed to get widget code' });
  }
});

// Install chat widget
router.post('/install-widget', async (req, res) => {
  try {
    const { shop } = req.session;
    const { themeId } = req.body;
    
    await chatService.installWidget(shop, themeId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Install widget error:', error);
    res.status(500).json({ error: 'Failed to install widget' });
  }
});

// Uninstall chat widget
router.post('/uninstall-widget', async (req, res) => {
  try {
    const { shop } = req.session;
    const { themeId } = req.body;
    
    await chatService.uninstallWidget(shop, themeId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Uninstall widget error:', error);
    res.status(500).json({ error: 'Failed to uninstall widget' });
  }
});

export default router; 