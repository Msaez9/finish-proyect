class Carrito{

    comprarProducto(e){
        e.preventDefault();
        if(e.target.classList.contains('agregar-carrito')){
            const producto = e.target.parentElement.parentElement;
            this.leerDatosProducto(producto);
            //console.log(producto);
        }
    }

    leerDatosProducto(producto){
        const infoProducto = {
            imagen : producto.querySelector('img').src,
            titulo : producto.querySelector('h4').textContent,
            precio : producto.querySelector('.precio span').textContent,
            id : producto.querySelector('a').getAttribute('data-id'),
            cantidad : 1
        }
        infoProducto.precio.replace('$','');

        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function(productoLS){
            if(productoLS.id === infoProducto.id){
                productosLS = productoLS.id;
            }
        });
        if(productosLS === infoProducto.id){
            Swal.fire({
                type: 'info',
                title: 'Oh no',
                text: 'El producto ya está agregado',
                timer: 1000,
                showConfirmButton: false
            })
        }
        else{
            this.insertarCarrito(infoProducto);
        }
        //this.insertarCarrito(infoProducto);
    }

    insertarCarrito(producto){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=100>
            </td>
            <td>${producto.titulo}</td>
            <td>$ ${producto.precio}</td>
            <td>
                <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
            </td>
            
        `;
        listaProductos.appendChild(row);
        this.guardarProductosLocalStorage(producto);
        this.actualizarTotalTienda();
    }

    eliminarProducto(e){
        e.preventDefault();
        let producto, productoId;
        if(e.target.classList.contains('borrar-producto')){
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoId = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoId);
        this.actualizarTotalTienda();
    }

    vaciarCarrito(e){
        e.preventDefault();
        while(listaProductos.firstChild){
           listaProductos.removeChild(listaProductos.firstChild); 
        }
        this.vaciarLocalStorage();
        return false;
    }

    guardarProductosLocalStorage(producto){
        let productos;
        productos = this.obtenerProductosLocalStorage();
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    obtenerProductosLocalStorage(){
        let productoLS;
        if(localStorage.getItem('productos') === null){
            productoLS = [];
        }
        else{
            productoLS = JSON.parse(localStorage.getItem('productos'));
        }
        return productoLS;
    }

    leerLocalStorage(){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function(producto){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
                </td>           
        `;
        listaProductos.appendChild(row);
        });
    }

    leerLocalStorageCompra(){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td class="precio">${producto.precio}</td>
                <td>
                    <input type="number" class="form-control cantidad" min="1" value=${producto.cantidad} />
                </td>
                <td class="total">${parseFloat(producto.precio.replace('$','')) * producto.cantidad}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" style="font-size:30px" data-id="${producto.id}"></a>
                </td>
            `;
            listaCompra.appendChild(row);
        });
    }

    eliminarProductoLocalStorage(productoId){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function(productoLS, index){            
            if(productoLS.id === productoId){
                productosLS.splice(index, 1);
            }
        });

        localStorage.setItem('productos', JSON.stringify(productosLS));
        this.actualizarTotalTienda();
    }

    calcularLinea(e){
        
        const tr = e.target.parentElement.parentElement;
        const cantidad = e.target.value;
        const precio = tr.getElementsByClassName('precio')[0];
        const total = tr.getElementsByClassName('total')[0];
        
        console.log({tr, cantidad, precio});

        total.innerHTML = (precio.innerHTML.replace("$", '') * cantidad);
    }

    vaciarLocalStorage(){
        localStorage.clear();
        this.actualizarTotalTienda();
    }

    procesarPedido(e){
        e.preventDefault();
        if(this.obtenerProductosLocalStorage().length === 0){
            Swal.fire({
                type: 'error',
                tittle: 'Oh no',
                text: 'El carrito está vacío',
                timer: 2000,
                showConfirmButton: false
            })
        }
        else{
            location.href = "compra.html";
        }
    }

    obtenerEvento(e) {
        e.preventDefault();
        let id, cantidad, producto, productosLS;
        if (e.target.classList.contains('cantidad')) {
            producto = e.target.parentElement.parentElement;
            id = producto.querySelector('a').getAttribute('data-id');
            cantidad = producto.querySelector('input').value;
            productosLS = this.obtenerProductosLocalStorage();
            productosLS.forEach(function (productoLS, index) {
                if (productoLS.id === id) {
                    productoLS.cantidad = cantidad;                    
                }    
            });
            
            localStorage.setItem('productos', JSON.stringify(productosLS));
            this.actualizarTotalTienda();
        }
        else {
            console.log("click afuera");
        }
    }
    
    actualizarTotalTienda() {
        let total = 0;
        const tbl = document.getElementById('carrito');
        const tbody = tbl.getElementsByTagName('tbody')[0];
        const carritoTr = tbody.getElementsByTagName('tr');

        const totalTienda = document.querySelector('.shoppingCartTotal');
        if(totalTienda && carritoTr.length >= 1){
            for(let i = 0; i < carritoTr.length; i++){
                const tr = carritoTr[i];
                const trTotal = tr.getElementsByClassName('total')[0].innerHTML;
                console.log({tr, trTotal})
                total += parseFloat(trTotal);
            };
            console.log({total});
            totalTienda.innerHTML = "$ "+total;
        }
    }
}