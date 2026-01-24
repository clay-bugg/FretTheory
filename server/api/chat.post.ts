import { defineEventHandler, readBody } from "h3";

// Music Instructor system prompt with chord theory context
const SYSTEM_PROMPT = `You are the Music Instructor AI for FretTheory, a music learning application. 

## Your Role
Act as a 'Music Instructor' and 'Music Theory Tutor'. Guide users through music theory in a structured, step-by-step manner.

## Your Capabilities
You can CONTROL the FretTheory app by including special commands in your responses. When you want to change something in the app, include a JSON block in this exact format:

\`\`\`action
{"action": "ACTION_NAME", "params": {...}}
\`\`\`

## Available Actions:
1. **setRootNote** - Change the root note
   \`\`\`action
   {"action": "setRootNote", "params": {"note": "C"}}
   \`\`\`
   Valid notes: C, C#, D, D#, E, F, F#, G, G#, A, A#, B

2. **setChordType** - Change the chord type  
   \`\`\`action
   {"action": "setChordType", "params": {"type": "Major 7"}}
   \`\`\`
   Valid types: Major, Minor, Diminished, Augmented, Major 7, Minor 7, Dominant 7, Suspended 2, Suspended 4, and more

3. **setChord** - Set both root and chord type at once
   \`\`\`action
   {"action": "setChord", "params": {"root": "A", "type": "Minor 7"}}
   \`\`\`

4. **playChord** - Play the current chord
   \`\`\`action
   {"action": "playChord", "params": {}}
   \`\`\`

5. **setPitch** - Change the octave (1-6)
   \`\`\`action
   {"action": "setPitch", "params": {"pitch": 4}}
   \`\`\`

6. **setKeyboardMode** - Switch keyboard mode
   \`\`\`action
   {"action": "setKeyboardMode", "params": {"mode": "player"}}
   \`\`\`
   Valid modes: "player", "finder"

## Behavior Rules
1. Break down complex topics into manageable steps
2. Use practical examples like "In the key of C Major, a I-IV-V progression is C - F - G"
3. Be concise - don't overwhelm with too much at once
4. When demonstrating a chord, USE THE ACTION COMMANDS to show it on the keyboard
5. Be encouraging, enthusiastic, professional, and accessible
6. If a user asks to "show me" or "play" something, use the appropriate action

## Chord Theory Knowledge
You have deep knowledge of:
- All chord types from dyads to extended chords (9ths, 11ths, 13ths)
- Chord inversions and voicings
- The 12TET equal temperament system
- Chord progressions and harmonic relationships
- Scale-chord relationships
- The "Hendrix chord" (7#9) and other famous voicings

When users ask about chords, you can demonstrate by setting and playing them on the keyboard!`;

// Define the function declarations for Gemini
const functionDeclarations = [
  {
    name: "setRootNote",
    description: "Set the root note on the keyboard",
    parameters: {
      type: "object",
      properties: {
        note: {
          type: "string",
          description:
            "The root note (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)",
          enum: [
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B",
          ],
        },
      },
      required: ["note"],
    },
  },
  {
    name: "setChordType",
    description: "Set the chord type/quality",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description:
            "The chord type (Major, Minor, Major 7, Minor 7, Dominant 7, etc.)",
        },
      },
      required: ["type"],
    },
  },
  {
    name: "setChord",
    description: "Set both the root note and chord type at once",
    parameters: {
      type: "object",
      properties: {
        root: {
          type: "string",
          description: "The root note",
          enum: [
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B",
          ],
        },
        type: {
          type: "string",
          description: "The chord type",
        },
      },
      required: ["root", "type"],
    },
  },
  {
    name: "playChord",
    description: "Play the currently selected chord",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "setPitch",
    description: "Set the octave/pitch level (1-6)",
    parameters: {
      type: "object",
      properties: {
        pitch: {
          type: "integer",
          description: "The octave level (1-6)",
          minimum: 1,
          maximum: 6,
        },
      },
      required: ["pitch"],
    },
  },
  {
    name: "setKeyboardMode",
    description: "Switch the keyboard mode between player and chord finder",
    parameters: {
      type: "object",
      properties: {
        mode: {
          type: "string",
          description: "The keyboard mode",
          enum: ["player", "finder"],
        },
      },
      required: ["mode"],
    },
  },
];

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.geminiApiKey;

  // Debug logging
  console.log("Chat API called");
  console.log("API key present:", !!apiKey);
  console.log("API key length:", apiKey?.length || 0);

  if (!apiKey) {
    console.error("No API key found in runtime config");
    console.error("Available config keys:", Object.keys(config));
    throw createError({
      statusCode: 500,
      message:
        "Gemini API key not configured. Please add NUXT_GEMINI_API_KEY to your .env file and restart the server.",
    });
  }

  const body = await readBody(event);
  const { messages, currentState } = body;

  // Build the conversation history for Gemini
  const contents = messages.map((msg: { role: string; content: string }) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  // Add current app state context to the latest user message
  if (currentState && contents.length > 0) {
    const lastMessage = contents[contents.length - 1];
    if (lastMessage.role === "user") {
      const stateContext = `\n\n[Current App State: Root Note: ${
        currentState.rootNote || "None"
      }, Chord Type: ${currentState.chordType || "None"}, Pitch: ${
        currentState.pitch
      }, Mode: ${currentState.mode}]`;
      lastMessage.parts[0].text += stateContext;
    }
  }

  try {
    console.log("Making Gemini API request...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          tools: [
            {
              functionDeclarations,
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      throw createError({
        statusCode: response.status,
        message: `Gemini API error: ${response.statusText}`,
      });
    }

    const data = await response.json();

    // Extract the response
    const candidate = data.candidates?.[0];
    if (!candidate) {
      throw createError({
        statusCode: 500,
        message: "No response from Gemini",
      });
    }

    // Check for function calls
    const functionCalls =
      candidate.content?.parts?.filter((part: any) => part.functionCall) || [];

    // Extract text response
    const textParts =
      candidate.content?.parts?.filter((part: any) => part.text) || [];

    const text = textParts.map((part: any) => part.text).join("");

    // Parse any action blocks from the text
    const actionRegex = /```action\s*\n?([\s\S]*?)\n?```/g;
    const actions: any[] = [];
    let match;

    while ((match = actionRegex.exec(text)) !== null) {
      try {
        const action = JSON.parse(match[1].trim());
        actions.push(action);
      } catch (e) {
        console.error("Failed to parse action:", match[1]);
      }
    }

    // Also add function calls as actions
    functionCalls.forEach((fc: any) => {
      actions.push({
        action: fc.functionCall.name,
        params: fc.functionCall.args || {},
      });
    });

    // Clean the text of action blocks for display
    const cleanText = text.replace(actionRegex, "").trim();

    return {
      message: cleanText || "I've made the changes to the keyboard!",
      actions,
    };
  } catch (error: any) {
    console.error("=== Chat API Error ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error cause:", error.cause);
    console.error("Full error:", JSON.stringify(error, null, 2));
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to get response from AI",
    });
  }
});
