import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

interface WordRequestDialogProps {
  defaultWord?: string;
  defaultTransliteration?: string;
  trigger?: React.ReactNode;
}

export default function WordRequestDialog({
  defaultWord = "",
  defaultTransliteration = "",
  trigger,
}: WordRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    word: defaultWord,
    transliteration: defaultTransliteration,
    submitterEmail: "",
    reason: "",
  });
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      
      return response.json();
    },
    onSuccess: (response: any) => {
      toast({
        title: response.message ? "Request Updated" : "Request Submitted",
        description: response.message || "We'll notify you when the analysis is ready.",
      });
      setOpen(false);
      setFormData({
        word: "",
        transliteration: "",
        submitterEmail: "",
        reason: "",
      });
    },
    onError: (error: any) => {
      const errorMsg = error?.error || error?.message || "Failed to submit request";
      
      // Check if word already exists
      if (errorMsg.includes("already exists in database")) {
        toast({
          title: "Word Already Available",
          description: "This word is already in our database. Try searching for it!",
          variant: "default",
        });
      } else {
        toast({
          title: "Request Failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.word.trim()) {
      toast({
        title: "Word Required",
        description: "Please enter an Arabic word or transliteration",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" data-testid="button-request-word">
            <Plus className="w-4 h-4 mr-2" />
            Request Word Analysis
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-word-request">
        <DialogHeader>
          <DialogTitle className="text-2xl font-amiri text-primary">
            Request Word Analysis
          </DialogTitle>
          <DialogDescription className="font-crimson">
            Can't find the word you're looking for? Submit a request and we'll prioritize it for analysis.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="word" className="font-semibold">
                Arabic Word <span className="text-destructive">*</span>
              </Label>
              <Input
                id="word"
                placeholder="ضرب"
                value={formData.word}
                onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                className="text-xl font-amiri"
                data-testid="input-word"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="transliteration">
                Transliteration (Optional)
              </Label>
              <Input
                id="transliteration"
                placeholder="daraba"
                value={formData.transliteration}
                onChange={(e) => setFormData({ ...formData, transliteration: e.target.value })}
                data-testid="input-transliteration"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">
                Email (Optional - for notifications)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.submitterEmail}
                onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                data-testid="input-email"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">
                Why do you want this word analyzed? (Optional)
              </Label>
              <Textarea
                id="reason"
                placeholder="I've seen this word misinterpreted in..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="resize-none font-crimson"
                rows={3}
                data-testid="input-reason"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              data-testid="button-submit-request"
            >
              {submitMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
