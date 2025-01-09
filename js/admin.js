// admin/admin.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const SUPABASE_URL = 'https://kiryiazblpcxflckkcmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcnlpYXpibHBjeGZsY2trY216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjUzNzQsImV4cCI6MjA0OTUwMTM3NH0.kAuGhhAi2pHfuYBdPSug4HqfQftSSD0QYMqTbU0s0Gg';

let supabase;
document.addEventListener('DOMContentLoaded', () => {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const newsForm = document.getElementById('news-form');
    const newsList = document.getElementById('news-list');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');


    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });

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
            readMoreLink.href = `noticias/noticia-${post.id}.html`; // Enlace a la página de detalle
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

    async function generateAndSaveDetailHTML(post) {
      const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${post.title} - Abogados en Salud</title>
          <link rel="stylesheet" href="../css/style.css">
          <link rel="stylesheet" href="../css/noticia.css">
          <link rel="icon" href="../assets/favicon.ico" type="image/x-icon">
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
      </head>
      <body>
      <header class="header">
          <!-- Header content remains unchanged -->
      </header>
          <main>
              <article class="noticia-container">
                  <header class="noticia-header">
                      <h1 id="noticia-titulo">${post.title}</h1>
                      <div class="noticia-meta">
                          <span id="noticia-fecha"><i class="far fa-calendar-alt"></i> Fecha: ${post.date}</span>
                          <span id="noticia-autor"><i class="far fa-user"></i> Por: ${post.author || 'Autor Desconocido'}</span>
                      </div>
                  </header>
                  <img id="noticia-imagen" src="${post.imageUrl}" alt="Imagen de la Noticia" class="noticia-imagen">
                  <div id="noticia-contenido" class="noticia-contenido">
                      ${post.content}
                  </div>
                  <div class="noticia-compartir">
                      <h3>Compartir esta noticia:</h3>
                      <div class="compartir-botones">
                          <a href="#" class="compartir-boton facebook"><i class="fab fa-facebook-f"></i></a>
                          <a href="#" class="compartir-boton twitter"><i class="fab fa-twitter"></i></a>
                          <a href="#" class="compartir-boton linkedin"><i class="fab fa-linkedin-in"></i></a>
                      </div>
                  </div>
              </article>
          </main>
          <footer class="footer">
              <!-- Footer content remains unchanged -->
          </footer>
          <div class="chat-button-container">
              <!-- Chat button content remains unchanged -->
          </div>
          <div id="chat-container" class="chat-container">
              <!-- Chat container content remains unchanged -->
          </div>
          <script src="../js/script.js"></script>
          <script src="../js/noticia.js"></script>
      </body>
      </html>
      `;
    
     

            // Crear un Blob con el HTML
          const blob = new Blob([html], { type: 'text/html' });
         const url = URL.createObjectURL(blob);


            const link = document.createElement('a');
            link.href = url;
            link.download = `noticias/noticia-${post.id}.html`;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);


        //   fetch('/save-html', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //       filename: `noticias/noticia-${post.id}.html`,
        //       htmlContent: html
        //     })
        //   }).then(response => {
        //     if (!response.ok) {
        //       console.error(`Error al guardar el archivo HTML: ${response.statusText}`);
        //     } else {
        //       console.log(`Archivo HTML guardado en: noticias/noticia-${post.id}.html`);
        //     }
        //   }).catch(error => {
        //     console.error('Error en la solicitud:', error);
        //   });
        }


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

        // Generar y guardar el HTML individual
        if (data && data[0]) {
            await generateAndSaveDetailHTML(data[0]);
        }


        newsForm.reset();
        loadExistingNews();
    });


    loadExistingNews();
});