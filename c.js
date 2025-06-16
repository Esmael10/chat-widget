(function() {
    // Ensure the widget is initialized only once
    if (window.ChatWidgetLoaded) return;
    window.ChatWidgetLoaded = true;

    // --- Configuration ---
    // Merge user-provided config with defaults for a robust setup.
    const config = (userConfig => ({
        webhook: { url: '', route: '', ...userConfig.webhook },
        branding: { 
            logo: '', 
            name: 'Chat Assistant', 
            welcomeText: 'Hello! How can we help you today?', 
            responseTimeText: 'We typically reply in a few minutes.', 
            poweredBy: { text: '', link: '' }, 
            ...userConfig.branding 
        },
        style: { 
            primaryColor: '#3D52D5', 
            secondaryColor: '#0A1828',
            position: 'right', 
            ...userConfig.style 
        },
        suggestedQuestions: [],
        requireRegistration: true, // Set to false to skip the registration step
        ...userConfig,
    }))(window.ChatWidgetConfig || {});

    // --- State Management ---
    // Central object to hold the widget's state.
    const state = {
        conversationId: '',
        isWaitingForResponse: false,
        userName: '',
        userEmail: '',
        isWindowOpen: false
    };

    // --- CSS Styling (The "Monarch" Theme) ---
    // A comprehensive and detailed stylesheet injected into the page.
    const styles = `
:root {
    --monarch-font-family: 'Manrope', 'Inter', sans-serif;
    --monarch-primary: ${config.style.primaryColor};
    --monarch-secondary: ${config.style.secondaryColor};
    --monarch-bg: #ffffff;
    --monarch-surface: #f7f8fc;
    --monarch-border: #e8eaf1;
    --monarch-text-primary: #1c202b;
    --monarch-text-secondary: #6b7280;
    --monarch-text-light: #ffffff;
    --monarch-shadow-md: 0 4px 12px -1px rgba(0, 0, 0, 0.07), 0 2px 8px -2px rgba(0, 0, 0, 0.04);
    --monarch-shadow-lg: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 10px -4px rgba(0, 0, 0, 0.08);
    --monarch-radius-md: 12px;
    --monarch-radius-lg: 18px;
    --monarch-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.chat-assist-widget {
    font-family: var(--monarch-font-family);
    line-height: 1.6;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.chat-window {
    position: fixed;
    bottom: 100px;
    z-index: 9999;
    width: 90vw;
    max-width: 400px;
    height: 80vh;
    max-height: 700px;
    background-color: var(--monarch-bg);
    border-radius: var(--monarch-radius-lg);
    box-shadow: var(--monarch-shadow-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: opacity var(--monarch-transition), transform var(--monarch-transition);
    opacity: 0;
    transform: translateY(20px);
    visibility: hidden;
}
.chat-window.left-side { right: auto; left: 20px; transform-origin: bottom left; }
.chat-window.right-side { left: auto; right: 20px; transform-origin: bottom right; }
.chat-window.visible { opacity: 1; transform: translateY(0); visibility: visible; }
.chat-header {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    background-color: var(--monarch-secondary);
    color: var(--monarch-text-light);
    flex-shrink: 0;
}
.chat-header-logo { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.chat-header-title { font-size: 18px; font-weight: 700; }
.chat-close-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--monarch-text-light); opacity: 0.7; cursor: pointer; width: 36px; height: 36px; border-radius: 50%; transition: var(--monarch-transition); }
.chat-close-btn:hover { opacity: 1; background-color: rgba(255, 255, 255, 0.1); transform: translateY(-50%) rotate(90deg); }
.view-container { flex: 1; position: relative; overflow: hidden; }
.chat-view { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24px; text-align: center; background-color: var(--monarch-bg); transition: var(--monarch-transition); opacity: 0; transform: scale(1.05); pointer-events: none; }
.chat-view.active { opacity: 1; transform: scale(1); pointer-events: auto; }
.view-title { font-size: 22px; font-weight: 800; color: var(--monarch-text-primary); margin-bottom: 8px; }
.view-subtitle { font-size: 15px; color: var(--monarch-text-secondary); margin-bottom: 24px; max-width: 300px; }
.form-field { width: 100%; text-align: left; margin-bottom: 16px; }
.form-label { display: block; font-size: 14px; font-weight: 600; color: var(--monarch-text-primary); margin-bottom: 8px; }
.form-input { width: 100%; padding: 12px 16px; border: 1px solid var(--monarch-border); border-radius: var(--monarch-radius-md); background-color: var(--monarch-surface); color: var(--monarch-text-primary); font-family: inherit; font-size: 15px; transition: var(--monarch-transition); }
.form-input:focus { outline: none; border-color: var(--monarch-primary); background-color: var(--monarch-bg); box-shadow: 0 0 0 3px rgba(61, 82, 213, 0.2); }
.error-text { font-size: 13px; color: #d93025; margin-top: 4px; min-height: 18px; }
.chat-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 14px 20px; background-color: var(--monarch-primary); color: var(--monarch-text-light); border: none; border-radius: var(--monarch-radius-md); cursor: pointer; font-size: 16px; font-weight: 700; transition: var(--monarch-transition); box-shadow: var(--monarch-shadow-md); }
.chat-btn:hover { background-color: var(--monarch-secondary); transform: translateY(-2px); box-shadow: var(--monarch-shadow-lg); }
.chat-main { display: flex; flex-direction: column; height: 100%; }
.chat-messages { flex: 1; overflow-y: auto; padding: 20px; background-color: var(--monarch-surface); display: flex; flex-direction: column; gap: 16px; }
.chat-messages::-webkit-scrollbar { width: 8px; }
.chat-messages::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
.chat-messages::-webkit-scrollbar-thumb { background-color: #bdc5d5; border-radius: 8px; }
.chat-messages::-webkit-scrollbar-thumb:hover { background-color: #9ea8bd; }
.chat-bubble { padding: 12px 18px; border-radius: var(--monarch-radius-lg); max-width: 85%; font-size: 15px; line-height: 1.6; white-space: pre-wrap; animation: bubble-in 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
@keyframes bubble-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.user-bubble { background-color: var(--monarch-primary); color: var(--monarch-text-light); align-self: flex-end; border-bottom-right-radius: var(--monarch-radius-md); }
.bot-bubble { background-color: var(--monarch-bg); color: var(--monarch-text-primary); align-self: flex-start; border: 1px solid var(--monarch-border); border-bottom-left-radius: var(--monarch-radius-md); }
.chat-link { color: var(--monarch-primary); font-weight: 600; text-decoration: underline; }
.typing-indicator { display: flex; gap: 5px; padding: 16px; background-color: var(--monarch-bg); border-radius: var(--monarch-radius-lg); border-bottom-left-radius: var(--monarch-radius-md); align-self: flex-start; border: 1px solid var(--monarch-border); }
.typing-dot { width: 8px; height: 8px; background-color: #aeb5c2; border-radius: 50%; animation: typing-bounce 1.4s infinite ease-in-out both; }
.typing-dot:nth-child(2) { animation-delay: .2s; }
.typing-dot:nth-child(3) { animation-delay: .4s; }
@keyframes typing-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
.suggested-questions { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 20px 12px; }
.suggested-question-btn { background-color: var(--monarch-bg); border: 1px solid var(--monarch-border); border-radius: 99px; padding: 8px 14px; font-size: 13px; font-weight: 500; color: var(--monarch-primary); cursor: pointer; transition: var(--monarch-transition); }
.suggested-question-btn:hover { background-color: var(--monarch-primary); color: var(--monarch-text-light); border-color: var(--monarch-primary); transform: translateY(-1px); }
.chat-controls { padding: 12px; background-color: var(--monarch-bg); border-top: 1px solid var(--monarch-border); display: flex; gap: 12px; align-items: flex-end; }
.chat-textarea { flex: 1; padding: 12px 18px; border: none; border-radius: 24px; background-color: var(--monarch-surface); color: var(--monarch-text-primary); resize: none; font-family: inherit; font-size: 16px; max-height: 120px; }
.chat-textarea:focus { outline: none; }
.chat-submit { background-color: var(--monarch-primary); color: var(--monarch-text-light); border: none; border-radius: 50%; width: 48px; height: 48px; cursor: pointer; transition: var(--monarch-transition); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.chat-submit:hover { background-color: var(--monarch-secondary); transform: scale(1.05); }
.chat-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.chat-launcher { position: fixed; bottom: 20px; z-index: 9998; height: 64px; width: 64px; border-radius: 50%; background-color: var(--monarch-secondary); border: none; cursor: pointer; box-shadow: var(--monarch-shadow-lg); transition: var(--monarch-transition); display: flex; align-items: center; justify-content: center; }
.chat-launcher.left-side { left: 20px; }
.chat-launcher.right-side { right: 20px; }
.chat-launcher:hover { transform: scale(1.1); }
.launcher-icon { position: absolute; width: 32px; height: 32px; color: var(--monarch-text-light); transition: transform 0.3s ease, opacity 0.3s ease; }
.launcher-icon-open { transform: scale(1); opacity: 1; }
.launcher-icon-close { transform: scale(0); opacity: 0; }
.chat-window.visible ~ .chat-launcher .launcher-icon-open { transform: scale(0); opacity: 0; }
.chat-window.visible ~ .chat-launcher .launcher-icon-close { transform: scale(1); opacity: 1; }
.chat-footer { padding: 8px 16px; text-align: center; background-color: var(--monarch-surface); flex-shrink: 0; }
.chat-footer-link { color: var(--monarch-text-secondary); text-decoration: none; font-size: 12px; font-weight: 500; transition: var(--monarch-transition); }
.chat-footer-link:hover { color: var(--monarch-primary); }
`;
    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    
    // --- DOM Creation ---
    // A more structured way to build the widget's HTML.
    function h(tag, props = {}, children = []) {
        const el = document.createElement(tag);
        Object.keys(props).forEach(key => el[key] = props[key]);
        children.forEach(child => child && el.appendChild(child instanceof Node ? child : document.createTextNode(child)));
        return el;
    }

    const dom = {
        root: h('div', { className: 'chat-assist-widget' }),
        launcher: h('button', { className: `chat-launcher ${config.style.position}-side` }),
        window: h('div', { className: `chat-window ${config.style.position}-side` })
    };

    dom.launcher.innerHTML = `<svg class="launcher-icon launcher-icon-open" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg><svg class="launcher-icon launcher-icon-close" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`;
    
    const header = h('div', { className: 'chat-header' }, [
        h('img', { className: 'chat-header-logo', src: config.branding.logo, alt: 'Logo' }),
        h('span', { className: 'chat-header-title' }, [config.branding.name]),
        h('button', { className: 'chat-close-btn' }, ['×'])
    ]);

    // Views
    const welcomeView = h('div', { className: 'chat-view' }, [
        h('h2', { className: 'view-title' }, [config.branding.welcomeText]),
        h('p', { className: 'view-subtitle' }, [config.branding.responseTimeText]),
        h('button', { className: 'chat-btn start-btn' }, ['Start Conversation'])
    ]);
    const registrationView = h('div', { className: 'chat-view' }, [
        h('h2', { className: 'view-title' }, ['Just a few details to begin']),
        h('form', { className: 'registration-form' }, [
            h('div', { className: 'form-field' }, [
                h('label', { className: 'form-label', htmlFor: 'chat-name' }, ['Name']),
                h('input', { className: 'form-input', id: 'chat-name', type: 'text', required: true }),
                h('div', { className: 'error-text' })
            ]),
            h('div', { className: 'form-field' }, [
                h('label', { className: 'form-label', htmlFor: 'chat-email' }, ['Email']),
                h('input', { className: 'form-input', id: 'chat-email', type: 'email', required: true }),
                h('div', { className: 'error-text' })
            ]),
            h('button', { className: 'chat-btn continue-btn', type: 'submit' }, ['Continue to Chat'])
        ])
    ]);
    const chatView = h('div', { className: 'chat-view' }, [
        h('div', { className: 'chat-main' }, [
            h('div', { className: 'chat-messages' }),
            h('div', { className: 'suggested-questions' }),
            h('div', { className: 'chat-controls' }, [
                h('textarea', { className: 'chat-textarea', placeholder: 'Type your message...', rows: 1 }),
                h('button', { className: 'chat-submit' }, [
                    h('svg', { innerHTML: '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>', viewBox: '0 0 24 24', fill: 'currentColor'})
                ])
            ]),
            config.branding.poweredBy.text ? h('div', { className: 'chat-footer' }, [
                h('a', { className: 'chat-footer-link', href: config.branding.poweredBy.link || '#', target: '_blank' }, [config.branding.poweredBy.text])
            ]) : null
        ])
    ]);
    
    dom.window.append(header, h('div', { className: 'view-container' }, [welcomeView, registrationView, chatView]));
    dom.root.append(dom.window, dom.launcher);
    document.body.appendChild(dom.root);

    // --- Logic ---
    const q = (selector) => dom.root.querySelector(selector);
    const messagesContainer = q('.chat-messages');

    function showView(viewName) {
        q('.chat-view.active')?.classList.remove('active');
        q(`.${viewName}`)?.classList.add('active');
    }

    async function submitMessage(messageText, isHidden = false) {
        if (state.isWaitingForResponse) return;
        state.isWaitingForResponse = true;
        q('.chat-submit').disabled = true;

        if (!isHidden) {
            messagesContainer.appendChild(h('div', { className: 'chat-bubble user-bubble' }, [messageText]));
            q('.chat-textarea').value = '';
            q('.chat-textarea').style.height = 'auto';
        }

        const typingIndicator = h('div', { className: 'typing-indicator' }, [h('div', {className: 'typing-dot'}), h('div', {className: 'typing-dot'}), h('div', {className: 'typing-dot'})]);
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: "sendMessage", sessionId: state.conversationId, route: config.webhook.route,
                    chatInput: messageText, metadata: { userId: state.userEmail, userName: state.userName }
                })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const responseData = await response.json();
            
            typingIndicator.remove();
            
            const responseText = (Array.isArray(responseData) && responseData[0]?.output) || responseData.output || "I'm sorry, I encountered an issue.";
            const botMessage = h('div', { className: 'chat-bubble bot-bubble' });
            botMessage.innerHTML = responseText.replace(/(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, url => `<a href="${url}" target="_blank" class="chat-link">${url}</a>`);
            messagesContainer.appendChild(botMessage);

            if (isHidden && config.suggestedQuestions?.length > 0) {
                 const questionsContainer = q('.suggested-questions');
                 questionsContainer.innerHTML = '';
                 config.suggestedQuestions.forEach(qText => {
                     const btn = h('button', { className: 'suggested-question-btn', textContent: qText });
                     btn.onclick = () => {
                         submitMessage(qText);
                         questionsContainer.remove();
                     };
                     questionsContainer.appendChild(btn);
                 });
            }

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Chat Widget Error:', error);
            if(typingIndicator.parentNode) typingIndicator.remove();
            messagesContainer.appendChild(h('div', { className: 'chat-bubble bot-bubble' }, ["Sorry, I couldn't connect. Please try again."]));
        } finally {
            state.isWaitingForResponse = false;
            q('.chat-submit').disabled = false;
        }
    }

    // --- Event Listeners ---
    dom.launcher.addEventListener('click', () => dom.window.classList.toggle('visible'));
    q('.chat-close-btn').addEventListener('click', () => dom.window.classList.remove('visible'));

    q('.start-btn').addEventListener('click', () => {
        if (config.requireRegistration) {
            showView('user-registration');
        } else {
            state.conversationId = crypto.randomUUID();
            showView('chat-view');
            submitMessage('Chat started.', true);
        }
    });

    q('.registration-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = q('#chat-name');
        const emailInput = q('#chat-email');
        const nameError = q('.error-text', nameInput.parentElement);
        const emailError = q('.error-text', emailInput.parentElement);
        let isValid = true;

        nameError.textContent = '';
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Please enter your name.';
            isValid = false;
        }
        emailError.textContent = '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email.';
            isValid = false;
        }
        
        if (!isValid) return;
        
        state.userName = nameInput.value.trim();
        state.userEmail = emailInput.value.trim();
        state.conversationId = crypto.randomUUID();
        
        showView('chat-view');
        submitMessage(`New chat started by ${state.userName}.`, true);
    });

    const textarea = q('.chat-textarea');
    q('.chat-submit').addEventListener('click', () => {
        const text = textarea.value.trim();
        if (text) submitMessage(text);
    });
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            q('.chat-submit').click();
        }
    });
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    });

    // --- Initial Load ---
    const fontLoader = document.createElement('link');
    fontLoader.rel = 'stylesheet';
    fontLoader.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fontLoader);
    
    showView('welcome-view');

})();
