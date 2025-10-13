
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarCheck, Stethoscope, Bot, HeartPulse, Shield, Clock, Star, ChevronDown } from 'lucide-react-native';

const features = [
  {
    icon: 'Bot',
    color: '#059669',
    title: 'Trò chuyện tư vấn cùng AI',
    description: 'Chat bot hỗ trợ hỏi đáp y tế, giải đáp thắc mắc sức khỏe mọi lúc, mọi nơi.',
  },
  {
    icon: 'HeartPulse',
    color: '#ef4444',
    title: 'Chuẩn đoán tim mạch thông minh',
    description: 'Phân tích chỉ số (huyết áp, cholesterol, nhịp tim) để dự đoán nguy cơ tim mạch.',
  },
  {
    icon: 'CalendarCheck',
    color: '#2563eb',
    title: 'Đặt lịch khám & tư vấn',
    description: 'Đặt lịch khám trực tiếp hoặc tư vấn online với bác sĩ uy tín chỉ trong vài bước.',
  },
];

const stats = [
  { number: '10,000+', label: 'Bệnh nhân tin tưởng', icon: <Stethoscope color="#059669" size={28} /> },
  { number: '50+', label: 'Bác sĩ chuyên khoa', icon: <Shield color="#2563eb" size={28} /> },
  { number: '24/7', label: 'Hỗ trợ liên tục', icon: <Clock color="#f59e42" size={28} /> },
];

const testimonials = [
  {
    name: 'Nguyễn Văn Hùng',
    role: 'Kỹ sư IT',
    feedback: 'Hệ thống rất tiện lợi và hiện đại. Tôi có thể đặt lịch khám chỉ trong 2 phút, rất tiết kiệm thời gian!',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
  },
  {
    name: 'Trần Thị Mai',
    role: 'Giáo viên',
    feedback: 'Hồ sơ bệnh án được lưu trữ an toàn và có thể truy cập mọi lúc. Tôi rất yên tâm khi sử dụng dịch vụ này.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
  },
  {
    name: 'Lê Minh Tuấn',
    role: 'Doanh nhân',
    feedback: 'Chatbot AI rất thông minh, có thể tư vấn sơ bộ và hướng dẫn tôi đến đúng chuyên khoa cần thiết.',
    image: 'https://randomuser.me/api/portraits/men/25.jpg',
    rating: 4,
  },
];

export default function HomeMobileScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>
          Chăm sóc sức khỏe
          <Text style={styles.heroHighlight}> thông minh</Text>
        </Text>
        <Text style={styles.heroDesc}>
          Kết nối bác sĩ, bệnh nhân cho trải nghiệm y tế đỉnh cao với công nghệ hiện đại nhất.
        </Text>
        <Image source={require('../../assets/images/home_banner.png')} style={styles.heroImage} resizeMode="contain" />
        <View style={styles.heroButtonRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/booking')}>
            <CalendarCheck color="#fff" size={20} />
            <Text style={styles.primaryBtnText}>Đặt lịch ngay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/doctors')}>
            <Stethoscope color="#059669" size={20} />
            <Text style={styles.secondaryBtnText}>Tìm bác sĩ</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          {stats.map((stat, idx) => (
            <View key={idx} style={styles.statItem}>
              {stat.icon}
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Đăng nhập/Đăng ký Section */}
      <View style={styles.authSection}>
        <Text style={styles.authPrompt}>Bạn chưa có tài khoản?</Text>
        <View style={styles.authBtnRow}>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerBtnText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tính năng nổi bật</Text>
        <View style={styles.featuresRow}>
          {features.map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              {feature.icon === 'Bot' && <Bot color={feature.color} size={40} style={styles.icon} />}
              {feature.icon === 'HeartPulse' && <HeartPulse color={feature.color} size={40} style={styles.icon} />}
              {feature.icon === 'CalendarCheck' && <CalendarCheck color={feature.color} size={40} style={styles.icon} />}
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phản hồi từ người dùng</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {testimonials.map((t, idx) => (
            <View key={idx} style={styles.testimonialItem}>
              <Image source={{ uri: t.image }} style={styles.testimonialAvatar} />
              <Text style={styles.testimonialName}>{t.name}</Text>
              <Text style={styles.testimonialRole}>{t.role}</Text>
              <View style={styles.starsRow}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} color={i < t.rating ? '#facc15' : '#d1d5db'} size={16} />
                ))}
              </View>
              <Text style={styles.testimonialFeedback} numberOfLines={3}>
                "{t.feedback}"
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    paddingTop: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroHighlight: {
    color: '#059669',
  },
  heroDesc: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroImage: {
    width: 260,
    height: 160,
    marginBottom: 16,
  },
  heroButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#059669',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  secondaryBtnText: {
    color: '#059669',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  authSection: {
    marginTop: 24,
    marginBottom: 8,
    alignItems: 'center',
  },
  authPrompt: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
  },
  authBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  loginBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  registerBtn: {
    borderWidth: 1,
    borderColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  registerBtnText: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: 15,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  featuresRow: {
    flexDirection: 'column',
    gap: 18,
  },
  featureItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  featureTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#059669',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDesc: {
    color: '#374151',
    fontSize: 14,
    textAlign: 'center',
  },
  testimonialItem: {
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    width: 220,
    alignItems: 'center',
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  testimonialName: {
    fontWeight: 'bold',
    color: '#059669',
    fontSize: 15,
    marginBottom: 2,
  },
  testimonialRole: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  testimonialFeedback: {
    color: '#374151',
    fontStyle: 'italic',
    fontSize: 13,
    textAlign: 'center',
  },
  icon: {
    marginBottom: 8,
  },
});
