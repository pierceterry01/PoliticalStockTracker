// Adds functionality to the account menu on the homepage
function toggleAccountMenu() {
    const accountMenu = document.getElementById('account-menu');
    
    if (accountMenu.style.display === 'block') {
        accountMenu.style.display = 'none';
    } else {
        accountMenu.style.display = 'block';
    }
}

// Adds functionality to the hamburger menu on the homepage
function toggleMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');

    hamburger.classList.toggle('active');

    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

// Makes it so clicking anywhere on the screen while the menu options are displays closes them
document.addEventListener('click', function(event) {
    const accountMenu = document.getElementById('account-menu');
    const hamburgerMenu = document.getElementById('menu');

    // Checks account menu
    if (!event.target.closest('.user-icon') && !accountMenu.contains(event.target)) {
        accountMenu.style.display = 'none'; // Hide the account menu
    }
    // Checks hamburger menu
    if (!event.target.closest('#hamburger') && !hamburgerMenu.contains(event.target)) {
        hamburgerMenu.style.display = 'none'; 
    }
});
