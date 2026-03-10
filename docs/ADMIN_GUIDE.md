# STACK Kids Bank - Administrator Guide

## Overview

The Stack Kids Bank admin system provides comprehensive control over the platform, including user management, game configuration, transaction monitoring, and system analytics.

## Accessing Admin Panel

### Login Process
1. Navigate to the admin login page (URL not publicly linked)
2. Enter admin credentials:
   - **Default Username**: admin
   - **Default Password**: admin123
   - **⚠️ IMPORTANT**: Change default password immediately in production
3. Click "Access Control Panel"

### Security Notes
- Admin access is logged and monitored
- All administrative actions are audited
- Use strong, unique passwords
- Enable two-factor authentication when available

## Admin Dashboard

### System Overview
The dashboard provides real-time statistics:
- **Total Users**: All registered users
- **Parents**: Users with PARENT role
- **Children**: Users with CHILD role
- **Families**: Total family groups
- **Games**: Available educational games
- **Transactions**: All financial transactions

### Quick Actions
- Navigate to user management
- Access game configuration
- View transaction logs
- Monitor family activities

## User Management

### Viewing Users
- Complete list of all registered users
- User ID, username, role, and status
- Real-time enabled/disabled status
- Registration dates and activity

### User Actions

#### Edit User
1. Click edit button next to user
2. Modify username, role, or enabled status
3. Save changes
4. User receives updated permissions immediately

#### Enable/Disable Users
- **Enable**: User can log in and use all features
- **Disable**: User cannot log in, existing sessions terminated
- Useful for temporary account suspension

#### Delete Users
- Permanently removes user and all associated data
- **Cannot delete admin users** (safety measure)
- Confirmation required before deletion
- Action cannot be undone

### User Roles
- **PARENT**: Full family management, money transfers, oversight
- **CHILD**: Limited access, educational features, supervised accounts
- **ADMIN**: System administration, user management, platform control

## Game Management

### Game Overview
- List all educational games
- Game codes, titles, descriptions
- Reward coin amounts
- Creation and modification dates

### Creating Games
1. Click "Create New Game"
2. Enter required information:
   - **Game Code**: Unique identifier (e.g., MATH_RUSH)
   - **Title**: Display name for users
   - **Description**: What the game teaches
   - **Reward Coins**: Coins earned for completion
3. Save game

### Editing Games
- Modify title, description, or reward amounts
- Cannot change game code after creation
- Updates apply immediately to all users

### Deleting Games
- Removes game from platform
- Users can no longer access deleted games
- Historical game sessions remain in database

## Transaction Management

### Transaction Monitoring
- View all financial transactions across the platform
- Transaction types: DEPOSIT, WITHDRAWAL, TRANSFER
- Real-time transaction feed
- Account associations and amounts

### Transaction Details
- **Transaction ID**: Unique identifier
- **Type**: DEPOSIT, WITHDRAWAL, TRANSFER, GAME_REWARD
- **Amount**: Transaction value
- **Account**: Associated user account
- **Note**: Optional transaction description
- **Date**: Timestamp of transaction

### Monitoring Capabilities
- Detect unusual spending patterns
- Monitor large transactions
- Track game reward distributions
- Audit family money transfers

## Family Management

### Family Overview
- List all registered families
- Family names and creation dates
- Family creators and member counts
- Family activity status

### Family Information
- **Family ID**: Unique identifier
- **Title**: Family display name
- **Created By**: User who created the family
- **Created Date**: Family registration date
- **Members**: Number of family members

## System Statistics

### Analytics Dashboard
Real-time platform metrics:
- User growth trends
- Transaction volumes
- Game engagement rates
- Family creation rates
- Platform usage patterns

### Performance Monitoring
- System response times
- Database performance
- Error rates and logs
- User session data

## Security & Compliance

### Security Features
- All admin actions are logged
- IP address tracking for admin sessions
- Failed login attempt monitoring
- Automatic session timeout

### Data Protection
- User data encryption
- Secure password storage
- COPPA compliance for children
- GDPR compliance for EU users

### Audit Trail
- Complete log of all administrative actions
- User creation, modification, and deletion
- Game management activities
- System configuration changes

## Best Practices

### User Management
- Regularly review user accounts for inactive users
- Monitor for suspicious account creation patterns
- Respond promptly to user support requests
- Maintain clear documentation of policy changes

### Game Management
- Test new games before making them live
- Monitor game completion rates and user feedback
- Adjust reward amounts based on engagement
- Keep game content age-appropriate and educational

### Security Management
- Change default admin password immediately
- Use strong, unique passwords
- Log out when finished with admin tasks
- Monitor admin access logs regularly

## Troubleshooting

### Common Issues

#### Users Cannot Log In
1. Check if user account is enabled
2. Verify user role permissions
3. Check for system-wide issues
4. Review recent admin actions

#### Games Not Loading
1. Verify game is not deleted
2. Check game configuration
3. Monitor system performance
4. Review error logs

#### Transaction Issues
1. Check account balances
2. Verify transaction permissions
3. Monitor for system errors
4. Review family relationships

### Support Escalation
- Document all troubleshooting steps
- Collect relevant user information
- Check system logs for errors
- Contact technical support if needed

## Emergency Procedures

### System Issues
1. Check system status dashboard
2. Review error logs
3. Contact technical support
4. Communicate with users if needed

### Security Incidents
1. Immediately secure affected accounts
2. Document the incident
3. Change relevant passwords
4. Review access logs
5. Report to appropriate authorities if required

### Data Recovery
- Regular backups are maintained
- Point-in-time recovery available
- Contact technical support for data restoration
- Document recovery procedures

## Contact Information

### Technical Support
- Email: admin-support@stackkidsbank.com
- Response time: 2-4 hours for critical issues
- 24/7 support for security incidents

### Developer Contact
- Email: developer@stackkidsbank.com
- For platform modifications and integrations
- Response time: 24-48 hours

---

*This guide covers administrative functions for Stack Kids Bank. For user-facing features, see the User Guide. For technical integration, see the Developer Documentation.*