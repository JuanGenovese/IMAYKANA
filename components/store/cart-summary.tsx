import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  buyUrl: string;
  onLimpiar: () => void;
  disabled?: boolean;
}

export function CartSummary({ buyUrl, onLimpiar, disabled = false }: CartSummaryProps) {
  return (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <CardContent className="space-y-4 px-6 py-6">
          <div className="text-sm font-semibold">Resumen</div>
          <Separator />

          <Button asChild className="w-full" disabled={disabled}>
            <a href={disabled ? undefined : buyUrl} target="_blank" rel="noreferrer">
              Consultar por WhatsApp
            </a>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onLimpiar}
            disabled={disabled}
          >
            Vaciar carrito
          </Button>

          <p className="text-xs text-muted-foreground">
            El botón abre WhatsApp con un mensaje automático detallando tu
            selección.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
