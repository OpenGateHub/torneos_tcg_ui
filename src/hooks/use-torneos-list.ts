import { useQuery } from '@tanstack/react-query';
import { TorneosResponse } from '../types/torneo';
import axiosClient from '@/services/axios';
import { QueryKeys } from '@/api/queryKeys';
import { apiUrls } from '@/api/apiUrls';
import { useParams } from 'react-router-dom';

interface UseTorneosListParams {
  page?: number;
  limit?: number;
  leagueId?: number
}

const fetchTorneos = async ({ page = 1, limit = 10, leagueId }: UseTorneosListParams) => {
  const { data } = await axiosClient.get<TorneosResponse>(`${apiUrls.tournaments.base}/?page=${page}&limit=${limit}&league=${leagueId}`);
  return data;
};

export const useTorneosList = (params: UseTorneosListParams = {}) => {
  const { id } = useParams()
  return useQuery({
    queryKey: [QueryKeys.TOURNAMENTS_LIST],
    queryFn: () => fetchTorneos({
      ...params,
      leagueId: Number(id)
    }),
    keepPreviousData: true, // Mantiene los datos anteriores mientras se cargan los nuevos
    staleTime: 5 * 60 * 1000, // Considera los datos frescos por 5 minutos
  });
};