import express from 'express';
import { Shopify } from '@shopify/shopify-api';
import { DeliveryMethod } from '@shopify/shopify-api';
import { shopifyApp } from '@shopify/shopify-app-express';
import { restResources } from '@shopify/shopify-api/rest/admin/2023-10';
import { LATEST_API_VERSION } from '@shopify/shopify-api';
import { MemorySessionStorage } from '@shopify/shopify-app-session-storage-memory';

const router = express.Router();

// Initialize Shopify app
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
    }
  }
});

// Install app
router.get('/install', async (req, res) => {
  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }

    // Generate authorization URL
    const authRoute = await shopify.auth.begin({
      shop,
      callbackPath: '/auth/callback',
      isOnline: false,
    });

    res.redirect(authRoute.url);
  } catch (error) {
    console.error('Install error:', error);
    res.status(500).json({ error: 'Failed to install app' });
  }
});

// OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const callback = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    // Store session
    await shopify.session.customAppSession(callback.session.shop);

    // Install webhooks
    await shopify.webhooks.addHandlers({
      APP_UNINSTALLED: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: '/webhooks/app-uninstalled'
      }
    });

    // Redirect to app
    res.redirect(`/?shop=${callback.session.shop}`);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Verify session
router.get('/verify', async (req, res) => {
  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }

    const session = await shopify.session.customAppSession(shop);
    
    if (!session) {
      return res.status(401).json({ error: 'No valid session found' });
    }

    res.json({ 
      authenticated: true, 
      shop: session.shop,
      accessToken: session.accessToken 
    });
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ error: 'Session verification failed' });
  }
});

// Logout
router.get('/logout', async (req, res) => {
  try {
    const { shop } = req.query;
    
    if (shop) {
      // Delete session
      await shopify.session.deleteSession(shop);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router; 