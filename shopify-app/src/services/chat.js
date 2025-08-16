import { Shopify } from '@shopify/shopify-api';
import { v4 as uuidv4 } from 'uuid';
import { uploadToStorage } from '../utils/storage.js';
import { db } from '../database/connection.js';

export class ChatService {
  constructor() {
    this.db = db;
  }

  // Create a new conversation
  async createConversation(shop, { customerId, initialMessage, customerInfo }) {
    const conversationId = uuidv4();
    const conversation = {
      id: conversationId,
      shop,
      customerId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      customerInfo: customerInfo || {},
      messageCount: 0,
      lastMessageAt: new Date()
    };

    // Save conversation to database
    await this.db.collection('conversations').insertOne(conversation);

    // If there's an initial message, save it
    if (initialMessage) {
      await this.saveMessage({
        shop,
        conversationId,
        content: initialMessage,
        type: 'text',
        sender: 'customer',
        customerId,
        timestamp: new Date()
      });
    }

    return conversation;
  }

  // Get conversations for a shop
  async getConversations(shop, { status, page = 1, limit = 20 }) {
    const filter = { shop };
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    
    const conversations = await this.db.collection('conversations')
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await this.db.collection('conversations').countDocuments(filter);

    return {
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get a specific conversation
  async getConversation(shop, conversationId) {
    return await this.db.collection('conversations').findOne({
      shop,
      id: conversationId
    });
  }

  // Update conversation status
  async updateConversationStatus(shop, conversationId, status, agentId = null) {
    const update = {
      status,
      updatedAt: new Date()
    };

    if (agentId) {
      update.assignedAgentId = agentId;
    }

    const result = await this.db.collection('conversations').updateOne(
      { shop, id: conversationId },
      { $set: update }
    );

    if (result.modifiedCount === 0) {
      throw new Error('Conversation not found');
    }

    return await this.getConversation(shop, conversationId);
  }

  // Save a message
  async saveMessage({ shop, conversationId, content, type, sender, customerId, agentId, fileName, fileSize, timestamp }) {
    const message = {
      id: uuidv4(),
      shop,
      conversationId,
      content,
      type,
      sender,
      customerId,
      agentId,
      fileName,
      fileSize,
      timestamp: timestamp || new Date(),
      createdAt: new Date()
    };

    // Save message to database
    await this.db.collection('messages').insertOne(message);

    // Update conversation
    await this.db.collection('conversations').updateOne(
      { shop, id: conversationId },
      {
        $set: {
          updatedAt: new Date(),
          lastMessageAt: message.timestamp
        },
        $inc: { messageCount: 1 }
      }
    );

    return message;
  }

  // Get messages for a conversation
  async getMessages(shop, conversationId, { page = 1, limit = 50 }) {
    const skip = (page - 1) * limit;
    
    const messages = await this.db.collection('messages')
      .find({ shop, conversationId })
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await this.db.collection('messages').countDocuments({
      shop,
      conversationId
    });

    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Upload file
  async uploadFile(file) {
    try {
      const fileUrl = await uploadToStorage(file);
      return fileUrl;
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error('Failed to upload file');
    }
  }

  // Get chat settings
  async getChatSettings(shop) {
    const settings = await this.db.collection('chat_settings').findOne({ shop });
    
    if (!settings) {
      // Return default settings
      return {
        shop,
        enabled: true,
        widgetTitle: 'Chat with us',
        widgetSubtitle: 'We\'re here to help!',
        primaryColor: '#3B82F6',
        position: 'bottom-right',
        welcomeMessage: 'Hello! How can we help you today?',
        placeholder: 'Type your message...',
        showAvatar: true,
        autoOpen: false,
        enableFileUpload: true,
        maxFileSize: 10,
        allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        workingHours: {
          enabled: false,
          timezone: 'UTC',
          schedule: {
            monday: { start: '09:00', end: '17:00', enabled: true },
            tuesday: { start: '09:00', end: '17:00', enabled: true },
            wednesday: { start: '09:00', end: '17:00', enabled: true },
            thursday: { start: '09:00', end: '17:00', enabled: true },
            friday: { start: '09:00', end: '17:00', enabled: true },
            saturday: { start: '10:00', end: '15:00', enabled: false },
            sunday: { start: '10:00', end: '15:00', enabled: false }
          }
        },
        autoResponders: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    return settings;
  }

  // Update chat settings
  async updateChatSettings(shop, settings) {
    const updateData = {
      ...settings,
      shop,
      updatedAt: new Date()
    };

    const result = await this.db.collection('chat_settings').updateOne(
      { shop },
      { $set: updateData },
      { upsert: true }
    );

    return updateData;
  }

  // Generate widget code
  async generateWidgetCode(shop) {
    const settings = await this.getChatSettings(shop);
    
    const widgetCode = `
<!-- TriChat Widget -->
<script>
(function() {
  window.TriChatConfig = {
    shop: "${shop}",
    title: "${settings.widgetTitle}",
    subtitle: "${settings.widgetSubtitle}",
    primaryColor: "${settings.primaryColor}",
    position: "${settings.position}",
    welcomeMessage: "${settings.welcomeMessage}",
    placeholder: "${settings.placeholder}",
    showAvatar: ${settings.showAvatar},
    autoOpen: ${settings.autoOpen},
    enableFileUpload: ${settings.enableFileUpload},
    maxFileSize: ${settings.maxFileSize},
    allowedFileTypes: ${JSON.stringify(settings.allowedFileTypes)},
    workingHours: ${JSON.stringify(settings.workingHours)}
  };
  
  // Load TriChat script
  var script = document.createElement('script');
  script.src = '${process.env.APP_URL}/widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>`;

    return widgetCode;
  }

  // Install widget in Shopify theme
  async installWidget(shop, themeId) {
    try {
      const session = await this.getShopifySession(shop);
      const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
      
      const widgetCode = await this.generateWidgetCode(shop);
      
      // Create script tag
      await client.post({
        path: 'script_tags',
        data: {
          script_tag: {
            event: 'onload',
            src: `${process.env.APP_URL}/widget.js`,
            display_scope: 'online_store'
          }
        }
      });

      // Save installation record
      await this.db.collection('widget_installations').insertOne({
        shop,
        themeId,
        installedAt: new Date(),
        status: 'active'
      });

      return true;
    } catch (error) {
      console.error('Install widget error:', error);
      throw new Error('Failed to install widget');
    }
  }

  // Uninstall widget from Shopify theme
  async uninstallWidget(shop, themeId) {
    try {
      const session = await this.getShopifySession(shop);
      const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
      
      // Get script tags
      const response = await client.get({
        path: 'script_tags'
      });

      // Find and delete TriChat script tag
      const scriptTag = response.body.script_tags.find(
        tag => tag.src.includes('widget.js')
      );

      if (scriptTag) {
        await client.delete({
          path: `script_tags/${scriptTag.id}`
        });
      }

      // Update installation record
      await this.db.collection('widget_installations').updateOne(
        { shop, themeId },
        { $set: { status: 'inactive', uninstalledAt: new Date() } }
      );

      return true;
    } catch (error) {
      console.error('Uninstall widget error:', error);
      throw new Error('Failed to uninstall widget');
    }
  }

  // Get Shopify session
  async getShopifySession(shop) {
    // This would typically come from your session storage
    // For now, we'll use a placeholder
    return {
      shop,
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN
    };
  }

  // Get conversation statistics
  async getConversationStats(shop, { startDate, endDate }) {
    const filter = { shop };
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await this.db.collection('conversations').aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalConversations: { $sum: 1 },
          activeConversations: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          resolvedConversations: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          averageResponseTime: { $avg: '$responseTime' }
        }
      }
    ]).toArray();

    return stats[0] || {
      totalConversations: 0,
      activeConversations: 0,
      resolvedConversations: 0,
      averageResponseTime: 0
    };
  }
} 