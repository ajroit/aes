// admin/admin.js

import { createClient } from '/lib/supabase-esm.js';

const SUPABASE_URL = 'https://kiryiazblpcxflckkcmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcnlpYXpibHBjeGZsY2trY216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjUzNzQsImV4cCI6MjA0OTUwMTM3NH0.kAuGhhAi2pHfuYBdPSug4HqfQftSSD0QYMqTbU0s0Gg';

// Inicializa supabase aquí, antes de usarlo
let supabase; // Quitamos el "supabase = "
document.addEventListener('DOMContentLoaded', () => {
   supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const newsForm = document.getElementById('news-form');
    const newsList = document.getElementById('news-list');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');


    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active'); // Toggle a class to show/hide menu
    });

    // Función para cargar noticias existentes
    async function loadExistingNews() {
           const { data, error } = await supabase
                   .from('news')
                   .select('*')
                   .order('created_at', { ascending: false });
           if (error) {
                   console.error("Error fetching data", error);
                   return [];
                 }
         displayNews(data);
    }

    // Función para mostrar las noticias en la UI
     function displayNews(newsData) {
         newsList.innerHTML = '';

         newsData.forEach(post => {
             const postElement = document.createElement('article');
                postElement.classList.add('blog-post');

                const imageElement = document.createElement('img');
                imageElement.src = post.imageUrl;
                imageElement.alt = post.title;
                imageElement.classList.add('blog-image');

                const contentWrapper = document.createElement('div');
                contentWrapper.classList.add('blog-content-wrapper');

                const titleElement = document.createElement('h2');
                titleElement.textContent = post.title;
                titleElement.classList.add('blog-title');

                const metaElement = document.createElement('div');
                metaElement.classList.add('blog-meta');
                metaElement.innerHTML = `
                   
                    <span class="blog-date">Fecha: ${post.date}</span>
                `;
    
                const contentElement = document.createElement('p');
                contentElement.classList.add('blog-content');
                contentElement.textContent = post.content.substring(0, 200) + '...';

                 const readMoreLink = document.createElement('a');
                  readMoreLink.href = `../noticia-${post.id}.html?id=${post.id}`; // Genera el enlace dinámicamente
                readMoreLink.classList.add('read-more', 'btn', 'btn-primary');
                readMoreLink.textContent = 'Leer más';
    
                contentWrapper.appendChild(titleElement);
                contentWrapper.appendChild(metaElement);
                contentWrapper.appendChild(contentElement);
                contentWrapper.appendChild(readMoreLink);

                postElement.appendChild(imageElement);
                postElement.appendChild(contentWrapper);

            newsList.appendChild(postElement);
         });
     }

    // Función para guardar una nueva noticia
     newsForm.addEventListener('submit', async (e) => {
       e.preventDefault();

         const title = document.getElementById('title').value;
         const content = document.getElementById('content').value;
        const date = document.getElementById('date').value;
         const imageUrl = document.getElementById('imageUrl').value;


           const { data, error } = await supabase
               .from('news')
              .insert([{ title, content, date, imageUrl }])
               .select();

            if (error) {
            console.error('Error al guardar la noticia', error);
             return;
             }
        newsForm.reset();
        loadExistingNews(); // Recargar las noticias después de agregar una nueva
        });


     loadExistingNews();
});