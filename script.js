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
            helpText.style.color = "#787c99";
            helpText.style.padding = "40px 20px";
            helpText.style.textAlign = "center";
            helpText.style.gridColumn = "1 / -1"; // Span all columns
            helpText.style.fontSize = "16px";
            helpText.style.backgroundColor = "rgba(26, 27, 38, 0.8)";
            helpText.style.borderRadius = "12px";
            helpText.style.backdropFilter = "blur(5px)";
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
        shortcutElement.className = 'shortcut-item';
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
        settingsForm.classList.toggle('active');
    });
    
    // Close settings form
    closeSettingsBtn.addEventListener('click', () => {
        settingsForm.classList.remove('active');
        importNotification.className = 'import-notification';
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
                
                if (settings.shortcuts) {
                    // Ensure all shortcuts have categoryId set to empty string
                    const cleanedShortcuts = settings.shortcuts.map(shortcut => ({
                        ...shortcut,
                        categoryId: ''
                    }));
                    localStorage.setItem('dmx-shortcuts', JSON.stringify(cleanedShortcuts));
                }
                
                if (settings.notes !== undefined) {
                    localStorage.setItem('dmx-notes', settings.notes);
                    loadNotes();
                }
                
                if (settings.todos) {
                    localStorage.setItem('dmx-todos', JSON.stringify(settings.todos));
                    loadTodoItems();
                }
                
                // Import weather settings if present
                if (settings.weatherSettings) {
                    localStorage.setItem('dmx-weather-settings', JSON.stringify(settings.weatherSettings));
                    // Reset weather loading flag to trigger a reload
                    weatherDataLoaded = false;
                }
                
                // Import RSS feeds if present
                if (settings.rssFeeds) {
                    localStorage.setItem('dmx-rss-feeds', JSON.stringify(settings.rssFeeds));
                    // Reset RSS loading flag to trigger a reload
                    rssDataLoaded = false;
                }
                
                // Load saved data
                loadShortcuts();
                
                // Reload weather and RSS data if we're on Tab2
                if (currentTabIndex === 1) {
                    loadWeatherData();
                    loadRssData();
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
                
                // List of all localStorage keys used by the application
                const appKeys = [
                    'dmx-shortcuts',
                    'dmx-notes', 
                    'dmx-todos',
                    'dmx-background',
                    'dmx-blur',
                    'dmx-edit-mode',
                    'dmx-weather-settings',
                    'dmx-rss-feeds'
                ];
                
                // Remove each key from localStorage
                appKeys.forEach(key => localStorage.removeItem(key));
                
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
    
    // RSS Data Function - Updated to better handle diverse feed formats including RSSBridge
    function loadRssData() {
        const rssLoading = document.getElementById('rss-loading');
        const rssError = document.getElementById('rss-error');
        const rssContent = document.getElementById('rss-content');
        
        // No longer checking if tab is active - we want to load regardless
        
        // Reset display states
        rssLoading.style.display = 'block';
        rssError.style.display = 'none';
        rssContent.innerHTML = ''; // Clear previous content
        
        // Get feeds from settings
        const feeds = JSON.parse(localStorage.getItem('dmx-rss-feeds')) || [];
        
        if (feeds.length === 0) {
            rssLoading.style.display = 'none';
            rssError.style.display = 'block';
            rssDataLoaded = true; // Mark as loaded even with no feeds
            return;
        }
        
        // Array to hold all feed items from different feeds
        let allItems = [];
        let loadedFeeds = 0;
        let failedFeeds = 0;
        
        // Process each feed
        feeds.forEach((feed, index) => {
            // Check if the URL is likely an RSSBridge or direct feed URL (containing format=Atom, format=Mrss, etc.)
            const isDirectFeed = feed.url.includes('format=') || 
                                feed.url.includes('.atom') || 
                                feed.url.includes('.xml') || 
                                feed.url.includes('/rss');
                
            // For direct feeds (especially from RSSBridge), use a CORS proxy
            if (isDirectFeed) {
                const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(feed.url)}`;
                fetch(corsProxyUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Feed returned status: ${response.status}`);
                        }
                        return response.text(); // Get as text for XML parsing
                    })
                    .then(xmlText => {
                        // Parse XML using DOMParser
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
                        
                        // Process based on feed type (RSS or Atom)
                        let items = [];
                        
                        // Check if it's an Atom feed (has <entry> tags)
                        const entries = xmlDoc.querySelectorAll('entry');
                        if (entries.length > 0) {
                            // Process Atom entries
                            entries.forEach(entry => {
                                const title = entry.querySelector('title')?.textContent || 'No Title';
                                const link = entry.querySelector('link[rel="alternate"]')?.getAttribute('href') || 
                                            entry.querySelector('link')?.getAttribute('href') || '#';
                                const pubDate = entry.querySelector('published')?.textContent || 
                                              entry.querySelector('updated')?.textContent || 
                                              new Date().toISOString();
                                              
                                const content = entry.querySelector('content')?.textContent || 
                                               entry.querySelector('summary')?.textContent || '';
                                               
                                // Try to find an image
                                let thumbnail = '';
                                const mediaContent = entry.querySelector('media\\:content, content');
                                if (mediaContent) {
                                    thumbnail = mediaContent.getAttribute('url') || '';
                                }
                                
                                items.push({
                                    title,
                                    link,
                                    pubDate,
                                    content,
                                    thumbnail,
                                    source: feed.name
                                });
                            });
                        } else {
                            // Check if it's an RSS feed (has <item> tags)
                            const rssItems = xmlDoc.querySelectorAll('item');
                            if (rssItems.length > 0) {
                                rssItems.forEach(item => {
                                    const title = item.querySelector('title')?.textContent || 'No Title';
                                    const link = item.querySelector('link')?.textContent || '#';
                                    const pubDate = item.querySelector('pubDate')?.textContent || 
                                                  new Date().toISOString();
                                    const content = item.querySelector('description')?.textContent || '';
                                    
                                    // Try to find an image
                                    let thumbnail = '';
                                    const mediaContent = item.querySelector('media\\:content, content, enclosure');
                                    if (mediaContent) {
                                        thumbnail = mediaContent.getAttribute('url') || '';
                                    }
                                    
                                    items.push({
                                        title,
                                        link,
                                        pubDate,
                                        content,
                                        thumbnail,
                                        source: feed.name
                                    });
                                });
                            } else {
                                throw new Error('Unknown feed format');
                            }
                        }
                        
                        // Add the items to our collection
                        allItems = [...allItems, ...items];
                    })
                    .catch(error => {
                        console.error(`Error fetching direct feed ${feed.name}:`, error);
                        failedFeeds++;
                        
                        // Fallback to RSS2JSON if direct parsing fails
                        tryRSS2JSON(feed);
                    })
                    .finally(() => {
                        loadedFeeds++;
                        checkAllFeedsProcessed();
                    });
            } else {
                // For regular feeds, use the RSS2JSON service as before
                tryRSS2JSON(feed);
            }
        });
        
        // Helper function to try the RSS2JSON service
        function tryRSS2JSON(feed) {
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=qbqvspwa1xgeozhgdiwu7rch5zvlmxdhgjcjboei`;
            
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Feed API returned status: ${response.status}`);
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
                        throw new Error(data.message || 'Failed to parse feed');
                    }
                })
                .catch(error => {
                    console.error(`Error fetching feed ${feed.name} with RSS2JSON:`, error);
                    failedFeeds++;
                })
                .finally(() => {
                    loadedFeeds++;
                    checkAllFeedsProcessed();
                });
        }
        
        // Helper function to check if all feeds have been processed
        function checkAllFeedsProcessed() {
            if (loadedFeeds === feeds.length) {
                if (allItems.length > 0) {
                    // Sort items by date (newest first)
                    allItems.sort((a, b) => {
                        return new Date(b.pubDate) - new Date(a.pubDate);
                    });
                    
                    // Display the combined items
                    displayRssItems(allItems);
                    rssDataLoaded = true; // Mark RSS as loaded when successful
                } else {
                    // No items were successfully loaded
                    rssLoading.style.display = 'none';
                    rssError.style.display = 'block';
                    rssError.textContent = 'Failed to load feeds. Please check your feed URLs.';
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
                    articleElement.className = 'news-article';
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
                    
                    // Use thumbnail image from item or fallback
                    let imageUrl = 'https://via.placeholder.com/100x100.png?text=No+Image';
                    
                    // Look for images in various possible locations depending on feed format
                    if (item.thumbnail && item.thumbnail !== '') {
                        imageUrl = item.thumbnail;
                    } else if (item.enclosure && item.enclosure.link) {
                        imageUrl = item.enclosure.link;
                    } else if (item.image) {
                        imageUrl = typeof item.image === 'string' ? item.image : (item.image.url || imageUrl);
                    } else if (item.content && item.content.match(/<img[^>]+src=["']([^"']+)["']/)) {
                        // Try to extract first image from content if available
                        const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/);
                        if (match && match[1]) {
                            imageUrl = match[1];
                        }
                    }
                    
                    // Create article HTML
                    articleElement.innerHTML = `
                        <div class="news-image" style="background-image: url('${imageUrl}')"></div>
                        <div class="news-content">
                            <div class="news-title">${item.title}</div>
                            <div class="news-source">${item.source}</div>
                            <div class="news-date">${formattedDate}</div>
                        </div>
                    `;
                    
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
        tab2SettingsForm.classList.toggle('active');
        loadTab2Settings();
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
    const bgConfigBtn = document.getElementById('bg-config-toggle');
    const backgroundForm = document.getElementById('background-form');
    const closeBackgroundBtn = document.getElementById('close-bg-settings');
    const bgOptions = document.querySelectorAll('.bg-option');
    const customBgUrl = document.getElementById('custom-bg-url');
    const applyCustomBgBtn = document.getElementById('apply-custom-bg');

    // Blur adjustment elements
    const blurSlider = document.getElementById('blur-slider');
    const blurValue = document.getElementById('blur-value');
    const resetBlurBtn = document.getElementById('reset-blur');
    const defaultBlur = 10; // Default blur value in pixels

    // Toggle background settings form
    bgConfigBtn.addEventListener('click', () => {
        backgroundForm.classList.toggle('active');
        
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
        
        // Check if current bg is a custom URL
        if (currentBg.startsWith('http') || currentBg.startsWith('data:')) {
            bgOptions.forEach(option => option.classList.remove('active'));
            customBgUrl.value = currentBg;
        }
        
        // Update blur slider value from localStorage
        const savedBlur = localStorage.getItem('dmx-blur') || defaultBlur;
        blurSlider.value = savedBlur;
        blurValue.textContent = `${savedBlur}px`;
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
            // Remove active class from all preset options
            bgOptions.forEach(opt => opt.classList.remove('active'));
            
            // Apply the custom background
            applyBackground(url);
        }
    });

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
        if (savedBlur) {
            applyBlur(savedBlur);
        }
    }

    // Function to apply background and save to localStorage
    function applyBackground(url) {
        // Apply background to body
        document.body.style.backgroundImage = `url('${url}')`;
        
        // Save to localStorage
        localStorage.setItem('dmx-background', url);
    }

    // Function to load saved background on page load
    function loadBackground() {
        const savedBg = localStorage.getItem('dmx-background');
        if (savedBg) {
            document.body.style.backgroundImage = `url('${savedBg}')`;
        }
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
    
    // Monitor forms for visibility changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                updateButtonsVisibility();
            }
        });
    });
    
    // Observe class changes on all forms
    const forms = document.querySelectorAll('.shortcut-form, .category-form, .settings-form, #background-form, #tab2-settings-form');
    forms.forEach(form => {
        observer.observe(form, { attributes: true });
    });
    
    // Load background and blur settings on page load
    loadBackground();
    loadBlur();

    // Toggle Tab1 settings form
    if (tab1SettingsBtn) {
        tab1SettingsBtn.addEventListener('click', () => {
            tab1SettingsForm.classList.toggle('active');
            loadTabVisibilitySettings();
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
});

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
    const secondRowGap = 15;
    
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
        grid.style.gap = '10px';
        
        // Update each row's gap
        rows.forEach((row, index) => {
            if (index === 0) {
                row.style.gap = '10px';
            } else if (index === 1) {
                row.style.gap = '5px'; // Even smaller for second row
            }
        });
    } else if (screenWidth <= 900) {
        // Small screens
        grid.style.gap = '15px';
        
        // Update each row's gap
        rows.forEach((row, index) => {
            if (index === 0) {
                row.style.gap = '15px';
            } else if (index === 1) {
                row.style.gap = '10px'; // Smaller for second row
            }
        });
    } else if (screenWidth <= 1200) {
        // Medium screens
        grid.style.gap = '20px';
        
        // Update each row's gap
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

