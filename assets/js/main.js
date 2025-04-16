// Attendez que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const header = document.querySelector('header');
    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-links li a');
    const loader = document.querySelector('.loader');
    const loaderProgressBar = document.getElementById('loaderProgressBar');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const heroSection = document.querySelector('.hero');
    const scrollProgress = document.getElementById('scrollProgress');
    const heroParticles = document.getElementById('heroParticles');
    const heroScrollIndicator = document.querySelector('.hero-scroll-indicator');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const actualiteCards = document.querySelectorAll('.actualite-card');
    const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
    const advancedLightbox = document.getElementById('advancedLightbox');
    
    // Initialisation des variables pour les éléments qui pourraient être chargés après le DOM
    let galleryItemsArray = Array.from(galleryItems);
    
    // Système de préchargement amélioré avec progression plus fluide
    let progress = 0;
    const totalResources = 15; // Nombre approximatif de ressources à charger
    let loadedResources = 0;
    
    // Fonction pour animer la barre de progression de manière fluide
    function animateProgressBar() {
        if (!loaderProgressBar) return;
        
        // Progression par étapes
        const steps = [
            { target: 15, duration: 500 },
            { target: 35, duration: 800 },
            { target: 65, duration: 1200 },
            { target: 85, duration: 1000 },
            { target: 95, duration: 800 }
        ];
        
        let currentStep = 0;
        
        function animateStep() {
            if (currentStep >= steps.length) return;
            
            const step = steps[currentStep];
            const startProgress = progress;
            const targetProgress = step.target;
            const duration = step.duration;
            const startTime = performance.now();
            
            function updateProgress(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progressFraction = Math.min(elapsedTime / duration, 1);
                
                // Fonction d'easing pour une animation plus naturelle
                const easeOutQuad = t => t * (2 - t);
                const easedProgress = easeOutQuad(progressFraction);
                
                progress = startProgress + (targetProgress - startProgress) * easedProgress;
                loaderProgressBar.style.width = progress + '%';
                
                if (progressFraction < 1) {
                    requestAnimationFrame(updateProgress);
                } else {
                    currentStep++;
                    if (currentStep < steps.length) {
                        setTimeout(animateStep, 200); // Petit délai entre les étapes
                    }
                }
            }
            
            requestAnimationFrame(updateProgress);
        }
        
        // Démarrer l'animation
        animateStep();
    }
    
    // Démarrer l'animation de la barre de progression
    if (loaderProgressBar) {
        animateProgressBar();
    }
    
    // Animation de particules pour l'effet "feu" en arrière-plan
    createFireParticles();
    
    // Créer des particules pour la section hero
    createHeroParticles();
    
    // Masquer le loader après le chargement complet de la page
    window.addEventListener('load', function() {
        // Finaliser la barre de progression
        if (loaderProgressBar) {
            loaderProgressBar.style.width = '100%';
        }
        
        // Forcer la fin du chargement après un délai maximum
        setTimeout(function() {
            if (loader) {
                loader.classList.add('hidden');
                
                // Assurer que le loader est complètement masqué
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 1000);
                
                // Animation d'entrée pour le logo et le titre principal
                animateHeroElements();
            }
        }, 1000);
    });
    
    // Fallback pour s'assurer que le loader disparaît même si l'événement load ne se déclenche pas correctement
    setTimeout(function() {
        if (loader && !loader.classList.contains('hidden')) {
            console.log("Forçage de la fermeture du loader après délai de sécurité");
            loader.classList.add('hidden');
            
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
            
            // Animation d'entrée pour le logo et le titre principal
            animateHeroElements();
        }
    }, 5000);
    
    // Changement d'état du header au scroll et mise à jour de la barre de progression
    window.addEventListener('scroll', function() {
        // Header scrolled
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Mise à jour de la barre de progression
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
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
    
    // Fonction pour créer des particules dans la section hero
    function createHeroParticles() {
        if (!heroParticles) return;
        
        // Nombre de particules
        const particleCount = 50;
        
        // Créer les particules
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            
            // Styles aléatoires
            const size = Math.random() * 4 + 1;
            const opacity = Math.random() * 0.5 + 0.2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            
            // Appliquer les styles
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.opacity = opacity;
            particle.style.left = posX + '%';
            particle.style.top = posY + '%';
            particle.style.animationDelay = delay + 's';
            particle.style.animationDuration = duration + 's';
            particle.style.background = `rgba(${Math.floor(Math.random() * 80) + 175}, ${Math.floor(Math.random() * 30)}, ${Math.floor(Math.random() * 10)}, ${opacity})`;
            particle.style.boxShadow = `0 0 ${size * 2}px rgba(255, 50, 0, 0.5)`;
            particle.style.position = 'absolute';
            particle.style.borderRadius = '50%';
            particle.style.animation = `floatParticle ${duration}s ease-in-out infinite alternate`;
            
            // Ajouter au conteneur
            heroParticles.appendChild(particle);
        }
        
        // Ajouter le style d'animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% { transform: translate(0, 0); }
                50% { transform: translate(${Math.random() * 30}px, ${Math.random() * 30}px); }
                100% { transform: translate(${Math.random() * -30}px, ${Math.random() * -30}px); }
            }
        `;
        document.head.appendChild(style);
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
    
    // Indicateur de défilement dans la section hero
    if (heroScrollIndicator) {
        heroScrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#a-propos');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Filtrage des actualités
    if (filterBtns.length > 0 && actualiteCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Retirer la classe active de tous les boutons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Ajouter la classe active au bouton cliqué
                btn.classList.add('active');
                
                // Récupérer la catégorie à filtrer
                const filterValue = btn.getAttribute('data-filter');
                
                // Filtrer les cartes
                actualiteCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Filtrage de la galerie
    function initGalleryFilters() {
        const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (galleryFilterBtns.length > 0 && galleryItems.length > 0) {
            // Fonction de filtrage
            function filterGallery(filterValue) {
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0) scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px) scale(0.95)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            }
            
            // Ajouter les écouteurs d'événements aux boutons de filtre
            galleryFilterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Retirer la classe active de tous les boutons
                    galleryFilterBtns.forEach(b => b.classList.remove('active'));
                    
                    // Ajouter la classe active au bouton cliqué
                    btn.classList.add('active');
                    
                    // Récupérer la catégorie à filtrer
                    const filterValue = btn.getAttribute('data-filter');
                    
                    // Appliquer le filtre
                    filterGallery(filterValue);
                });
            });
            
            // Initialiser avec le filtre "Tout" actif
            filterGallery('all');
        }
    }
    
    // Initialiser les filtres de la galerie
    initGalleryFilters();
    
    // Lightbox avancée pour la galerie
    function initGalleryLightbox() {
        const advancedLightbox = document.getElementById('advancedLightbox');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (galleryItems.length > 0 && advancedLightbox) {
            const lightboxTitle = advancedLightbox.querySelector('.lightbox-title');
            const lightboxImage = advancedLightbox.querySelector('.lightbox-image');
            const lightboxDescription = advancedLightbox.querySelector('.lightbox-description');
            const lightboxCounter = advancedLightbox.querySelector('.lightbox-counter');
            const lightboxCurrentNum = advancedLightbox.querySelector('.current');
            const lightboxTotalNum = advancedLightbox.querySelector('.total');
            const lightboxPrev = advancedLightbox.querySelector('.lightbox-prev');
            const lightboxNext = advancedLightbox.querySelector('.lightbox-next');
            const lightboxClose = advancedLightbox.querySelector('.lightbox-close');
            
            let currentIndex = 0;
            const visibleItems = [];
            
            // Mettre à jour les éléments visibles
            function updateVisibleItems() {
                visibleItems.length = 0;
                galleryItems.forEach((item, index) => {
                    // Considérer tous les éléments au début, puis filtrer selon la visibilité
                    if (window.getComputedStyle(item).display !== 'none') {
                        visibleItems.push({
                            index: index,
                            item: item
                        });
                    }
                });
                
                if (lightboxTotalNum) {
                    lightboxTotalNum.textContent = visibleItems.length || galleryItems.length;
                }
            }
            
            // Ouvrir la lightbox
            function openLightbox(index) {
                updateVisibleItems();
                
                // Si aucun élément visible, utiliser tous les éléments
                if (visibleItems.length === 0) {
                    galleryItems.forEach((item, idx) => {
                        visibleItems.push({
                            index: idx,
                            item: item
                        });
                    });
                }
                
                if (visibleItems.length === 0) return;
                
                // Trouver l'index correspondant dans les éléments visibles
                let targetIndex = 0;
                for (let i = 0; i < visibleItems.length; i++) {
                    if (visibleItems[i].index === index) {
                        targetIndex = i;
                        break;
                    }
                }
                
                currentIndex = targetIndex;
                
                const item = visibleItems[currentIndex].item;
                const img = item.querySelector('img');
                const title = item.querySelector('.gallery-info h3')?.textContent || 'Image de la galerie';
                const description = item.querySelector('.gallery-info p')?.textContent || 'Description non disponible';
                
                if (lightboxImage) {
                    lightboxImage.src = img.src;
                    lightboxImage.alt = img.alt || title;
                }
                if (lightboxTitle) lightboxTitle.textContent = title;
                if (lightboxDescription) lightboxDescription.textContent = description;
                if (lightboxCurrentNum) lightboxCurrentNum.textContent = currentIndex + 1;
                if (lightboxTotalNum) lightboxTotalNum.textContent = visibleItems.length;
                
                advancedLightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            // Fermer la lightbox
            function closeLightbox() {
                advancedLightbox.classList.remove('active');
                setTimeout(() => {
                    document.body.style.overflow = 'auto';
                }, 300);
            }
            
            // Navigation dans la lightbox
            function navigateLightbox(direction) {
                if (visibleItems.length === 0) return;
                
                currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
                
                const item = visibleItems[currentIndex].item;
                const img = item.querySelector('img');
                const title = item.querySelector('.gallery-info h3')?.textContent || 'Image de la galerie';
                const description = item.querySelector('.gallery-info p')?.textContent || 'Description non disponible';
                
                // Animation de transition
                if (lightboxImage) {
                    lightboxImage.style.opacity = '0';
                    lightboxImage.style.transform = 'scale(0.9)';
                }
                
                setTimeout(() => {
                    if (lightboxImage) {
                        lightboxImage.src = img.src;
                        lightboxImage.alt = img.alt || title;
                        lightboxImage.style.opacity = '1';
                        lightboxImage.style.transform = 'scale(1)';
                    }
                    if (lightboxTitle) lightboxTitle.textContent = title;
                    if (lightboxDescription) lightboxDescription.textContent = description;
                    if (lightboxCurrentNum) lightboxCurrentNum.textContent = currentIndex + 1;
                }, 300);
            }
            
            // Ajouter les écouteurs d'événements
            galleryItems.forEach((item, index) => {
                const zoomBtn = item.querySelector('.gallery-zoom');
                if (zoomBtn) {
                    zoomBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        openLightbox(index);
                    });
                }
                
                // Ajouter également un écouteur sur l'image elle-même
                const itemInner = item.querySelector('.gallery-item-inner');
                if (itemInner) {
                    itemInner.addEventListener('click', (e) => {
                        // Ne pas déclencher si on a cliqué sur un bouton
                        if (!e.target.closest('button')) {
                            e.preventDefault();
                            openLightbox(index);
                        }
                    });
                }
            });
            
            if (lightboxClose) {
                lightboxClose.addEventListener('click', closeLightbox);
            }
            
            if (lightboxPrev) {
                lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
            }
            
            if (lightboxNext) {
                lightboxNext.addEventListener('click', () => navigateLightbox(1));
            }
            
            // Fermer la lightbox en cliquant en dehors
            advancedLightbox.addEventListener('click', (e) => {
                if (e.target === advancedLightbox) {
                    closeLightbox();
                }
            });
            
            // Navigation avec les touches du clavier
            document.addEventListener('keydown', (e) => {
                if (!advancedLightbox.classList.contains('active')) return;
                
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    navigateLightbox(-1);
                } else if (e.key === 'ArrowRight') {
                    navigateLightbox(1);
                }
            });
            
            // Initialiser les compteurs
            updateVisibleItems();
        }
    }
    
    // Initialiser la lightbox de la galerie
    initGalleryLightbox();
    
    // Gestion des boutons "like" de la galerie - version simplifiée et robuste
    function initGalleryLikes() {
        // Approche directe sans clonage pour éviter les problèmes
        document.addEventListener('click', function(e) {
            // Vérifier si l'élément cliqué ou un de ses parents est un bouton like
            const likeButton = e.target.closest('.gallery-like');
            
            if (likeButton) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log("Bouton like cliqué");
                
                // Basculer la classe active
                likeButton.classList.toggle('active');
                
                // Mettre à jour le compteur
                const countSpan = likeButton.querySelector('span');
                if (countSpan) {
                    let count = parseInt(countSpan.textContent || "0");
                    
                    if (likeButton.classList.contains('active')) {
                        // Incrémenter si actif
                        count++;
                        // Changer l'icône
                        const icon = likeButton.querySelector('i');
                        if (icon) {
                            icon.classList.remove('far');
                            icon.classList.add('fas');
                        }
                    } else {
                        // Décrémenter si inactif
                        count = Math.max(0, count - 1); // Éviter les nombres négatifs
                        // Changer l'icône
                        const icon = likeButton.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fas');
                            icon.classList.add('far');
                        }
                    }
                    
                    // Mettre à jour le texte
                    countSpan.textContent = count;
                    
                    // Animation de pulsation
                    likeButton.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        likeButton.style.transform = '';
                    }, 300);
                }
            }
        });
    }
    
    // Initialiser les boutons "like" immédiatement
    initGalleryLikes();
    
    // FAQ Accordion - version simplifiée et robuste
    function initFaqAccordion() {
        // Utiliser une approche par délégation d'événements pour plus de robustesse
        document.addEventListener('click', function(e) {
            // Vérifier si l'élément cliqué ou un de ses parents est une question FAQ
            const faqQuestion = e.target.closest('.faq-question');
            
            if (faqQuestion) {
                console.log("Question FAQ cliquée");
                
                // Trouver l'élément parent (faq-item)
                const faqItem = faqQuestion.closest('.faq-item');
                if (!faqItem) return;
                
                // Fermer tous les autres items
                const allFaqItems = document.querySelectorAll('.faq-item');
                allFaqItems.forEach(otherItem => {
                    if (otherItem !== faqItem && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                            otherAnswer.style.opacity = '0';
                        }
                    }
                });
                
                // Toggle l'item actuel
                const isActive = faqItem.classList.toggle('active');
                
                // Animer l'ouverture/fermeture
                const answer = faqItem.querySelector('.faq-answer');
                if (answer) {
                    if (isActive) {
                        // Ouvrir
                        const height = answer.scrollHeight;
                        answer.style.maxHeight = height + 'px';
                        answer.style.opacity = '1';
                        
                        // Mettre à jour la hauteur si le contenu change
                        setTimeout(() => {
                            answer.style.maxHeight = answer.scrollHeight + 'px';
                        }, 300);
                    } else {
                        // Fermer
                        answer.style.maxHeight = '0';
                        answer.style.opacity = '0';
                    }
                }
                
                // Changer l'icône
                const toggleIcon = faqQuestion.querySelector('.faq-toggle i');
                if (toggleIcon) {
                    if (isActive) {
                        toggleIcon.classList.remove('fa-plus');
                        toggleIcon.classList.add('fa-minus');
                    } else {
                        toggleIcon.classList.remove('fa-minus');
                        toggleIcon.classList.add('fa-plus');
                    }
                }
            }
        });
    }
    
    // Initialiser l'accordéon FAQ immédiatement
    initFaqAccordion();
    
    // Validation du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Réinitialiser les erreurs
            const errorElements = document.querySelectorAll('.form-error');
            errorElements.forEach(el => el.classList.remove('show'));
            
            // Réinitialiser le statut
            const formStatus = document.getElementById('formStatus');
            formStatus.className = 'form-status';
            formStatus.textContent = '';
            formStatus.style.display = 'none';
            
            // Valider le formulaire
            let isValid = true;
            
            // Nom
            const name = document.getElementById('name');
            if (!name.value.trim()) {
                showError('nameError', 'Veuillez entrer votre nom');
                isValid = false;
            }
            
            // Email
            const email = document.getElementById('email');
            if (!email.value.trim()) {
                showError('emailError', 'Veuillez entrer votre email');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError('emailError', 'Veuillez entrer un email valide');
                isValid = false;
            }
            
            // Sujet
            const subject = document.getElementById('subject');
            if (!subject.value) {
                showError('subjectError', 'Veuillez sélectionner un sujet');
                isValid = false;
            }
            
            // Message
            const message = document.getElementById('message');
            if (!message.value.trim()) {
                showError('messageError', 'Veuillez entrer votre message');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError('messageError', 'Votre message doit contenir au moins 10 caractères');
                isValid = false;
            }
            
            // Consentement
            const consent = document.getElementById('consent');
            if (!consent.checked) {
                showError('consentError', 'Vous devez accepter les conditions');
                isValid = false;
            }
            
            // Si le formulaire est valide, simuler l'envoi
            if (isValid) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                
                submitBtn.innerText = 'Envoi en cours...';
                submitBtn.disabled = true;
                
                // Simuler un délai de traitement
                setTimeout(() => {
                    // Afficher le message de succès
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.';
                    formStatus.style.display = 'block';
                    
                    // Réinitialiser le formulaire
                    contactForm.reset();
                    
                    // Réinitialiser le bouton
                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1500);
            }
        });
    }
    
    // Fonction pour afficher les erreurs
    function showError(id, message) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    // Fonction pour valider l'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Ajouter un mode sombre/clair
    const themeToggle = document.createElement('button');
    themeToggle.id = 'themeToggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Changer de thème');
    document.body.appendChild(themeToggle);
    
    // Vérifier si un thème est déjà enregistré
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Gérer le changement de thème
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // Ajouter les styles pour le bouton de thème et le thème clair
    const themeStyles = document.createElement('style');
    themeStyles.textContent = `
        #themeToggle {
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--color-primary);
            color: var(--color-light);
            border: none;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.2rem;
            z-index: 99;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transition: var(--transition);
        }
        
        #themeToggle:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(229, 9, 20, 0.4);
        }
        
        .light-theme {
            --color-secondary: #f5f5f5;
            --color-light: #333333;
            --color-grey: #666666;
            --color-grey-light: #888888;
            --color-overlay: rgba(255, 255, 255, 0.7);
        }
        
        .light-theme header {
            background: rgba(245, 245, 245, 0.85);
            backdrop-filter: blur(10px) saturate(120%);
            -webkit-backdrop-filter: blur(10px) saturate(120%);
        }
        
        .light-theme .feature-card,
        .light-theme .team-member,
        .light-theme .about-content,
        .light-theme .contact-info,
        .light-theme .contact-form,
        .light-theme .faq-item {
            background: rgba(255, 255, 255, 0.75);
            box-shadow: 0 8px 32px 0 rgba(229, 9, 20, 0.10), 0 1.5px 8px 0 rgba(0,0,0,0.05);
        }
        
        .light-theme .hero-overlay {
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(229, 9, 20, 0.2));
        }
        
        .light-theme .form-group input,
        .light-theme .form-group select,
        .light-theme .form-group textarea {
            background-color: rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 0, 0, 0.1);
            color: var(--color-light);
        }
        
        @media (max-width: 768px) {
            #themeToggle {
                bottom: 90px;
                left: 20px;
                width: 45px;
                height: 45px;
            }
        }
    `;
    document.head.appendChild(themeStyles);
});
