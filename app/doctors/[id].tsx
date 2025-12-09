import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  HeartPulse,
  Shield,
  Star,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  GraduationCap,
  User,
  ArrowLeft,
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { doctorService } from '../../src/services/doctor.service';
import { setDoctor } from '../../src/redux/slices/bookingSlice';
import { DoctorDetail } from '../../src/types';

const dayTranslations: { [key: string]: string } = {
  mon: 'Thứ 2',
  tue: 'Thứ 3',
  wed: 'Thứ 4',
  thu: 'Thứ 5',
  fri: 'Thứ 6',
  sat: 'Thứ 7',
  sun: 'Chủ nhật',
};

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const [doctorDetail, setDoctorDetail] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    doctorService
      .getDoctorById(id)
      .then(setDoctorDetail)
      .catch((err) => {
        console.error('Failed to fetch doctor detail:', err);
        setError(err.message || 'Không thể tải thông tin bác sĩ');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const calculateAverageRating = (ratings: DoctorDetail['ratings']) => {
    if (ratings.length === 0) return '0.0';
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const formatDate = (dateInput: string | Date | null) => {
    if (!dateInput) return '—';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.length >= 10) {
      return phone.substring(0, 3) + '****' + phone.substring(7);
    }
    return phone;
  };

  const handleBooking = () => {
    if (!doctorDetail) return;
    
    dispatch(setDoctor(doctorDetail));
    router.push('/booking');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (error || !doctorDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
        <Text style={styles.errorText}>{error || 'Không tìm thấy thông tin bác sĩ'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const degrees = doctorDetail.certificates.filter((cert) => cert.type === 'degree');
  const licenses = doctorDetail.certificates.filter((cert) => cert.type === 'license');
  const avgRating = calculateAverageRating(doctorDetail.ratings);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin bác sĩ</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Doctor Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.doctorHeader}>
            {doctorDetail.avatar ? (
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: doctorDetail.avatar }} style={styles.avatar} />
                <View style={styles.verifiedBadge}>
                  <CheckCircle size={18} color="#10b981" />
                </View>
              </View>
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={40} color="#2563eb" />
              </View>
            )}

            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctorDetail.display_name}</Text>
              <View style={styles.specialtyBadge}>
                <HeartPulse size={14} color="#fff" />
                <Text style={styles.specialtyText}>{doctorDetail.specialty}</Text>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Star size={14} color="#facc15" />
                  <Text style={styles.statText}>
                    {avgRating} ({doctorDetail.ratings.length})
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Calendar size={14} color="#059669" />
                  <Text style={styles.statText}>{doctorDetail.experience_years} năm KN</Text>
                </View>
              </View>
            </View>
          </View>

          {doctorDetail.bio && (
            <Text style={styles.bio}>{doctorDetail.bio}</Text>
          )}

          {/* Book Button */}
          <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
            <Calendar size={20} color="#fff" />
            <Text style={styles.bookButtonText}>Đặt lịch khám</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <Phone size={18} color="#2563eb" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Điện thoại</Text>
                <Text style={styles.contactValue}>{formatPhoneNumber(doctorDetail.phone)}</Text>
              </View>
            </View>
            <View style={styles.contactItem}>
              <Mail size={18} color="#2563eb" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue} numberOfLines={1}>{doctorDetail.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Degrees & Licenses */}
        {(degrees.length > 0 || licenses.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Học vị & Giấy phép</Text>

            {degrees.length > 0 && (
              <>
                <Text style={styles.subsectionTitle}>Học vị</Text>
                {degrees.map((degree) => (
                  <View key={degree.id} style={styles.certCard}>
                    <View style={styles.certHeader}>
                      <GraduationCap size={16} color="#2563eb" />
                      <Text style={styles.certTitle}>{degree.title}</Text>
                    </View>
                    {degree.field && <Text style={styles.certField}>{degree.field}</Text>}
                    <View style={styles.certFooter}>
                      {degree.graduation_year && (
                        <View style={styles.yearBadge}>
                          <Text style={styles.yearText}>{degree.graduation_year}</Text>
                        </View>
                      )}
                      {degree.certificate_file && (
                        <View style={styles.verifiedTag}>
                          <CheckCircle size={12} color="#10b981" />
                          <Text style={styles.verifiedText}>Đã xác minh</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </>
            )}

            {licenses.length > 0 && (
              <>
                <Text style={[styles.subsectionTitle, { marginTop: 16 }]}>Giấy phép hành nghề</Text>
                {licenses.map((license) => (
                  <View key={license.id} style={styles.certCard}>
                    <View style={styles.certHeader}>
                      <Shield size={16} color="#10b981" />
                      <Text style={styles.certTitle}>{license.title}</Text>
                    </View>
                    <Text style={styles.certDate}>Cấp ngày: {formatDate(license.issued_date)}</Text>
                    <Text style={styles.certDate}>Hết hạn: {formatDate(license.expiry_date)}</Text>
                    {license.certificate_file && (
                      <View style={styles.verifiedTag}>
                        <CheckCircle size={12} color="#10b981" />
                        <Text style={styles.verifiedText}>Đã xác minh</Text>
                      </View>
                    )}
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* Schedule */}
        {doctorDetail.availabilities && doctorDetail.availabilities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lịch làm việc</Text>
            {doctorDetail.availabilities.map((availability) => (
              <View key={availability.id} style={styles.scheduleItem}>
                <Text style={styles.scheduleDay}>
                  {dayTranslations[availability.day_of_week] || availability.day_of_week}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Ratings */}
        {doctorDetail.ratings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đánh giá từ bệnh nhân</Text>
            {doctorDetail.ratings.slice(0, 5).map((rating) => (
              <View key={rating.id} style={styles.ratingCard}>
                <View style={styles.ratingHeader}>
                  <View style={styles.ratingStars}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        color={i < rating.rating ? '#facc15' : '#d1d5db'}
                        fill={i < rating.rating ? '#facc15' : 'transparent'}
                      />
                    ))}
                    <Text style={styles.ratingValue}>{rating.rating}/5</Text>
                  </View>
                  <Text style={styles.ratingDate}>{formatDate(rating.created_at)}</Text>
                </View>
                {rating.comment && <Text style={styles.ratingComment}>{rating.comment}</Text>}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#e0e7ff',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  specialtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
    gap: 4,
  },
  specialtyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  bio: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  contactRow: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  certCard: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  certHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  certTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  certField: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  certDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  certFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  yearBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  scheduleItem: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  scheduleDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  ratingCard: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  ratingDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  ratingComment: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
