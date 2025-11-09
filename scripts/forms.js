// /scripts/forms.js
// Contact form validation and submission

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', handleSubmit);

  // Real-time validation
  const inputs = form.querySelectorAll('.form-input, .form-textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearError(input));
  });
}

function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Validate all fields
  let isValid = true;
  const fields = ['name', 'email', 'message'];

  fields.forEach(fieldName => {
    const field = form.elements[fieldName];
    if (!validateField(field)) {
      isValid = false;
    }
  });

  if (!isValid) return;

  // Simulate form submission
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company'),
    message: formData.get('message'),
    timestamp: new Date().toISOString()
  };

  console.log('Form submitted:', data);

  // Show success message
  form.style.display = 'none';
  const successMessage = document.getElementById('success-message');
  if (successMessage) {
    successMessage.classList.remove('hidden');
  }

  // Reset form after 5 seconds (for demo purposes)
  setTimeout(() => {
    form.reset();
    form.style.display = 'block';
    if (successMessage) {
      successMessage.classList.add('hidden');
    }
  }, 5000);
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let errorMessage = '';

  // Required field validation
  if (field.hasAttribute('required') && !value) {
    errorMessage = 'This field is required';
  }

  // Email validation
  if (fieldName === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errorMessage = 'Please enter a valid email address';
    }
  }

  // Message length validation
  if (fieldName === 'message' && value && value.length < 10) {
    errorMessage = 'Message must be at least 10 characters long';
  }

  // Display error
  const errorSpan = document.getElementById(`${fieldName}-error`);
  if (errorMessage) {
    field.classList.add('error');
    if (errorSpan) {
      errorSpan.textContent = errorMessage;
    }
    return false;
  } else {
    field.classList.remove('error');
    if (errorSpan) {
      errorSpan.textContent = '';
    }
    return true;
  }
}

function clearError(field) {
  field.classList.remove('error');
  const errorSpan = document.getElementById(`${field.name}-error`);
  if (errorSpan) {
    errorSpan.textContent = '';
  }
}

// Initialize when page loads
if (document.getElementById('contact-form')) {
  initContactForm();
}
