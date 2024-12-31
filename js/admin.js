// js/admin.js

document.addEventListener('DOMContentLoaded', async () => { // Marcamos el callback como async
    // Función para cargar la librería de Supabase (simulación)
     const formMessage = document.getElementById('form-message');
    function loadSupabase() {
        return new Promise((resolve, reject) => {
             const script = document.createElement('script');
             script.src = 'https://cdn.supabase.com/supabase-js-v2.3.0/dist/supabase.min.js';
             script.onload = () => resolve();
             script.onerror = () => reject(new Error('Error cargando la libreria de Supabase'));
            document.head.appendChild(script);
        });
     }

      try {
          await loadSupabase(); // Esperamos que se cargue la librería
          const SUPABASE_URL = 'https://kiryiazblpcxflckkcmz.supabase.co';
          const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcnlpYXpibHBjeGZsY2trY216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjUzNzQsImV4cCI6MjA0OTUwMTM3NH0.kAuGhhAi2pHfuYBdPSug4HqfQftSSD0QYMqTbU0s0Gg';
         const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


         const form = document.getElementById('news-form');
        
        const newsList = document.getElementById('news-list');

        // Función para cargar noticias de Supabase
        async function loadNews() {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error("Error fetching data", error);
                return [];
            }
            return data;
        }

        // Función para guardar noticias en Supabase
        async function saveNewsToSupabase(newPost) {
             const { id, title, date, imageUrl, content, tags, created_at } = newPost;
             const newsToSave = { id, title, date, imageUrl, content, tags, created_at };

            if (newPost.id) {
                const { data, error } = await supabase
                    .from('news')
                    .update(newsToSave)
                    .eq('id', newPost.id)
                    .select();
                if (error) {
                    console.error("Error updating news", error);
                    return;
                }
                return data[0];
            } else {
                const { data, error } = await supabase
                    .from('news')
                    .insert([newsToSave])
                    .select();
                if (error) {
                    console.error("Error inserting news", error);
                    return;
                }
                return data[0];
            }
        }

        // Función para eliminar noticias de Supabase
        async function deleteNewsFromSupabase(id) {
            const { error } = await supabase
                .from('news')
                .delete()
                .eq('id', id);

            if (error) {
                console.error("Error deleting news", error);
                return false;
            }
            return true;
        }

        // Función para actualizar el listado de noticias en el DOM
       function updateNewsList(news) {
            newsList.innerHTML = '';
             news.forEach(post => {
                 const postElement = document.createElement('div');
                 postElement.classList.add('result-card');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content.substring(0, 100) + '...'}</p>
                    <div class="metadata">
                       
                        <p><strong>Fecha:</strong> ${post.date}</p>
                    </div>
                      <div class="tags">
                        ${post.tags && post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') || ''}
                      </div>
                    <button class="btn btn-primary edit-btn" data-id="${post.id}">Editar</button>
                    <button class="btn btn-secondary delete-btn" data-id="${post.id}">Eliminar</button>
                `;
                newsList.appendChild(postElement);
            });

            // Event listeners para editar
            newsList.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', function(event) {
                    const id = event.target.getAttribute('data-id');
                    editNews(id);
                });
            });

            // Event listeners para borrar
            newsList.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async function(event) {
                    const id = event.target.getAttribute('data-id');
                    if (await deleteNewsFromSupabase(id)) {
                        formMessage.textContent = 'Noticia eliminada con éxito!';
                        formMessage.style.display = 'block';
                        formMessage.classList.add('success');
                        setTimeout(() => {
                            formMessage.style.display = 'none';
                            formMessage.classList.remove('success')
                        }, 3000);
                        allNews = allNews.filter(post => post.id !== id);
                        updateNewsList(allNews);
                    } else {
                        formMessage.textContent = 'Error al eliminar noticia.';
                        formMessage.style.display = 'block';
                        formMessage.classList.add('error');
                        setTimeout(() => {
                            formMessage.style.display = 'none';
                            formMessage.classList.remove('error')
                        }, 3000);
                    }
                });
            });
        }

        // Función para cargar los datos de una noticia en el formulario
      async function editNews(id) {
            const newsToEdit = allNews.find(post => post.id === id);
            if (newsToEdit) {
                document.getElementById('title').value = newsToEdit.title;
                document.getElementById('date').value = newsToEdit.date;
                document.getElementById('imageUrl').value = newsToEdit.imageUrl;
                 document.getElementById('content').value = newsToEdit.content;

                  //Tags
                const tagsInput = document.getElementById('tags');
                tagsInput.value = newsToEdit.tags ? newsToEdit.tags.join(',') : '';


                const idInput = document.createElement('input');
                idInput.setAttribute('type', 'hidden');
                idInput.setAttribute('name', 'id');
                idInput.value = newsToEdit.id;
                form.appendChild(idInput);
            }
        }

        // Inicialización
        let allNews = [];
        loadNews().then(news => {
            allNews = news;
            updateNewsList(allNews);
        });

        // Event listener para el formulario
         form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const id = document.querySelector('input[name="id"]')?.value || crypto.randomUUID();
            const title = document.getElementById('title').value;
            const date = document.getElementById('date').value;
            const imageUrl = document.getElementById('imageUrl').value;
            const content = document.getElementById('content').value;
             const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

            const newPost = { id, title, date, imageUrl, content, tags, created_at: new Date().toISOString() };
             const savedNews = await saveNewsToSupabase(newPost);


            if (savedNews) {
               if (document.querySelector('input[name="id"]')) {
                    const newsIndex = allNews.findIndex(post => post.id === id);
                    if (newsIndex !== -1) {
                        allNews[newsIndex] = savedNews;
                    }
                    document.querySelector('input[name="id"]').remove();
                 } else {
                    allNews = [savedNews, ...allNews];
                }
               updateNewsList(allNews);
               formMessage.textContent = 'Noticia guardada con éxito!';
                formMessage.style.display = 'block';
                formMessage.classList.add('success');
                form.reset();
                setTimeout(() => {
                    formMessage.style.display = 'none';
                   formMessage.classList.remove('success')
                }, 3000);
            } else {
                formMessage.textContent = 'Error al guardar noticia.';
                formMessage.style.display = 'block';
                formMessage.classList.add('error');
                 setTimeout(() => {
                    formMessage.style.display = 'none';
                     formMessage.classList.remove('error')
                }, 3000);
            }
        });

      } catch (error) {
           console.error('Error al cargar la librería Supabase:', error);
            formMessage.textContent = 'Error al cargar la página. Por favor, intente de nuevo más tarde.';
            formMessage.style.display = 'block';
            formMessage.classList.add('error');

        }


});