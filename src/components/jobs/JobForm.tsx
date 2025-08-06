import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import type { Database } from "@/integrations/supabase/types";

type Job = Database['public']['Tables']['jobs']['Row'];

const jobSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  location: z.string().nullable().optional(),
  employment_type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']).nullable().optional(),
  experience_level: z.enum(['entry', 'mid', 'senior', 'executive']).nullable().optional(),
  salary_min: z.number().min(0).nullable().optional(),
  salary_max: z.number().min(0).nullable().optional(),
  remote_allowed: z.boolean().default(false),
  status: z.enum(['active', 'paused', 'closed']).default('active'),
});

interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job | null;
  onSuccess?: () => void;
}

export const JobForm = ({ open, onOpenChange, job, onSuccess }: JobFormProps) => {
  const { createJob, updateJob } = useJobs();
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState<string[]>(job?.requirements || []);
  const [benefits, setBenefits] = useState<string[]>(job?.benefits || []);
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title || "",
      description: job?.description || "",
      location: job?.location || "",
      employment_type: job?.employment_type as any || undefined,
      experience_level: job?.experience_level as any || undefined,
      salary_min: job?.salary_min || undefined,
      salary_max: job?.salary_max || undefined,
      remote_allowed: job?.remote_allowed || false,
      status: job?.status as any || 'active',
    },
  });

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (requirement: string) => {
    setRequirements(requirements.filter(r => r !== requirement));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (benefit: string) => {
    setBenefits(benefits.filter(b => b !== benefit));
  };

  const onSubmit = async (data: z.infer<typeof jobSchema>) => {
    try {
      setLoading(true);
      
      const jobData = {
        title: data.title,
        description: data.description,
        location: data.location || null,
        employment_type: data.employment_type || null,
        experience_level: data.experience_level || null,
        salary_min: data.salary_min || null,
        salary_max: data.salary_max || null,
        remote_allowed: data.remote_allowed,
        status: data.status,
        requirements,
        benefits,
      };

      if (job) {
        await updateJob(job.id, jobData);
      } else {
        await createJob(jobData);
      }

      onOpenChange(false);
      onSuccess?.();
      form.reset();
      setRequirements([]);
      setBenefits([]);
    } catch (error) {
      console.error("Erro ao salvar vaga:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job ? "Editar Vaga" : "Nova Vaga"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Vaga</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Desenvolvedor React Sênior" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a vaga, responsabilidades e o que vocês buscam..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Contrato</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Tempo Integral</SelectItem>
                        <SelectItem value="part-time">Meio Período</SelectItem>
                        <SelectItem value="contract">Contrato</SelectItem>
                        <SelectItem value="internship">Estágio</SelectItem>
                        <SelectItem value="freelance">Freelancer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Experiência</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="entry">Júnior</SelectItem>
                        <SelectItem value="mid">Pleno</SelectItem>
                        <SelectItem value="senior">Sênior</SelectItem>
                        <SelectItem value="executive">Executivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: São Paulo, SP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salary_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salário Mínimo (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="5000" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salário Máximo (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="8000" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remote_allowed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Trabalho Remoto</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Permite trabalho totalmente remoto
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {job && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status da Vaga</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativa</SelectItem>
                        <SelectItem value="paused">Pausada</SelectItem>
                        <SelectItem value="closed">Fechada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Requirements */}
            <div className="space-y-3">
              <FormLabel>Requisitos</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar requisito..."
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <Button type="button" onClick={addRequirement} variant="outline">
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {requirements.map((req, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {req}
                    <X 
                      className="w-3 h-3 ml-2 cursor-pointer" 
                      onClick={() => removeRequirement(req)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <FormLabel>Benefícios</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar benefício..."
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                />
                <Button type="button" onClick={addBenefit} variant="outline">
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {benefits.map((benefit, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {benefit}
                    <X 
                      className="w-3 h-3 ml-2 cursor-pointer" 
                      onClick={() => removeBenefit(benefit)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Salvando..." : job ? "Atualizar Vaga" : "Criar Vaga"}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};