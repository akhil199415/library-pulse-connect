
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppMessageProps {
  memberName: string;
  memberPhone?: string;
  bookTitle: string;
  dueDate: string;
  isOverdue?: boolean;
}

export const WhatsAppMessaging = ({ 
  memberName, 
  memberPhone = "", 
  bookTitle, 
  dueDate, 
  isOverdue = false 
}: WhatsAppMessageProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(memberPhone);
  const [customMessage, setCustomMessage] = useState("");

  const defaultMessage = isOverdue 
    ? `Dear ${memberName}, your book "${bookTitle}" was due on ${dueDate}. Please return it as soon as possible to avoid additional fines. Thank you!`
    : `Dear ${memberName}, this is a reminder that your book "${bookTitle}" is due on ${dueDate}. Please return it on time. Thank you!`;

  const sendWhatsAppMessage = () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    const message = customMessage || defaultMessage;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp Opened",
      description: "WhatsApp has been opened with the reminder message",
    });
    
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send WhatsApp Reminder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number (e.g., +919876543210)"
            />
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={defaultMessage}
              rows={4}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Leave empty to use default message
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendWhatsAppMessage} className="gap-2">
              <Send className="w-4 h-4" />
              Send WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
