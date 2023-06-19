const cargarUsuario = () => {
    fetch('https://localhost:7214/api/Usuario')
        .then(response => response.json())
        .then(usuario => {
            if (usuario.success) {
                let tabla = '';
                usuario.data.forEach(c => {
                    tabla += `
            <tr>
              <td>${c.nombre}</td>
              <td>${c.rut}</td>
              <td>${c.correo}</td>
              <td>${c.telefono}</td>
              <td>${c.roles}</td>
              <td nowrap>
                <button class="btn btn-warning text-white" onclick="editar(${c.id})">
                  Editar
                </button>
                <button class="btn btn-danger" onclick="eliminar(${c.id})">
                  Eliminar
                </button>
              </td>
            </tr>
          `;
                });
                document.getElementById('listarDatos').innerHTML = tabla;

                // Obtener los roles y agregarlos al select
                fetch('https://localhost:7214/api/Role')
                    .then(response => response.json())
                    .then(roles => {
                        if (roles.success) {
                            let options = '<option value="">Selecciona un rol</option>';
                            roles.data.forEach(rol => {
                                options += `<option value="${rol.id}">${rol.nombre}</option>`;
                            });
                            document.getElementById('roles').innerHTML = options;
                        } else {
                            console.error('Error al obtener los roles:', roles.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud de obtener los roles:', error);
                    });
            } else {
                document.getElementById('tablita').hidden = false;
            }
        });
};

const crear = () => {
    const nombre = document.getElementById('nombre').value.trim();
    const rut = document.getElementById('rut').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const roles = document.getElementById('roles').value.trim();

    if (!nombre || !rut || !correo || !telefono || !roles) {
        Swal.fire({
            title: 'Campos requeridos',
            text: 'Por favor completa todos los campos',
            icon: 'error',
        });
        return;
    }

    const usuario = {
        nombre: nombre,
        rut: rut,
        correo: correo,
        telefono: telefono,
        roles: roles,
    };

    fetch('https://localhost:7214/api/Usuario', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
        .then(response => {
            if (response.ok) {
                cargarUsuario();
                var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
                myModal.hide();
                limpiar();
                Swal.fire({
                    title: 'Guardado',
                    text: 'El usuario ha sido guardado con éxito',
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
        })
        .catch(error => {
            console.error('Error en la solicitud de guardar el usuario:', error);
        });
};

const modificar = () => {
    const id = document.getElementById('id').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const rut = document.getElementById('rut').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const roles = document.getElementById('roles').value.trim();

    if (!id || !nombre || !rut || !correo || !telefono || !roles) {
        Swal.fire({
            title: 'Campos requeridos',
            text: 'Por favor completa todos los campos',
            icon: 'error',
        });
        return;
    }
    const usuario = {
        id: id,
        nombre: nombre,
        rut: rut,
        correo: correo,
        telefono: telefono,
        roles: roles,
    };

    fetch('https://localhost:7214/api/Usuario/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
        .then(response => {
            if (response.ok) {
                cargarUsuario();
                const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
                myModal.hide();
                limpiar();
                Swal.fire({
                    title: 'Modificado',
                    text: 'El usuario ha sido modificado con éxito',
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
        })
        .catch(error => {
            console.error('Error en la solicitud de editar el usuario:', error);
        });
};

const guardar = () => {
    if (document.getElementById('id').value == '') {
        crear();
    } else {
        modificar();
    }
};

const limpiar = () => {
    document.querySelectorAll('.form-control').forEach(e => {
        e.value = '';
        e.parentElement.classList.remove('is-valid');
    });
    const formcat = document.getElementById('formusuario');
    formcat.reset();
};

const eliminar = id => {
    Swal.fire({
        title: '¿Estás seguro de eliminar el usuario?',
        text: 'No podrás recuperarlo después de eliminarlo',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
    }).then(result => {
        if (result.isConfirmed) {
            fetch(`https://localhost:7214/api/Usuario/${id}`, {
                method: 'delete',
            })
                .then(response => {
                    if (response.ok) {
                        Swal.fire('Eliminado', 'El usuario ha sido eliminado con éxito', 'success');
                        cargarUsuario();
                    } else {
                        Swal.fire('Error', 'No se puede eliminar el usuario asociado a un juego', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Ocurrió un error al eliminar el usuario', 'error');
                });
        }
    });
};

const editar = id => {
    fetch(`https://localhost:7214/api/Usuario/${id}`)
        .then(response => response.json())
        .then(usuario => {
            if (usuario.success) {
                document.getElementById('id').value = usuario.data.id;
                document.getElementById('nombre').value = usuario.data.nombre;
                document.getElementById('rut').value = usuario.data.rut;
                document.getElementById('correo').value = usuario.data.correo;
                document.getElementById('telefono').value = usuario.data.telefono;
                document.getElementById('roles').value = usuario.data.roles;

                const modalSave = new bootstrap.Modal(document.getElementById('modalSave'));
                modalSave.show();
            }
        });
};

cargarUsuario();
