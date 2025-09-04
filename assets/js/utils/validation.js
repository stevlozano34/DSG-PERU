// Form validation utility functions
class ValidationManager {
  constructor() {
    this.rules = {
      required: (value) => value !== null && value !== undefined && value.toString().trim() !== '',
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      phone: (value) => /^[\+]?[1-9][\d]{0,3}[\s\-]?[\(]?[\d]{1,4}[\)]?[\s\-]?[\d]{1,4}[\s\-]?[\d]{1,9}$/.test(value),
      url: (value) => /^https?:\/\/.+/.test(value),
      number: (value) => !isNaN(value) && !isNaN(parseFloat(value)),
      integer: (value) => Number.isInteger(Number(value)),
      minLength: (value, min) => value.toString().length >= min,
      maxLength: (value, max) => value.toString().length <= max,
      min: (value, min) => Number(value) >= min,
      max: (value, max) => Number(value) <= max,
      pattern: (value, pattern) => new RegExp(pattern).test(value),
      password: (value) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value);
      },
      confirmPassword: (value, originalPassword) => value === originalPassword
    };

    this.messages = {
      required: 'Este campo es obligatorio',
      email: 'Ingrese un email válido',
      phone: 'Ingrese un teléfono válido',
      url: 'Ingrese una URL válida',
      number: 'Ingrese un número válido',
      integer: 'Ingrese un número entero',
      minLength: 'Mínimo {min} caracteres',
      maxLength: 'Máximo {max} caracteres',
      min: 'El valor mínimo es {min}',
      max: 'El valor máximo es {max}',
      pattern: 'Formato inválido',
      password: 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 número',
      confirmPassword: 'Las contraseñas no coinciden'
    };
  }

  // Validate single field
  validateField(value, rules) {
    const errors = [];

    for (const rule of rules) {
      if (typeof rule === 'string') {
        // Simple rule
        if (!this.rules[rule](value)) {
          errors.push(this.messages[rule]);
        }
      } else if (typeof rule === 'object') {
        // Rule with parameters
        const ruleName = rule.rule;
        const params = rule.params || [];
        
        if (!this.rules[ruleName](value, ...params)) {
          let message = this.messages[ruleName];
          // Replace placeholders in message
          params.forEach((param, index) => {
            const placeholder = Object.keys(rule).find(key => key !== 'rule' && key !== 'params');
            if (placeholder) {
              message = message.replace(`{${placeholder}}`, param);
            }
          });
          errors.push(rule.message || message);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate entire form
  validateForm(formData, validationRules) {
    const results = {};
    let isFormValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const fieldValue = formData[fieldName];
      const fieldRules = validationRules[fieldName];
      
      const result = this.validateField(fieldValue, fieldRules);
      results[fieldName] = result;
      
      if (!result.isValid) {
        isFormValid = false;
      }
    });

    return {
      isValid: isFormValid,
      fields: results
    };
  }

  // Add custom validation rule
  addRule(name, validator, message) {
    this.rules[name] = validator;
    this.messages[name] = message;
  }

  // Real-time form validation
  setupFormValidation(formSelector, validationRules, options = {}) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    const defaultOptions = {
      validateOnBlur: true,
      validateOnInput: false,
      showErrors: true,
      errorClass: 'error',
      errorMessageClass: 'error-message'
    };

    const config = { ...defaultOptions, ...options };

    // Add event listeners
    Object.keys(validationRules).forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (!field) return;

      if (config.validateOnBlur) {
        field.addEventListener('blur', () => {
          this.validateAndShowErrors(field, validationRules[fieldName], config);
        });
      }

      if (config.validateOnInput) {
        field.addEventListener('input', () => {
          this.validateAndShowErrors(field, validationRules[fieldName], config);
        });
      }
    });

    // Form submit validation
    form.addEventListener('submit', (e) => {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      const result = this.validateForm(data, validationRules);
      
      if (!result.isValid) {
        e.preventDefault();
        
        // Show all errors
        Object.keys(result.fields).forEach(fieldName => {
          const field = form.querySelector(`[name="${fieldName}"]`);
          if (field) {
            this.showFieldErrors(field, result.fields[fieldName], config);
          }
        });
      }
    });
  }

  // Validate and show errors for a single field
  validateAndShowErrors(field, rules, config) {
    const result = this.validateField(field.value, rules);
    this.showFieldErrors(field, result, config);
    return result;
  }

  // Show field errors
  showFieldErrors(field, result, config) {
    // Remove existing errors
    this.clearFieldErrors(field, config);

    if (!result.isValid && config.showErrors) {
      field.classList.add(config.errorClass);
      
      // Create error message element
      const errorElement = document.createElement('div');
      errorElement.className = config.errorMessageClass;
      errorElement.textContent = result.errors[0]; // Show first error
      
      // Insert error message after field
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    } else {
      field.classList.remove(config.errorClass);
    }
  }

  // Clear field errors
  clearFieldErrors(field, config) {
    field.classList.remove(config.errorClass);
    
    // Remove error message
    const errorElement = field.parentNode.querySelector(`.${config.errorMessageClass}`);
    if (errorElement) {
      errorElement.remove();
    }
  }
}

// Global validation manager instance
window.validator = new ValidationManager();