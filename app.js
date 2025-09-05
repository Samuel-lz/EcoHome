// ----------------- FILTROS DE CATÁLOGO -----------------
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const cards = document.querySelectorAll("#productos .card");

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const term = e.target.value.toLowerCase();
      cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(term) ? "block" : "none";
      });
    });
  }

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      cards.forEach(card => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});

// ----------------- CARRITO -----------------
let carrito = JSON.parse(localStorage.getItem("carrito")) || []; // INICIAL VACÍO

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar producto al carrito SOLO con botón
function agregar(nombre = "Producto", precio = 100000) {
  let item = carrito.find(p => p.nombre === nombre);
  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  guardarCarrito();
  alert(`✅ ${nombre} agregado al carrito`);
  renderCarrito();
}

// Renderizar carrito
function renderCarrito() {
  const vacio = document.getElementById("carrito-vacio");
  const contenido = document.getElementById("carrito-contenido");
  const items = document.getElementById("carrito-items");
  const totalEl = document.getElementById("carrito-total");

  if (!items) return;

  if (carrito.length === 0) {
    vacio.classList.remove("hidden");
    contenido.classList.add("hidden");
    return;
  }

  vacio.classList.add("hidden");
  contenido.classList.remove("hidden");
  items.innerHTML = "";

  let total = 0;
  carrito.forEach((p, index) => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;
    items.innerHTML += `<tr class="border-b">
      <td class="p-3">${p.nombre}</td>
      <td class="p-3">$${p.precio.toLocaleString()}</td>
      <td class="p-3 flex items-center gap-2">
        <button onclick="cambiarCantidad(${index}, -1)" class="px-2 bg-gray-200 rounded">-</button>
        ${p.cantidad}
        <button onclick="cambiarCantidad(${index}, 1)" class="px-2 bg-gray-200 rounded">+</button>
      </td>
      <td class="p-3">$${subtotal.toLocaleString()}</td>
      <td class="p-3">
        <button onclick="eliminar(${index})" class="text-red-600 hover:underline">Eliminar</button>
      </td>
    </tr>`;
  });

  totalEl.textContent = `$${total.toLocaleString()}`;
  guardarCarrito();
}

// Cambiar cantidad
function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
  renderCarrito();
}

// Eliminar producto
function eliminar(index) {
  carrito.splice(index, 1);
  renderCarrito();
}

// ----------------- FUNCION BOTON PAGAR -----------------
let pedidoID = parseInt(localStorage.getItem("pedidoID")) || 0;

function mostrarMensaje(texto, color = "green") {
  const mensajePago = document.getElementById("mensaje-pago");
  mensajePago.style.color = color;
  mensajePago.innerHTML = `
    <div class="p-4 border rounded-md bg-${color === 'green' ? 'emerald-100' : 'red-100'} text-${color}-700">
      ${texto} <button onclick="cerrarMensaje()" class="ml-4 px-2 py-1 bg-${color === 'green' ? 'emerald-500' : 'red-500'} text-white rounded">Aceptar</button>
    </div>
  `;
}

function cerrarMensaje() {
  document.getElementById("mensaje-pago").innerHTML = "";
}

// Validaciones
function validarEmail(email) {
  const regex = /^[^@]+@[^@]+\.(com|co|net|org|edu|es)$/i;
  return regex.test(email);
}

function validarNombre(nombre) {
  return /^[A-Za-z\s]+$/.test(nombre);
}

function validarNumeroTarjeta(numero) {
  return /^\d{10}$/.test(numero);
}

function validarMMYY(exp) {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  return regex.test(exp);
}

// ----------------- PAGAR -----------------
function pagarAhora() {
  const email = document.getElementById("email").value.trim();
  const nombreTarjeta = document.getElementById("nombre-tarjeta").value.trim();
  const numeroTarjeta = document.getElementById("numero-tarjeta").value.trim();
  const exp = document.getElementById("exp").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  if (carrito.length === 0) {
    mostrarMensaje("❌ No puedes pagar un carrito vacío.", "red");
    return;
  }

  if (!validarEmail(email)) { mostrarMensaje("❌ Correo inválido. Ejemplo: diego@samuel.com, diego@samuel.es, diego@samuel.edu", "red"); return; }
  if (!validarNombre(nombreTarjeta)) { mostrarMensaje("❌ Solo letras en el nombre de la tarjeta.", "red"); return; }
  if (!validarNumeroTarjeta(numeroTarjeta)) { mostrarMensaje("❌ Número de tarjeta debe tener 10 dígitos.", "red"); return; }
  if (!validarMMYY(exp)) { mostrarMensaje("❌ Fecha inválida. Formato MM/AA, mes 01-12.", "red"); return; }
  if (cvv.length !== 3 || isNaN(cvv)) { mostrarMensaje("❌ CVV inválido. Debe tener 3 dígitos.", "red"); return; }

  pedidoID++;
  localStorage.setItem("pedidoID", pedidoID);

  mostrarMensaje(`🎉 Gracias por tu compra, tu pedido número ${pedidoID} fue procesado con éxito.<br>Esperamos que disfrutes tus productos EcoHome 🏠`);

  carrito = [];
  guardarCarrito();
  renderCarrito();
}

// ----------------- ENTER PARA PASAR SOLO SI VALIDO -----------------
document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();
  const inputs = document.querySelectorAll("#form-pago input");
  
  inputs.forEach((input, index) => {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        let valido = false;
        const val = input.value.trim();

        if (input.id === "email") valido = validarEmail(val);
        if (input.id === "nombre-tarjeta") valido = validarNombre(val);
        if (input.id === "numero-tarjeta") valido = validarNumeroTarjeta(val);
        if (input.id === "exp") valido = validarMMYY(val);
        if (input.id === "cvv") valido = (val.length === 3 && !isNaN(val));

        if (!valido) {
          input.focus();
          if (input.id === "email") mostrarMensaje("❌ Correo inválido. Ejemplo: diego@samuel.com, diego@samuel.es, diego@samuel.edu", "red");
          if (input.id === "nombre-tarjeta") mostrarMensaje("❌ Solo letras en el nombre de la tarjeta.", "red");
          if (input.id === "numero-tarjeta") mostrarMensaje("❌ Número de tarjeta debe tener 10 dígitos.", "red");
          if (input.id === "exp") mostrarMensaje("❌ Fecha inválida. Formato MM/AA, mes 01-12.", "red");
          if (input.id === "cvv") mostrarMensaje("❌ CVV inválido. Debe tener 3 dígitos.", "red");
          return;
        }

        cerrarMensaje();
        const nextInput = inputs[index + 1];
        if (nextInput) nextInput.focus();
        else pagarAhora();
      }
    });

    if (input.id === "exp") {
      input.addEventListener("input", e => {
        let val = e.target.value.replace(/\D/g,'');
        if (val.length > 2) val = val.slice(0,2) + "/" + val.slice(2,4);
        e.target.value = val;
      });
    }
  });
});
