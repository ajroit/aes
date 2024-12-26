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
         messageElement.textContent = message;
 
         if(isBot){
           messageElement.classList.add('bot')
         } else {
           messageElement.classList.add('tú')
         }
 
         chatContent.appendChild(messageElement);
          chatContent.scrollTop = chatContent.scrollHeight;
     }
 
     function sendMessage() {
       const message = chatInput.value.trim();
         if (message) {
            updateChat(message)
            chatInput.value = '';
 
            setTimeout(() => {
                const botResponse = "Hola! en que puedo ayudarte?";
                updateChat(botResponse, true);
            }, 500)
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
         mainNav.classList.toggle('mobile-menu-open'); // Toggle a class to show/hide menu
     });
 });