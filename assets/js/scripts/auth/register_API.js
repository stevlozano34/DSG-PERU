// API endpoints para DSG Backend
const API_BASE_URL = "http://localhost:3000";
const REGISTRO_API_URL = `${API_BASE_URL}/auth/register`;

document.addEventListener("DOMContentLoaded", function () {
    // Referencias a elementos del DOM
    const signupForm = document.querySelector('.signup-form');
    const emailInput = document.getElementById('email');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const companyNameInput = document.getElementById('company-name');
    const businessCategorySelect = document.getElementById('business-category');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const submitButton = document.getElementById('submit-btn');
    
    // Botones de tipo de cuenta
    const businessTypeBtn = document.getElementById('business-type');
    const adminTypeBtn = document.getElementById('admin-type');
    const businessFields = document.getElementById('business-fields');
    
    let selectedAccountType = 'business';
    
    // Manejar selección de tipo de cuenta
    if (businessTypeBtn && adminTypeBtn) {
        businessTypeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            selectAccountType('business');
        });
        
        adminTypeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            selectAccountType('admin');
        });
    }
    
    function selectAccountType(type) {
        selectedAccountType = type;
        
        // Actualizar UI
        businessTypeBtn?.classList.remove('selected');
        adminTypeBtn?.classList.remove('selected');
        
        if (type === 'business') {
            businessTypeBtn?.classList.add('selected');
            businessFields.style.display = 'block';
            submitButton.textContent = 'Crear Cuenta Usuario Empresarial';
        } else {
            adminTypeBtn?.classList.add('selected');
            businessFields.style.display = 'none';
            submitButton.textContent = 'Crear Cuenta Administrador';
        }
    }
    
    // Configurar toggles de contraseña
    setupPasswordToggles();
    
    // Manejar envío del formulario
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleRegistration();
        });
    }
    
    // Función principal de registro
    async function handleRegistration() {
        // Obtener valores
        const email = emailInput?.value.trim() || '';
        const nombre = nombreInput?.value.trim() || '';
        const apellido = apellidoInput?.value.trim() || '';
        const password = passwordInput?.value || '';
        const confirmPassword = confirmPasswordInput?.value || '';
        
        // Validaciones básicas
        if (!email || !nombre || !password || !confirmPassword) {
            showNotification("Email, nombre, contraseña y confirmación son obligatorios.", "error");
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification("Por favor ingresa un email válido.", "error");
            return;
        }
        
        if (!validatePassword(password)) {
            showNotification("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.", "error");
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification("Las contraseñas no coinciden.", "error");
            return;
        }
        
        // Preparar datos según el tipo de cuenta
        const userData = {
            email: email,
            password: password,
            nombre: nombre,
            apellido: apellido,
            userType: selectedAccountType
        };
        
        // Agregar campos empresariales si es necesario
        if (selectedAccountType === 'business') {
            userData.companyName = companyNameInput?.value.trim() || '';
            userData.businessCategory = businessCategorySelect?.value || '';
            userData.celular = phoneInput?.value.trim() || '';
        }
        
        // Cambiar estado del botón
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Creando cuenta...';
        submitButton.disabled = true;
        
        try {
            console.log('Registrando usuario:', userData);
            
            const response = await fetch(REGISTRO_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            
            const contentType = response.headers.get("content-type");
            
            if (!response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const error = await response.json();
                    throw new Error(error.message || "Error en el registro");
                } else {
                    const text = await response.text();
                    throw new Error("Respuesta inesperada del servidor: " + text.substring(0, 100) + "...");
                }
            }
            
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                console.log('Respuesta del registro:', data);
                
                if (data.success) {
                    // Guardar información del usuario
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userProfile', JSON.stringify(data.user));
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    showNotification(`¡Cuenta creada exitosamente para ${data.user.nombre}! Serás redirigido al login.`, "success");
                    
                    // Limpiar formulario
                    signupForm.reset();
                    
                    // Redirigir según el tipo de usuario
                    setTimeout(() => {
        window.location.href = '/DSG/frontend/pages/pages/auth/login_prueba.html';
    }, 2000);
                } else {
                    throw new Error(data.message || "Error desconocido en el registro");
                }
            }
            
        } catch (error) {
            console.error('Error en el registro:', error);
            showNotification(error.message || "Error al crear la cuenta. Inténtalo de nuevo.", "error");
        } finally {
            // Restaurar botón
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    // Funciones de utilidad
    function setupPasswordToggles() {
        const toggles = document.querySelectorAll('.password-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetInput = document.getElementById(targetId);
                
                if (targetInput) {
                    if (targetInput.type === 'password') {
                        targetInput.type = 'text';
                    } else {
                        targetInput.type = 'password';
                    }
                }
            });
        });
    }
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validatePassword(password) {
        // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
    
    function showNotification(message, type) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Estilos básicos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // Color según el tipo
        if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
        } else {
            notification.style.backgroundColor = '#2196F3';
        }
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
});

