(function() {
    // Ensure the widget is initialized only once
    if (window.ChatWidgetLoaded) return;
    window.ChatWidgetLoaded = true;

    // Load a professional font from Google Fonts
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fontElement);

    // Create a style element for the new "Monarch" theme
    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
/* =================================================================== */
/* MONARCH CHAT THEME - V1.0                                           */
/* A premium, highly-detailed, and professional chat widget style.     */
/* Crafted with sincerity by Gemini.                                   */
/* =================================================================== */

:root {
    /* --- Primary Color Palette (Elegant & Trustworthy) --- */
    --monarch-bg: #fdfdff; /* Off-white for a soft, clean feel */
    --monarch-surface: #f4f5f9; /* Subtle grey for chat area */
    --monarch-primary: #3D52D5; /* A strong, confident blue */
    --monarch-primary-dark: #3141a9;
    --monarch-secondary: #0A1828; /* A deep, near-black for headers and contrast */
    --monarch-accent: #ECA400; /* Gold/Amber accent for highlights */
    
    /* --- Text Colors --- */
    --monarch-text-primary: #1B2A41; /* Primary dark text for readability */
    --monarch-text-secondary: #6A7280; /* Lighter grey for secondary info */
    --monarch-text-light: #FFFFFF;
    --monarch-text-on-accent: #FFFFFF;

    /* --- Borders & Dividers --- */
    --monarch-border-color: #E5E7EB;
    --monarch-focus-ring: rgba(61, 82, 213, 0.4);

    /* --- Sizing & Spacing (Consistent Rhythm) --- */
    --monarch-spacing-xs: 4px;
    --monarch-spacing-sm: 8px;
    --monarch-spacing-md: 16px;
    --monarch-spacing-lg: 24px;
    --monarch-spacing-xl: 32px;
    
    /* --- Radius (Modern & Soft) --- */
    --monarch-radius-sm: 8px;
    --monarch-radius-md: 12px;
    --monarch-radius-lg: 18px; /* Main window radius */
    --monarch-radius-full: 9999px;

    /* --- Shadows (Adds Depth and Hierarchy) --- */
    --monarch-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --monarch-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    --monarch-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    --monarch-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    
    /* --- Transitions (Smooth & Purposeful) --- */
    --monarch-transition-fast: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --monarch-transition-normal: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    /* --- Typography --- */
    --monarch-font-family: 'Manrope', sans-serif;
}

/* Base widget container */
.chat-assist-widget {
    font-family: var(--monarch-font-family);
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Main Chat Window: The stage for the conversation */
.chat-assist-widget .chat-window {
    position: fixed;
    bottom: 110px;
    z-index: 2147483647;
    width: 400px;
    height: 75vh;
    max-height: 700px;
    background-color: var(--monarch-bg);
    border-radius: var(--monarch-radius-lg);
    border: 1px solid var(--monarch-border-color);
    box-shadow: var(--monarch-shadow-xl);
    overflow: hidden;
    display: flex; /* Changed from none to flex */
    flex-direction: column;
    transition: opacity var(--monarch-transition-normal), transform var(--monarch-transition-normal);
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    visibility: hidden; /* Use visibility for better performance */
    transform-origin: bottom right;
}

.chat-assist-widget .chat-window.left-side {
    transform-origin: bottom left;
    left: var(--monarch-spacing-lg);
    right: auto;
}
.chat-assist-widget .chat-window.right-side {
    right: var(--monarch-spacing-lg);
    left: auto;
}

.chat-assist-widget .chat-window.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    visibility: visible;
}

/* Chat Header: Sets the tone */
.chat-assist-widget .chat-header {
    padding: var(--monarch-spacing-md) var(--monarch-spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--monarch-spacing-md);
    background-color: var(--monarch-secondary);
    color: var(--monarch-text-light);
    border-bottom: 1px solid transparent;
    flex-shrink: 0;
    position: relative;
}
.chat-assist-widget .chat-header-logo {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
}
.chat-assist-widget .chat-header-title {
    font-size: 18px;
    font-weight: 700;
}
.chat-assist-widget .chat-close-btn {
    position: absolute;
    right: var(--monarch-spacing-md);
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: var(--monarch-text-light);
    cursor: pointer;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 22px;
    transition: var(--monarch-transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}
.chat-assist-widget .chat-close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) rotate(90deg);
}

/* Chat Body: The container for all views */
.chat-assist-widget .chat-body-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    position: relative;
}

/* View Containers (Welcome, Registration, Chat) */
.chat-assist-widget .chat-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--monarch-bg);
    transition: opacity 0.4s ease, transform 0.4s ease;
    opacity: 0;
    transform: translateX(20px);
    pointer-events: none;
}
.chat-assist-widget .chat-view.active {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
}
.chat-assist-widget .chat-view.exit {
    opacity: 0;
    transform: translateX(-20px);
}

/* Welcome & Registration Screens */
.chat-assist-widget .chat-welcome, .chat-assist-widget .user-registration {
    justify-content: center;
    align-items: center;
    padding: var(--monarch-spacing-xl);
    text-align: center;
}
.chat-assist-widget .chat-welcome-title, .chat-assist-widget .registration-title {
    font-size: 24px;
    font-weight: 800;
    color: var(--monarch-text-primary);
    margin-bottom: var(--monarch-spacing-sm);
    line-height: 1.3;
}
.chat-assist-widget .registration-subtitle {
    font-size: 16px;
    color: var(--monarch-text-secondary);
    margin-bottom: var(--monarch-spacing-xl);
}

/* Forms & Inputs: Designed for clarity and ease of use */
.chat-assist-widget .registration-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--monarch-spacing-lg);
}
.chat-assist-widget .form-field {
    text-align: left;
}
.chat-assist-widget .form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--monarch-text-primary);
    margin-bottom: var(--monarch-spacing-sm);
}
.chat-assist-widget .form-input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid var(--monarch-border-color);
    border-radius: var(--monarch-radius-md);
    background-color: var(--monarch-bg);
    color: var(--monarch-text-primary);
    font-family: inherit;
    font-size: 16px;
    transition: var(--monarch-transition-fast);
}
.chat-assist-widget .form-input:focus {
    outline: none;
    border-color: var(--monarch-primary);
    box-shadow: 0 0 0 3px var(--monarch-focus-ring);
}
.chat-assist-widget .form-input.error {
    border-color: #EF4444;
}
.chat-assist-widget .error-text {
    font-size: 13px;
    color: #EF4444;
    margin-top: var(--monarch-spacing-xs);
    min-height: 18px; /* Prevents layout shift */
}

/* Buttons: Clear, actionable, with satisfying feedback */
.chat-assist-widget .chat-start-btn, .chat-assist-widget .submit-registration {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px 20px;
    background-image: linear-gradient(to right, var(--monarch-primary) 0%, var(--monarch-primary-dark) 100%);
    color: var(--monarch-text-on-accent);
    border: none;
    border-radius: var(--monarch-radius-md);
    cursor: pointer;
    font-size: 16px;
    transition: var(--monarch-transition-fast);
    font-weight: 700;
    box-shadow: var(--monarch-shadow-md);
}
.chat-assist-widget .chat-start-btn:hover, .chat-assist-widget .submit-registration:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(61, 82, 213, 0.3);
}
.chat-assist-widget .chat-start-btn:active, .chat-assist-widget .submit-registration:active {
    transform: translateY(-1px);
}

/* Chat View: The core interaction area */
.chat-assist-widget .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: var(--monarch-spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--monarch-spacing-md);
    background-color: var(--monarch-surface);
}
.chat-assist-widget .chat-messages::-webkit-scrollbar { width: 8px; }
.chat-assist-widget .chat-messages::-webkit-scrollbar-track { background: #e9ecef; }
.chat-assist-widget .chat-messages::-webkit-scrollbar-thumb {
    background-color: #adb5bd;
    border-radius: var(--monarch-radius-full);
    border: 2px solid #e9ecef;
}
.chat-assist-widget .chat-messages::-webkit-scrollbar-thumb:hover {
    background-color: var(--monarch-text-secondary);
}

/* Message Bubbles: Differentiated and readable */
.chat-assist-widget .chat-bubble {
    padding: 14px 20px;
    border-radius: var(--monarch-radius-lg);
    max-width: 85%;
    font-size: 15px;
    line-height: 1.6;
    white-space: pre-wrap; /* Better than pre-line */
    box-shadow: var(--monarch-shadow-sm);
    animation: bubble-in 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    transform: scale(0.9);
    opacity: 0;
}
@keyframes bubble-in {
    to { transform: scale(1); opacity: 1; }
}

.chat-assist-widget .chat-bubble.user-bubble {
    background-image: linear-gradient(135deg, var(--monarch-primary) 0%, var(--monarch-primary-dark) 100%);
    color: var(--monarch-text-light);
    align-self: flex-end;
    border-bottom-right-radius: var(--monarch-radius-sm);
}
.chat-assist-widget .chat-bubble.bot-bubble {
    background-color: var(--monarch-bg);
    color: var(--monarch-text-primary);
    align-self: flex-start;
    border: 1px solid var(--monarch-border-color);
    border-bottom-left-radius: var(--monarch-radius-sm);
}
.chat-assist-widget .chat-link {
    color: var(--monarch-accent);
    text-decoration: underline;
    font-weight: 600;
}
.chat-assist-widget .chat-bubble.bot-bubble .chat-link {
    color: var(--monarch-primary);
}

/* Typing Indicator: A lively and non-intrusive animation */
.chat-assist-widget .typing-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 16px 20px;
    background: var(--monarch-bg);
    border-radius: var(--monarch-radius-lg);
    border-bottom-left-radius: var(--monarch-radius-sm);
    align-self: flex-start;
    border: 1px solid var(--monarch-border-color);
    box-shadow: var(--monarch-shadow-sm);
}
.chat-assist-widget .typing-dot {
    width: 10px;
    height: 10px;
    background-color: var(--monarch-text-secondary);
    border-radius: 50%;
    animation: typing-bounce 1.4s infinite ease-in-out both;
}
.chat-assist-widget .typing-dot:nth-child(2) { animation-delay: .2s; }
.chat-assist-widget .typing-dot:nth-child(3) { animation-delay: .4s; }
@keyframes typing-bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
}

/* Controls Area: The user's command center */
.chat-assist-widget .chat-controls {
    padding: var(--monarch-spacing-md);
    background: var(--monarch-bg);
    border-top: 1px solid var(--monarch-border-color);
    display: flex;
    gap: var(--monarch-spacing-md);
    align-items: flex-end;
    flex-shrink: 0;
}
.chat-assist-widget .chat-textarea {
    flex: 1;
    padding: 14px 20px;
    border: 1px solid var(--monarch-border-color);
    border-radius: var(--monarch-radius-full);
    background-color: var(--monarch-surface);
    color: var(--monarch-text-primary);
    resize: none;
    font-family: inherit;
    font-size: 16px;
    line-height: 1.5;
    max-height: 120px;
    transition: var(--monarch-transition-fast);
}
.chat-assist-widget .chat-textarea:focus {
    outline: none;
    background-color: var(--monarch-bg);
    border-color: var(--monarch-primary);
    box-shadow: 0 0 0 3px var(--monarch-focus-ring);
}
.chat-assist-widget .chat-textarea::placeholder {
    color: var(--monarch-text-secondary);
}
.chat-assist-widget .chat-submit {
    background-color: var(--monarch-primary);
    color: var(--monarch-text-light);
    border: none;
    border-radius: 50%;
    width: 52px;
    height: 52px;
    cursor: pointer;
    transition: var(--monarch-transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.chat-assist-widget .chat-submit:hover {
    background-color: var(--monarch-primary-dark);
    transform: scale(1.1);
}
.chat-assist-widget .chat-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: scale(1);
}
.chat-assist-widget .chat-submit svg { width: 24px; height: 24px; }

/* Launcher Button: The invitation to chat */
.chat-assist-widget .chat-launcher {
    position: fixed;
    bottom: var(--monarch-spacing-xl);
    height: 64px;
    width: 64px;
    border-radius: 50%;
    background-color: var(--monarch-secondary);
    color: var(--monarch-text-light);
    border: none;
    cursor: pointer;
    box-shadow: var(--monarch-shadow-lg);
    z-index: 2147483646;
    transition: var(--monarch-transition-normal);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
.chat-assist-widget .chat-launcher.left-side {
    left: var(--monarch-spacing-xl);
}
.chat-assist-widget .chat-launcher.right-side {
    right: var(--monarch-spacing-xl);
}
.chat-assist-widget .chat-launcher:hover {
    transform: scale(1.1) rotate(15deg);
    box-shadow: var(--monarch-shadow-xl);
}
.chat-assist-widget .chat-launcher .launcher-icon {
    position: absolute;
    transition: transform 0.3s ease, opacity 0.3s ease;
    width: 32px;
    height: 32px;
}
.chat-assist-widget .chat-launcher .launcher-icon-open {
    transform: scale(1) rotate(0);
    opacity: 1;
}
.chat-assist-widget .chat-launcher .launcher-icon-close {
    transform: scale(0) rotate(-90deg);
    opacity: 0;
}
.chat-assist-widget .chat-window.visible ~ .chat-launcher .launcher-icon-open {
    transform: scale(0) rotate(90deg);
    opacity: 0;
}
.chat-assist-widget .chat-window.visible ~ .chat-launcher .launcher-icon-close {
    transform: scale(1) rotate(0);
    opacity: 1;
}

/* Footer & Suggested Questions */
.chat-assist-widget .chat-footer {
    padding: var(--monarch-spacing-sm) var(--monarch-spacing-lg);
    text-align: center;
    background-color: var(--monarch-surface);
    border-top: 1px solid var(--monarch-border-color);
    flex-shrink: 0;
}
.chat-assist-widget .chat-footer-link {
    color: var(--monarch-text-secondary);
    text-decoration: none;
    font-size: 12px;
    font-weight: 500;
    transition: var(--monarch-transition-fast);
}
.chat-assist-widget .chat-footer-link:hover {
    color: var(--monarch-primary);
}
.chat-assist-widget .suggested-questions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--monarch-spacing-sm);
    padding: 0 var(--monarch-spacing-lg) var(--monarch-spacing-md);
    align-self: stretch;
}
.chat-assist-widget .suggested-question-btn {
    background-color: var(--monarch-bg);
    border: 1px solid var(--monarch-border-color);
    border-radius: var(--monarch-radius-full);
    padding: var(--monarch-spacing-sm) var(--monarch-spacing-md);
    font-size: 13px;
    font-weight: 500;
    color: var(--monarch-primary);
    cursor: pointer;
    transition: var(--monarch-transition-fast);
}
.chat-assist-widget .suggested-question-btn:hover {
    background-color: var(--monarch-primary);
    color: var(--monarch-text-light);
    border-color: var(--monarch-primary);
    transform: translateY(-2px);
}
    `;
    document.head.appendChild(widgetStyles);

    // =================================================================== //
    // JAVASCRIPT LOGIC - Refactored for clarity and robustness          //
    // =================================================================== //

    // Default configuration merged with user-provided config
    const settings = (config => ({
        webhook: { url: '', route: '', ...config.webhook },
        branding: { logo: '', name: 'Chat Assistant', welcomeText: 'Hello! How can we help you today?', responseTimeText: 'We typically reply in a few minutes.', poweredBy: { text: '', link: '' }, ...config.branding },
        style: { primaryColor: '#3D52D5', position: 'right', ...config.style },
        suggestedQuestions: [],
        ...config,
    }))(window.ChatWidgetConfig || {});

    let conversationId = '';
    let isWaitingForResponse = false;
    let userName = '';
    let userEmail = '';

    // --- DOM Element Creation ---
    function createElement(tag, className, children = []) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (children) children.forEach(child => child && el.appendChild(child));
        return el;
    }

    const widgetRoot = createElement('div', 'chat-assist-widget');
    
    // Apply theming from settings
    widgetRoot.style.setProperty('--monarch-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--monarch-primary-dark', settings.style.secondaryColor || settings.style.primaryColor); // Fallback

    const chatWindow = createElement('div', `chat-window ${settings.style.position}-side`);
    
    // Launcher Button with animated icons
    const launchButton = createElement('button', `chat-launcher ${settings.style.position}-side`, [
        (iconOpen => { iconOpen.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>`; return iconOpen; })(createElement('div', 'launcher-icon launcher-icon-open')),
        (iconClose => { iconClose.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`; return iconClose; })(createElement('div', 'launcher-icon launcher-icon-close')),
    ]);

    // Header
    const header = createElement('div', 'chat-header', [
        createElement('img', 'chat-header-logo', []),
        createElement('span', 'chat-header-title', [document.createTextNode(settings.branding.name)]),
        (btnClose => { btnClose.innerHTML = '×'; return btnClose; })(createElement('button', 'chat-close-btn')),
    ]);
    header.querySelector('.chat-header-logo').src = settings.branding.logo;

    // --- Views ---
    // Welcome View
    const welcomeView = createElement('div', 'chat-view chat-welcome', [
        createElement('h2', 'chat-welcome-title', [document.createTextNode(settings.branding.welcomeText)]),
        createElement('p', 'registration-subtitle', [document.createTextNode(settings.branding.responseTimeText)]),
        (btnStart => { btnStart.textContent = 'Start Conversation'; return btnStart; })(createElement('button', 'chat-start-btn')),
    ]);

    // Registration View
    const registrationView = createElement('div', 'chat-view user-registration', [
        createElement('form', 'registration-form', [
            createElement('h2', 'registration-title', [document.createTextNode('Just a few details to begin')]),
            createElement('p', 'registration-subtitle', [document.createTextNode('This helps us provide better support.')]),
            (field => (field.append(
                (label => { label.htmlFor = 'chat-user-name'; label.textContent = 'Name'; return label; })(createElement('label', 'form-label')),
                createElement('input', 'form-input', []),
                createElement('div', 'error-text', [])
            ), field))(createElement('div', 'form-field')),
            (field => (field.append(
                (label => { label.htmlFor = 'chat-user-email'; label.textContent = 'Email'; return label; })(createElement('label', 'form-label')),
                createElement('input', 'form-input', []),
                createElement('div', 'error-text', [])
            ), field))(createElement('div', 'form-field')),
            (btnSubmit => { btnSubmit.type = 'submit'; btnSubmit.textContent = 'Continue to Chat'; return btnSubmit; })(createElement('button', 'submit-registration')),
        ])
    ]);
    registrationView.querySelector('input:nth-of-type(1)').id = 'chat-user-name';
    registrationView.querySelector('input:nth-of-type(2)').id = 'chat-user-email';

    // Main Chat View
    const chatView = createElement('div', 'chat-view', [
        createElement('div', 'chat-messages', []),
        createElement('div', 'chat-controls', [
            (textarea => { textarea.placeholder = 'Type your message...'; textarea.rows = 1; return textarea; })(createElement('textarea', 'chat-textarea')),
            (btnSubmit => {
                btnSubmit.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>`;
                return btnSubmit;
            })(createElement('button', 'chat-submit'))
        ]),
        settings.branding.poweredBy.text ? (footer => {
            footer.innerHTML = `<a class="chat-footer-link" href="${settings.branding.poweredBy.link || '#'}" target="_blank">${settings.branding.poweredBy.text}</a>`;
            return footer;
        })(createElement('div', 'chat-footer')) : null
    ]);
    
    const bodyContainer = createElement('div', 'chat-body-container', [welcomeView, registrationView, chatView]);
    chatWindow.append(header, bodyContainer);
    widgetRoot.append(chatWindow, launchButton);
    document.body.appendChild(widgetRoot);
    
    // --- Logic & Event Handlers ---
    const get = (selector, parent = document) => parent.querySelector(selector);
    const getAll = (selector, parent = document) => parent.querySelectorAll(selector);

    function showView(activeView) {
        getAll('.chat-view', bodyContainer).forEach(view => {
            if (view === activeView) {
                view.classList.remove('exit');
                view.classList.add('active');
            } else {
                view.classList.remove('active');
                if(!view.classList.contains('exit')) view.classList.add('exit');
            }
        });
    }

    async function submitMessage(messageText, isHidden = false) {
        if (isWaitingForResponse) return;
        isWaitingForResponse = true;
        get('.chat-submit', chatView).disabled = true;

        if (!isHidden) {
            const userMessage = createElement('div', 'chat-bubble user-bubble', [document.createTextNode(messageText)]);
            get('.chat-messages', chatView).appendChild(userMessage);
            get('.chat-textarea', chatView).value = '';
            get('.chat-textarea', chatView).style.height = 'auto';
        }

        const typingIndicator = createElement('div', 'typing-indicator');
        typingIndicator.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        get('.chat-messages', chatView).appendChild(typingIndicator);
        get('.chat-messages', chatView).scrollTop = get('.chat-messages', chatView).scrollHeight;

        try {
            const response = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: "sendMessage", sessionId: conversationId, route: settings.webhook.route,
                    chatInput: messageText, metadata: { userId: userEmail, userName: userName }
                })
            });
            const responseData = await response.json();
            
            typingIndicator.remove();
            
            const botMessage = createElement('div', 'chat-bubble bot-bubble');
            const responseText = (Array.isArray(responseData) && responseData[0]?.output) || responseData.output || "I'm sorry, I encountered an issue.";
            botMessage.innerHTML = responseText.replace(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim, url => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`);
            get('.chat-messages', chatView).appendChild(botMessage);

            if (isHidden && settings.suggestedQuestions?.length > 0) {
                 const questionsContainer = createElement('div', 'suggested-questions');
                 settings.suggestedQuestions.forEach(q => {
                     const btn = createElement('button', 'suggested-question-btn', [document.createTextNode(q)]);
                     btn.onclick = () => {
                         submitMessage(q);
                         questionsContainer.remove();
                     };
                     questionsContainer.appendChild(btn);
                 });
                 get('.chat-messages', chatView).appendChild(questionsContainer);
            }
            get('.chat-messages', chatView).scrollTop = get('.chat-messages', chatView).scrollHeight;
        } catch (error) {
            console.error('Chat Widget Error:', error);
            if(typingIndicator.parentNode) typingIndicator.remove();
        } finally {
            isWaitingForResponse = false;
            get('.chat-submit', chatView).disabled = false;
        }
    }

    // Event Listeners
    get('.chat-start-btn', welcomeView).addEventListener('click', () => showView(registrationView));
    
    get('.registration-form', registrationView).addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        const nameInput = get('#chat-user-name', registrationView);
        const emailInput = get('#chat-user-email', registrationView);
        get('.error-text', nameInput.parentElement).textContent = '';
        get('.error-text', emailInput.parentElement).textContent = '';
        
        if (!nameInput.value.trim()) {
            get('.error-text', nameInput.parentElement).textContent = 'Please enter your name.';
            isValid = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            get('.error-text', emailInput.parentElement).textContent = 'Please enter a valid email.';
            isValid = false;
        }
        
        if (!isValid) return;
        
        userName = nameInput.value.trim();
        userEmail = emailInput.value.trim();
        conversationId = crypto.randomUUID();
        showView(chatView);
        submitMessage(`New chat started by ${userName}.`, true);
    });

    get('.chat-submit', chatView).addEventListener('click', () => {
        const text = get('.chat-textarea', chatView).value.trim();
        if (text) submitMessage(text);
    });
    get('.chat-textarea', chatView).addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            get('.chat-submit', chatView).click();
        }
    });
    get('.chat-textarea', chatView).addEventListener('input', (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    });

    launchButton.addEventListener('click', () => chatWindow.classList.toggle('visible'));
    get('.chat-close-btn', header).addEventListener('click', () => chatWindow.classList.remove('visible'));

    // Initial State
    showView(welcomeView);

})();
