document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------
    // Sección de Funcionalidad del Chat
    // ------------------------------------------------------------
    const chatButton = document.getElementById('chat-button');
    const chatContainer = document.getElementById('chat-container');
    const closeChatButton = document.getElementById('close-chat');
    const chatContent = document.getElementById('chat-content');
    const chatInput = document.getElementById('chat-input');
    const sendChatButton = document.getElementById('send-chat');

      let sessionId = localStorage.getItem('chatSessionId') || null;
        if(!sessionId){
          sessionId = crypto.randomUUID();
           localStorage.setItem('chatSessionId', sessionId)
        }
      console.log('Session ID en la web: ', sessionId)


    // Función para mostrar el chat
    function openChat() {
        chatContainer.style.display = 'flex';
    }

    // Función para ocultar el chat
    function closeChat() {
        chatContainer.style.display = 'none';
    }

     function updateChat(message, isBot = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = message; // Usa innerHTML para interpretar HTML

        if (isBot) {
            messageElement.classList.add('bot');
        } else {
            messageElement.classList.add('tú');
        }

        chatContent.appendChild(messageElement);
        chatContent.scrollTop = chatContent.scrollHeight;
    }


    async function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            updateChat(message);
            chatInput.value = '';
            try {
                // Aquí debes colocar la definición de backendURL y el fetch
                const backendURL = 'https://chatbotpage.ajroit-wa.workers.dev/'; // Reemplaza con la URL de tu worker
                console.log('URL de fetch:', backendURL); // Debug: Muestra la URL que se va a usar
                console.log('sessionId:', sessionId);
                console.log('Mensaje a enviar:', message);
    
                const response = await fetch(backendURL, { // usa la variable para la url
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-session-id': sessionId,
                    },
                    body: JSON.stringify({ message: message }),
                });
                console.log('Respuesta del fetch:', response); // Debug: Muestra el response
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error del servidor:', errorData);
                    throw new Error(`Error en la solicitud al servidor: ${response.status} - ${errorData.error}`);
                }
    
                const responseData = await response.json();
                updateChat(responseData.botResponse, true);
    
            } catch (error) {
                console.error('Error al enviar el mensaje:', error);
                updateChat('Hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.', true);
            }
        }
    }
    
    // Evento para el botón de chat
    chatButton.addEventListener('click', openChat);

    // Evento para el botón de cerrar
    closeChatButton.addEventListener('click', closeChat);

    sendChatButton.addEventListener('click', sendMessage)

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });


    // ------------------------------------------------------------
    // Sección de Funcionalidad del Menu Mobile
    // ------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active'); // Toggle a class to show/hide menu
    });
});