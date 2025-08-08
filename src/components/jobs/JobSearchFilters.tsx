import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Briefcase, GraduationCap, DollarSign, Wifi, X } from "lucide-react";
import { JobFilters } from "@/hooks/useJobSearch";

interface JobSearchFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  locations: string[];
  employmentTypes: string[];
  experienceLevels: string[];
  totalJobs: number;
  filteredCount: number;
}

export const JobSearchFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  locations,
  employmentTypes,
  experienceLevels,
  totalJobs,
  filteredCount,
}: JobSearchFiltersProps) => {
  const salaryRange = [filters.salaryMin || 0, filters.salaryMax || 200000];

  const handleSalaryChange = (values: number[]) => {
    onFilterChange('salaryMin', values[0] === 0 ? null : values[0]);
    onFilterChange('salaryMax', values[1] === 200000 ? null : values[1]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filtros de Busca
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filteredCount} de {totalJobs} vagas</span>
          {hasActiveFilters && (
            <Badge variant="secondary">
              {Object.entries(filters).filter(([key, value]) => {
                if (key === 'search') return value !== '';
                if (key === 'location') return value !== '';
                if (key === 'employmentType') return value !== '';
                if (key === 'experienceLevel') return value !== '';
                if (key === 'salaryMin' || key === 'salaryMax') return value !== null;
                if (key === 'remoteAllowed') return value !== null;
                return false;
              }).length} filtros ativos
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Pesquisar
          </Label>
          <Input
            placeholder="Título, descrição ou requisitos..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Localização
          </Label>
          <Select
            value={filters.location}
            onValueChange={(value) => onFilterChange('location', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as localizações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as localizações</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Tipo de Contrato
          </Label>
          <Select
            value={filters.employmentType}
            onValueChange={(value) => onFilterChange('employmentType', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {employmentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Nível de Experiência
          </Label>
          <Select
            value={filters.experienceLevel}
            onValueChange={(value) => onFilterChange('experienceLevel', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os níveis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              {experienceLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Salary Range */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Faixa Salarial (R$)
          </Label>
          <div className="px-2">
            <Slider
              min={0}
              max={200000}
              step={1000}
              value={salaryRange}
              onValueChange={handleSalaryChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>R$ {salaryRange[0].toLocaleString()}</span>
              <span>R$ {salaryRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Remote Work */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            Trabalho Remoto
          </Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={filters.remoteAllowed === true}
              onCheckedChange={(checked) => 
                onFilterChange('remoteAllowed', checked ? true : null)
              }
            />
            <span className="text-sm text-muted-foreground">
              {filters.remoteAllowed === true ? 'Apenas remotas' : 'Todas'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};