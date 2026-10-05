'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Store as StoreIcon } from 'lucide-react';
import { Conversation, Message } from '@/lib/types';

export default function ChatPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConvId, setActiveConvId] = useState<string>('');
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/conversations?userId=usr-customer-1');
            const data = await res.json();
            if (data.success && data.data) {
                setConversations(data.data);
                if (data.data.length > 0 && !activeConvId) {
                    setActiveConvId(data.data[0].id);
                }
            }
        } catch {
            // Ignore
        }
    };

    const activeConv = conversations.find((c) => c.id === activeConvId);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !activeConv) return;

        const newMsg: Message = {
            id: `msg-${Date.now()}`,
            conversation_id: activeConv.id,
            sender_id: 'usr-customer-1',
            sender_role: 'CUSTOMER',
            message: inputMessage.trim(),
            created_at: new Date().toISOString(),
        };

        if (!activeConv.messages) {
            activeConv.messages = [];
        }
        activeConv.messages.push(newMsg);
        setInputMessage('');
        setConversations([...conversations]);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
                {/* Left Sidebar: Conversations List */}
                <div className="md:col-span-4 border-r border-slate-100 p-4 space-y-4 bg-slate-50/50">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                        <h2 className="font-bold text-slate-900 text-lg">Store Messages</h2>
                    </div>

                    <div className="space-y-2">
                        {conversations.map((conv) => {
                            const isActive = conv.id === activeConvId;
                            const msgs = conv.messages || [];
                            const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => setActiveConvId(conv.id)}
                                    className={`p-3.5 rounded-2xl cursor-pointer transition border ${isActive
                                            ? 'bg-white border-indigo-600 shadow-sm'
                                            : 'border-transparent hover:bg-white hover:border-slate-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-900 text-sm">{conv.company_name}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">
                                            {lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mt-1">
                                        {lastMsg ? lastMsg.message : conv.last_message || 'No messages yet'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Chat Main */}
                <div className="md:col-span-8 flex flex-col justify-between p-6">
                    {activeConv ? (
                        <>
                            {/* Chat Header */}
                            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">{activeConv.company_name}</h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <StoreIcon className="h-3.5 w-3.5 text-indigo-600" /> Physical Electronics Store Support
                                    </p>
                                </div>
                                <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold">
                                    🟢 Store Agent Online
                                </span>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto py-6 space-y-4 max-h-[420px]">
                                {(activeConv.messages || []).map((msg: Message) => {
                                    const isCustomer = msg.sender_role === 'CUSTOMER';
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm space-y-1 ${isCustomer
                                                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                                                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                                                    }`}
                                            >
                                                <p className="leading-relaxed">{msg.message}</p>
                                                <span
                                                    className={`block text-[10px] text-right font-mono ${isCustomer ? 'text-indigo-200' : 'text-slate-400'
                                                        }`}
                                                >
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-100 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ask store team about stock, warranty, delivery..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    className="flex-1 bg-slate-100 px-4 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-2xl font-bold transition shadow-md"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                            <MessageSquare className="h-12 w-12 mb-2 text-slate-300" />
                            Select a conversation to chat with store managers
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
