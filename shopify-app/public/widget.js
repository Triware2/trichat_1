/**
 * TriChat Widget - Live Chat for Shopify
 * Version: 2.1.0
 * 
 * This widget provides real-time chat functionality for Shopify stores.
 * It integrates seamlessly with the store's design and provides
 * customer support capabilities.
 */

(function() {
  'use strict';

  // Configuration
  const config = window.TriChatConfig || {
    shop: '',
    title: 'Chat with us',
    subtitle: 'We\'re here to help!',
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
      schedule: {}
    }
  };

  // Widget state
  let widgetState = {
    isOpen: false,
    isMinimized: false,
    isTyping: false,
    customerId: null,
    conversationId: null,
    socket: null,
    messages: [],
    unreadCount: 0
  };

  // DOM elements
  let elements = {
    container: null,
    button: null,
    chatWindow: null,
    header: null,
    messagesContainer: null,
    inputContainer: null,
    input: null,
    sendButton: null,
    fileInput: null,
    typingIndicator: null,
    minimizeButton: null,
    closeButton: null
  };

  // Initialize widget
  function init() {
    createWidget();
    setupEventListeners();
    generateCustomerId();
    checkWorkingHours();
    
    if (config.autoOpen) {
      setTimeout(openChat, 1000);
    }
  }

  // Create widget HTML
  function createWidget() {
    // Create main container
    elements.container = document.createElement('div');
    elements.container.id = 'trichat-widget';
    elements.container.className = `trichat-widget trichat-widget--${config.position}`;
    elements.container.style.cssText = `
      position: fixed;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      color: #333;
    `;

    // Create chat button
    elements.button = document.createElement('div');
    elements.button.className = 'trichat-button';
    elements.button.innerHTML = `
      <div class="trichat-button__icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor"/>
        </svg>
      </div>
      <div class="trichat-button__badge" style="display: none;">0</div>
    `;
    elements.button.style.cssText = `
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${config.primaryColor};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      position: relative;
    `;

    // Create chat window
    elements.chatWindow = document.createElement('div');
    elements.chatWindow.className = 'trichat-chat-window';
    elements.chatWindow.style.cssText = `
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    `;

    // Create header
    elements.header = document.createElement('div');
    elements.header.className = 'trichat-header';
    elements.header.innerHTML = `
      <div class="trichat-header__info">
        <div class="trichat-header__title">${config.title}</div>
        <div class="trichat-header__subtitle">${config.subtitle}</div>
      </div>
      <div class="trichat-header__actions">
        <button class="trichat-minimize-btn" title="Minimize">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="trichat-close-btn" title="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;
    elements.header.style.cssText = `
      background: ${config.primaryColor};
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    `;

    // Create messages container
    elements.messagesContainer = document.createElement('div');
    elements.messagesContainer.className = 'trichat-messages';
    elements.messagesContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f9fafb;
    `;

    // Create input container
    elements.inputContainer = document.createElement('div');
    elements.inputContainer.className = 'trichat-input-container';
    elements.inputContainer.style.cssText = `
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      background: white;
      flex-shrink: 0;
    `;

    // Create input
    elements.input = document.createElement('textarea');
    elements.input.className = 'trichat-input';
    elements.input.placeholder = config.placeholder;
    elements.input.style.cssText = `
      width: 100%;
      min-height: 40px;
      max-height: 120px;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      resize: none;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.4;
      outline: none;
      transition: border-color 0.2s ease;
    `;

    // Create send button
    elements.sendButton = document.createElement('button');
    elements.sendButton.className = 'trichat-send-btn';
    elements.sendButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    elements.sendButton.style.cssText = `
      position: absolute;
      right: 8px;
      bottom: 8px;
      width: 24px;
      height: 24px;
      background: ${config.primaryColor};
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
    `;

    // Create file input
    elements.fileInput = document.createElement('input');
    elements.fileInput.type = 'file';
    elements.fileInput.accept = config.allowedFileTypes.join(',');
    elements.fileInput.style.display = 'none';

    // Create typing indicator
    elements.typingIndicator = document.createElement('div');
    elements.typingIndicator.className = 'trichat-typing-indicator';
    elements.typingIndicator.innerHTML = `
      <div class="trichat-typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span>Agent is typing...</span>
    `;
    elements.typingIndicator.style.cssText = `
      display: none;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: white;
      border-radius: 8px;
      margin-bottom: 8px;
      font-size: 12px;
      color: #6b7280;
    `;

    // Assemble widget
    elements.inputContainer.appendChild(elements.input);
    elements.inputContainer.appendChild(elements.sendButton);
    elements.inputContainer.appendChild(elements.fileInput);
    
    elements.chatWindow.appendChild(elements.header);
    elements.chatWindow.appendChild(elements.messagesContainer);
    elements.chatWindow.appendChild(elements.inputContainer);
    
    elements.container.appendChild(elements.button);
    elements.container.appendChild(elements.chatWindow);
    
    document.body.appendChild(elements.container);

    // Add welcome message
    addMessage({
      type: 'text',
      content: config.welcomeMessage,
      sender: 'agent',
      timestamp: new Date()
    });
  }

  // Setup event listeners
  function setupEventListeners() {
    // Button click
    elements.button.addEventListener('click', toggleChat);
    
    // Minimize button
    elements.header.querySelector('.trichat-minimize-btn').addEventListener('click', minimizeChat);
    
    // Close button
    elements.header.querySelector('.trichat-close-btn').addEventListener('click', closeChat);
    
    // Send button
    elements.sendButton.addEventListener('click', sendMessage);
    
    // Input events
    elements.input.addEventListener('keydown', handleInputKeydown);
    elements.input.addEventListener('input', handleInputResize);
    
    // File input
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // Click outside to close
    document.addEventListener('click', handleClickOutside);
  }

  // Generate customer ID
  function generateCustomerId() {
    let customerId = localStorage.getItem('trichat_customer_id');
    if (!customerId) {
      customerId = 'customer_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('trichat_customer_id', customerId);
    }
    widgetState.customerId = customerId;
  }

  // Check working hours
  function checkWorkingHours() {
    if (!config.workingHours.enabled) return true;
    
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    
    const schedule = config.workingHours.schedule[day];
    if (!schedule || !schedule.enabled) return false;
    
    return time >= schedule.start && time <= schedule.end;
  }

  // Toggle chat
  function toggleChat() {
    if (widgetState.isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  // Open chat
  function openChat() {
    if (!checkWorkingHours()) {
      showOfflineMessage();
      return;
    }
    
    widgetState.isOpen = true;
    widgetState.isMinimized = false;
    
    elements.chatWindow.style.display = 'flex';
    elements.button.style.display = 'none';
    
    // Connect to WebSocket
    connectWebSocket();
    
    // Focus input
    setTimeout(() => {
      elements.input.focus();
    }, 100);
  }

  // Close chat
  function closeChat() {
    widgetState.isOpen = false;
    widgetState.isMinimized = false;
    
    elements.chatWindow.style.display = 'none';
    elements.button.style.display = 'flex';
    
    // Disconnect WebSocket
    if (widgetState.socket) {
      widgetState.socket.close();
      widgetState.socket = null;
    }
  }

  // Minimize chat
  function minimizeChat() {
    widgetState.isMinimized = true;
    elements.chatWindow.style.display = 'none';
    elements.button.style.display = 'flex';
  }

  // Connect WebSocket
  function connectWebSocket() {
    if (widgetState.socket) return;
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/socket.io/?shop=${config.shop}&customerId=${widgetState.customerId}`;
    
    widgetState.socket = io(wsUrl);
    
    widgetState.socket.on('connect', () => {
      console.log('Connected to TriChat');
    });
    
    widgetState.socket.on('new-message', (message) => {
      addMessage(message);
      updateUnreadCount();
    });
    
    widgetState.socket.on('typing-indicator', (data) => {
      showTypingIndicator(data.typing);
    });
    
    widgetState.socket.on('disconnect', () => {
      console.log('Disconnected from TriChat');
    });
  }

  // Send message
  function sendMessage() {
    const content = elements.input.value.trim();
    if (!content) return;
    
    const message = {
      type: 'text',
      content: content,
      sender: 'customer',
      timestamp: new Date()
    };
    
    addMessage(message);
    elements.input.value = '';
    handleInputResize();
    
    // Send via WebSocket
    if (widgetState.socket) {
      widgetState.socket.emit('send-message', {
        shop: config.shop,
        customerId: widgetState.customerId,
        conversationId: widgetState.conversationId,
        message: content,
        type: 'text'
      });
    }
    
    // Send via HTTP if WebSocket not available
    else {
      sendMessageHttp(message);
    }
  }

  // Send message via HTTP
  function sendMessageHttp(message) {
    fetch('/api/customer/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shop: config.shop,
        customerId: widgetState.customerId,
        conversationId: widgetState.conversationId,
        content: message.content,
        type: message.type
      })
    }).catch(error => {
      console.error('Failed to send message:', error);
    });
  }

  // Handle input keydown
  function handleInputKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  // Handle input resize
  function handleInputResize() {
    elements.input.style.height = 'auto';
    elements.input.style.height = Math.min(elements.input.scrollHeight, 120) + 'px';
  }

  // Handle file select
  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size
    if (file.size > config.maxFileSize * 1024 * 1024) {
      alert(`File size must be less than ${config.maxFileSize}MB`);
      return;
    }
    
    // Check file type
    if (!config.allowedFileTypes.includes(file.type)) {
      alert('File type not allowed');
      return;
    }
    
    uploadFile(file);
  }

  // Upload file
  function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('shop', config.shop);
    formData.append('customerId', widgetState.customerId);
    
    fetch('/api/customer/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      const message = {
        type: 'file',
        content: data.fileUrl,
        fileName: file.name,
        fileSize: file.size,
        sender: 'customer',
        timestamp: new Date()
      };
      
      addMessage(message);
    })
    .catch(error => {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file');
    });
  }

  // Add message to chat
  function addMessage(message) {
    widgetState.messages.push(message);
    
    const messageElement = createMessageElement(message);
    elements.messagesContainer.appendChild(messageElement);
    
    // Scroll to bottom
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
  }

  // Create message element
  function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `trichat-message trichat-message--${message.sender}`;
    messageDiv.style.cssText = `
      margin-bottom: 12px;
      display: flex;
      flex-direction: ${message.sender === 'customer' ? 'row-reverse' : 'row'};
      align-items: flex-end;
      gap: 8px;
    `;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'trichat-message__content';
    contentDiv.style.cssText = `
      max-width: 70%;
      padding: 8px 12px;
      border-radius: 12px;
      background: ${message.sender === 'customer' ? config.primaryColor : '#f3f4f6'};
      color: ${message.sender === 'customer' ? 'white' : '#374151'};
      word-wrap: break-word;
    `;
    
    if (message.type === 'file') {
      contentDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
          </svg>
          <a href="${message.content}" target="_blank" style="color: inherit; text-decoration: underline;">
            ${message.fileName}
          </a>
        </div>
      `;
    } else {
      contentDiv.textContent = message.content;
    }
    
    messageDiv.appendChild(contentDiv);
    
    // Add timestamp
    const timeDiv = document.createElement('div');
    timeDiv.className = 'trichat-message__time';
    timeDiv.textContent = new Date(message.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    timeDiv.style.cssText = `
      font-size: 11px;
      color: #9ca3af;
      margin-top: 4px;
    `;
    
    messageDiv.appendChild(timeDiv);
    
    return messageDiv;
  }

  // Show typing indicator
  function showTypingIndicator(typing) {
    if (typing) {
      elements.typingIndicator.style.display = 'flex';
      elements.messagesContainer.appendChild(elements.typingIndicator);
      elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    } else {
      elements.typingIndicator.style.display = 'none';
    }
  }

  // Update unread count
  function updateUnreadCount() {
    if (!widgetState.isOpen) {
      widgetState.unreadCount++;
      const badge = elements.button.querySelector('.trichat-button__badge');
      badge.textContent = widgetState.unreadCount;
      badge.style.display = 'flex';
    }
  }

  // Show offline message
  function showOfflineMessage() {
    alert('We are currently offline. Please try again during business hours.');
  }

  // Handle click outside
  function handleClickOutside(event) {
    if (!elements.container.contains(event.target)) {
      if (widgetState.isOpen && !widgetState.isMinimized) {
        minimizeChat();
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose public API
  window.TriChat = {
    open: openChat,
    close: closeChat,
    minimize: minimizeChat,
    sendMessage: sendMessage,
    config: config
  };

})(); 