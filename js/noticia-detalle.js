document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const noticiaId = urlParams.get('id');

    if (noticiaId) {
        cargarNoticia(noticiaId);
    } else {
        mostrarError('No se encontró la noticia');
    }

    //configurarBotonesCompartir(); // Moved this call to mostrarNoticia function
});

async function cargarNoticia(id) {
    try {
        const response = await fetch(`/api/noticias/${id}`);
        if (!response.ok) {
            throw new Error('No se pudo cargar la noticia');
        }
        const noticia = await response.json();
        mostrarNoticia(noticia);
    } catch (error) {
        mostrarError('Error al cargar la noticia');
        console.error(error);
    }
}

function mostrarNoticia(noticia) {
    document.title = `${noticia.titulo} - Abogados en Salud`;
    document.getElementById('noticia-titulo').textContent = noticia.titulo;
    document.getElementById('noticia-fecha').innerHTML += ` ${formatearFecha(noticia.fecha)}`;
    document.getElementById('noticia-autor').innerHTML += ` ${noticia.autor}`;
    document.getElementById('noticia-imagen').src = noticia.imagenUrl;
    document.getElementById('noticia-imagen').alt = noticia.titulo;
    document.getElementById('noticia-contenido').innerHTML = noticia.contenido;
    configurarBotonesCompartir(); // Call configurarBotonesCompartir after showing the news
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function mostrarError(mensaje) {
    const contenedor = document.querySelector('.noticia-container');
    contenedor.innerHTML = `<p class="error">${mensaje}</p>`;
}

function configurarBotonesCompartir() {
    const url = encodeURIComponent(window.location.href);
    const titulo = encodeURIComponent(document.title);

    const facebookBtn = document.querySelector('.compartir-boton.facebook');
    facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

    const twitterBtn = document.querySelector('.compartir-boton.twitter');
    twitterBtn.href = `https://twitter.com/intent/tweet?url=${url}&text=${titulo}`;

    const linkedinBtn = document.querySelector('.compartir-boton.linkedin');
    linkedinBtn.href = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${titulo}`;

    const whatsappBtn = document.querySelector('.compartir-boton.whatsapp');
    whatsappBtn.href = `https://api.whatsapp.com/send?text=${titulo} ${url}`;

    const botonesCompartir = document.querySelectorAll('.compartir-boton');
    botonesCompartir.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(this.href, '', 'width=600,height=400');
        });
    });
}

