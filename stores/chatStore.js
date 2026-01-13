import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useKeyboardStore } from "./keyboardStore";
import { useControlStore } from "./controlStore";

export const useChatStore = defineStore("chat", () => {
  const messages = ref([]);
  const isLoading = ref(false);
  const isOpen = ref(false);
  const error = ref(null);

  // Get stores for app control
  const keyboardStore = useKeyboardStore();
  const controlStore = useControlStore();

  // Get current app state for context
  const currentState = computed(() => ({
    rootNote: keyboardStore.rootNote,
    chordType: keyboardStore.chordType,
    chordNotes: keyboardStore.chordNotes,
    pitch: keyboardStore.currentPitch,
    mode: controlStore.keyboardType,
    instrument: controlStore.selectedInstrument,
  }));

  // Toggle chat panel
  function toggleChat() {
    isOpen.value = !isOpen.value;
  }

  // Execute an action from the AI
  function executeAction(action) {
    console.log("Executing AI action:", action);

    switch (action.action) {
      case "setRootNote":
        if (action.params?.note) {
          keyboardStore.changeRootNote(action.params.note);
        }
        break;

      case "setChordType":
        if (action.params?.type) {
          keyboardStore.chordType = action.params.type;
        }
        break;

      case "setChord":
        if (action.params?.root) {
          keyboardStore.changeRootNote(action.params.root);
        }
        if (action.params?.type) {
          keyboardStore.chordType = action.params.type;
        }
        break;

      case "playChord":
        // Emit event for the keyboard to play - handled by the component
        window.dispatchEvent(new CustomEvent("playChord"));
        break;

      case "setPitch":
        if (action.params?.pitch) {
          keyboardStore.currentPitch = action.params.pitch;
        }
        break;

      case "setKeyboardMode":
        if (action.params?.mode) {
          controlStore.keyboardType = action.params.mode;
        }
        break;

      default:
        console.warn("Unknown action:", action.action);
    }
  }

  // Send a message to the AI
  async function sendMessage(content) {
    if (!content.trim()) return;

    error.value = null;

    // Add user message
    messages.value.push({
      role: "user",
      content: content.trim(),
    });

    isLoading.value = true;

    try {
      const response = await $fetch("/api/chat", {
        method: "POST",
        body: {
          messages: messages.value,
          currentState: currentState.value,
        },
      });

      // Add AI response
      messages.value.push({
        role: "assistant",
        content: response.message,
      });

      // Execute any actions from the AI
      if (response.actions && response.actions.length > 0) {
        response.actions.forEach((action) => {
          executeAction(action);
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      error.value = err.message || "Failed to get response";

      // Add error message
      messages.value.push({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      isLoading.value = false;
    }
  }

  // Clear chat history
  function clearChat() {
    messages.value = [];
    error.value = null;
  }

  // Add welcome message
  function initChat() {
    if (messages.value.length === 0) {
      messages.value.push({
        role: "assistant",
        content:
          '👋 Hey! I\'m your **Music Instructor AI**. I can help you learn music theory and even control the keyboard!\n\nTry asking me things like:\n- "Show me a C Major 7 chord"\n- "What\'s the difference between major and minor?"\n- "Play a jazz chord progression"\n- "Explain the Hendrix chord"\n\nWhat would you like to learn?',
      });
    }
  }

  return {
    // State
    messages,
    isLoading,
    isOpen,
    error,
    currentState,

    // Actions
    toggleChat,
    sendMessage,
    clearChat,
    initChat,
    executeAction,
  };
});
