// ==================== GLOBAL STATE ====================
let currentCategory = 'all';
let currentSearchTerm = '';
let selectedGame = null;
let isDarkTheme = true;

// ==================== DOM ELEMENTS ====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const searchInput = document.getElementById('searchInput');
const categoryChips = document.querySelectorAll('.chip');
const gamesGrid = document.getElementById('gamesGrid');
const loadingSkeleton = document.getElementById('loadingSkeleton');
const noResults = document.getElementById('noResults');
const gameModal = document.getElementById('gameModal');
const modalClose = document.getElementById('modalClose');
const backBtn = document.getElementById('backBtn');
const themeToggle = document.getElementById('themeToggle');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const gameIframe = document.getElementById('gameIframe');

// ==================== INITIALIZATION ====================
function init() {
    // Load theme preference
    loadTheme();

    // Event listeners
    hamburger.addEventListener('click', toggleMobileMenu);
    searchInput.addEventListener('input', handleSearch);
    categoryChips.forEach(chip => chip.addEventListener('click', handleCategoryFilter));
    modalClose.addEventListener('click', closeModal);
    backBtn.addEventListener('click', closeModal);
    themeToggle.addEventListener('click', toggleTheme);
    fullscreenBtn.addEventListener('click', enterFullscreen);
    gameModal.addEventListener('click', handleModalBackdropClick);

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Initial render with loading state
    setTimeout(() => {
        renderGames();
    }, 800);
}

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// ==================== SEARCH FUNCTIONALITY ====================
function handleSearch(e) {
    currentSearchTerm = e.target.value.toLowerCase();
    renderGames();
}

// ==================== CATEGORY FILTER ====================
function handleCategoryFilter(e) {
    // Remove active class from all chips
    categoryChips.forEach(chip => chip.classList.remove('active'));
    // Add active class to clicked chip
    e.target.classList.add('active');
    currentCategory = e.target.getAttribute('data-category');
    renderGames();
}

// ==================== RENDER GAMES ====================
function renderGames() {
    // Show loading skeleton
    loadingSkeleton.style.display = 'grid';
    gamesGrid.innerHTML = '';
    noResults.style.display = 'none';

    // Simulate network delay
    setTimeout(() => {
        loadingSkeleton.style.display = 'none';

        // Filter games based on category and search term
        const filteredGames = GAMES_DATA.filter(game => {
            const categoryMatch = currentCategory === 'all' || game.category === currentCategory;
            const searchMatch = game.title.toLowerCase().includes(currentSearchTerm) ||
                              game.description.toLowerCase().includes(currentSearchTerm);
            return categoryMatch && searchMatch;
        });

        // Render games or show no results
        if (filteredGames.length === 0) {
            noResults.style.display = 'block';
            gamesGrid.innerHTML = '';
        } else {
            filteredGames.forEach(game => {
                const gameCard = createGameCard(game);
                gamesGrid.appendChild(gameCard);
            });
        }
    }, 500);
}

// ==================== CREATE GAME CARD ====================
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <div class="game-thumbnail">${game.thumbnail}</div>
        <div class="game-info">
            <h3 class="game-title">${game.title}</h3>
            <span class="game-category">${capitalizeCategory(game.category)}</span>
        </div>
    `;

    card.addEventListener('click', () => openGameModal(game));
    return card;
}

// ==================== MODAL FUNCTIONALITY ====================
function openGameModal(game) {
    selectedGame = game;
    document.getElementById('modalTitle').textContent = game.title;
    document.getElementById('modalCategory').textContent = capitalizeCategory(game.category);
    document.getElementById('modalDescription').textContent = game.description;
    document.getElementById('modalControls').textContent = game.controls;
    document.getElementById('gameIframe').src = game.embedUrl;

    gameModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    gameModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    gameIframe.src = '';
    selectedGame = null;
}

function handleModalBackdropClick(e) {
    if (e.target === gameModal) {
        closeModal();
    }
}

// ==================== FULLSCREEN FUNCTIONALITY ====================
function enterFullscreen() {
    const elem = gameIframe;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

// ==================== THEME TOGGLE ====================
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    updateTheme();
}

function updateTheme() {
    const root = document.documentElement;
    if (isDarkTheme) {
        document.body.classList.remove('light-theme');
        themeToggle.querySelector('.theme-icon').textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.add('light-theme');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        isDarkTheme = false;
        updateTheme();
    }
}

// ==================== UTILITY FUNCTIONS ====================
function capitalizeCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// ==================== START APPLICATION ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}