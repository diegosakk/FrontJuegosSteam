const cargarJuegos = () => {
    fetch('https://localhost:7214/api/juego')
        .then(response => response.json())
        .then(juegos => {
            if (juegos.success) {
                let tabla = ''
                juegos.data.forEach(s => {
                    tabla += `
                        <tr>
                            <td>${s.nombre}</td>
                            <td>${s.categoria}</td>
                            <td>${s.desarrollador}</td>
                            <td>${s.editor}</td>
                            <td>${s.plataforma}</td>
                            <td>${s.precio}</td>
                            <td>${s.usuario_registrado}</td>
                            <td nowrap>
                                <button class="btn btn-warning text-white" onclick="editar(${s.id})">
                                    Editar
                                </button>
                                <button class="btn btn-danger" onclick="eliminar(${s.id})">
                                    Eliminar
                                </button>
                            </td>
                        <tr>
                    `
                })
                document.getElementById('listarDatos').innerHTML = tabla
            }
            else {
                document.getElementById('tablita').hidden = false
            }
        })
}
const crear = () => {
    const juego = {
        Nombre: document.getElementById('nombre').value.trim(),
        Categoria: document.getElementById('categoria').value.trim(),
        Desarrollador: document.getElementById('desarrollador').value.trim(),
        Editor: document.getElementById('editor').value.trim(),
        Plataforma: document.getElementById('plataforma').value.trim(),
        Precio: document.getElementById('precio').value.trim(),
        Usuario_registrado: document.getElementById('usuario').value.trim(),

    }

    fetch('https://localhost:7214/api/juego', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(juego)
    }).then(response => {
        console.log(response.json())

        cargarJuegos()
        var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
        myModal.hide();
        limpiar()
    })
}
const modificar = () => {
    const juego = {
        Id: document.getElementById('id').value,
        Nombre: document.getElementById('nombre').value.trim(),
        Categoria: document.getElementById('categoria').value.trim(),
        Desarrollador: document.getElementById('desarrollador').value.trim(),
        Editor: document.getElementById('editor').value.trim(),
        Plataforma: document.getElementById('plataforma').value.trim(),
        Precio: document.getElementById('precio').value.trim(),
        Usuario_registrado: document.getElementById('usuario').value.trim(),


    }

    fetch('https://localhost:7214/api/juego/' + document.getElementById('id').value, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(juego)
    }).then(response => {
        cargarJuegos()
        const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
        myModal.hide();
        limpiar()
    })

}
const guardar = () => {
    if (document.getElementById('id').value == '')
        crear()
    else
        modificar()
}
const limpiar = () => {
    document.querySelectorAll('.form-control').forEach(e => {
        e.value = ''
    })
}
//método para eliminar una sucursal
const eliminar = (id) => {
    //levanta sweetalert que indica si se quiere eliminar
    Swal.fire({
        title: '¿Estás seguro de eliminar la el juego?',
        text: 'No podrás recuperarla después de eliminarla',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            //consumir api eliminar
            fetch(`https://localhost:7214/api/sucursal/${id}`, {
                method: 'delete'
            }).then(response => {
                Swal.fire(
                    'Eliminado',
                    'La sucursal ha sido eliminado con éxito',
                    'success'
                )
                cargarSucursal()
            })

        }
    })
}

const editar = (id) => {
    fetch(`https://localhost:7214/api/juego/${id}`)
        .then(response => response.json())
        .then(juego => {
            if (juego.success) {
                document.getElementById('id').value = juego.data.id
                document.getElementById('nombre').value = juego.data.nombre
                document.getElementById('categoria').value = juego.data.categoria
                document.getElementById('desarrollador').value = juego.data.desarrollador
                document.getElementById('editor').value = juego.data.editor
                document.getElementById('plataforma').value = juego.data.plataforma
                document.getElementById('precio').value = juego.data.precio
                document.getElementById('usuario').value = juego.data.usuario_registrado



                const modalSave = new bootstrap.Modal(document.getElementById('modalSave'))
                modalSave.show()
            }
        })
}

cargarSucursal();