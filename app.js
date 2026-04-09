/**
 * ProPass — Richmond Pro Onboarding Logic
 */

const App = {
    state: {
        name: '',
        email: '',
        phone: '',
        currentView: 'welcome',
        currentTab: 'news'
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.checkPersistence();
    },

    cacheDOM() {
        this.views = {
            welcome: document.getElementById('view-welcome'),
            dashboard: document.getElementById('view-dashboard')
        };
        this.form = document.getElementById('welcome-form');
        this.displayName = document.getElementById('display-name');
        
        this.tabs = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
    },

    bindEvents() {
        // Welcome Form Submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleOnboarding();
        });

        // Tab Switching
        this.tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });
    },

    handleOnboarding() {
        // Capture data
        this.state.name = document.getElementById('teacher-name').value;
        this.state.email = document.getElementById('teacher-email').value;
        this.state.phone = document.getElementById('teacher-phone').value;

        // Persist locally
        localStorage.setItem('propass_teacher', JSON.stringify(this.state));

        // Update UI
        this.displayName.innerText = this.state.name;
        this.showView('dashboard');
    },

    showView(viewId) {
        Object.keys(this.views).forEach(key => {
            this.views[key].classList.toggle('active', key === viewId);
        });
        this.state.currentView = viewId;
        window.scrollTo(0, 0);
    },

    switchTab(tabId) {
        this.tabs.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabId}`);
        });
        this.state.currentTab = tabId;
    },

    checkPersistence() {
        const saved = localStorage.getItem('propass_teacher');
        if (saved) {
            const data = JSON.parse(saved);
            this.state = { ...this.state, ...data };
            
            // Auto-fill or skip to dashboard if name exists
            if (this.state.name) {
                this.displayName.innerText = this.state.name;
                this.showView('dashboard');
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
