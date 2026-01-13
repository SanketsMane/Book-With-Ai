import React, { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'

interface ChatBoardProps {
    tripId: Id<"GroupTrips">;
}

function ChatBoard({ tripId }: ChatBoardProps) {
    const { user } = useUser();
    const sendMessage = useMutation(api.group_trips.sendMessage);
    // Use the getGroupTrip query to access messages, or ideally a dedicated messages query. 
    // The current schema stores messages INSIDE the GroupTrip document. 
    // So watching the trip document updates the chat.
    const trip = useQuery(api.group_trips.getGroupTrip, { id: tripId });

    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [trip?.messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            await sendMessage({
                tripId,
                userId: user.id || "test_user_id",
                content: newMessage,
                userName: user.fullName || "User" // Fallback name
            });
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }

    if (!trip) return <div>Loading chat...</div>;

    return (
        <div className="flex flex-col h-[600px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <h3 className="font-bold text-gray-900 dark:text-white">Group Chat</h3>
                <p className="text-xs text-gray-500">Discuss plans and share ideas.</p>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {trip.messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                        <p>No messages yet.</p>
                        <p>Say hello to the group! 👋</p>
                    </div>
                ) : (
                    trip.messages.map((msg: any) => {
                        const isMe = msg.userId === (user?.id || "test_user_id");
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isMe
                                        ? 'bg-pink-600 text-white rounded-br-none'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                    }`}>
                                    {!isMe && <p className="text-[10px] font-bold opacity-60 mb-1">{msg.userName}</p>}
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-pink-200' : 'text-gray-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-pink-500"
                    />
                    <Button type="submit" size="icon" className="bg-pink-600 hover:bg-pink-700 rounded-xl">
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ChatBoard
