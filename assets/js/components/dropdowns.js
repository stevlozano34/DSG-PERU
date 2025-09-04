// Mobile Login Dropdown Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile login dropdown toggle
    const mobileLoginBtn = document.getElementById('mobile-login-dropdown-btn');
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.closest('.login-dropdown');
            dropdown.classList.toggle('active');
            
            // Close other dropdowns
            document.querySelectorAll('.login-dropdown').forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove('active');
                }
            });
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.login-dropdown')) {
            document.querySelectorAll('.login-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});
