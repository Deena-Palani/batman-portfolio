/**
 * Deena Palani Portfolio - Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu ---
    const navMenu = document.getElementById('nav-menu'),
          navToggle = document.getElementById('nav-toggle'),
          navClose = document.getElementById('nav-close');

    if(navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
    if(navClose) navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));

    // --- Active Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight,
                  sectionTop = current.offsetTop - 100,
                  sectionId = current.getAttribute('id'),
                  navItem = document.querySelector(`.nav__menu a[href*=${sectionId}]`);
           
            if(navItem) {
                if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navItem.classList.add('active-link');
                } else {
                    navItem.classList.remove('active-link');
                }
            }
        });
    });

    // --- Theme Toggle ---
    const themeButton = document.getElementById('theme-button');
    const darkTheme = 'light-theme'; // Class added to switch to light
    const iconTheme = 'ri-sun-line';

    themeButton.addEventListener('click', () => {
        document.body.classLi
...
