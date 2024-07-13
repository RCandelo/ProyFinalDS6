(() => {
    const App = {
      htmlElements: {
        form: document.getElementById('registerForm'),
        notification: document.getElementById('notification')
      },
      init() {
        App.bindEvents();
      },
      bindEvents() {
        App.htmlElements.form.addEventListener('submit', App.handlers.handleFormSubmit);
        App.htmlElements.form.role.addEventListener('change', App.handlers.handleRoleChange);
      },
      handlers: {
        async handleFormSubmit(event) {
          event.preventDefault();
          const formData = new FormData(App.htmlElements.form);
          const data = Object.fromEntries(formData.entries());
  
          try {
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
  
            const result = await response.json();
            if (response.ok) {
              App.methods.showNotification('Registro exitoso', 'success');
              App.htmlElements.form.reset();
            } else {
              App.methods.showNotification(result.error, 'error');
            }
          } catch (error) {
            App.methods.showNotification('Error en el registro', 'error');
          }
        },
        handleRoleChange(event) {
          const role = event.target.value;
          const providerFields = document.getElementById('providerFields');
          if (role === 'provider') {
            providerFields.style.display = 'block';
          } else {
            providerFields.style.display = 'none';
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
  