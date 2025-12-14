// Bear Buddy - Complete AI with Voice and Responses

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendMessage');
const voiceToggle = document.getElementById('voiceToggle');
const recordButton = document.getElementById('recordBtn');
const voiceText = document.getElementById('voiceText');

// Bear state
let bearState = {
    mood: 'happy',
    happiness: 85,
    energy: 70,
    hunger: 40,
    isTalking: false,
    isListening: false
};

// Speech Synthesis
const synth = window.speechSynthesis;

// Bear responses database
const bearResponses = {
    greetings: [
        "Hello there! 🐻 I'm Buddy, your bear friend!",
        "Hi friend! Ready for some fun today?",
        "Hey there! What would you like to do?",
        "Welcome! I'm so happy to see you! 🌟"
    ],
    
    positiveMessages: [
        "Every day is a new adventure! Remember, you're capable of amazing things! 🌈",
        "You're stronger than you think. Every challenge makes you grow! 🌱",
        "Life is beautiful because of people like you who spread kindness! 💖",
        "You have the power to make today amazing! Start with a smile! 😊",
        "The world needs your unique light. Shine brightly! ✨",
        "Every small step forward is progress. Celebrate your journey! 🎉",
        "You are loved, you are valued, and you make a difference! ❤️",
        "Today is full of possibilities. Choose happiness! 🌞",
        "Your positive energy can change the world around you! ⚡",
        "Remember: You've survived 100% of your bad days so far! 🏆"
    ],
    
    jokes: [
        "Why don't bears wear shoes? Because they have bear feet! 🐾",
        "What do you call a bear with no teeth? A gummy bear! 🧸",
        "Why did the bear dissolve in water? Because it was a polar bear! ❄️",
        "What's a bear's favorite drink? Coca-Koala! 🥤",
        "Why did the bear go to the dentist? To get a filling in his honeycomb! 🦷🍯"
    ],
    
    encouragement: [
        "You've got this! I believe in you! 💪",
        "One step at a time. You're doing great! 👣",
        "Mistakes mean you're trying. Keep going! 🚀",
        "Your potential is endless! Dream big! 🌠"
    ],
    
    stories: [
        "Once upon a time, a little bear learned that the sweetest honey comes from helping others! 🍯",
        "In a magical forest, every animal discovered that sharing happiness made it grow! 🌳",
        "A wise old bear once said: 'The best adventures start with kindness!' 🗺️"
    ],
    
    general: [
        "That's interesting! Tell me more!",
        "I love chatting with you! 🐻",
        "Hmm, let me think about that...",
        "What a great thing to talk about!"
    ]
};

// Initialize everything
function initBear() {
    // Setup event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    voiceToggle.addEventListener('click', toggleVoice);
    recordButton.addEventListener('mousedown', startListening);
    recordButton.addEventListener('mouseup', stopListening);
    recordButton.addEventListener('touchstart', startListening);
    recordButton.addEventListener('touchend', stopListening);
    
    // Add quick phrase listeners
    document.querySelectorAll('.phrase-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = e.target.getAttribute('data-text') || e.target.textContent;
            messageInput.value = text;
            sendMessage();
        });
    });
    
    // Add bear control listeners
    document.getElementById('petBear')?.addEventListener('click', petBear);
    document.getElementById('feedBear')?.addEventListener('click', feedBear);
    document.getElementById('danceBear')?.addEventListener('click', danceBear);
    document.getElementById('sleepBear')?.addEventListener('click', sleepBear);
    
    // Add welcome message
    setTimeout(() => {
        addMessage("Hello! I'm Buddy the Bear! 🐻 You can talk to me, ask for positive messages, jokes, or just chat! Try saying: 'Tell me something positive' or 'I need encouragement'", 'bear');
        speak("Hello! I'm Buddy the Bear! You can talk to me, ask for positive messages, jokes, or just chat!");
    }, 1000);
}

// Send message function
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
    
    // Add user message
    addMessage(text, 'user');
    messageInput.value = '';
    
    // Process bear response
    setTimeout(() => processUserMessage(text), 500);
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'user' ? 'user' : 'bear'}"></i>
        </div>
        <div class="message-content">
            <div class="message-header">
                <strong>${sender === 'user' ? 'You' : 'Buddy the Bear'}</strong>
                <span class="message-time">${time}</span>
            </div>
            <p>${escapeHtml(text)}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process user message
function processUserMessage(text) {
    const lowerText = text.toLowerCase();
    
    // Show bear is thinking
    showThinking(true);
    
    // Simulate thinking delay
    setTimeout(() => {
        showThinking(false);
        
        let response = '';
        
        // Check for keywords
        if (containsAny(lowerText, ['hello', 'hi', 'hey', 'greetings'])) {
            response = getRandomResponse(bearResponses.greetings);
            updateHappiness(5);
        }
        else if (containsAny(lowerText, ['positive', 'motivation', 'inspire', 'encouragement', 'hope', 'life'])) {
            response = getRandomResponse(bearResponses.positiveMessages);
            updateHappiness(10);
        }
        else if (containsAny(lowerText, ['joke', 'funny', 'laugh'])) {
            response = getRandomResponse(bearResponses.jokes);
            updateHappiness(8);
        }
        else if (containsAny(lowerText, ['story', 'tale'])) {
            response = getRandomResponse(bearResponses.stories);
        }
        else if (containsAny(lowerText, ['thank', 'thanks'])) {
            response = "You're welcome! I'm always here for you! 🤗";
            updateHappiness(15);
        }
        else if (containsAny(lowerText, ['love you', 'like you'])) {
            response = "Aww, I love you too! You're my best friend! ❤️";
            updateHappiness(20);
        }
        else if (containsAny(lowerText, ['how are you', 'how you'])) {
            response = getMoodResponse();
        }
        else if (containsAny(lowerText, ['your name', 'who are you'])) {
            response = "I'm Buddy the Bear! Your friendly forest companion! 🐻";
        }
        else if (containsAny(lowerText, ['help', 'what can you do'])) {
            response = "I can: 1) Give you positive messages 🌈 2) Tell jokes 😄 3) Share stories 📖 4) Encourage you 💪 5) Just chat! Try saying: 'Give me something positive' or 'Tell me a joke'";
        }
        else if (containsAny(lowerText, ['weather', 'day'])) {
            response = "Every day is sunny when we're together! 🌞 But I heard it might rain honey later! 🍯";
        }
        else if (containsAny(lowerText, ['bye', 'goodbye', 'see you'])) {
            response = "Goodbye friend! Remember: You're amazing! Come back anytime! 🐾";
        }
        else {
            // Default random response
            response = getRandomResponse([
                "That's interesting! Want to hear something positive? 🌟",
                "I love our conversations! Here's a thought: " + getRandomResponse(bearResponses.positiveMessages),
                "You know what always helps? " + getRandomResponse(bearResponses.encouragement),
                getRandomResponse(bearResponses.general)
            ]);
        }
        
        // Add bear's response
        addMessage(response, 'bear');
        
        // Speak the response
        speak(response);
        
        // Animate bear talking
        animateBearTalking();
        
    }, 1000 + Math.random() * 1000);
}

// Check if text contains any of the keywords
function containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
}

// Get random response from array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Get mood-based response
function getMoodResponse() {
    if (bearState.happiness >= 80) {
        return "I'm super happy! 😄 Being your friend makes every day wonderful!";
    } else if (bearState.happiness >= 60) {
        return "I'm doing great! 😊 Ready to spread some positivity!";
    } else if (bearState.happiness >= 40) {
        return "I'm feeling okay... maybe we could share some positive thoughts?";
    } else {
        return "I'm feeling a bit low... but talking to you always helps! 💕";
    }
}

// Update bear's happiness
function updateHappiness(amount) {
    bearState.happiness = Math.min(100, Math.max(0, bearState.happiness + amount));
    updateStatusDisplay();
}

// Update status display
function updateStatusDisplay() {
    // Update happiness bar if it exists
    const happinessBar = document.querySelector('.happiness');
    if (happinessBar) {
        happinessBar.style.width = `${bearState.happiness}%`;
    }
    
    // Update mood text if it exists
    const moodElement = document.querySelector('.mood');
    if (moodElement) {
        if (bearState.happiness >= 80) {
            moodElement.textContent = "😄 Very Happy";
        } else if (bearState.happiness >= 60) {
            moodElement.textContent = "😊 Happy";
        } else if (bearState.happiness >= 40) {
            moodElement.textContent = "😐 Okay";
        } else {
            moodElement.textContent = "😔 Sad";
        }
    }
}

// Speak text
function speak(text) {
    if (!synth || bearState.isTalking) return;
    
    // Cancel any ongoing speech
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    utterance.volume = 1;
    
    bearState.isTalking = true;
    
    utterance.onstart = () => {
        console.log("Bear started speaking");
    };
    
    utterance.onend = () => {
        bearState.isTalking = false;
        console.log("Bear finished speaking");
    };
    
    synth.speak(utterance);
}

// Animate bear talking
function animateBearTalking() {
    const bearMouth = document.querySelector('.bear-mouth');
    if (bearMouth) {
        bearMouth.style.animation = 'talk 0.3s infinite';
        setTimeout(() => {
            if (bearMouth) bearMouth.style.animation = 'none';
        }, 3000);
    }
}

// Voice recognition functions
function toggleVoice() {
    const voiceInput = document.getElementById('voiceInput');
    if (voiceInput) {
        voiceInput.classList.toggle('active');
        voiceToggle.classList.toggle('active');
    }
}

function startListening() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        alert("Voice recognition not supported. Try Chrome or Edge.");
        return;
    }
    
    bearState.isListening = true;
    recordButton.classList.add('recording');
    voiceText.textContent = "Listening... Speak now!";
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        messageInput.value = transcript;
        sendMessage();
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        voiceText.textContent = "Error listening. Try again!";
        stopListening();
    };
    
    recognition.onend = () => {
        stopListening();
    };
    
    recognition.start();
}

function stopListening() {
    bearState.isListening = false;
    recordButton.classList.remove('recording');
    voiceText.textContent = "Click and speak to Buddy...";
}

// Bear interaction functions
function petBear() {
    addMessage("You gently pet Buddy. He purrs happily! 🐻💕", 'system');
    speak("That feels nice! Thank you for the pets!");
    updateHappiness(15);
    animateBearTalking();
}

function feedBear() {
    addMessage("You give Buddy some delicious honey! 🍯 He munches happily!", 'system');
    speak("Yum! Thank you for the honey!");
    updateHappiness(10);
    animateBearTalking();
}

function danceBear() {
    addMessage("Buddy starts dancing! 🕺💃 He's got some great moves!", 'system');
    speak("Let's dance! Woohoo!");
    updateHappiness(20);
    animateBearTalking();
}

function sleepBear() {
    addMessage("Buddy curls up and goes to sleep... Zzz... 😴💤", 'system');
    speak("I'm getting sleepy... goodnight...");
    
    setTimeout(() => {
        addMessage("Buddy wakes up feeling refreshed! 🌞", 'system');
        speak("I'm awake! That was a good nap!");
    }, 3000);
}

// Show thinking indicator
function showThinking(show) {
    const indicator = document.querySelector('.ai-thinking');
    if (indicator) {
        if (show) {
            indicator.classList.add('visible');
        } else {
            indicator.classList.remove('visible');
        }
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add simple bear animation to HTML
function addBearAnimation() {
    const bearContainer = document.querySelector('.bear-container');
    if (!bearContainer) return;
    
    // Add simple bear face using CSS
    const bearFace = document.createElement('div');
    bearFace.className = 'bear-face';
    bearFace.innerHTML = `
        <div class="bear-eye left"></div>
        <div class="bear-eye right"></div>
        <div class="bear-nose"></div>
        <div class="bear-mouth"></div>
        <div class="bear-ear left"></div>
        <div class="bear-ear right"></div>
    `;
    
    bearContainer.appendChild(bearFace);
    
    // Add CSS for bear face
    const style = document.createElement('style');
    style.textContent = `
        .bear-face {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
        }
        
        .bear-eye {
            position: absolute;
            top: 60px;
            width: 30px;
            height: 30px;
            background: black;
            border-radius: 50%;
        }
        
        .bear-eye.left {
            left: 50px;
        }
        
        .bear-eye.right {
            right: 50px;
        }
        
        .bear-nose {
            position: absolute;
            top: 110px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 30px;
            background: black;
            border-radius: 50%;
        }
        
        .bear-mouth {
            position: absolute;
            top: 140px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 20px;
            background: black;
            border-radius: 10px;
        }
        
        .bear-ear {
            position: absolute;
            top: 20px;
            width: 50px;
            height: 50px;
            background: brown;
            border-radius: 50%;
        }
        
        .bear-ear.left {
            left: 30px;
        }
        
        .bear-ear.right {
            right: 30px;
        }
        
        @keyframes talk {
            0%, 100% { height: 20px; }
            50% { height: 5px; }
        }
        
        @keyframes blink {
            0%, 90%, 100% { height: 30px; }
            95% { height: 5px; }
        }
        
        .bear-eye {
            animation: blink 3s infinite;
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize when page loads
window.addEventListener('load', () => {
    initBear();
    addBearAnimation();
    updateStatusDisplay();
});

// Make functions available globally
window.BearBuddy = {
    speak: speak,
    addMessage: addMessage,
    petBear: petBear,
    feedBear: feedBear,
    danceBear: danceBear,
    sleepBear: sleepBear
};
