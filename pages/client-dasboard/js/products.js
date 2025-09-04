// Datos de ejemplo para productos
const sampleProducts = [
    {
        id: 1,
        name: 'Laptop HP Pavilion',
        sku: 'HP-PAV-001',
        category: 'Electrónica',
        price: 1299.99,
        stock: 15,
        status: 'in-stock',
        image: 'https://via.placeholder.com/150',
        description: 'Laptop HP Pavilion con procesador Intel Core i7, 16GB RAM, 512GB SSD.'
    },
    {
        id: 2,
        name: 'Smartphone Samsung Galaxy S21',
        sku: 'SS-S21-001',
        category: 'Electrónica',
        price: 899.99,
        stock: 3,
        status: 'low-stock',
        image: 'https://via.placeholder.com/150',
        description: 'Smartphone Samsung Galaxy S21 con pantalla AMOLED de 6.2", 128GB de almacenamiento.'
    },
    {
        id: 3,
        name: 'Auriculares Sony WH-1000XM4',
        sku: 'SONY-WH1000XM4',
        category: 'Audio',
        price: 349.99,
        stock: 0,
        status: 'out-of-stock',
        image: 'https://via.placeholder.com/150',
        description: 'Auriculares inalámbricos con cancelación de ruido y hasta 30 horas de batería.'
    },
    {
        id: 4,
        name: 'Monitor LG 27" 4K',
        sku: 'LG-27UK850',
        category: 'Monitores',
        price: 499.99,
        stock: 8,
        status: 'in-stock',
        image: 'https://via.placeholder.com/150',
        description: 'Monitor 4K UHD de 27" con HDR10 y USB-C.'
    },
    {
        id: 5,
        name: 'Teclado Mecánico Corsair K95',
        sku: 'COR-K95-RGB',
        category: 'Periféricos',
        price: 199.99,
        stock: 2,
        status: 'low-stock',
        image: 'https://via.placeholder.com/150',
        description: 'Teclado mecánico gaming con switches Cherry MX y retroiluminación RGB.'
    }
];

// Función para formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Función para obtener el texto del estado
function getStatusText(status) {
    const statusMap = {
        'in-stock': 'En Stock',
        'low-stock': 'Poco Stock',
        'out-of-stock': 'Sin Stock'
    };
    return statusMap[status] || status;
}

// Función para renderizar la tabla de productos
function renderProductsTable(products) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (products.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" class="text-center py-4">
                <i class="fas fa-inbox fa-2x mb-2 text-muted"></i>
                <p class="mb-0">No se encontraron productos</p>
            </td>
        `;
        tbody.appendChild(row);
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="product-select">
                <input type="checkbox" class="product-checkbox" data-id="${product.id}">
            </td>
            <td class="product-info">
                <div class="d-flex align-items-center">
                    <img src="${product.image}" alt="${product.name}" class="product-thumb">
                    <div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-sku">${product.sku}</div>
                    </div>
                </div>
            </td>
            <td>${product.category}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.stock}</td>
            <td>
                <span class="status-badge status-${product.status}">
                    ${getStatusText(product.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="editProduct(${product.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteProduct(${product.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función para filtrar productos
function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const filter = document.querySelector('.dropdown-item.active')?.dataset.filter || 'all';
    
    const filteredProducts = sampleProducts.filter(product => {
        const matchesSearch = 
            product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
        
        const matchesFilter = 
            filter === 'all' || 
            (filter === 'in-stock' && product.status === 'in-stock') ||
            (filter === 'low-stock' && product.status === 'low-stock') ||
            (filter === 'out-of-stock' && product.status === 'out-of-stock');
        
        return matchesSearch && matchesFilter;
    });
    
    renderProductsTable(filteredProducts);
    updatePagination(filteredProducts.length);
}

// Función para actualizar la paginación
function updatePagination(totalItems) {
    const showingCount = document.getElementById('showingCount');
    const totalCount = document.getElementById('totalCount');
    
    if (showingCount) showingCount.textContent = `1-${Math.min(10, totalItems)}`;
    if (totalCount) totalCount.textContent = totalItems;
}

// Función para editar un producto
function editProduct(id) {
    const product = sampleProducts.find(p => p.id === id);
    if (!product) return;
    
    // Llenar el formulario con los datos del producto
    document.getElementById('productName').value = product.name;
    document.getElementById('productSku').value = product.sku;
    document.getElementById('productBarcode').value = ''; // No hay código de barras en los datos de ejemplo
    document.getElementById('productCategory').value = product.category.toLowerCase();
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDescription').value = product.description;
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

// Función para eliminar un producto
function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
        // En una aplicación real, aquí harías una petición al servidor
        const index = sampleProducts.findIndex(p => p.id === id);
        if (index !== -1) {
            sampleProducts.splice(index, 1);
            renderProductsTable(sampleProducts);
            showToast('Producto eliminado correctamente', 'success');
        }
    }
}

// Función para mostrar notificaciones toast
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast show align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    const toastBody = document.createElement('div');
    toastBody.className = 'd-flex';
    
    const toastContent = document.createElement('div');
    toastContent.className = 'toast-body';
    toastContent.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close btn-close-white me-2 m-auto';
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('aria-label', 'Cerrar');
    
    toastBody.appendChild(toastContent);
    toastBody.appendChild(closeButton);
    toast.appendChild(toastBody);
    toastContainer.appendChild(toast);
    
    // Eliminar el toast después de 5 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 150);
    }, 5000);
}

// Inicialización cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar la tabla con los productos de ejemplo
    renderProductsTable(sampleProducts);
    
    // Configurar el buscador
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    // Configurar los filtros
    const filterItems = document.querySelectorAll('.dropdown-item[data-filter]');
    filterItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.dropdown-item.active').classList.remove('active');
            this.classList.add('active');
            filterProducts();
        });
    });
    
    // Configurar el botón de seleccionar todos
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.product-checkbox');
            check.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });
    }
    
    // Configurar el formulario de agregar/editar producto
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aquí iría la lógica para guardar el producto
            // Por ahora, solo mostramos un mensaje de éxito
            const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
            modal.hide();
            showToast('Producto guardado correctamente', 'success');
        });
    }
    
    // Configurar la carga de imágenes
    const imageUpload = document.querySelector('.image-upload-placeholder');
    if (imageUpload) {
        imageUpload.addEventListener('click', function() {
            document.getElementById('productImage').click();
        });
        
        const fileInput = document.getElementById('productImage');
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // Aquí podrías mostrar una vista previa de la imagen
                        console.log('Imagen seleccionada:', e.target.result);
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            });
        }
    }
    
    // Configurar el botón de exportar
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            // Aquí iría la lógica para exportar los productos
            showToast('Exportando productos...', 'info');
            // Simulación de exportación
            setTimeout(() => {
                showToast('Exportación completada', 'success');
            }, 1500);
        });
    }
    
    // Configurar el botón de agregar producto
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Limpiar el formulario
            const form = document.getElementById('addProductForm');
            if (form) form.reset();
            // Cambiar el título del modal
            const modalTitle = document.querySelector('#addProductModal .modal-title');
            if (modalTitle) modalTitle.textContent = 'Agregar Nuevo Producto';
            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
            modal.show();
        });
    }
});
