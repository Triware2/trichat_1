import { useEffect, useCallback } from 'react';

type UserRole = 'admin' | 'supervisor' | 'agent' | 'landing';

export const useFavicon = (role?: UserRole) => {
  const updateFavicon = useCallback((role?: UserRole) => {
    const head = document.head;
    
    console.log('🔄 Updating favicon for role:', role);
    
    // Remove existing favicon links
    const existingLinks = head.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());
    
    // Create new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    
    // Set favicon based on role
    switch (role) {
      case 'agent':
        link.href = '/favicon-agent.svg';
        break;
      case 'supervisor':
        link.href = '/favicon-supervisor.svg';
        break;
      case 'admin':
        link.href = '/favicon-admin.svg';
        break;
      case 'landing':
        link.href = '/favicon-landing.svg';
        break;
      default:
        // Default to landing favicon for landing/auth pages
        link.href = '/favicon-landing.svg';
        break;
    }
    
    head.appendChild(link);
    
    console.log('✅ Favicon set to:', link.href);
    
    // Also add apple-touch-icon for iOS
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = link.href;
    head.appendChild(appleTouchIcon);
    
    // Add 64x64 icon (larger for better visibility)
    const icon64 = document.createElement('link');
    icon64.rel = 'icon';
    icon64.type = 'image/svg+xml';
    icon64.sizes = '64x64';
    icon64.href = link.href;
    head.appendChild(icon64);
    
    // Add 48x48 icon
    const icon48 = document.createElement('link');
    icon48.rel = 'icon';
    icon48.type = 'image/svg+xml';
    icon48.sizes = '48x48';
    icon48.href = link.href;
    head.appendChild(icon48);
    
    // Add 32x32 icon
    const icon32 = document.createElement('link');
    icon32.rel = 'icon';
    icon32.type = 'image/svg+xml';
    icon32.sizes = '32x32';
    icon32.href = link.href;
    head.appendChild(icon32);
    
    // Add 16x16 icon
    const icon16 = document.createElement('link');
    icon16.rel = 'icon';
    icon16.type = 'image/svg+xml';
    icon16.sizes = '16x16';
    icon16.href = link.href;
    head.appendChild(icon16);
  }, []);

  useEffect(() => {
    updateFavicon(role);
  }, [role, updateFavicon]);

  return { updateFavicon };
}; 