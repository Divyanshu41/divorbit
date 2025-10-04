// Minimal JS for portfolio: year, smooth scroll, typewriter, reveal, theme toggle, cert modal
document.addEventListener('DOMContentLoaded', () => {
    // Year
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }));

    // Typewriter
    (function() {
        const el = document.querySelector('.typewriter');
        if (!el) return;
        const phrases = JSON.parse(el.getAttribute('data-phrases') || '[]');
        let pi = 0,
            ci = 0,
            deleting = false;

        function tick() {
            const current = phrases[pi] || '';
            if (!deleting) {
                el.textContent = current.slice(0, ci + 1);
                ci++;
                if (ci >= current.length) {
                    deleting = true;
                    setTimeout(tick, 1200);
                    return;
                }
            } else {
                el.textContent = current.slice(0, ci - 1);
                ci--;
                if (ci <= 0) {
                    deleting = false;
                    pi = (pi + 1) % phrases.length;
                }
            }
            setTimeout(tick, deleting ? 60 : 80);
        }
        tick();
    })();

    // Reveal observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('main > section, .project').forEach((el, idx) => {
        el.classList.add('before-reveal');
        // dataset.index might be undefined; use idx as fallback
        const dataIndex = (typeof el.dataset.index !== 'undefined' && el.dataset.index !== '') ? el.dataset.index : idx;
        el.style.setProperty('--i', dataIndex);
        revealObserver.observe(el);
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');

    function applyTheme(name) {
        if (name === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeToggle) {
                themeToggle.textContent = '☀️';
                themeToggle.setAttribute('aria-pressed', 'true')
            }
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeToggle) {
                themeToggle.textContent = '🌙';
                themeToggle.setAttribute('aria-pressed', 'false')
            }
        }
    }
    (function initTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) { applyTheme(saved); return }
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(prefersLight ? 'light' : 'dark');
    })();
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const next = isLight ? 'dark' : 'light';
            applyTheme(next === 'light' ? 'light' : 'dark');
            localStorage.setItem('theme', next);
        });
    }

    // Certificates modal
    const certModal = document.getElementById('cert-modal');
    const certFrame = document.getElementById('cert-frame');
    const certClose = document.getElementById('cert-close');
    document.querySelectorAll('.cert-view').forEach(btn => { btn.addEventListener('click', e => { e.preventDefault(); const src = btn.dataset.src; if (certFrame) certFrame.src = src; if (certModal) { certModal.setAttribute('aria-hidden', 'false'); } }); });
    if (certClose) certClose.addEventListener('click', () => { if (certModal) certModal.setAttribute('aria-hidden', 'true'); if (certFrame) certFrame.src = ''; });
    if (certModal) certModal.addEventListener('click', (e) => { if (e.target === certModal) { certModal.setAttribute('aria-hidden', 'true'); if (certFrame) certFrame.src = ''; } });

});