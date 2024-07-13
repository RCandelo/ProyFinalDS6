(() => {
    const App = {
        htmlElements: {
            formTitle: document.getElementById('form-title'),
            servicioForm: document.getElementById('servicio-form'),
            servicioId: document.getElementById('servicio-id'),
            tipoServicio: document.getElementById('tipoServicio'),
            nombre: document.getElementById('nombre'),
            descripcion: document.getElementById('descripcion'),
            amenidades: document.getElementById('amenidades'),
            diasSemana: document.getElementById('diasSemana'),
            horarioDesde: document.getElementById('horarioDesde'),
            horarioHasta: document.getElementById('horarioHasta'),
            precioHora: document.getElementById('precioHora'),
            imagenes: document.getElementById('imagenes'),
            submitButton: document.getElementById('submit-button')
        },
        init() {
            App.bindEvents();
            const params = new URLSearchParams(window.location.search);
            const servicioId = params.get('id');
            if (servicioId) {
                App.methods.loadServicio(servicioId);
            }
        },
        bindEvents() {
            App.htmlElements.servicioForm.addEventListener('submit', App.handlers.onSubmit);
        },
        handlers: {
            logout(event) {
                event.preventDefault();
                fetch('/api/auth/logout', { 
                  method: 'POST',
                  credentials: 'include' 
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Error de red al cerrar sesión');
                  }
                  return response.json(); 
                })
                .then(data => {
                  if (data.message === 'Cierre de sesión exitoso') {
                    window.location.href = '/login';
                  } else {
                    throw new Error('Error del servidor al cerrar sesión: ' + data.error);
                  }
                })
                .catch(error => {
                  console.error('Error al cerrar sesión:', error);
                  alert('Error al cerrar sesión. Por favor, inténtalo de nuevo.');
                });
              },
            async onSubmit(event) {
                event.preventDefault();
                const servicioId = App.htmlElements.servicioId.value;
                const url = servicioId ? `/api/servicios/${servicioId}` : '/api/servicios';
                const method = servicioId ? 'PUT' : 'POST';

                const servicioData = {
                    tipoServicio: App.htmlElements.tipoServicio.value,
                    nombre: App.htmlElements.nombre.value,
                    descripcion: App.htmlElements.descripcion.value,
                    amenidades: App.htmlElements.amenidades.value,
                    diasSemana: App.htmlElements.diasSemana.value.split(','),
                    horarioDesde: App.htmlElements.horarioDesde.value,
                    horarioHasta: App.htmlElements.horarioHasta.value,
                    precioHora: App.htmlElements.precioHora.value,
                    imagenes: App.htmlElements.imagenes.value.split(',')
                };

                try {
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(servicioData)
                    });

                    if (response.ok) {
                        window.location.href = '/inicio-proveedor';
                    } else {
                        console.error('Error al guardar el servicio');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        },
        methods: {
            async loadServicio(id) {
                try {
                    const response = await fetch(`/api/servicios/${id}`);
                    const servicio = await response.json();

                    App.htmlElements.servicioId.value = servicio._id;
                    App.htmlElements.tipoServicio.value = servicio.tipoServicio;
                    App.htmlElements.nombre.value = servicio.nombre;
                    App.htmlElements.descripcion.value = servicio.descripcion;
                    App.htmlElements.amenidades.value = servicio.amenidades;
                    App.htmlElements.diasSemana.value = servicio.diasSemana.join(',');
                    App.htmlElements.horarioDesde.value = servicio.horarioDesde;
                    App.htmlElements.horarioHasta.value = servicio.horarioHasta;
                    App.htmlElements.precioHora.value = servicio.precioHora;
                    App.htmlElements.imagenes.value = servicio.imagenes.join(',');

                    App.htmlElements.formTitle.textContent = 'Editar Servicio';
                    App.htmlElements.submitButton.textContent = 'Actualizar';
                } catch (error) {
                    console.error('Error al cargar el servicio:', error);
                }
            }
        }
    };

    App.init();
})();
