// Datos de ejemplo para las aplicaciones móviles
const appsData = [
    {
        id: 1,
        name: 'Productivity Pro',
        developer: 'Tech Solutions Inc.',
        price: 4.99,
        category: 'Productividad',
        rating: 4.8,
        ratingCount: 1245,
        description: 'La mejor aplicación para aumentar tu productividad diaria con recordatorios inteligentes y seguimiento de tareas.',
        image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Productivity+Pro',
        featured: true,
        onSale: true,
        salePrice: 2.99
    },
    {
        id: 2,
        name: 'Fitness Tracker',
        developer: 'Health & Fitness Co.',
        price: 0,
        category: 'Salud',
        rating: 4.6,
        ratingCount: 892,
        description: 'Sigue tus entrenamientos, cuenta pasos y monitorea tu progreso de salud con esta completa aplicación de fitness.',
        image: 'https://via.placeholder.com/300x200/50E3C2/FFFFFF?text=Fitness+Tracker',
        featured: true,
        isFree: true
    },
    {
        id: 3,
        name: 'Budget Master',
        developer: 'Finance Apps LLC',
        price: 2.99,
        category: 'Finanzas',
        rating: 4.7,
        ratingCount: 756,
        description: 'Controla tus gastos, crea presupuestos y alcanza tus metas financieras con facilidad.',
        image: 'https://via.placeholder.com/300x200/9013FE/FFFFFF?text=Budget+Master',
        featured: true
    },
    {
        id: 4,
        name: 'Photo Editor Pro',
        developer: 'Creative Tools',
        price: 3.99,
        category: 'Fotografía',
        rating: 4.9,
        ratingCount: 2103,
        description: 'Edita fotos como un profesional con herramientas potentes y fáciles de usar.',
        image: 'https://via.placeholder.com/300x200/F5A623/FFFFFF?text=Photo+Editor+Pro',
        featured: true,
        onSale: true,
        salePrice: 1.99
    },
    {
        id: 5,
        name: 'Language Master',
        developer: 'EduTech',
        price: 5.99,
        category: 'Educación',
        rating: 4.5,
        ratingCount: 1532,
        description: 'Aprende nuevos idiomas de manera divertida y efectiva con lecciones interactivas.',
        image: 'https://via.placeholder.com/300x200/7ED321/FFFFFF?text=Language+Master',
        featured: false
    },
    {
        id: 6,
        name: 'Sleep Sounds',
        developer: 'Relaxation Apps',
        price: 2.49,
        category: 'Bienestar',
        rating: 4.3,
        ratingCount: 876,
        description: 'Duerme mejor con sonidos relajantes y seguimiento del sueño.',
        image: 'https://via.placeholder.com/300x200/BD10E0/FFFFFF?text=Sleep+Sounds',
        featured: false
    },
    {
        id: 7,
        name: 'Recipe Finder',
        developer: 'Culinary Arts',
        price: 0,
        category: 'Cocina',
        rating: 4.4,
        ratingCount: 432,
        description: 'Descubre recetas increíbles según los ingredientes que tengas en casa.',
        image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Recipe+Finder',
        featured: false,
        isFree: true
    },
    {
        id: 8,
        name: 'Puzzle Master',
        developer: 'Game Studio',
        price: 1.99,
        category: 'Juegos',
        rating: 4.2,
        ratingCount: 2109,
        description: 'Rompecabezas desafiantes para ejercitar tu mente.',
        image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Puzzle+Master',
        featured: true
    }
];

// Función para formatear el precio
function formatPrice(price) {
    return price === 0 ? 'Gratis' : `$${price.toFixed(2)}`;
}

// Función para generar las estrellas de valoración
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    // Estrellas llenas
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Media estrella si es necesario
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Estrellas vacías
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Función para crear una tarjeta de aplicación
function createAppCard(app) {
    const isOnSale = app.onSale && app.salePrice !== undefined;
    const isFree = app.isFree || app.price === 0;
    
    return `
        <div class="app-card" data-category="${app.category.toLowerCase()}" data-rating="${app.rating}" data-price="${isFree ? 0 : app.price}">
            ${app.onSale ? '<span class="app-badge">Oferta</span>' : ''}
            ${app.featured ? '<span class="app-badge" style="background-color: var(--star-color);">Destacado</span>' : ''}
            
            <img src="${app.image}" alt="${app.name}" class="app-image">
            
            <div class="app-info">
                <div class="app-header">
                    <div>
                        <h3 class="app-title">${app.name}</h3>
                        <p class="app-developer">${app.developer}</p>
                    </div>
                    <div class="app-price">
                        ${isOnSale ? `<span class="original-price" style="text-decoration: line-through; color: var(--muted-foreground); font-size: 0.9rem; margin-right: 0.5rem;">$${app.price.toFixed(2)}</span>` : ''}
                        ${isOnSale ? `$${app.salePrice.toFixed(2)}` : isFree ? 'Gratis' : `$${app.price.toFixed(2)}`}
                    </div>
                </div>
                
                <span class="app-category">${app.category}</span>
                
                <p class="app-description">${app.description}</p>
                
                <div class="app-footer">
                    <div class="app-rating">
                        ${generateRatingStars(app.rating)}
                        <span class="rating-count">(${app.ratingCount})</span>
                    </div>
                    
                    <div class="app-actions">
                        <button class="btn-icon btn-heart" data-app-id="${app.id}">
                            <i class="${app.isFavorite ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <button class="btn-icon btn-cart" data-app-id="${app.id}">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para renderizar las aplicaciones
function renderApps(containerId, apps) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = apps.map(app => createAppCard(app)).join('');
}

// Función para inicializar la funcionalidad de filtrado
function initFiltering() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortApps(this.value);
        });
    }
    
    // Filtrado por categoría
    const categoryLinks = document.querySelectorAll('.category-card');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.querySelector('h3').textContent;
            filterByCategory(category);
        });
    });
}

// Función para ordenar aplicaciones
function sortApps(criteria) {
    const container = document.getElementById('topApps');
    if (!container) return;
    
    const appCards = Array.from(container.querySelectorAll('.app-card'));
    
    appCards.sort((a, b) => {
        const ratingA = parseFloat(a.dataset.rating);
        const ratingB = parseFloat(b.dataset.rating);
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        
        switch(criteria) {
            case 'popular':
                // Ordenar por popularidad (en este caso, por rating count, pero necesitaríamos ese dato)
                return 0; // Implementar lógica real
            case 'newest':
                // Ordenar por más recientes (necesitaríamos una fecha de lanzamiento)
                return 0; // Implementar lógica real
            case 'top-rated':
                return ratingB - ratingA;
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            default:
                return 0;
        }
    });
    
    // Reorganizar los elementos en el DOM
    appCards.forEach(card => container.appendChild(card));
}

// Función para filtrar por categoría
function filterByCategory(category) {
    const container = document.getElementById('topApps');
    if (!container) return;
    
    const appCards = container.querySelectorAll('.app-card');
    const normalizedCategory = category.toLowerCase();
    
    appCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (normalizedCategory === 'todas' || cardCategory === normalizedCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Actualizar la categoría activa
    document.querySelectorAll('.category-card').forEach(card => {
        if (card.querySelector('h3').textContent.toLowerCase() === normalizedCategory) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    
    // Desplazarse a la sección de aplicaciones
    document.getElementById('top-apps').scrollIntoView({ behavior: 'smooth' });
}

// Función para inicializar el menú móvil
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('open');
            this.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
}

// Función para el botón de volver arriba
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Función para manejar la funcionalidad de favoritos
function initFavorites() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-heart')) {
            const button = e.target.closest('.btn-heart');
            const icon = button.querySelector('i');
            const appId = button.dataset.appId;
            
            // Alternar clase de favorito
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            
            // Aquí podrías guardar en localStorage o hacer una petición al servidor
            console.log(`App ${appId} ${icon.classList.contains('fas') ? 'añadida a' : 'eliminada de'} favoritos`);
        }
    });
}

// Función para manejar la funcionalidad del carrito
function initCart() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-cart')) {
            const button = e.target.closest('.btn-cart');
            const appId = button.dataset.appId;
            
            // Aquí podrías añadir al carrito y mostrar una notificación
            showNotification('Aplicación añadida al carrito');
            updateCartCount(1); // Incrementar contador del carrito
            
            console.log(`App ${appId} añadida al carrito`);
        }
    });
}

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Estilos para la notificación
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#34c759';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Añadir al documento
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        // Eliminar del DOM después de la animación
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Función para actualizar el contador del carrito
function updateCartCount(change) {
    let cartCount = localStorage.getItem('cartCount') || 0;
    cartCount = parseInt(cartCount) + change;
    localStorage.setItem('cartCount', cartCount);
    
    // Actualizar el contador en la interfaz si existe
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

// Función para inicializar el carrusel de aplicaciones destacadas
function initFeaturedCarousel() {
    const featuredContainer = document.getElementById('featuredApps');
    if (!featuredContainer) return;
    
    // Asegurarse de que solo se muestren aplicaciones destacadas
    const featuredApps = appsData.filter(app => app.featured);
    
    // Renderizar aplicaciones destacadas
    renderApps('featuredApps', featuredApps);
}

// Función para inicializar la búsqueda
function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (!searchInput || !searchButton) return;
    
    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            // Si la búsqueda está vacía, mostrar todas las aplicaciones
            renderApps('topApps', appsData);
            return;
        }
        
        // Filtrar aplicaciones que coincidan con la búsqueda
        const filteredApps = appsData.filter(app => 
            app.name.toLowerCase().includes(query) || 
            app.description.toLowerCase().includes(query) ||
            app.developer.toLowerCase().includes(query) ||
            app.category.toLowerCase().includes(query)
        );
        
        // Renderizar resultados
        renderApps('topApps', filteredApps);
        
        // Mostrar mensaje si no hay resultados
        const container = document.getElementById('topApps');
        if (filteredApps.length === 0 && container) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron resultados para "${query}"</h3>
                    <p>Intenta con otras palabras clave o categorías.</p>
                </div>
            `;
        }
    };
    
    // Evento al hacer clic en el botón de búsqueda
    searchButton.addEventListener('click', performSearch);
    
    // Evento al presionar Enter en el campo de búsqueda
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Función para inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar aplicaciones destacadas
    initFeaturedCarousel();
    
    // Renderizar todas las aplicaciones
    renderApps('topApps', appsData);
    
    // Inicializar funcionalidades
    initFiltering();
    initMobileMenu();
    initBackToTop();
    initFavorites();
    initCart();
    initSearch();
    
    // Actualizar contador del carrito al cargar la página
    const cartCount = localStorage.getItem('cartCount') || 0;
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
    }
});

// Manejar el evento de carga de imágenes para evitar el efecto de salto
window.addEventListener('load', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete && img.naturalHeight === 0) {
            // Imagen rota o no cargada
            img.style.display = 'none';
        }
    });
});
