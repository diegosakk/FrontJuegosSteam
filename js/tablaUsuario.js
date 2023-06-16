
const cargarUsuarios = () => {
    fetch('https://localhost:7214/api/Usuario')
        .then(response => response.json())
        .then(usuario => {
            if (usuario.success) {
                let tabla = ''
                usuario.data.forEach(s => {
                    tabla += `
                        <tr>
                            <td>${s.nombre}</td>
                            <td>${s.rut}</td>
                            <td>${s.correo}</td>
                            <td>${s.telefono}</td>
                            <td>${s.permisoss}</td>
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
    const usuario = {
        Nombre: document.getElementById('nombre').value.trim(),
        RUT: document.getElementById('rut').value.trim(),
        Correo: document.getElementById('correo').value.trim(),
        Telefono: document.getElementById('telefono').value.trim(),
        Roles: document.getElementById('roles').value.trim(),
    }

    fetch('https://localhost:7214/api/Usuario', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    }).then(response => {
        console.log(response.json())

        cargarusuario()
        var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('saveModal'));
        myModal.hide();
        limpiar()
    })
}
const modificar = () => {
    const usuario = {
        Id: document.getElementById('id').value,
        Nombre: document.getElementById('nombre').value.trim(),
        RUT: document.getElementById('rut').value.trim(),
        Correo: document.getElementById('correo').value.trim(),
        Telefono: document.getElementById('telefono').value.trim(),
        Roles: document.getElementById('roles').value.trim(),
    }

    fetch('hhttps://localhost:7214/api/Usuario/' + document.getElementById('id').value, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    }).then(response => {
        cargarusuario()
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
//método para eliminar una usuario
const eliminar = (id) => {
    //levanta sweetalert que indica si se quiere eliminar
    Swal.fire({
        title: '¿Estás seguro de eliminar la usuario?',
        text: 'No podrás recuperarla después de eliminarla',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            //consumir api eliminar
            fetch(`https://localhost:7214/api/Usuario/${id}`, {
                method: 'delete'
            }).then(response => {
                Swal.fire(
                    'Eliminado',
                    'La usuario ha sido eliminado con éxito',
                    'success'
                )
                cargarusuario()
            })

        }
    })
}

const editar = (id) => {
    fetch(`https://localhost:7214/api/Usuario/${id}`)
        .then(response => response.json())
        .then(usuario => {
            if (usuario.success) {
                document.getElementById('id').value = usuario.data.id
                document.getElementById('nombre').value = usuario.data.nombre
                document.getElementById('rut').value = usuario.data.rut
                document.getElementById('correo').value = usuario.data.correos
                document.getElementById('telefono').value = usuario.data.telefono
                document.getElementById('roles').value = usuario.data.roles

                const modalSave = new bootstrap.Modal(document.getElementById('modalSave'))
                modalSave.show()
            }
        })
}
cargarUsuarios()