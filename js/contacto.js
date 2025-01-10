import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const chatButton = document.getElementById('open-chat');

    // Initialize Supabase client
    
    const supabaseUrl = 'https://kiryiazblpcxflckkcmz.supabase.co'; // Reemplaza con la URL de tu proyecto
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcnlpYXpibHBjeGZsY2trY216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjUzNzQsImV4cCI6MjA0OTUwMTM3NH0.kAuGhhAi2pHfuYBdPSug4HqfQftSSD0QYMqTbU0s0Gg'; // Reemplaza con tu anon key
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (chatButton) {
        chatButton.addEventListener('click', function() {
            window.open('chat.html', '_blank');
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            // Insertar datos en Supabase
            try {
                const { data, error } = await supabase
                    .from('contact_form_submissions')
                    .insert([{
                        name: name,
                        email: email,
                        phone: phone,
                        message: message,
                    }]);

                if (error) {
                    console.error('Error al guardar en Supabase:', error);
                    formMessage.textContent = 'Error al guardar el mensaje. Inténtalo de nuevo.';
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'block';

                } else {
                    console.log('Datos guardados exitosamente:', data);
                    formMessage.textContent = 'Mensaje enviado con éxito!';
                    formMessage.className = 'form-message success';
                    formMessage.style.display = 'block';
                    form.reset();
                }
            } catch (error) {
                console.error('Error inesperado:', error);
                formMessage.textContent = 'Error al enviar el mensaje. Inténtalo de nuevo.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';

            }
        });
    }
});