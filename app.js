/**
 * Aplicación de Amigo Secreto
 * Permite añadir amigos a una lista y sortearlos de manera aleatoria
 */

// Modelo de datos
const amigoSecreto = {
    listaDeAmigos: [],
    listaAmigosSeleccionados: [],
    ganadorActual: null,
    
    // Regex para validar nombres (solo letras, espacios y acentos)
    validarNombre: /^(?!\s*$)[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    
    // Obtiene un amigo aleatorio que no haya sido seleccionado antes
    obtenerAmigoAleatorio() {
      if (this.listaDeAmigos.length === 0) return null;
      if (this.listaAmigosSeleccionados.length === this.listaDeAmigos.length) return null;
      
      let indice;
      do {
        indice = Math.floor(Math.random() * this.listaDeAmigos.length);
      } while (this.listaAmigosSeleccionados.includes(indice));
      
      this.listaAmigosSeleccionados.push(indice);
      return indice;
    },
    
    // Reinicia el juego
    reiniciar() {
      this.listaDeAmigos = [];
      this.listaAmigosSeleccionados = [];
      this.ganadorActual = null;
    }
  };
  
  // Controlador de la UI
  const controladorUI = {
    // Referencias a elementos DOM
    get elementoInput() { return document.getElementById('amigo'); },
    get elementoLista() { return document.getElementById('listaAmigos'); },
    get botonSorteo() { return document.getElementById('textoDeSorteo'); },
    get botonReiniciar() { return document.getElementById('restablecer'); },
    
    // Inicializa la aplicación
    inicializar() {
      this.actualizarBotonSorteo();
      this.botonReiniciar.disabled = true;
      console.log('Aplicación de Amigo Secreto inicializada');
    },
    
    // Limpia el campo de entrada
    limpiarEntrada() {
      this.elementoInput.value = '';
      this.elementoInput.focus();
    },
    
    // Actualiza la lista de amigos en el DOM
    actualizarListaAmigos() {
      const lista = this.elementoLista;
      lista.innerHTML = '';
      
      amigoSecreto.listaDeAmigos.forEach(nombre => {
        const elemento = document.createElement('li');
        elemento.textContent = nombre;
        lista.appendChild(elemento);
      });
    },
    
    // Actualiza el texto del botón de sorteo según el estado
    actualizarBotonSorteo() {
      let texto;
      const totalAmigos = amigoSecreto.listaDeAmigos.length;
      const seleccionados = amigoSecreto.listaAmigosSeleccionados.length;
      
      if (seleccionados === 0) {
        texto = 'Sortear amigo';
      } else if (seleccionados < totalAmigos) {
        texto = 'Sortear otro amigo';
      } else {
        texto = 'Ups, son todos';
        this.botonReiniciar.disabled = true;
        if (seleccionados > 0) {
          alert('Ya se sortearon todos los amigos');
        }
      }
      
      this.botonSorteo.innerHTML = `
        <img src="assets/play_circle_outline.png" alt="Ícono para sortear" class="button-icon"> ${texto}
      `;
    },
    
    // Resalta el amigo ganador en la lista
    resaltarGanador(nombre) {
      // Quitar cualquier resaltado anterior
      const elementosLista = this.elementoLista.querySelectorAll('li');
      elementosLista.forEach(elemento => {
        elemento.classList.remove('ganador');
      });
      
      // Encontrar y resaltar el nuevo ganador
      let ganadorEncontrado = false;
      elementosLista.forEach(elemento => {
        if (elemento.textContent === nombre) {
          elemento.classList.add('ganador');
          amigoSecreto.ganadorActual = elemento;
          ganadorEncontrado = true;
          
          // Hacer scroll al elemento ganador para asegurar visibilidad
          setTimeout(() => {
            elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      });
      
      // Mostrar mensaje si se encontró el ganador
      if (ganadorEncontrado) {
        console.log('Ganador resaltado:', nombre);
      }
    }
  };
  
  // Funciones de acción (handlers) - Estas deben estar en el ámbito global para que HTML pueda acceder a ellas
  function agregarAmigo() {
    const nombre = controladorUI.elementoInput.value.trim();
    
    // Validar que el nombre no esté vacío y cumpla con el formato
    if (!nombre) {
      alert('Por favor, introduce un nombre.');
      return;
    }
    
    if (!amigoSecreto.validarNombre.test(nombre)) {
      alert('Por favor, introduce un nombre válido. Use solo letras y espacios.');
      return;
    }
    
    // Verificar si el nombre ya existe
    if (amigoSecreto.listaDeAmigos.includes(nombre)) {
      alert('Ya añadiste a un amigo con ese nombre, intenta con otro.');
      return;
    }
    
    // Añadir el nombre a la lista
    amigoSecreto.listaDeAmigos.push(nombre);
    
    // Actualizar la UI
    controladorUI.actualizarListaAmigos();
    controladorUI.limpiarEntrada();
    controladorUI.actualizarBotonSorteo();
    
    console.log('Amigo añadido:', nombre);
    console.log('Lista actual:', amigoSecreto.listaDeAmigos);
  }
  
  function sortearAmigo() {
    if (amigoSecreto.listaDeAmigos.length === 0) {
      alert('Por favor, añade un amigo primero.');
      return;
    }
    
    const indice = amigoSecreto.obtenerAmigoAleatorio();
    
    // Verificar si se ha alcanzado el límite de sorteos
    if (indice === null) {
      controladorUI.actualizarBotonSorteo();
      return;
    }
    
    const nombreGanador = amigoSecreto.listaDeAmigos[indice];
    console.log('Amigo sorteado:', nombreGanador);
    
    // Actualizar UI
    controladorUI.resaltarGanador(nombreGanador);
    controladorUI.botonReiniciar.disabled = false;
    controladorUI.actualizarBotonSorteo();
  }
  
  function reiniciarElJuego() {
    // Reiniciar el modelo de datos
    amigoSecreto.reiniciar();
    
    // Limpiar la lista visual de amigos
    controladorUI.elementoLista.innerHTML = '';
    
    // Resetear el estado de los botones
    controladorUI.botonReiniciar.disabled = true;
    
    // Resetear el texto del botón de sorteo
    controladorUI.botonSorteo.innerHTML = `
      <img src="assets/play_circle_outline.png" alt="Ícono para sortear" class="button-icon"> Sortear amigo
    `;
    
    // Limpiar el campo de entrada por si acaso
    controladorUI.limpiarEntrada();
    
    console.log('Juego reiniciado completamente');
  }
  
  // Agregar función para manejar la tecla Enter en el input
  function inicializarEventos() {
    const input = controladorUI.elementoInput;
    if (input) {
      input.addEventListener('keypress', (evento) => {
        if (evento.key === 'Enter') {
          evento.preventDefault();
          agregarAmigo();
        }
      });
    }
  }
  
  // Inicializar la aplicación cuando se carga la página
  document.addEventListener('DOMContentLoaded', () => {
    controladorUI.inicializar();
    inicializarEventos();
  });
  
  // Para asegurar que las funciones sean accesibles desde HTML
  window.agregarAmigo = agregarAmigo;
  window.sortearAmigo = sortearAmigo;
  window.reiniciarElJuego = reiniciarElJuego;