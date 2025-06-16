/**
 * ==================================================================================
 * QUANTUM CHAT WIDGET v1.0
 * ==================================================================================
 * A professional, feature-rich, and highly-detailed embeddable chat widget.
 *
 * Features:
 * - Clean, modern, and professional UI/UX.
 * - Multi-view architecture (Welcome, Registration, Chat).
 * - Optional user registration.
 * - Session persistence via localStorage.
 * - Detailed animations and micro-interactions.
 * - Extensive configuration options.
 * - Dynamic DOM creation.
 * - Comprehensive and meticulously crafted CSS stylesheet.
 * - Self-contained, no external dependencies required besides Google Fonts.
 *
 * Crafted with dedication to meet the highest standards of quality and detail.
 * ==================================================================================
 */
(function() {
    'use strict';

    // Prevent re-initialization
    if (window.QuantumChatLoaded) {
        console.warn("Quantum Chat Widget has already been loaded.");
        return;
    }
    window.QuantumChatLoaded = true;

    // --- 1. CONFIGURATION ---
    // Merge user-provided settings with robust defaults.
    const config = ((userConfig = {}) => ({
        webhook: { url: '', route: '', ...userConfig.webhook },
        branding: {
            name: 'Quantum Support',
            logo: 'https://placehold.co/100x100/1E293B/FFFFFF?text=Q', // Default logo
            welcomeTitle: 'Welcome! How can we assist?',
            welcomeSubtitle: 'Our team is here to help. Ask us anything!',
            poweredBy: { text: 'Powered by Quantum AI', link: '#' },
            ...userConfig.branding,
        },
        style: {
            theme: 'dark', // 'light' or 'dark'
            primaryColor: '#4f46e5', // Indigo
            secondaryColor: '#1e293b', // Slate
            position: 'right', // 'left' or 'right'
            font: 'Inter',
            ...userConfig.style,
        },
        settings: {
            requireRegistration: true,
            suggestedQuestions: [], // e.g., ['What are your prices?', 'How do I get started?']
            sessionPersistence: true,
            ...userConfig.settings,
        },
    }))(window.ChatWidgetConfig);


    // --- 2. CSS STYLESHEET ---
    // A comprehensive, highly-detailed stylesheet is injected dynamically.
    const generateStylesheet = () => {
        const styles = `
:root {
    /* Color Palette - Dynamically set based on theme */
    --qc-font-family: '${config.style.font}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --qc-primary: ${config.style.primaryColor};
    --qc-primary-hover: #4338ca; /* Darker Indigo */

    /* Light Theme Colors */
    --qc-bg-light: #ffffff;
    --qc-surface-light: #f3f4f6;
    --qc-border-light: #e5e7eb;
    --qc-header-bg-light: #f9fafb;
    --qc-header-text-light: #111827;
    --qc-text-primary-light: #1f2937;
    --qc-text-secondary-light: #6b7280;
    --qc-user-bubble-text-light: #ffffff;

    /* Dark Theme Colors */
    --qc-bg-dark: #111827; /* Navy Blue */
    --qc-surface-dark: #1f293b; /* Slate */
    --qc-border-dark: #374151;
    --qc-header-bg-dark: #0f172a; /* Darker Slate */
    --qc-header-text-dark: #f1f5f9;
    --qc-text-primary-dark: #e2e8f0;
    --qc-text-secondary-dark: #94a3b8;
    --qc-user-bubble-text-dark: #ffffff;

    /* Sizing & Spacing */
    --qc-radius-sm: 6px;
    --qc-radius-md: 10px;
    --qc-radius-lg: 16px;
    --qc-spacing-sm: 8px;
    --qc-spacing-md: 12px;
    --qc-spacing-lg: 16px;
    --qc-spacing-xl: 20px;

    /* Effects */
    --qc-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    --qc-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    --qc-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    --qc-transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    --qc-focus-ring: 0 0 0 3px ${config.style.primaryColor}40;
}

.quantum-chat-widget {
    /* Theme-specific variables */
    --qc-bg: var(--qc-bg-${config.style.theme});
    --qc-surface: var(--qc-surface-${config.style.theme});
    --qc-border: var(--qc-border-${config.style.theme});
    --qc-header-bg: var(--qc-header-bg-${config.style.theme});
    --qc-header-text: var(--qc-header-text-${config.style.theme});
    --qc-text-primary: var(--qc-text-primary-${config.style.theme});
    --qc-text-secondary: var(--qc-text-secondary-${config.style.theme});
    --qc-user-bubble-text: var(--qc-user-bubble-text-${config.style.theme});

    font-family: var(--qc-font-family);
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* === Main Window & Launcher === */
.qc-window {
    position: fixed;
    bottom: 90px;
    z-index: 2147483646;
    width: clamp(340px, 90vw, 400px);
    height: clamp(500px, 80vh, 720px);
    background-color: var(--qc-bg);
    border-radius: var(--qc-radius-lg);
    box-shadow: var(--qc-shadow-xl);
    border: 1px solid var(--qc-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
    opacity: 0;
    transform: translateY(25px);
    visibility: hidden;
}
.qc-window.qc-position-left { right: auto; left: 20px; transform-origin: bottom left; }
.qc-window.qc-position-right { left: auto; right: 20px; transform-origin: bottom right; }
.qc-window.qc-visible { opacity: 1; transform: translateY(0); visibility: visible; }

.qc-launcher {
    position: fixed;
    bottom: 20px;
    z-index: 2147483645;
    height: 60px;
    width: 60px;
    background-color: var(--qc-primary);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: var(--qc-shadow-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--qc-transition);
}
.qc-launcher:hover { transform: scale(1.1); box-shadow: 0 10px 20px ${config.style.primaryColor}40; }
.qc-launcher.qc-position-left { left: 20px; }
.qc-launcher.qc-position-right { right: 20px; }
.qc-launcher-icon { position: absolute; width: 30px; height: 30px; color: white; transition: transform 0.3s ease, opacity 0.3s ease; }
.qc-launcher-icon-open { transform: scale(1); opacity: 1; }
.qc-launcher-icon-close { transform: scale(0); opacity: 0; }
.qc-window.qc-visible ~ .qc-launcher .qc-launcher-icon-open { transform: scale(0) rotate(90deg); opacity: 0; }
.qc-window.qc-visible ~ .qc-launcher .qc-launcher-icon-close { transform: scale(1) rotate(0deg); opacity: 1; }

/* === Header === */
.qc-header {
    padding: var(--qc-spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--qc-spacing-md);
    background-color: var(--qc-header-bg);
    color: var(--qc-header-text);
    border-bottom: 1px solid var(--qc-border);
    flex-shrink: 0;
}
.qc-header-logo { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; background-color: white; }
.qc-header-text-container { display: flex; flex-direction: column; }
.qc-header-title { font-size: 17px; font-weight: 700; color: var(--qc-header-text); }
.qc-header-subtitle { font-size: 13px; color: var(--qc-text-secondary); }
.qc-header-close-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--qc-text-secondary); cursor: pointer; width: 32px; height: 32px; border-radius: 50%; transition: var(--qc-transition); }
.qc-header-close-btn:hover { color: var(--qc-text-primary); background-color: var(--qc-surface); }

/* === View Management === */
.qc-view-container { flex: 1; position: relative; overflow: hidden; }
.qc-view { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: var(--qc-spacing-xl); text-align: center; background-color: var(--qc-bg); transition: opacity 0.3s ease, transform 0.3s ease; opacity: 0; transform: scale(1.03); pointer-events: none; }
.qc-view.qc-active { opacity: 1; transform: scale(1); pointer-events: auto; }
.qc-view-title { font-size: 20px; font-weight: 800; color: var(--qc-text-primary); margin-bottom: 8px; }
.qc-view-subtitle { font-size: 14px; color: var(--qc-text-secondary); margin-bottom: 24px; max-width: 320px; }

/* === Forms & Inputs === */
.qc-form { width: 100%; display: flex; flex-direction: column; gap: 16px; }
.qc-form-field { text-align: left; }
.qc-form-label { display: block; font-size: 14px; font-weight: 600; color: var(--qc-text-primary); margin-bottom: 8px; }
.qc-form-input { width: 100%; padding: 12px; border: 1px solid var(--qc-border); border-radius: var(--qc-radius-md); background-color: var(--qc-surface); color: var(--qc-text-primary); font-family: inherit; font-size: 15px; transition: var(--qc-transition); }
.qc-form-input:focus { outline: none; border-color: var(--qc-primary); background-color: var(--qc-bg); box-shadow: var(--qc-focus-ring); }
.qc-error-text { font-size: 12px; font-weight: 500; color: #ef4444; margin-top: 4px; min-height: 16px; }

/* === Buttons === */
.qc-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; background-color: var(--qc-primary); color: white; border: none; border-radius: var(--qc-radius-md); cursor: pointer; font-size: 15px; font-weight: 700; transition: var(--qc-transition); box-shadow: var(--qc-shadow-md); }
.qc-btn:hover { background-color: var(--qc-primary-hover); transform: translateY(-2px); box-shadow: var(--qc-shadow-lg); }
.qc-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

/* === Main Chat Interface === */
.qc-chat-main { display: flex; flex-direction: column; height: 100%; background-color: var(--qc-surface); }
.qc-messages-container { flex: 1; overflow-y: auto; padding: var(--qc-spacing-lg); display: flex; flex-direction: column; gap: var(--qc-spacing-lg); }
.qc-messages-container::-webkit-scrollbar { width: 8px; }
.qc-messages-container::-webkit-scrollbar-track { background: transparent; }
.qc-messages-container::-webkit-scrollbar-thumb { background-color: var(--qc-border); border-radius: 8px; }
.qc-messages-container:hover::-webkit-scrollbar-thumb { background-color: #9ca3af; }

.qc-bubble { padding: 10px 16px; border-radius: var(--qc-radius-lg); max-width: 85%; font-size: 15px; line-height: 1.6; white-space: pre-wrap; animation: qc-bubble-in 0.4s cubic-bezier(0.25, 1, 0.5, 1); }
@keyframes qc-bubble-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.qc-bubble-user { background-color: var(--qc-primary); color: var(--qc-user-bubble-text); align-self: flex-end; border-bottom-right-radius: var(--qc-radius-sm); }
.qc-bubble-bot { background-color: var(--qc-bg); color: var(--qc-text-primary); align-self: flex-start; border: 1px solid var(--qc-border); border-bottom-left-radius: var(--qc-radius-sm); }
.qc-bubble-system { font-size: 12px; color: var(--qc-text-secondary); text-align: center; background-color: transparent; padding: 4px; align-self: center; }

.qc-message-group { display: flex; flex-direction: column; }
.qc-message-group.qc-user { align-items: flex-end; }
.qc-message-group.qc-bot { align-items: flex-start; }
.qc-message-group .qc-bubble { margin-bottom: 4px; }
.qc-message-group .qc-bubble:last-child { margin-bottom: 0; }
.qc-message-meta { font-size: 11px; color: var(--qc-text-secondary); padding: 0 12px; }

/* Typing Indicator */
.qc-typing-indicator { display: flex; align-items: center; gap: 5px; padding: 14px; background-color: var(--qc-bg); border-radius: var(--qc-radius-lg); border-bottom-left-radius: var(--qc-radius-sm); border: 1px solid var(--qc-border); }
.qc-typing-dot { width: 8px; height: 8px; background-color: #9ca3af; border-radius: 50%; animation: qc-typing-bounce 1.4s infinite ease-in-out both; }
.qc-typing-dot:nth-child(2) { animation-delay: .2s; }
.qc-typing-dot:nth-child(3) { animation-delay: .4s; }
@keyframes qc-typing-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }

/* Suggested Questions */
.qc-suggested-questions-container { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 var(--qc-spacing-lg) var(--qc-spacing-md); }
.qc-suggested-question-btn { background-color: transparent; border: 1px solid var(--qc-border); border-radius: 99px; padding: 6px 12px; font-size: 13px; font-weight: 500; color: var(--qc-primary); cursor: pointer; transition: var(--qc-transition); }
.qc-suggested-question-btn:hover { background-color: var(--qc-primary); color: white; border-color: var(--qc-primary); }

/* Chat Controls */
.qc-controls-container { padding: var(--qc-spacing-md); background-color: var(--qc-bg); border-top: 1px solid var(--qc-border); flex-shrink: 0; }
.qc-controls { display: flex; gap: var(--qc-spacing-md); align-items: flex-end; background-color: var(--qc-surface); border-radius: var(--qc-radius-md); padding: var(--qc-spacing-sm); }
.qc-textarea { flex: 1; padding: 10px; border: none; background-color: transparent; color: var(--qc-text-primary); resize: none; font-family: inherit; font-size: 15px; max-height: 110px; }
.qc-textarea:focus { outline: none; }
.qc-submit-btn { background-color: var(--qc-primary); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; transition: var(--qc-transition); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.qc-submit-btn:hover { background-color: var(--qc-primary-hover); transform: scale(1.1); }
.qc-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.qc-submit-btn svg { width: 20px; height: 20px; }

/* Footer */
.qc-footer { padding: 8px 16px; text-align: center; background-color: var(--qc-header-bg); flex-shrink: 0; border-top: 1px solid var(--qc-border);}
.qc-footer-link { color: var(--qc-text-secondary); text-decoration: none; font-size: 12px; font-weight: 500; transition: var(--qc-transition); }
.qc-footer-link:hover { color: var(--qc-primary); }
`;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'quantum-chat-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = `https://fonts.googleapis.com/css2?family=${config.style.font.replace(' ', '+')}:wght@400;500;600;700;800&display=swap`;
        document.head.appendChild(fontLink);
    };


    // --- 3. WIDGET CLASS ---
    // The main class that encapsulates all widget logic.
    class QuantumChatWidget {
        constructor() {
            this.state = {
                conversationId: null,
                isWaitingForResponse: false,
                userName: '',
                userEmail: '',
                isWindowOpen: false,
                currentView: 'welcome', // welcome, registration, chat
            };
            this.dom = {};
            this.init();
        }

        /**
         * Initializes the widget, creates DOM, and sets up event listeners.
         */
        init() {
            generateStylesheet();
            this._createDOM();
            this._setupEventListeners();
            this._loadSession();
            this._render();
        }

        /**
         * Creates all necessary DOM elements for the widget.
         */
        _createDOM() {
            const h = (tag, props = {}, children = []) => {
                const el = document.createElement(tag);
                Object.assign(el, props);
                children.forEach(child => child && el.appendChild(child instanceof Node ? child : document.createTextNode(child)));
                return el;
            };

            this.dom.root = h('div', { className: 'quantum-chat-widget' });
            this.dom.launcher = h('button', { className: `qc-launcher qc-position-${config.style.position}` });
            this.dom.window = h('div', { className: `qc-window qc-position-${config.style.position}` });

            this.dom.launcher.innerHTML = `
                <svg class="qc-launcher-icon qc-launcher-icon-open" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>
                <svg class="qc-launcher-icon qc-launcher-icon-close" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
            `;

            const header = h('div', { className: 'qc-header' }, [
                h('img', { className: 'qc-header-logo', src: config.branding.logo, alt: 'Logo' }),
                h('div', { className: 'qc-header-text-container' }, [
                    h('span', { className: 'qc-header-title', textContent: config.branding.name }),
                    h('span', { className: 'qc-header-subtitle', textContent: 'Online' })
                ]),
                h('button', { className: 'qc-header-close-btn', innerHTML: '&#x2715;' })
            ]);

            // Views
            this.dom.welcomeView = h('div', { className: 'qc-view qc-welcome-view' }, [
                h('h2', { className: 'qc-view-title', textContent: config.branding.welcomeTitle }),
                h('p', { className: 'qc-view-subtitle', textContent: config.branding.welcomeSubtitle }),
                h('button', { className: 'qc-btn qc-start-btn', textContent: 'Start Conversation' })
            ]);
            
            this.dom.registrationView = h('div', { className: 'qc-view qc-registration-view' }, [
                h('h2', { className: 'qc-view-title', textContent: 'Just a few details to begin' }),
                h('form', { className: 'qc-form' }, [
                    h('div', { className: 'qc-form-field' }, [
                        h('label', { className: 'qc-form-label', htmlFor: 'qc-name-input' }, ['Name']),
                        h('input', { className: 'qc-form-input', id: 'qc-name-input', type: 'text', required: true }),
                        h('div', { className: 'qc-error-text' })
                    ]),
                    h('div', { className: 'qc-form-field' }, [
                        h('label', { className: 'qc-form-label', htmlFor: 'qc-email-input' }, ['Email']),
                        h('input', { className: 'qc-form-input', id: 'qc-email-input', type: 'email', required: true }),
                        h('div', { className: 'qc-error-text' })
                    ]),
                    h('button', { className: 'qc-btn qc-continue-btn', type: 'submit' }, ['Continue'])
                ])
            ]);

            this.dom.chatView = h('div', { className: 'qc-view qc-chat-view' }, [
                h('div', { className: 'qc-chat-main' }, [
                    h('div', { className: 'qc-messages-container' }),
                    h('div', { className: 'qc-suggested-questions-container' }),
                    h('div', { className: 'qc-controls-container' }, [
                        h('div', { className: 'qc-controls' }, [
                            h('textarea', { className: 'qc-textarea', placeholder: 'Type your message...', rows: 1 }),
                            h('button', { className: 'qc-submit-btn' }, [
                                h('svg', { innerHTML: '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>', viewBox: '0 0 24 24', fill: 'currentColor' })
                            ])
                        ])
                    ]),
                    config.branding.poweredBy.text ? h('div', { className: 'qc-footer' }, [
                        h('a', { className: 'qc-footer-link', href: config.branding.poweredBy.link, target: '_blank' }, [config.branding.poweredBy.text])
                    ]) : null
                ])
            ]);

            const viewContainer = h('div', { className: 'qc-view-container' }, [this.dom.welcomeView, this.dom.registrationView, this.dom.chatView]);
            this.dom.window.append(header, viewContainer);
            this.dom.root.append(this.dom.window, this.dom.launcher);
            document.body.appendChild(this.dom.root);
        }

        /**
         * Binds all event listeners for the widget.
         */
        _setupEventListeners() {
            this.dom.launcher.addEventListener('click', () => this.toggleWindow());
            this.dom.root.querySelector('.qc-header-close-btn').addEventListener('click', () => this.toggleWindow(false));
            
            this.dom.root.querySelector('.qc-start-btn').addEventListener('click', () => this._handleStart());
            this.dom.root.querySelector('.qc-form').addEventListener('submit', (e) => this._handleRegistration(e));
            
            const textarea = this.dom.root.querySelector('.qc-textarea');
            const submitBtn = this.dom.root.querySelector('.qc-submit-btn');

            submitBtn.addEventListener('click', () => this._handleSendMessage());
            textarea.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this._handleSendMessage();
                }
            });
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = `${Math.min(textarea.scrollHeight, 110)}px`;
            });
        }
        
        /**
         * Toggles the main chat window visibility.
         */
        toggleWindow(forceState) {
            this.state.isWindowOpen = typeof forceState === 'boolean' ? forceState : !this.state.isWindowOpen;
            this.dom.window.classList.toggle('qc-visible', this.state.isWindowOpen);
            if(this.state.isWindowOpen) {
                this.dom.root.querySelector('.qc-textarea')?.focus();
            }
        }

        /**
         * Renders the current view based on the state.
         */
        _render() {
            this.dom.root.querySelectorAll('.qc-view').forEach(v => v.classList.remove('qc-active'));
            this.dom.root.querySelector(`.qc-${this.state.currentView}-view`).classList.add('qc-active');
        }

        /**
         * Transitions between views.
         */
        _showView(viewName) {
            this.state.currentView = viewName;
            this._render();
        }

        /**
         * Handles the click on the "Start Conversation" button.
         */
        _handleStart() {
            if (config.settings.requireRegistration) {
                this._showView('registration');
            } else {
                this._startChatSession();
            }
        }
        
        /**
         * Validates and processes the registration form.
         */
        _handleRegistration(event) {
            event.preventDefault();
            const nameInput = this.dom.root.querySelector('#qc-name-input');
            const emailInput = this.dom.root.querySelector('#qc-email-input');
            const nameError = nameInput.nextElementSibling;
            const emailError = emailInput.nextElementSibling;
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
            
            if (isValid) {
                this.state.userName = nameInput.value.trim();
                this.state.userEmail = emailInput.value.trim();
                this._startChatSession();
            }
        }
        
        /**
         * Handles sending a message from the textarea.
         */
        _handleSendMessage() {
            const textarea = this.dom.root.querySelector('.qc-textarea');
            const messageText = textarea.value.trim();
            if (messageText) {
                this.submitMessage(messageText);
            }
        }

        /**
         * Starts a new chat session.
         */
        _startChatSession() {
            this.state.conversationId = crypto.randomUUID();
            this._saveSession();
            this._showView('chat');
            this.submitMessage(`Session started for ${this.state.userName || 'user'}.`, true);
        }

        /**
         * Adds a message to the UI.
         */
        _addMessageToUI(sender, text, { isSystem = false } = {}) {
            const messagesContainer = this.dom.root.querySelector('.qc-messages-container');
            
            const messageGroup = document.createElement('div');
            messageGroup.className = `qc-message-group qc-${sender}`;
            
            const bubble = document.createElement('div');
            bubble.className = isSystem ? 'qc-bubble-system' : `qc-bubble qc-bubble-${sender}`;
            
            // Basic markdown for bold text
            bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                   .replace(/(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1" target="_blank" class="qc-chat-link">$1</a>');

            const meta = document.createElement('div');
            meta.className = 'qc-message-meta';
            meta.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

            messageGroup.append(bubble, meta);
            messagesContainer.appendChild(messageGroup);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        /**
         * Main logic to submit a message to the webhook.
         */
        async submitMessage(messageText, isHidden = false) {
            if (this.state.isWaitingForResponse) return;
            this.state.isWaitingForResponse = true;
            this.dom.root.querySelector('.qc-submit-btn').disabled = true;

            if (!isHidden) {
                this._addMessageToUI('user', messageText);
                const textarea = this.dom.root.querySelector('.qc-textarea');
                textarea.value = '';
                textarea.dispatchEvent(new Event('input')); // Trigger resize
            }

            const typingIndicator = this._createTypingIndicator();
            const messagesContainer = this.dom.root.querySelector('.qc-messages-container');
            messagesContainer.appendChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            try {
                if (!config.webhook.url) throw new Error("Webhook URL is not configured.");
                const response = await fetch(config.webhook.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: "sendMessage", sessionId: this.state.conversationId, route: config.webhook.route,
                        chatInput: messageText, metadata: { userId: this.state.userEmail, userName: this.state.userName }
                    })
                });
                if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
                const responseData = await response.json();
                
                typingIndicator.remove();
                
                const responseText = (Array.isArray(responseData) && responseData[0]?.output) || responseData.output || "I'm sorry, I encountered an issue.";
                this._addMessageToUI('bot', responseText);

                if (isHidden && config.settings.suggestedQuestions?.length > 0) {
                     this._displaySuggestedQuestions();
                }

            } catch (error) {
                console.error('Quantum Chat Widget Error:', error);
                if (typingIndicator.parentNode) typingIndicator.remove();
                this._addMessageToUI('bot', "Sorry, I couldn't connect. Please check your connection and try again.");
            } finally {
                this.state.isWaitingForResponse = false;
                this.dom.root.querySelector('.qc-submit-btn').disabled = false;
            }
        }
        
        _createTypingIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'qc-message-group qc-bot';
            indicator.innerHTML = `
                <div class="qc-typing-indicator">
                    <div class="qc-typing-dot"></div>
                    <div class="qc-typing-dot"></div>
                    <div class="qc-typing-dot"></div>
                </div>`;
            return indicator;
        }

        _displaySuggestedQuestions() {
            const container = this.dom.root.querySelector('.qc-suggested-questions-container');
            container.innerHTML = '';
            config.settings.suggestedQuestions.forEach(qText => {
                const btn = document.createElement('button');
                btn.className = 'qc-suggested-question-btn';
                btn.textContent = qText;
                btn.onclick = () => {
                    this.submitMessage(qText);
                    container.style.display = 'none'; // Hide after one is clicked
                };
                container.appendChild(btn);
            });
            container.style.display = 'flex';
        }
        
        /**
         * Saves the current session ID to localStorage.
         */
        _saveSession() {
            if (config.settings.sessionPersistence) {
                localStorage.setItem('quantumChatSession', JSON.stringify({
                    id: this.state.conversationId,
                    name: this.state.userName,
                    email: this.state.userEmail,
                    timestamp: Date.now()
                }));
            }
        }

        /**
         * Loads a session from localStorage if it exists and is not too old.
         */
        _loadSession() {
            if (config.settings.sessionPersistence) {
                const savedSession = localStorage.getItem('quantumChatSession');
                if (savedSession) {
                    const { id, name, email, timestamp } = JSON.parse(savedSession);
                    // Expire session after 24 hours
                    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                        this.state.conversationId = id;
                        this.state.userName = name;
                        this.state.userEmail = email;
                        this._showView('chat');
                        this._addMessageToUI('system', { text: 'Welcome back! Continuing your previous session.' }, { isSystem: true });
                    } else {
                        localStorage.removeItem('quantumChatSession');
                    }
                }
            }
        }
    }

    // --- 4. INITIALIZATION ---
    // Wait for the DOM to be fully loaded before initializing the widget.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new QuantumChatWidget());
    } else {
        new QuantumChatWidget();
    }

})();
