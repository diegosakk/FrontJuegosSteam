
const cargarEditor = () => {
    fetch('https://localhost:7214/api/Editor')
        .then(response => response.json())
        .then(editor => {
            if (editor.success) {
                let tabla = ''
                editor.data.forEach(s => {
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
    const editor = {
        Nombre: document.getElementById('nombre').value.trim(),
        Pais: document.getElementById('pais').value.trim(),

    }

    fetch('https://localhost:7214/api/Editor', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editor)
    }).then(response => {
        console.log(response.json())

        cargarEditor()
        var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('saveModal'));
        myModal.hide();
        limpiar()
    })
}
const modificar = () => {
    const editor = {
        Id: document.getElementById('id').value,
        Nombre: document.getElementById('nombre').value.trim(),
        Pais: document.getElementById('pais').value.trim(),
    }

    fetch('https://localhost:7214/api/Editor' + document.getElementById('id').value, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editor)
    }).then(response => {
        cargarEditor()
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
        title: '¿Estás seguro de eliminar el editor?',
        text: 'No podrás recuperarla después de eliminarla',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            //consumir api eliminar
            fetch(`https://localhost:7214/api/Editor/${id}`, {
                method: 'delete'
            }).then(response => {
                Swal.fire(
                    'Eliminado',
                    'El editor ha sido eliminado con éxito',
                    'success'
                )
                cargarEditor()
            })

        }
    })
}

const editar = (id) => {
    fetch(`https://localhost:7214/api/Editor/${id}`)
        .then(response => response.json())
        .then(editor => {
            if (editor.success) {
                document.getElementById('id').value = editor.data.id
                document.getElementById('nombre').value = editor.data.nombre
                document.getElementById('pais').value = editor.data.pais

                const modalSave = new bootstrap.Modal(document.getElementById('modalSave'))
                modalSave.show()
            }
        })
}
cargarEditor()