document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    let sessionId = localStorage.getItem('chatSessionId') || null;

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('chatSessionId', sessionId);
    }

    function updateChat(message, isBot = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.textContent = message;
        if (isBot) {
            messageElement.classList.add('bot');
        } else {
            messageElement.classList.add('tú');
        }
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            updateChat(message);
            chatInput.value = '';
            try {
                const backendURL = 'https://chatbotpage.ajroit-wa.workers.dev/';
                const response = await fetch(backendURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-session-id': sessionId,
                    },
                    body: JSON.stringify({ message: message }),
                });
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

    sendChat.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});

