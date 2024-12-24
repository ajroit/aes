document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chat-button');
    const chatContainer = document.getElementById('chat-container');
    const closeChat = document.getElementById('close-chat');
    const chatContent = document.getElementById('chat-content');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('nav');
    const workerUrl = 'https://chatbotpage.ajroit-wa.workers.dev/'; // URL de tu worker
 
     // Obtener o generar sessionID
    let sessionId = localStorage.getItem('sessionId') || null;
 
   // Recuperar el estado del chat de localStorage
     const chatVisible = localStorage.getItem('chatVisible') === 'true';
      if (chatVisible) {
         chatContainer.style.display = 'flex';
         chatButton.style.display = 'none';
      } else {
        chatContainer.style.display = 'none';
        chatButton.style.display = 'flex';
      }
 
    // Funcionalidad del chat
    chatButton.addEventListener('click', () => {
        chatContainer.style.display = 'flex';
        chatButton.style.display = 'none';
         localStorage.setItem('chatVisible', 'true');
    });
 
     closeChat.addEventListener('click', () => {
          chatContainer.style.display = 'none';
          chatButton.style.display = 'flex';
         localStorage.setItem('chatVisible', 'false');
     });
 
     sendChat.addEventListener('click', sendMessage);
     chatInput.addEventListener('keydown', (event) => {
         if (event.key === 'Enter') {
            sendMessage();
            event.preventDefault();
        }
    });
     async function sendMessage() {
       const message = chatInput.value.trim();
         if (!message) return;
         appendMessage('Tú', message);
         chatInput.value = '';
        try {
             const headers = {
                 "Content-Type": "application/json"
             };
             if (sessionId) {
                 headers["x-session-id"] = sessionId;
             }
             const response = await fetch(workerUrl, {
                 method: "POST",
                 headers: headers,
                body: JSON.stringify({ message: message })
             });
             if (!response.ok) {
                 throw new Error(`Error del servidor: ${response.status}`);
              }
             // Guardar sessionId
             sessionId = response.headers.get('x-session-id')
             localStorage.setItem('sessionId', sessionId);
              const data = await response.json();
             // Mostrar respuesta del bot y la información adicional.
              let botMessage = data.botResponse || "Lo siento, no pude generar una respuesta.";
             if(data.name){
                  botMessage+=`<br/><strong>Nombre:</strong> ${data.name}`
            }
             if(data.lastName){
                botMessage+=`<br/><strong>Apellido:</strong> ${data.lastName}`
             }
             if(data.email){
                  botMessage+=`<br/><strong>Email:</strong> ${data.email}`
             }
             appendMessage('Bot', botMessage);
         } catch (error) {
             console.error("Error:", error);
              appendMessage('Bot',"Lo siento, ocurrió un error al procesar tu mensaje.");
         }
     }
      function appendMessage(sender, message) {
         const messageDiv = document.createElement('div');
          messageDiv.className = `chat-message ${sender.toLowerCase()}`;
         messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
         chatContent.appendChild(messageDiv);
         chatContent.scrollTop = chatContent.scrollHeight;
     }
 
    // Funcionalidad del menú móvil
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
 
     // Cerrar menú móvil al hacer clic en un enlace
     nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
             nav.classList.remove('active');
             mobileMenuBtn.classList.remove('active');
        });
     });
 
   // Animación de aparición al hacer scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
             const elementTop = element.getBoundingClientRect().top;
             const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 50) {
                element.classList.add('animated');
            }
         });
     };
     window.addEventListener('scroll', animateOnScroll);
     animateOnScroll(); // Llamar una vez al cargar la página
 });