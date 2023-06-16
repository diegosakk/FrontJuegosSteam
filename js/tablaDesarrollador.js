
const cargarDesarrollador = () => {
    fetch('https://localhost:7214/api/Desarrollador')
        .then(response => response.json())
        .then(desarrollador => {
            if (desarrollador.success) {
                let tabla = ''
                desarrollador.data.forEach(s => {
                    tabla += `
                        <tr>
                            <td>${s.nombre}</td>
                            <td>${s.pais}</td>
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
    const desarrollador = {
        Nombre: document.getElementById('nombre').value.trim(),
        Pais: document.getElementById('pais').value.trim(),

    }

    fetch('https://localhost:7214/api/Desarrollador', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(desarrollador)
    }).then(response => {
        console.log(response.json())

        cargarDesarrollador()
        var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('saveModal'));
        myModal.hide();
        limpiar()
    })
}
const modificar = () => {
    const desarrollador = {
        Id: document.getElementById('id').value,
        Nombre: document.getElementById('nombre').value.trim(),
        Pais: document.getElementById('pais').value.trim(),
    }

    fetch('https://localhost:7214/api/Desarrollador/' + document.getElementById('id').value, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(desarrollador)
    }).then(response => {
        cargarDesarrollador()
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
        title: '¿Estás seguro de eliminar el desarrollador?',
        text: 'No podrás recuperarla después de eliminarla',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            //consumir api eliminar
            fetch(`https://localhost:7214/api/Desarrollador/${id}`, {
                method: 'delete'
            }).then(response => {
                Swal.fire(
                    'Eliminado',
                    'El desarrollador ha sido eliminado con éxito',
                    'success'
                )
                cargarDesarrollador()
            })

        }
    })
}

const editar = (id) => {
    fetch(`https://localhost:7214/api/Desarrollador/${id}`)
        .then(response => response.json())
        .then(desarrollador => {
            if (desarrollador.success) {
                document.getElementById('id').value = desarrollador.data.id
                document.getElementById('nombre').value = desarrollador.data.nombre
                document.getElementById('pais').value = desarrollador.data.pais

                const modalSave = new bootstrap.Modal(document.getElementById('modalSave'))
                modalSave.show()
            }
        })
}
cargarDesarrollador()