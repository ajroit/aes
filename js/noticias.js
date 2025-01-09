// js/noticias.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const SUPABASE_URL = 'https://kiryiazblpcxflckkcmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcnlpYXpibHBjeGZsY2trY216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjUzNzQsImV4cCI6MjA0OTUwMTM3NH0.kAuGhhAi2pHfuYBdPSug4HqfQftSSD0QYMqTbU0s0Gg';

document.addEventListener('DOMContentLoaded', () => {
     const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
     const blogContainer = document.getElementById('blog-container');

    async function loadNews() {
         const { data, error } = await supabase
                 .from('news')
                .select('*')
                .order('created_at', { ascending: false });

           if (error) {
                 console.error("Error fetching data", error);
                 return;
           }

           const newsData = data.map(post => ({
                    id: post.id,
                    title: post.title,
                    content: post.content,
                     date: post.date,
                    imageUrl: post.imageUrl
                }));

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
                  readMoreLink.href = `noticia-detalle.html?id=${post.id}`;
                 readMoreLink.classList.add('read-more', 'btn', 'btn-primary');
                 readMoreLink.textContent = 'Leer más';

                 contentWrapper.appendChild(titleElement);
                 contentWrapper.appendChild(metaElement);
                 contentWrapper.appendChild(contentElement);
                  contentWrapper.appendChild(readMoreLink);

                 postElement.appendChild(imageElement);
                 postElement.appendChild(contentWrapper);


              blogContainer.appendChild(postElement);
            });
        }
        loadNews();
});