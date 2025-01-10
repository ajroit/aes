document.addEventListener('DOMContentLoaded', function() {


    // Funcionalidad para el menú móvil
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('active');
    });


});