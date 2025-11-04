// Component Loader
class ComponentLoader {
    constructor() {
        this.components = new Map();
        this.loadedComponents = new Set();
    }

    // Load a component from the components folder
    async loadComponent(componentName) {
        if (this.loadedComponents.has(componentName)) {
            return this.components.get(componentName);
        }

        try {
            const response = await fetch(`../components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Component ${componentName} not found`);
            }
            
            const html = await response.text();
            this.components.set(componentName, html);
            this.loadedComponents.add(componentName);
            return html;
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
            return '';
        }
    }

    // Insert component into DOM
    async insertComponent(componentName, targetSelector) {
        const component = await this.loadComponent(componentName);
        const target = document.querySelector(targetSelector);
        
        if (target && component) {
            target.innerHTML = component;
            this.initializeComponentEvents(componentName);
        }
    }

    // Initialize events for specific components
    initializeComponentEvents(componentName) {
        switch (componentName) {
            case 'header':
            case 'header-ar':
                this.initializeNavigation();
                break;
            case 'footer':
            case 'footer-ar':
                this.initializeFooter();
                break;
        }
    }

    // Initialize navigation functionality
    initializeNavigation() {
        // Mobile menu toggle - updated selectors
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Highlight active page
        this.setActiveNavLink();
    }

    // Set active navigation link based on current page
    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Initialize footer functionality
    initializeFooter() {
        // Add any footer-specific functionality here
        console.log('Footer initialized');
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const loader = new ComponentLoader();
    
    // Detect current language based on URL
    const currentPath = window.location.pathname;
    const isArabic = currentPath.includes('/ar/');
    
    // Load appropriate header and footer based on language
    if (isArabic) {
        await loader.insertComponent('header-ar', 'header');
        await loader.insertComponent('footer-ar', 'footer');
    } else {
        await loader.insertComponent('header', 'header');
        await loader.insertComponent('footer', 'footer');
    }
    
    // Initialize language system after components are loaded
    if (window.LanguageManager) {
        window.LanguageManager.init();
    }
    
    // Initialize main app functionality
    initializeApp();
});

// Main app initialization
function initializeApp() {
    // Add scroll effect to header
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#ffffff';
                header.style.backdropFilter = 'none';
            }
        });
    }

    // Initialize loading animations
    initializeAnimations();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
}

// Initialize scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);

    // Observe all elements with loading class
    document.querySelectorAll('.loading').forEach(el => {
        observer.observe(el);
    });
}

// Initialize smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Export for use in other modules
window.ComponentLoader = ComponentLoader;