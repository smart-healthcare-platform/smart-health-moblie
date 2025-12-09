import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  User,
  HeartPulse,
  Search,
  Filter,
  X,
  Eye,
  MessageCircle,
  DollarSign,
} from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { RootState, AppDispatch } from '../src/redux';
import { appointmentService } from '../src/services/appointment.service';
import { createConversation } from '../src/services/chat.service';
import { Appointment, AppointmentResponse } from '../src/types';
import { AppointmentStatus } from '../src/types/appointment-enums';
import useDebounce from '../hooks/useDebounce';
import { setSelectedConversationId, fetchConversations } from '../src/redux/slices/chatSlice';
import {
  getStatusConfig,
  getPaymentStatusLabel,
  getPaymentStatusColor,
  formatAppointmentDateTime,
  canStartChat,
} from '../src/lib/appointmentHelpers';

export default function AppointmentHistoryScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { conversations } = useSelector((state: RootState) => state.chat);

  const [apiData, setApiData] = useState<AppointmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const limit = 10;
  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedSearchRef = useRef(filters.search);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    if (!user?.referenceId) return;

    try {
      setLoading(true);
      const data = await appointmentService.getByPatientId(
        user.referenceId,
        currentPage,
        limit,
        debouncedSearch,
        filters.status as any,
        filters.dateRange as any
      );
      setApiData(data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setApiData(null);
    } finally {
      setLoading(false);
      setIsSearching(false);
      setRefreshing(false);
    }
  }, [user?.referenceId, currentPage, debouncedSearch, filters.status, filters.dateRange]);

  useEffect(() => {
    if (debouncedSearchRef.current !== debouncedSearch) {
      debouncedSearchRef.current = debouncedSearch;
      setCurrentPage(1);
    }
    fetchAppointments();
  }, [fetchAppointments, debouncedSearch]);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchAppointments();
  };

  // Stats
  const stats = {
    total: apiData?.total || 0,
    completed: apiData?.appointments.filter((a) => a.status === AppointmentStatus.COMPLETED).length || 0,
    confirmed: apiData?.appointments.filter((a) => a.status === AppointmentStatus.CONFIRMED).length || 0,
    cancelled: apiData?.appointments.filter((a) => a.status === AppointmentStatus.CANCELLED).length || 0,
  };



  // Handle search
  const handleSearchChange = (text: string) => {
    setFilters((prev) => ({ ...prev, search: text }));
    setIsSearching(true);
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ status: 'all', dateRange: 'all', search: '' });
    setCurrentPage(1);
  };

  // View detail
  const handleViewDetail = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailModalVisible(true);
  };

  // Start chat with doctor
  const handleStartChat = async (appointment: Appointment) => {
    if (!user?.id || !appointment.doctorId) {
      Alert.alert('Lỗi', 'Không thể bắt đầu cuộc trò chuyện');
      return;
    }

    try {
      // Find existing conversation with this doctor
      // Note: participant.id represents the userId of the participant
      const existingConversation = conversations.find((conv) =>
        conv.participants.some(
          (p) => p.id === appointment.doctorId && p.role === 'doctor'
        )
      );

      if (existingConversation) {
        // Navigate to existing conversation
        console.log('✅ Found existing conversation:', existingConversation.id);
        dispatch(setSelectedConversationId(existingConversation.id));
        router.push(`/chat-detail/${existingConversation.id}`);
      } else {
        // Create new conversation (or get existing one)
        console.log('🆕 Creating new conversation with doctor:', appointment.doctorId);
        console.log('🔑 User ID:', user.id);
        console.log('🔑 User role:', user.role);
        
        const conversationResult = await createConversation({
          recipientId: appointment.doctorId,
          recipientRole: 'doctor',
        });

        console.log('📦 Conversation result:', conversationResult);
        console.log('🆔 Conversation ID:', conversationResult?.id);

        // Validate response
        if (!conversationResult || !conversationResult.id) {
          console.error('❌ Invalid conversation result:', conversationResult);
          throw new Error('Invalid conversation response: missing conversation ID');
        }

        // Important: Reload conversations to sync with backend
        // (Backend may have returned existing conversation or created new one)
        console.log('🔄 Reloading conversations to sync state...');
        await dispatch(fetchConversations()).unwrap();
        console.log('✅ Conversations reloaded successfully');

        // Set selected conversation and navigate
        dispatch(setSelectedConversationId(conversationResult.id));
        console.log('🚀 Navigating to chat detail:', conversationResult.id);
        router.push(`/chat-detail/${conversationResult.id}`);
      }
    } catch (error: any) {
      console.error('❌ Failed to start chat:', error);
      console.error('❌ Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Không thể tạo cuộc trò chuyện';
      Alert.alert('Lỗi', `${errorMessage}. Vui lòng thử lại.`);
    }
  };

  // Render appointment card
  const renderAppointment = ({ item }: { item: Appointment }) => {
    const statusConfig = getStatusConfig(item.status);
    const { date: formattedDate, time: formattedTime } = formatAppointmentDateTime(item.startAt);

    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => handleViewDetail(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}20` }]}>
            <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <Text style={styles.doctorName}>BS. {item.doctorName}</Text>

        <View style={styles.cardInfo}>
          <View style={styles.infoRow}>
            <Calendar size={16} color="#6b7280" />
            <Text style={styles.infoText}>{formattedDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={16} color="#6b7280" />
            <Text style={styles.infoText}>{formattedTime}</Text>
          </View>
          {item.paymentStatus && (
            <View style={styles.infoRow}>
              <DollarSign size={16} color={getPaymentStatusColor(item.paymentStatus)} />
              <Text style={[styles.infoText, { color: getPaymentStatusColor(item.paymentStatus) }]}>
                {getPaymentStatusLabel(item.paymentStatus)}
              </Text>
            </View>
          )}
        </View>

        {canStartChat(item.status) && (
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleViewDetail(item);
              }}
            >
              <Eye size={16} color="#10b981" />
              <Text style={styles.actionButtonText}>Chi tiết</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleStartChat(item);
              }}
            >
              <MessageCircle size={16} color="#3b82f6" />
              <Text style={styles.actionButtonText}>Nhắn tin</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render empty
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Calendar size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>Không có lịch hẹn nào</Text>
      <Text style={styles.emptyText}>
        Chưa có lịch hẹn nào phù hợp với bộ lọc hiện tại
      </Text>
    </View>
  );

  // Render list header
  const renderHeader = () => (
    <>
      {/* Stats */}
      <View style={styles.statsGrid}>
        <LinearGradient colors={['#10b981', '#059669']} style={styles.statCard}>
          <Calendar size={24} color="rgba(255,255,255,0.8)" />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Tổng số lượt</Text>
        </LinearGradient>

        <LinearGradient colors={['#10b981', '#059669']} style={styles.statCard}>
          <CheckCircle size={24} color="rgba(255,255,255,0.8)" />
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Hoàn thành</Text>
        </LinearGradient>

        <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.statCard}>
          <Clock size={24} color="rgba(255,255,255,0.8)" />
          <Text style={styles.statValue}>{stats.confirmed}</Text>
          <Text style={styles.statLabel}>Đã xác nhận</Text>
        </LinearGradient>

        <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.statCard}>
          <XCircle size={24} color="rgba(255,255,255,0.8)" />
          <Text style={styles.statValue}>{stats.cancelled}</Text>
          <Text style={styles.statLabel}>Đã hủy</Text>
        </LinearGradient>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={isSearching ? 'Đang tìm kiếm...' : 'Tìm kiếm theo tên bác sĩ...'}
          value={filters.search}
          onChangeText={handleSearchChange}
          placeholderTextColor="#9ca3af"
        />
        {isSearching && (
          <ActivityIndicator size="small" color="#10b981" style={styles.searchLoader} />
        )}
        {filters.search.length > 0 && !isSearching && (
          <TouchableOpacity onPress={() => handleSearchChange('')} style={styles.clearIcon}>
            <X size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Toggle */}
      <TouchableOpacity
        style={styles.filterToggle}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Filter size={18} color="#10b981" />
        <Text style={styles.filterToggleText}>Bộ lọc</Text>
        <Text style={styles.filterToggleIcon}>{showFilters ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Trạng thái</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={filters.status}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, status: value }));
                  setCurrentPage(1);
                }}
                style={styles.picker}
              >
                <Picker.Item label="Tất cả" value="all" />
                <Picker.Item label="Đã hoàn thành" value="completed" />
                <Picker.Item label="Đã xác nhận" value="confirmed" />
                <Picker.Item label="Chờ xác nhận" value="pending" />
                <Picker.Item label="Đã hủy" value="cancelled" />
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Thời gian</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={filters.dateRange}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, dateRange: value }));
                  setCurrentPage(1);
                }}
                style={styles.picker}
              >
                <Picker.Item label="Tất cả" value="all" />
                <Picker.Item label="Hôm nay" value="today" />
                <Picker.Item label="Tuần này" value="week" />
                <Picker.Item label="Tháng này" value="month" />
                <Picker.Item label="Năm này" value="year" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Danh sách lịch hẹn</Text>
        <Text style={styles.listCount}>
          {apiData?.appointments.length || 0} / {stats.total}
        </Text>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#10b981', '#059669']} style={styles.header}>
        <Text style={styles.headerTitle}>Lịch sử khám bệnh</Text>
        <Text style={styles.headerSubtitle}>
          Theo dõi và quản lý lịch hẹn của bạn
        </Text>
      </LinearGradient>

      {/* List */}
      <FlatList
        data={apiData?.appointments || []}
        keyExtractor={(item) => item.id}
        renderItem={renderAppointment}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmpty : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
        }
      />

      {/* Loading */}
      {loading && !refreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      )}

      {/* Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedAppointment && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Chi tiết lịch hẹn</Text>
                    <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                      <X size={24} color="#6b7280" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Thông tin bác sĩ</Text>
                    <Text style={styles.modalDoctorName}>{selectedAppointment.doctorName}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Thời gian</Text>
                    <View style={styles.modalInfoRow}>
                      <Calendar size={16} color="#6b7280" />
                      <Text style={styles.modalInfoText}>
                        {formatAppointmentDateTime(selectedAppointment.startAt).date}
                      </Text>
                    </View>
                    <View style={styles.modalInfoRow}>
                      <Clock size={16} color="#6b7280" />
                      <Text style={styles.modalInfoText}>
                        {formatAppointmentDateTime(selectedAppointment.startAt).time}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Trạng thái</Text>
                    <View
                      style={[
                        styles.modalStatusBadge,
                        { backgroundColor: getStatusConfig(selectedAppointment.status).color },
                      ]}
                    >
                      <Text style={styles.modalStatusText}>
                        {getStatusConfig(selectedAppointment.status).label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Loại dịch vụ</Text>
                    <Text style={styles.modalInfoText}>{selectedAppointment.type}</Text>
                  </View>

                  {selectedAppointment.notes && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Ghi chú</Text>
                      <Text style={styles.modalInfoText}>{selectedAppointment.notes}</Text>
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setDetailModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  searchLoader: {
    marginLeft: 8,
  },
  clearIcon: {
    padding: 4,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  filterToggleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#10b981',
  },
  filterToggleIcon: {
    fontSize: 12,
    color: '#10b981',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  clearFiltersButton: {
    backgroundColor: '#fef3c7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  listCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  typeBadge: {
    backgroundColor: '#eff6ff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  doctorName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  cardInfo: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  modalDoctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalInfoText: {
    fontSize: 15,
    color: '#374151',
  },
  modalStatusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  modalCloseButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
