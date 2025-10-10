import { Badge } from "@/components/ui/badge"
import { CheckCircle2Icon, AlertTriangle, Loader2 } from 'lucide-react';

interface DomainStatusBadgeProps {
  status: string;
  isLoading: boolean;
  isDeleting?: boolean;
}

export function DomainStatusBadge({ status, isLoading, isDeleting }: DomainStatusBadgeProps) {
  if (isDeleting) {
    return (
      <Badge className="w-fit font-medium bg-destructive/10 text-destructive hover:bg-destructive/10">
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        Wird gelöscht...
      </Badge>
    );
  }

  if (isLoading) {
    return (
      <Badge className="w-fit font-medium bg-muted text-muted-foreground hover:bg-muted">
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        Überprüfe Status...
      </Badge>
    );
  }

  const isVerified = status === 'verified';
  return (
    <Badge
      className={`w-fit font-medium ${
        isVerified
          ? 'text-primary bg-primary/10 hover:bg-primary/10'
          : 'text-destructive bg-destructive/10 hover:bg-destructive/10'
      }`}
    >
      {isVerified ? (
        <CheckCircle2Icon className="w-3 h-3 mr-1" />
      ) : (
        <AlertTriangle className="w-3 h-3 mr-1" />
      )}
      {isVerified ? 'Korrekt konfiguriert' : 'Verifizierung notwendig'}
    </Badge>
  );
} 