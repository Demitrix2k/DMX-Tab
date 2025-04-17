/**
 * Offline Manager - Handles offline detection and notifications for DMX-Tab
 */

class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.offlineNotification = null;
    this.offlineMode = false;
    
    // Event listeners for online/offline events
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
    
    // Create notification element
    this.createNotificationElement();
    
    // Initialize status
    this.checkOnlineStatus();
    
    // Periodically check online status (every 30 seconds)
    setInterval(() => this.checkOnlineStatus(), 30000);
  }
  
  /**
   * Create the offline notification element and add it to the DOM
   */
  createNotificationElement() {
    this.offlineNotification = document.createElement('div');
    this.offlineNotification.className = 'offline-notification';
    this.offlineNotification.innerHTML = `
      <div class="offline-content">
        <i class="fas fa-wifi-slash"></i> 
        <span>You are offline. Some features may be limited.</span>
        <button class="offline-close"><i class="fas fa-times"></i></button>
      </div>
    `;
    
    // Append to body
    document.body.appendChild(this.offlineNotification);
    
    // Add close handler
    const closeBtn = this.offlineNotification.querySelector('.offline-close');
    closeBtn.addEventListener('click', () => {
      this.hideNotification();
    });
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .offline-notification {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: rgba(247, 118, 142, 0.9);
        color: white;
        padding: 8px 16px;
        font-size: 14px;
        text-align: center;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: flex;
        justify-content: center;
      }
      
      .offline-notification.active {
        transform: translateY(0);
      }
      
      .offline-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .offline-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        margin-left: 10px;
      }
      
      .offline-app-badge {
        position: fixed;
        bottom: 60px;
        left: 20px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #f7768e;
        z-index: 999;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .offline-app-badge.active {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    
    // Create a small indicator that shows when in offline mode
    // even after the notification is dismissed
    this.offlineBadge = document.createElement('div');
    this.offlineBadge.className = 'offline-app-badge';
    document.body.appendChild(this.offlineBadge);
  }
  
  /**
   * Update online status and show/hide notification
   */
  updateOnlineStatus(isOnline) {
    // Update state
    this.isOnline = isOnline;
    this.offlineMode = !isOnline;
    
    // Show/hide notification
    if (!isOnline) {
      this.showNotification();
    } else {
      this.hideNotification();
    }
    
    // Update badge
    if (!isOnline) {
      this.offlineBadge.classList.add('active');
    } else {
      this.offlineBadge.classList.remove('active');
    }
    
    // Dispatch event for other parts of the application
    document.dispatchEvent(new CustomEvent('connection-status-changed', { 
      detail: { online: isOnline }
    }));
    
    console.log(`[Offline Manager] App is ${isOnline ? 'online' : 'offline'}`);
  }
  
  /**
   * Show offline notification
   */
  showNotification() {
    this.offlineNotification.classList.add('active');
  }
  
  /**
   * Hide offline notification
   */
  hideNotification() {
    this.offlineNotification.classList.remove('active');
  }
  
  /**
   * Check online status by testing a network request through the service worker
   */
  checkOnlineStatus() {
    // Use the browser's navigator.onLine as a first check
    const initialStatus = navigator.onLine;
    
    // If browser thinks we're online, double-check with an actual network request via service worker
    if (initialStatus && navigator.serviceWorker.controller) {
      // Create a message channel to get a response from the service worker
      const channel = new MessageChannel();
      
      // Set up a promise to handle the response
      const onlineCheckPromise = new Promise((resolve) => {
        // Resolve the promise based on the service worker's response
        channel.port1.onmessage = (event) => {
          resolve(event.data.online);
        };
      });
      
      // Send message to service worker
      navigator.serviceWorker.controller.postMessage({
        type: 'CHECK_ONLINE_STATUS'
      }, [channel.port2]);
      
      // Wait for response with timeout
      Promise.race([
        onlineCheckPromise,
        new Promise(resolve => setTimeout(() => resolve(false), 3000)) // Timeout after 3 seconds
      ]).then(isOnline => {
        // Update status based on the check result or timeout
        this.updateOnlineStatus(isOnline);
      });
    } else {
      // If the browser thinks we're offline, trust that
      this.updateOnlineStatus(initialStatus);
    }
  }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.offlineManager = new OfflineManager();
});

// Export the class for potential use as a module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OfflineManager;
}
