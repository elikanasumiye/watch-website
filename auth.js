const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authTabs = document.querySelectorAll(".auth-tab");
const authPanels = document.querySelectorAll(".auth-panel");
const registerPassword = document.getElementById("registerPassword");

authTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    authTabs.forEach(item => item.classList.remove("active"));
    authPanels.forEach(panel => panel.classList.remove("active"));
    tab.classList.add("active");
    const activePanel = document.getElementById(`${tab.dataset.tab}Form`);
    if (activePanel) {
      activePanel.classList.add("active");
    }
  });
});

function showMessage(elementId, message, isError = false) {
  const messageEl = document.getElementById(elementId);
  messageEl.textContent = message;
  messageEl.className = `auth-message ${isError ? 'error' : 'success'}`;
  messageEl.style.display = 'block';
}

function validatePassword(password) {
  const requirements = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};:\'",.<>?\/\\|`~]/.test(password)
  };
  
  document.getElementById('req-length').classList.toggle('met', requirements.length);
  document.getElementById('req-upper').classList.toggle('met', requirements.upper);
  document.getElementById('req-lower').classList.toggle('met', requirements.lower);
  document.getElementById('req-number').classList.toggle('met', requirements.number);
  document.getElementById('req-special').classList.toggle('met', requirements.special);
  
  return Object.values(requirements).every(v => v);
}

if (registerPassword) {
  registerPassword.addEventListener("input", (e) => {
    validatePassword(e.target.value);
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[name="email"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password
        })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        showMessage('loginMessage', 'Login successful! Redirecting...', false);
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        showMessage('loginMessage', data.error || 'Login failed', true);
      }
    } catch (error) {
      showMessage('loginMessage', 'An error occurred. Please try again.', true);
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = registerForm.querySelector('input[name="name"]').value;
    const email = registerForm.querySelector('input[name="email"]').value;
    const phone = registerForm.querySelector('input[name="phoneNumber"]').value;
    const password = registerForm.querySelector('input[name="password"]').value;
    
    if (!validatePassword(password)) {
      showMessage('registerMessage', 'Password does not meet all requirements', true);
      return;
    }
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phoneNumber', phone);
    formData.append('password', password);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phoneNumber: phone,
          password
        })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        showMessage('registerMessage', 'Registration successful! Redirecting...', false);
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        showMessage('registerMessage', data.error || 'Registration failed', true);
      }
    } catch (error) {
      showMessage('registerMessage', 'An error occurred. Please try again.', true);
    }
  });
}
