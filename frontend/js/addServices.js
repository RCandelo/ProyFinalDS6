(() => {
    const App = {
        htmlElements: {
            tipoServicioSelect: document.getElementById('tipoServicio'),
            nombreInput: document.getElementById('nombre'),
            descripcionTextarea: document.getElementById('descripcion'),
            amenidadesInput: document.getElementById('amenidades'),
            todosLosDiasCheckbox: document.getElementById('todosLosDias'),
            diasCheckboxes: document.querySelectorAll('input[name="dias-semana"]:not(#todosLosDias)'),
            horarioDesdeInput: document.getElementById('horarioDesde'),
            horarioHastaInput: document.getElementById('horarioHasta'),
            precioHoraInput: document.getElementById('precioHora'),
            imagenesInput: document.getElementById('imagenes'),
            notification: document.getElementById('notification'),
            errorMessages: {
                tipoServicioError: document.getElementById('tipoServicioError'),
                nombreError: document.getElementById('nombreError'),
                descripcionError: document.getElementById('descripcionError'),
                amenidadesError: document.getElementById('amenidadesError'),
                diasError: document.getElementById('diasError'),
                horarioError: document.getElementById('horarioError'),
                precioHoraError: document.getElementById('precioHoraError'),
                imagenesError: document.getElementById('imagenesError')
            }
        },

        init() {
            this.bindEvents();
        },

        bindEvents() {
            const formulario = document.getElementById('formularioServicio');
            formulario.addEventListener('submit', this.handlers.onSubmitFormulario);
            App.htmlElements.todosLosDiasCheckbox.addEventListener('change', this.handlers.onToggleTodosLosDias);
        },

        handlers: {
            async onSubmitFormulario(event) {
                event.preventDefault();
                App.methods.clearValidationErrors();
                if (!App.methods.validarFormulario()) {
                    App.methods.showValidationErrors();
                    App.methods.showNotification('Todos los campos son obligatorios', 'error');
                    return;
                }
                const data = App.methods.obtenerDatosFormulario();
                await App.methods.guardarServicio(data);
            },

            onToggleTodosLosDias() {
                const isChecked = App.htmlElements.todosLosDiasCheckbox.checked;
                App.htmlElements.diasCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                });
            }
        },

        methods: {
            validarFormulario() {
                let esValido = true;
                if (!App.htmlElements.tipoServicioSelect.value) {
                    esValido = false;
                    App.htmlElements.tipoServicioSelect.classList.add('error-border');
                    App.htmlElements.errorMessages.tipoServicioError.style.display = 'block';
                }
                if (!App.htmlElements.nombreInput.value.trim()) {
                    esValido = false;
                    App.htmlElements.nombreInput.classList.add('error-border');
                    App.htmlElements.errorMessages.nombreError.style.display = 'block';
                }
                if (!App.htmlElements.descripcionTextarea.value.trim()) {
                    esValido = false;
                    App.htmlElements.descripcionTextarea.classList.add('error-border');
                    App.htmlElements.errorMessages.descripcionError.style.display = 'block';
                }
                if (!App.htmlElements.amenidadesInput.value.trim()) {
                    esValido = false;
                    App.htmlElements.amenidadesInput.classList.add('error-border');
                    App.htmlElements.errorMessages.amenidadesError.style.display = 'block';
                }
                if (!(Array.from(App.htmlElements.diasCheckboxes).some(checkbox => checkbox.checked) || App.htmlElements.todosLosDiasCheckbox.checked)) {
                    esValido = false;
                    App.htmlElements.diasCheckboxes[0].parentElement.classList.add('error-border');
                    App.htmlElements.errorMessages.diasError.style.display = 'block';
                }
                if (!App.htmlElements.horarioDesdeInput.value || !App.htmlElements.horarioHastaInput.value) {
                    esValido = false;
                    App.htmlElements.horarioDesdeInput.classList.add('error-border');
                    App.htmlElements.horarioHastaInput.classList.add('error-border');
                    App.htmlElements.errorMessages.horarioError.style.display = 'block';
                }
                if (!App.htmlElements.precioHoraInput.value.trim()) {
                    esValido = false;
                    App.htmlElements.precioHoraInput.classList.add('error-border');
                    App.htmlElements.errorMessages.precioHoraError.style.display = 'block';
                }
                if (!App.htmlElements.imagenesInput.files.length) {
                    esValido = false;
                    App.htmlElements.imagenesInput.classList.add('error-border');
                    App.htmlElements.errorMessages.imagenesError.style.display = 'block';
                }
                return esValido;
            },

            clearValidationErrors() {
                for (const element of Object.values(App.htmlElements.errorMessages)) {
                    element.style.display = 'none';
                }
                App.htmlElements.tipoServicioSelect.classList.remove('error-border');
                App.htmlElements.nombreInput.classList.remove('error-border');
                App.htmlElements.descripcionTextarea.classList.remove('error-border');
                App.htmlElements.amenidadesInput.classList.remove('error-border');
                App.htmlElements.diasCheckboxes.forEach(checkbox => checkbox.parentElement.classList.remove('error-border'));
                App.htmlElements.horarioDesdeInput.classList.remove('error-border');
                App.htmlElements.horarioHastaInput.classList.remove('error-border');
                App.htmlElements.precioHoraInput.classList.remove('error-border');
                App.htmlElements.imagenesInput.classList.remove('error-border');
            },

            showNotification(message, type) {
                App.htmlElements.notification.innerText = message;
                App.htmlElements.notification.className = `notification ${type}`;
                App.htmlElements.notification.style.display = 'block';
                setTimeout(() => {
                    App.htmlElements.notification.style.display = 'none';
                }, 3000);
            },

            obtenerDatosFormulario() {
                const tipoServicio = App.htmlElements.tipoServicioSelect.value;
                const nombre = App.htmlElements.nombreInput.value.trim();
                const descripcion = App.htmlElements.descripcionTextarea.value.trim();
                const amenidades = App.htmlElements.amenidadesInput.value.trim();
                const diasSemana = Array.from(App.htmlElements.diasCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
                const horarioDesde = App.htmlElements.horarioDesdeInput.value;
                const horarioHasta = App.htmlElements.horarioHastaInput.value;
                const precioHora = App.htmlElements.precioHoraInput.value.trim();
                const imagenes = Array.from(App.htmlElements.imagenesInput.files).map(file => URL.createObjectURL(file));
                return { tipoServicio, nombre, descripcion, amenidades, diasSemana, horarioDesde, horarioHasta, precioHora, imagenes };
            },

            async guardarServicio(data) {
                try {
                    const response = await fetch('/api/servicios', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (!response.ok) {
                        throw new Error('Error al guardar el servicio');
                    }

                    App.methods.showNotification('Servicio guardado con éxito', 'success');
                } catch (error) {
                    App.methods.showNotification(error.message, 'error');
                }
            }
        }
    };

    App.init();
})();
