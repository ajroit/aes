document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const noticiaId = urlParams.get('id');

    if (noticiaId) {
        cargarNoticia(noticiaId);
    } else {
        mostrarError('No se encontró la noticia');
    }
});

function cargarNoticia(id) {
    // Simulamos la carga de la noticia desde el almacenamiento local
    const noticia = JSON.parse(localStorage.getItem('noticia')) || {
        id: 1,
        titulo: "Noticia de prueba",
        fecha: "2025-06-06",
        autor: "Autor de prueba",
        imagenUrl: "https://www.csjn.gov.ar/imagen?id=7955",
        contenido: `
            <p>En un reciente fallo, la justicia argentina le ordenó a una obra social que brindara un tratamiento especializado a una paciente con cáncer de colon, luego de que dicha obra social se negara a cubrirlo. Este caso pone de manifiesto el creciente rol del poder judicial en la defensa de los derechos de los pacientes ante las decisiones de las entidades de salud. El tribunal consideró que la negativa de la obra social a autorizar el tratamiento ponía en riesgo la vida de la paciente, por lo que dictó la medida para garantizar el acceso a la atención médica necesaria.</p>

            <h2>La Defensa del Derecho a la Salud</h2>
            
            <p>Este fallo refuerza el derecho constitucional a la salud, establecido en la Constitución Nacional de Argentina, que asegura que todos los ciudadanos deben poder acceder a los tratamientos médicos necesarios, especialmente en casos de enfermedades graves como el cáncer. En este caso, la paciente había sido diagnosticada con una enfermedad de alto riesgo y los médicos habían prescripto un tratamiento especializado que la obra social se negó a cubrir. La decisión judicial no solo benefició a la paciente en particular, sino que también destacó la importancia de la protección judicial ante la negativa de las obras sociales a cubrir tratamientos vitales.</p>

            <h2>Un Precedente Importante para el Sistema de Salud</h2>
            
            <p>El fallo judicial marca un precedente relevante para el sistema de salud y las obras sociales en Argentina. A medida que aumentan los casos en los que las aseguradoras de salud rechazan tratamientos de alto costo o especializados, la intervención del poder judicial se ha vuelto crucial para garantizar que los pacientes reciban la atención adecuada. Este tipo de decisiones tiene un impacto directo en el funcionamiento de las obras sociales, que deben cumplir con los estándares establecidos por la justicia, priorizando la salud de los pacientes sobre los intereses económicos. Sin duda, este tipo de fallos contribuye a generar una mayor conciencia sobre la necesidad de una cobertura de salud accesible y de calidad para todos.</p>
        `
    };

    if (noticia) {
        mostrarNoticia(noticia);
    } else {
        mostrarError('No se pudo cargar la noticia');
    }
}

function mostrarNoticia(noticia) {
    document.title = `${noticia.titulo} - Abogados en Salud`;
    
    const tituloElement = document.getElementById('noticia-titulo');
    const fechaElement = document.getElementById('noticia-fecha');
    const autorElement = document.getElementById('noticia-autor');
    const imagenElement = document.getElementById('noticia-imagen');
    const contenidoElement = document.getElementById('noticia-contenido');

    if (tituloElement) tituloElement.textContent = noticia.titulo;
    if (fechaElement) fechaElement.innerHTML = `<i class="far fa-calendar-alt"></i> ${formatearFecha(noticia.fecha)}`;
    if (autorElement) autorElement.innerHTML = `<i class="far fa-user"></i> ${noticia.autor}`;
    if (imagenElement) {
        imagenElement.src = noticia.imagenUrl;
        imagenElement.alt = noticia.titulo;
    }
    if (contenidoElement) contenidoElement.innerHTML = noticia.contenido;

    configurarBotonesCompartir();
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
    if (contenedor) {
        contenedor.innerHTML = `<p class="error">${mensaje}</p>`;
    }
}

function configurarBotonesCompartir() {
    const url = encodeURIComponent(window.location.href);
    const titulo = encodeURIComponent(document.title);

    const botonesCompartir = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${titulo}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${titulo}`,
        whatsapp: `https://api.whatsapp.com/send?text=${titulo} ${url}`
    };

    for (const [red, enlace] of Object.entries(botonesCompartir)) {
        const boton = document.querySelector(`.compartir-boton.${red}`);
        if (boton) {
            boton.href = enlace;
            boton.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(this.href, '', 'width=600,height=400');
            });
        }
    }
}

