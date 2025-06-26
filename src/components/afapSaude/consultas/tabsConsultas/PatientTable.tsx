import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const patients = [
  {
    id: "235",
    name: "Jorge Luiz da Silva",
    password: "NOF01",
    doctor: "02",
    specialty: "Cardiologista",
    status: "confirmed"
  },
  {
    id: "100",
    name: "Luiz Antonio da Silva",
    password: "",
    doctor: "01",
    specialty: "Cardiologista",
    status: "waiting"
  },
  {
    id: "110",
    name: "Maria Santos",
    password: "",
    doctor: "01",
    specialty: "Cardiologista",
    status: "in-progress"
  },
  {
    id: "200",
    name: "Ana Costa",
    password: "",
    doctor: "01",
    specialty: "Cardiologista",
    status: "confirmed"
  },
  {
    id: "524",
    name: "Pedro Oliveira",
    password: "",
    doctor: "01",
    specialty: "Cardiologista",
    status: "waiting"
  },
  {
    id: "253",
    name: "Carla Fernandes",
    password: "",
    doctor: "01",
    specialty: "Cardiologista",
    status: "confirmed"
  },
  {
    id: "147",
    name: "Roberto Silva",
    password: "",
    doctor: "01",
    specialty: "Cardiologista",
    status: "in-progress"
  },
  {
    id: "010",
    name: "Fernanda Lima",
    password: "",
    doctor: "01",
    specialty: "Cardiologista",
    status: "waiting"
  }
];

interface PatientTableProps {
  searchTerm: string;
  onPatientSelect: (patient: any) => void;
  selectedPatient: any;
}

export function PatientTable({ searchTerm, onPatientSelect, selectedPatient }: PatientTableProps) {
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "waiting":
        return "Aguardando";
      case "in-progress":
        return "Em Atendimento";
      default:
        return "Pendente";
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full uppercase">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-3 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-3 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Médico
              </th>
              <th className="px-3 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y text-[10px] divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedPatient?.id === patient.id ? "bg-blue-50" : ""
                }`}
                onClick={() => onPatientSelect(patient)}
              >
                <td className="px-3 py-1 whitespace-nowrap  font-medium text-gray-900">
                  {patient.id}
                </td>
                <td className="px-3 py-1 whitespace-nowrap">
                  <div>
                    <div className=" font-medium text-gray-900">{patient.name}</div>
                    <div className=" text-gray-500">{patient.specialty}</div>
                  </div>
                </td>
                <td className="px-3 py-1 whitespace-nowrap  text-gray-900">
                  Dr. {patient.doctor}
                </td>
                <td className="px-3 py-1 whitespace-nowrap">
                  <Badge className={`${getStatusColor(patient.status)} text-[10px]`}>
                    {getStatusText(patient.status)}
                  </Badge>
                </td>
                <td className="px-3 py-1 whitespace-nowrap  font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPatientSelect(patient);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
