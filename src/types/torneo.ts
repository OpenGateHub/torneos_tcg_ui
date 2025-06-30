export interface Torneo {
  id: number;
  nombre: string;
  description: string;
  fecha_inicio: string;
  fecha_fin: string;
  tipo: string
  estado: string
  descripcion: string
  participantes : number
  maxParticipantes: number
  playoff : number
  inscripcionesCerradas : boolean
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    count: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: string | null;
    previousPage: string | null;
    firstPage: string;
    lastPage: string;
  };
}

export type TorneosResponse = PaginatedResponse<Torneo>;

