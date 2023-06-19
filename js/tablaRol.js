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

    const nombre = document.getElementById('nombre').value.trim();
    const permisos = document.getElementById('rol').value.trim();
    // Validar campos requeridos
    if (!nombre || !permisos) {
        Swal.fire({
            title: 'Campos requeridos',
            text: 'Por favor completa todos los campos',
            icon: 'error',

        });
        return; // Detener la ejecución si hay campos requeridos vacíos
    }

    const rol = {
        nombre: nombre,
        permisos: permisos,
    }


    fetch('https://localhost:7214/api/Role', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rol)
    }).then(response => {
        if (response.ok) {
            cargarRol();
            var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
            myModal.hide();
            limpiar();
            Swal.fire({
                title: 'Guardado',
                text: 'El rol ha sido guardado con éxito',
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
        console.error('Error en la solicitud de guardar el rol:', error);
    });
}


const modificar = () => {
    const id = document.getElementById('id').value;
    const nombre = document.getElementById('nombre').value.trim();
    const permisos = document.getElementById('rol').value.trim();

    if (!nombre || !permisos) {
        Swal.fire({
            title: 'Campos requeridos',
            text: 'Por favor completa todos los campos',
            icon: 'error',

        });
        return; // Detener la ejecución si hay campos requeridos vacíos
    }
    const rol = {
        Id: id,
        Nombre: nombre,
        Permisos: permisos,
    }

    fetch('https://localhost:7214/api/Role/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rol)
    }).then(response => {
        if (response.ok) {
            cargarRol();
            const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
            myModal.hide();
            limpiar();
            Swal.fire({
                title: 'Modificado',
                text: 'El rol ha sido modificado con éxito',
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
        console.error('Error en la solicitud de editar el rol:', error);
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
    const formRol = document.getElementById('formrol');
    formRol.reset();
}

const eliminar = (id) => {
    // Levanta SweetAlert que indica si se quiere eliminar
    Swal.fire({
        title: '¿Estás seguro de eliminar el rol?',
        text: 'No podrás recuperarlo después de eliminarlo',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Consumir API para eliminar
            fetch(`https://localhost:7214/api/Role/${id}`, {
                method: 'delete',
            })
                .then((response) => {
                    if (response.ok) {
                        Swal.fire(
                            'Eliminado',
                            'El rol ha sido eliminado con éxito',
                            'success'
                        );
                        cargarRol();
                    } else {
                        Swal.fire(
                            'Error',
                            'No se puede eliminar el rol asociado a un usuario',
                            'error'
                        );
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el rol',
                        'error'
                    );
                });
        }
    });
};

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
