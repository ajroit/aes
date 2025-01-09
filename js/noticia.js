// noticia.js
document.addEventListener('DOMContentLoaded', function() {
    // Función para calcular el tiempo de lectura
    function calcularTiempoLectura() {
        const contenido = document.getElementById('noticia-contenido').innerText;
        const palabrasPorMinuto = 200;
        const numeroPalabras = contenido.split(/\s+/).length;
        const minutos = Math.ceil(numeroPalabras / palabrasPorMinuto);
        return minutos;
    }

    // Agregar el tiempo de lectura a la meta información
    function agregarTiempoLectura() {
        const tiempoLectura = calcularTiempoLectura();
        const metaInfo = document.querySelector('.noticia-meta');
        const tiempoLecturaSpan = document.createElement('span');
        tiempoLecturaSpan.innerHTML = `<i class="far fa-clock"></i> Tiempo de lectura: ${tiempoLectura} min`;
        metaInfo.appendChild(tiempoLecturaSpan);
    }

    // Configurar los botones de compartir
    function configurarBotonesCompartir() {
        const url = encodeURIComponent(window.location.href);
        const titulo = encodeURIComponent(document.title);

        const facebookBtn = document.querySelector('.compartir-boton.facebook');
        facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

        const twitterBtn = document.querySelector('.compartir-boton.twitter');
        twitterBtn.href = `https://twitter.com/intent/tweet?url=${url}&text=${titulo}`;

        const linkedinBtn = document.querySelector('.compartir-boton.linkedin');
        linkedinBtn.href = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${titulo}`;

        // Asegurarse de que los enlaces se abran en una nueva pestaña
        document.querySelectorAll('.compartir-boton').forEach(btn => {
            btn.setAttribute('target', '_blank');
            btn.setAttribute('rel', 'noopener noreferrer');
        });
    }

    // Ejecutar funciones
    agregarTiempoLectura();
    configurarBotonesCompartir();
});