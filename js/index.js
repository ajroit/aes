import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://kiryiazblpcxflckkcmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcnlpYXpibHBjeGZsY2trY216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjUzNzQsImV4cCI6MjA0OTUwMTM3NH0.kAuGhhAi2pHfuYBdPSug4HqfQftSSD0QYMqTbU0s0Gg';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
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

    function initializeCarousel(newsData) {
        const slider = document.querySelector('.testimonial-slider');
        const prevButton = document.querySelector('.carousel-control.prev');
        const nextButton = document.querySelector('.carousel-control.next');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        let slideIndex = 0;
        let autoplayInterval;
        let isPaused = false;

        if (slider && prevButton && nextButton && indicatorsContainer) {
            slider.innerHTML = '';
            indicatorsContainer.innerHTML = '';

            newsData.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.classList.add('testimonial-item');
                
                const readMoreLink = document.createElement('a');
                readMoreLink.href = `noticia-detalle.html?id=${post.id}`;
                readMoreLink.classList.add('read-more', 'btn', 'btn-primary');
                readMoreLink.textContent = 'Leer más';

                postElement.innerHTML = `
                    <img src="${post.imageUrl}" alt="${post.title}" class="blog-image" loading="lazy">
                    <h3 class="blog-title">${post.title}</h3>
                    <div class="blog-meta">
                        <span class="blog-date">Fecha: ${post.date}</span>
                    </div>
                    <p class="blog-content">${post.content.substring(0, 200) + '...'}</p>
                `;
                postElement.appendChild(readMoreLink);
                slider.appendChild(postElement);

                const indicator = document.createElement('div');
                indicator.classList.add('carousel-indicator');
                indicator.addEventListener('click', () => goToSlide(index));
                indicatorsContainer.appendChild(indicator);
            });

            const slides = slider.children;
            const slideCount = slides.length;

            function showSlide(index) {
                if (index >= slideCount) slideIndex = 0;
                if (index < 0) slideIndex = slideCount - 1;

                slider.style.transform = `translateX(-${slideIndex * 100}%)`;
                updateIndicators();
            }

            function updateIndicators() {
                const indicators = indicatorsContainer.children;
                for (let i = 0; i < indicators.length; i++) {
                    indicators[i].classList.toggle('active', i === slideIndex);
                }
            }

            function goToSlide(index) {
                slideIndex = index;
                showSlide(slideIndex);
            }

            function startAutoplay() {
                autoplayInterval = setInterval(() => {
                    if (!isPaused) {
                        slideIndex++;
                        showSlide(slideIndex);
                    }
                }, 5000);
            }

            function pauseAutoplay() {
                isPaused = true;
            }

            function resumeAutoplay() {
                isPaused = false;
            }

            prevButton.addEventListener('click', () => {
                pauseAutoplay();
                slideIndex--;
                showSlide(slideIndex);
                resumeAutoplay();
            });

            nextButton.addEventListener('click', () => {
                pauseAutoplay();
                slideIndex++;
                showSlide(slideIndex);
                resumeAutoplay();
            });

            slider.addEventListener('mouseenter', pauseAutoplay);
            slider.addEventListener('mouseleave', resumeAutoplay);

            // Implementar gestos táctiles
            let touchStartX = 0;
            let touchEndX = 0;

            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });

            function handleSwipe() {
                if (touchStartX - touchEndX > 50) {
                    // Swipe izquierda
                    slideIndex++;
                    showSlide(slideIndex);
                }

                if (touchEndX - touchStartX > 50) {
                    // Swipe derecha
                    slideIndex--;
                    showSlide(slideIndex);
                }
            }

            startAutoplay();
            showSlide(0);
        }
    }

    loadNews();
});
