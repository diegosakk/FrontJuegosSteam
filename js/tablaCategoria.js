
const cargarCategoria = () => {
    fetch('https://localhost:7214/api/Categoria')
        .then(response => response.json())
        .then(categoria => {
            if (categoria.success) {
                let tabla = ''
                categoria.data.forEach(s => {
                    tabla += `
                        <tr>
                            <td>${s.nombre}</td>
                            <td>${s.descripcion}</td>
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
    const categoria = {
        Nombre: document.getElementById('nombre').value.trim(),
        Descripcion: document.getElementById('descripcion').value.trim(),

    }

    fetch('https://localhost:7214/api/Categoria', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
    }).then(response => {
        console.log(response.json())

        cargarCategoria()
        var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
        myModal.hide();
        limpiar()
    })
}
const modificar = () => {
    const categoria = {
        Id: document.getElementById('id').value,
        Nombre: document.getElementById('nombre').value.trim(),
        Descripcion: document.getElementById('descripcion').value.trim(),
    }

    fetch('https://localhost:7214/api/Categoria/' + document.getElementById('id').value, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
    }).then(response => {
        cargarCategoria()
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

const eliminar = (id) => {
    //levanta sweetalert que indica si se quiere eliminar
    Swal.fire({
        title: '¿Estás seguro de eliminar el categoria?',
        text: 'No podrás recuperarla después de eliminarla',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            //consumir api eliminar
            fetch(`https://localhost:7214/api/Categoria/${id}`, {
                method: 'delete'
            }).then(response => {
                Swal.fire(
                    'Eliminado',
                    'El categoria ha sido eliminado con éxito',
                    'success'
                )
                cargarCategoria()
            })

        }
    })
}

const editar = (id) => {
    fetch(`https://localhost:7214/api/Categoria/${id}`)
        .then(response => response.json())
        .then(categoria => {
            if (categoria.success) {
                document.getElementById('id').value = categoria.data.id
                document.getElementById('nombre').value = categoria.data.nombre
                document.getElementById('descripcion').value = categoria.data.descripcion

                const modalSave = new bootstrap.Modal(document.getElementById('modalSave'))
                modalSave.show()
            }
        })
}
cargarCategoria()