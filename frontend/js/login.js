(() => {
  const App = {
    htmlElements: {
      form: document.getElementById('loginForm'),
      notification: document.getElementById('notification')
    },
    init() {
      App.bindEvents();
    },
    bindEvents() {
      App.htmlElements.form.addEventListener('submit', App.handlers.handleFormSubmit);
    },
    handlers: {
      async handleFormSubmit(event) {
        event.preventDefault();
      
        const formData = new FormData(App.htmlElements.form);
        const data = Object.fromEntries(formData.entries());
      
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
      
          if (response.ok) { 
            const result = await response.json();
            const token = result.token;
            const role = result.role; 
      
            if (token) {
              localStorage.setItem('token', token); 
              window.location.href = role === 'provider' ? '/inicio-proveedor' : '/inicio-user'; 
            } else {
              App.methods.showNotification(result.error || 'No se recibió token', 'error'); 
            }
          } else {
            const errorData = await response.json(); 
            App.methods.showNotification(errorData.error || 'Autenticación fallida', 'error');
          }
        } catch (error) {
          App.methods.showNotification('Error durante el inicio de sesión', 'error');
        }
      }
      
    },
    methods: {
      showNotification(message, type) {
        App.htmlElements.notification.textContent = message;
        App.htmlElements.notification.className = `notification ${type}`;
        App.htmlElements.notification.style.display = 'block';
        setTimeout(() => {
          App.htmlElements.notification.textContent = '';
          App.htmlElements.notification.className = 'notification';
          App.htmlElements.notification.style.display = 'none';
        }, 3000);
      }
    }
  };

  App.init();
})();
