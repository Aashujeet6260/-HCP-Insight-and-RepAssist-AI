import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData } from '../app/features/interactionSlice';
import { Bot, User, Loader } from 'lucide-react';

const AIAssistant = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const currentFormData = useSelector(state => state.interaction.form);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/v1/interactions/chat', {
                message: input,
                current_data: currentFormData,
            });

            const { ai_response, updated_form_data } = response.data;
            const aiMessage = { sender: 'ai', text: ai_response };
            setMessages(prev => [...prev, aiMessage]);
            
            // Update the form state in Redux with data extracted by the AI
            dispatch(setFormData(updated_form_data));

        } catch (error) {
            console.error("Error communicating with AI assistant:", error);
            const errorMessage = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-border-gray h-full flex flex-col">
            <h2 className="text-base font-semibold text-text-primary mb-3">AI Assistant</h2>
            <p className="text-xs text-text-secondary mb-4">
                Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.
            </p>
            <div className="flex-grow bg-white border border-border-gray rounded p-2 overflow-y-auto mb-4 min-h-[300px]">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-2.5 my-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && <Bot className="w-6 h-6 text-brand-blue" />}
                        <div className={`p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 text-text-primary' : 'bg-gray-100 text-text-primary'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                        {msg.sender === 'user' && <User className="w-6 h-6 text-text-secondary" />}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center justify-center p-2">
                         <Loader className="w-5 h-5 animate-spin text-brand-blue" />
                    </div>
                )}
            </div>
            <div className="flex items-center border border-border-gray rounded-md p-1">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe interaction..."
                    className="flex-grow p-2 border-none focus:ring-0 text-sm"
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading}
                    className="bg-brand-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                    Log
                </button>
            </div>
        </div>
    );
};

export default AIAssistant;