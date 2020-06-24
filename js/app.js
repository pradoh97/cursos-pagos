let botonBusqueda = document.getElementById('ingresar-busqueda');
let botonCarritoCompras = document.querySelector('.submenu');
let carritoCompras = document.getElementById('carrito');
let listaCursos = document.querySelector(".cursos");
let carrito = document.getElementById('carrito');

document.querySelector('body').addEventListener("click", alternarCarrito);
botonCarritoCompras.addEventListener('click', alternarCarrito);
botonBusqueda.addEventListener("click", function(e){
  e.preventDefault();
});

carrito.onclick = eliminarItemCarrito;
listaCursos.onclick = agregarItemCarrito;

mostrarItemsLocalStorage();
contarItemsCarrito();

function alternarCarrito(e){
  if (this.classList.contains('submenu')) {
    if (!carritoCompras.classList.contains('visible')){
      carritoCompras.classList.add('visible');
    }
    e.stopPropagation();
  } else {
    carritoCompras.classList.remove('visible');
  }
}

function obtenerItemsLocalStorage(){
  let items = [];
  for(var i in localStorage){
    if(localStorage.getItem(i)){
      let item = {};
      item.id = i;
      item.info = JSON.parse(localStorage.getItem(i));
      items.push(item);
    }
  }
  return items;
}

function mostrarItemsLocalStorage(){
  let items = obtenerItemsLocalStorage();
  items.forEach((item) => agregarItemCarrito(null, item));
}

function contarItemsCarrito(){
  let cantidad = carrito.querySelectorAll("tbody tr").length;
  let parrafoCantidad = carrito.querySelector("p");
  if (!cantidad) {
    parrafoCantidad.innerText = "El carrito está vacio."
    carrito.querySelector("table + button").classList.add("oculto");
    carrito.querySelector("table").classList.add("oculto");
  } else if(cantidad == 1){
    parrafoCantidad.innerText = "El carrito tiene 1 artículo."
    carrito.querySelector("table + button").classList.remove("oculto");
    carrito.querySelector("table").classList.remove("oculto");
  } else {
    parrafoCantidad.innerText = `El carrito tiene ${cantidad} artículos.`
  }
}

function agregarItemCarrito(e, curso){
  let id;
  if(e && e.target.nodeName == "BUTTON"){
    curso = leerCurso(e.target.parentElement);
    id = agregarItemLocalStorage(curso);
  }
  if(e && e.target.nodeName != "BUTTON"){
    return;
  }
  let cursoNuevo = crearItemCarrito(curso.id, curso.info);
  carrito.querySelector("tbody").appendChild(cursoNuevo);
  contarItemsCarrito();
}

function crearItemCarrito(id, infoCurso){
  let curso = document.createElement("tr");
  curso.innerHTML = `
  <td><img src="${infoCurso.imagen}"</td>
  <td>${infoCurso.nombre}</td>
  <td >${infoCurso.precio}</td>
  <td><button role="button" class="cta" type="button">x</button></td>
  `;
  curso.setAttribute("data-id", id);
  return curso;
}

function agregarItemLocalStorage(curso){
  let id = curso.id;
  delete curso.id;
  localStorage.setItem(id, JSON.stringify(curso.info));
  return id;
}

function leerCurso(elemento){
  let curso = {
    id: elemento.querySelector("button").attributes["data-id"].value,
    info: {
      imagen: elemento.querySelector("img").src,
      nombre: elemento.querySelector("h3").innerText,
      precio: ""
    }
  };
  if(elemento.querySelector(".precio .rebaja")){
    curso.info.precio = elemento.querySelector(".precio .rebaja").innerText;
  } else if(elemento.querySelector(".precio .normal")){
    curso.info.precio = elemento.querySelector(".precio .normal").innerText;
  }
  return curso;
}

function eliminarItemLocalStorage(id){
  localStorage.removeItem(id)
}

function eliminarItemCarrito(e){
  let elemento = e.target;
  if(e.target.attributes["role"]){
    elemento.parentElement.parentElement.remove();
    eliminarItemLocalStorage(elemento.parentElement.parentElement.getAttribute("data-id"));
  }
  if(e.target.classList.contains("minimalista")){
    let tbody = elemento.parentElement.querySelector("tbody");

    if(tbody.children.length && confirm("Está a punto de vaciar el carrito ¿desea continuar?")){
      Array.from(tbody.children).forEach(element => element.remove());
      localStorage.clear();
    }
  }
  contarItemsCarrito();
}
