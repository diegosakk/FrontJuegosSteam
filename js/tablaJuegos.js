const cargarJuegos = () => {
    fetch('https://localhost:7214/api/Juego')
        .then(response => response.json())
        .then(juegos => {
            if (juegos.success) {
                let tabla = ''
                juegos.data.forEach(s => {
                    tabla += `
                        <tr>
                            <td>${s.nombre}</td>
                            <td>${s.categoria}</td>
                            <td>${s.desarrollador}</td>
                            <td>${s.editor}</td>
                            <td>${s.precio}</td>
                            <td>${s.usuarioRegistrado}</td>
                            <td>${s.plataforma}</td>
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
                // Obtener los roles y agregarlos al select
                fetch('https://localhost:7214/api/Categoria')
                    .then(response => response.json())
                    .then(categoria => {
                        if (categoria.success) {
                            let options = '<option value="">Selecciona una categoria</option>';
                            categoria.data.forEach(categoria => {
                                options += `<option value="${categoria.id}">${categoria.nombre}</option>`;
                            });
                            document.getElementById('categoria').innerHTML = options;
                        } else {
                            console.error('Error al obtener las categorias:', categoria.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud de obtener las categorias:', error);
                    });
                // Obtener los roles y agregarlos al select
                fetch('https://localhost:7214/api/Desarrollador')
                    .then(response => response.json())
                    .then(desarrollador => {
                        if (desarrollador.success) {
                            let options = '<option value="">Selecciona un desarrollador</option>';
                            desarrollador.data.forEach(desarrollador => {
                                options += `<option value="${desarrollador.id}">${desarrollador.nombre}</option>`;
                            });
                            document.getElementById('desarrollador').innerHTML = options;
                        } else {
                            console.error('Error al obtener los desarrolladores:', desarrollador.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud de obtener los desarrollladores:', error);
                    });
                // Obtener los roles y agregarlos al select
                fetch('https://localhost:7214/api/Editor')
                    .then(response => response.json())
                    .then(editor => {
                        if (editor.success) {
                            let options = '<option value="">Selecciona un editor</option>';
                            editor.data.forEach(editor => {
                                options += `<option value="${editor.id}">${editor.nombre}</option>`;
                            });
                            document.getElementById('editor').innerHTML = options;
                        } else {
                            console.error('Error al obtener los editores:', editor.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud de obtener los editores:', error);
                    });
                // Obtener los roles y agregarlos al select
                fetch('https://localhost:7214/api/Usuario')
                    .then(response => response.json())
                    .then(usuario => {
                        if (usuario.success) {
                            let options = '<option value="">Selecciona un usuario</option>';
                            usuario.data.forEach(usuario => {
                                options += `<option value="${usuario.id}">${usuario.nombre}</option>`;
                            });
                            document.getElementById('usuario').innerHTML = options;
                        } else {
                            console.error('Error al obtener los usuario:', usuario.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud de obtener las usuario:', error);
                    });
            } else {
                document.getElementById('tablita').hidden = false;
            }
        });
};

const crear = () => {

    const nombre = document.getElementById('nombre').value.trim();
    const categoria = document.getElementById('categoria').value.trim();
    const desarrollador = document.getElementById('desarrollador').value.trim();
    const editor = document.getElementById('editor').value.trim();
    const plataforma = document.getElementById('plataforma').value.trim();
    const precio = document.getElementById('precio').value.trim();
    const usuario_registrado = document.getElementById('usuario').value.trim();


    if (nombre == '' || categoria == '' || desarrollador == '' || editor == '' || plataforma == '' || precio == '' || usuario_registrado == '') {
        Swal.fire({
            title: 'Campos requeridos',
            text: 'Por favor completa todos los campos',
            icon: 'error',
        });
        return;
    }



    const juego = {
        nombre: nombre,
        categoria: categoria,
        desarrollador: desarrollador,
        editor: editor,
        plataforma: plataforma,
        precio: precio,
        usuarioregistrado: usuario_registrado,

    };

    fetch('https://localhost:7214/api/Juego', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(juego),
    })
        .then(response => {
            if (response.ok) {
                cargarJuegos();
                var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
                myModal.hide();
                limpiar();
                Swal.fire({
                    title: 'Guardado',
                    text: 'El juego ha sido guardado con éxito',
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
            console.error('Error en la solicitud de guardar el juego:', error);
        });
};

const modificar = () => {
    const nombre = document.getElementById('nombre').value.trim();
    const categoria = document.getElementById('categoria').value.trim();
    const desarrollador = document.getElementById('desarrollador').value.trim();
    const editor = document.getElementById('editor').value.trim();
    const plataforma = document.getElementById('plataforma').value.trim();
    const precio = document.getElementById('precio').value.trim();
    const usuario_registrado = document.getElementById('usuario').value.trim();


    if (nombre == '' || categoria == '' || desarrollador == '' || editor == '' || plataforma == '' || precio == '' || usuario_registrado == '') {
        Swal.fire({
            title: 'Campos requeridos',
            text: 'Por favor completa todos los campos',
            icon: 'error',
        });
        return;
    }

    const juego = {
        nombre: nombre,
        categoria: categoria,
        desarrollador: desarrollador,
        editor: editor,
        plataforma: plataforma,
        precio: precio,
        usuarioregistrado: usuario_registrado,

    };

    fetch('https://localhost:7214/api/Juego/' + document.getElementById('id').value, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(juego),
    })
        .then(response => {
            if (response.ok) {
                cargarJuegos();
                const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalSave'));
                myModal.hide();
                limpiar();
                Swal.fire({
                    title: 'Modificado',
                    text: 'El juego ha sido modificado con éxito',
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
            console.error('Error en la solicitud de editar el juego:', error);
        });
};

const guardar = () => {
    if (document.getElementById('id').value == '')
        crear()
    else
        modificar()
}
const limpiar = () => {
    document.querySelectorAll('.form-control').forEach(e => {
        e.value = '';
        e.parentElement.classList.remove('is-valid');
    });
    const formcat = document.getElementById('formJuegos');
    formcat.reset();
};
//método para eliminar una sucursal
const eliminar = (id) => {
    //levanta sweetalert que indica si se quiere eliminar
    Swal.fire({
        title: '¿Estás seguro de eliminar la el juego?',
        text: 'No podrás recuperarla después de eliminarla',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
    }).then(result => {
        if (result.isConfirmed) {
            fetch(`https://localhost:7214/api/Juego/${id}`, {
                method: 'delete',
            })
                .then(response => {
                    if (response.ok) {
                        Swal.fire('Eliminado', 'El juego ha sido eliminado con éxito', 'success');
                        cargarJuegos();
                    } else {
                        Swal.fire('Error', 'No se puede eliminar el juego ', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Ocurrió un error al eliminar el juego', 'error');
                });
        }
    });
};
const editar = (id) => {
    fetch(`https://localhost:7214/api/Juego/${id}`)
        .then(response => response.json())
        .then(juego => {
            if (juego.success) {
                document.getElementById('id').value = juego.data.id
                document.getElementById('nombre').value = juego.data.nombre
                document.getElementById('categoria').value = juego.data.categoria
                document.getElementById('desarrollador').value = juego.data.desarrollador
                document.getElementById('editor').value = juego.data.editor
                document.getElementById('plataforma').value = juego.data.plataforma
                document.getElementById('precio').value = juego.data.precio
                document.getElementById('usuario').value = juego.data.usuario_registrado



                const modalSave = new bootstrap.Modal(document.getElementById('modalSave'))
                modalSave.show()
            }
        })
}






cargarJuegos();