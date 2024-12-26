document.addEventListener('DOMContentLoaded', function() {
    // ... (código existente para animaciones)

    // Función para cargar las noticias
    function loadNews() {
        fetch('noticias.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const blogPosts = Array.from(doc.querySelectorAll('.blog-post')).slice(0, 5);
                
                const newsData = blogPosts.map(post => ({
                    title: post.querySelector('.blog-title').textContent,
                    content: post.querySelector('.blog-content').textContent,
                    author: post.querySelector('.blog-author').textContent.replace('Por: ', ''),
                    date: post.querySelector('.blog-date').textContent.replace('Fecha: ', ''),
                    imageUrl: post.querySelector('.blog-image').src
                }));

                initializeCarousel(newsData);
            })
            .catch(error => console.error('Error al cargar las noticias:', error));
    }

    // Función para inicializar el carrusel
    function initializeCarousel(newsData) {
        const slider = document.querySelector('.testimonial-slider');
        const prevButton = document.querySelector('.carousel-control.prev');
        const nextButton = document.querySelector('.carousel-control.next');
        let slideIndex = 0;

        if (slider && prevButton && nextButton) {
            // Limpiar el contenido existente del slider
            slider.innerHTML = '';

            // Agregar las noticias al carrusel
            newsData.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('testimonial-item');
                
                postElement.innerHTML = `
                    <img src="${post.imageUrl}" alt="${post.title}" class="blog-image">
                    <h3 class="blog-title">${post.title}</h3>
                    <div class="blog-meta">
                        <span class="blog-author">Por: ${post.author}</span>
                        <span class="blog-date">Fecha: ${post.date}</span>
                    </div>
                    <p class="blog-content">${post.content}</p>
                `;
                
                slider.appendChild(postElement);
            });

            const slides = slider.children;
            const slideCount = slides.length;

            function showSlide(index) {
                if (index >= slideCount) slideIndex = 0;
                if (index < 0) slideIndex = slideCount - 1;
                slider.style.transform = `translateX(-${slideIndex * 100}%)`;
            }

            prevButton.addEventListener('click', () => {
                slideIndex--;
                showSlide(slideIndex);
            });

            nextButton.addEventListener('click', () => {
                slideIndex++;
                showSlide(slideIndex);
            });

            // Cambiar slide automáticamente cada 5 segundos
            setInterval(() => {
                slideIndex++;
                showSlide(slideIndex);
            }, 5000);

            showSlide(0); // Mostrar el primer slide
        }
    }

    // Cargar las noticias al iniciar la página
    loadNews();
});

