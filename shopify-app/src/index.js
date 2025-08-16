import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Shopify } from '@shopify/shopify-api';
import { shopifyApp } from '@shopify/shopify-app-express';
import { restResources } from '@shopify/shopify-api/rest/admin/2023-10';
import { LATEST_API_VERSION } from '@shopify/shopify-api';
import { MemorySessionStorage } from '@shopify/shopify-app-session-storage-memory';

// Import routes
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import webhookRoutes from './routes/webhooks.js';
import adminRoutes from './routes/admin.js';
import customerRoutes from './routes/customer.js';
import analyticsRoutes from './routes/analytics.js';

// Import middleware
import { authenticateShopify } from './middleware/auth.js';
import { errorHandler } from './middleware/error.js';
import { rateLimiter } from './middleware/rateLimit.js';

// Import services
import { ChatService } from './services/chat.js';
import { CustomerService } from './services/customer.js';
import { AnalyticsService } from './services/analytics.js';
import { NotificationService } from './services/notifications.js';

// Import database
import { connectDatabase } from './database/connection.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Initialize Shopify API
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_SCOPES?.split(',') || [
    'read_products',
    'write_products',
    'read_orders',
    'write_orders',
    'read_customers',
    'write_customers',
    'read_script_tags',
    'write_script_tags',
    'read_themes',
    'write_themes'
  ],
  hostName: process.env.HOST?.replace(/https:\/\//, '') || 'localhost:3000',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  sessionStorage: new MemorySessionStorage(),
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks/app-uninstalled'
    },
    CUSTOMERS_CREATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks/customers-create'
    },
    ORDERS_CREATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks/orders-create'
    },
    ORDERS_UPDATED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks/orders-updated'
    }
  }
});

// Connect to database
connectDatabase();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Static files
app.use(express.static('public'));

// Shopify app middleware
app.use(shopify.cspHeaders());
app.use(shopify.validateAuthenticatedSession());

// Routes
app.use('/auth', authRoutes);
app.use('/api/chat', authenticateShopify, chatRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/admin', authenticateShopify, adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/analytics', authenticateShopify, analyticsRoutes);

// Socket.IO for real-time chat
const chatService = new ChatService();
const customerService = new CustomerService();
const analyticsService = new AnalyticsService();
const notificationService = new NotificationService();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join chat room
  socket.on('join-chat', async (data) => {
    const { shop, customerId, conversationId } = data;
    const room = `${shop}-${conversationId}`;
    socket.join(room);
    
    // Update customer status
    await customerService.updateCustomerStatus(customerId, 'online');
    
    socket.emit('joined-chat', { room, conversationId });
  });

  // Handle new message
  socket.on('send-message', async (data) => {
    const { shop, customerId, conversationId, message, type = 'text' } = data;
    const room = `${shop}-${conversationId}`;
    
    try {
      // Save message to database
      const savedMessage = await chatService.saveMessage({
        shop,
        customerId,
        conversationId,
        content: message,
        type,
        sender: 'customer',
        timestamp: new Date()
      });

      // Broadcast to all clients in room
      io.to(room).emit('new-message', {
        id: savedMessage.id,
        content: message,
        type,
        sender: 'customer',
        timestamp: savedMessage.timestamp,
        customerId
      });

      // Send notification to agents
      await notificationService.notifyAgents(shop, {
        type: 'new_message',
        conversationId,
        customerId,
        message: message.substring(0, 100) + (message.length > 100 ? '...' : '')
      });

      // Track analytics
      await analyticsService.trackMessage(shop, {
        conversationId,
        customerId,
        messageType: type,
        timestamp: savedMessage.timestamp
      });

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle agent response
  socket.on('agent-response', async (data) => {
    const { shop, conversationId, message, agentId } = data;
    const room = `${shop}-${conversationId}`;
    
    try {
      // Save agent message
      const savedMessage = await chatService.saveMessage({
        shop,
        conversationId,
        content: message,
        type: 'text',
        sender: 'agent',
        agentId,
        timestamp: new Date()
      });

      // Broadcast to customer
      io.to(room).emit('agent-message', {
        id: savedMessage.id,
        content: message,
        sender: 'agent',
        agentId,
        timestamp: savedMessage.timestamp
      });

      // Track analytics
      await analyticsService.trackAgentResponse(shop, {
        conversationId,
        agentId,
        responseTime: Date.now() - savedMessage.timestamp,
        timestamp: savedMessage.timestamp
      });

    } catch (error) {
      console.error('Error sending agent response:', error);
      socket.emit('error', { message: 'Failed to send response' });
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    const { shop, conversationId, sender } = data;
    const room = `${shop}-${conversationId}`;
    socket.to(room).emit('typing-indicator', { sender, typing: true });
  });

  socket.on('typing-stop', (data) => {
    const { shop, conversationId, sender } = data;
    const room = `${shop}-${conversationId}`;
    socket.to(room).emit('typing-indicator', { sender, typing: false });
  });

  // Handle file uploads
  socket.on('file-upload', async (data) => {
    const { shop, customerId, conversationId, file } = data;
    const room = `${shop}-${conversationId}`;
    
    try {
      // Upload file to storage
      const fileUrl = await chatService.uploadFile(file);
      
      // Save file message
      const savedMessage = await chatService.saveMessage({
        shop,
        customerId,
        conversationId,
        content: fileUrl,
        type: 'file',
        sender: 'customer',
        fileName: file.name,
        fileSize: file.size,
        timestamp: new Date()
      });

      // Broadcast file message
      io.to(room).emit('new-message', {
        id: savedMessage.id,
        content: fileUrl,
        type: 'file',
        sender: 'customer',
        fileName: file.name,
        fileSize: file.size,
        timestamp: savedMessage.timestamp,
        customerId
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      socket.emit('error', { message: 'Failed to upload file' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    console.log('Client disconnected:', socket.id);
    
    // Update customer status to offline
    const rooms = Array.from(socket.rooms);
    for (const room of rooms) {
      if (room !== socket.id) {
        const [shop, conversationId] = room.split('-');
        // You might want to store customer ID in socket data for this
        // await customerService.updateCustomerStatus(customerId, 'offline');
      }
    }
  });
});

// Error handling
app.use(errorHandler);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile('public/index.html', { root: '.' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 TriChat Shopify App running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 App URL: ${process.env.HOST || `http://localhost:${PORT}`}`);
});

export default app; 