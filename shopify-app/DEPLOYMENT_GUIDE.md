# TriChat Shopify App - Deployment Guide

This guide will walk you through deploying the TriChat Shopify app to the Shopify App Store and hosting it on various platforms.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Shopify Partner account
- Database (MongoDB, PostgreSQL, or MySQL)
- File storage (AWS S3, Google Cloud Storage, or similar)
- Domain name
- SSL certificate

## 📋 Step 1: Environment Setup

### 1.1 Install Dependencies
```bash
cd shopify-app
npm install
```

### 1.2 Environment Variables
Create a `.env` file in the root directory:

```env
# Shopify App Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_SCOPES=read_products,write_products,read_orders,write_orders,read_customers,write_customers,read_script_tags,write_script_tags,read_themes,write_themes
HOST=https://your-app-domain.com

# Database Configuration
DATABASE_URL=your_database_connection_string
DATABASE_TYPE=mongodb # or postgresql, mysql

# File Storage
STORAGE_TYPE=aws # or gcp, azure
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket

# Redis (for session storage)
REDIS_URL=your_redis_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# App Configuration
NODE_ENV=production
PORT=3000
APP_URL=https://your-app-domain.com

# Analytics
GOOGLE_ANALYTICS_ID=your_ga_id

# Email Service
EMAIL_SERVICE=sendgrid # or mailgun, aws-ses
SENDGRID_API_KEY=your_sendgrid_api_key

# Push Notifications
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

## 🏗️ Step 2: Database Setup

### 2.1 MongoDB (Recommended)
```bash
# Install MongoDB locally or use MongoDB Atlas
# Create database and collections
mongo
use trichat_shopify
db.createCollection('conversations')
db.createCollection('messages')
db.createCollection('customers')
db.createCollection('chat_settings')
db.createCollection('analytics')
db.createCollection('webhooks')
```

### 2.2 PostgreSQL
```sql
-- Create database
CREATE DATABASE trichat_shopify;

-- Create tables (see database/schema.sql)
```

### 2.3 MySQL
```sql
-- Create database
CREATE DATABASE trichat_shopify;

-- Create tables (see database/schema.sql)
```

## 🌐 Step 3: Hosting Options

### 3.1 Heroku (Recommended for beginners)

#### Setup
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create trichat-shopify-app

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Add Redis addon
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set SHOPIFY_API_KEY=your_api_key
heroku config:set SHOPIFY_API_SECRET=your_api_secret
heroku config:set HOST=https://your-app-name.herokuapp.com
# ... set all other environment variables

# Deploy
git add .
git commit -m "Initial deployment"
git push heroku main

# Open app
heroku open
```

#### Custom Domain
```bash
# Add custom domain
heroku domains:add your-app-domain.com

# Configure DNS
# Add CNAME record: your-app-domain.com -> your-app-name.herokuapp.com
```

### 3.2 Railway

#### Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add environment variables
railway variables set SHOPIFY_API_KEY=your_api_key
railway variables set SHOPIFY_API_SECRET=your_api_secret
# ... set all other variables

# Deploy
railway up

# Get deployment URL
railway domain
```

### 3.3 Vercel

#### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### 3.4 AWS (Production)

#### Setup with AWS Elastic Beanstalk
```bash
# Install AWS CLI
aws configure

# Create Elastic Beanstalk application
eb init trichat-shopify-app --platform node.js

# Create environment
eb create production

# Set environment variables
eb setenv SHOPIFY_API_KEY=your_api_key
eb setenv SHOPIFY_API_SECRET=your_api_secret
# ... set all other variables

# Deploy
eb deploy
```

#### Setup with AWS ECS
```bash
# Build Docker image
docker build -t trichat-shopify-app .

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
docker tag trichat-shopify-app:latest your-account.dkr.ecr.us-east-1.amazonaws.com/trichat-shopify-app:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/trichat-shopify-app:latest

# Deploy to ECS (see docker-compose.yml and ECS task definition)
```

### 3.5 Google Cloud Platform

#### Setup with Cloud Run
```bash
# Install Google Cloud CLI
gcloud auth login
gcloud config set project your-project-id

# Build and deploy
gcloud run deploy trichat-shopify-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars SHOPIFY_API_KEY=your_api_key,SHOPIFY_API_SECRET=your_api_secret
```

## 🔧 Step 4: Shopify Partner Setup

### 4.1 Create Shopify Partner Account
1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Sign up for a Partner account
3. Complete verification process

### 4.2 Create App in Partner Dashboard
1. Go to Apps → Create app
2. Choose "Custom app"
3. Fill in app details:
   - App name: TriChat Live Chat
   - App URL: https://your-app-domain.com
   - Allowed redirection URLs:
     - https://your-app-domain.com/auth/callback
     - https://your-app-domain.com/auth/shopify/callback

### 4.3 Configure App Settings
1. **App setup**:
   - App URL: https://your-app-domain.com
   - Allowed redirection URLs: Add your callback URLs

2. **Admin API access scopes**:
   - read_products, write_products
   - read_orders, write_orders
   - read_customers, write_customers
   - read_script_tags, write_script_tags
   - read_themes, write_themes
   - read_analytics
   - read_marketing_events, write_marketing_events

3. **Webhooks**:
   - APP_UNINSTALLED: https://your-app-domain.com/webhooks/app-uninstalled
   - CUSTOMERS_CREATE: https://your-app-domain.com/webhooks/customers-create
   - ORDERS_CREATE: https://your-app-domain.com/webhooks/orders-create
   - ORDERS_UPDATED: https://your-app-domain.com/webhooks/orders-updated

### 4.4 Get API Credentials
1. Copy API key and API secret key
2. Update your environment variables
3. Test the connection

## 📱 Step 5: App Store Submission

### 5.1 Prepare App Store Listing

#### App Information
- **App name**: TriChat Live Chat
- **App description**: 
```
Transform your Shopify store's customer support with TriChat's powerful live chat solution. Engage with customers in real-time, boost sales, and provide exceptional customer service.

Key Features:
• Real-time live chat with customers
• File sharing and image support
• Customizable chat widget
• Customer information integration
• Conversation history and analytics
• Mobile-responsive design
• Multi-language support
• Automated responses
• Team collaboration tools
• Integration with Shopify orders and customers
```

#### Screenshots and Videos
- Dashboard screenshot
- Chat interface screenshot
- Settings page screenshot
- Mobile view screenshot
- Demo video (optional but recommended)

#### Pricing
- **Free plan**: Up to 100 conversations/month
- **Pro plan**: $19/month - Up to 1,000 conversations
- **Business plan**: $49/month - Up to 5,000 conversations
- **Enterprise plan**: $99/month - Unlimited conversations

### 5.2 Technical Requirements
1. **App must be functional** and handle all basic chat operations
2. **Responsive design** for mobile and desktop
3. **Fast loading times** (< 3 seconds)
4. **Secure data handling** with encryption
5. **Proper error handling** and user feedback
6. **Comprehensive documentation** for merchants

### 5.3 Submit for Review
1. Go to Partner Dashboard → Apps → Your App
2. Click "Submit for review"
3. Fill out all required information
4. Upload screenshots and videos
5. Provide test store credentials
6. Submit and wait for review (2-4 weeks)

## 🔒 Step 6: Security & Compliance

### 6.1 Security Measures
- **HTTPS only**: All communications must be encrypted
- **API key security**: Never expose API keys in client-side code
- **Input validation**: Validate all user inputs
- **Rate limiting**: Implement rate limiting on all endpoints
- **SQL injection prevention**: Use parameterized queries
- **XSS prevention**: Sanitize all user inputs

### 6.2 GDPR Compliance
- **Data encryption**: Encrypt sensitive data at rest
- **Data retention**: Implement data retention policies
- **User consent**: Get explicit consent for data collection
- **Data portability**: Allow users to export their data
- **Right to be forgotten**: Implement data deletion

### 6.3 Shopify Requirements
- **App Bridge**: Use App Bridge for embedded apps
- **Session management**: Proper session handling
- **Webhook verification**: Verify webhook signatures
- **Error handling**: Graceful error handling
- **Performance**: Fast response times

## 📊 Step 7: Monitoring & Analytics

### 7.1 Application Monitoring
```bash
# Install monitoring tools
npm install winston pino express-rate-limit helmet

# Set up logging
# See src/utils/logger.js for implementation
```

### 7.2 Performance Monitoring
- **Uptime monitoring**: Use UptimeRobot or Pingdom
- **Error tracking**: Use Sentry or Bugsnag
- **Performance monitoring**: Use New Relic or DataDog
- **Analytics**: Google Analytics for user behavior

### 7.3 Database Monitoring
- **Query performance**: Monitor slow queries
- **Connection pooling**: Optimize database connections
- **Backup strategy**: Regular automated backups
- **Scaling**: Plan for database scaling

## 🚀 Step 8: Launch Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] Database setup and tested
- [ ] File storage configured
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] App tested on multiple devices
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Monitoring tools set up
- [ ] Backup strategy in place

### Launch Day
- [ ] Deploy to production
- [ ] Test all functionality
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify webhook delivery
- [ ] Test customer support flow
- [ ] Monitor server resources

### Post-Launch
- [ ] Monitor app performance
- [ ] Respond to user feedback
- [ ] Fix any bugs quickly
- [ ] Plan feature updates
- [ ] Monitor revenue and usage
- [ ] Optimize based on analytics

## 📈 Step 9: Marketing & Growth

### 9.1 App Store Optimization
- **Keywords**: Research relevant keywords
- **Description**: Optimize app description
- **Screenshots**: High-quality, informative screenshots
- **Reviews**: Encourage positive reviews
- **Updates**: Regular updates with new features

### 9.2 Marketing Strategy
- **Content marketing**: Blog posts about customer support
- **Social media**: Share success stories and tips
- **Email marketing**: Newsletter for merchants
- **Partnerships**: Collaborate with other Shopify apps
- **Webinars**: Host educational webinars

### 9.3 Customer Support
- **Documentation**: Comprehensive help docs
- **Video tutorials**: Create how-to videos
- **Live chat**: Provide support via your own app
- **Email support**: Quick response times
- **Community**: Build user community

## 🔧 Step 10: Maintenance

### Regular Tasks
- **Security updates**: Keep dependencies updated
- **Performance optimization**: Monitor and optimize
- **Feature updates**: Regular feature releases
- **Bug fixes**: Quick bug fix releases
- **Customer support**: Respond to support requests

### Scaling Considerations
- **Database scaling**: Plan for growth
- **CDN**: Use CDN for static assets
- **Load balancing**: Implement load balancing
- **Caching**: Implement caching strategies
- **Microservices**: Consider breaking into microservices

## 📞 Support

For deployment support:
- **Email**: support@trichat.com
- **Documentation**: https://docs.trichat.com/shopify
- **GitHub**: https://github.com/trichat/shopify-app
- **Discord**: https://discord.gg/trichat

## 🎉 Congratulations!

You've successfully deployed your TriChat Shopify app! The app is now ready to help Shopify merchants provide exceptional customer support through live chat.

Remember to:
- Monitor your app's performance
- Gather user feedback
- Continuously improve features
- Stay updated with Shopify's latest requirements
- Provide excellent customer support

Good luck with your Shopify app journey! 🚀 