document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const chatButton = document.getElementById('open-chat');
   
    if(chatButton){
        chatButton.addEventListener('click', function() {
            window.open('chat.html', '_blank');
        });
    }
   
    if (form) {
      form.addEventListener('submit', async (e) => {
          e.preventDefault();
   
          const formData = new FormData(form);
            try {
                const response = await fetch('/form-handler', {  // Asegúrate que coincida la ruta de tu worker
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(formData).toString(),
                });
   
                const data = await response.json();
                if (response.ok) {
                    formMessage.textContent = data.message;
                    formMessage.className = 'form-message success';
                    formMessage.style.display = 'block';
                    form.reset();
                } else {
                    formMessage.textContent = data.message || 'Error al enviar el mensaje';
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Error al enviar el mensaje:', error);
                formMessage.textContent = 'Error al enviar el mensaje. Inténtalo de nuevo.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            }
        });
    }
   });