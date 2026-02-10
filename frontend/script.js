// Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';

// DOM Elements
const queryInput = document.getElementById('queryInput');
const sendBtn = document.getElementById('sendBtn');
const chatHistory = document.getElementById('chatHistory');
const loadingOverlay = document.getElementById('loadingOverlay');
const serverStatus = document.getElementById('serverStatus');
const exampleButtons = document.querySelectorAll('.example-btn');
const totalQueriesSpan = document.getElementById('totalQueries');

// State
let isProcessing = false;
let queryCount = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkServerHealth();
    setupEventListeners();
    autoResizeTextarea();
});

// Check Server Health
async function checkServerHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (data.success) {
            updateServerStatus(true, 'Server is running');
        } else {
            updateServerStatus(false, 'Server error');
        }
    } catch (error) {
        updateServerStatus(false, 'Server offline - Please start backend server');
    }
}

function updateServerStatus(isOnline, message) {
    const indicator = serverStatus.querySelector('.status-indicator');
    const text = serverStatus.querySelector('.status-text');
    
    indicator.className = `status-indicator ${isOnline ? 'online' : 'offline'}`;
    text.textContent = message;
}

// Event Listeners
function setupEventListeners() {
    // Send button
    sendBtn.addEventListener('click', handleSendMessage);
    
    // Enter key to send
    queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Auto-resize textarea
    queryInput.addEventListener('input', autoResizeTextarea);
    
    // Example questions
    exampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.dataset.query;
            queryInput.value = query;
            handleSendMessage();
        });
    });
}

function autoResizeTextarea() {
    queryInput.style.height = 'auto';
    queryInput.style.height = Math.min(queryInput.scrollHeight, 150) + 'px';
}

// Handle Send Message
async function handleSendMessage() {
    const query = queryInput.value.trim();
    
    // Validation
    if (!query) {
        showError('Please enter a question');
        return;
    }
    
    if (query.length < 3) {
        showError('Question must be at least 3 characters long');
        return;
    }
    
    if (query.length > 500) {
        showError('Question is too long (max 500 characters)');
        return;
    }
    
    if (isProcessing) return;
    
    // Clear input
    queryInput.value = '';
    autoResizeTextarea();
    
    // Remove welcome message if exists
    const welcomeMsg = chatHistory.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    // Add user message
    addMessage('user', query);
    
    // Process query
    await processQuery(query);
}

// Add Message to Chat
function addMessage(type, content, resources = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    
    if (type === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">${escapeHtml(content)}</div>
        `;
    } else {
        let html = `<div class="message-content">${escapeHtml(content)}</div>`;
        
        if (resources && resources.length > 0) {
            html += `
                <div class="resources">
                    <div class="resources-title">📚 Learning Resources</div>
                    ${resources.map(resource => `
                        <div class="resource-card">
                            <h4>${escapeHtml(resource.title)}</h4>
                            <p>${escapeHtml(resource.description)}</p>
                            <div class="resource-meta">
                                <span class="type-badge ${resource.type}">${resource.type.toUpperCase()}</span>
                                <a href="${resource.url}" class="download-btn" target="_blank" rel="noopener">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <polyline points="7 10 12 15 17 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <line x1="12" y1="15" x2="12" y2="3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    Download
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        messageDiv.innerHTML = html;
    }
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Process Query
async function processQuery(query) {
    isProcessing = true;
    sendBtn.disabled = true;
    loadingOverlay.classList.add('active');
    
    try {
        const response = await fetch(`${API_BASE_URL}/ask-jiji`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Add assistant response
            addMessage('assistant', data.data.answer, data.data.resources);
            
            // Update query count
            queryCount++;
            totalQueriesSpan.textContent = queryCount;
        } else {
            throw new Error(data.error?.message || 'Something went wrong');
        }
        
    } catch (error) {
        console.error('Error:', error);
        addMessage('assistant', `❌ Error: ${error.message}\n\nPlease make sure the backend server is running on http://localhost:3000`);
    } finally {
        isProcessing = false;
        sendBtn.disabled = false;
        loadingOverlay.classList.remove('active');
    }
}

// Show Error
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    chatHistory.appendChild(errorDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-check server status every 30 seconds
setInterval(checkServerHealth, 30000);
