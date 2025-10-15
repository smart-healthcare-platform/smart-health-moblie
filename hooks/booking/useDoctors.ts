import { useState, useEffect, useCallback } from 'react';
import { doctorService } from '@/src/services/doctor.service';
import { Doctor } from '@/src/types';
import useDebounce from '@/hooks/useDebounce';

interface UseDoctorsReturn {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  search: string;
  setSearch: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  total: number;
  totalPages: number;
  refetch: () => void;
}

export function useDoctors(limit = 6): UseDoctorsReturn {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const debouncedSearch = useDebounce(search, 500);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await doctorService.getPublicDoctors(
        currentPage,
        limit,
        debouncedSearch.trim()
      );
      setDoctors(res.data || []);
      setTotal(res.total || 0);
    } catch (err: any) {
      console.error('Failed to fetch doctors:', err);
      setError(err.message || 'Không thể tải danh sách bác sĩ. Vui lòng thử lại.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, currentPage, limit]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Reset page khi search thay đổi
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearch]);

  return {
    doctors,
    loading,
    error,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    total,
    totalPages: Math.ceil(total / limit),
    refetch: fetchDoctors,
  };
}
