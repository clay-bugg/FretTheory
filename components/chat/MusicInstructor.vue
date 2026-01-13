<template>
  <div class="chat-container" :class="{ 'is-open': chatStore.isOpen }">
    <!-- Toggle Button -->

    <button
      class="chat-toggle"
      @click="chatStore.toggleChat"
      :title="chatStore.isOpen ? 'Close Chat' : 'Ask Music Instructor'"
    >
      <Icon
        :name="chatStore.isOpen ? 'mdi:close' : 'mdi:robot-happy'"
        size="24"
      />
    </button>

    <!-- Chat Panel -->

    <div class="chat-panel" v-show="chatStore.isOpen">
      <div class="chat-header">
        <div class="header-content">
          <Icon name="mdi:music-note" size="20" />
          <span>Music Instructor AI</span>
        </div>
        <button
          class="clear-btn"
          @click="chatStore.clearChat"
          title="Clear chat"
        >
          <Icon name="mdi:delete-outline" size="18" />
        </button>
      </div>

      <!-- Messages -->

      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="(message, index) in chatStore.messages"
          :key="index"
          class="message"
          :class="message.role"
        >
          <div class="message-avatar">
            <Icon
              :name="message.role === 'user' ? 'mdi:account' : 'mdi:robot'"
              size="18"
            />
          </div>
          <div
            class="message-content"
            v-html="formatMessage(message.content)"
          ></div>
        </div>

        <!-- Loading indicator -->

        <div v-if="chatStore.isLoading" class="message assistant loading">
          <div class="message-avatar">
            <Icon name="mdi:robot" size="18" />
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->

      <form class="chat-input" @submit.prevent="handleSubmit">
        <input
          type="text"
          v-model="inputMessage"
          placeholder="Ask about chords, scales, theory..."
          :disabled="chatStore.isLoading"
          @keydown.enter.prevent="handleSubmit"
        />
        <button
          type="submit"
          :disabled="chatStore.isLoading || !inputMessage.trim()"
        >
          <Icon name="mdi:send" size="20" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from "vue";
import { useChatStore } from "~/stores/chatStore";

const chatStore = useChatStore();
const inputMessage = ref("");
const messagesContainer = ref(null);

// Initialize chat with welcome message

onMounted(() => {
  chatStore.initChat();
});

// Auto-scroll to bottom when messages change

watch(
  () => chatStore.messages.length,
  async () => {
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }
);

// Handle form submission

function handleSubmit() {
  if (!inputMessage.value.trim() || chatStore.isLoading) return;

  chatStore.sendMessage(inputMessage.value);
  inputMessage.value = "";
}

// Format message with basic markdown support

function formatMessage(content) {
  if (!content) return "";

  return (
    content
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Code
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // Line breaks
      .replace(/\n/g, "<br>")
      // Lists
      .replace(/^- (.+)/gm, "• $1")
  );
}
</script>

<style lang="scss" scoped>
.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: "Lexend", sans-serif;
}

.chat-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(99, 102, 241, 0.5);
  }

  .is-open & {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 36px;
    height: 36px;
    background: #1e1e2e;
    border: 2px solid #6366f1;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
}

.chat-panel {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 380px;
  height: 520px;
  background: #1a1a2e;
  border-radius: 16px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-content {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    font-weight: 600;
    font-size: 1rem;
  }

  .clear-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 8px;
    padding: 6px;
    cursor: pointer;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #6366f1;
    border-radius: 3px;
  }
}

.message {
  display: flex;
  gap: 10px;
  max-width: 90%;

  &.user {
    align-self: flex-end;
    flex-direction: row-reverse;

    .message-avatar {
      background: #10b981;
    }

    .message-content {
      background: #6366f1;
      color: white;
      border-radius: 16px 16px 4px 16px;
    }
  }

  &.assistant {
    align-self: flex-start;

    .message-avatar {
      background: #8b5cf6;
    }

    .message-content {
      background: #2a2a3e;
      color: #e0e0e0;
      border-radius: 16px 16px 16px 4px;
    }
  }
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.message-content {
  padding: 12px 16px;
  font-size: 0.9rem;
  line-height: 1.5;

  :deep(strong) {
    color: #a5b4fc;
  }

  :deep(code) {
    background: rgba(99, 102, 241, 0.2);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.85em;
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;

  span {
    width: 8px;
    height: 8px;
    background: #6366f1;
    border-radius: 50%;
    animation: typing 1.4s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

.chat-input {
  padding: 16px;
  background: #0f0f1a;
  border-top: 1px solid rgba(99, 102, 241, 0.2);
  display: flex;
  gap: 10px;

  input {
    flex: 1;
    background: #2a2a3e;
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 12px;
    padding: 12px 16px;
    color: white;
    font-size: 0.9rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;

    &::placeholder {
      color: #666;
    }

    &:focus {
      border-color: #6366f1;
    }

    &:disabled {
      opacity: 0.6;
    }
  }

  button {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

/* Responsive */
@media (max-width: 480px) {
  .chat-panel {
    width: calc(100vw - 40px);
    height: 60vh;
    bottom: 60px;
    right: -10px;
  }
}
</style>
