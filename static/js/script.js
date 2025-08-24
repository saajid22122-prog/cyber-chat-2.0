document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const scrollBtn = document.getElementById('scroll-btn');

    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
        scrollBtn.classList.remove('visible');
    }

    function checkScroll() {
        const isAtBottom = chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 50;
        scrollBtn.classList.toggle('visible', !isAtBottom);
    }

    chatBox.addEventListener('scroll', checkScroll);

    scrollBtn.addEventListener('click', scrollToBottom);

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = '';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            if (data.status === 'success') {
                addMessage(data.message, false);
            } else {
                addMessage("ERROR: Unable to process request. Connection unstable.", false);
            }
        } catch (error) {
            addMessage("NETWORK FAILURE: Connection to server lost. Attempting to reconnect...", false);
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    setTimeout(() => {
        addMessage("SYSTEM INITIALIZED. Ready for communication. How can I assist?", false);
    }, 1000);
});