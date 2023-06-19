const cargarCategoria = () => {
    fetch('https://localhost:7214/api/Categoria')
        .then(response => response.json())
        .then(categoria => {
            if (categoria.success) {
                let tabla = ''
                categoria.data.forEach(c => {
                    tabla += `
                        <tr>
                            <td>${c.nombre}</td>
                            <td>${c.descripcion}</td>
                         <td nowrap>
                                <button class="btn btn-warning text-white" onclick="editar(${c.id})">
                                    Editar
                                </button>
                                <button class="btn btn-danger" onclick="eliminar(${c.id})">
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
    const descripcion = document.getElementById('descripcion').value.trim();

    // Validar campos requeridos
    if (!nombre || !descripcion) {
        Swal.fire({
            title: 'Campos requeridos',
            text: 'Por favor completa todos los campos',
            icon: 'error',

        });
        return; // Detener la ejecución si hay campos requeridos vacíos
    }

    const categoria = {
        nombre: nombre,
        descripcion: descripcion,
    }


    fetch('https://localhost:7214/api/Categoria', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
    }).then(response => {
        if (response.ok) {
            cargarCategoria();
            var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
            myModal.hide();
            limpiar();
            Swal.fire({
                title: 'Guardado',
                text: 'La categoria ha sido guardado con éxito',
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
        console.error('Error en la solicitud de guardar el la categoria:', error);
    });
}


const modificar = () => {
    const id = document.getElementById('id').value;
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();

    if (!nombre || !descripcion) {
        Swal.fire({
            title: 'Campos requeridos',
            text: 'Por favor completa todos los campos',
            icon: 'error',

        });
        return; // Detener la ejecución si hay campos requeridos vacíos
    }
    const categoria = {
        Id: id,
        Nombre: nombre,
        Descripcion: descripcion,
    }

    fetch('https://localhost:7214/api/Categoria/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
    }).then(response => {
        if (response.ok) {
            cargarCategoria();
            const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
            myModal.hide();
            limpiar();
            Swal.fire({
                title: 'Modificado',
                text: 'La categoria ha sido modificado con éxito',
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
        console.error('Error en la solicitud de editar la categoria:', error);
    });
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
        e.parentElement.classList.remove('is-valid');
    })
    const formcat = document.getElementById('formcat');
    formcat.reset();
}

const eliminar = (id) => {
    // Levanta SweetAlert que indica si se quiere eliminar
    Swal.fire({
        title: '¿Estás seguro de eliminar la categoria?',
        text: 'No podrás recuperarlo después de eliminarlo',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Consumir API para eliminar
            fetch(`https://localhost:7214/api/Categoria/${id}`, {
                method: 'delete',
            })
                .then((response) => {
                    if (response.ok) {
                        Swal.fire(
                            'Eliminado',
                            'La categoria ha sido eliminado con éxito',
                            'success'
                        );
                        cargarCategoria();
                    } else {
                        Swal.fire(
                            'Error',
                            'No se puede eliminar la categoria asociado a un juego',
                            'error'
                        );
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar la categoria',
                        'error'
                    );
                });
        }
    });
};

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
