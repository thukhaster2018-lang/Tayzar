
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import { getChatbotResponse } from './services/geminiService';
import type { ChatMessage as ChatMessageType } from './types';
import { TriageLevel, Status, Sex } from './types';

const App: React.FC = () => {
    const initialWelcomeMessage: ChatMessageType = {
        id: 'init-welcome',
        sender: 'bot',
        botResponse: {
            patientMessage: `🇲🇲 မင်္ဂလာပါ၊ သုခဆေးခန်း၏ ကျန်းမာရေး chatbot မှ ကြိုဆိုပါသည်။ ဤ chatbot သည် အရေးပေါ်အခြေအနေများအတွက်မဟုတ်ပါ။ အရေးပေါ်လက္ခဏာရှိပါက ၁၉၂ သို့ ချက်ချင်းဆက်သွယ်ပါ။ ဆက်လက်အသုံးပြုရန် ‘ဆက်လက်’ သို့မဟုတ် 'continue' ဟုပြန်စာပို့ပါ။\n\nEN: Welcome to Thukha Clinic's chatbot. This is not for emergencies. If you have an emergency, call 192. To continue, please reply with 'continue'.`,
            jsonData: {
                case_id: "N/A",
                timestamp: new Date().toISOString(),
                channel: "Gemini",
                name: "",
                age: null,
                sex: Sex.Unknown,
                phone: "",
                location_mm: "",
                location_en: "",
                chief_complaint: "Initial Greeting",
                duration: "",
                key_symptoms: [],
                comorbidities: [],
                meds_tried: "",
                red_flags: {
                    chest_pain: false,
                    shortness_of_breath: false,
                    neuro_deficit: false,
                    high_fever_72h: false,
                    severe_pain_8of10: false,
                    gi_bleed_black_stool: false,
                    dehydration: false,
                    rbs_over_300_or_ketones: false,
                    pregnancy_bleeding: false,
                },
                triage: TriageLevel.Low,
                advice: [],
                teleconsult_offer: "No",
                uploads_links: [],
                staff_notes: "Initial welcome message sent.",
                status: Status.New,
            }
        }
    };

    const [messages, setMessages] = useState<ChatMessageType[]>([initialWelcomeMessage]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (userInput: string) => {
        const userMessage: ChatMessageType = {
            id: Date.now().toString(),
            sender: 'user',
            userText: userInput,
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const botResponseData = await getChatbotResponse(userInput, messages);
            const botMessage: ChatMessageType = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                botResponse: botResponseData,
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(`Error: ${errorMessage}`);
            const errorBotMessage: ChatMessageType = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                botResponse: {
                    patientMessage: `🇲🇲 တောင်းပန်ပါတယ်။ အမှားအယွင်းတစ်ခုဖြစ်ပွားနေပါသည်။ ခဏနေပြီးမှ ပြန်ကြိုးစားပေးပါ။\n\nEN: Sorry, an error occurred. Please try again later.`,
                    jsonData: { ...initialWelcomeMessage.botResponse!.jsonData, chief_complaint: "Error", staff_notes: errorMessage }
                }
            };
            setMessages(prev => [...prev, errorBotMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen font-sans">
            <Header />
            <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
                <div className="max-w-4xl mx-auto">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                       <ChatMessage key="loading" message={{ id: 'loading', sender: 'bot' }} isLoading={true} />
                    )}
                    {error && (
                        <div className="text-red-500 text-center p-2">{error}</div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </main>
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
    );
};

export default App;
