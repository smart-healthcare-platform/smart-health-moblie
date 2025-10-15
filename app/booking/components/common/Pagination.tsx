import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (canGoPrevious && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null; // Không hiển thị nếu chỉ có 1 trang
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          !canGoPrevious && styles.buttonDisabled,
        ]}
        onPress={handlePrevious}
        disabled={!canGoPrevious || loading}
      >
        <ChevronLeft
          size={20}
          color={canGoPrevious && !loading ? '#10b981' : '#9ca3af'}
        />
        <Text
          style={[
            styles.buttonText,
            !canGoPrevious && styles.buttonTextDisabled,
          ]}
        >
          Trước
        </Text>
      </TouchableOpacity>

      <View style={styles.pageInfo}>
        <Text style={styles.pageText}>
          Trang <Text style={styles.pageNumber}>{currentPage}</Text> /{' '}
          {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          !canGoNext && styles.buttonDisabled,
        ]}
        onPress={handleNext}
        disabled={!canGoNext || loading}
      >
        <Text
          style={[
            styles.buttonText,
            !canGoNext && styles.buttonTextDisabled,
          ]}
        >
          Sau
        </Text>
        <ChevronRight
          size={20}
          color={canGoNext && !loading ? '#10b981' : '#9ca3af'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
    backgroundColor: '#fff',
  },
  buttonDisabled: {
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  buttonTextDisabled: {
    color: '#9ca3af',
  },
  pageInfo: {
    paddingHorizontal: 12,
  },
  pageText: {
    fontSize: 14,
    color: '#6b7280',
  },
  pageNumber: {
    fontWeight: '700',
    color: '#10b981',
    fontSize: 16,
  },
});
