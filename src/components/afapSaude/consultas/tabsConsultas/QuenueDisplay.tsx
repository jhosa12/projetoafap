
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface QueueItem {
  id: string;
  name: string;
  queueNumber: number;
  estimatedTime: string;
  priority: 'normal' | 'priority' | 'urgent';
}

interface QueueDisplayProps {
  queueItems: QueueItem[];
  currentNumber: number | null;
}

export function QueueDisplay({ queueItems, currentNumber }: QueueDisplayProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'priority':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgente';
      case 'priority':
        return 'Prioritário';
      default:
        return 'Normal';
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Fila de Atendimento
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-800">
            {queueItems.length} na fila
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {queueItems.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum paciente na fila</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {queueItems.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-colors ${
                  item.queueNumber === currentNumber
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-700">
                        {item.queueNumber.toString().padStart(3, '0')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>~{item.estimatedTime}</span>
                        <span>•</span>
                        <span>Posição: {index + 1}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(item.priority)}>
                    {getPriorityText(item.priority)}
                  </Badge>
                </div>
                {item.queueNumber === currentNumber && (
                  <div className="mt-2 text-sm font-medium text-blue-600">
                    🔔 Sendo chamado agora
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}