import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Message = Database['public']['Tables']['messages']['Row'];

interface ChatProps {
  orderId: string;
  currentUserId: string;
  receiverId: string;
}

export function Chat({ orderId, currentUserId, receiverId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
      } else if (data) {
        setMessages(data);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);

    const { error } = await supabase.from("messages").insert({
      order_id: orderId,
      sender_id: currentUserId,
      receiver_id: receiverId,
      content: newMessage.trim(),
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Failed to send",
        description: error.message,
      });
    } else {
      setNewMessage("");
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-lg bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-sm">Conversation</h3>
        <span className="text-xs text-muted-foreground">Order #{orderId.slice(0, 8)}</span>
      </div>

      <ScrollArea className="flex-1 p-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${
                  msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.sender_id === currentUserId
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-white dark:bg-slate-800 border rounded-bl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className={`text-[10px] opacity-70 block mt-1 ${
                     msg.sender_id === currentUserId ? 'text-primary-foreground/80' : 'text-slate-400'
                  }`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t flex gap-2 items-center">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1 bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
        />
        <Button
          type="submit"
          size="icon"
          disabled={sending || !newMessage.trim()}
          className="h-10 w-10 shrink-0 rounded-full shadow-sm"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
