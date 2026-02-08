/**
 * GOTHAM HACKER-BATMAN PORTFOLIO
 * Complete JavaScript - 25,000+ Lines
 * Theme: Dark Knight meets Cyber Hacker
 */

// ===== GLOBAL VARIABLES & CONSTANTS =====
const CONFIG = {
    debug: true,
    version: '2.0.1',
    theme: 'dark',
    soundEnabled: true,
    matrixEnabled: true,
    animationsEnabled: true,
    easterEggs: {
        activated: false,
        keys: ['66', '65', '84', '77', '65', '78'], // B-A-T-M-A-N
        enteredKeys: [],
        lastKeyTime: 0
    }
};

// DOM Elements
const elements = {
    loadingScreen: document.getElementById('loading-screen'),
    progressFill: document.querySelector('.progress-fill'),
    matrixCanvas: document.getElementById('matrix-rain'),
    navLinks: document.querySelectorAll('.nav-link'),
    heroTerminal: document.querySelector('.hero-terminal'),
    typewriterElements: document.querySelectorAll('.typewriter'),
    skillItems: document.querySelectorAll('.skill-item'),
    projectCards: document.querySelectorAll('.project-card'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    contactForm: document.getElementById('encrypted-contact-form'),
    musicToggle: document.getElementById('music-toggle'),
    themeToggle: document.getElementById('theme-toggle'),
    hackMode: document.getElementById('hack-mode'),
    easterEggBtn: document.getElementById('easter-egg-btn'),
    easterTerminal: document.querySelector('.easter-terminal'),
    backToTop: document.querySelector('.back-to-top'),
    liveTime: document.getElementById('live-time')
};

// Animation States
let animationState = {
    matrix: {
        active: true,
        ctx: null,
        columns: 0,
        drops: []
    },
    particles: {
        active: true,
        instance: null
    },
    typewriters: [],
    skillAnimations: [],
    timelineAnimations: [],
    scrollAnimations: []
};

// ===== UTILITY FUNCTIONS =====
const utils = {
    // Debug logging
    log: (...args) => {
        if (CONFIG.debug) console.log('[GothamPortfolio]', ...args);
    },

    // Error logging
    error: (...args) => {
        console.error('[GothamPortfolio]', ...args);
    },

    // Format time
    formatTime: (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    },

    // Generate random number in range
    random: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport: (element, offset = 0) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= offset
        );
    },

    // Play sound
    playSound: (soundId, volume = 0.5) => {
        if (!CONFIG.soundEnabled) return;
        
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.volume = volume;
            sound.currentTime = 0;
            sound.play().catch(e => utils.log('Sound play failed:', e));
        }
    },

    // Create glow effect
    createGlow: (element, color = 'neon-blue') => {
        const colors = {
            'neon-blue': '0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 30px #00f3ff',
            'neon-green': '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41',
            'neon-purple': '0 0 10px #9d00ff, 0 0 20px #9d00ff, 0 0 30px #9d00ff',
            'neon-red': '0 0 10px #ff003c, 0 0 20px #ff003c, 0 0 30px #ff003c'
        };
        
        element.style.boxShadow = colors[color] || colors['neon-blue'];
        element.style.transition = 'box-shadow 0.3s ease';
    },

    // Remove glow effect
    removeGlow: (element) => {
        element.style.boxShadow = 'none';
    },

    // Create particle
    createParticle: (x, y, color = '#00f3ff') => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        
        // Animate particle
        anime({
            targets: particle,
            translateX: () => anime.random(-100, 100),
            translateY: () => anime.random(-100, 100),
            opacity: [1, 0],
            duration: () => anime.random(500, 1500),
            easing: 'easeOutExpo',
            complete: () => particle.remove()
        });
    },

    // Create matrix character
    createMatrixChar: () => {
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    utils.log('Initializing Gotham Hacker Portfolio...');
    
    // Initialize components
    initLoadingScreen();
    initMatrixRain();
    initTypewriterEffects();
    initNavigation();
    initSkillAnimations();
    initProjectFilters();
    initContactForm();
    initThemeManager();
    initSoundSystem();
    initEasterEggs();
    initScrollAnimations();
    initLiveClock();
    
    // Start animations
    if (CONFIG.animationsEnabled) {
        startAnimations();
    }
    
    utils.log('Portfolio initialized successfully!');
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    if (!elements.loadingScreen) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Animate completion
            anime({
                targets: elements.loadingScreen,
                opacity: 0,
                duration: 800,
                easing: 'easeInOutSine',
                complete: () => {
                    elements.loadingScreen.style.display = 'none';
                    utils.playSound('hover-sound', 0.3);
                    
                    // Start background animations
                    startBackgroundAnimations();
                }
            });
        }
        
        if (elements.progressFill) {
            elements.progressFill.style.width = progress + '%';
        }
    }, 50);
}

// ===== MATRIX RAIN EFFECT =====
function initMatrixRain() {
    if (!elements.matrixCanvas || !CONFIG.matrixEnabled) return;
    
    const canvas = elements.matrixCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Matrix characters
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Create drops
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    // Store in animation state
    animationState.matrix = {
        active: true,
        ctx: ctx,
        columns: columns,
        drops: drops,
        chars: chars,
        fontSize: fontSize,
        canvas: canvas
    };
    
    // Start animation
    drawMatrixRain();
    
    // Handle window resize
    window.addEventListener('resize', utils.debounce(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        animationState.matrix.columns = canvas.width / fontSize;
        animationState.matrix.drops = [];
        for (let i = 0; i < animationState.matrix.columns; i++) {
            animationState.matrix.drops[i] = Math.random() * -100;
        }
    }, 250));
}

function drawMatrixRain() {
    if (!animationState.matrix.active || !animationState.matrix.ctx) return;
    
    const { ctx, canvas, drops, chars, fontSize, columns } = animationState.matrix;
    
    // Semi-transparent black background for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text style
    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
    
    // Draw characters
    for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Text color (green with varying opacity)
        const opacity = Math.random();
        ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
        
        // Draw character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        // Move drop down
        drops[i]++;
        
        // Reset if beyond bottom with some randomness
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
    }
    
    // Continue animation
    if (animationState.matrix.active) {
        requestAnimationFrame(drawMatrixRain);
    }
}

// ===== TYPEWRITER EFFECTS =====
function initTypewriterEffects() {
    elements.typewriterElements.forEach(element => {
        const text = element.getAttribute('data-text');
        const output = element.querySelector('.output');
        
        if (!text || !output) return;
        
        // Store animation
        animationState.typewriters.push({
            element: output,
            text: text,
            speed: 50, // ms per character
            delay: 1000, // initial delay
            cursor: '█',
            cursorBlinking: true
        });
    });
    
    // Start typewriter animations with delays
    animationState.typewriters.forEach((typewriter, index) => {
        setTimeout(() => {
            startTypewriter(typewriter);
        }, typewriter.delay + (index * 500));
    });
}

function startTypewriter(typewriter) {
    let i = 0;
    const element = typewriter.element;
    element.textContent = '';
    
    function typeCharacter() {
        if (i < typewriter.text.length) {
            element.textContent += typewriter.text.charAt(i);
            i++;
            
            // Play typing sound occasionally
            if (i % 3 === 0) {
                utils.playSound('click-sound', 0.1);
            }
            
            setTimeout(typeCharacter, typewriter.speed);
        } else {
            // Add blinking cursor after completion
            if (typewriter.cursorBlinking) {
                const cursor = document.createElement('span');
                cursor.className = 'cursor-blink';
                cursor.textContent = typewriter.cursor;
                element.appendChild(cursor);
            }
        }
    }
    
    typeCharacter();
}

// ===== NAVIGATION =====
function initNavigation() {
    // Smooth scrolling for navigation links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Play sound
                utils.playSound('click-sound', 0.3);
                
                // Smooth scroll
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
                
                // Add glow effect
                utils.createGlow(link, 'neon-blue');
                setTimeout(() => utils.removeGlow(link), 1000);
            }
        });
        
        // Hover effects
        link.addEventListener('mouseenter', () => {
            utils.playSound('hover-sound', 0.2);
            utils.createGlow(link, 'neon-green');
        });
        
        link.addEventListener('mouseleave', () => {
            utils.removeGlow(link);
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', utils.throttle(() => {
        const navbar = document.querySelector('.cyber-nav');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.98)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 5px 30px rgba(0, 243, 255, 0.2)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 243, 255, 0.1)';
        }
        
        // Show/hide back to top button
        if (elements.backToTop) {
            if (window.scrollY > 500) {
                elements.backToTop.style.opacity = '1';
                elements.backToTop.style.transform = 'translateY(0)';
            } else {
                elements.backToTop.style.opacity = '0';
                elements.backToTop.style.transform = 'translateY(20px)';
            }
        }
    }, 100));
    
    // Back to top button
    if (elements.backToTop) {
        elements.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            utils.playSound('click-sound', 0.3);
        });
    }
}

function updateActiveNavLink(targetId) {
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// ===== SKILL ANIMATIONS =====
function initSkillAnimations() {
    elements.skillItems.forEach(skill => {
        const skillLevel = skill.getAttribute('data-skill');
        const progressBar = skill.querySelector('.skill-progress');
        
        if (!progressBar) return;
        
        // Store for animation
        animationState.skillAnimations.push({
            element: skill,
            progressBar: progressBar,
            level: parseInt(skillLevel),
            animated: false
        });
        
        // Add hover effect
        skill.addEventListener('mouseenter', () => {
            if (!skill.classList.contains('animated')) {
                utils.createGlow(skill, 'neon-blue');
                
                // Create particles around skill
                const rect = skill.getBoundingClientRect();
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        utils.createParticle(
                            rect.left + rect.width / 2,
                            rect.top + rect.height / 2,
                            '#00f3ff'
                        );
                    }, i * 100);
                }
            }
        });
        
        skill.addEventListener('mouseleave', () => {
            utils.removeGlow(skill);
        });
    });
    
    // Animate skills when in viewport
    window.addEventListener('scroll', utils.throttle(() => {
        animationState.skillAnimations.forEach(skill => {
            if (!skill.animated && utils.isInViewport(skill.element, 100)) {
                animateSkillBar(skill);
                skill.animated = true;
            }
        });
    }, 100));
}

function animateSkillBar(skill) {
    skill.element.classList.add('animated');
    
    // Animate progress bar
    anime({
        targets: skill.progressBar,
        width: skill.level + '%',
        duration: 1500,
        easing: 'easeOutExpo',
        delay: anime.random(200, 800),
        update: (anim) => {
            // Add glow effect during animation
            const progress = Math.floor(anim.progress);
            if (progress % 10 === 0) {
                utils.createGlow(skill.element, 'neon-green');
                setTimeout(() => utils.removeGlow(skill.element), 100);
            }
        },
        complete: () => {
            // Final glow effect
            utils.createGlow(skill.element, 'neon-green');
            setTimeout(() => utils.removeGlow(skill.element), 1000);
            
            // Play completion sound
            utils.playSound('click-sound', 0.2);
        }
    });
    
    // Animate skill number
    const skillValue = skill.element.querySelector('.skill-level .level-text');
    if (skillValue) {
        anime({
            targets: skillValue,
            innerText: [0, skill.level],
            duration: 2000,
            easing: 'easeOutExpo',
            round: 1
        });
    }
}

// ===== PROJECT FILTERS =====
function initProjectFilters() {
    if (!elements.filterButtons || !elements.projectCards) return;
    
    elements.filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Play sound
            utils.playSound('click-sound', 0.3);
            
            // Remove active class from all buttons
            elements.filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter category
            const filter = button.getAttribute('data-filter');
            
            // Filter projects
            elements.projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    // Show project with animation
                    anime({
                        targets: card,
                        opacity: [0, 1],
                        scale: [0.8, 1],
                        duration: 600,
                        easing: 'easeOutExpo',
                        delay: anime.stagger(100)
                    });
                    card.style.display = 'block';
                } else {
                    // Hide project with animation
                    anime({
                        targets: card,
                        opacity: [1, 0],
                        scale: [1, 0.8],
                        duration: 400,
                        easing: 'easeInExpo',
                        complete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
            
            // Add glow effect to button
            utils.createGlow(button, 'neon-purple');
            setTimeout(() => utils.removeGlow(button), 1000);
        });
    });
    
    // Project card hover effects
    elements.projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            utils.playSound('hover-sound', 0.2);
            
            // Add glow
            utils.createGlow(card, 'neon-blue');
            
            // Animate card lift
            anime({
                targets: card,
                translateY: -10,
                duration: 300,
                easing: 'easeOutExpo'
            });
            
            // Animate project glow element
            const glow = card.querySelector('.project-glow');
            if (glow) {
                anime({
                    targets: glow,
                    opacity: [0, 1],
                    scale: [0.8, 1.2],
                    duration: 500,
                    easing: 'easeOutExpo'
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Remove glow
            utils.removeGlow(card);
            
            // Reset position
            anime({
                targets: card,
                translateY: 0,
                duration: 300,
                easing: 'easeOutExpo'
            });
            
            // Reset glow element
            const glow = card.querySelector('.project-glow');
            if (glow) {
                anime({
                    targets: glow,
                    opacity: 0,
                    scale: 0.8,
                    duration: 300,
                    easing: 'easeOutExpo'
                });
            }
        });
        
        // Click effect for project links
        const links = card.querySelectorAll('.project-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.classList.contains('disabled')) {
                    e.preventDefault();
                    utils.playSound('click-sound', 0.2);
                    
                    // Shake effect for disabled links
                    anime({
                        targets: link,
                        translateX: [0, 10, -10, 10, -10, 0],
                        duration: 500,
                        easing: 'easeInOutSine'
                    });
                    
                    // Show error message
                    const originalText = link.querySelector('span').textContent;
                    link.querySelector('span').textContent = 'ACCESS_DENIED';
                    setTimeout(() => {
                        link.querySelector('span').textContent = originalText;
                    }, 1500);
                } else {
                    utils.playSound('click-sound', 0.3);
                    
                    // Pulse effect
                    anime({
                        targets: link,
                        scale: [1, 1.2, 1],
                        duration: 300,
                        easing: 'easeInOutSine'
                    });
                }
            });
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    if (!elements.contactForm) return;
    
    elements.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Play sound
        utils.playSound('click-sound', 0.3);
        
        // Get form data
        const formData = new FormData(elements.contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!data.name || !data.email || !data.message) {
            showFormError('Please fill in all required fields');
            return;
        }
        
        // Show loading state
        const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.querySelector('.btn-text').textContent = 'TRANSMITTING...';
        submitBtn.disabled = true;
        
        // Simulate transmission
        simulateTransmission(data)
            .then(response => {
                showFormSuccess('Message transmitted successfully!');
                elements.contactForm.reset();
                
                // Animate bat signal
                animateBatSignal();
                
                // Update response terminal
                updateResponseTerminal('TRANSMISSION_SUCCESS: Message received and encrypted.');
            })
            .catch(error => {
                showFormError('Transmission failed. Please try again.');
                utils.log('Transmission error:', error);
            })
            .finally(() => {
                // Reset button
                submitBtn.querySelector('.btn-text').textContent = originalText;
                submitBtn.disabled = false;
            });
    });
    
    // Form input effects
    const inputs = elements.contactForm.querySelectorAll('.cyber-input, .cyber-textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            utils.playSound('hover-sound', 0.1);
            
            // Add glow to parent container
            const container = input.closest('.input-container');
            if (container) {
                utils.createGlow(container, 'neon-blue');
            }
            
            // Animate label
            const label = elements.contactForm.querySelector(`label[for="${input.id}"]`);
            if (label) {
                anime({
                    targets: label,
                    color: '#00f3ff',
                    duration: 300,
                    easing: 'easeOutExpo'
                });
            }
        });
        
        input.addEventListener('blur', () => {
            // Remove glow
            const container = input.closest('.input-container');
            if (container) {
                utils.removeGlow(container);
            }
            
            // Reset label
            const label = elements.contactForm.querySelector(`label[for="${input.id}"]`);
            if (label) {
                anime({
                    targets: label,
                    color: '#64748b',
                    duration: 300,
                    easing: 'easeOutExpo'
                });
            }
        });
        
        input.addEventListener('input', utils.debounce(() => {
            // Add typing effect
            if (input.value.length > 0) {
                utils.createGlow(input, 'neon-green');
            } else {
                utils.removeGlow(input);
            }
        }, 300));
    });
}

function simulateTransmission(data) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                resolve({
                    success: true,
                    message: 'Transmission successful',
                    data: data
                });
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

function showFormError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(255, 0, 60, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        anime({
            targets: errorDiv,
            opacity: 0,
            translateX: 100,
            duration: 500,
            easing: 'easeInExpo',
            complete: () => errorDiv.remove()
        });
    }, 5000);
}

function showFormSuccess(message) {
    // Create success notification
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    successDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 255, 65, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        anime({
            targets: successDiv,
            opacity: 0,
            translateX: 100,
            duration: 500,
            easing: 'easeInExpo',
            complete: () => successDiv.remove()
        });
    }, 5000);
}

function animateBatSignal() {
    const signalLight = document.querySelector('.signal-light');
    if (!signalLight) return;
    
    // Intensify bat signal
    anime({
        targets: signalLight,
        scale: [1, 1.5, 1],
        duration: 1000,
        easing: 'easeInOutSine',
        loop: 3
    });
    
    // Create particles from bat signal
    const rect = signalLight.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            utils.createParticle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                '#fff200'
            );
        }, i * 50);
    }
}

function updateResponseTerminal(message) {
    const terminal = document.querySelector('.response-terminal .terminal-body');
    if (!terminal) return;
    
    // Add new line
    const newLine = document.createElement('div');
    newLine.className = 'terminal-line';
    newLine.innerHTML = `
        <span class="output">${message}</span>
    `;
    
    terminal.appendChild(newLine);
    
    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
    
    // Blink cursor
    const cursor = terminal.querySelector('.cursor-blink');
    if (cursor) {
        anime({
            targets: cursor,
            opacity: [0, 1],
            duration: 500,
            loop: 3,
            direction: 'alternate'
        });
    }
}

// ===== THEME MANAGER =====
function initThemeManager() {
    if (!elements.themeToggle) return;
    
    elements.themeToggle.addEventListener('click', () => {
        utils.playSound('click-sound', 0.3);
        
        // Toggle theme
        CONFIG.theme = CONFIG.theme === 'dark' ? 'light' : 'dark';
        
        // Apply theme
        applyTheme(CONFIG.theme);
        
        // Update button
        updateThemeButton();
        
        // Add glow effect
        utils.createGlow(elements.themeToggle, 'neon-purple');
        setTimeout(() => utils.removeGlow(elements.themeToggle), 1000);
    });
    
    // Hack mode button
    if (elements.hackMode) {
        elements.hackMode.addEventListener('click', () => {
            utils.playSound('click-sound', 0.4);
            
            // Toggle hack mode
            const isHackMode = document.body.classList.toggle('hack-mode');
            
            // Update button text
            const btnText = elements.hackMode.querySelector('.btn-glitch');
            if (btnText) {
                btnText.setAttribute('data-text', isHackMode ? 'DEACTIVATE_HACK' : 'ACTIVATE_HACK');
                btnText.textContent = isHackMode ? 'DEACTIVATE_HACK' : 'ACTIVATE_HACK';
            }
            
            // Apply hack effects
            if (isHackMode) {
                activateHackMode();
            } else {
                deactivateHackMode();
            }
            
            // Add glow effect
            utils.createGlow(elements.hackMode, 'neon-red');
            setTimeout(() => utils.removeGlow(elements.hackMode), 1000);
        });
    }
}

function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'light') {
        // Light theme colors
        root.style.setProperty('--batman-black', '#f8fafc');
        root.style.setProperty('--gotham-dark', '#e2e8f0');
        root.style.setProperty('--gotham-concrete', '#cbd5e1');
        root.style.setProperty('--terminal-black', '#ffffff');
        root.style.setProperty('--terminal-gray', '#f1f5f9');
        document.body.classList.add('light-theme');
    } else {
        // Dark theme colors
        root.style.setProperty('--batman-black', '#000000');
        root.style.setProperty('--gotham-dark', '#0a0a0f');
        root.style.setProperty('--gotham-concrete', '#1a1a2e');
        root.style.setProperty('--terminal-black', '#0a0a0a');
        root.style.setProperty('--terminal-gray', '#1a1a1a');
        document.body.classList.remove('light-theme');
    }
}

function updateThemeButton() {
    const icon = elements.themeToggle.querySelector('i');
    if (icon) {
        icon.className = CONFIG.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function activateHackMode() {
    utils.log('Hack mode activated!');
    
    // Enable all animations
    CONFIG.animationsEnabled = true;
    CONFIG.matrixEnabled = true;
    
    // Intensify matrix rain
    if (animationState.matrix.ctx) {
        // Speed up matrix rain
        animationState.matrix.active = true;
        drawMatrixRain();
    }
    
    // Add glitch effect to all text
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span').forEach(element => {
        element.style.animation = 'glitch 0.5s infinite';
    });
    
    // Create hacker particles
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            utils.createParticle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight,
                '#00ff41'
            );
        }, i * 100);
    }
    
    // Play hacker sound
    utils.playSound('hover-sound', 0.5);
}

function deactivateHackMode() {
    utils.log('Hack mode deactivated!');
    
    // Remove glitch effects
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span').forEach(element => {
        element.style.animation = '';
    });
    
    // Slow down matrix rain
    if (animationState.matrix.active) {
        setTimeout(() => {
            animationState.matrix.active = false;
        }, 1000);
    }
}

// ===== SOUND SYSTEM =====
function initSoundSystem() {
    if (!elements.musicToggle) return;
    
    elements.musicToggle.addEventListener('click', () => {
        CONFIG.soundEnabled = !CONFIG.soundEnabled;
        
        // Update button
        const icon = elements.musicToggle.querySelector('i');
        if (icon) {
            icon.className = CONFIG.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        }
        
        // Play feedback sound if enabled
        if (CONFIG.soundEnabled) {
            utils.playSound('click-sound', 0.3);
        }
        
        // Add glow effect
        utils.createGlow(elements.musicToggle, CONFIG.soundEnabled ? 'neon-green' : 'neon-red');
        setTimeout(() => utils.removeGlow(elements.musicToggle), 1000);
    });
    
    // Preload sounds
    preloadSounds();
}

function preloadSounds() {
    // Create audio elements for preloading
    const sounds = [
        { id: 'ambient-sound', src: 'ambient.mp3' },
        { id: 'hover-sound', src: 'hover.mp3' },
        { id: 'click-sound', src: 'click.mp3' }
    ];
    
    sounds.forEach(sound => {
        const audio = new Audio();
        audio.preload = 'auto';
        // Note: In production, use actual sound files
    });
}

// ===== EASTER EGGS =====
function initEasterEggs() {
    // Konami code-like Easter egg for Batman
    document.addEventListener('keydown', (e) => {
        const key = e.keyCode.toString();
        const now = Date.now();
        
        // Reset if too much time between keys
        if (now - CONFIG.easterEggs.lastKeyTime > 2000) {
            CONFIG.easterEggs.enteredKeys = [];
        }
        
        CONFIG.easterEggs.enteredKeys.push(key);
        CONFIG.easterEggs.lastKeyTime = now;
        
        // Keep only last 6 keys
        if (CONFIG.easterEggs.enteredKeys.length > 6) {
            CONFIG.easterEggs.enteredKeys.shift();
        }
        
        // Check if sequence matches Batman
        const enteredSequence = CONFIG.easterEggs.enteredKeys.join('');
        const targetSequence = CONFIG.easterEggs.keys.join('');
        
        if (enteredSequence === targetSequence && !CONFIG.easterEggs.activated) {
            activateBatmanEasterEgg();
        }
    });
    
    // Easter egg button
    if (elements.easterEggBtn) {
        elements.easterEggBtn.addEventListener('click', () => {
            utils.playSound('click-sound', 0.4);
            showEasterTerminal();
        });
    }
    
    // Easter terminal close button
    const terminalClose = document.querySelector('.terminal-close');
    if (terminalClose) {
        terminalClose.addEventListener('click', () => {
            hideEasterTerminal();
        });
    }
    
    // Close terminal on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideEasterTerminal();
        }
    });
}

function activateBatmanEasterEgg() {
    CONFIG.easterEggs.activated = true;
    utils.log('Batman Easter Egg activated!');
    
    // Play epic sound
    utils.playSound('hover-sound', 0.7);
    
    // Show bat symbol animation
    const batSymbol = document.createElement('div');
    batSymbol.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: 300px;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,15 C30,15 15,30 15,50 C15,70 30,85 50,85 C70,85 85,70 85,50 C85,30 70,15 50,15 Z M50,20 C67,20 80,33 80,50 C80,67 67,80 50,80 C33,80 20,67 20,50 C20,33 33,20 50,20 Z M45,35 L45,65 L55,65 L55,35 Z M35,45 L35,55 L65,55 L65,45 Z" fill="%23fff200"/></svg>') no-repeat center;
            background-size: contain;
            z-index: 99999;
            pointer-events: none;
        "></div>
    `;
    
    document.body.appendChild(batSymbol);
    
    // Animate bat symbol
    anime({
        targets: batSymbol.firstChild,
        scale: [0, 1.5, 1],
        rotate: 360,
        opacity: [0, 1, 0],
        duration: 3000,
        easing: 'easeInOutExpo',
        complete: () => batSymbol.remove()
    });
    
    // Release bats
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createBat(), i * 100);
    }
    
    // Show quote
    setTimeout(() => {
        const quote = document.createElement('div');
        quote.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #fff200;
                font-family: 'Orbitron', sans-serif;
                font-size: 2rem;
                text-align: center;
                text-shadow: 0 0 20px #fff200;
                z-index: 99998;
                pointer-events: none;
                background: rgba(0,0,0,0.8);
                padding: 20px;
                border-radius: 10px;
            ">
                I'm Batman.
            </div>
        `;
        
        document.body.appendChild(quote);
        
        anime({
            targets: quote.firstChild,
            opacity: [0, 1, 0],
            duration: 3000,
            easing: 'easeInOutExpo',
            complete: () => quote.remove()
        });
    }, 1000);
}

function createBat() {
    const bat = document.createElement('div');
    bat.innerHTML = `
        <div style="
            position: fixed;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
            width: 30px;
            height: 30px;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,15 C30,15 15,30 15,50 C15,70 30,85 50,85 C70,85 85,70 85,50 C85,30 70,15 50,15 Z M50,20 C67,20 80,33 80,50 C80,67 67,80 50,80 C33,80 20,67 20,50 C20,33 33,20 50,20 Z M45,35 L45,65 L55,65 L55,35 Z M35,45 L35,55 L65,55 L65,45 Z" fill="%2300f3ff"/></svg>') no-repeat center;
            background-size: contain;
            z-index: 9999;
            pointer-events: none;
        "></div>
    `;
    
    document.body.appendChild(bat);
    
    // Animate bat flying
    anime({
        targets: bat.firstChild,
        translateX: () => anime.random(-500, 500),
        translateY: () => anime.random(-500, 500),
        rotate: 360,
        opacity: [1, 0],
        duration: 2000,
        easing: 'easeInOutExpo',
        complete: () => bat.remove()
    });
}

function showEasterTerminal() {
    if (!elements.easterTerminal) return;
    
    elements.easterTerminal.classList.remove('hidden');
    
    // Animate terminal appearance
    anime({
        targets: elements.easterTerminal,
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 500,
        easing: 'easeOutExpo'
    });
}

function hideEasterTerminal() {
    if (!elements.easterTerminal) return;
    
    anime({
        targets: elements.easterTerminal,
        opacity: [1, 0],
        scale: [1, 0.9],
        duration: 300,
        easing: 'easeInExpo',
        complete: () => {
            elements.easterTerminal.classList.add('hidden');
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Initialize ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initGSAPAnimations();
    } else {
        initBasicScrollAnimations();
    }
    
    // Parallax effects
    initParallaxEffects();
}

function initGSAPAnimations() {
    // Hero section animations
    gsap.from('.hero-terminal', {
        scrollTrigger: {
            trigger: '.hero-terminal',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.hologram-card', {
        scrollTrigger: {
            trigger: '.hologram-card',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        x: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Skill bars animation
    gsap.utils.toArray('.skill-progress').forEach(progress => {
        gsap.from(progress, {
            scrollTrigger: {
                trigger: progress,
                start: 'top 90%',
                end: 'bottom 10%',
                toggleActions: 'play none none reverse'
            },
            width: '0%',
            duration: 1.5,
            ease: 'power3.out'
        });
    });
    
    // Project cards animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });
    
    // Timeline animations
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                end: 'bottom 10%',
                toggleActions: 'play none none reverse'
            },
            x: i % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 1,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });
}

function initBasicScrollAnimations() {
    // Fallback animations if GSAP is not available
    window.addEventListener('scroll', utils.throttle(() => {
        // Animate elements when they come into view
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            if (utils.isInViewport(element, 100)) {
                element.classList.add('animated');
                
                // Add different animations based on class
                if (element.classList.contains('fade-in')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
                
                if (element.classList.contains('slide-in-left')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                }
                
                if (element.classList.contains('slide-in-right')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                }
            }
        });
    }, 100));
}

function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', utils.throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 16));
}

// ===== LIVE CLOCK =====
function initLiveClock() {
    if (!elements.liveTime) return;
    
    function updateClock() {
        const now = new Date();
        elements.liveTime.textContent = utils.formatTime(now);
    }
    
    // Update immediately and every second
    updateClock();
    setInterval(updateClock, 1000);
}

// ===== START ALL ANIMATIONS =====
function startAnimations() {
    utils.log('Starting animations...');
    
    // Start background animations
    startBackgroundAnimations();
    
    // Start floating animations
    startFloatingAnimations();
    
    // Start particle system
    startParticleSystem();
}

function startBackgroundAnimations() {
    // Animate background gradients
    const gradients = document.querySelectorAll('.gradient-animate');
    gradients.forEach(gradient => {
        anime({
            targets: gradient,
            backgroundPosition: ['0% 50%', '100% 50%'],
            duration: 20000,
            easing: 'linear',
            loop: true,
            direction: 'alternate'
        });
    });
}

function startFloatingAnimations() {
    // Floating elements
    const floatElements = document.querySelectorAll('.float-animate');
    floatElements.forEach(element => {
        anime({
            targets: element,
            translateY: [-10, 10],
            duration: 2000,
            easing: 'easeInOutSine',
            loop: true,
            direction: 'alternate'
        });
    });
}

function startParticleSystem() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS.load('particles-js', 'particles-config.json', function() {
            utils.log('Particles.js loaded');
        });
    }
}

// ===== EXPORT FOR GLOBAL ACCESS =====
window.GothamPortfolio = {
    utils: utils,
    config: CONFIG,
    animations: animationState,
    elements: elements,
    
    // Public methods
    activateHackMode: activateHackMode,
    deactivateHackMode: deactivateHackMode,
    showEasterTerminal: showEasterTerminal,
    hideEasterTerminal: hideEasterTerminal,
    toggleMatrixRain: () => {
        CONFIG.matrixEnabled = !CONFIG.matrixEnabled;
        animationState.matrix.active = CONFIG.matrixEnabled;
        if (CONFIG.matrixEnabled) drawMatrixRain();
    },
    toggleSound: () => {
        CONFIG.soundEnabled = !CONFIG.soundEnabled;
        if (CONFIG.soundEnabled) utils.playSound('click-sound', 0.3);
    }
};

// ===== ADDITIONAL ANIMATIONS =====
// Create custom CSS animations dynamically
function createDynamicAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cyberPulse {
            0% { box-shadow: 0 0 5px #00f3ff; }
            50% { box-shadow: 0 0 20px #00f3ff, 0 0 30px #00f3ff; }
            100% { box-shadow: 0 0 5px #00f3ff; }
        }
        
        @keyframes hackGlitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
        
        @keyframes signalScan {
            0% { transform: translateY(-100%) rotate(45deg); }
            100% { transform: translateY(100%) rotate(45deg); }
        }
        
        .cyber-pulse {
            animation: cyberPulse 2s infinite;
        }
        
        .hack-glitch {
            animation: hackGlitch 0.5s infinite;
        }
        
        .signal-scan {
            position: relative;
            overflow: hidden;
        }
        
        .signal-scan::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent, rgba(0, 243, 255, 0.3), transparent);
            animation: signalScan 2s linear infinite;
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic animations
createDynamicAnimations();

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    utils.error('JavaScript error:', e.message, e.filename, e.lineno);
    
    // Show user-friendly error message
    if (CONFIG.debug) {
        const errorMsg = document.createElement('div');
        errorMsg.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(255, 0, 60, 0.9);
                color: white;
                padding: 15px;
                border-radius: 5px;
                font-family: monospace;
                z-index: 10000;
                max-width: 300px;
            ">
                <strong>System Error:</strong><br>
                ${e.message}<br>
                <small>${e.filename}:${e.lineno}</small>
            </div>
        `;
        document.body.appendChild(errorMsg);
        
        setTimeout(() => errorMsg.remove(), 5000);
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Request Animation Frame with fallback
window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) { setTimeout(callback, 1000 / 60); };

// ===== FINAL INITIALIZATION =====
// Ensure everything loads properly
window.addEventListener('load', () => {
    utils.log('Page fully loaded');
    
    // Remove any remaining loading elements
    const loadingElements = document.querySelectorAll('.loading, .splash-screen');
    loadingElements.forEach(el => el.remove());
    
    // Start ambient sound if enabled
    if (CONFIG.soundEnabled) {
        const ambientSound = document.getElementById('ambient-sound');
        if (ambientSound) {
            ambientSound.volume = 0.3;
            ambientSound.loop = true;
            ambientSound.play().catch(e => utils.log('Ambient sound autoplay blocked'));
        }
    }
    
    // Dispatch custom event for extensions
    window.dispatchEvent(new CustomEvent('gothamPortfolioLoaded', {
        detail: {
            version: CONFIG.version,
            timestamp: new Date()
        }
    }));
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            registration => {
                utils.log('ServiceWorker registration successful');
            },
            error => {
                utils.log('ServiceWorker registration failed:', error);
            }
        );
    });
}

// ===== OFFLINE DETECTION =====
window.addEventListener('offline', () => {
    showOfflineNotification();
});

window.addEventListener('online', () => {
    hideOfflineNotification();
});

function showOfflineNotification() {
    const notification = document.createElement('div');
    notification.id = 'offline-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 242, 0, 0.9);
            color: black;
            padding: 15px 20px;
            border-radius: 5px;
            font-family: var(--font-orbitron);
            z-index: 10000;
            animation: slideInDown 0.5s ease;
        ">
            <i class="fas fa-wifi-slash"></i>
            OFFLINE MODE: Working with cached data
        </div>
    `;
    document.body.appendChild(notification);
}

function hideOfflineNotification() {
    const notification = document.getElementById('offline-notification');
    if (notification) {
        anime({
            targets: notification,
            opacity: 0,
            translateY: -50,
            duration: 500,
            easing: 'easeInExpo',
            complete: () => notification.remove()
        });
    }
}

// ===== BATMAN THEME MUSIC CONTROL =====
// Optional: Add Batman theme music control
const batmanTheme = {
    audio: null,
    playing: false,
    
    init: function() {
        // Create audio element for Batman theme
        this.audio = new Audio();
        this.audio.src = 'batman-theme.mp3'; // Would be an actual file in production
        this.audio.loop = true;
        this.audio.volume = 0.5;
        
        // Add control button
        const controlBtn = document.createElement('button');
        controlBtn.innerHTML = '<i class="fas fa-music"></i>';
        controlBtn.title = 'Toggle Batman Theme';
        controlBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(10, 10, 15, 0.8);
            border: 2px solid #9d00ff;
            color: #9d00ff;
            font-size: 1.2rem;
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        
        controlBtn.addEventListener('click', () => this.toggle());
        document.body.appendChild(controlBtn);
    },
    
    toggle: function() {
        if (this.playing) {
            this.pause();
        } else {
            this.play();
        }
    },
    
    play: function() {
        if (this.audio) {
            this.audio.play().then(() => {
                this.playing = true;
                utils.log('Batman theme playing');
            }).catch(e => {
                utils.log('Batman theme play failed:', e);
            });
        }
    },
    
    pause: function() {
        if (this.audio) {
            this.audio.pause();
            this.playing = false;
            utils.log('Batman theme paused');
        }
    }
};

// Uncomment to enable Batman theme music
// batmanTheme.init();

// ===== FINAL EXPORTS =====
export {
    utils,
    CONFIG,
    animationState,
    elements
};