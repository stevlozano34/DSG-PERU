// --- API endpoints para DSG Backend ---
const API_BASE_URL = "http://localhost:3000";
const LOGIN_API_URL = `${API_BASE_URL}/auth/login`;
const REGISTRO_API_URL = `${API_BASE_URL}/auth/register`;

// Función para cargar cuentas registradas (actualizada para tu BD)
console.log('🔍 LOGIN_API.JS CARGADO');
console.log('🔍 API_BASE_URL:', API_BASE_URL);

// Modificar la función loadRegisteredAccounts para más logs
async function loadRegisteredAccounts() {
    console.log('🔍 INICIANDO loadRegisteredAccounts');
    console.log('🔍 URL completa:', `${API_BASE_URL}/api/users/list`);
    
    try {
        console.log('🔍 Haciendo fetch...');
        const response = await fetch(`${API_BASE_URL}/api/users/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('🔍 Respuesta recibida:', response);
        console.log('🔍 Status:', response.status);
        console.log('🔍 OK:', response.ok);
        
        if (response.ok) {
            const data = await response.json();
            console.log('🔍 Datos parseados:', data);
            console.log('🔍 data.success:', data.success);
            console.log('🔍 data.users:', data.users);
            console.log('🔍 Cantidad de usuarios:', data.users ? data.users.length : 'undefined');
            
            if (data.success && data.users && data.users.length > 0) {
                console.log('🔍 Llamando displayAccountSelector con:', data.users);
                displayAccountSelector(data.users);
                return true;
            } else {
                console.log('🔍 No hay usuarios o respuesta no exitosa');
                console.log('🔍 Contenedor existe:', !!document.getElementById('account-selector-container'));
            }
        } else {
            console.log('🔍 Error en respuesta:', response.status, response.statusText);
            const errorText = await response.text();
            console.log('🔍 Error text:', errorText);
        }
        return false;
    } catch (error) {
        console.error('🔍 Error en catch:', error);
        return false;
    }
}

// Función para mostrar selector de cuentas (actualizada para tu BD)
function displayAccountSelector(users) {
    const container = document.getElementById('account-selector-container');
    const loginForm = document.querySelector('.login-form');
    
    if (!container) return;
    
    // Función para obtener emoji de categoría de negocio
    function getCategoryEmoji(category) {
        switch(category) {
            case 'restaurante': return '🍽️';
            case 'botica': return '💊';
            case 'minimarket': return '🏪';
            default: return '🏢';
        }
    }
    
    // Función para obtener avatar
    function getAvatar(user) {
        if (user.foto_perfil) {
            return `<img src="${user.foto_perfil}" alt="${user.nombre}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">`;
        }
        // Avatar por defecto con iniciales
        const initials = `${user.nombre.charAt(0)}${user.apellido ? user.apellido.charAt(0) : ''}`;
        return `<div style="width: 40px; height: 40px; border-radius: 50%; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">${initials}</div>`;
    }
    
    // Crear selector de cuentas
    const accountSelector = document.createElement('div');
    accountSelector.className = 'account-selector';
    accountSelector.innerHTML = `
        <h3>👥 Cuentas Registradas</h3>
        <div class="accounts-list">
            ${users.map(user => `
                <div class="account-item" data-email="${user.email}" data-user-id="${user.id}" data-user-type="${user.user_type}">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        ${getAvatar(user)}
                        <div class="account-info">
                            <strong>${user.nombre} ${user.apellido || ''}</strong>
                            <span>${user.email}</span>
                            ${user.company_name ? `<small>${getCategoryEmoji(user.business_category)} ${user.company_name}</small>` : ''}
                        </div>
                    </div>
                    <span class="account-type ${user.user_type === 'admin' ? 'admin' : ''}">
                        ${user.user_type === 'admin' ? '👑 Admin' : getCategoryEmoji(user.business_category) + ' ' + (user.business_category || 'Empresa')}
                    </span>
                </div>
            `).join('')}
        </div>
        <button type="button" id="use-different-account">➕ Usar cuenta diferente</button>
    `;
    
    // Insertar en el contenedor
    container.appendChild(accountSelector);
    
    // Manejar selección de cuenta
    accountSelector.addEventListener('click', function(e) {
        const accountItem = e.target.closest('.account-item');
        if (accountItem) {
            const email = accountItem.dataset.email;
            const userType = accountItem.dataset.userType;
            
            // Llenar el email automáticamente
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = email;
                emailInput.focus();
            }
            
            // Enfocar el campo de contraseña
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                passwordInput.focus();
            }
            
            // Actualizar el botón de submit
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.textContent = userType === 'admin' ? 'Iniciar Sesión como Administrador' : 'Iniciar Sesión como Usuario';
            }
            
            // Mostrar notificación
            if (window.showNotification) {
                window.showNotification(`Cuenta seleccionada: ${email}`, 'info');
            }
            
            // Actualizar tipo de acceso seleccionado
            const accessButtons = document.querySelectorAll('.access-type__button');
            accessButtons.forEach(btn => {
                btn.classList.remove('selected');
                if (btn.getAttribute('data-type') === userType) {
                    btn.classList.add('selected');
                }
            });
        }
    });
    
    // Manejar botón "usar cuenta diferente"
    const useDifferentBtn = accountSelector.querySelector('#use-different-account');
    if (useDifferentBtn) {
        useDifferentBtn.addEventListener('click', function() {
            // Limpiar campos
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            if (emailInput) emailInput.value = '';
            if (passwordInput) passwordInput.value = '';
            
            // Resetear selección de tipo de acceso
            const accessButtons = document.querySelectorAll('.access-type__button');
            accessButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Enfocar email
            if (emailInput) emailInput.focus();
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // --- UI: Label animation for inputs and textareas ---
    document.querySelectorAll('.contenedor-formularios input, .contenedor-formularios textarea').forEach(function (input) {
        var label = input.previousElementSibling;
        function updateLabel(e) {
            if (e.type === "keyup") {
                if (input.value === "") {
                    label.classList.remove("active", "highlight");
                } else {
                    label.classList.add("active", "highlight");
                }
            } else if (e.type === "blur") {
                if (input.value === "") {
                    label.classList.remove("active", "highlight");
                } else {
                    label.classList.remove("highlight");
                }
            } else if (e.type === "focus") {
                if (input.value === "") {
                    label.classList.remove("highlight");
                } else if (input.value !== "") {
                    label.classList.add("highlight");
                }
            }
        }
        input.addEventListener("keyup", updateLabel);
        input.addEventListener("blur", updateLabel);
        input.addEventListener("focus", updateLabel);
    });

    // --- UI: Tab switching logic ---
    document.querySelectorAll(".tab a").forEach(function (tabLink) {
        tabLink.addEventListener("click", function (e) {
            e.preventDefault();
            var parentLi = tabLink.parentElement;
            var siblings = parentLi.parentElement.children;
            Array.prototype.forEach.call(siblings, function (li) {
                li.classList.remove("active");
            });
            parentLi.classList.add("active");
            var target = tabLink.getAttribute("href");
            document.querySelectorAll(".contenido-tab > div").forEach(function (div) {
                if ("#" + div.id === target) {
                    div.style.display = "block";
                    div.style.opacity = 0;
                    setTimeout(function () {
                        div.style.transition = "opacity 0.6s";
                        div.style.opacity = 1;
                    }, 10);
                } else {
                    div.style.display = "none";
                    div.style.opacity = 0;
                }
            });
        });
    });
    var firstTab = document.querySelector(".tab.active a");
    if (firstTab) {
        var event = new Event('click');
        firstTab.dispatchEvent(event);
    }

    // --- UI: Panel switching for alternate design (if present) ---
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");
    if (sign_up_btn && sign_in_btn && container) {
        sign_up_btn.addEventListener("click", () => {
            container.classList.add("sign-up-mode");
        });
        sign_in_btn.addEventListener("click", () => {
            container.classList.remove("sign-up-mode");
        });
    }

    // --- Password show/hide toggles ---
    const togglePasswordSignin = document.querySelector("#toggle-password-signin");
    const passwordInputSignin = document.querySelector("#sign-in-password");
    if (togglePasswordSignin && passwordInputSignin) {
        togglePasswordSignin.addEventListener("click", () => {
            const type = passwordInputSignin.getAttribute("type") === "password" ? "text" : "password";
            passwordInputSignin.setAttribute("type", type);
            togglePasswordSignin.innerHTML =
                type === "password" ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Password toggle para login_prueba.html
    const passwordToggle = document.getElementById('password-toggle');
    const passwordInput = document.getElementById('password');
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            if (type === 'text') {
                this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
            } else {
                this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
            }
        });
    }

    const togglePasswordSignup = document.querySelector("#toggle-password-signup");
    const passwordInputSignup = document.querySelector("#sign-up-password");
    if (togglePasswordSignup && passwordInputSignup) {
        togglePasswordSignup.addEventListener("click", () => {
            const type = passwordInputSignup.getAttribute("type") === "password" ? "text" : "password";
            passwordInputSignup.setAttribute("type", type);
            togglePasswordSignup.innerHTML =
                type === "password" ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // --- Password validation helper ---
    function validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    // --- Usar el sistema de notificaciones existente ---
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            background-color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;padding:0;width:20px;height:20px;">&times;</button>
            </div>
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // --- API endpoints para DSG Backend ---
    const API_BASE_URL = "http://localhost:3000"; // Mantener consistente
    const LOGIN_API_URL = `${API_BASE_URL}/auth/login`;
    const REGISTRO_API_URL = `${API_BASE_URL}/auth/register`;

    // --- Manejo de tipo de acceso ---
    const accessButtons = document.querySelectorAll('.access-type__button');
    let selectedAccessType = 'business';
    
    accessButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase selected de todos los botones
            accessButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Agregar clase selected al botón clickeado
            this.classList.add('selected');
            
            // Actualizar tipo seleccionado
            selectedAccessType = this.getAttribute('data-type');
            
            // Actualizar texto del botón de submit
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                if (selectedAccessType === 'admin') {
                    submitBtn.textContent = 'Iniciar Sesión como Administrador';
                } else {
                    submitBtn.textContent = 'Iniciar Sesión como Usuario';
                }
            }
        });
    });

    // --- Login handler (API DSG) ---
    const loginForm = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInputLogin = document.getElementById('password');
    const submitButton = document.getElementById('submit-btn');
    
    if (loginForm && emailInput && passwordInputLogin) {
        // Manejar envío del formulario
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleLoginSubmission();
        });
        
        // También manejar click en el botón/enlace de submit
        if (submitButton) {
            submitButton.addEventListener('click', async function(e) {
                e.preventDefault();
                await handleLoginSubmission();
            });
        }
    }
    
    async function handleLoginSubmission() {
        const email = emailInput.value.trim();
        const password = passwordInputLogin.value;
        
        if (!email || !password) {
            showNotification("Email y contraseña son obligatorios.", "error");
            return;
        }
        
        if (!email.includes('@')) {
            showNotification("Por favor ingresa un email válido.", "error");
            return;
        }
        
        const originalText = submitButton ? submitButton.textContent : 'Iniciar Sesión';
        
        try {
            if (submitButton) {
                submitButton.textContent = 'Iniciando sesión...';
                submitButton.style.pointerEvents = 'none';
            }
            
            console.log('Intentando login con:', { email, selectedAccessType });
            
            const response = await fetch(LOGIN_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });
            
            const contentType = response.headers.get("content-type");
            
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                // Manejar respuesta de error
                if (contentType && contentType.includes("application/json")) {
                    const error = await response.json();
                    throw new Error(error.error || error.message || "Error en el inicio de sesión");
                } else {
                    const text = await response.text();
                    throw new Error("Respuesta inesperada del servidor: " + text.substring(0, 100) + "...");
                }
            }
            
            // Procesar respuesta exitosa
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                console.log('Respuesta del login:', data);
                
                if (data.success) {
                    // Guardar información del usuario y token
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userProfile', JSON.stringify(data.user));
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    showNotification("Bienvenido/a " + data.user.nombre + ".", "success");
                    
                    // Limpiar formulario
                    loginForm.reset();
                    
                    // Redirigir según el tipo de usuario o acceso seleccionado
                    setTimeout(() => {
                        if (data.user.user_type === 'admin' || selectedAccessType === 'admin') {
                            window.location.href = "/DSG/frontend/pages/pages/dashboard/dashboard.html";
                        } else {
                            window.location.href = "/DSG/frontend/pages/pages/dashboard/dashboard.html";
                        }
                    }, 1500);
                } else {
                    throw new Error(data.message || "Error en el inicio de sesión");
                }
            } else {
                throw new Error("Respuesta del servidor no es JSON válido");
            }
        } catch (error) {
            console.error('Error completo:', error);
            showNotification(error.message, 'error');
        } finally {
            if (submitButton) {
                submitButton.textContent = originalText;
                submitButton.style.pointerEvents = 'auto';
            }
        }
    }

    // --- Registro handler (API DSG) - si existe formulario de registro ---
    const formRegistro = document.getElementById("form-registrarse");
    if (formRegistro) {
        formRegistro.addEventListener("submit", async function (e) {
            e.preventDefault();
            const nombre = formRegistro.querySelector('input[name="nombre"]').value;
            const apellido = formRegistro.querySelector('input[name="apellido"]')?.value || '';
            const email = formRegistro.querySelector('input[name="email"]').value;
            const password = formRegistro.querySelector('input[name="password"]').value;
            const repeat_password = formRegistro.querySelector('input[name="repeat_password"]')?.value;
            const company_name = formRegistro.querySelector('input[name="company_name"]')?.value || '';
            const business_category = formRegistro.querySelector('input[name="business_category"]')?.value || '';

            if (!nombre || !email || !password) {
                showNotification("Nombre, email y contraseña son obligatorios.", "error");
                return;
            }
            
            if (repeat_password && password !== repeat_password) {
                showNotification("Las contraseñas no coinciden.", "error");
                return;
            }
            
            if (!validatePassword(password)) {
                showNotification("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.", "error");
                return;
            }
            
            try {
                const response = await fetch(REGISTRO_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre,
                        apellido,
                        email,
                        password,
                        company_name,
                        business_category,
                        user_type: 'business' // Por defecto
                    }),
                });

                const contentType = response.headers.get("content-type");
                if (!response.ok) {
                    if (contentType && contentType.includes("application/json")) {
                        const error = await response.json();
                        throw new Error(error.error || "Error en el registro");
                    } else {
                        const text = await response.text();
                        throw new Error("Respuesta inesperada del servidor: " + text.substring(0, 100) + "...");
                    }
                }

                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    showNotification("Tu cuenta ha sido creada correctamente.", "success");
                    formRegistro.reset();
                    setTimeout(() => {
                        window.location.href = "/DSG/frontend/pages/pages/auth/login_prueba.html";
                    }, 1500);
                } else {
                    showNotification("Registro completado.", "success");
                    formRegistro.reset();
                    setTimeout(() => {
                        window.location.href = "/DSG/frontend/pages/pages/auth/login_prueba.html";
                    }, 1500);
                }
            } catch (error) {
                showNotification(error.message, "error");
            }
        });
    }

    // --- Funciones de autenticación social ---
    function setupSocialLogin() {
        // Google Login
        const googleButton = document.querySelector('.social-button:first-child');
        if (googleButton) {
            googleButton.addEventListener('click', function(e) {
                e.preventDefault();
                // Redirigir al backend para autenticación con Google
                window.location.href = `${API_BASE_URL}/auth/google`;
            });
        }
        
        // Facebook Login
        const facebookButton = document.querySelector('.social-button:last-child');
        if (facebookButton) {
            facebookButton.addEventListener('click', function(e) {
                e.preventDefault();
                // Redirigir al backend para autenticación con Facebook
                window.location.href = `${API_BASE_URL}/auth/facebook`;
            });
        }
    }

    // --- Verificar si el usuario ya está logueado ---
    function checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const authToken = localStorage.getItem('authToken');
        
        if (isLoggedIn === 'true' && authToken) {
            // Usuario ya está logueado, redirigir al dashboard
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            console.log('Usuario ya autenticado:', userProfile);
            // Opcional: redirigir automáticamente
            // window.location.href = '/dashboard/dashboard.html';
        }
    }
    
    // Verificar estado de autenticación al cargar la página
    checkAuthStatus();
    
    // Configurar botones de login social
    setupSocialLogin();
    
    // --- Función para logout (para usar en otras páginas) ---
    window.logout = function() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/DSG/frontend/pages/pages/auth/login_prueba.html';
    };
    
    // --- Función para obtener el token de autenticación ---
    window.getAuthToken = function() {
        return localStorage.getItem('authToken');
    };
    
    // --- Función para obtener el perfil del usuario ---
    window.getUserProfile = function() {
        const profile = localStorage.getItem('userProfile');
        return profile ? JSON.parse(profile) : null;
    };
    
    // --- Hacer la función disponible globalmente ---
    window.showNotification = showNotification;
});

// Google Login alternativo
function handleGoogleLogin() {
    // Implementar Google Sign-In API
    showNotification('Configurando autenticación con Google...', 'info');
    // Aquí irían las llamadas a la API de Google
}

// Facebook Login alternativo  
function handleFacebookLogin() {
    // Implementar Facebook Login API
    showNotification('Configurando autenticación con Facebook...', 'info');
    // Aquí irían las llamadas a la API de Facebook
}

// Función para cargar cuentas registradas (actualizada para tu BD)
// Agregar al inicio del archivo, después de las constantes
console.log('🔍 LOGIN_API.JS CARGADO');
console.log('🔍 API_BASE_URL:', API_BASE_URL);

// Modificar la función loadRegisteredAccounts para más logs
async function loadRegisteredAccounts() {
    console.log('🔍 INICIANDO loadRegisteredAccounts');
    console.log('🔍 URL completa:', `${API_BASE_URL}/api/users/list`);
    
    try {
        console.log('🔍 Haciendo fetch...');
        const response = await fetch(`${API_BASE_URL}/api/users/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('🔍 Respuesta recibida:', response);
        console.log('🔍 Status:', response.status);
        console.log('🔍 OK:', response.ok);
        
        if (response.ok) {
            const data = await response.json();
            console.log('🔍 Datos parseados:', data);
            console.log('🔍 data.success:', data.success);
            console.log('🔍 data.users:', data.users);
            console.log('🔍 Cantidad de usuarios:', data.users ? data.users.length : 'undefined');
            
            if (data.success && data.users && data.users.length > 0) {
                console.log('🔍 Llamando displayAccountSelector con:', data.users);
                displayAccountSelector(data.users);
                return true;
            } else {
                console.log('🔍 No hay usuarios o respuesta no exitosa');
                console.log('🔍 Contenedor existe:', !!document.getElementById('account-selector-container'));
            }
        } else {
            console.log('🔍 Error en respuesta:', response.status, response.statusText);
            const errorText = await response.text();
            console.log('🔍 Error text:', errorText);
        }
        return false;
    } catch (error) {
        console.error('🔍 Error en catch:', error);
        return false;
    }
}

// Función para mostrar selector de cuentas (actualizada para tu BD)
function displayAccountSelector(users) {
    const container = document.getElementById('account-selector-container');
    const loginForm = document.querySelector('.login-form');
    
    if (!container) return;
    
    // Función para obtener emoji de categoría de negocio
    function getCategoryEmoji(category) {
        switch(category) {
            case 'restaurante': return '🍽️';
            case 'botica': return '💊';
            case 'minimarket': return '🏪';
            default: return '🏢';
        }
    }
    
    // Función para obtener avatar
    function getAvatar(user) {
        if (user.foto_perfil) {
            return `<img src="${user.foto_perfil}" alt="${user.nombre}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">`;
        }
        // Avatar por defecto con iniciales
        const initials = `${user.nombre.charAt(0)}${user.apellido ? user.apellido.charAt(0) : ''}`;
        return `<div style="width: 40px; height: 40px; border-radius: 50%; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">${initials}</div>`;
    }
    
    // Crear selector de cuentas
    const accountSelector = document.createElement('div');
    accountSelector.className = 'account-selector';
    accountSelector.innerHTML = `
        <h3>👥 Cuentas Registradas</h3>
        <div class="accounts-list">
            ${users.map(user => `
                <div class="account-item" data-email="${user.email}" data-user-id="${user.id}" data-user-type="${user.user_type}">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        ${getAvatar(user)}
                        <div class="account-info">
                            <strong>${user.nombre} ${user.apellido || ''}</strong>
                            <span>${user.email}</span>
                            ${user.company_name ? `<small>${getCategoryEmoji(user.business_category)} ${user.company_name}</small>` : ''}
                        </div>
                    </div>
                    <span class="account-type ${user.user_type === 'admin' ? 'admin' : ''}">
                        ${user.user_type === 'admin' ? '👑 Admin' : getCategoryEmoji(user.business_category) + ' ' + (user.business_category || 'Empresa')}
                    </span>
                </div>
            `).join('')}
        </div>
        <button type="button" id="use-different-account">➕ Usar cuenta diferente</button>
    `;
    
    // Insertar en el contenedor
    container.appendChild(accountSelector);
    
    // Manejar selección de cuenta
    accountSelector.addEventListener('click', function(e) {
        const accountItem = e.target.closest('.account-item');
        if (accountItem) {
            const email = accountItem.dataset.email;
            const userType = accountItem.dataset.userType;
            
            // Llenar el email automáticamente
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = email;
            }
            
            // Seleccionar el tipo de acceso correcto
            const accessButtons = document.querySelectorAll('.access-type__button');
            accessButtons.forEach(btn => {
                btn.classList.remove('selected');
                if (btn.dataset.type === userType) {
                    btn.classList.add('selected');
                    selectedAccessType = userType;
                }
            });
            
            // Mostrar formulario y ocultar selector
            accountSelector.style.display = 'none';
            loginForm.classList.remove('hidden');
            loginForm.style.display = 'block';
            
            // Enfocar en el campo de contraseña
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                passwordInput.focus();
            }
            
            // Actualizar texto del botón
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.textContent = userType === 'admin' ? 
                    'Iniciar Sesión como Administrador' : 
                    'Iniciar Sesión como Usuario';
            }
            
            // Mostrar notificación
            showNotification(`Cuenta seleccionada: ${email}`, 'info');
        }
    });
    
    // Manejar "usar cuenta diferente"
    document.getElementById('use-different-account').addEventListener('click', function() {
        accountSelector.style.display = 'none';
        loginForm.classList.remove('hidden');
        loginForm.style.display = 'block';
        
        // Limpiar campos
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        
        // Resetear selección de tipo de acceso
        const accessButtons = document.querySelectorAll('.access-type__button');
        accessButtons.forEach(btn => btn.classList.remove('selected'));
        selectedAccessType = 'business';
    });
    
    // Ocultar formulario inicialmente si hay cuentas
    if (users.length > 0) {
        loginForm.classList.add('hidden');
        loginForm.style.display = 'none';
    }
}

// Cargar cuentas automáticamente al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    // ... existing code ...
    
    // Cargar cuentas registradas automáticamente
    setTimeout(() => {
        loadRegisteredAccounts();
    }, 500);
    
    });