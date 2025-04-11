// Attendez que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const header = document.querySelector('header');
    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    const loader = document.querySelector('.loader');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const heroSection = document.querySelector('.hero');
    
    // Animation de particules pour l'effet "feu" en arrière-plan
    createFireParticles();
    
    // Masquer le loader après le chargement complet de la page
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.style.display = 'none';
            
            // Animation d'entrée pour le logo et le titre principal
            animateHeroElements();
        }, 1500);
    });
    
    // Changement d'état du header au scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Menu burger pour mobile
    burgerMenu.addEventListener('click', function() {
        burgerMenu.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Fermer le menu après avoir cliqué sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            burgerMenu.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // Navigation active basée sur la section visible
    window.addEventListener('scroll', function() {
        let current = '';
        
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Animation des compteurs dans la section "À propos"
    const counters = document.querySelectorAll('.counter');
    
    function animateCounter(counter) {
        const target = +counter.innerText.replace('+', '').replace('/7', '');
        const suffix = counter.innerText.includes('+') ? '+' : (counter.innerText.includes('/7') ? '/7' : '');
        let count = 0;
        const speed = 50;
        const increment = target / speed;
        
        const updateCount = () => {
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count) + suffix;
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target + suffix;
            }
        };
        
        updateCount();
    }
    
    // Ajouter des effets de survol aux cartes de fonctionnalités
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'translateY(-10px)';
            icon.style.color = '#ff0a16';
            icon.style.textShadow = '0 0 20px rgba(255, 10, 22, 0.7)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'translateY(0)';
            icon.style.color = '#e50914';
            icon.style.textShadow = '0 0 10px rgba(229, 9, 20, 0.3)';
        });
    });
    
    // Intersection Observer pour les compteurs
    const aboutSection = document.querySelector('.about');
    
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => animateCounter(counter));
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }
    
    // Lightbox pour la galerie
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');
            
            // Créer la lightbox
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="close-lightbox">&times;</span>
                    <img src="${imgSrc}" alt="RedOne Gallery">
                </div>
            `;
            
            // Ajouter la lightbox au body
            document.body.appendChild(lightbox);
            
            // Empêcher le scroll du body
            document.body.style.overflow = 'hidden';
            
            // Ajouter la classe active avec délai pour l'animation
            setTimeout(() => {
                lightbox.classList.add('active');
            }, 10);
            
            // Fermer la lightbox
            const closeLightbox = lightbox.querySelector('.close-lightbox');
            closeLightbox.addEventListener('click', function() {
                lightbox.classList.remove('active');
                
                // Supprimer la lightbox après la transition
                setTimeout(() => {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = 'auto';
                }, 300);
            });
            
            // Fermer en cliquant en dehors de l'image
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    lightbox.classList.remove('active');
                    
                    // Supprimer la lightbox après la transition
                    setTimeout(() => {
                        document.body.removeChild(lightbox);
                        document.body.style.overflow = 'auto';
                    }, 300);
                }
            });
        });
    });
    
    // Animation des cartes de fonctionnalités
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Ajouter un délai basé sur l'index
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                featureObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    featureCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.4s ease, transform 0.6s ease';
        featureObserver.observe(card);
    });
    
    // Animation des membres de l'équipe
    const teamMembers = document.querySelectorAll('.team-member');
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                
                teamObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    teamMembers.forEach(member => {
        member.style.opacity = 0;
        member.style.transform = 'translateY(30px)';
        member.style.transition = 'opacity 0.5s ease, transform 0.7s ease';
        teamObserver.observe(member);
    });

    // Animation d'apparition des sections au scroll (hors hero)
    const sections = document.querySelectorAll('section:not(.hero)');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-section');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(section => {
        section.classList.add('before-fade-in-section');
        sectionObserver.observe(section);
    });
    
    // Animation du formulaire de contact
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simuler l'envoi du formulaire
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            submitBtn.innerText = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            // Simuler un délai de traitement
            setTimeout(() => {
                submitBtn.innerText = 'Envoyé !';
                submitBtn.classList.add('success');
                
                // Reset form
                this.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('success');
                }, 3000);
            }, 1500);
        });
    }

    // Effet tilt/parallax sur les images de la galerie et de l'équipe
    function addTiltEffect(selector, maxTilt = 15, scale = 1.04) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.transition = 'transform 0.25s cubic-bezier(.03,.98,.52,.99)';
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const percentX = (x - centerX) / centerX;
                const percentY = (y - centerY) / centerY;
                const tiltX = percentY * maxTilt;
                const tiltY = -percentX * maxTilt;
                el.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
            });
        });
    }
    addTiltEffect('.gallery-item', 18, 1.06);
    addTiltEffect('.member-image', 12, 1.04);
    
    // Effet de parallaxe pour la section hero
    // (Supprimé pour que l'image reste totalement fixe)
    
    // Fonction pour créer et animer les particules "feu"
    function createFireParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.position = 'fixed';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.pointerEvents = 'none';
        particlesContainer.style.zIndex = '0';
        document.body.appendChild(particlesContainer);
        
        // Créer des particules de feu
        for (let i = 0; i < 50; i++) {
            createParticle(particlesContainer);
        }
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'fire-particle';
        
        // Styles des particules
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(${Math.floor(Math.random() * 80) + 175}, ${Math.floor(Math.random() * 30)}, ${Math.floor(Math.random() * 10)}, ${Math.random() * 0.5 + 0.2})`;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 10px rgba(255, 50, 0, 0.5)';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '-1';
        particle.style.opacity = '0';
        
        // Position initiale
        resetParticle(particle);
        
        // Ajouter au container
        container.appendChild(particle);
        
        // Animation
        animateParticle(particle);
    }
    
    function resetParticle(particle) {
        // Positionner en bas de l'écran à un endroit aléatoire
        particle.style.bottom = '0';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        // Propriétés d'animation
        particle.speedY = Math.random() * 2 + 1;
        particle.speedX = Math.random() * 1 - 0.5;
        particle.lifeTime = Math.random() * 4000 + 2000; // 2-6 secondes
    }
    
    function animateParticle(particle) {
        let startTime = Date.now();
        let posY = 0;
        let posX = parseFloat(particle.style.left);
        
        function update() {
            const elapsedTime = Date.now() - startTime;
            
            if (elapsedTime > particle.lifeTime) {
                resetParticle(particle);
                startTime = Date.now();
                posY = 0;
                posX = parseFloat(particle.style.left);
            }
            
            // Monter et dériver
            posY += particle.speedY;
            posX += particle.speedX;
            
            // Appliquer la position
            particle.style.transform = `translateY(-${posY}px) translateX(${posX - parseFloat(particle.style.left)}px)`;
            
            // Faire disparaître progressivement
            const fadeStart = particle.lifeTime * 0.7;
            if (elapsedTime > fadeStart) {
                const fadeProgress = (elapsedTime - fadeStart) / (particle.lifeTime - fadeStart);
                particle.style.opacity = Math.max(0, parseFloat(particle.style.opacity) - fadeProgress * 0.01);
            }
            
            requestAnimationFrame(update);
        }
        
        update();
    }
    
    // Fonction pour animer les éléments du hero
    function animateHeroElements() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.animation = 'heroContentIn 1.2s ease forwards';
        }
    }
    
    // Ajouter CSS pour les animations et la lightbox
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .lightbox.active {
            opacity: 1;
            visibility: visible;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 80%;
            max-height: 80%;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .lightbox.active .lightbox-content {
            transform: scale(1);
        }
        
        .lightbox-content img {
            max-width: 100%;
            max-height: 80vh;
            border: 3px solid #e50914;
            box-shadow: 0 5px 25px rgba(229, 9, 20, 0.5);
        }
        
        .close-lightbox {
            position: absolute;
            top: -40px;
            right: 0;
            font-size: 30px;
            color: #fff;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .close-lightbox:hover {
            color: #e50914;
            transform: scale(1.1);
        }
        
        button.success {
            background-color: #28a745 !important;
        }
        
        /* Animation pour le contenu hero */
        @keyframes heroContentIn {
            0% {
                opacity: 0;
                transform: translateY(30px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Animation de pulsation pour les éléments importants */
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(229, 9, 20, 0.7);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(229, 9, 20, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(229, 9, 20, 0);
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Ajouter l'effet de pulsation aux boutons principaux
    const primaryButtons = document.querySelectorAll('.btn.primary');
    primaryButtons.forEach(btn => {
        btn.classList.add('pulse');
    });

    // Effet ripple sur tous les boutons .btn
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        circle.classList.add('ripple');
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        // Supprimer les anciens ripples
        const oldRipple = button.querySelector('.ripple');
        if (oldRipple) oldRipple.remove();
        button.appendChild(circle);
    }
    document.querySelectorAll('.btn').forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.addEventListener('click', createRipple);
    });

    // Scroll To Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
