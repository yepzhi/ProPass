/**
 * ProPass — Richmond Pro Onboarding Logic
 */

const App = {
    state: {
        name: '',
        email: '',
        phone: '',
        school: '',
        currentView: 'welcome',
        currentTab: 'news'
    },

    schoolData: {
        'ITESCA': {
            title: 'ITESCA Pro Pathway 🎓',
            content: `
                <div class="ki-card">
                    <h4>Certificación TOEIC 2026</h4>
                    <p>Tu programa ITESCA incluye <strong>2 diagnósticos oficiales (Mock Tests)</strong> y un examen de certificación internacional <strong>TOEIC</strong> avalado por ETS.</p>
                </div>
                <div class="ki-card">
                    <h4>Meta de Empleabilidad</h4>
                    <p>El objetivo es que el 100% de los alumnos egresen con una certificación de nivel B2 mínimo.</p>
                </div>
            `
        },
        'ITLM': {
            title: 'Soporte ITLM & Alumnos 🎒',
            content: `
                <div class="ki-card highlight">
                    <h4>Cupón de Descuento Alumnos</h4>
                    <p>Comparte con tus alumnos el código <code class="code-box">TEC26</code> para obtener el precio preferencial de <strong>$498 MXN</strong> en su licencia digital.</p>
                </div>
                <div class="ki-card">
                    <h4>Guía de Compra Digital</h4>
                    <p>Verifica que tus alumnos descarguen el manual de compra para evitar errores en la activación de tokens.</p>
                </div>
            `
        },
        'default': {
            title: 'Información Richmond Pro ✦',
            content: `
                <div class="ki-card highlight">
                    <h4>Diagnostic Test (Uso Ilimitado)</h4>
                    <p>Solicita a tu Coordinador o Rep Richmond tokens <strong>gratuitos e ilimitados</strong> del <em>Diagnostic Test</em> para evaluar el nivel de tus alumnos en cualquier momento.</p>
                </div>
                <div class="ki-card">
                    <h4>Soporte a la Implementación</h4>
                    <p>Tu institución cuenta con el respaldo total de Richmond para la activación de licencias y capacitación docente.</p>
                </div>
                <div class="ki-card">
                    <h4>Certificación Docente</h4>
                    <p>Consulta con tu coordinador las fechas de los próximos webinars de capacitación para herramientas RLP v2.</p>
                </div>
            `
        }
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
        this.state.school = document.getElementById('teacher-school').value;

        // Persist locally
        localStorage.setItem('propass_teacher', JSON.stringify(this.state));

        // Update UI
        this.updateDashboardUI();
        this.showView('dashboard');
    },

    updateDashboardUI() {
        this.displayName.innerText = this.state.name;
        const displaySchool = document.getElementById('display-school');
        if (displaySchool) displaySchool.innerText = `Richmond Pro — ${this.state.school}`;

        // Populate Key Info Tab
        const info = this.schoolData[this.state.school] || this.schoolData['default'];
        const titleEl = document.getElementById('ki-title');
        const contentEl = document.getElementById('ki-content');
        
        if (titleEl) titleEl.innerHTML = info.title;
        if (contentEl) contentEl.innerHTML = info.content;
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
                this.updateDashboardUI();
                this.showView('dashboard');
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
