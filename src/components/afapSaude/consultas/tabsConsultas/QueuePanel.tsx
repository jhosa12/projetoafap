
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, SkipForward, Play, Pause } from "lucide-react";
import { useState } from "react";

interface QueuePanelProps {
  onCallNext: () => void;
  currentNumber: number | null;
  queueLength: number;
}

export function QueuePanel({ onCallNext, currentNumber, queueLength }: QueuePanelProps) {
  const [isAutoCall, setIsAutoCall] = useState(false);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-blue-600" />
          Painel de Chamadas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Number Display */}
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 mb-2">Chamando Agora</p>
          <div className="text-3xl font-bold text-blue-700">
            {currentNumber ? `${currentNumber.toString().padStart(3, '0')}` : '---'}
          </div>
          <p className="text-sm text-gray-600 mt-2">Senha Atual</p>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{queueLength}</p>
            <p className="text-sm text-gray-600">Na Fila</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-xl font-bold text-green-700">
              {currentNumber ? Math.max(0, queueLength - 1) : queueLength}
            </p>
            <p className="text-sm text-green-600">Restantes</p>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <Button 
            onClick={onCallNext}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={queueLength === 0}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Chamar Próximo
          </Button>
          
          {/* <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAutoCall(!isAutoCall)}
              className="flex-1"
            >
              {isAutoCall ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isAutoCall ? 'Pausar' : 'Auto'} Chamada
            </Button>
            
            <Button variant="outline" className="flex-1">
              <SkipForward className="w-4 h-4 mr-2" />
              Pular
            </Button>
          </div> */}
        </div>

        {/* Status */}
        {/* <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <Badge className={queueLength > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
              {queueLength > 0 ? 'Ativo' : 'Aguardando'}
            </Badge>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}