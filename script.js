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
          'dmx-weather-units' // Added key for weather units
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
      const resetBlurBtn = document.getElementById('reset-blur');
      const sharpBordersToggle = document.getElementById('sharp-borders-toggle'); // Added
      const customBgColorInput = document.getElementById('custom-bg-color'); // Added
      const applyCustomColorBtn = document.getElementById('apply-custom-color'); // Added
      const backgroundOverlay = document.getElementById('background-overlay'); // Added for color overlay
      const customColorOpacitySlider = document.getElementById('custom-color-opacity-slider'); // Added
      const customColorOpacityValue = document.getElementById('custom-color-opacity-value'); // Added
      const overlayOpacitySection = document.querySelector('.overlay-opacity-section'); // Added to show/hide slider
      
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
          
          // Try to get the website's favicon
          const favicon = getFaviconUrl(shortcut.url);
          if (favicon) {
              const img = document.createElement('img');
              img.src = favicon;
              img.alt = shortcut.name;
              img.onerror = function() {
                  // If the favicon fails to load, fall back to the default icon
                  this.parentNode.innerHTML = '<i class="fas fa-globe"></i>';
              };
              iconElement.appendChild(img);
          } else {
              iconElement.innerHTML = '<i class="fas fa-globe"></i>';
          }
          
          const nameElement = document.createElement('div');
          nameElement.className = 'shortcut-name';
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
      
      // Helper function to get favicon URL for a website
      function getFaviconUrl(url) {
          const domain = extractDomain(url);
          if (!domain) return null;
          
          // Use Google's favicon service for higher quality icons
          return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
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
          
          const settings = {
              shortcuts: shortcuts,
              notes: notes,
              todos: todos,
              weatherSettings: weatherSettings,
              rssFeeds: rssFeeds
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
                  const settings = JSON.parse(e.target.result);
                  
                  // Import shortcuts
                  if (settings.shortcuts) {
                      localStorage.setItem('dmx-shortcuts', JSON.stringify(settings.shortcuts));
                  }
                  
                  // Import notes
                  if (settings.notes) {
                      localStorage.setItem('dmx-notes', settings.notes);
                  }
                  
                  // Import todos
                  if (settings.todos) {
                      localStorage.setItem('dmx-todos', JSON.stringify(settings.todos));
                  }
                  
                  // Import weather settings (including units)
                  if (settings.weatherSettings) {
                      localStorage.setItem('dmx-weather-settings', JSON.stringify(settings.weatherSettings));
                      if (settings.weatherSettings.units) {
                          localStorage.setItem('dmx-weather-units', settings.weatherSettings.units);
                      }
                  }
                  
                  // Import RSS feeds
                  if (settings.rssFeeds) {
                      localStorage.setItem('dmx-rss-feeds', JSON.stringify(settings.rssFeeds));
                  }
                  
                  // Import background settings (optional, might be in older exports)
                  if (settings.background) localStorage.setItem('dmx-background', settings.background);
                  if (settings.blur) localStorage.setItem('dmx-blur', settings.blur);
                  if (settings.sharpBorders) localStorage.setItem('dmx-sharp-borders', settings.sharpBorders);
                  if (settings.overlayColor) localStorage.setItem('dmx-overlay-color', settings.overlayColor);
                  if (settings.overlayOpacity) localStorage.setItem('dmx-overlay-opacity', settings.overlayOpacity);
                  
                  // Import tab visibility settings (optional)
                  if (settings.tabVisibility) localStorage.setItem('dmx-tab-visibility', JSON.stringify(settings.tabVisibility));
                  
                  // Load saved data
                  loadShortcuts();
                  loadNotes();
                  loadTodoItems();
                  applyBackgroundSettings(); // Apply imported background/blur/overlay/borders
                  applyTabVisibility(); // Apply imported tab visibility
                  
                  // Reload weather and RSS data if we're on Tab2
                  if (currentTabIndex === 1) {
                      loadWeatherData();
                      loadRssFeeds();
                  }
                  
                  showImportNotification('Settings imported successfully!', 'success');
              } catch (error) {
                  showImportNotification('Error importing settings: ' + error.message, 'error');
              }
          };
          reader.readAsText(file);
      });
      
      // Function to show import notification
      function showImportNotification(message, type) {
          importNotification.textContent = message;
          importNotification.className = 'import-notification ' + type;
          
          // Auto hide after 5 seconds
          setTimeout(() => {
              importNotification.className = 'import-notification';
          }, 5000);
      }
      
      // Add reset configuration functionality
      const resetConfigBtn = document.getElementById('reset-config-btn');
      if (resetConfigBtn) {
          resetConfigBtn.addEventListener('click', () => {
              // Show a confirmation dialog
              if (confirm('Are you sure you want to reset all configuration? This will delete all shortcuts, notes, todos, and settings. This action cannot be undone.')) {
                  
                  // Remove each key from localStorage using the consolidated list
                  APP_LOCAL_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
                  
                  // Show success message
                  showImportNotification('All settings have been reset. Reloading...', 'success');
                  
                  // Reload the page after a short delay
                  setTimeout(() => {
                      window.location.reload();
                  }, 1500);
              }
          });
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
              
              // Set weather icon directly from WeatherAPI.com
              const iconUrl = `https:${current.condition.icon}`;
              const iconElement = document.querySelector('.weather-icon');
              iconElement.innerHTML = `<img src="${iconUrl}" alt="${current.condition.text}">`;
              
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
      
      // RSS Data Function with improved Google News handling
      function loadRssData() {
          const rssLoading = document.getElementById('rss-loading');
          const rssError = document.getElementById('rss-error');
          const rssContent = document.getElementById('rss-content');
          
          // Reset display states
          rssLoading.style.display = 'block';
          rssError.style.display = 'none';
          rssContent.innerHTML = ''; // Clear previous content
          
          // Get feeds from settings
          const feeds = JSON.parse(localStorage.getItem('dmx-rss-feeds')) || [];
          
          if (feeds.length === 0) {
              rssLoading.style.display = 'none';
              rssError.style.display = 'block';
              rssError.textContent = 'No feeds configured. Click the settings button to add feeds.';
              rssDataLoaded = true; // Mark as loaded even with no feeds
              return;
          }
          
          let allItems = [];
          let loadedFeeds = 0;
          let failedFeeds = 0;
  
          // Process all feeds
          feeds.forEach(feed => {
              // Check if it's a Google News feed
              if (feed.url.includes('news.google.com')) {
                  tryGoogleNewsFeed(feed);
              } else {
                  // For all other feeds, use RSS2JSON
                  tryRSS2JSON(feed);
              }
          });
  
          // Helper function to handle Google News feeds specifically
          function tryGoogleNewsFeed(feed) {
              console.log(`Fetching Google News feed: ${feed.name}`);
              
              // Use a more powerful proxy specifically designed for Google News feeds
              const googleNewsProxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(feed.url);
              
              fetch(googleNewsProxyUrl)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error(`AllOrigins proxy returned status: ${response.status} for ${feed.name}`);
                      }
                      return response.text(); // Google News feeds are XML, so we get the raw text
                  })
                  .then(xmlText => {
                      // Parse the XML manually
                      const parser = new DOMParser();
                      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
                      
                      // Extract items from the XML
                      const items = xmlDoc.querySelectorAll('item');
                      
                      if (items.length > 0) {
                          const parsedItems = Array.from(items).map(item => {
                              // Extract essential RSS elements
                              const title = item.querySelector('title')?.textContent || 'No Title';
                              const link = item.querySelector('link')?.textContent || '#';
                              const pubDate = item.querySelector('pubDate')?.textContent || new Date().toUTCString();
                              const description = item.querySelector('description')?.textContent || '';
                              
                              // Create item object in the format our display function expects
                              return {
                                  title: title,
                                  link: link,
                                  pubDate: pubDate,
                                  description: description,
                                  source: feed.name,
                                  thumbnail: '' // Don't add a thumbnail for Google News feeds
                              };
                          });
                          
                          // Add items to our collection
                          allItems = [...allItems, ...parsedItems];
                      } else {
                          throw new Error(`No items found in ${feed.name} feed`);
                      }
                  })
                  .catch(error => {
                      console.error(`Error fetching Google News feed ${feed.name}:`, error);
                      
                      // As a last resort, try a different proxy
                      tryLastResortProxy(feed);
                      
                      failedFeeds++;
                  })
                  .finally(() => {
                      loadedFeeds++;
                      checkAllFeedsProcessed();
                  });
          }
          
          // Last resort proxy for difficult feeds
          function tryLastResortProxy(feed) {
              console.log(`Trying last resort proxy for: ${feed.name}`);
              
              // Jsonp.io is another proxy service with different capabilities
              const lastResortUrl = `https://jsonp.io/?url=${encodeURIComponent(feed.url)}`;
              
              fetch(lastResortUrl)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error(`Last resort proxy returned status: ${response.status}`);
                      }
                      return response.json();
                  })
                  .then(data => {
                      // Try to extract content from the jsonp.io response
                      if (data && data.contents) {
                          // Parse the XML from the contents
                          const parser = new DOMParser();
                          const xmlDoc = parser.parseFromString(data.contents, "text/xml");
                          
                          // Extract items from the XML
                          const items = xmlDoc.querySelectorAll('item');
                          
                          if (items.length > 0) {
                              const parsedItems = Array.from(items).map(item => {
                                  // Extract essential RSS elements
                                  const title = item.querySelector('title')?.textContent || 'No Title';
                                  const link = item.querySelector('link')?.textContent || '#';
                                  const pubDate = item.querySelector('pubDate')?.textContent || new Date().toUTCString();
                                  
                                  return {
                                      title: title,
                                      link: link,
                                      pubDate: pubDate,
                                      source: feed.name,
                                      thumbnail: '' // Don't add a thumbnail for last resort feeds
                                  };
                              });
                              
                              allItems = [...allItems, ...parsedItems];
                          }
                      }
                  })
                  .catch(error => {
                      console.error(`Last resort proxy also failed for ${feed.name}:`, error);
                      // We've already counted this as a failed feed, so no need to increment
                  });
          }
  
          // Helper function for regular RSS feeds using RSS2JSON
          function tryRSS2JSON(feed) {
              console.log(`Fetching regular feed: ${feed.name} via RSS2JSON`);
              
              // Use the RSS2JSON API for regular feeds
              const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=qbqvspwa1xgeozhgdiwu7rch5zvlmxdhgjcjboei`;
              
              fetch(apiUrl)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error(`Feed API returned status: ${response.status} for ${feed.name}`);
                      }
                      return response.json();
                  })
                  .then(data => {
                      if (data.status === 'ok' && data.items) {
                          // Add source name to each item
                          const itemsWithSource = data.items.map(item => ({
                              ...item,
                              source: feed.name
                          }));
                          
                          // Add items to our collection
                          allItems = [...allItems, ...itemsWithSource];
                      } else {
                          // Handle API error response
                          throw new Error(data.message || `Failed to parse feed: ${feed.name}`);
                      }
                  })
                  .catch(error => {
                      console.error(`Error fetching feed ${feed.name} with RSS2JSON:`, error);
                      
                      // If RSS2JSON fails, try the alternative approach
                      tryAlternativeRSSProxy(feed);
                      
                      failedFeeds++;
                  })
                  .finally(() => {
                      loadedFeeds++;
                      checkAllFeedsProcessed();
                  });
          }
          
          // Alternative proxy method as backup for regular feeds
          function tryAlternativeRSSProxy(feed) {
              console.log(`Trying alternative proxy for regular feed: ${feed.name}`);
              
              // Use allorigins as a backup
              const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}&callback=?`;
              
              fetch(proxyUrl)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error(`Alternative proxy returned status: ${response.status}`);
                      }
                      return response.json();
                  })
                  .then(data => {
                      if (data && data.contents) {
                          try {
                              // Try to parse as JSON first (some feeds return JSON)
                              const jsonData = JSON.parse(data.contents);
                              
                              if (jsonData.items || jsonData.entries) {
                                  const items = jsonData.items || jsonData.entries;
                                  const processedItems = items.map(item => ({
                                      title: item.title || 'No Title',
                                      link: item.link || item.url || '#',
                                      pubDate: item.pubDate || item.published || new Date().toUTCString(),
                                      description: item.description || item.content || item.summary || '',
                                      source: feed.name,
                                      thumbnail: '' // Don't add a thumbnail for alternative proxy feeds
                                  }));
                                  
                                  allItems = [...allItems, ...processedItems];
                                  return;
                              }
                          } catch (e) {
                              // Not JSON, try to parse as XML
                              const parser = new DOMParser();
                              const xmlDoc = parser.parseFromString(data.contents, "text/xml");
                              
                              // Try to detect feed type (RSS or Atom)
                              const isAtom = xmlDoc.querySelector('feed') !== null;
                              
                              if (isAtom) {
                                  // Parse Atom feed
                                  const entries = xmlDoc.querySelectorAll('entry');
                                  if (entries.length > 0) {
                                      const parsedItems = Array.from(entries).map(entry => {
                                          const title = entry.querySelector('title')?.textContent || 'No Title';
                                          const link = entry.querySelector('link[rel="alternate"]')?.getAttribute('href') || 
                                                     entry.querySelector('link')?.getAttribute('href') || '#';
                                          const pubDate = entry.querySelector('updated')?.textContent || 
                                                        entry.querySelector('published')?.textContent || 
                                                        new Date().toUTCString();
                                          
                                          return {
                                              title: title,
                                              link: link,
                                              pubDate: pubDate,
                                              source: feed.name,
                                              thumbnail: '' // Don't add a thumbnail for Atom feeds
                                          };
                                      });
                                      
                                      allItems = [...allItems, ...parsedItems];
                                  }
                              } else {
                                  // Parse RSS feed
                                  const items = xmlDoc.querySelectorAll('item');
                                  if (items.length > 0) {
                                      const parsedItems = Array.from(items).map(item => {
                                          const title = item.querySelector('title')?.textContent || 'No Title';
                                          const link = item.querySelector('link')?.textContent || '#';
                                          const pubDate = item.querySelector('pubDate')?.textContent || new Date().toUTCString();
                                          
                                          return {
                                              title: title,
                                              link: link,
                                              pubDate: pubDate,
                                              source: feed.name,
                                              thumbnail: '' // Don't add a thumbnail for RSS feeds
                                          };
                                      });
                                      
                                      allItems = [...allItems, ...parsedItems];
                                  }
                              }
                          }
                      }
                  })
                  .catch(error => {
                      console.error(`Error with alternative proxy for ${feed.name}:`, error);
                      // Don't increment failedFeeds here as the primary method already counted it
                  });
          }
          
          // Helper function to check if all feeds have been processed
          function checkAllFeedsProcessed() {
              if (loadedFeeds === feeds.length) {
                  rssLoading.style.display = 'none'; // Hide loading indicator
                  
                  if (allItems.length > 0) {
                      // Sort items by date (newest first)
                      allItems.sort((a, b) => {
                          // Add error handling for invalid dates
                          const dateA = new Date(a.pubDate || 0);
                          const dateB = new Date(b.pubDate || 0);
                          return dateB - dateA;
                      });
                      
                      // Display the combined items
                      displayRssItems(allItems);
                      rssDataLoaded = true; // Mark RSS as loaded when successful
                  } else {
                      // No items were successfully loaded
                      rssError.style.display = 'block';
                      if (failedFeeds === feeds.length) {
                          rssError.textContent = 'Failed to load all feeds. Check URLs or network connection.';
                      } else {
                          rssError.textContent = 'No articles found in the successfully loaded feeds.';
                      }
                      rssDataLoaded = true; // Mark as loaded even if there's an error
                  }
              }
          }
      }
  
      // Display feed items in the UI
      function displayRssItems(items) {
          const rssLoading = document.getElementById('rss-loading');
          const rssError = document.getElementById('rss-error');
          const rssContent = document.getElementById('rss-content');
          
          try {
              // Check if we have items to display
              if (items && items.length > 0) {
                  // Clear previous content
                  rssContent.innerHTML = '';
                  
                  // Create and append feed article elements
                  items.forEach(item => {
                      const articleElement = document.createElement('a');
                      
                      // Look for images in various possible locations depending on feed format
                      let hasThumbnail = false;
                      let imageUrl = '';
                      
                      // Check for thumbnail in various possible locations
                      if (item.thumbnail && item.thumbnail !== '') {
                          imageUrl = item.thumbnail;
                          hasThumbnail = true;
                      } else if (item.enclosure && item.enclosure.link) {
                          imageUrl = item.enclosure.link;
                          hasThumbnail = true;
                      } else if (item.image) {
                          imageUrl = item.image;
                          hasThumbnail = true;
                      }
                      
                      // Add appropriate class based on thumbnail availability
                      articleElement.className = hasThumbnail ? 'news-article has-thumbnail' : 'news-article no-thumbnail';
                      articleElement.href = item.link || item.url || '#';
                      articleElement.target = '_blank';
                      articleElement.rel = 'noopener noreferrer';
                      
                      // Format date - handle both ISO and other formats
                      let formattedDate = '';
                      try {
                          const publishDate = new Date(item.pubDate || item.published || item.date || Date.now());
                          formattedDate = publishDate.toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                          });
                      } catch (e) {
                          formattedDate = 'Unknown date';
                      }
                      
                      // Create article HTML with conditional layout - completely different structures
                      if (hasThumbnail) {
                          // Standard layout with thumbnail
                          articleElement.innerHTML = `
                              <div class="news-image" style="background-image: url('${imageUrl}')"></div>
                              <div class="news-content">
                                  <div class="news-title">${item.title}</div>
                                  <div class="news-source">${item.source}</div>
                                  <div class="news-date">${formattedDate}</div>
                              </div>
                          `;
                      } else {
                          // Text-only layout without image or favicon area
                          articleElement.innerHTML = `
                              <div class="news-content full-width">
                                  <div class="news-title">${item.title}</div>
                                  <div class="news-source">${item.source}</div>
                                  <div class="news-date">${formattedDate}</div>
                              </div>
                          `;
                      }
                      
                      rssContent.appendChild(articleElement);
                  });
                  
                  // Show content, hide loading and error
                  rssLoading.style.display = 'none';
                  rssError.style.display = 'none';
                  rssContent.style.display = 'block';
              } else {
                  throw new Error('No articles found');
              }
          } catch (error) {
              console.error('Error displaying feed data:', error);
              rssLoading.style.display = 'none';
              rssContent.style.display = 'none';
              rssError.style.display = 'block';
              rssError.textContent = 'Error displaying feeds.';
          }
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
          rssContainer.innerHTML = '';
          
          if (feeds.length === 0) {
              const emptyMessage = document.createElement('div');
              emptyMessage.className = 'empty-message';
              emptyMessage.textContent = 'No feeds added. Click the button below to add your first RSS feed.';
              rssContainer.appendChild(emptyMessage);
              return;
          }
          
          feeds.forEach((feed, index) => {
              const feedItem = document.createElement('div');
              feedItem.className = 'rss-feed-item';
              feedItem.innerHTML = `
                  <div class="feed-info">
                      <div class="feed-name">${feed.name}</div>
                      <div class="feed-url">${feed.url}</div>
                  </div>
                  <div class="feed-actions">
                      <span class="feed-action edit" data-index="${index}">
                          <i class="fas fa-edit"></i>
                      </span>
                      <span class="feed-action delete" data-index="${index}">
                          <i class="fas fa-trash"></i>
                      </span>
                  </div>
              `;
              
              // Add event listeners for edit and delete actions
              feedItem.querySelector('.edit').addEventListener('click', () => editRssFeed(index));
              feedItem.querySelector('.delete').addEventListener('click', () => deleteRssFeed(index));
              
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
              
              if (currentBg.startsWith('#') || (!currentBg.startsWith('http') && !currentBg.startsWith('data:') && !currentBg.includes('/'))) {
                  // If current background is already a color OR seems like a preset (no URL/data), apply as solid color
                  applyBackground(color);
                  if (overlayOpacitySection) overlayOpacitySection.style.display = 'none'; // Hide slider
              } else {
                  // Otherwise, apply as overlay
                  const opacity = customColorOpacitySlider.value;
                  applyColorOverlay(color, opacity);
                  if (overlayOpacitySection) overlayOpacitySection.style.display = 'block'; // Ensure slider is visible
              }
              // Optionally clear the URL input when applying a color/overlay explicitly
              // if (customBgUrl) customBgUrl.value = ''; 
          });
      }

      // Add event listener for the opacity slider
      if (customColorOpacitySlider) {
          customColorOpacitySlider.addEventListener('input', function() {
              const opacity = this.value;
              if (customColorOpacityValue) customColorOpacityValue.textContent = `${opacity}%`;
              const color = customBgColorInput.value; // Get current color from input
              // Only apply if the background is not a solid color
              const currentBg = localStorage.getItem('dmx-background') || '';
              if (!currentBg.startsWith('#')) {
                  applyColorOverlay(color, opacity); // Apply change immediately
              }
          });
      }
  
      // Blur slider functionality
      blurSlider.addEventListener('input', function() {
          const value = this.value;
          blurValue.textContent = `${value}px`;
          applyBlur(value);
      });
  
      // Reset blur to default
      resetBlurBtn.addEventListener('click', function() {
          blurSlider.value = defaultBlur;
          blurValue.textContent = `${defaultBlur}px`;
          applyBlur(defaultBlur);
      });
  
      // Function to apply blur and save to localStorage
      function applyBlur(value) {
          // Get the ::before pseudo-element and apply the blur
          const style = document.createElement('style');
          style.textContent = `.main-window::before { backdrop-filter: blur(${value}px); }`;
          
          // Remove any existing style with ID 'custom-blur' if it exists
          const existingStyle = document.getElementById('custom-blur');
          if (existingStyle) {
              existingStyle.remove();
          }
          
          // Add ID to the new style element and append it to the document head
          style.id = 'custom-blur';
          document.head.appendChild(style);
          
          // Save to localStorage
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
      function applyColorOverlay(color, opacity) {
          if (backgroundOverlay) {
              // Check if the current background is a solid color
              const currentBg = localStorage.getItem('dmx-background') || '';
              if (!currentBg.startsWith('#')) { // Only apply overlay if background is not solid color
                  console.warn('Applying overlay. Ensure #background-overlay has CSS for position, size, and z-index (e.g., position:fixed, top:0, left:0, width:100%, height:100%, z-index:-1).'); // Added warning
                  backgroundOverlay.style.backgroundColor = color;
                  backgroundOverlay.style.opacity = opacity / 100; // Convert percentage to decimal
                  backgroundOverlay.style.display = 'block'; // Ensure it's visible
                  // Save overlay settings
                  localStorage.setItem('dmx-overlay-color', color);
                  localStorage.setItem('dmx-overlay-opacity', opacity);
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
      
      // Add event listener for sharp borders toggle
      if (sharpBordersToggle) {
          sharpBordersToggle.addEventListener('change', function() {
              applySharpBordersSetting(this.checked);
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
      

      

      
      // Load background, blur, and sharp borders settings on page load
      loadBackground();
      loadBlur();
      loadSharpBordersSetting(); // Added
      
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
  });


