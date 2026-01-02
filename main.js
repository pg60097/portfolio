/**
 * PORTFÓLIO ACADÉMICO - JAVASCRIPT
 * Funcionalidades interativas completas
 */

// ========== DOM Elements ==========
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelectorAll('.nav-link');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('.section');
const expandBtns = document.querySelectorAll('.expand-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const yearFilter = document.getElementById('yearFilter');
const publicationsList = document.getElementById('publicationsList');
const sortBtns = document.querySelectorAll('.sort-btn');
const awardsList = document.getElementById('awardsList');
const contactForm = document.getElementById('contactForm');
const downloadPdfBtn = document.getElementById('downloadPdf');
const shareBtn = document.getElementById('shareBtn');
const shareModal = document.getElementById('shareModal');
const closeShareModal = document.getElementById('closeShareModal');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ========== Progress Bar & Scroll Effects ==========
function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
}

function updateNavbarOnScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function updateBackToTop() {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

// ========== Scroll Spy ==========
function updateActiveNavLink() {
    let current = '';
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Combined scroll handler
function handleScroll() {
    updateProgressBar();
    updateNavbarOnScroll();
    updateBackToTop();
    updateActiveNavLink();
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ========== Navigation ==========
// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Smooth scroll for nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Back to top
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========== Expand/Collapse Education Details ==========
expandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        const extraContent = btn.nextElementSibling;

        btn.setAttribute('aria-expanded', !isExpanded);

        if (isExpanded) {
            extraContent.classList.remove('expanded');
            btn.querySelector('span').textContent = 'Ver mais detalhes';
        } else {
            extraContent.classList.add('expanded');
            btn.querySelector('span').textContent = 'Ver menos';
        }
    });
});

// ========== Publications Filter ==========
function filterPublications() {
    const activeTypeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const activeYearFilter = yearFilter.value;
    const publications = publicationsList.querySelectorAll('.publication-item');

    publications.forEach(pub => {
        const type = pub.dataset.type;
        const year = pub.dataset.year;

        const matchesType = activeTypeFilter === 'all' || type === activeTypeFilter;
        const matchesYear = activeYearFilter === 'all' || year === activeYearFilter;

        if (matchesType && matchesYear) {
            pub.classList.remove('hidden');
        } else {
            pub.classList.add('hidden');
        }
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterPublications();
    });
});

yearFilter.addEventListener('change', filterPublications);

// ========== Copy Citation ==========
document.querySelectorAll('.copy-citation').forEach(btn => {
    btn.addEventListener('click', () => {
        const citation = btn.dataset.citation;
        copyToClipboard(citation, 'Citação copiada!');
    });
});

// ========== Awards Sorting ==========
sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sortBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const sortBy = btn.dataset.sort;
        const awards = Array.from(awardsList.querySelectorAll('.award-item'));

        awards.sort((a, b) => {
            if (sortBy === 'date') {
                return parseInt(b.dataset.year) - parseInt(a.dataset.year);
            } else {
                return parseInt(b.dataset.relevance) - parseInt(a.dataset.relevance);
            }
        });

        awards.forEach(award => awardsList.appendChild(award));
    });
});

// ========== Contact Form Validation ==========
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}Error`);
    input.classList.add('error');
    errorElement.textContent = message;
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}Error`);
    input.classList.remove('error');
    errorElement.textContent = '';
}

function validateForm() {
    let isValid = true;
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Clear previous errors
    ['name', 'email', 'subject', 'message'].forEach(clearError);

    if (!name) {
        showError('name', 'Por favor, introduza o seu nome.');
        isValid = false;
    }

    if (!email) {
        showError('email', 'Por favor, introduza o seu email.');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Por favor, introduza um email válido.');
        isValid = false;
    }

    if (!subject) {
        showError('subject', 'Por favor, introduza o assunto.');
        isValid = false;
    }

    if (!message) {
        showError('message', 'Por favor, introduza a sua mensagem.');
        isValid = false;
    }

    return isValid;
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formFeedback = document.getElementById('formFeedback');
    formFeedback.className = 'form-feedback';
    formFeedback.style.display = 'none';

    if (validateForm()) {
        // Simulate form submission
        // In production, this would send data to a server
        formFeedback.textContent = '✓ Mensagem enviada com sucesso! Entrarei em contacto em breve.';
        formFeedback.classList.add('success');

        // Reset form
        contactForm.reset();

        // Show notification (in production, would send email)
        showToast('Mensagem enviada com sucesso!');
    } else {
        formFeedback.textContent = '✗ Por favor, corrija os erros acima.';
        formFeedback.classList.add('error');
    }
});

// Real-time validation
['name', 'email', 'subject', 'message'].forEach(id => {
    document.getElementById(id).addEventListener('blur', () => {
        const value = document.getElementById(id).value.trim();
        clearError(id);

        if (!value) {
            showError(id, 'Este campo é obrigatório.');
        } else if (id === 'email' && !validateEmail(value)) {
            showError(id, 'Por favor, introduza um email válido.');
        }
    });

    document.getElementById(id).addEventListener('input', () => {
        clearError(id);
    });
});

// ========== PDF Export ==========
downloadPdfBtn.addEventListener('click', async () => {
    showToast('A gerar PDF...');

    const element = document.getElementById('mainContent');
    const opt = {
        margin: [10, 10, 10, 10],
        filename: 'portfolio-academico-joao-santos.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: { mode: 'avoid-all' }
    };

    try {
        // Add metadata
        const pdf = await html2pdf().set(opt).from(element).toPdf().get('pdf');
        pdf.setProperties({
            title: 'Portfólio Académico - João Miguel Silva Santos',
            author: 'João Miguel Silva Santos',
            subject: 'Currículo e Percurso Académico',
            creator: 'Portfolio Generator',
            created: new Date().toISOString()
        });

        await html2pdf().set(opt).from(element).save();
        showToast('PDF gerado com sucesso!');
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        showToast('Erro ao gerar PDF. Tente novamente.');
    }
});

// ========== Share Modal ==========
shareBtn.addEventListener('click', () => {
    shareModal.classList.add('active');
    document.getElementById('shareUrl').value = window.location.href;
});

closeShareModal.addEventListener('click', () => {
    shareModal.classList.remove('active');
});

shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
        shareModal.classList.remove('active');
    }
});

// Share buttons
document.getElementById('shareLinkedIn').addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Portfólio Académico - João Miguel Silva Santos');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
});

document.getElementById('shareTwitter').addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Confira o meu portfólio académico! 🎓');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
});

document.getElementById('shareFacebook').addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
});

document.getElementById('shareEmail').addEventListener('click', () => {
    const subject = encodeURIComponent('Portfólio Académico - João Miguel Silva Santos');
    const body = encodeURIComponent(`Olá!\n\nGostaria de partilhar o meu portfólio académico consigo: ${window.location.href}\n\nCumprimentos,\nJoão Santos`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
});

document.getElementById('copyUrl').addEventListener('click', () => {
    copyToClipboard(window.location.href, 'Link copiado!');
});

// ========== Copy Section Link ==========
document.querySelectorAll('.copy-section-link').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        const url = `${window.location.origin}${window.location.pathname}#${section}`;
        copyToClipboard(url, 'Link da secção copiado!');
    });
});

// ========== Utility Functions ==========
function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(message);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(message);
    });
}

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ========== Skill Bars Animation ==========
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';

                setTimeout(() => {
                    bar.style.width = width;
                }, 100);

                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// ========== Keyboard Navigation ==========
document.addEventListener('keydown', (e) => {
    // Close modal with Escape key
    if (e.key === 'Escape' && shareModal.classList.contains('active')) {
        shareModal.classList.remove('active');
    }
});

// ========== Initialize ==========
function init() {
    // Initial state updates
    handleScroll();
    animateSkillBars();

    // Add smooth entrance animations
    const animatedElements = document.querySelectorAll('.education-card, .experience-card, .publication-item, .project-card, .award-item');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    console.log('Portfólio Académico inicializado com sucesso! 🎓');
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// ========== Service Worker Registration (PWA Ready) ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here for PWA support
        // navigator.serviceWorker.register('/sw.js');
    });
}
