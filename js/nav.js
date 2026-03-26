document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const navUl = document.querySelector('nav > ul');

    if (!toggle || !navUl) return;

    toggle.addEventListener('click', () => {
        const isOpen = navUl.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is tapped
    navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navUl.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside the nav
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav')) {
            navUl.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
});
