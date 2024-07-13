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
            
            const result = await response.json();
            if (response.ok) {
              App.methods.showNotification('Inicio de sesión exitoso', 'success');
              // Redirigir o guardar token según sea necesario
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
          App.htmlElements.notification.textContent = message;
          App.htmlElements.notification.className = type;
          setTimeout(() => {
            App.htmlElements.notification.textContent = '';
            App.htmlElements.notification.className = '';
          }, 3000);
        }
      }
    };
    App.init();
  })();
  