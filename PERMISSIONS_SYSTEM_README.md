# TriChat Permissions System

## Overview

The TriChat Permissions System is a comprehensive, production-ready role-based access control (RBAC) solution that provides granular permission management for all aspects of the platform. This system supports custom permissions, audit trails, and advanced access control policies.

## 🚀 Features

### Core Features
- **Role-Based Access Control (RBAC)** - 6 predefined roles with customizable permissions
- **Custom Permissions** - Create and manage custom permissions for specific use cases
- **Permission Matrix** - Visual interface for managing role permissions
- **User Management** - Comprehensive user administration with custom permission overrides
- **Audit Trail** - Complete logging of all permission changes and user activities
- **Access Control Policies** - Advanced policies with time and IP restrictions
- **Role Templates** - Predefined permission sets for different industries and company sizes

### Permission Categories
1. **Core** - Essential platform functionality
2. **Security** - System security and administration
3. **Compliance** - Data protection and regulatory compliance
4. **Advanced** - Advanced features and integrations
5. **Custom** - User-defined permissions

## 📋 Permission Groups

### Dashboard & Analytics 📊
- `view_dashboard` - Access to main dashboard
- `view_analytics` - View analytics and reports
- `view_performance_metrics` - Access performance metrics
- `export_analytics` - Export analytics data
- `view_real_time_data` - View real-time data feeds

### User Management 👥
- `view_users` - View user list and profiles
- `create_users` - Create new user accounts
- `edit_users` - Modify user information
- `delete_users` - Delete user accounts
- `suspend_users` - Suspend user accounts
- `activate_users` - Activate suspended accounts
- `assign_roles` - Assign roles to users
- `view_user_activity` - View user activity logs
- `reset_user_password` - Reset user passwords

### Chat Management 💬
- `view_chats` - View chat conversations
- `manage_chats` - Manage chat operations
- `assign_chats` - Assign chats to agents
- `transfer_chats` - Transfer chats between agents
- `close_chats` - Close chat conversations
- `reopen_chats` - Reopen closed chats
- `view_chat_history` - Access chat history
- `delete_chat_messages` - Delete chat messages
- `edit_chat_messages` - Edit chat messages
- `view_chat_analytics` - View chat analytics
- `bulk_chat_operations` - Perform bulk operations on chats

### Reports & Analytics 📈
- `view_reports` - View existing reports
- `create_reports` - Create new reports
- `edit_reports` - Modify existing reports
- `delete_reports` - Delete reports
- `schedule_reports` - Schedule automated reports
- `export_reports` - Export report data
- `view_custom_reports` - Access custom report builder
- `share_reports` - Share reports with other users

### System Settings ⚙️
- `view_settings` - View system settings
- `edit_settings` - Modify system settings
- `manage_permissions` - Manage user permissions
- `manage_system` - Full system administration
- `view_audit_logs` - Access audit logs
- `manage_integrations` - Manage third-party integrations
- `configure_webhooks` - Configure webhooks
- `manage_api_keys` - Manage API keys

### Chat Widget 🔧
- `view_widget` - View widget configuration
- `edit_widget` - Modify widget settings
- `configure_widget` - Configure widget appearance
- `deploy_widget` - Deploy widget to websites
- `view_widget_analytics` - View widget analytics

### Customer Data 👤
- `view_customer_data` - View customer information
- `edit_customer_data` - Modify customer data
- `delete_customer_data` - Delete customer records
- `export_customer_data` - Export customer data
- `view_customer_history` - Access customer interaction history
- `merge_customer_records` - Merge duplicate customer records
- `anonymize_customer_data` - Anonymize customer data

### Content Management 📝
- `view_dispositions` - View chat dispositions
- `edit_dispositions` - Modify dispositions
- `create_dispositions` - Create new dispositions
- `delete_dispositions` - Delete dispositions
- `view_templates` - View message templates
- `edit_templates` - Modify templates
- `create_templates` - Create new templates
- `delete_templates` - Delete templates
- `manage_canned_responses` - Manage canned responses

### CSAT & Feedback ⭐
- `view_csat` - View CSAT surveys
- `manage_csat_surveys` - Manage survey configuration
- `view_csat_analytics` - View CSAT analytics
- `export_csat_data` - Export CSAT data
- `configure_csat_settings` - Configure CSAT settings

### Billing & Subscriptions 💳
- `view_billing` - View billing information
- `manage_billing` - Manage billing settings
- `view_subscriptions` - View subscription details
- `manage_subscriptions` - Manage subscriptions
- `view_payment_history` - Access payment history
- `process_refunds` - Process refunds

### Security & Compliance 🔒
- `view_security_logs` - Access security logs
- `manage_security_settings` - Configure security settings
- `view_compliance_reports` - View compliance reports
- `manage_data_retention` - Configure data retention policies
- `configure_2fa` - Configure two-factor authentication
- `manage_ip_whitelist` - Manage IP whitelist

### Integrations & APIs 🔗
- `view_integrations` - View integration status
- `manage_integrations` - Manage integrations
- `configure_webhooks` - Configure webhooks
- `manage_api_keys` - Manage API keys
- `view_api_usage` - View API usage statistics
- `test_integrations` - Test integration connections

### Workflow & Automation 🔄
- `view_workflows` - View automated workflows
- `create_workflows` - Create new workflows
- `edit_workflows` - Modify existing workflows
- `delete_workflows` - Delete workflows
- `manage_automation_rules` - Manage automation rules
- `view_automation_logs` - View automation logs

### Knowledge Base 📚
- `view_knowledge_base` - Access knowledge base
- `create_knowledge_articles` - Create new articles
- `edit_knowledge_articles` - Modify articles
- `delete_knowledge_articles` - Delete articles
- `manage_knowledge_categories` - Manage categories
- `publish_knowledge_articles` - Publish articles

### SLA Management ⏱️
- `view_sla` - View SLA policies
- `create_sla` - Create new SLA policies
- `edit_sla` - Modify SLA policies
- `delete_sla` - Delete SLA policies
- `view_sla_reports` - View SLA reports
- `configure_sla_escalations` - Configure escalations

## 👥 User Roles

### Admin
- **Description**: Full system access with all permissions
- **Use Case**: System administrators and platform owners
- **Permissions**: All permissions across all categories

### Supervisor
- **Description**: Manage team and monitor performance
- **Use Case**: Team leaders and managers
- **Key Permissions**: 
  - View and manage chats
  - Access analytics and reports
  - Manage team members
  - View customer data
  - Access CSAT analytics

### Agent
- **Description**: Handle customer conversations
- **Use Case**: Customer service representatives
- **Key Permissions**:
  - View and manage assigned chats
  - Access customer information
  - Use templates and dispositions
  - View knowledge base

## 🛠️ Setup Instructions

### 1. Database Setup
Run the permissions schema SQL file in your Supabase database:

```sql
-- Execute the CREATE_PERMISSIONS_SCHEMA.sql file
```

### 2. Component Integration
Import and use the permissions components in your application:

```tsx
import { AccessManagement } from '@/components/admin/access/AccessManagement';
import { useAccessManagement } from '@/components/admin/access/useAccessManagement';

// Use in your admin dashboard
<AccessManagement />
```

### 3. Permission Checking
Use the permission checking functions in your components:

```tsx
import { useAccessManagement } from '@/components/admin/access/useAccessManagement';

const { hasPermission } = useAccessManagement();

// Check if user has specific permission
if (hasPermission(userRole, 'manage_chats')) {
  // Show chat management features
}
```

## 🔧 Custom Permissions

### Creating Custom Permissions
1. Navigate to Access Management → Permission Matrix
2. Click "Create Custom Permission"
3. Fill in the form:
   - **Name**: Human-readable permission name
   - **Description**: What this permission allows
   - **Code**: Unique permission identifier (e.g., `manage_special_reports`)
   - **Category**: Choose appropriate category
4. Click "Create Permission"

### Using Custom Permissions
Custom permissions work exactly like standard permissions:
- They appear in the permission matrix
- Can be assigned to any role
- Are included in permission checks
- Appear in audit logs

## 📊 Audit Trail

### What's Logged
- Permission grants and revokes
- Custom permission creation and deletion
- Role changes
- User status changes
- Access attempts

### Viewing Audit Logs
1. Navigate to Access Management → Role Management
2. Click "Audit Log" button
3. View complete audit trail with filters

### Audit Log Fields
- **Action**: grant, revoke, create, update, delete
- **Permission**: The permission being modified
- **Target User/Role**: Who the action affects
- **Reason**: Optional reason for the action
- **Timestamp**: When the action occurred
- **IP Address**: Source IP address
- **User Agent**: Browser/client information

## 🔐 Access Control Policies

### Policy Types
1. **Allow** - Explicitly allow access
2. **Deny** - Explicitly deny access
3. **Require Approval** - Require approval before access

### Policy Conditions
- **Roles**: Apply to specific roles
- **Permissions**: Apply to specific permissions
- **Time Restrictions**: Limit access to specific times
- **IP Restrictions**: Limit access to specific IP addresses
- **Device Restrictions**: Limit access to specific devices

### Creating Policies
1. Navigate to Access Management
2. Go to Access Control Policies tab
3. Click "Create Policy"
4. Configure conditions and actions
5. Set priority (higher numbers = higher priority)

## 📈 Best Practices

### Security
1. **Principle of Least Privilege**: Only grant necessary permissions
2. **Regular Reviews**: Review permissions quarterly
3. **Audit Logs**: Monitor audit logs regularly
4. **Custom Permissions**: Use sparingly and document thoroughly

### Management
1. **Role Templates**: Use role templates for consistency
2. **Documentation**: Document custom permissions and policies
3. **Training**: Train administrators on permission management
4. **Testing**: Test permission changes in staging environment

### Compliance
1. **Data Retention**: Configure appropriate data retention policies
2. **Access Reviews**: Conduct regular access reviews
3. **Audit Trails**: Maintain complete audit trails
4. **Documentation**: Document all permission changes

## 🚨 Troubleshooting

### Common Issues

#### Permission Not Working
1. Check if user has the correct role
2. Verify permission is assigned to the role
3. Check for custom permission overrides
4. Review access control policies
5. Check audit logs for recent changes

#### Custom Permission Not Appearing
1. Verify permission was created successfully
2. Check if permission is active
3. Ensure permission applies to user's role
4. Check database for permission record

#### Audit Log Missing Entries
1. Verify RLS policies are configured correctly
2. Check if user has audit log permissions
3. Verify database functions are working
4. Check for database errors

### Debug Commands
```sql
-- Check user permissions
SELECT * FROM get_user_permissions('user-uuid');

-- Check if user has specific permission
SELECT has_permission('user-uuid', 'permission-name');

-- View recent audit logs
SELECT * FROM permission_audit_logs 
ORDER BY timestamp DESC 
LIMIT 10;
```

## 📞 Support

For issues with the permissions system:
1. Check the audit logs for recent changes
2. Verify database schema is up to date
3. Test permissions in isolation
4. Review RLS policies
5. Contact system administrator

## 🔄 Updates and Maintenance

### Regular Maintenance
- **Weekly**: Review audit logs for suspicious activity
- **Monthly**: Review and update role permissions
- **Quarterly**: Conduct comprehensive access review
- **Annually**: Update permission schema and policies

### Schema Updates
When updating the permissions schema:
1. Backup current permissions
2. Test changes in staging environment
3. Update during maintenance window
4. Verify all permissions work correctly
5. Update documentation

---

This permissions system provides enterprise-grade access control for the TriChat platform, ensuring security, compliance, and operational efficiency. 