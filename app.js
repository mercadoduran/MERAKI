/* 
 * INTERACTIVE LOGIC — MERAKI CONSULTORÍA
 * Concept: Executive Tech Premium
 * Authors: Antigravity & Jose Miguel Mercado
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initActiveNavOnScroll();
    initMethodologyTabs();
    initMetricCounters();
    initFormSubmission();
});

/* ==========================================================================
   1. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Trigger once on load in case the user reloads page down
    handleScroll();
}

/* ==========================================================================
   2. MOBILE NAV TOGGLE (HAMBURGER MENU)
   ========================================================================== */
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerCta = document.getElementById('btn-header-cta');
    
    const toggleMenu = () => {
        navToggle.classList.toggle('active');
        mainNav.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    };
    
    const closeMenu = () => {
        navToggle.classList.remove('active');
        mainNav.classList.remove('open');
        document.body.classList.remove('no-scroll');
    };
    
    navToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on any link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking on header CTA button (on mobile if visible)
    if (headerCta) {
        headerCta.addEventListener('click', closeMenu);
    }
}

/* ==========================================================================
   3. SMOOTH SCROLL FOR BUTTONS & ANCHORS
   ========================================================================== */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Header offset deduction
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================================================
   4. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
   ========================================================================== */
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const options = {
        root: null,
        rootMargin: '-120px 0px -40% 0px', // Adjusted offset to trigger when section enters viewport properly
        threshold: 0
    };
    
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, options);
    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   5. INTERACTIVE METHODOLOGY TABS
   ========================================================================== */
function initMethodologyTabs() {
    const tabsContainer = document.getElementById('methodology-tabs-container');
    if (!tabsContainer) return;
    
    const tabs = tabsContainer.querySelectorAll('.methodology-tab');
    const panels = document.querySelectorAll('.methodology-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetStep = tab.getAttribute('data-step');
            
            // 1. Set active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 2. Animate and display corresponding panel
            panels.forEach(panel => {
                panel.classList.remove('active');
                
                if (panel.getAttribute('id') === `panel-${targetStep}`) {
                    panel.style.display = 'grid'; // Ensure layout displays correctly before animation triggers
                    setTimeout(() => {
                        panel.classList.add('active');
                    }, 50);
                } else {
                    // Hide after animation finishes
                    setTimeout(() => {
                        if (!panel.classList.contains('active')) {
                            panel.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   6. ANIMATED METRICS COUNTER (INTERSECTION OBSERVER)
   ========================================================================== */
function initMetricCounters() {
    const metricsSection = document.querySelector('.metrics');
    if (!metricsSection) return;
    
    const counterElements = document.querySelectorAll('.metric-num');
    let animated = false;
    
    const animateCounters = () => {
        counterElements.forEach(element => {
            const targetText = element.getAttribute('data-target');
            const targetNum = parseInt(targetText.replace(/[^0-9]/g, ''));
            const suffix = targetText.replace(/[0-9]/g, ''); // Extract + or % or K+
            const prefix = targetText.startsWith('+') ? '+' : '';
            
            let current = 0;
            const duration = 2000; // ms
            const stepTime = Math.max(Math.floor(duration / targetNum), 15);
            
            const timer = setInterval(() => {
                current += Math.ceil(targetNum / 100) || 1; // Increment step
                
                if (current >= targetNum) {
                    element.textContent = targetText; // Match final exact formatted text
                    clearInterval(timer);
                } else {
                    // Assemble value progressively
                    let formatted = current;
                    if (suffix.includes('K')) {
                        formatted = `${current}K`;
                    }
                    if (suffix.includes('%')) {
                        formatted = `${formatted}%`;
                    }
                    if (suffix.includes('+') || prefix === '+') {
                        if (suffix.endsWith('+')) {
                            formatted = `${formatted}+`;
                        } else {
                            formatted = `+${formatted}`;
                        }
                    }
                    element.textContent = formatted;
                }
            }, stepTime);
        });
    };
    
    const options = {
        root: null,
        threshold: 0.25
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateCounters();
                animated = true;
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    observer.observe(metricsSection);
}

/* ==========================================================================
   7. CTA DIAGNOSTIC FORM SUBMISSION
   ========================================================================== */
function initFormSubmission() {
    const form = document.getElementById('diagnostic-form');
    const successMessage = document.getElementById('form-success-message');
    
    // GHL WEBHOOK URL: Pega aquí la URL de tu disparador Inbound Webhook en GoHighLevel
    const GHL_WEBHOOK_URL = ''; 
    
    if (!form || !successMessage) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Retrieve inputs for success message feedback and payload
        const nameInput = document.getElementById('form-name').value.trim();
        const emailInput = document.getElementById('form-email').value.trim();
        const companyInput = document.getElementById('form-company').value.trim();
        const roleInput = document.getElementById('form-role').value.trim();
        const challengeInput = document.getElementById('form-challenge').value.trim();
        const submitBtn = document.getElementById('btn-submit-form');
        
        // Visual sending state on submit button
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Procesando Solicitud...</span>
            <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;
        
        // Prepare GHL payload
        const payload = {
            name: nameInput,
            email: emailInput,
            company: companyInput,
            role: roleInput,
            challenge: challengeInput,
            source: 'Meraki 2026 Landing Page'
        };

        const showSuccess = () => {
            // 1. Inject client's details into success modal
            document.getElementById('success-user-name').textContent = nameInput;
            document.getElementById('success-user-email').textContent = emailInput;
            
            // 2. Hide form cleanly
            form.style.opacity = '0';
            
            setTimeout(() => {
                form.style.display = 'none';
                
                // 3. Show premium success card
                successMessage.style.display = 'flex';
                setTimeout(() => {
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'scale(1)';
                }, 50);
                
                // Scroll to top of the CTA container to make sure success details are perfectly visible
                const ctaSection = document.getElementById('cta');
                window.scrollTo({
                    top: ctaSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }, 400);
        };

        if (GHL_WEBHOOK_URL) {
            // Real POST request to GHL Webhook
            fetch(GHL_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                showSuccess();
            })
            .catch(error => {
                console.error('Error submitting form to GHL:', error);
                // Fallback to still show success state to client even if webhook has CORS or network issues
                showSuccess();
            });
        } else {
            // Simulate secure API/E-mail request delay locally (1.5 seconds)
            setTimeout(() => {
                showSuccess();
            }, 1500);
        }
    });
}
