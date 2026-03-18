document.addEventListener('DOMContentLoaded', () => {

    // ──────────────────────────────────────────
    // 1. PARTICLE CANVAS BACKGROUND
    // ──────────────────────────────────────────
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 80;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 1.5 + 0.3,
            opacity: Math.random() * 0.5 + 0.1,
        };
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 220, 255, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 220, 255, ${p.opacity})`;
            ctx.fill();

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
        });

        requestAnimationFrame(drawParticles);
    }
    drawParticles();


    // ──────────────────────────────────────────
    // 2. NAVBAR SCROLL EFFECT
    // ──────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link on scroll
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // ──────────────────────────────────────────
    // 3. MOBILE MENU TOGGLE
    // ──────────────────────────────────────────
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const icon = mobileToggle.querySelector('i');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });


    // ──────────────────────────────────────────
    // 4. INTERSECTION OBSERVER — FADE IN
    // ──────────────────────────────────────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, entry.target.dataset.delay || 0);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    // Stagger fade-in items within their parent
    document.querySelectorAll('.fade-in').forEach((el, i) => {
        const siblings = el.parentElement.querySelectorAll('.fade-in');
        let delay = 0;
        siblings.forEach((sib, j) => {
            if (sib === el) delay = j * 120;
        });
        el.dataset.delay = delay;
        observer.observe(el);
    });


    // ──────────────────────────────────────────
    // 5. STATS COUNTER ANIMATION
    // ──────────────────────────────────────────
    const statNumbers = document.querySelectorAll('.stat-number');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const duration = 1800;
                const start = performance.now();

                function updateCounter(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                }
                requestAnimationFrame(updateCounter);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statsObserver.observe(el));


    // ──────────────────────────────────────────
    // 6. COUNTDOWN TIMER — to Mar 27, 2026 9AM
    // ──────────────────────────────────────────
    const eventDate = new Date('2026-03-27T09:00:00+05:30');

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateCountdown() {
        const now = new Date();
        const diff = eventDate - now;

        if (diff <= 0) {
            // Event started
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = pad(days);
        document.getElementById('hours').textContent = pad(hours);
        document.getElementById('minutes').textContent = pad(minutes);
        document.getElementById('seconds').textContent = pad(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    // ──────────────────────────────────────────
    // 7. MODAL LOGIC (Register & Detail)
    // ──────────────────────────────────────────
    const modal = document.getElementById('registerModal');
    const closeModal = document.getElementById('closeModal');
    const dismissModal = document.getElementById('dismissModal');

    const detailModal = document.getElementById('detailModal');
    const closeDetailModal = document.getElementById('closeDetailModal');
    const detailTitle = document.getElementById('detailTitle');
    const detailBody = document.getElementById('detailBody');
    const detailVideo = document.getElementById('detailVideo');
    const detailRegisterBtn = document.getElementById('detailRegisterBtn');

    // Asset Mapping
    const eventAssets = {
        'thinkinspire': {
            poster: 'POSTERS/THINKSPIRE/WhatsApp Image 2026-03-02 at 12.31.19 PM.jpeg',
            video: 'Videos/THINKSPIRE .mp4',
            regLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc9LUcozK_3_tbmWur63ehGKuB2ngN_b1oKG_cEmaTfHTADYQ/viewform'
        },
        'autopsy': {
            poster: 'POSTERS/Mechanical Autopsy/Mechanical Autopsy.png',
            video: 'Videos/Mechanical Autopsy - mp4.mp4',
            regLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc9LUcozK_3_tbmWur63ehGKuB2ngN_b1oKG_cEmaTfHTADYQ/viewform'
        },
        'lockedin': {
            poster: 'POSTERS/Locked IN - The AME Challenge/G402, G403, G404, G405.png',
            video: 'Videos/LOCKEDIN.mp4',
            regLink: 'https://forms.gle/lockedin'
        },
        'guesstimator': {
            poster: 'POSTERS/GUESSTIMATOR/Guesstimator2026.png',
            video: 'Videos/Guestimator.mp4',
            regLink: 'https://forms.gle/guesstimator'
        },
        'inflatopia': {
            poster: 'POSTERS/INFLATOPIA/Inflatopia Poster.jpeg',
            video: 'Videos/INFLANTOPIA.mp4',
            regLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdYy3eOsjfxMrMB1Y0-x-fzYmbczUXJYLIfXbOyuo-Uet-qqw/viewform'
        },
        'brandx': {
            poster: '',
            video: 'Videos/BRANDX.mp4',
            regLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc568ez9HMnkAc9rAHrEzvCJaLlcdCO_MvFJxeDLuIVqBVybw/viewform?fbzx=7331205346421776506'
        },
        'linkinnova': {
            video: 'Videos/LINK-INNOVA.mp4',
            regLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc568ez9HMnkAc9rAHrEzvCJaLlcdCO_MvFJxeDLuIVqBVybw/viewform?fbzx=7331205346421776506'
        },
        'ndte': {
            poster: '',
            video: 'assets/prayatna26.mp4',
            regLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdYy3eOsjfxMrMB1Y0-x-fzYmbczUXJYLIfXbOyuo-Uet-qqw/viewform'
        },
        'mechanicalintegrity': {
            poster: '',
            video: 'assets/mechanicalintegrity.mp4',
            regLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc568ez9HMnkAc9rAHrEzvCJaLlcdCO_MvFJxeDLuIVqBVybw/viewform?fbzx=7331205346421776506'
        }
    };

    // Auto open register modal after 5s
    setTimeout(() => {
        if (modal) modal.classList.add('active');
    }, 5000);

    const hideModal = (m) => {
        if (m) {
            m.classList.remove('active');
            if (m === detailModal) {
                document.body.classList.remove('event-focused');
                if (detailVideo) detailVideo.pause();
            }
        }
    };

    if (closeModal) closeModal.addEventListener('click', () => hideModal(modal));
    if (dismissModal) dismissModal.addEventListener('click', () => hideModal(modal));

    if (closeDetailModal) closeDetailModal.addEventListener('click', () => hideModal(detailModal));

    // Handle Card Clicks
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.bento-btn')) return; // Allow normal link navigation for register buttons

            const cardTitle = card.querySelector('.bento-title').textContent.trim();
            const titlesMap = {
                'THINKSPIRE \'26': 'thinkinspire',
                'MECHANICAL AUTOPSY': 'autopsy',
                'LOCKED IN': 'lockedin',
                'GUESSTIMATOR': 'guesstimator',
                'INFLATOPIA': 'inflatopia',
                'BRAND-X': 'brandx',
                'LINKIN-NOVA': 'linkinnova',
                'WORKSHOP ON INDUSTRIAL ENGINEERING TOOLS': 'ndte',
                'WORKSHOP ON MECHANICAL INTEGRITY': 'mechanicalintegrity'
            };

            const eventId = titlesMap[cardTitle];
            if (!eventId) return;

            const template = document.getElementById(`${eventId}-long`);
            const assets = eventAssets[eventId] || {};

            if (template && detailModal) {
                detailTitle.textContent = cardTitle;
                detailBody.innerHTML = template.innerHTML;

                // Set Media
                if (detailVideo) {
                    const videoSource = detailVideo.querySelector('source');
                    if (assets.video) {
                        videoSource.src = assets.video;
                        detailVideo.load();
                        detailVideo.style.display = 'block';
                    } else {
                        detailVideo.style.display = 'none';
                    }
                }
                if (detailRegisterBtn) {
                    detailRegisterBtn.href = assets.regLink || '#';
                    if (eventId === 'guesstimator') {
                        detailRegisterBtn.innerHTML = '<i class="fas fa-bolt"></i> ON-SPOT REGISTRATION';
                    } else {
                        detailRegisterBtn.innerHTML = '<i class="fas fa-bolt"></i> REGISTER NOW';
                    }
                }

                document.body.classList.add('event-focused');
                setTimeout(() => {
                    detailModal.classList.add('active');
                    // Ensure video plays after modal is visible
                    if (detailVideo && assets.video) {
                        detailVideo.play().catch(e => console.log('Autoplay blocked:', e));
                    }
                }, 100);
            }
        });
    });

    // Close on outside click
    [modal, detailModal].forEach(m => {
        if (m) {
            m.addEventListener('click', (e) => {
                if (e.target === m) hideModal(m);
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModal(modal);
            hideModal(detailModal);
        }
    });


    // ──────────────────────────────────────────
    // 8. BENTO CARD MOUSE GLOW EFFECT
    // ──────────────────────────────────────────
    document.querySelectorAll('.bento-card, .about-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

});
