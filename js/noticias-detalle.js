// js/noticia-detalle.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const SUPABASE_URL = 'https://kiryiazblpcxflckkcmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcnlpYXpibHBjeGZsY2trY216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjUzNzQsImV4cCI6MjA0OTUwMTM3NH0.kAuGhhAi2pHfuYBdPSug4HqfQftSSD0QYMqTbU0s0Gg';

document.addEventListener('DOMContentLoaded', async () => {
     const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
     const urlParams = new URLSearchParams(window.location.search);
     const postId = urlParams.get('id');

     if (!postId) {
         document.getElementById('news-title').textContent = "Noticia no encontrada"
         return; // No id, no carga
     }

      const { data, error } = await supabase
          .from('news')
          .select('*')
         .eq('id', postId)
          .single();

     if(error){
          console.error('Error al cargar la noticia', error)
           document.getElementById('news-title').textContent = "Noticia no encontrada"
          return;
     }
      document.getElementById('news-title').textContent = data.title;
      document.getElementById('news-date').textContent = `Publicado el: ${data.date}`
     document.getElementById('news-image').src = data.imageUrl;
     document.getElementById('news-content').textContent = data.content
});