(function() {
    // Initialize widget only once
    if (window.ChatWidgetLoaded) return;
    window.ChatWidgetLoaded = true;

    // Load font resource - Inter
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontElement);

    // Apply widget styles with a new "Aether" design theme
    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        /* ========================================= */
        /* n8n-Chat AETHER Theme                   */
        /* Design by Gemini - Clean & Professional */
        /* ========================================= */

        .chat-assist-widget {
            --chat-font-family: 'Inter', sans-serif;
            
            /* --- Color Palette: Light, Clean & Blue --- */
            --chat-bg: #ffffff;
            --chat-surface: #f8f9fa; /* Light grey for messages area */
            
            --accent-primary: #007bff; /* Professional Blue */
            --accent-secondary: #0056b3;
            --accent-gradient: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
            
            --text-primary: #212529; /* Dark grey for readability */
            --text-secondary: #6c757d;
            --text-on-accent: #ffffff;

            --border-color: #dee2e6;

            /* --- Sizing & Radius --- */
            --chat-radius-md: 12px;
            --chat-radius-lg: 20px;
            --chat-radius-full: 9999px;

            /* --- Effects & Transitions --- */
            --chat-shadow-md: 0 8px 24px rgba(0, 0, 0, 0.1);
            --chat-shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.08);
            --chat-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

            font-family: var(--chat-font-family);
        }

        /* --- Main Window --- */
        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 100px;
            z-index: 1000;
            width: 390px;
            height: 70vh;
            max-height: 650px;
            background: var(--chat-bg);
            border-radius: var(--chat-radius-lg);
            border: 1px solid var(--border-color);
            box-shadow: var(--chat-shadow-md);
            overflow: hidden;
            display: none;
            flex-direction: column;
            transition: var(--chat-transition);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }

        .chat-assist-widget .chat-window.right-side { right: 20px; }
        .chat-assist-widget .chat-window.left-side { left: 20px; }
        .chat-assist-widget .chat-window.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        /* --- Header --- */
        .chat-assist-widget .chat-header {
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--chat-bg);
            color: var(--text-primary);
            position: relative;
            border-bottom: 1px solid var(--border-color);
            flex-shrink: 0;
        }
        .chat-assist-widget .chat-header-logo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        }
        .chat-assist-widget .chat-header-title {
            font-size: 17px;
            font-weight: 600;
        }
        .chat-assist-widget .chat-close-btn {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            font-size: 24px;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .chat-assist-widget .chat-close-btn:hover {
            background: #f1f3f5;
            color: var(--text-primary);
        }
        
        /* --- CORRECTED LOCATION FOR SCROLL FIX --- */
        .chat-assist-widget .chat-body {
            flex: 1; /* Make it fill the available space */
            display: flex;
            flex-direction: column;
            min-height: 0; /* Crucial fix for flexbox scrolling */
        }
        
        /* --- Welcome Screen & Registration --- */
        .chat-assist-widget .chat-welcome, .chat-assist-widget .user-registration {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 24px;
            text-align: center;
            background: var(--chat-bg);
        }
         .chat-assist-widget .chat-welcome-title, .chat-assist-widget .registration-title {
            font-size: 22px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 16px;
            line-height: 1.3;
        }
        .chat-assist-widget .chat-start-btn, .chat-assist-widget .submit-registration {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 14px 20px;
            background: var(--accent-gradient);
            color: var(--text-on-accent);
            border: none;
            border-radius: var(--chat-radius-md);
            cursor: pointer;
            font-size: 16px;
            transition: var(--chat-transition);
            font-weight: 600;
            box-shadow: var(--chat-shadow-sm);
        }
        .chat-assist-widget .chat-start-btn:hover, .chat-assist-widget .submit-registration:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 123, 255, 0.3);
        }

        /* --- Messages Area --- */
        .chat-assist-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: var(--chat-surface);
        }
        .chat-assist-widget .chat-messages::-webkit-scrollbar { width: 6px; }
        .chat-assist-widget .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-assist-widget .chat-messages::-webkit-scrollbar-thumb {
            background-color: #ced4da;
            border-radius: var(--chat-radius-full);
        }
        .chat-assist-widget .chat-messages::-webkit-scrollbar-thumb:hover {
            background-color: #adb5bd;
        }

        /* --- Message Bubbles --- */
        .chat-assist-widget .chat-bubble {
            padding: 12px 18px;
            border-radius: 18px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 15px;
            line-height: 1.6;
            white-space: pre-line;
            box-shadow: var(--chat-shadow-sm);
        }
        .chat-assist-widget .chat-bubble.user-bubble {
            background: var(--accent-gradient);
            color: var(--text-on-accent);
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }
        .chat-assist-widget .chat-bubble.bot-bubble {
            background: var(--chat-bg);
            color: var(--text-primary);
            align-self: flex-start;
            border: 1px solid #e9ecef;
            border-bottom-left-radius: 4px;
        }

        /* --- Typing Indicator --- */
        .chat-assist-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 12px 18px;
            background: var(--chat-bg);
            border: 1px solid #e9ecef;
            border-radius: 18px;
            border-bottom-left-radius: 4px;
            align-self: flex-start;
            box-shadow: var(--chat-shadow-sm);
        }
        .chat-assist-widget .typing-dot {
            width: 8px;
            height: 8px;
            background-color: var(--text-secondary);
            border-radius: 50%;
            opacity: 0.7;
            animation: typingAnimation 1.4s infinite ease-in-out;
        }
        .chat-assist-widget .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .chat-assist-widget .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingAnimation {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
        }

        /* --- Controls Area --- */
        .chat-assist-widget .chat-controls {
            padding: 12px 16px;
            background: var(--chat-bg);
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 10px;
            align-items: center;
            flex-shrink: 0;
        }
        .chat-assist-widget .chat-textarea {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid var(--border-color);
            border-radius: var(--chat-radius-full);
            background: #f1f3f5;
            color: var(--text-primary);
            resize: none;
            font-family: inherit;
            font-size: 15px;
            line-height: 1.5;
            min-height: 48px;
            max-height: 120px;
            transition: var(--chat-transition);
        }
        .chat-assist-widget .chat-textarea:focus {
            outline: none;
            background: var(--chat-bg);
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        }
        .chat-assist-widget .chat-textarea::placeholder {
            color: var(--text-secondary);
        }
        .chat-assist-widget .chat-submit {
            background: var(--accent-primary);
            color: var(--text-on-accent);
            border: none;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            cursor: pointer;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .chat-assist-widget .chat-submit:hover {
            background: var(--accent-secondary);
            transform: scale(1.1);
        }
        .chat-assist-widget .chat-submit svg {
            width: 24px;
            height: 24px;
        }

        /* --- Launcher Button --- */
        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 20px;
            height: 60px;
            width: 60px;
            border-radius: 50%;
            background: var(--accent-primary);
            color: var(--text-on-accent);
            border: none;
            cursor: pointer;
            box-shadow: var(--chat-shadow-md);
            z-index: 999;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .chat-assist-widget .chat-launcher.right-side { right: 20px; }
        .chat-assist-widget .chat-launcher.left-side { left: 20px; }

        .chat-assist-widget .chat-launcher:hover {
            transform: scale(1.1);
            background: var(--accent-secondary);
        }
        .chat-assist-widget .chat-launcher svg { width: 32px; height: 32px; }
        .chat-assist-widget .chat-launcher-text { display: none; }

        /* --- Footer & Suggested Questions --- */
         .chat-assist-widget .chat-footer-link {
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 12px;
            transition: var(--chat-transition);
        }
        .chat-assist-widget .chat-footer-link:hover {
            color: var(--accent-primary);
        }
        .chat-assist-widget .suggested-question-btn {
            background: var(--chat-bg);
            border: 1px solid #ced4da;
            border-radius: var(--chat-radius-full);
            padding: 10px 14px;
            font-size: 13px;
            color: var(--text-primary);
            cursor: pointer;
            transition: var(--chat-transition);
            text-align: left;
        }
        .chat-assist-widget .suggested-question-btn:hover {
            background: #e9ecef;
            border-color: #adb5bd;
        }
        
        /* Registration Form Specifics */
        .chat-assist-widget .user-registration.active {
            display: flex;
        }
        .chat-assist-widget .form-input {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid var(--border-color);
            border-radius: var(--chat-radius-md);
            font-family: inherit;
            font-size: 14px;
        }
        .chat-assist-widget .form-input:focus {
            outline: none;
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        }
    `;
    document.head.appendChild(widgetStyles);

    // Default configuration
    const defaultSettings = {
        webhook: { url: '', route: '' },
        branding: { logo: '', name: '', welcomeText: '', responseTimeText: '', poweredBy: { text: '', link: '' } },
        style: { primaryColor: '#007bff', secondaryColor: '#0056b3', position: 'right', backgroundColor: '#ffffff', fontColor: '#212529' },
        suggestedQuestions: []
    };

    // Merge user settings with defaults
    const settings = window.ChatWidgetConfig ?
        {
            webhook: { ...defaultSettings.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultSettings.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultSettings.style, ...window.ChatWidgetConfig.style },
            suggestedQuestions: window.ChatWidgetConfig.suggestedQuestions || defaultSettings.suggestedQuestions
        } : defaultSettings;

    // Session tracking
    let conversationId = '';
    let isWaitingForResponse = false;

    // Create widget DOM structure
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    
    widgetRoot.style.setProperty('--accent-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--accent-secondary', settings.style.secondaryColor);

    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    
    chatWindow.innerHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${settings.branding.logo}" alt="${settings.branding.name || 'Logo'}">
            <span class="chat-header-title">${settings.branding.name || 'Chat'}</span>
            <button class="chat-close-btn">×</button>
        </div>
        <div class="chat-body" style="display: none;">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="Type your message here..." rows="1"></textarea>
                <button class="chat-submit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" /></svg>
                </button>
            </div>
            <div class="chat-footer">
                ${settings.branding.poweredBy.text ? `<a class="chat-footer-link" href="${settings.branding.poweredBy.link || '#'}" target="_blank">${settings.branding.poweredBy.text}</a>` : ''}
            </div>
        </div>
        <div class="chat-welcome">
            <h2 class="chat-welcome-title">${settings.branding.welcomeText || 'Welcome!'}</h2>
            <button class="chat-start-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Start chatting
            </button>
            <p class="chat-response-time">${settings.branding.responseTimeText || ''}</p>
        </div>
        <div class="user-registration" style="display: none;">
            <form class="registration-form">
                <h2 class="registration-title">Please enter your details to start</h2>
                <div class="form-field"><label class="form-label" for="chat-user-name">Name</label><input type="text" id="chat-user-name" class="form-input" placeholder="Your name" required><div class="error-text" id="name-error"></div></div>
                <div class="form-field"><label class="form-label" for="chat-user-email">Email</label><input type="email" id="chat-user-email" class="form-input" placeholder="Your email address" required><div class="error-text" id="email-error"></div></div>
                <button type="submit" class="submit-registration">Continue to Chat</button>
            </form>
        </div>
    `;
    
    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M21.75 9.063c.428 0 .822.195.975.552a.75.75 0 0 1-.322.923l-8.62 4.926c-.39.223-.87.223-1.26 0l-8.62-4.926a.75.75 0 0 1 .653-1.475l8.445 4.826 8.445-4.826a.75.75 0 0 1 .284-.052ZM21.75 12.813c.428 0 .822.195.975.552a.75.75 0 0 1-.322.923l-8.62 4.926c-.39.223-.87.223-1.26 0l-8.62-4.926a.75.75 0 0 1 .653-1.475l8.445 4.826 8.445-4.826a.75.75 0 0 1 .284-.052Z" /></svg>`;
    
    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    const get = (selector) => chatWindow.querySelector(selector);
    const messagesContainer = get('.chat-messages');
    const messageTextarea = get('.chat-textarea');
    
    function createSessionId() { return crypto.randomUUID(); }
    function linkifyText(text) { return text.replace(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim, url => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`); }
    function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
    function autoResizeTextarea() { messageTextarea.style.height = 'auto'; messageTextarea.style.height = `${messageTextarea.scrollHeight}px`; }

    function showView(view) {
        ['.chat-welcome', '.user-registration', '.chat-body'].forEach(v => get(v).style.display = 'none');
        get(view).style.display = 'flex';
    }

    async function submitMessage(messageText, isHidden = false) {
        if (isWaitingForResponse) return;
        isWaitingForResponse = true;
        
        if (!isHidden) {
            const userMessage = document.createElement('div');
            userMessage.className = 'chat-bubble user-bubble';
            userMessage.textContent = messageText;
            messagesContainer.appendChild(userMessage);
            messageTextarea.value = '';
            autoResizeTextarea();
        }

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: "sendMessage",
                    sessionId: conversationId,
                    route: settings.webhook.route,
                    chatInput: messageText,
                    metadata: { userId: get('#chat-user-email').value, userName: get('#chat-user-name').value }
                })
            });
            const responseData = await response.json();
            
            typingIndicator.remove();
            
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-bubble bot-bubble';
            const responseText = Array.isArray(responseData) && responseData[0] ? responseData[0].output : responseData.output || "Sorry, I didn't get that.";
            botMessage.innerHTML = linkifyText(responseText);
            messagesContainer.appendChild(botMessage);

            if (isHidden && settings.suggestedQuestions?.length > 0) {
                 const suggestedQuestionsContainer = document.createElement('div');
                 suggestedQuestionsContainer.className = 'suggested-questions';
                 settings.suggestedQuestions.forEach(question => {
                     const btn = document.createElement('button');
                     btn.className = 'suggested-question-btn';
                     btn.textContent = question;
                     btn.onclick = () => {
                         submitMessage(question);
                         suggestedQuestionsContainer.remove();
                     };
                     suggestedQuestionsContainer.appendChild(btn);
                 });
                 messagesContainer.appendChild(suggestedQuestionsContainer);
            }

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Message submission error:', error);
            if(typingIndicator.parentNode) typingIndicator.remove();
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = "Sorry, an error occurred. Please try again.";
            messagesContainer.appendChild(errorMessage);
        } finally {
            isWaitingForResponse = false;
        }
    }

    get('.chat-start-btn').addEventListener('click', () => showView('.user-registration'));
    
    get('.registration-form').addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        const nameInput = get('#chat-user-name');
        const emailInput = get('#chat-user-email');
        get('#name-error').textContent = '';
        get('#email-error').textContent = '';
        if (!nameInput.value.trim()) { get('#name-error').textContent = 'Please enter your name'; isValid = false; }
        if (!isValidEmail(emailInput.value.trim())) { get('#email-error').textContent = 'Please enter a valid email'; isValid = false; }
        
        if (!isValid) return;
        
        conversationId = createSessionId();
        showView('.chat-body');
        submitMessage(`New chat started by ${nameInput.value.trim()}.`, true);
    });

    get('.chat-submit').addEventListener('click', () => { if (messageTextarea.value.trim()) submitMessage(messageTextarea.value.trim()); });
    messageTextarea.addEventListener('input', autoResizeTextarea);
    messageTextarea.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); get('.chat-submit').click(); } });
    launchButton.addEventListener('click', () => chatWindow.classList.toggle('visible'));
    get('.chat-close-btn').addEventListener('click', () => chatWindow.classList.remove('visible'));

    showView('.chat-welcome');
})();
