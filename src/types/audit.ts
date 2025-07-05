

export interface AuditLog {
    id: string;
    action: string;
    model: string;
    modelId: string;
    changes: {newState: any, previousState: any};
    timestamp: string;
    userName: string;
    ip: string;
    hostname: string;
    descricao: string;
    search: string;
}