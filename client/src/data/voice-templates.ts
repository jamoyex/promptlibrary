export interface VoiceTemplate {
  id: string;
  title: string;
  description: string;
  actions: string[];
}

export const VOICE_TEMPLATES: VoiceTemplate[] = [
  {
    id: "voice-support",
    title: "Voice Support Agent",
    description: "Handles inbound calls with FAQs, scheduling, and handoff to a human when needed.",
    actions: ["Call Transfer", "Schedule Callback", "Take Message"],
  },
  {
    id: "voice-sales",
    title: "Voice Sales Assistant",
    description: "Qualifies leads by phone, books demos, and captures contact details.",
    actions: ["Book Demo", "Capture Lead", "Call Transfer"],
  },
  {
    id: "voice-appointments",
    title: "Voice Appointment Bot",
    description: "Books and reschedules appointments by phone 24/7.",
    actions: ["Book Appointment", "Reschedule", "Send Reminder"],
  },
];

export function getVoiceTemplateById(id: string): VoiceTemplate | undefined {
  return VOICE_TEMPLATES.find((t) => t.id === id);
}
