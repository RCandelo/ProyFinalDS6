(() => {
    const App = {
      htmlElements: {
        mainForm: document.getElementById("mainForm"),
        usuariobienvenido: document.getElementById("usuariobienvenido"),
        btnLogout: document.getElementById("btnLogout"),
      },
      init() {
        App.bindEvents();
        App.methods.checkSesionExiste();
      },
      bindEvents() {
  
        App.htmlElements.btnLogout.addEventListener(
          "click",
          App.handlers.onClickLogout,
        );
  
      },
      handlers: {
        onClickLogout() {
          App.methods.hacerLogout();
        },

      },
      methods: {
        checkSesionExiste() {

          window.location.href = 'login.html';
          // Obtener token del usuario para checar si hay coneccion
  
        },
        hacerLogout(){
          // aqui hay que borrar los token del usuario
          window.location.href = "index.html";
        },
          // fin methods
        },
  
        templates: {},
  
        render(elemento,html) {
          //App.htmlElements.indexForm.innerHTML = html;
          document.getElementById(elemento).innerHTML = html;
        },
  
    }; // fin de const App
    App.init();
  })();