// Improved service worker registration with update handling
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          
          // Check for updates to the service worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Service Worker update found!');
            
            newWorker.addEventListener('statechange', () => {
              // When the new service worker is installed and waiting
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker installed, but waiting.');
                
                // Notify user that an update is available
                if (window.offlineManager) {
                  // Optional: Show update notification through offline manager
                }
              }
            });
          });
          
          // Check if there is a waiting service worker
          if (registration.waiting) {
            console.log('New service worker waiting to activate');
            // Optional: Show update ready notification
          }
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
        
      // Handle service worker updates
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          console.log('New service worker activated, reloading page...');
          window.location.reload();
        }
      });
    });
  }
  
  // ========== VARIABLE DECLARATIONS ==========
  document.addEventListener('DOMContentLoaded', function() {
      const mainWindow = document.getElementById('main-window');
      const tabIcons = document.querySelectorAll('.tab-icon');
      const tabContents = document.querySelectorAll('.tab-content');
      let currentTabIndex = 0;
      
      // Shortcut management variables
      const shortcutsGrid = document.getElementById('shortcuts-grid');
      const addShortcutBtn = document.getElementById('add-shortcut-toggle');
      const shortcutForm = document.getElementById('shortcut-form');
      const shortcutNameInput = document.getElementById('shortcut-name');
      const shortcutUrlInput = document.getElementById('shortcut-url');
      const saveShortcutBtn = document.getElementById('save-shortcut');
      const cancelShortcutBtn = document.getElementById('cancel-shortcut');
      
      let editingShortcutIndex = null; // Track which shortcut is being edited
      
      // Settings management variables
      const settingsBtn = document.getElementById('settings-toggle');
      const settingsForm = document.getElementById('settings-form');
      const exportBtn = document.getElementById('export-btn');
      const importBtn = document.getElementById('import-btn');
      const importFile = document.getElementById('import-file');
      const closeSettingsBtn = document.getElementById('close-settings');
      const importNotification = document.getElementById('import-notification');
      
      // Notes and Todo variables
      const notesArea = document.getElementById('notes-area');
      const todoInput = document.getElementById('todo-input');
      const addTodoBtn = document.getElementById('add-todo-btn');
      const todoList = document.getElementById('todo-list');
      const todoSection = document.querySelector('.todo-section');
      const notesSection = document.querySelector('.notes-section');
      
      const body = document.body;
      const statusBar = document.querySelector('.status-bar');
      const mainWindowElement = document.querySelector('.main-window'); // Added for direct style access
      
      // Updated UI elements
      const addWebsiteOption = document.getElementById('add-website-option');
      const toggleEditModeOption = document.getElementById('toggle-edit-mode');
      const editModeLabel = document.getElementById('edit-mode-label');
      const shortcutsLeft = document.querySelector('.shortcuts-left');
      const dropdown = document.querySelector('.add-dropdown'); // Define the dropdown variable
      
      // Add constants for limits
      const MAX_TOTAL_SHORTCUTS = 12;
      
      // List of all localStorage keys used by the application
      const APP_LOCAL_STORAGE_KEYS = [
          'dmx-shortcuts',
          'dmx-notes', 
          'dmx-todos',
          'dmx-background',
          'dmx-blur',
          'dmx-edit-mode',
          'dmx-weather-settings',
          'dmx-rss-feeds',
          'dmx-sharp-borders',
          'dmx-overlay-color',
          'dmx-overlay-opacity',
          'dmx-tab-visibility', // Added key for tab visibility settings
          'dmx-weather-units', // Added key for weather units
          'dmx-disable-shadow', // Added key for shadow setting
          'dmx-window-bg-color', // Added key for window background color
          'dmx-window-bg-opacity' // Added key for window background opacity
          // Note: Favicon cache uses dynamic keys like 'dmx-favicon-cache-<domain>'
      ];
      
      // Tab2 Settings variables
      const tab2SettingsBtn = document.getElementById('tab2-settings-toggle');
      const tab2SettingsForm = document.getElementById('tab2-settings-form');
      const weatherApiKeyInput = document.getElementById('weather-api-key');
      const weatherCityInput = document.getElementById('weather-city');
      const useGeolocationBtn = document.getElementById('use-geolocation');
      const saveTab2SettingsBtn = document.getElementById('save-tab2-settings');
      const closeTab2SettingsBtn = document.getElementById('close-tab2-settings');
      const settingsTabs = document.querySelectorAll('.settings-tab');
      const settingsPanels = document.querySelectorAll('.settings-panel');
      const addFeedBtn = document.getElementById('add-feed-btn');
      const saveFeedBtn = document.getElementById('save-feed-btn');
      const cancelFeedBtn = document.getElementById('cancel-feed-btn');
      const feedNameInput = document.getElementById('feed-name');
      const feedUrlInput = document.getElementById('feed-url');
      const addFeedForm = document.querySelector('.add-feed-form');
      const rssContainer = document.getElementById('rss-feeds-container');
      
      let editingFeedIndex = null;
  
      // Add flags to track if Tab2 data has been loaded
      let weatherDataLoaded = false;
      let rssDataLoaded = false;
  
      // Variables for drag-and-drop functionality
      let draggedItem = null;
      let draggedItemIndex = null;
      let originalPosition = null;
      let dropTargetIndex = null;
      let dragPlaceholder = null;
  
      // Tab1 Settings variables
      const tab1SettingsBtn = document.getElementById('tab1-settings-toggle');
      const tab1SettingsForm = document.getElementById('tab1-settings-form');
      const saveTab1SettingsBtn = document.getElementById('save-tab1-settings');
      const closeTab1SettingsBtn = document.getElementById('close-tab1-settings');
      const tab2Toggle = document.getElementById('tab2-toggle');
      const tab3Toggle = document.getElementById('tab3-toggle');
      const newTabToggle = document.getElementById('new-tab-toggle');
      
      // Background settings variables
      const bgConfigBtn = document.getElementById('bg-config-toggle');
      const backgroundForm = document.getElementById('background-form');
      const closeBackgroundBtn = document.getElementById('close-bg-settings');
      const bgOptions = document.querySelectorAll('.bg-option');
      const customBgUrl = document.getElementById('custom-bg-url');
      const applyCustomBgBtn = document.getElementById('apply-custom-bg');
      const blurSlider = document.getElementById('blur-slider');
      const blurValue = document.getElementById('blur-value');
      const resetBackgroundSettingsBtn = document.getElementById('resetBackgroundSettingsBtn');
      const sharpBordersToggle = document.getElementById('sharp-borders-toggle'); // Added
      const customBgColorInput = document.getElementById('custom-bg-color'); // Added
      const applyCustomColorBtn = document.getElementById('apply-custom-color'); // Added
      const backgroundOverlay = document.getElementById('background-overlay'); // Added for color overlay
      const customColorOpacitySlider = document.getElementById('custom-color-opacity-slider'); // Added
      const customColorOpacityValue = document.getElementById('custom-color-opacity-value'); // Added
      const overlayOpacitySection = document.querySelector('.overlay-opacity-section'); // Added to show/hide slider
      const disableShadowToggle = document.getElementById('disable-shadow-toggle'); // Added
      const windowBgColorInput = document.getElementById('window-bg-color'); // Added
      const windowBgOpacitySlider = document.getElementById('window-bg-opacity-slider'); // Added
      const windowBgOpacityValue = document.getElementById('window-bg-opacity-value'); // Added
      const applyWindowBgBtn = document.getElementById('apply-window-bg'); // Added: New apply button
      
      // ========== FUNCTION DECLARATIONS ==========
      // Function to switch tabs with slide animation
      function switchTab(tabId) {
          // Close dropdown menu when switching tabs
          if (dropdown) {
              dropdown.style.display = 'none';
          }
          
          // Close tab2 settings form when switching tabs
          if (tab2SettingsForm) {
              tab2SettingsForm.classList.remove('active');
          }
          
          // Also close tab1 settings form when switching tabs
          if (tab1SettingsForm) {
              tab1SettingsForm.classList.remove('active');
          }
          
          // Close tab3 settings form (main settings) when switching tabs
          if (settingsForm) {
              settingsForm.classList.remove('active');
          }
          
          // Check if the requested tab is hidden
          const targetTab = document.getElementById(tabId);
          if (targetTab && targetTab.classList.contains('tab-hidden')) {
              // If it's hidden, find the next visible tab
              const tabIndex = Array.from(tabContents).findIndex(content => content.id === tabId);
              let nextVisibleTabId = null;
              
              // Try to find next visible tab
              for (let i = tabIndex + 1; i < tabContents.length; i++) {
                  if (!tabContents[i].classList.contains('tab-hidden')) {
                      nextVisibleTabId = tabContents[i].id;
                      break;
                  }
              }
              
              // If no next visible tab, try previous ones
              if (!nextVisibleTabId) {
                  for (let i = tabIndex - 1; i >= 0; i--) {
                      if (!tabContents[i].classList.contains('tab-hidden')) {
                          nextVisibleTabId = tabContents[i].id;
                          break;
                      }
                  }
              }
              
              // Use the visible tab id instead, or stay on current if none found
              if (nextVisibleTabId) {
                  tabId = nextVisibleTabId;
              } else {
                  // All tabs are hidden? This shouldn't happen, but just in case
                  return;
              }
          }
          
          const targetTabIndex = Array.from(tabContents).findIndex(content => content.id === tabId);
          
          // Don't do anything if it's already the active tab
          if (targetTabIndex === currentTabIndex) return;
          
          // Determine direction of animation
          const direction = targetTabIndex > currentTabIndex ? 'right' : 'left';
          
          // Position all tabs based on their relation to the target tab
          tabContents.forEach((tab, index) => {
              if (index < targetTabIndex) {
                  tab.classList.remove('active', 'right');
                  tab.classList.add('left');
              } else if (index > targetTabIndex) {
                  tab.classList.remove('active', 'left');
                  tab.classList.add('right');
              } else {
                  tab.classList.remove('left', 'right');
                  tab.classList.add('active');
              }
          });
          
          // Update icon active states
          tabIcons.forEach(icon => icon.classList.remove('active'));
          document.querySelector(`.tab-icon[data-tab="${tabId}"]`).classList.add('active');
          
          // Show/hide add button based on active tab
          if (tabId === 'tab1') {
              addShortcutBtn.style.display = 'flex';
              settingsBtn.style.display = 'none';
              tab2SettingsBtn.style.display = 'none';
              tab1SettingsBtn.style.display = 'flex'; // Show Tab1 settings button
          } else if (tabId === 'tab2') {
              addShortcutBtn.style.display = 'none';
              settingsBtn.style.display = 'none';
              tab2SettingsBtn.style.display = 'flex';
              
              // Load Tab2 content only if it hasn't been loaded yet
              if (!weatherDataLoaded) {
                  loadWeatherData();
              }
              
              if (!rssDataLoaded) {
                  loadRssData();
              }
          } else if (tabId === 'tab3') {
              addShortcutBtn.style.display = 'none';
              settingsBtn.style.display = 'flex';
              tab2SettingsBtn.style.display = 'none';
          } else {
              addShortcutBtn.style.display = 'none';
              settingsBtn.style.display = 'none';
              tab2SettingsBtn.style.display = 'none';
          }
          
          // Update current tab index
          currentTabIndex = targetTabIndex;
      }
      
      // Add click event listeners to tab icons
      tabIcons.forEach(icon => {
          icon.addEventListener('click', function() {
              const tabId = this.getAttribute('data-tab');
              switchTab(tabId);
              
              // Update Tab1 settings button visibility
              if (tabId === 'tab1') {
                  tab1SettingsBtn.style.display = 'flex';
              } else {
                  tab1SettingsBtn.style.display = 'none';
              }
          });
      });
      
      // Prevent wheel events in todo and notes sections from triggering tab changes
      todoSection.addEventListener('wheel', function(event) {
          event.stopPropagation(); // Stops the event from bubbling up to main-window
      });
      
      notesSection.addEventListener('wheel', function(event) {
          event.stopPropagation(); // Stops the event from bubbling up to main-window
      });
      
      // Similarly protect the shortcuts-left container
      shortcutsLeft.addEventListener('wheel', function(event) {
          event.stopPropagation();
      });
  
      // Prevent wheel events in news section from triggering tab changes
      document.querySelector('.news-section').addEventListener('wheel', function(event) {
          event.stopPropagation(); // Stops the event from bubbling up to main-window
      });
  
      // Also prevent wheel events specifically in the news articles container
      document.querySelector('.news-articles-container').addEventListener('wheel', function(event) {
          event.stopPropagation();
      });
  
      // Add debounce mechanism to prevent rapid tab switching
      let wheelTimeout = null;
      const wheelDebounceTime = 10; // milliseconds to wait between wheel events
      
      // Helper function to find next visible tab
      function findNextVisibleTab(startIndex) {
          for (let i = startIndex + 1; i < tabContents.length; i++) {
              if (!tabContents[i].classList.contains('tab-hidden')) {
                  return i;
              }
          }
          return null; // No visible tab found
      }
      
      // Helper function to find previous visible tab
      function findPrevVisibleTab(startIndex) {
          for (let i = startIndex - 1; i >= 0; i--) {
              if (!tabContents[i].classList.contains('tab-hidden')) {
                  return i;
              }
          }
          return null; // No visible tab found
      }
      
      // Function to handle tab switching via wheel event with debounce
      function handleWheelTabSwitch(event) {
          event.preventDefault();
          
          // Clear any existing timeout to reset the debounce timer
          if (wheelTimeout) {
              clearTimeout(wheelTimeout);
          }
          
          wheelTimeout = setTimeout(() => {
              if (event.deltaY > 0) {
                  // Scroll down - go to next visible tab
                  const nextVisibleIndex = findNextVisibleTab(currentTabIndex);
                  
                  if (nextVisibleIndex !== null) {
                      const tabId = tabContents[nextVisibleIndex].id;
                      switchTab(tabId);
                  }
              } else {
                  // Scroll up - go to previous visible tab
                  const prevVisibleIndex = findPrevVisibleTab(currentTabIndex);
                  
                  if (prevVisibleIndex !== null) {
                      const tabId = tabContents[prevVisibleIndex].id;
                      switchTab(tabId);
                  }
              }
              
              // Reset timeout variable when done
              wheelTimeout = null;
          }, wheelDebounceTime);
      }
      
      // Add wheel event listener to main window for scrolling through tabs
      mainWindow.addEventListener('wheel', function(event) {
          // Check if event is coming from todo or notes sections
          if (event.target.closest('.todo-section') || event.target.closest('.notes-section')) {
              return; // Don't switch tabs if scrolling in these sections
          }
          
          handleWheelTabSwitch(event);
      });
      
      // Add wheel event listeners to body and status bar for tab switching
      body.addEventListener('wheel', function(event) {
          // Only handle events that didn't originate in main window
          if (!event.target.closest('#main-window')) {
              handleWheelTabSwitch(event);
          }
      });
      
      statusBar.addEventListener('wheel', function(event) {
          handleWheelTabSwitch(event);
      });
      
      // Initialize first tab positioning
      tabContents[0].classList.add('active');
      for (let i = 1; i < tabContents.length; i++) {
          tabContents[i].classList.add('right');
      }
  
      // Initial setup for button visibility
      if (currentTabIndex === 0) {
          addShortcutBtn.style.display = 'flex';
          settingsBtn.style.display = 'none';
          tab2SettingsBtn.style.display = 'none';
          tab1SettingsBtn.style.display = 'flex'; // Show Tab1 settings button
      } else if (currentTabIndex === 1) { // Tab2 is index 1
          addShortcutBtn.style.display = 'none';
          settingsBtn.style.display = 'none';
          tab2SettingsBtn.style.display = 'flex';
      } else if (currentTabIndex === 2) { // Tab3 is index 2
          addShortcutBtn.style.display = 'none';
          settingsBtn.style.display = 'flex';
          tab2SettingsBtn.style.display = 'none';
      } else {
          addShortcutBtn.style.display = 'none';
          settingsBtn.style.display = 'none';
          tab2SettingsBtn.style.display = 'none';
      }
  
      // ===== SHORTCUTS MANAGEMENT =====
      
      // Load shortcuts from local storage
      function loadShortcuts() {
          const shortcuts = JSON.parse(localStorage.getItem('dmx-shortcuts')) || [];
          
          shortcutsGrid.innerHTML = '';
          
          if (shortcuts.length > 0) {
              // Organize shortcuts into rows of maximum 6 items
              const maxItemsPerRow = 6;
              let currentRow = null;
              
              shortcuts.forEach((shortcut, index) => {
                  // Create new row if needed
                  if (index % maxItemsPerRow === 0) {
                      currentRow = document.createElement('div');
                      currentRow.className = 'row';
                      shortcutsGrid.appendChild(currentRow);
                  }
                  
                  // Add shortcut to the current row instead of directly to grid
                  addShortcutToGrid(shortcut, index, currentRow);
              });
          } else {
              // If no shortcuts exist, add a default help message with improved styling
              const helpText = document.createElement('div');
              helpText.innerHTML = "<i class='fas fa-lightbulb' style='font-size: 24px; margin-bottom: 15px;'></i><br>Click the + button to add your favorite websites <br> Found in bottom corner of the page";
              /* helpText.style.color = "#787c99"; */
              helpText.style.color = "#bb9af7";
              helpText.style.padding = "20px 20px";
              helpText.style.textAlign = "center";
              helpText.style.gridColumn = "1 / -1"; // Span all columns
              helpText.style.fontSize = "16px";
              helpText.style.backgroundColor = "rgba(26, 27, 38, 0.8)";
              helpText.style.top = "85%";
              helpText.style.position = "relative";
              /* helpText.style.borderRadius = "12px"; */
              shortcutsGrid.appendChild(helpText);
          }
          
          // Always show shortcuts-left
          shortcutsLeft.classList.remove('empty-container');
          
          updateDropdownCounters();
          handleWindowResize();
      }
      
      // Save shortcuts to local storage
      function saveShortcuts(shortcuts) {
          localStorage.setItem('dmx-shortcuts', JSON.stringify(shortcuts));
          updateDropdownCounters();
      }
      
      // Add shortcut to grid
      function addShortcutToGrid(shortcut, index, container) {
          // Create container div for the shortcut
          const shortcutElement = document.createElement('div');
          shortcutElement.className = 'shortcut-item sharp';
          shortcutElement.dataset.index = index;
          
          // Add draggable attribute and drag events when in edit mode
          shortcutElement.setAttribute('draggable', 'true');
          
          // Add drag event listeners
          shortcutElement.addEventListener('dragstart', handleDragStart);
          shortcutElement.addEventListener('dragend', handleDragEnd);
          shortcutElement.addEventListener('dragover', handleDragOver);
          shortcutElement.addEventListener('dragenter', handleDragEnter);
          shortcutElement.addEventListener('dragleave', handleDragLeave);
          shortcutElement.addEventListener('drop', handleDrop);
          
          // Create the actual link element
          const linkElement = document.createElement('a');
          linkElement.href = shortcut.url;
          linkElement.className = 'shortcut-link';
          
          // Check if shortcuts should open in new tab
          const tabSettings = JSON.parse(localStorage.getItem('dmx-tab-visibility')) || {};
          if (tabSettings.openInNewTab === true) { // Open-in-New Tab setting disabled by default
              linkElement.target = '_blank';
              linkElement.rel = 'noopener noreferrer'; // Security best practice
          }
          
          // Get favicon or use default icon
          const iconElement = document.createElement('div');
          iconElement.className = 'shortcut-icon';
          
          // Create image with loading placeholder
          const iconImg = document.createElement('img');
          
          // Add a placeholder icon while loading
          iconImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3YWEyZjciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PC9zdmc+';
          
          // Get the favicon URL (check cache first, then Google service)
          const domain = extractDomain(shortcut.url);
          if (domain) {
              shortcutElement.dataset.domain = domain; // Set data attribute here
              getFaviconUrl(domain, (faviconUrl) => {
                  if (faviconUrl) {
                      iconImg.src = faviconUrl; // Set src directly to cached data URL or fetched URL
                  }
                  // If faviconUrl is null (error fetching/converting), the placeholder remains
              });
          }
          
          iconElement.appendChild(iconImg);
          
          const nameElement = document.createElement('div');
          nameElement.className = 'shortcut-name sharp';
          nameElement.textContent = shortcut.name;
          
          // Add icon and name to the link
          linkElement.appendChild(iconElement);
          linkElement.appendChild(nameElement);
          
          // Add link to the container
          shortcutElement.appendChild(linkElement);
          
          // Add edit button (separate from the link)
          const editBtn = document.createElement('div');
          editBtn.className = 'edit-shortcut';
          editBtn.innerHTML = '<i class="fas fa-edit"></i>';
          editBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              configureShortcut(index);
          });
          
          shortcutElement.appendChild(editBtn);
          
          // Add the element to the specified container instead of shortcutsGrid
          container.appendChild(shortcutElement);
      }
      
      // Helper function to extract domain from URL
      function extractDomain(url) {
          try {
              const urlObject = new URL(url);
              return urlObject.hostname;
          } catch (e) {
              return null;
          }
      }
      
      // Helper function to get favicon URL for a website - with localStorage caching
      function getFaviconUrl(domain, callback) {
          if (!domain) {
              console.error("[Favicon] getFaviconUrl called with no domain."); // Added log
              callback('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3YWEyZjciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PC9zdmc+'); // Default icon on error
              return;
          }

          const cacheKey = `dmx-favicon-cache-${domain}`;
          const cachedFavicon = localStorage.getItem(cacheKey);

          if (cachedFavicon) {
              console.log(`[Favicon] Cache hit for ${domain}`); // Added log
              callback(cachedFavicon);
              return;
          }
          console.log(`[Favicon] Cache miss for ${domain}. Fetching via proxy...`); // Updated log

          // Use allorigins proxy to bypass CORS
          const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
          // Use the /raw endpoint which might return the image directly
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(googleFaviconUrl)}`;
          console.log(`[Favicon] Requesting proxied URL: ${proxyUrl}`); // Added log

          fetch(proxyUrl) // Fetch via the proxy
              .then(response => {
                  if (!response.ok) {
                      // Log the status text from the proxy response
                      throw new Error(`[Favicon] Proxy response was not ok for ${domain}: ${response.status} ${response.statusText}`);
                  }
                  // Check content type - might be useful for debugging
                  console.log(`[Favicon] Proxy response Content-Type for ${domain}: ${response.headers.get('Content-Type')}`);
                  return response.blob();
              })
              .then(blob => {
                  // Check if the blob is valid image data (basic check)
                  if (!blob || blob.size === 0 || !blob.type.startsWith('image/')) {
                      console.warn(`[Favicon] Received invalid blob for ${domain}. Type: ${blob?.type}, Size: ${blob?.size}`);
                      throw new Error(`Invalid blob received for ${domain}`);
                  }

                  // Use FileReader to convert blob to base64 data URL
                  const reader = new FileReader();
                  reader.onloadend = () => {
                      const base64data = reader.result;
                      console.log(`[Favicon] Fetched and caching for ${domain}`); // Added log
                      try {
                          // Check if base64 data looks reasonable before saving
                          if (base64data && base64data.startsWith('data:image')) {
                              localStorage.setItem(cacheKey, base64data);
                              callback(base64data);
                          } else {
                              console.warn(`[Favicon] Invalid base64 data received for ${domain}, not caching.`);
                              throw new Error(`Invalid base64 data received for ${domain}`);
                          }
                      } catch (e) {
                          console.error(`[Favicon] Error saving to localStorage for ${domain}:`, e);
                          // Fallback to default icon if storage fails or data is invalid
                           callback('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3YWEyZjciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PC9zdmc+');
                      }
                  };
                  reader.onerror = (error) => { // Handle FileReader errors
                      console.error(`[Favicon] FileReader error for ${domain}:`, error);
                      callback('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3YWEyZjciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PC9zdmc+');
                  };
                  reader.readAsDataURL(blob);
              })
              .catch(error => {
                  console.error(`[Favicon] Error fetching proxied favicon for ${domain}:`, error);
                  // Fallback to default icon on fetch error
                  callback('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3YWEyZjciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PC9zdmc+');
              });
      }
      
      // Configure an existing shortcut
      function configureShortcut(index) {
          const shortcuts = JSON.parse(localStorage.getItem('dmx-shortcuts')) || [];
          const shortcut = shortcuts[index];
          
          // Set form inputs to current values
          shortcutNameInput.value = shortcut.name;
          shortcutUrlInput.value = shortcut.url;
          
          // Hide category selection section if it exists
          const categorySelect = document.querySelector('.form-group:has(#shortcut-category)');
          if (categorySelect) {
              categorySelect.style.display = 'none';
          }
          
          // Add delete option if it doesn't exist yet
          let deleteOption = document.querySelector('.delete-shortcut-option');
          if (!deleteOption) {
              deleteOption = document.createElement('div');
              deleteOption.className = 'delete-shortcut-option';
              
              const deleteBtn = document.createElement('button');
              deleteBtn.className = 'delete-btn';
              deleteBtn.textContent = 'Delete Shortcut';
              deleteBtn.id = 'delete-shortcut-btn';
              
              deleteOption.appendChild(deleteBtn);
              shortcutForm.insertBefore(deleteOption, document.querySelector('.form-buttons'));
              
              // Add event listener to delete button
              document.getElementById('delete-shortcut-btn').addEventListener('click', () => {
                  if (editingShortcutIndex !== null) {
                      deleteShortcut(editingShortcutIndex);
                      shortcutForm.classList.remove('active');
                      editingShortcutIndex = null;
                  }
              });
          }
          
          // Show delete option
          deleteOption.style.display = 'block';
          
          // Update form title
          const formTitle = shortcutForm.querySelector('h3');
          formTitle.textContent = 'Edit Shortcut';
          
          // Show the form
          shortcutForm.classList.add('active');
          
          // Set editing index
          editingShortcutIndex = index;
      }
      
      // Delete shortcut
      function deleteShortcut(index) {
          const shortcuts = JSON.parse(localStorage.getItem('dmx-shortcuts')) || [];
          shortcuts.splice(index, 1);
          saveShortcuts(shortcuts);
          loadShortcuts();
          // Also close the form if it was open for editing the deleted shortcut
          if (editingShortcutIndex === index) {
             shortcutForm.classList.remove('active');
             editingShortcutIndex = null;
          }
      }
      
      // Toggle shortcut form for adding new shortcut
      addWebsiteOption.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent event bubbling
          
          // Check if total shortcut limit has been reached
          const shortcuts = JSON.parse(localStorage.getItem('dmx-shortcuts')) || [];
          if (shortcuts.length >= MAX_TOTAL_SHORTCUTS) {
              alert(`You can only create a maximum of ${MAX_TOTAL_SHORTCUTS} shortcuts total.`);
              return;
          }
          
          // Reset form for adding new shortcut
          shortcutForm.querySelector('h3').textContent = 'Add New Shortcut';
          shortcutNameInput.value = '';
          shortcutUrlInput.value = '';
          
          // Hide category selection if it exists
          const categorySelect = document.querySelector('.form-group:has(#shortcut-category)');
          if (categorySelect) {
              categorySelect.style.display = 'none';
          }
          
          editingShortcutIndex = null;
          
          // Hide delete option if it exists
          const deleteOption = document.querySelector('.delete-shortcut-option');
          if (deleteOption) {
              deleteOption.style.display = 'none';
          }
          
          shortcutForm.classList.add('active');
      });
      
      // Cancel shortcut form
      cancelShortcutBtn.addEventListener('click', () => {
          shortcutForm.classList.remove('active');
          editingShortcutIndex = null;
      });
      
      // Save shortcut (new or edited)
      saveShortcutBtn.addEventListener('click', () => {
          const name = shortcutNameInput.value.trim();
          let url = shortcutUrlInput.value.trim();
          
          if (!name || !url) {
              alert('Please fill in all fields');
              return;
          }
          
          // Add https:// if not present
          if (!/^https?:\/\//i.test(url)) {
              url = 'https://' + url;
          }
          
          const shortcuts = JSON.parse(localStorage.getItem('dmx-shortcuts')) || [];
          
          if (editingShortcutIndex !== null) {
              // Update existing shortcut
              shortcuts[editingShortcutIndex] = { name, url };
          } else {
              // Add new shortcut
              shortcuts.push({ name, url });
          }
          
          saveShortcuts(shortcuts);
          loadShortcuts();
          shortcutForm.classList.remove('active');
          editingShortcutIndex = null;
      });
      
      // ===== NOTES FUNCTIONALITY =====
      
      // Load saved notes from localStorage
      function loadNotes() {
          const savedNotes = localStorage.getItem('dmx-notes') || '';
          notesArea.value = savedNotes;
      }
      
      // Save notes to localStorage when changed
      notesArea.addEventListener('input', () => {
          localStorage.setItem('dmx-notes', notesArea.value);
      });
      
      // ===== TODO LIST FUNCTIONALITY =====
      
      // Load todo items from localStorage
      function loadTodoItems() {
          const todos = JSON.parse(localStorage.getItem('dmx-todos')) || [];
          todoList.innerHTML = '';
          
          todos.forEach((todo, index) => {
              addTodoToList(todo, index);
          });
      }
      
      // Save todo items to localStorage
      function saveTodoItems(todos) {
          localStorage.setItem('dmx-todos', JSON.stringify(todos));
      }
      
      // Add todo item to the list
      function addTodoToList(todo, index) {
          const todoItem = document.createElement('li');
          todoItem.className = 'todo-item';
          if (todo.completed) {
              todoItem.classList.add('todo-completed');
          }
          todoItem.dataset.index = index;
          
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'todo-checkbox';
          checkbox.checked = todo.completed;
          checkbox.addEventListener('change', () => toggleTodoComplete(index));
          
          const todoText = document.createElement('span');
          todoText.className = 'todo-text';
          todoText.textContent = todo.text;
          
          const deleteBtn = document.createElement('span');
          deleteBtn.className = 'todo-delete';
          deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
          deleteBtn.addEventListener('click', () => deleteTodoItem(index));
          
          todoItem.appendChild(checkbox);
          todoItem.appendChild(todoText);
          todoItem.appendChild(deleteBtn);
          
          todoList.appendChild(todoItem);
      }
      
      // Add new todo item
      addTodoBtn.addEventListener('click', () => {
          const todoText = todoInput.value.trim();
          if (todoText) {
              const todos = JSON.parse(localStorage.getItem('dmx-todos')) || [];
              const newTodo = {
                  text: todoText,
                  completed: false
              };
              
              todos.push(newTodo);
              saveTodoItems(todos);
              loadTodoItems();
              todoInput.value = '';
          }
      });
      
      // Allow adding todo with Enter key
      todoInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
              addTodoBtn.click();
          }
      });
      
      // Toggle todo completed state
      function toggleTodoComplete(index) {
          const todos = JSON.parse(localStorage.getItem('dmx-todos')) || [];
          todos[index].completed = !todos[index].completed;
          saveTodoItems(todos);
          loadTodoItems();
      }
      
      // Delete todo item
      function deleteTodoItem(index) {
          const todos = JSON.parse(localStorage.getItem('dmx-todos')) || [];
          todos.splice(index, 1);
          saveTodoItems(todos);
          loadTodoItems();
      }
      
      // ===== EXPORT/IMPORT FUNCTIONALITY =====
      
      // Toggle settings form
      settingsBtn.addEventListener('click', () => {
          console.log('Settings button clicked'); // Log click
          if (settingsForm) {
              console.log('Settings form found. Current classes before toggle:', settingsForm.className);
              settingsForm.classList.toggle('active');
              console.log('Settings form classes after toggle:', settingsForm.className);
              // Ensure notification is reset when opening
              if (importNotification) importNotification.className = 'import-notification'; 
          } else {
              console.error('Settings form element (#settings-form) not found!');
          }
      });
      
      // Close settings form
      closeSettingsBtn.addEventListener('click', () => {
          settingsForm.classList.remove('active');
          if (importNotification) importNotification.className = 'import-notification';
      });
      
      // Update export to include only current data structures
      exportBtn.addEventListener('click', () => {
          const shortcuts = JSON.parse(localStorage.getItem('dmx-shortcuts')) || [];
          const notes = localStorage.getItem('dmx-notes') || '';
          const todos = JSON.parse(localStorage.getItem('dmx-todos')) || [];
          const weatherSettings = JSON.parse(localStorage.getItem('dmx-weather-settings')) || {};
          const rssFeeds = JSON.parse(localStorage.getItem('dmx-rss-feeds')) || [];
          const background = localStorage.getItem('dmx-background');
          const blur = localStorage.getItem('dmx-blur');
          const sharpBorders = localStorage.getItem('dmx-sharp-borders');
          const overlayColor = localStorage.getItem('dmx-overlay-color');
          const overlayOpacity = localStorage.getItem('dmx-overlay-opacity');
          const tabVisibility = JSON.parse(localStorage.getItem('dmx-tab-visibility')) || {};
          const disableShadow = localStorage.getItem('dmx-disable-shadow'); // Added
          const windowBgColor = localStorage.getItem('dmx-window-bg-color'); // Added
          const windowBgOpacity = localStorage.getItem('dmx-window-bg-opacity'); // Added
          
          const settings = {
              shortcuts: shortcuts,
              notes: notes,
              todos: todos,
              weatherSettings: weatherSettings,
              rssFeeds: rssFeeds,
              background: background, // Include background settings
              blur: blur,
              sharpBorders: sharpBorders,
              overlayColor: overlayColor,
              overlayOpacity: overlayOpacity,
              tabVisibility: tabVisibility,
              disableShadow: disableShadow, // Added
              windowBgColor: windowBgColor, // Added
              windowBgOpacity: windowBgOpacity // Added
              // Favicon cache is NOT exported intentionally, it will rebuild
          };
          
          const dataStr = JSON.stringify(settings, null, 2);
          const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
          
          const exportFileDefaultName = 'dmx-tab-settings.json';
          
          const linkElement = document.createElement('a');
          linkElement.setAttribute('href', dataUri);
          linkElement.setAttribute('download', exportFileDefaultName);
          linkElement.click();
      });
      
      // Update import to handle expanded data structure
      importBtn.addEventListener('click', () => {
          const file = importFile.files[0];
          if (!file) {
              showImportNotification('Please select a file to import', 'error');
              return;
          }
          
          const reader = new FileReader();
          reader.onload = function(e) {
              try {
                  const importedSettings = JSON.parse(e.target.result);
      
                  // Clear existing favicon cache before importing other settings
                  clearFaviconCache();
      
                  // Import shortcuts
                  if (importedSettings.shortcuts && Array.isArray(importedSettings.shortcuts)) {
                      // Basic validation for shortcut structure
                      const validShortcuts = importedSettings.shortcuts.filter(s => s && typeof s.name === 'string' && typeof s.url === 'string');
                      localStorage.setItem('dmx-shortcuts', JSON.stringify(validShortcuts));
                      loadShortcuts(); // Reload UI
                  } else {
                      localStorage.removeItem('dmx-shortcuts'); // Clear if invalid/missing
                      loadShortcuts();
                  }
      
                  // Import notes
                  if (importedSettings.notes) {
                      localStorage.setItem('dmx-notes', importedSettings.notes);
                  }
                  
                  // Import todos
                  if (importedSettings.todos) {
                      localStorage.setItem('dmx-todos', JSON.stringify(importedSettings.todos));
                  }
                  
                  // Import weather settings (including units)
                  if (importedSettings.weatherSettings) {
                      localStorage.setItem('dmx-weather-settings', JSON.stringify(importedSettings.weatherSettings));
                      if (importedSettings.weatherSettings.units) {
                          localStorage.setItem('dmx-weather-units', importedSettings.weatherSettings.units);
                      }
                  }
                  
                  // Import RSS feeds
                  if (importedSettings.rssFeeds) {
                      localStorage.setItem('dmx-rss-feeds', JSON.stringify(importedSettings.rssFeeds));
                  }
                  
                  // Import background settings (optional, might be in older exports)
                  if (importedSettings.background) localStorage.setItem('dmx-background', importedSettings.background);
                  if (importedSettings.blur) localStorage.setItem('dmx-blur', importedSettings.blur);
                  if (importedSettings.sharpBorders) localStorage.setItem('dmx-sharp-borders', importedSettings.sharpBorders);
                  if (importedSettings.overlayColor) localStorage.setItem('dmx-overlay-color', importedSettings.overlayColor);
                  if (importedSettings.overlayOpacity) localStorage.setItem('dmx-overlay-opacity', importedSettings.overlayOpacity);
                  if (importedSettings.disableShadow) localStorage.setItem('dmx-disable-shadow', importedSettings.disableShadow); // Added
                  if (importedSettings.windowBgColor) localStorage.setItem('dmx-window-bg-color', importedSettings.windowBgColor); // Added
                  if (importedSettings.windowBgOpacity) localStorage.setItem('dmx-window-bg-opacity', importedSettings.windowBgOpacity); // Added
                  
                  // Import tab visibility settings (optional)
                  if (importedSettings.tabVisibility) localStorage.setItem('dmx-tab-visibility', JSON.stringify(importedSettings.tabVisibility));
                  
                  // Reload all relevant parts of the UI
                  loadShortcuts();
                  loadNotes();
                  loadTodoItems();
                  loadTab2Settings(); // Includes loading RSS feeds list
                  applyAllBackgroundSettings(); // Reload background, blur, etc.
                  initTabVisibility(); // Reload tab visibility
                  loadWeatherData(); // Reload weather
                  loadRssData(); // Reload RSS
      
                  showImportNotification('Settings imported successfully!', 'success');
                  settingsForm.classList.remove('active'); // Close form on success
      
              } catch (error) {
                  console.error('Error parsing or applying imported settings:', error);
                  showImportNotification('Error importing settings. Invalid file format.', 'error');
              }
          };
          reader.readAsText(file);
      });
      
      // Add reset configuration functionality
      const resetConfigBtn = document.getElementById('reset-config-btn');
      if (resetConfigBtn) {
          resetConfigBtn.addEventListener('click', () => {
              // Show a confirmation dialog
              if (confirm('Are you sure you want to reset all configuration? This will delete all shortcuts, notes, todos, and settings. This action cannot be undone.')) {
                  // Clear all known localStorage keys
                  APP_LOCAL_STORAGE_KEYS.forEach(key => {
                      localStorage.removeItem(key);
                      console.log(`Removed ${key} from localStorage.`);
                  });
      
                  // Clear dynamic favicon cache
                  clearFaviconCache();
      
                  // Reload the page to apply default settings
                  window.location.reload();
              }
          });
      }

      // Function to clear all favicon cache entries from localStorage
      function clearFaviconCache() {
          console.log("[Favicon] Clearing favicon cache...");
          Object.keys(localStorage).forEach(key => {
              if (key.startsWith('dmx-favicon-cache-')) {
                  localStorage.removeItem(key);
                  // console.log(`Removed ${key} from localStorage.`);
              }
          });
          console.log("[Favicon] Favicon cache cleared.");
      }
      
      // Function to update the dropdown counters
      function updateDropdownCounters() {
          const shortcuts = JSON.parse(localStorage.getItem('dmx-shortcuts')) || [];
          document.getElementById('shortcuts-counter').textContent = `${shortcuts.length}/${MAX_TOTAL_SHORTCUTS}`;
          
          // Hide categories counter
          const categoriesCounter = document.getElementById('categories-counter');
          if (categoriesCounter && categoriesCounter.parentElement) {
              categoriesCounter.parentElement.style.display = 'none';
          }
      }
      
      // SIMPLIFIED EDIT MODE TOGGLE - COMPLETELY REWRITTEN
      // Direct click handler for the toggle edit mode option
      if (toggleEditModeOption) {
          toggleEditModeOption.addEventListener('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
              
              console.log("Edit mode toggle clicked");
              
              // Get current state
              const isCurrentlyEditMode = document.body.classList.contains('edit-mode');
              
              // Toggle to opposite state
              const newEditModeState = !isCurrentlyEditMode;
              console.log("Toggling edit mode from", isCurrentlyEditMode, "to", newEditModeState);
              
              // Save state to localStorage
              localStorage.setItem('dmx-edit-mode', String(newEditModeState));
              
              // Apply the state to the UI
              applyEditModeState(newEditModeState);
              
              // Hide dropdown after selection
              if (dropdown) dropdown.style.display = 'none';
          });
      } else {
          console.error("Toggle edit mode option element not found!");
      }
  
      // Separate function to apply edit mode state to UI
      function applyEditModeState(isEditMode) {
          console.log("Applying edit mode state:", isEditMode);
          
          if (isEditMode) {
              document.body.classList.add('edit-mode');
              if (editModeLabel) editModeLabel.textContent = 'Disable Editing';
              if (toggleEditModeOption) toggleEditModeOption.classList.add('active');
              showEditInstructions();
          } else {
              document.body.classList.remove('edit-mode');
              if (editModeLabel) editModeLabel.textContent = 'Enable Editing';
              if (toggleEditModeOption) toggleEditModeOption.classList.remove('active');
              hideEditInstructions();
          }
      }
      
      // Initialize edit mode on page load
      function initEditMode() {
          const savedEditMode = localStorage.getItem('dmx-edit-mode');
          console.log("Initializing edit mode. Saved state:", savedEditMode);
          
          // Default to false if not set
          const isEditMode = savedEditMode === 'true';
          
          // Apply the state to the UI
          applyEditModeState(isEditMode);
      }
      
      // Function to show edit mode instructions
      function showEditInstructions() {
          // Check if instructions already exist
          if (document.getElementById('edit-instructions')) return;
          
          // Only show if we have shortcuts
          const shortcuts = JSON.parse(localStorage.getItem('dmx-shortcuts')) || [];
          if (shortcuts.length <= 1) return; // No need for instructions with 0-1 shortcuts
          
          const instructions = document.createElement('div');
          instructions.id = 'edit-instructions';
          instructions.className = 'edit-instructions';
          instructions.innerHTML = '<i class="fas fa-arrows-alt"></i> Drag shortcuts to reorder';
          
          // Insert at the top of shortcuts-left
          const shortcutsLeft = document.querySelector('.shortcuts-left');
          shortcutsLeft.insertBefore(instructions, shortcutsLeft.firstChild);
          
          // Fade in animation
          setTimeout(() => {
              instructions.style.opacity = '1';
          }, 10);
      }
      
      // Function to hide edit mode instructions
      function hideEditInstructions() {
          const instructions = document.getElementById('edit-instructions');
          if (instructions) {
              instructions.style.opacity = '0';
              setTimeout(() => {
                  if (instructions.parentNode) {
                      instructions.parentNode.removeChild(instructions);
                  }
              }, 300); // Match fade-out transition duration
          }
      }
  
      // Drag and drop functionality for reordering shortcuts
      function handleDragStart(e) {
          // Only allow dragging in edit mode
          if (!document.body.classList.contains('edit-mode')) {
              e.preventDefault();
              return false;
          }
          
          // Prevent drag from starting on edit button click
          if (e.target.closest('.edit-shortcut')) {
              e.preventDefault();
              return false;
          }
          
          draggedItem = this;
          draggedItemIndex = parseInt(this.dataset.index);
          originalPosition = {
              x: e.clientX,
              y: e.clientY
          };
          
          // Create visual feedback - make item semi-transparent
          setTimeout(() => {
              this.style.opacity = '0.4';
              
              // Create placeholder
              dragPlaceholder = document.createElement('div');
              dragPlaceholder.className = 'shortcut-item drag-placeholder';
              dragPlaceholder.style.opacity = '0.3';
              dragPlaceholder.style.border = '2px dashed #bb9af7';
              dragPlaceholder.style.backgroundColor = 'rgba(187, 154, 247, 0.2)';
              dragPlaceholder.style.boxShadow = 'none';
          }, 0);
          
          // Set drag data
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/html', this.innerHTML);
          
          // Add a class to body to indicate dragging state
          document.body.classList.add('dragging-shortcut');
      }
      
      function handleDragEnd(e) {
          this.style.opacity = '1';
          
          // Remove placeholder if it exists
          if (dragPlaceholder && dragPlaceholder.parentNode) {
              dragPlaceholder.parentNode.removeChild(dragPlaceholder);
          }
          
          // Remove dragging class from body
          document.body.classList.remove('dragging-shortcut');
          
          // Reset variables
          draggedItem = null;
          draggedItemIndex = null;
          originalPosition = null;
          dropTargetIndex = null;
          dragPlaceholder = null;
          
          // Remove temporary styles from all shortcuts
          const shortcuts = document.querySelectorAll('.shortcut-item');
          shortcuts.forEach(item => {
              item.classList.remove('drag-over');
              item.style.transform = '';
          });
      }
      
      function handleDragOver(e) {
          if (!draggedItem) return;
          
          // Prevent default to allow drop
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          
          return false;
      }
      
      function handleDragEnter(e) {
          if (!draggedItem) return;
          
          // Add indicator class
          this.classList.add('drag-over');
      }
      
      function handleDragLeave(e) {
          if (!draggedItem) return;
          
          // Remove indicator class
          this.classList.remove('drag-over');
      }
      
      function handleDrop(e) {
          if (!draggedItem || draggedItem === this) return;
          
          // Prevent default action
          e.stopPropagation();
          e.preventDefault();
          
          // Get target index
          dropTargetIndex = parseInt(this.dataset.index);
          
          // Reorder the shortcuts array
          const shortcuts = JSON.parse(localStorage.getItem('dmx-shortcuts')) || [];
          
          // Move item from draggedItemIndex to dropTargetIndex
          const itemToMove = shortcuts.splice(draggedItemIndex, 1)[0];
          shortcuts.splice(dropTargetIndex, 0, itemToMove);
          
          // Save the new order
          saveShortcuts(shortcuts);
          
          // Reload the shortcuts grid
          loadShortcuts();
          
          return false;
      }
  
      // Initial load
      loadShortcuts();
      loadNotes();
      loadTodoItems();
      
      // Initialize edit mode AFTER shortcuts are loaded
      setTimeout(initEditMode, 100);
      
      handleWindowResize(); // Initialize grid layout
      
      // Ensure the add button itself doesn't interfere with dropdown clicks
      addShortcutBtn.addEventListener('click', (e) => {
          const isVisible = window.getComputedStyle(dropdown).display !== 'none';
          
          if (isVisible) {
              dropdown.style.display = 'none';
          } else {
              dropdown.style.display = 'block';
          }
          
          // Prevent this click from being caught by our document click handler
          e.stopPropagation();
      });
      
      // Close dropdown when mouse leaves the dropdown area
      if (dropdown) {
          dropdown.addEventListener('mouseleave', () => {
              setTimeout(() => {
                  dropdown.style.display = 'none';
              }, 300); // Small delay to make it feel less abrupt
          });
      }
      
      // Close dropdown when clicking anywhere else on the page
      document.addEventListener('click', (e) => {
          if (dropdown && 
              dropdown.style.display === 'block' && 
              !dropdown.contains(e.target) && 
              !addShortcutBtn.contains(e.target)) {
              dropdown.style.display = 'none';
          }
      });
      
      // Check if localStorage is available
      try {
          if (typeof localStorage !== 'undefined') {
              // Try to access localStorage
              localStorage.setItem('test', 'test');
              localStorage.removeItem('test');
              console.log('localStorage is available');
          } else {
              console.error('localStorage is not available');
              alert('This browser does not support localStorage, which is required for this app to work.');
          }
      } catch (e) {
          console.error('Error accessing localStorage:', e);
          alert('Error accessing localStorage. Private browsing mode may be enabled.');
      }
  
      // ===== TAB2 - WEATHER & RSS FUNCTIONALITY =====
      
      // Weather Data Function - Updated to use WeatherAPI.com
      function loadWeatherData() {
          const weatherLoading = document.getElementById('weather-loading');
          const weatherError = document.getElementById('weather-error');
          const weatherContent = document.getElementById('weather-content');
          
          // No longer checking if tab is active - we want to load regardless
          
          // Reset display states
          weatherLoading.style.display = 'block';
          weatherError.style.display = 'none';
          weatherContent.style.display = 'none';
          
          // Get weather settings
          const weatherSettings = JSON.parse(localStorage.getItem('dmx-weather-settings')) || {};
          const apiKey = weatherSettings.apiKey;
          
          // If no API key, show error
          if (!apiKey) {
              weatherLoading.style.display = 'none';
              weatherError.style.display = 'block';
              weatherError.textContent = 'No WeatherAPI.com API key configured. Please add your API key in settings.';
              weatherDataLoaded = true; // Mark as loaded even if there's an error
              return;
          }
  
          // WeatherAPI.com requires a location parameter
          let location;
          
          // Determine which location to use based on settings
          if (weatherSettings.useGeolocation && weatherSettings.lat && weatherSettings.lon) {
              // Use coordinates
              location = `${weatherSettings.lat},${weatherSettings.lon}`;
          } else if (weatherSettings.city) {
              // Use city name
              location = weatherSettings.city;
          } else {
              // Try to get current location
              if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(position => {
                      const lat = position.coords.latitude;
                      const lon = position.coords.longitude;
                      const locationCoords = `${lat},${lon}`;
                      
                      // Make API request with coordinates
                      const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${locationCoords}&aqi=no`;
                      fetchWeatherData(apiUrl);
                  }, error => {
                      console.error('Geolocation error:', error);
                      weatherLoading.style.display = 'none';
                      weatherError.style.display = 'block';
                      weatherError.textContent = 'Location access denied. Please configure a city in settings.';
                  });
                  return; // Exit early as we're handling the fetch in the callback
              } else {
                  weatherLoading.style.display = 'none';
                  weatherError.style.display = 'block';
                  weatherError.textContent = 'Geolocation is not supported by this browser. Please configure a city in settings.';
                  return;
              }
          }
          
          // Make API request if we have a location
          if (location) {
              const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=no`;
              fetchWeatherData(apiUrl);
          }
      }
      
      // Function to fetch weather data from API
      function fetchWeatherData(apiUrl) {
          const weatherLoading = document.getElementById('weather-loading');
          const weatherError = document.getElementById('weather-error');
          
          fetch(apiUrl)
              .then(response => {
                  if (!response.ok) {
                      throw new Error(`Weather API returned status: ${response.status}`);
                  }
                  return response.json();
              })
              .then(data => {
                  displayWeatherData(data);
                  weatherDataLoaded = true; // Mark weather as loaded when successful
              })
              .catch(error => {
                  console.error('Error fetching weather data:', error);
                  weatherLoading.style.display = 'none';
                  weatherError.style.display = 'block';
                  weatherError.textContent = `Error loading weather data: ${error.message}`;
                  weatherDataLoaded = true; // Mark as loaded even if there's an error
              });
      }
      
      // Function to update weather icon safely without innerHTML
      function updateWeatherIcon(container, iconUrl, altText) {
          // Clear previous content safely
          while (container.firstChild) {
              container.removeChild(container.firstChild);
          }
          
          // Create new img element
          const img = document.createElement('img');
          img.src = iconUrl;
          img.alt = altText || 'Weather icon';
          
          // Append to container
          container.appendChild(img);
      }
      
      // Display weather data (updated to handle WeatherAPI.com responses)
      function displayWeatherData(data) {
          const weatherLoading = document.getElementById('weather-loading');
          const weatherError = document.getElementById('weather-error');
          const weatherContent = document.getElementById('weather-content');
          
          try {
              // Get weather settings to determine units
              const weatherSettings = JSON.parse(localStorage.getItem('dmx-weather-settings')) || {};
              const units = weatherSettings.units || 'imperial';
              
              // Get current weather information from the response
              const current = data.current;
              const location = data.location;
              
              // Format temperature based on units setting
              let temp, feelsLike, windSpeed, tempUnit, windUnit;
              
              if (units === 'imperial') {
                  temp = Math.round(current.temp_f);
                  feelsLike = Math.round(current.feelslike_f);
                  windSpeed = Math.round(current.wind_mph);
                  tempUnit = '°F';
                  windUnit = 'mph';
              } else {
                  temp = Math.round(current.temp_c);
                  feelsLike = Math.round(current.feelslike_c);
                  windSpeed = Math.round(current.wind_kph);
                  tempUnit = '°C';
                  windUnit = 'km/h';
              }
              
              // Update the UI with weather information
              document.querySelector('.weather-temp').textContent = `${temp}${tempUnit}`;
              document.querySelector('.weather-description').textContent = current.condition.text;
              document.querySelector('.weather-location').textContent = `${location.name}, ${location.country}`;
              document.querySelector('.weather-feels-like').textContent = `Feels like: ${feelsLike}${tempUnit}`;
              document.getElementById('weather-wind').textContent = `${windSpeed} ${windUnit}`;
              document.getElementById('weather-humidity').textContent = `${current.humidity}%`;
              
              // Set weather icon using our safe function instead of innerHTML
              const iconUrl = `https:${current.condition.icon}`;
              const iconElement = document.querySelector('.weather-icon');
              updateWeatherIcon(iconElement, iconUrl, current.condition.text);
              
              // Show content, hide loading and error
              weatherLoading.style.display = 'none';
              weatherError.style.display = 'none';
              weatherContent.style.display = 'block';
          } catch (error) {
              console.error('Error displaying weather data:', error);
              weatherLoading.style.display = 'none';
              weatherContent.style.display = 'none';
              weatherError.style.display = 'block';
              weatherError.textContent = 'Error formatting weather data.';
          }
      }
      
      // RSS Data Function with Stale-While-Revalidate Caching and Periodic Refresh
      let isRssLoading = false; // Flag to prevent concurrent full loads
      let rssRefreshIntervalId = null; // To store the interval ID
      const RSS_REFRESH_INTERVAL = 300000; // 5 minutes in milliseconds

      function loadRssData(isPeriodicRefresh = false) {
          // If called by setInterval and already loading, skip this run
          if (isPeriodicRefresh && isRssLoading) {
              console.log('[RSS] Periodic refresh skipped: Already loading.');
              return;
          }
          isRssLoading = true; // Set loading flag

          const rssLoading = document.getElementById('rss-loading');
          const rssError = document.getElementById('rss-error');
          const rssContent = document.getElementById('rss-content');
          // Change cache duration to 5 minutes
          const cacheDuration = RSS_REFRESH_INTERVAL; // Use the constant
          const feeds = JSON.parse(localStorage.getItem('dmx-rss-feeds')) || [];
          const now = Date.now();

          let allItemsFromCache = [];
          let feedsToFetch = [];
          let initialDisplayDone = false;
          let cacheStatus = {}; // Store cache validity for each feed URL

          // --- Phase 1: Load from Cache & Identify Feeds to Fetch ---
          // Only show loading indicator if not a periodic refresh OR if there's no content displayed yet
          if (!isPeriodicRefresh || rssContent.children.length === 0) {
             rssLoading.style.display = 'block';
          }
          rssError.style.display = 'none';
          // Don't clear rssContent here, wait until we decide if we show cache

          if (feeds.length === 0) {
              rssLoading.style.display = 'none';
              rssContent.innerHTML = '<div id="rss-error" class="error-message" style="display: block;" >No feeds configured. Click the settings button to add feeds.</div>';
              rssDataLoaded = true;
              return;
          }

          feeds.forEach(feed => {
              const cacheKey = `dmx-rss-cache-${feed.url}`;
              let cachedFeedData = null;
              let isCacheValid = false;

              try {
                  const cachedRaw = localStorage.getItem(cacheKey);
                  if (cachedRaw) {
                      cachedFeedData = JSON.parse(cachedRaw);
                      if (now - cachedFeedData.timestamp < cacheDuration) {
                          isCacheValid = true;
                      } else {
                          console.log(`Cache expired for ${feed.name}`);
                          // Don't remove expired cache yet, we might display it
                      }
                      // Add items to cache list regardless of validity for initial display
                      allItemsFromCache = allItemsFromCache.concat(cachedFeedData.items.map(item => ({ ...item, feedName: feed.name })));
                  }
              } catch (e) {
                  console.error(`Error reading cache for ${feed.name}:`, e);
                  localStorage.removeItem(cacheKey); // Remove potentially corrupted cache
              }

              cacheStatus[feed.url] = { isValid: isCacheValid, data: cachedFeedData };

              // Add to fetch list if cache is missing or invalid
              if (!cachedFeedData || !isCacheValid) {
                  feedsToFetch.push(feed);
              }
          });

          // --- Phase 2: Initial Display from Cache (if available) ---
          // Display cached items only if not a periodic refresh OR if nothing is displayed yet
          if (!isPeriodicRefresh || rssContent.children.length === 0) {
              if (allItemsFromCache.length > 0) {
                  console.log("Displaying potentially stale data from cache first.");
                  rssContent.innerHTML = ''; // Clear content now
                  // Sort cached items by date (newest first)
                  allItemsFromCache.sort((a, b) => {
                      const dateA = a.pubDate ? new Date(a.pubDate) : 0;
                      const dateB = b.pubDate ? new Date(b.pubDate) : 0;
                      if (isNaN(dateA) && isNaN(dateB)) return 0;
                      if (isNaN(dateA)) return 1;
                      if (isNaN(dateB)) return -1;
                      return dateB - dateA;
                  });
                  displayRssItems(allItemsFromCache);
                  initialDisplayDone = true;
                  rssLoading.style.display = 'none'; // Hide main loading
                  // Optionally, show a subtle "refreshing" indicator if feedsToFetch.length > 0
              } else {
                  // No cache, keep loading indicator until fetch completes
                  rssContent.innerHTML = ''; // Clear content
              }
          }

          // --- Phase 3: Background Fetching for Invalid/Missing Cache ---
          if (feedsToFetch.length === 0) {
              console.log("All feeds have valid cache. No background fetch needed.");
              rssDataLoaded = true; // Mark as loaded
              // Ensure loading is hidden if we only had cache
              rssLoading.style.display = 'none';
              return; // Nothing more to do
          }

          console.log(`Starting background fetch for ${feedsToFetch.length} feeds.`);
          let newlyFetchedItems = {}; // Store successfully fetched items by URL
          let fetchedCount = 0;
          let failedCount = 0;

          feedsToFetch.forEach(feed => {
              console.log(`Fetching live data for ${feed.name} in background.`);
              // Determine which fetch function to use
              if (feed.url.includes('news.google.com')) {
                  tryGoogleNewsFeed(feed, handleFetchSuccess, handleFetchFailure);
              } else {
                  tryRSS2JSON(feed, handleFetchSuccess, handleFetchFailure);
              }
          });

          // --- Helper Functions for Background Fetch --- 

          function handleFetchSuccess(feed, items) {
              console.log(`Background fetch succeeded for ${feed.name}`);
              saveToCache(feed.url, items); // Update cache with fresh data
              newlyFetchedItems[feed.url] = items.map(item => ({ ...item, feedName: feed.name }));
              fetchedCount++;
              checkBackgroundFetchesComplete();
          }

          function handleFetchFailure(feed, error) {
              console.error(`Background fetch failed for ${feed.name}:`, error);
              failedCount++;
              // Keep the potentially stale cache for this feed if it exists
              checkBackgroundFetchesComplete();
          }

          function checkBackgroundFetchesComplete() {
              if (fetchedCount + failedCount === feedsToFetch.length) {
                  console.log("All background fetches complete.");
                  rssLoading.style.display = 'none'; // Ensure loading is hidden

                  // --- Phase 4: Final Display Update --- 
                  let finalAllItems = [];

                  // Combine fresh data and valid cached data
                  feeds.forEach(feed => {
                      if (newlyFetchedItems[feed.url]) {
                          // Use freshly fetched data
                          finalAllItems = finalAllItems.concat(newlyFetchedItems[feed.url]);
                      } else if (cacheStatus[feed.url]?.isValid && cacheStatus[feed.url]?.data) {
                          // Use valid cached data if fetch wasn't needed or failed
                          finalAllItems = finalAllItems.concat(cacheStatus[feed.url].data.items.map(item => ({ ...item, feedName: feed.name })));
                      } else if (cacheStatus[feed.url]?.data && !cacheStatus[feed.url]?.isValid && !newlyFetchedItems[feed.url]) {
                          // Fallback: Use stale cache if fetch failed and it was the only source
                          finalAllItems = finalAllItems.concat(cacheStatus[feed.url].data.items.map(item => ({ ...item, feedName: feed.name })));
                      }
                  });

                  if (finalAllItems.length > 0) {
                      // Sort final combined list
                      finalAllItems.sort((a, b) => {
                          const dateA = a.pubDate ? new Date(a.pubDate) : 0;
                          const dateB = b.pubDate ? new Date(b.pubDate) : 0;
                          if (isNaN(dateA) && isNaN(dateB)) return 0;
                          if (isNaN(dateA)) return 1;
                          if (isNaN(dateB)) return -1;
                          return dateB - dateA;
                      });
                      // Update the display with the final combined list
                      displayRssItems(finalAllItems);
                  } else if (failedCount === feeds.length) {
                      // All feeds failed (initial cache + background fetch)
                      rssError.textContent = `Failed to load any feeds. Check URLs or try again later.`;
                      rssError.style.display = 'block';
                      rssContent.innerHTML = ''; // Clear any stale cache display
                  } else if (!initialDisplayDone) {
                      // No cache initially, and fetches resulted in no items (or all failed)
                      rssContent.innerHTML = '<div class="empty-message">No articles found in the added feeds.</div>';
                  }
                  // If initialDisplayDone was true and finalAllItems is empty, we just keep the stale cache display

                  rssDataLoaded = true; // Mark as fully loaded/updated
              }
          }

          // --- Modified Fetch Functions to Accept Callbacks --- 

          function saveToCache(feedUrl, items) {
              const cacheKey = `dmx-rss-cache-${feedUrl}`;
              const cacheEntry = {
                  timestamp: Date.now(),
                  items: items
              };
              try {
                  localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
                  console.log(`Cache updated for ${feedUrl}`);
              } catch (e) {
                  console.error(`Error saving cache for ${feedUrl}:`, e);
              }
          }

          // Use a more reliable proxy helper
          function fetchWithProxy(url) {
              // Using allorigins.win as a proxy
              const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
              return fetch(proxyUrl);
          }

          // Modify fetch helpers to accept success/failure callbacks
          function tryGoogleNewsFeed(feed, onSuccess, onFailure) {
              console.log(`Attempting fetch for Google News feed: ${feed.name} via proxy`);
              fetchWithProxy(feed.url) // Use the proxy for Google News
                  .then(response => {
                      if (!response.ok) {
                          throw new Error(`Proxy fetch failed with status: ${response.status}`);
                      }
                      return response.text();
                  })
                  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
                  .then(data => {
                      const items = data.querySelectorAll("item");
                      let feedItems = [];
                      items.forEach(el => {
                          feedItems.push({
                              title: el.querySelector("title")?.textContent || '',
                              link: el.querySelector("link")?.textContent || '',
                              pubDate: el.querySelector("pubDate")?.textContent || '',
                              description: el.querySelector("description")?.textContent || ''
                          });
                      });
                      if (feedItems.length > 0) {
                          onSuccess(feed, feedItems);
                      } else {
                          throw new Error("Proxy fetch for Google News yielded no items.");
                      }
                  })
                  .catch(error => {
                      console.error(`Google News fetch failed for ${feed.name}:`, error);
                      onFailure(feed, error); // Final failure for Google News
                  });
          }

          function tryRSS2JSON(feed, onSuccess, onFailure) {
              const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
              fetch(apiUrl)
                  .then(response => response.json())
                  .then(data => {
                      if (data.status === 'ok') {
                          const feedItems = data.items || [];
                          onSuccess(feed, feedItems);
                      } else {
                          console.warn(`RSS2JSON failed for ${feed.name} (Status: ${data.status}, Message: ${data.message}), trying proxy.`);
                          tryProxyFetch(feed, onSuccess, onFailure); // Fallback to general proxy
                      }
                  })
                  .catch(error => {
                      console.warn(`Error fetching ${feed.name} with RSS2JSON: ${error}, trying proxy.`);
                      tryProxyFetch(feed, onSuccess, onFailure); // Fallback to general proxy
                  });
          }

          // Renamed from tryAlternativeRSSProxy and tryLastResortProxy
          function tryProxyFetch(feed, onSuccess, onFailure) {
              console.log(`Attempting fetch for ${feed.name} via proxy`);
              fetchWithProxy(feed.url) // Use the proxy
                  .then(response => {
                      if (!response.ok) {
                          throw new Error(`Proxy fetch failed with status: ${response.status}`);
                      }
                      return response.text();
                  })
                  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
                  .then(data => {
                      // Check for common RSS/Atom feed structures
                      let items = data.querySelectorAll("item"); // RSS
                      if (items.length === 0) {
                          items = data.querySelectorAll("entry"); // Atom
                      }

                      let feedItems = [];
                      items.forEach(el => {
                          // Adapt parsing for both RSS <item> and Atom <entry>
                          const title = el.querySelector("title")?.textContent || '';
                          // Atom uses <link href="...">, RSS uses <link>...</link>
                          let link = el.querySelector("link")?.textContent || '';
                          if (!link && el.querySelector("link[href]")) {
                              link = el.querySelector("link[href]")?.getAttribute('href') || '';
                          }
                          // Atom uses <updated> or <published>, RSS uses <pubDate>
                          const pubDate = el.querySelector("pubDate")?.textContent || el.querySelector("updated")?.textContent || el.querySelector("published")?.textContent || '';
                          // Atom uses <summary> or <content>, RSS uses <description>
                          const description = el.querySelector("description")?.textContent || el.querySelector("summary")?.textContent || el.querySelector("content")?.textContent || '';

                          feedItems.push({ title, link, pubDate, description });
                      });

                      if (feedItems.length > 0) {
                          onSuccess(feed, feedItems);
                      } else {
                          // Check if the root element suggests it's not XML/RSS/Atom
                          if (!data.documentElement || (data.documentElement.nodeName !== 'rss' && data.documentElement.nodeName !== 'feed')) {
                             throw new Error("Proxy fetch did not return valid XML/RSS/Atom.");
                          } else {
                             // Valid XML structure, but no items found
                             console.warn(`Proxy fetch for ${feed.name} yielded no items, but structure seems valid.`);
                             onSuccess(feed, []); // Report success with empty items
                          }
                      }
                  })
                  .catch(error => {
                      console.error(`Proxy fetch failed for ${feed.name}:`, error);
                      onFailure(feed, error); // Final failure point
                  });
          }
      }

// Ensure displayRssItems is robust and handles being called multiple times
function displayRssItems(items) {
    const rssContent = document.getElementById('rss-content');
    const rssLoading = document.getElementById('rss-loading');
    const rssError = document.getElementById('rss-error');

    rssLoading.style.display = 'none'; // Ensure loading is hidden
    rssError.style.display = 'none';   // Ensure error is hidden initially
    rssContent.innerHTML = ''; // Clear previous content safely

    if (!items || items.length === 0) {
        rssContent.innerHTML = '<div class="empty-message">No articles found.</div>';
        return;
    }

    // No need for the extra articlesContainer div
    // const articlesContainer = document.createElement('div');
    // articlesContainer.className = 'news-articles-container';

    items.forEach(item => {
        // Main element is an anchor tag
        const articleElement = document.createElement('a');
        articleElement.href = item.link || item.url || '#'; // Use item.link or item.url
        articleElement.target = '_blank'; // Open in new tab
        articleElement.rel = 'noopener noreferrer';

        // --- Thumbnail Logic (similar to old code) ---
        let hasThumbnail = false;
        let imageUrl = '';

        if (item.thumbnail && item.thumbnail !== '') {
            imageUrl = item.thumbnail;
            hasThumbnail = true;
        } else if (item.enclosure && item.enclosure.link && item.enclosure.type && item.enclosure.type.startsWith('image')) {
            // Check enclosure type for images
            imageUrl = item.enclosure.link;
            hasThumbnail = true;
        } else if (item.image) { // Some feeds might use 'image'
            imageUrl = item.image;
            hasThumbnail = true;
        } else {
             // Basic check in description/content for an <img> tag as a fallback
             const description = item.description || item.content || '';
             const imgMatch = description.match(/<img[^>]+src="([^">]+)"/i);
             if (imgMatch && imgMatch[1]) {
                 imageUrl = imgMatch[1];
                 // Basic validation to avoid data URIs or relative paths if needed
                 if (imageUrl.startsWith('http')) {
                    hasThumbnail = true;
                 }
             }
        }

        articleElement.className = hasThumbnail ? 'news-article has-thumbnail' : 'news-article no-thumbnail';

        // --- Content Creation --- 
        const contentDiv = document.createElement('div');
        contentDiv.className = 'news-content';
        if (!hasThumbnail) {
            contentDiv.classList.add('full-width');
        }

        const titleDiv = document.createElement('div');
        titleDiv.className = 'news-title';
        titleDiv.textContent = item.title || 'No title';

        const sourceDiv = document.createElement('div');
        sourceDiv.className = 'news-source';
        // Use feedName as the source, as determined during fetch
        sourceDiv.textContent = item.feedName || 'Unknown Source'; 

        const dateDiv = document.createElement('div');
        dateDiv.className = 'news-date';
        if (item.pubDate) {
            try {
                const date = new Date(item.pubDate);
                // Use the more detailed date format from the old code
                dateDiv.textContent = date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (e) {
                dateDiv.textContent = 'Invalid date';
            }
        } else {
            dateDiv.textContent = 'No date';
        }

        // Append title, source, date to contentDiv
        contentDiv.appendChild(titleDiv);
        contentDiv.appendChild(sourceDiv);
        contentDiv.appendChild(dateDiv);

        // --- Assemble Article --- 
        if (hasThumbnail) {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'news-image';
            // Set background image safely
            imageDiv.style.backgroundImage = `url('${imageUrl}')`; 
            articleElement.appendChild(imageDiv);
        }
        
        articleElement.appendChild(contentDiv);

        // Append the complete articleElement directly to rssContent
        rssContent.appendChild(articleElement);
    });

    // rssContent.appendChild(articlesContainer); // No longer needed
}

      // ===== TAB2 - SETTINGS FUNCTIONALITY =====
      // Toggle settings form for Tab2
      tab2SettingsBtn.addEventListener('click', () => {
          console.log('Tab2 settings button clicked'); // Log click
          if (tab2SettingsForm) {
              console.log('Tab2 settings form found. Current classes before toggle:', tab2SettingsForm.className);
              tab2SettingsForm.classList.toggle('active');
              console.log('Tab2 settings form classes after toggle:', tab2SettingsForm.className);
              // Load settings only if opening the form
              if (tab2SettingsForm.classList.contains('active')) {
                  loadTab2Settings();
              }
          } else {
              console.error('Tab2 settings form element (#tab2-settings-form) not found!');
          }
      });
      
      // Close Tab2 settings form
      closeTab2SettingsBtn.addEventListener('click', () => {
          tab2SettingsForm.classList.remove('active');
      });
      
      // Settings tabs functionality
      settingsTabs.forEach(tab => {
          tab.addEventListener('click', () => {
              const tabTarget = tab.dataset.tab;
              
              // Update active tab
              settingsTabs.forEach(t => t.classList.remove('active'));
              tab.classList.add('active');
              
              // Update active panel
              settingsPanels.forEach(panel => {
                  panel.classList.remove('active');
                  if (panel.id === tabTarget) {
                      panel.classList.add('active');
                  }
              });
          });
      });
      
      // Use geolocation button
      useGeolocationBtn.addEventListener('click', () => {
          if (navigator.geolocation) {
              useGeolocationBtn.textContent = 'Locating...';
              navigator.geolocation.getCurrentPosition(position => {
                  const lat = position.coords.latitude;
                  const lon = position.coords.longitude;
                  
                  // Save coordinates to localStorage
                  const weatherSettings = JSON.parse(localStorage.getItem('dmx-weather-settings')) || {};
                  weatherSettings.useGeolocation = true;
                  weatherSettings.lat = lat;
                  weatherSettings.lon = lon;
                  localStorage.setItem('dmx-weather-settings', JSON.stringify(weatherSettings));
                  
                  // Clear city input and update button text
                  weatherCityInput.value = '';
                  useGeolocationBtn.textContent = 'Location Saved';
                  
                  setTimeout(() => {
                      useGeolocationBtn.textContent = 'Use My Location';
                  }, 2000);
              }, error => {
                  console.error('Geolocation error:', error);
                  useGeolocationBtn.textContent = 'Location Error';
                  setTimeout(() => {
                      useGeolocationBtn.textContent = 'Use My Location';
                  }, 2000);
              });
          } else {
              alert('Geolocation is not supported by this browser.');
          }
      });
      
      // Show add feed form
      addFeedBtn.addEventListener('click', () => {
          editingFeedIndex = null;
          feedNameInput.value = '';
          feedUrlInput.value = '';
          addFeedForm.style.display = 'block';
      });
      
      // Cancel add feed
      cancelFeedBtn.addEventListener('click', () => {
          addFeedForm.style.display = 'none';
      });
      
      // Reset loading flags if feeds are edited
      function resetRSSLoadingFlag() {
          rssDataLoaded = false;
      }
      
      // Save new/edited feed
      saveFeedBtn.addEventListener('click', () => {
          const name = feedNameInput.value.trim();
          const url = feedUrlInput.value.trim();
          
          if (!name || !url) {
              alert('Please fill in both name and URL');
              return;
          }
          
          // Validate URL
          try {
              new URL(url);
          } catch (e) {
              alert('Please enter a valid URL');
              return;
          }
          
          // Get existing feeds
          const feeds = JSON.parse(localStorage.getItem('dmx-rss-feeds')) || [];
          
          if (editingFeedIndex !== null) {
              // Edit existing feed
              feeds[editingFeedIndex] = { name, url };
          } else {
              // Add new feed
              feeds.push({ name, url });
          }
          
          // Save to localStorage
          localStorage.setItem('dmx-rss-feeds', JSON.stringify(feeds));
          
          // Reset and hide form
          addFeedForm.style.display = 'none';
          editingFeedIndex = null;
          
          // Reload feeds list
          loadRssFeeds();
          
          // Reset loading flag and reload data
          resetRSSLoadingFlag();
          loadRssData();
      });
      
      // Load RSS feeds list in settings
      function loadRssFeeds() {
          const feeds = JSON.parse(localStorage.getItem('dmx-rss-feeds')) || [];
          rssContainer.innerHTML = ''; // Clear existing content safely

          if (feeds.length === 0) {
              const emptyMessage = document.createElement('div');
              emptyMessage.className = 'empty-message';
              emptyMessage.textContent = 'No feeds added. Click the button below to add your first RSS feed.';
              rssContainer.appendChild(emptyMessage);
              return;
          }

          feeds.forEach((feed, index) => {
              // Create elements safely
              const feedItem = document.createElement('div');
              feedItem.className = 'rss-feed-item';

              const feedInfo = document.createElement('div');
              feedInfo.className = 'feed-info';

              const feedNameDiv = document.createElement('div');
              feedNameDiv.className = 'feed-name';
              feedNameDiv.textContent = feed.name; // Use textContent for safety

              const feedUrlDiv = document.createElement('div');
              feedUrlDiv.className = 'feed-url';
              feedUrlDiv.textContent = feed.url; // Use textContent for safety

              feedInfo.appendChild(feedNameDiv);
              feedInfo.appendChild(feedUrlDiv);

              const feedActions = document.createElement('div');
              feedActions.className = 'feed-actions';

              const editSpan = document.createElement('span');
              editSpan.className = 'feed-action edit';
              editSpan.dataset.index = index; // Use dataset for data attributes
              const editIcon = document.createElement('i');
              editIcon.className = 'fas fa-edit';
              editSpan.appendChild(editIcon);

              const deleteSpan = document.createElement('span');
              deleteSpan.className = 'feed-action delete';
              deleteSpan.dataset.index = index; // Use dataset for data attributes
              const deleteIcon = document.createElement('i');
              deleteIcon.className = 'fas fa-trash';
              deleteSpan.appendChild(deleteIcon);

              feedActions.appendChild(editSpan);
              feedActions.appendChild(deleteSpan);

              feedItem.appendChild(feedInfo);
              feedItem.appendChild(feedActions);

              // Add event listeners for edit and delete actions
              editSpan.addEventListener('click', () => editRssFeed(index));
              deleteSpan.addEventListener('click', () => deleteRssFeed(index));

              rssContainer.appendChild(feedItem);
          });
      }
      
      // Edit RSS feed
      function editRssFeed(index) {
          const feeds = JSON.parse(localStorage.getItem('dmx-rss-feeds')) || [];
          const feed = feeds[index];
          
          if (feed) {
              // Set form values
              feedNameInput.value = feed.name;
              feedUrlInput.value = feed.url;
              
              // Show form and set editing index
              addFeedForm.style.display = 'block';
              editingFeedIndex = index;
          }
      }
      
      // Delete RSS feed
      function deleteRssFeed(index) {
          if (confirm('Are you sure you want to delete this feed?')) {
              const feeds = JSON.parse(localStorage.getItem('dmx-rss-feeds')) || [];
              feeds.splice(index, 1);
              localStorage.setItem('dmx-rss-feeds', JSON.stringify(feeds));
              loadRssFeeds();
              resetRSSLoadingFlag(); // Reset flag to trigger reload
              loadRssData(); // Reload data immediately
          }
      }
      
      // Load Tab2 settings
      function loadTab2Settings() {
          // Load weather settings
          const weatherSettings = JSON.parse(localStorage.getItem('dmx-weather-settings')) || {};
          weatherApiKeyInput.value = weatherSettings.apiKey || '';
          weatherCityInput.value = weatherSettings.city || '';
          
          // Set temperature unit
          const unitRadios = document.querySelectorAll('input[name="temp-units"]');
          unitRadios.forEach(radio => {
              if (radio.value === weatherSettings.units) {
                  radio.checked = true;
              }
          });
          
          // Load RSS feeds
          loadRssFeeds();
      }
      
      // Save Tab2 settings
      saveTab2SettingsBtn.addEventListener('click', () => {
          // Save weather settings
          const weatherSettings = JSON.parse(localStorage.getItem('dmx-weather-settings')) || {};
          weatherSettings.apiKey = weatherApiKeyInput.value.trim();
          weatherSettings.city = weatherCityInput.value.trim();
          
          // If city is provided, disable geolocation
          if (weatherSettings.city) {
              weatherSettings.useGeolocation = false;
          }
          
          // Get selected temperature unit
          const selectedUnit = document.querySelector('input[name="temp-units"]:checked');
          weatherSettings.units = selectedUnit ? selectedUnit.value : 'imperial';
          
          localStorage.setItem('dmx-weather-settings', JSON.stringify(weatherSettings));
          
          // Close settings form
          tab2SettingsForm.classList.remove('active');
          
          // Reset loading flags to force reload after settings change
          weatherDataLoaded = false;
          rssDataLoaded = false;
          
          // Reload weather and RSS data
          loadWeatherData();
          loadRssData();
      });
  
      // Load Tab2 content at initialization
      loadWeatherData();
      loadRssData();
      
      // ===== BACKGROUND CONFIGURATION =====
      // Toggle background settings form
      bgConfigBtn.addEventListener('click', () => {
          console.log('Background config button clicked'); // Log click
          if (backgroundForm) {
              console.log('Background form found. Current classes before toggle:', backgroundForm.className);
              backgroundForm.classList.toggle('active');
              console.log('Background form classes after toggle:', backgroundForm.className);
              
              // Load current settings only if opening the form
              if (backgroundForm.classList.contains('active')) {
                  // Load current background setting
                  const currentBg = localStorage.getItem('dmx-background') || 'img/Wallpaper-1.jpg';
                  
                  // Update UI to show active background
                  bgOptions.forEach(option => {
                      if (option.dataset.bg === currentBg) {
                          option.classList.add('active');
                      } else {
                          option.classList.remove('active');
                      }
                  });
                  
                  // Check if current bg is a custom URL or color
                  if (currentBg.startsWith('http') || currentBg.startsWith('data:')) { // Image URL
                      bgOptions.forEach(option => option.classList.remove('active'));
                      if (customBgUrl) customBgUrl.value = currentBg;
                      if (customBgColorInput) customBgColorInput.value = localStorage.getItem('dmx-overlay-color') || '#1a1b26'; // Load saved overlay color or default
                      if (overlayOpacitySection) overlayOpacitySection.style.display = 'block'; // Show opacity slider
                  } else if (currentBg.startsWith('#')) { // Solid Color
                      bgOptions.forEach(option => option.classList.remove('active'));
                      if (customBgColorInput) customBgColorInput.value = currentBg; // Load the solid background color
                      if (customBgUrl) customBgUrl.value = ''; // Clear URL input
                      if (overlayOpacitySection) overlayOpacitySection.style.display = 'none'; // Hide opacity slider
                  } else { // Preset image
                      if (customBgUrl) customBgUrl.value = '';
                      if (customBgColorInput) customBgColorInput.value = localStorage.getItem('dmx-overlay-color') || '#1a1b26'; // Load saved overlay color or default
                      if (overlayOpacitySection) overlayOpacitySection.style.display = 'block'; // Show opacity slider
                  }
                  
                  // Update blur slider value from localStorage
                  const defaultBlur = 10; 
                  const savedBlur = localStorage.getItem('dmx-blur') || defaultBlur;
                  if (blurSlider) blurSlider.value = savedBlur;
                  if (blurValue) blurValue.textContent = `${savedBlur}px`;
      
                  // Load current overlay opacity
                  const savedOpacity = localStorage.getItem('dmx-overlay-opacity') || '50'; 
                  if (customColorOpacitySlider) customColorOpacitySlider.value = savedOpacity;
                  if (customColorOpacityValue) customColorOpacityValue.textContent = `${savedOpacity}%`;

                  // Load sharp borders state
                  const savedSharpState = localStorage.getItem('dmx-sharp-borders') === 'true';
                  if (sharpBordersToggle) sharpBordersToggle.checked = savedSharpState;

                  // Load disable shadow state
                  const savedShadowState = localStorage.getItem('dmx-disable-shadow') === 'true';
                  if (disableShadowToggle) disableShadowToggle.checked = savedShadowState;

                  // Load window background color and opacity
                  const savedWindowColor = localStorage.getItem('dmx-window-bg-color') || '#16161e'; // Default color
                  const savedWindowOpacity = localStorage.getItem('dmx-window-bg-opacity') || '10'; // Default opacity
                  if (windowBgColorInput) windowBgColorInput.value = savedWindowColor;
                  if (windowBgOpacitySlider) windowBgOpacitySlider.value = savedWindowOpacity;
                  if (windowBgOpacityValue) windowBgOpacityValue.textContent = `${savedWindowOpacity}%`;
              }
          } else {
              console.error('Background form element (#background-form) not found!');
          }
      });
  
      // Close background settings form
      closeBackgroundBtn.addEventListener('click', () => {
          backgroundForm.classList.remove('active');
      });
  
      // Handle clicking on a background option
      bgOptions.forEach(option => {
          option.addEventListener('click', () => {
              const bgPath = option.dataset.bg;
              
              // Remove active class from all options and add to clicked
              bgOptions.forEach(opt => opt.classList.remove('active'));
              option.classList.add('active');
              
              // Apply the background
              applyBackground(bgPath);
              
              // Clear custom URL input
              customBgUrl.value = '';
          });
      });
  
      // Apply custom background from URL
      applyCustomBgBtn.addEventListener('click', () => {
          const url = customBgUrl.value.trim();
          
          if (url) {
              // Basic validation: check if it looks like a URL
              if (url.startsWith('http') || url.startsWith('data:')) {
                  applyBackground(url);
                  // Keep existing overlay settings when applying a URL background
                  if (overlayOpacitySection) overlayOpacitySection.style.display = 'block'; // Ensure slider is visible
              } else {
                  alert('Please enter a valid URL (starting with http, https, or data:)');
              }
          }
      });
      
      // Apply custom background color OR overlay
      if (applyCustomColorBtn) {
          applyCustomColorBtn.addEventListener('click', () => {
              const color = customBgColorInput.value;
              const currentBg = localStorage.getItem('dmx-background') || '';
              
              // Always treat this button as applying overlay color/opacity now
              const opacity = customColorOpacitySlider.value;
              applyColorOverlay(color, opacity);
              if (overlayOpacitySection) overlayOpacitySection.style.display = 'block'; // Ensure slider is visible
  
              // If the current background IS a solid color, applying an overlay effectively changes the background
              // So, update the main background setting as well
              if (currentBg.startsWith('#')) {
                   // We are effectively setting a new solid background via the overlay controls
                   // Apply as solid background, which also clears overlay settings internally
                   applyBackground(color);
              }
          });
      }
  
      // Add event listener for the overlay opacity slider
      if (customColorOpacitySlider) {
          customColorOpacitySlider.addEventListener('input', function() {
              const opacity = this.value;
              if (customColorOpacityValue) customColorOpacityValue.textContent = `${opacity}%`;
              const color = customBgColorInput.value; // Get current color from input
              applyColorOverlay(color, opacity); // Apply change immediately
          });
      }
  
      // Add event listeners for window background controls
      if (windowBgColorInput) {
          windowBgColorInput.addEventListener('input', function() {
              // Color input change doesn't apply immediately, waits for button click
          });
      }
      if (windowBgOpacitySlider) {
          windowBgOpacitySlider.addEventListener('input', function() {
              const opacity = this.value;
              if (windowBgOpacityValue) windowBgOpacityValue.textContent = `${opacity}%`;
              // Apply opacity change immediately, keeping the current color
              const currentColor = localStorage.getItem('dmx-window-bg-color') || '#16161e'; // Use saved color
              applyWindowBackground(currentColor, opacity); // Apply change immediately
              console.log("Applied window opacity:", opacity + "%");
          });
      }
  
      // Add event listener for the new Apply Window Background button
      if (applyWindowBgBtn) {
          applyWindowBgBtn.addEventListener('click', function() {
              const color = windowBgColorInput.value;
              // Apply only the color change, keeping the current opacity
              const currentOpacity = windowBgOpacitySlider.value; // Get current opacity from slider
              applyWindowBackground(color, currentOpacity);
              console.log("Applied window background color:", color);
          });
      }
  
      // Blur slider functionality
      blurSlider.addEventListener('input', function() {
          const value = this.value;
          blurValue.textContent = `${value}px`;
          applyBlur(value);
      });
  
      // Function to apply blur and save to localStorage
      function applyBlur(value) {
          // Use CSS variable for easier application
          document.documentElement.style.setProperty('--window-blur', `${value}px`);
          localStorage.setItem('dmx-blur', value);
      }
  
      // Function to load saved blur setting
      function loadBlur() {
          const savedBlur = localStorage.getItem('dmx-blur');
          // Default blur value in pixels
          const defaultBlur = 10; 
          const blurToApply = savedBlur !== null ? savedBlur : defaultBlur;
          applyBlur(blurToApply);
          // Update slider and value display if elements exist
          if (blurSlider) blurSlider.value = blurToApply;
          if (blurValue) blurValue.textContent = `${blurToApply}px`;
      }
  
      // Function to apply background and save to localStorage
      function applyBackground(value) {
          if (value.startsWith('#')) {
              // It's a solid color background
              document.body.style.backgroundImage = 'none';
              document.body.style.backgroundColor = value;
              // Remove the overlay when setting a solid background color
              if (backgroundOverlay) {
                  backgroundOverlay.style.backgroundColor = 'transparent';
                  backgroundOverlay.style.opacity = '0';
                  backgroundOverlay.style.display = 'none'; // Hide it completely
              }
              // Clear overlay settings from storage
              localStorage.removeItem('dmx-overlay-color');
              localStorage.removeItem('dmx-overlay-opacity');
              // Hide opacity slider in settings if form is open
              if (overlayOpacitySection) overlayOpacitySection.style.display = 'none';
          } else {
              // Assume it's an image URL background
              document.body.style.backgroundColor = ''; // Remove any direct background color
              document.body.style.backgroundImage = `url('${value}')`;
              if (backgroundOverlay) backgroundOverlay.style.display = 'block'; // Ensure overlay div is visible
              // Re-apply existing overlay settings if they exist
              loadColorOverlay(); 
              // Show opacity slider in settings if form is open
              if (overlayOpacitySection) overlayOpacitySection.style.display = 'block';
          }
          
          // Save the main background setting to localStorage
          localStorage.setItem('dmx-background', value);
      }
  
      // Function to apply color overlay
      function applyColorOverlay(color, opacity, save = true) { // Added save flag
          if (backgroundOverlay) {
              const currentBg = localStorage.getItem('dmx-background') || '';
              if (!currentBg.startsWith('#')) { // Only apply overlay if background is not solid color
                  console.warn('Applying overlay. Ensure #background-overlay has CSS for position, size, and z-index (e.g., position:fixed, top:0, left:0, width:100%, height:100%, z-index:-1).'); // Added warning
                  backgroundOverlay.style.backgroundColor = color;
                  backgroundOverlay.style.opacity = opacity / 100; // Convert percentage to decimal
                  backgroundOverlay.style.display = 'block'; // Ensure it's visible
                  if (save) { // Only save if flag is true
                      localStorage.setItem('dmx-overlay-color', color);
                      localStorage.setItem('dmx-overlay-opacity', opacity);
                  }
              } else {
                  // Ensure overlay is hidden if background is solid color
                  backgroundOverlay.style.backgroundColor = 'transparent';
                  backgroundOverlay.style.opacity = '0';
                  backgroundOverlay.style.display = 'none';
                  // Clear overlay settings from storage as background is solid
                  localStorage.removeItem('dmx-overlay-color');
                  localStorage.removeItem('dmx-overlay-opacity');
              }
          } else {
              console.error('#background-overlay element not found in HTML.'); // Added error for missing element
          }
      }
  
      // Function to load saved color overlay setting
      function loadColorOverlay() {
          const savedColor = localStorage.getItem('dmx-overlay-color');
          const savedOpacity = localStorage.getItem('dmx-overlay-opacity');
          // Check if the current background is a solid color before applying overlay
          const currentBg = localStorage.getItem('dmx-background') || '';
  
          if (savedColor && savedOpacity && !currentBg.startsWith('#')) {
              applyColorOverlay(savedColor, savedOpacity);
              // Update controls if they exist and form is potentially open
              if (customBgColorInput) customBgColorInput.value = savedColor;
              if (customColorOpacitySlider) customColorOpacitySlider.value = savedOpacity;
              if (customColorOpacityValue) customColorOpacityValue.textContent = `${savedOpacity}%`;
              if (overlayOpacitySection) overlayOpacitySection.style.display = 'block';
          } else {
              // Ensure overlay is hidden if no settings or if background is solid
              if (backgroundOverlay) {
                  backgroundOverlay.style.backgroundColor = 'transparent';
                  backgroundOverlay.style.opacity = '0';
                  backgroundOverlay.style.display = 'none';
              }
              if (overlayOpacitySection) overlayOpacitySection.style.display = 'none';
              // Optionally reset controls to defaults if needed when overlay is not active
              // if (customBgColorInput) customBgColorInput.value = '#1a1b26';
              // if (customColorOpacitySlider) customColorOpacitySlider.value = 50;
              // if (customColorOpacityValue) customColorOpacityValue.textContent = `50%`;
          }
      }
  
      // Function to load saved background on page load
      function loadBackground() {
          const savedBg = localStorage.getItem('dmx-background') || 'img/Wallpaper-1.jpg'; // Default if none saved
          
          // Apply the main background first (this might clear overlay settings if it's a solid color)
          applyBackground(savedBg); 
          
          // Then, attempt to load/apply the overlay (applyColorOverlay checks if bg is solid)
          // loadColorOverlay is now called within applyBackground when setting an image,
          // and the overlay is cleared when setting a solid color.
          
          // Update the input fields in the settings form if they exist (handled by bgConfigBtn listener now)
      }
      
      // Function to apply sharp borders setting
      function applySharpBordersSetting(enabled) {
          if (enabled) {
              document.body.classList.add('sharp-borders');
          } else {
              document.body.classList.remove('sharp-borders');
          }
          localStorage.setItem('dmx-sharp-borders', enabled);
      }
      
      // Function to load saved sharp borders setting
      function loadSharpBordersSetting() {
          const savedState = localStorage.getItem('dmx-sharp-borders') === 'true';
          if (sharpBordersToggle) {
              sharpBordersToggle.checked = savedState;
          }
          applySharpBordersSetting(savedState);
      }
      
      // Function to apply disable shadow setting
      function applyDisableShadowSetting(enabled) {
          if (enabled) {
              document.body.classList.add('no-shadow');
          } else {
              document.body.classList.remove('no-shadow');
          }
          localStorage.setItem('dmx-disable-shadow', enabled);
      }
  
      // Function to load saved disable shadow setting
      function loadDisableShadowSetting() {
          const savedState = localStorage.getItem('dmx-disable-shadow') === 'true';
          if (disableShadowToggle) {
              disableShadowToggle.checked = savedState;
          }
          applyDisableShadowSetting(savedState);
      }
  
      // Function to apply window background color/opacity
      function applyWindowBackground(color, opacity) {
          // Convert hex color and opacity percentage to RGBA
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          const alpha = opacity / 100;
          const rgbaColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  
          // Use CSS variable for the ::before element's background
          document.documentElement.style.setProperty('--window-bg-before', rgbaColor);
  
          // Save settings - always save both when either changes
          localStorage.setItem('dmx-window-bg-color', color);
          localStorage.setItem('dmx-window-bg-opacity', opacity);
      }
  
      // Function to load saved window background settings
      function loadWindowBackgroundSettings() {
          const savedColor = localStorage.getItem('dmx-window-bg-color') || '#16161e';
          const savedOpacity = localStorage.getItem('dmx-window-bg-opacity') || '10';
  
          applyWindowBackground(savedColor, savedOpacity);
  
          // Update controls if they exist
          if (windowBgColorInput) windowBgColorInput.value = savedColor;
          if (windowBgOpacitySlider) windowBgOpacitySlider.value = savedOpacity;
          if (windowBgOpacityValue) windowBgOpacityValue.textContent = `${savedOpacity}%`;
      }
  
      // Add event listener for sharp borders toggle
      if (sharpBordersToggle) {
          sharpBordersToggle.addEventListener('change', function() {
              applySharpBordersSetting(this.checked);
          });
      }
  
      // Add event listener for disable shadow toggle
      if (disableShadowToggle) {
          disableShadowToggle.addEventListener('change', function() {
              applyDisableShadowSetting(this.checked);
          });
      }
  
      // Mouse position tracker for bottom menu buttons visibility
      document.addEventListener('mousemove', function(e) {
          const windowHeight = window.innerHeight;
          const mouseY = e.clientY;
           
          // Show buttons only when mouse is in the bottom 20% of the viewport
          if (mouseY > windowHeight * 0.8) {
              document.body.classList.add('buttons-visible');
          } else {
              document.body.classList.remove('buttons-visible');
          }
      });
      
      // Also show buttons when any dialog/form is open
      function updateButtonsVisibility() {
          const anyFormOpen = 
              document.querySelector('.shortcut-form.active') || 
              document.querySelector('.category-form.active') || 
              document.querySelector('.settings-form.active') ||
              document.querySelector('#background-form.active') ||
              document.querySelector('#tab2-settings-form.active');
          
          if (anyFormOpen) {
              document.body.classList.add('buttons-visible');
          }
      }
      
      // Add event listener for the reset background settings button
      if (resetBackgroundSettingsBtn) {
          resetBackgroundSettingsBtn.addEventListener('click', function() {
              // Define default values
              const defaultBg = 'img/Wallpaper-1.jpg';
              const defaultWindowColor = '#16161e';
              const defaultWindowOpacity = '10';
              const defaultBlurValue = 10;
              const defaultSharpBorders = false;
              const defaultDisableShadow = false;

              // 1. Reset Background Image/Color
              applyBackground(defaultBg);
              // Update UI for background selector
              bgOptions.forEach(option => {
                  if (option.dataset.bg === defaultBg) {
                      option.classList.add('active');
                  } else {
                      option.classList.remove('active');
                  }
              });
              if (customBgUrl) customBgUrl.value = '';

              // 2. Reset Background Overlay
              applyColorOverlay('transparent', 0, false); // Apply visually without saving
              localStorage.removeItem('dmx-overlay-color');
              localStorage.removeItem('dmx-overlay-opacity');
              // Update UI for overlay controls
              if (customBgColorInput) customBgColorInput.value = '#1a1b26'; // Reset color picker
              if (customColorOpacitySlider) customColorOpacitySlider.value = 0; // Reset slider
              if (customColorOpacityValue) customColorOpacityValue.textContent = `0%`; // Reset value display
              if (overlayOpacitySection) overlayOpacitySection.style.display = 'block'; // Ensure it's visible if bg is image

              // 3. Reset Window Background (::before)
              applyWindowBackground(defaultWindowColor, defaultWindowOpacity);
              // Update UI for window background controls
              if (windowBgColorInput) windowBgColorInput.value = defaultWindowColor;
              if (windowBgOpacitySlider) windowBgOpacitySlider.value = defaultWindowOpacity;
              if (windowBgOpacityValue) windowBgOpacityValue.textContent = `${defaultWindowOpacity}%`;

              // 4. Reset Window Blur
              applyBlur(defaultBlurValue);
              // Update UI for blur slider
              if (blurSlider) blurSlider.value = defaultBlurValue;
              if (blurValue) blurValue.textContent = `${defaultBlurValue}px`;

              // 5. Reset Sharp Borders
              applySharpBordersSetting(defaultSharpBorders);
              // Update UI for sharp borders toggle
              if (sharpBordersToggle) sharpBordersToggle.checked = defaultSharpBorders;

              // 6. Reset Disable Shadow
              applyDisableShadowSetting(defaultDisableShadow);
              // Update UI for disable shadow toggle
              if (disableShadowToggle) disableShadowToggle.checked = defaultDisableShadow;

              console.log("Window styles reset to defaults.");
          });
      }

      // Create a function to apply all background/style settings
      function applyAllBackgroundSettings() {
          loadBackground(); // Applies main background and calls loadColorOverlay
          loadBlur();
          loadSharpBordersSetting();
          loadDisableShadowSetting(); // Added
          loadWindowBackgroundSettings(); // Added
      }

      // Load background, blur, and other style settings on page load
      applyAllBackgroundSettings(); // Use the combined function
      
      // Toggle Tab1 settings form
      if (tab1SettingsBtn) {
          tab1SettingsBtn.addEventListener('click', () => {
              console.log('Tab1 settings button clicked'); // Log click
              if (tab1SettingsForm) {
                  console.log('Tab1 settings form found. Current classes before toggle:', tab1SettingsForm.className);
                  tab1SettingsForm.classList.toggle('active');
                  console.log('Tab1 settings form classes after toggle:', tab1SettingsForm.className);
                  // Load settings only if opening the form
                  if (tab1SettingsForm.classList.contains('active')) {
                      loadTabVisibilitySettings();
                  }
              } else {
                  console.error('Tab1 settings form element (#tab1-settings-form) not found!');
              }
          });
      }
      
      // Close Tab1 settings form
      if (closeTab1SettingsBtn) {
          closeTab1SettingsBtn.addEventListener('click', () => {
              tab1SettingsForm.classList.remove('active');
          });
      }
      
      // Save Tab1 settings
      if (saveTab1SettingsBtn) {
          saveTab1SettingsBtn.addEventListener('click', () => {
              const settings = {
                  showTab2: tab2Toggle.checked,
                  showTab3: tab3Toggle.checked,
                  openInNewTab: newTabToggle.checked
              };
              
              localStorage.setItem('dmx-tab-visibility', JSON.stringify(settings));
              
              // Apply settings
              applyTabVisibilitySettings(settings);
              
              // Reload shortcuts to apply new tab setting
              loadShortcuts();
              
              // Close form
              tab1SettingsForm.classList.remove('active');
          });
      }
      
      // Load tab visibility settings
      function loadTabVisibilitySettings() {
          const savedSettings = JSON.parse(localStorage.getItem('dmx-tab-visibility')) || {
              showTab2: true,
              showTab3: true,
              openInNewTab: false  // Disabled by default
          };
          
          tab2Toggle.checked = savedSettings.showTab2;
          tab3Toggle.checked = savedSettings.showTab3;
          newTabToggle.checked = savedSettings.openInNewTab === true;
      }
  
      // Apply tab visibility settings
      function applyTabVisibilitySettings(settings) {
          // Get tab elements
          const tab2Content = document.getElementById('tab2');
          const tab3Content = document.getElementById('tab3');
          const tab2Icon = document.querySelector('.tab-icon[data-tab="tab2"]');
          const tab3Icon = document.querySelector('.tab-icon[data-tab="tab3"]');
          
          // Apply visibility to tab content
          if (tab2Content) {
              if (settings.showTab2) {
                  tab2Content.classList.remove('tab-hidden');
                  tab2Icon.classList.remove('tab-hidden');
              } else {
                  tab2Content.classList.add('tab-hidden');
                  tab2Icon.classList.add('tab-hidden');
              }
          }
          
          if (tab3Content) {
              if (settings.showTab3) {
                  tab3Content.classList.remove('tab-hidden');
                  tab3Icon.classList.remove('tab-hidden');
              } else {
                  tab3Content.classList.add('tab-hidden');
                  tab3Icon.classList.add('tab-hidden');
              }
          }
          
          // If current tab is hidden, switch to tab1
          const currentTab = tabContents[currentTabIndex];
          if (currentTab.classList.contains('tab-hidden')) {
              switchTab('tab1');
          }
          
          // Update available tabs for wheel scrolling
          updateTabNavigation();
      }
  
      // Function to update tab navigation when visibility changes
      function updateTabNavigation() {
          // This empty function is intentional - it ensures any additional 
          // tab navigation-related updates can be added here in the future
          // without modifying other parts of the code
          
          // The actual logic is now handled by the findNextVisibleTab and 
          // findPrevVisibleTab helper functions
      }
  
      // Initialize tab visibility on page load
      function initTabVisibility() {
          const savedSettings = JSON.parse(localStorage.getItem('dmx-tab-visibility')) || {
              showTab2: true,
              showTab3: true
          };
          
          applyTabVisibilitySettings(savedSettings);
      }
  
      // Add tab visibility initialization
      initTabVisibility();
      
      // Update the add button display condition for Tab1
      if (tabContents[0].classList.contains('active')) { // If Tab1 is active
          addShortcutBtn.style.display = 'flex';
          settingsBtn.style.display = 'none';
          tab2SettingsBtn.style.display = 'none';
          tab1SettingsBtn.style.display = 'flex'; // Show Tab1 settings button
      }
  
      // Update the handleWindowResize function to ensure max 6 shortcuts per row
      function handleWindowResize() {
          const shortcuts = JSON.parse(localStorage.getItem('dmx-shortcuts')) || [];
          const shortcutCount = shortcuts.length;
          const grid = document.getElementById('shortcuts-grid');
          
          // Remove any previous column layout classes
          grid.className = grid.className.replace(/grid-col-\d+/g, '');
          
          // Reset any inline styles first
          grid.style.padding = '';
          grid.style.width = '';
          grid.style.justifyContent = 'center';
          
          // Calculate max-width based on how many items we need to fit per row (max 6)
          const itemWidth = shortcuts.length > 8 ? 150 : 160; // Use smaller width for lots of shortcuts
          const gapWidth = 25;
          
          // Determine how many items we have in each row
          const maxItemsPerRow = 6;
          const firstRowItems = Math.min(shortcutCount, maxItemsPerRow);
          
          // Calculate max width for first row
          const firstRowWidth = (itemWidth * firstRowItems) + (gapWidth * (firstRowItems - 1));
          grid.style.maxWidth = `${firstRowWidth}px`;
          
          // Set max-width for grid based on the first row (which has the standard gap)
          if (shortcutCount > 0) {
              grid.classList.add(`grid-col-${Math.min(shortcutCount, maxItemsPerRow)}`);
          }
          
          // Adjust padding based on number of shortcuts
          if (shortcutCount > 6) {
              grid.style.padding = '2% 15px'; // Less padding when we have multiple rows
          } else {
              grid.style.padding = '5% 15px'; // More padding for single row
          }
          
          // Find and adjust individual rows
          const rows = grid.querySelectorAll('.row');
          if (rows.length > 0) {
              // First row uses the standard gap
              rows[0].style.gap = `${gapWidth}px`;
              
              // Adjust second row if exists
              if (rows.length > 1) {
                  const secondRowGap = 15; // Smaller gap
                  rows[1].style.gap = `${secondRowGap}px`;
                  
                  // Calculate appropriate max-width for second row
                  const secondRowItems = Math.min(shortcutCount - maxItemsPerRow, maxItemsPerRow);
                  if (secondRowItems > 0) {
                      // Second row has a smaller gap
                      const secondRowWidth = (itemWidth * secondRowItems) + (secondRowGap * (secondRowItems - 1));
                      rows[1].style.maxWidth = `${secondRowWidth}px`;
                  }
              }
          }
          
          // Adjust spacing based on screen size
          const screenWidth = window.innerWidth;
          if (screenWidth <= 600) {
              // Very small screens
              rows.forEach((row, index) => {
                  if (index === 0) {
                      row.style.gap = '10px';
                  } else if (index === 1) {
                      row.style.gap = '5px'; // Even smaller for second row
                  }
              });
          } else if (screenWidth <= 900) {
              // Small screens
              rows.forEach((row, index) => {
                  if (index === 0) {
                      row.style.gap = '15px';
                  } else if (index === 1) {
                      row.style.gap = '10px'; // Smaller for second row
                  }
              });
          } else if (screenWidth <= 1200) {
              // Medium screens
              rows.forEach((row, index) => {
                  if (index === 0) {
                      row.style.gap = '20px';
                  } else if (index === 1) {
                      row.style.gap = '12px'; // Smaller for second row
                  }
              });
          } else {
              // Large screens - use default gap settings defined earlier
          }
      }

      // ===== INITIALIZATION =====
      
      // ... existing load functions ...
      loadShortcuts();
      loadNotes();
      loadTodoItems();
      loadTabVisibilitySettings(); // Load tab visibility first
      loadTab2Settings(); // Load settings for Tab2 (needed for weather/rss)
      applyAllBackgroundSettings(); // Load background/style settings
      
      // Initial load for Tab2 data (weather and RSS)
      // These functions now handle their own loading indicators and errors
      loadWeatherData(); 
      loadRssData(); // Initial RSS load

      // Start periodic RSS refresh AFTER initial load
      if (rssRefreshIntervalId) {
          clearInterval(rssRefreshIntervalId); // Clear previous interval if any
      }
      rssRefreshIntervalId = setInterval(() => {
          console.log('[RSS] Triggering periodic refresh...');
          loadRssData(true); // Pass flag indicating it's a periodic refresh
      }, RSS_REFRESH_INTERVAL);


      // Initialize edit mode AFTER shortcuts are loaded
      setTimeout(initEditMode, 100);
      
      handleWindowResize(); // Initialize grid layout
      
      // ... rest of initialization code ...

  }); // End DOMContentLoaded



