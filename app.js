// Agregar producto al carrito (simulado con alert)
function agregar() {
  alert("✅ Producto agregado a tu EcoHome");
}

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
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar producto al carrito
function agregar(nombre = "Producto", precio = 100000) {
  let item = carrito.find(p => p.nombre === nombre);
  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  guardarCarrito();
  alert(`✅ ${nombre} agregado al carrito`);
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
    items.innerHTML += `
      <tr class="border-b">
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
      </tr>
    `;
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

// ----------------- PAGO SIMULADO -----------------
document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();

  const formPago = document.getElementById("form-pago");
  const mensajePago = document.getElementById("mensaje-pago");

  const email = document.getElementById("email");
  const nombreTarjeta = document.getElementById("nombre-tarjeta");
  const numeroTarjeta = document.getElementById("numero-tarjeta");
  const exp = document.getElementById("exp");
  const cvv = document.getElementById("cvv");

  let pedidoID = parseInt(localStorage.getItem("pedidoID")) || 0;
  let intentosCorreo = 0;

  if (formPago) {
    nombreTarjeta.disabled = true;
    numeroTarjeta.disabled = true;
    exp.disabled = true;
    cvv.disabled = true;

    // Validar correo electrónico
    email.addEventListener("blur", () => {
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      const valor = email.value.trim();
      intentosCorreo++;

      if (!valor.endsWith(".com")) {
        alert("⚠️ Recuerda terminar tu correo con '.com'");
      }

      if (emailRegex.test(valor)) {
        nombreTarjeta.disabled = false;
        intentosCorreo = 0;
      } else {
        nombreTarjeta.disabled = true;
        if (intentosCorreo >= 2) {
          alert("Ejemplo válido: diego@samuel.com");
        } else {
          alert("❌ Ingresa un correo válido.");
        }
      }
    });

    // Validar nombre de tarjeta
    nombreTarjeta.addEventListener("input", () => {
      if (/\d/.test(nombreTarjeta.value)) {
        alert("❌ Por favor ingresar solo texto.");
        nombreTarjeta.value = nombreTarjeta.value.replace(/[0-9]/g, "");
      }
    });

    nombreTarjeta.addEventListener("blur", () => {
      const nombreRegex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/;
      if (nombreRegex.test(nombreTarjeta.value.trim())) {
        numeroTarjeta.disabled = false;
      } else {
        numeroTarjeta.disabled = true;
        alert("❌ El nombre solo puede contener letras.");
      }
    });

    // Número de tarjeta (10 dígitos)
    numeroTarjeta.addEventListener("input", () => {
      numeroTarjeta.value = numeroTarjeta.value.replace(/[^0-9]/g, "");
      if (numeroTarjeta.value.length > 10) numeroTarjeta.value = numeroTarjeta.value.slice(0, 10);
    });

    numeroTarjeta.addEventListener("blur", () => {
      if (/^[0-9]{10}$/.test(numeroTarjeta.value.trim())) {
        exp.disabled = false;
      } else {
        exp.disabled = true;
        alert("❌ El número de tarjeta debe tener exactamente 10 dígitos.");
      }
    });

    // Fecha MM/AA
    exp.addEventListener("input", () => {
      exp.value = exp.value.replace(/[^0-9/]/g, "");
      if (exp.value.length > 5) exp.value = exp.value.slice(0, 5);
    });

    exp.addEventListener("blur", () => {
      const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (expRegex.test(exp.value.trim())) {
        cvv.disabled = false;
      } else {
        cvv.disabled = true;
        alert("❌ Ingresa la fecha en formato MM/AA.");
      }
    });

    // CVV
    cvv.addEventListener("input", () => {
      cvv.value = cvv.value.replace(/[^0-9]/g, "");
      if (cvv.value.length > 3) cvv.value = cvv.value.slice(0, 3);
    });

    // Submit
    formPago.addEventListener("submit", e => {
      e.preventDefault();

      if (carrito.length === 0) {
        mensajePago.style.color = "red";
        mensajePago.textContent = "❌ No puedes pagar un carrito vacío.";
        return;
      }

      if (cvv.value.length !== 3) {
        mensajePago.style.color = "red";
        mensajePago.textContent = "❌ El CVV debe tener 3 dígitos.";
        return;
      }

      pedidoID++;
      localStorage.setItem("pedidoID", pedidoID);

      mensajePago.style.color = "green";
      mensajePago.textContent = `🎉 Su pedido número ${pedidoID} fue tomado con éxito. Gracias por su compra.`;

      carrito = [];
      guardarCarrito();
      renderCarrito();
    });
  }
});