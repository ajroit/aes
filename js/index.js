const SUPABASE_URL = 'https://kiryiazblpcxflckkcmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcnlpYXpibHBjeGZsY2trY216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjUzNzQsImV4cCI6MjA0OTUwMTM3NH0.kAuGhhAi2pHfuYBdPSug4HqfQftSSD0QYMqTbU0s0Gg';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
    // ... (código existente para animaciones)

      async function loadNews() {
             const { data, error } = await supabase
                     .from('news')
                     .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5);
             if (error) {
                   console.error("Error fetching data", error);
                   return [];
                 }

               const newsData = data.map(post => ({
                        id: post.id,
                        title: post.title,
                        content: post.content,
                         date: post.date,
                        imageUrl: post.imageUrl
                    }));
             document.body.setAttribute('data-blog-posts', JSON.stringify(newsData));
           initializeCarousel(newsData);

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
                
                 const readMoreLink = document.createElement('a');
                 readMoreLink.href = `noticia-${post.id}.html?id=${post.id}`;
                 readMoreLink.classList.add('read-more', 'btn', 'btn-primary');
                 readMoreLink.textContent = 'Leer más';

                postElement.innerHTML = `
                    <img src="${post.imageUrl}" alt="${post.title}" class="blog-image">
                    <h3 class="blog-title">${post.title}</h3>
                    <div class="blog-meta">
                        <span class="blog-date">Fecha: ${post.date}</span>
                    </div>
                    <p class="blog-content">${post.content.substring(0, 200) + '...'}</p>
                    
                `;
                  postElement.appendChild(readMoreLink)
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