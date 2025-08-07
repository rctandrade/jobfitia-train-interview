import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useApplications } from "@/hooks/useApplications";
import { useAuth } from "@/hooks/useAuth";
import { Send, Loader2 } from "lucide-react";

interface ApplyJobModalProps {
  jobId: string;
  jobTitle: string;
  children: React.ReactNode;
  onApplicationSent?: () => void;
}

export const ApplyJobModal = ({ jobId, jobTitle, children, onApplicationSent }: ApplyJobModalProps) => {
  const { user } = useAuth();
  const { createApplication, loading } = useApplications();
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { data, error } = await createApplication({
      job_id: jobId,
      candidate_id: user.id,
      cover_letter: coverLetter,
      resume_url: resumeUrl || undefined,
    });

    if (!error) {
      setOpen(false);
      setCoverLetter("");
      setResumeUrl("");
      onApplicationSent?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Candidatar-se para a vaga</DialogTitle>
          <DialogDescription>
            {jobTitle}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cover_letter">Carta de Apresentação</Label>
            <Textarea
              id="cover_letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Conte por que você é o candidato ideal para esta vaga..."
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume_url">Link do Currículo (opcional)</Label>
            <Input
              id="resume_url"
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://exemplo.com/meu-curriculo.pdf"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !coverLetter.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Candidatura
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};