// GSAP Registration
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Global Variables
let tl = gsap.timeline();
let isLoading = true;

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const themeBtn = document.getElementById('theme-btn');
const backToTopBtn = document.getElementById('back-to-top');

// Navigation
function initializeNavigation() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add click event to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID from the href
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate the position to scroll to
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Scroll to the target position
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu functionality
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Initialize App
window.addEventListener('load', function() {
    try {
        initializeTheme();
        initializeLoading();
        initializeNavigation();
        initializeScrollEffects();
        initializeAnimations();
        initializeForms();
        initializeParticleEffects();
        initializeHeroAnimations();
    } catch (error) {
        console.warn('Initialization error:', error);
    }
});

// Loading Animation
function initializeLoading() {
    const loaderBar = document.querySelector('.loader-bar');
    const loaderText = document.querySelector('.loader-text');
    
    gsap.to(loaderBar, {
        width: '100%',
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                    isLoading = false;
                    startMainAnimations();
                }
            });
        }
    });

    gsap.to(loaderText, {
        text: "Loading Complete!",
        duration: 1.5,
        ease: "none",
        delay: 1.5
    });
}

// Main Animations
function startMainAnimations() {
    // Hero animations
    try {
        initializeHeroAnimations();
    } catch (error) {
        console.warn('Hero animations initialization failed:', error);
    }
    
    // Animate all sections
    gsap.utils.toArray('section').forEach((section, index) => {
        // Animate section headers
        const header = section.querySelector('.section-header');
        if (header) {
            gsap.fromTo(header, 
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Animate section content
        const fadeElements = section.querySelectorAll('.fade-in');
        if (fadeElements.length > 0) {
            gsap.fromTo(fadeElements, 
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }
    });
}

// Hero Section Animations
function initializeHeroAnimations() {
    const heroTimeline = gsap.timeline();
    
    // Animate floating shapes
    const floatingShapes = document.querySelector('.floating-shapes');
    if (floatingShapes) {
        gsap.set('.floating-shapes .shape', { scale: 0, rotation: 0 });
        
        heroTimeline
            .to('.floating-shapes .shape', {
                scale: 1,
                rotation: 360,
                duration: 2,
                stagger: 0.2,
                ease: "back.out(1.7)"
            })
            .to('.floating-shapes .shape', {
                y: -20,
                duration: 3,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.3
            }, 0.5);
    }
    
    // Hero text animations
    const titleLines = document.querySelectorAll('.title-line');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroImageContainer = document.querySelector('.hero-image');
    const heroRole = document.querySelector('.hero-role');
    
    if (titleLines.length > 0) {
        gsap.set(titleLines, { y: 100, opacity: 0 });
        gsap.set(heroDescription, { y: 50, opacity: 0 });
        gsap.set(heroButtons, { y: 50, opacity: 0 });
        gsap.set(heroImageContainer, { scale: 0.8, opacity: 0 });
        
        const heroTextTimeline = gsap.timeline({ delay: 0.5 });
        
        heroTextTimeline
            .to(titleLines, {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.3,
                ease: "power3.out"
            })
            .to(heroDescription, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            }, "-=0.5")
            .to(heroButtons, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            }, "-=0.5")
            .to(heroImageContainer, {
                scale: 1,
                opacity: 1,
                duration: 1.5,
                ease: "back.out(1.7)"
            }, "-=1");
    }
    
    // Set static role text
    if (heroRole) {
        heroRole.textContent = 'UI/UX Designer';
    }
    
    // Hero image hover effect
    if (heroImageContainer) {
        heroImageContainer.addEventListener('mouseenter', () => {
            gsap.to(heroImageContainer, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        heroImageContainer.addEventListener('mouseleave', () => {
            gsap.to(heroImageContainer, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Back to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: { y: 0 },
            ease: "power2.inOut"
        });
    });
    
    // Parallax effects
    gsap.utils.toArray('.floating-shapes .shape').forEach(shape => {
        gsap.to(shape, {
            y: -100,
            ease: "none",
            scrollTrigger: {
                trigger: shape,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
    
    // Section animations with ScrollTrigger
    ScrollTrigger.batch('.fade-in', {
        onEnter: elements => {
            gsap.fromTo(elements, 
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
            );
        },
        onLeave: elements => {
            gsap.to(elements, { opacity: 0.3, duration: 0.5 });
        },
        onEnterBack: elements => {
            gsap.to(elements, { opacity: 1, duration: 0.5 });
        }
    });
    
    // Left to right animations
    ScrollTrigger.batch('.fade-in-left', {
        onEnter: elements => {
            gsap.fromTo(elements,
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
            );
        }
    });
    
    // Right to left animations
    ScrollTrigger.batch('.fade-in-right', {
        onEnter: elements => {
            gsap.fromTo(elements,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
            );
        }
    });
    
    // Scale animations
    ScrollTrigger.batch('.scale-in', {
        onEnter: elements => {
            gsap.fromTo(elements,
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 1, stagger: 0.15, ease: "back.out(1.7)" }
            );
        }
    });
}

// Theme Toggle
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.dataset.theme = savedTheme;
    updateThemeButton(savedTheme);
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply theme change immediately
        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });
}

function updateThemeButton(theme) {
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    
    // Simple scale animation
    themeBtn.style.transform = 'scale(0.8)';
    setTimeout(() => {
        themeBtn.style.transform = 'scale(1)';
    }, 100);
}

// Advanced Animations
function initializeAnimations() {
    // Project cards hover animations
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                scale: 1.03,
                duration: 0.4,
                ease: "power2.out"
            });
            
            gsap.to(card.querySelector('.project-image img'), {
                scale: 1.1,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
            
            gsap.to(card.querySelector('.project-image img'), {
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });
    
    // Timeline animation
    ScrollTrigger.create({
        trigger: '.timeline',
        start: 'top 80%',
        onEnter: () => {
            gsap.fromTo('.timeline-item',
                { opacity: 0, x: -50 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 1, 
                    stagger: 0.3,
                    ease: "power3.out"
                }
            );
        }
    });
    
    // Certificate cards animation
    document.querySelectorAll('.certificate-card').forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                scale: 1.05,
                rotation: Math.random() * 4 - 2,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });
    
    // Button hover animations
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                y: -2,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Form field animations
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
        field.addEventListener('focus', () => {
            gsap.to(field, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        field.addEventListener('blur', () => {
            gsap.to(field, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Value items animation
    ScrollTrigger.batch('.value-item', {
        onEnter: elements => {
            gsap.fromTo(elements,
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.6, 
                    stagger: 0.1,
                    ease: "power2.out"
                }
            );
        }
    });
}

// Particle Effects
function initializeParticleEffects() {
    // Create floating particles
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.6;
        `;
        
        document.body.appendChild(particle);
        
        gsap.set(particle, {
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50
        });
        
        gsap.to(particle, {
            y: -50,
            x: `+=${Math.random() * 200 - 100}`,
            duration: Math.random() * 3 + 2,
            ease: "none",
            onComplete: () => particle.remove()
        });
    }
    
    // Create particles periodically
    setInterval(createParticle, 3000);
    
    // Mouse trail effect
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (Math.random() > 0.95) {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: var(--secondary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: -1;
                left: ${mouseX}px;
                top: ${mouseY}px;
            `;
            
            document.body.appendChild(trail);
            
            gsap.to(trail, {
                scale: 0,
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => trail.remove()
            });
        }
    });
}

// Forms
function initializeForms() {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        
        // Animate button
        gsap.to(submitBtn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.textContent = 'Sent! ✓';
            gsap.to(submitBtn, {
                backgroundColor: '#10b981',
                duration: 0.3
            });
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                gsap.to(submitBtn, {
                    backgroundColor: '',
                    duration: 0.3
                });
                contactForm.reset();
            }, 2000);
        }, 1500);
    });
    
    // Form validation animations
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
        field.addEventListener('invalid', () => {
            gsap.fromTo(field,
                { x: -10 },
                { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: "power2.inOut" }
            );
        });
    });
}

// Intersection Observer for performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
    observer.observe(el);
});

// Performance optimizations
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// Preload critical resources
function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
        'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = `${src}?auto=format&fit=crop&w=500&q=80`;
    });
}

preloadImages();

// Error handling
window.addEventListener('error', (e) => {
    console.error('Script error:', e.error);
});

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        try {
            navigator.serviceWorker.register('/new/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(err => {
                    console.warn('ServiceWorker registration failed:', err);
                });
        } catch (error) {
            console.warn('ServiceWorker registration error:', error);
        }
    });
}

console.log('🚀 Portfolio loaded successfully!');

// Smooth Scrolling for Navigation Links and Buttons
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links and buttons that should trigger smooth scrolling
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;
            
            // Calculate the offset to account for fixed navbar
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            // Smooth scroll to the target
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.querySelector('.hamburger').classList.remove('active');
            }
        });
    });
});
