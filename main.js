const titulo = document.getElementById("titulo");

//Usamos localStorage para guardar el nombre de usuario

const checkearUsuario = () => {
    let usuarioLS = localStorage.getItem("usuario")
    let usuario = ""

    if (usuarioLS) {
        usuario = usuarioLS
    } else {
        usuario = prompt("Ingrese su nombre:");
        localStorage.setItem("usuario", usuario);
    }

    titulo.innerHTML = `Hola ${usuario}. Te damos la bienvenida a Arañita`;

}

//Generamos una promesa

const revisarUsuario = () => {
    return new Promise( (resolve, reject) => {
        setTimeout(() => {
            checkearUsuario()
        }, 3000)
    })
}

revisarUsuario()

//Creo un boton que borra el usuario y vuelve a preguntar
const borrarUsuario = document.querySelector("#boton1")

borrarUsuario.addEventListener("click", () => {
    localStorage.removeItem("usuario")
    checkearUsuario()
})

//Agrego botones como const

const modalAbrirCarrito = document.querySelector("#modal-abrir-carrito");
const modalCerrarCarrito = document.querySelector("#modal-cerrar-carrito");
const modalContainerCarrito = document.querySelector("#modal-container-carrito");
const contenedorCarrito = document.querySelector("#modal-carrito");
const contadorCarrito = document.querySelector("#contadorCarrito");
const contadorPrecioTotal = document.querySelector("#precioTotal");


modalAbrirCarrito.addEventListener("click", () => {
    modalContainerCarrito.classList.toggle("modal-container-active-carrito")
})

modalCerrarCarrito.addEventListener("click", () => {
    modalContainerCarrito.classList.toggle("modal-container-active-carrito")
})

const contenedorProductos = document.querySelector("#productos")

fetch(`./JS/data.json`)
    .then((resp) => resp.json())
    .then((data) => {

        data.forEach((producto) => {
            const div = document.createElement("div");
            div.className = "producto";

            div.innerHTML = `
                <img src=${producto.img} alt="">
                <h3>${producto.nombre}</h3>
                <p>${producto.desc}</p>
                <p>Tamaño: ${producto.tamaño}</p>
                <p class="precioProducto">Precio: $${producto.precio}</p>
            `;
            const button = document.createElement("button")
            button.className = `boton-agregar`
            button.innerHTML = `Agregar <i class="fas fa-shopping-cart"></i>`

            //Creo el boton por fuera del innerHTML para que el inspector de elementos no me muestre todo el detalle del boton
            button.addEventListener("click" , () => {
                agregarAlCarrito(producto.id)
            })

            div.append(button)

            contenedorProductos.append(div);
        })

        const agregarAlCarrito = (id) => {
            const producto = data.find( (item) => item.id === id)
            carrito.push(producto)
            localStorage.setItem("carrito", JSON.stringify(carrito))
        
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado al carrito',
                toast: true,
                timer: 1500,
                showConfirmButton: false,
                position: 'bottom-left',
            })
        
            renderCarrito()
        }

    })

const carrito = []

const renderCarrito = () => {
    //El primer codigo limpia el contador para no repetir los productos
    contenedorCarrito.innerHTML=""

    //Activamos 3 funciones (Actualizamos el listado, mostramos la cantidad de productos, calculamos el total en el carrito)
    renderListadoCarrito()
    renderCantidadCarrito()
    renderTotalCarrito()
}

const renderListadoCarrito = () => {
    carrito.forEach((producto) => {
        const div = document.createElement("div")
        div.id = "Prod Nº" + producto.id
        div.className = "productoEnCarrito"
        div.innerHTML = `
            <p>${producto.nombre}</p>
            <p>Precio: $${producto.precio}</p>
            `

        contenedorCarrito.append(div)
    })
}

const renderCantidadCarrito = () => {
    contadorCarrito.innerText = carrito.length
}

const renderTotalCarrito = () => {
    contadorPrecioTotal.innerText = carrito.reduce((acc, producto) => acc += producto.precio, 0)
}

const vaciarCarrito = document.querySelector("#modal-vaciar")

vaciarCarrito.addEventListener("click", () => {

    Swal.fire({
        title: '¿Desea vaciar el carrito?',
        text: "No podrá recuperar los productos",
        icon: 'info',
        showCancelButton: true,
        color: 'white',
        confirmButtonColor: '#1b66ff', 
        cancelButtonColor: '#f40034', 
        confirmButtonText: 'Si, vaciar',
        cancelButtonText: 'Cancelar',
        background: '#995D81'
      }).then((result) => {

        if (result.isConfirmed) {
            Swal.fire({
                title:'Listo',
                text:'Tu carrito fue vaciado',
                icon:'success',
                color: 'white',
                background: '#995D81'
            })

            carrito.length = 0
            localStorage.setItem("carrito", JSON.stringify(carrito))        
            renderCarrito()

        }
      })
})

const carritoLS = JSON.parse(localStorage.getItem("carrito"))

//Con checkear Carrito lo que hacemos es poder verificar si habia productos en el carrito anteriormente
const checkearCarrito = () => {
    if (carritoLS) {
        for (const producto of carritoLS) {
            carrito.push(producto)
        }
    } else {
        localStorage.setItem("carrito", carrito)
    }

    renderCarrito()
}

checkearCarrito()