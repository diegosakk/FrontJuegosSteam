
const cargarRol = () => {
    fetch('https://localhost:7214/api/Role')
        .then(response => response.json())
        .then(rol => {
            if (rol.success) {
                let tabla = ''
                rol.data.forEach(s => {
                    tabla += `
                        <tr>
                            <td>${s.nombre}</td>
                            <td>${s.permisos}</td>
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
    const rol = {
        Nombre: document.getElementById('nombre').value.trim(),
        Permisos: document.getElementById('rol').value.trim(),

    }

    fetch('https://localhost:7214/api/Role', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rol)
    }).then(response => {
        console.log(response.json())

        cargarRol()
        var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('saveModal'));
        myModal.hide();
        limpiar()
    })
}
const modificar = () => {
    const rol = {
        Id: document.getElementById('id').value,
        Nombre: document.getElementById('nombre').value.trim(),
        Permisos: document.getElementById('rol').value.trim(),
    }

    fetch('https://localhost:7214/api/Role/' + document.getElementById('id').value, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rol)
    }).then(response => {
        cargarRol()
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
        title: '¿Estás seguro de eliminar el rol?',
        text: 'No podrás recuperarla después de eliminarla',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            //consumir api eliminar
            fetch(`https://localhost:7214/api/Role/${id}`, {
                method: 'delete'
            }).then(response => {
                Swal.fire(
                    'Eliminado',
                    'El rol ha sido eliminado con éxito',
                    'success'
                )
                cargarRol()
            })

        }
    })
}

const editar = (id) => {
    fetch(`https://localhost:7214/api/Role/${id}`)
        .then(response => response.json())
        .then(rol => {
            if (rol.success) {
                document.getElementById('id').value = rol.data.id
                document.getElementById('nombre').value = rol.data.nombre
                document.getElementById('rol').value = rol.data.permisos

                const modalSave = new bootstrap.Modal(document.getElementById('modalSave'))
                modalSave.show()
            }
        })
}
cargarRol()