document.addEventListener('DOMContentLoaded', () => {
  const App = {
    htmlElements: {
      form: document.getElementById('loginForm'),
      notification: document.getElementById('notification')
    },

    init() {
      // Verificar si el formulario existe antes de inicializar
      if (this.htmlElements.form) {
        this.bindEvents();
      } else {
        console.error("Error: Formulario de inicio de sesión no encontrado.");
      }
    },

    bindEvents() {
      this.htmlElements.form.addEventListener('submit', (event) => {
        this.handlers.handleFormSubmit(event);
      });
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

          const result = await response.json();
          if (response.ok) {
            const token = result.token;
            localStorage.setItem('token', token);
            window.location.href = '/inicio-proveedor';
          } else {
            App.methods.showNotification(result.error, 'error');
          }
        } catch (error) {
          App.methods.showNotification('Error en el inicio de sesión', 'error');
        }
      }
    },

    methods: {
      showNotification(message, type) {
        const { notification } = App.htmlElements;
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        // Ocultar la notificación después de 3 segundos
        setTimeout(() => {
          notification.textContent = '';
          notification.className = 'notification';
          notification.style.display = 'none';
        }, 3000);
      }
    }
  };

  App.init();
});
