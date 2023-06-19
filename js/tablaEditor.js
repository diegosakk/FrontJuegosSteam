
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
    const nombre = document.getElementById('nombre').value.trim();
    const pais = document.getElementById('pais').value.trim();

    // Validar campos requeridos
    if (!nombre || !pais) {
        Swal.fire({
            title: 'Campos requeridos',
            text: 'Por favor completa todos los campos',
            icon: 'error',

        });
        return; // Detener la ejecución si hay campos requeridos vacíos
    }

    const editor = {
        Nombre: nombre,
        Pais: pais,
    }

    fetch('https://localhost:7214/api/Editor', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editor)
    }).then(response => {
        if (response.ok) {
            cargarEditor();
            var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
            myModal.hide();
            limpiar();
            Swal.fire({
                title: 'Guardado',
                text: 'El editor ha sido guardado con éxito',
                icon: 'success',
            });
        } else {
            response.json().then(data => {
                Swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                });
            });
        }
    }).catch(error => {
        // Manejar errores de red u otros errores
        console.error('Error en la solicitud de guardar el editor:', error);
    });
}
const modificar = () => {
    const id = document.getElementById('id').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const pais = document.getElementById('pais').value.trim();

    // Validar campos requeridos
    if (!nombre || !pais) {
        Swal.fire({
            title: 'Campos requeridos',
            text: 'Por favor completa todos los campos',
            icon: 'error',
        });
        return; // Detener la ejecución si hay campos requeridos vacíos
    }

    const editor = {
        Id: id,
        Nombre: nombre,
        Pais: pais,
    }

    fetch('https://localhost:7214/api/Editor/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editor)
    }).then(response => {
        if (response.ok) {
            cargarEditor();
            const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
            myModal.hide();
            limpiar();
            Swal.fire({
                title: 'Modificado',
                text: 'El editor ha sido modificado con éxito',
                icon: 'success',
            });
        } else {
            response.json().then(data => {
                Swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                });
            });
        }
    }).catch(error => {
        // Manejar errores de red u otros errores
        console.error('Error en la solicitud de editar el editor:', error);
    });
}
const guardar = () => {
    if (document.getElementById('id').value == '') {

        crear();
    }
    else {
        modificar();
    }

}
const limpiar = () => {

    document.querySelectorAll('.form-control').forEach(e => {
        e.value = ''
        e.parentElement.classList.remove('is-valid');


    })
    const formedit = document.getElementById('formeditor');
    formedit.reset();
}

const eliminar = (id) => {
    // Levanta SweetAlert que indica si se quiere eliminar
    Swal.fire({
        title: '¿Estás seguro de eliminar el editor?',
        text: 'No podrás recuperarlo después de eliminarlo',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Consumir API para eliminar
            fetch(`https://localhost:7214/api/Editor/${id}`, {
                method: 'delete',
            })
                .then((response) => {
                    if (response.ok) {
                        Swal.fire(
                            'Eliminado',
                            'El editor ha sido eliminado con éxito',
                            'success'
                        );
                        cargarEditor();
                    } else {
                        Swal.fire(
                            'Error',
                            'No se puede eliminar el editor asociado a un juego',
                            'error'
                        );
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el editor',
                        'error'
                    );
                });
        }
    });
};

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