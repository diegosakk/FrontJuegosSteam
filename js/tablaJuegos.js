
const cargarJuegos = () => {
    fetch('https://localhost:7247/api/sucursal')
        .then(response => response.json())
        .then(juegos => {
            if (juegos.success) {
                let tabla = ''
                juegos.data.forEach(s => {
                    tabla += `
                        <tr>
                            <td>${s.ciudad}</td>
                            <td>${s.dirección}</td>
                            <td>${s.encargado}</td>
                            <td>${s.fono}</td>
                            <td>${s.email}</td>
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
    const sucursal = {
        Ciudad: document.getElementById('ciudad').value.trim(),
        Dirección: document.getElementById('direccion').value.trim(),
        Fono: document.getElementById('fono').value.trim(),
        Email: document.getElementById('email').value.trim(),
        Encargado: document.getElementById('encargado').value.trim(),
    }

    fetch('https://localhost:7247/api/sucursal', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sucursal)
    }).then(response => {
        console.log(response.json())

        cargarSucursal()
        var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('saveModal'));
        myModal.hide();
        limpiar()
    })
}
const modificar = () => {
    const sucursal = {
        Id: document.getElementById('id').value,
        Ciudad: document.getElementById('ciudad').value.trim(),
        Dirección: document.getElementById('direccion').value.trim(),
        Fono: document.getElementById('fono').value.trim(),
        Email: document.getElementById('email').value.trim(),
        Encargado: document.getElementById('encargado').value.trim(),
    }

    fetch('https://localhost:7247/api/sucursal/' + document.getElementById('id').value, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sucursal)
    }).then(response => {
        cargarSucursal()
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
        title: '¿Estás seguro de eliminar la sucursal?',
        text: 'No podrás recuperarla después de eliminarla',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            //consumir api eliminar
            fetch(`https://localhost:7247/api/sucursal/${id}`, {
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
    fetch(`https://localhost:7247/api/sucursal/${id}`)
        .then(response => response.json())
        .then(sucursal => {
            if (sucursal.success) {
                document.getElementById('id').value = sucursal.data.id
                document.getElementById('ciudad').value = sucursal.data.ciudad
                document.getElementById('direccion').value = sucursal.data.dirección
                document.getElementById('fono').value = sucursal.data.fono
                document.getElementById('email').value = sucursal.data.email
                document.getElementById('encargado').value = sucursal.data.encargado

                const modalSave = new bootstrap.Modal(document.getElementById('modalSave'))
                modalSave.show()
            }
        })
}
cargarSucursal()