// Agregar producto al carrito (simulado con alert)
function agregar() {
  alert("✅ Producto agregado a tu EcoHome");
}

// Filtro de búsqueda
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

  // Filtro por categoría
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

  if (!items) return; // No estamos en carrito.html

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

  if (formPago) {
    formPago.addEventListener("submit", e => {
      e.preventDefault();
      if (carrito.length === 0) {
        mensajePago.style.color = "red";
        mensajePago.textContent = "❌ No puedes pagar un carrito vacío.";
        return;
      }
      mensajePago.style.color = "green";
      mensajePago.textContent = "🎉 ¡Pago exitoso! Tu pedido ha sido confirmado.";
      carrito = [];
      guardarCarrito();
      renderCarrito();
    });
  }
});

