
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Heart, Activity as ActivityIcon, CheckCircle, AlertTriangle, Info } from 'lucide-react-native';

const initialForm = {
  age: '',
  gender: '',
  chestPainType: '',
  restingBP: '',
  cholesterol: '',
  fastingBS: '',
  restingECG: '',
  maxHR: '',
  exerciseAngina: '',
  oldpeak: '',
  stSlope: '',
  ca: '',
  thal: '',
};

const riskColors = {
  low: '#22c55e',
  medium: '#f59e42',
  high: '#ef4444',
};

const riskLabels = {
  low: 'Nguy cơ thấp',
  medium: 'Nguy cơ trung bình',
  high: 'Nguy cơ cao',
};

const riskIcons = {
  low: <CheckCircle color="#22c55e" size={22} style={{ marginRight: 4 }} />,
  medium: <Info color="#f59e42" size={22} style={{ marginRight: 4 }} />,
  high: <AlertTriangle color="#ef4444" size={22} style={{ marginRight: 4 }} />,
};

export default function DiagnosisScreen() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        riskLevel: 'medium',
        riskPercentage: 42,
        recommendations: ['Tập thể dục thường xuyên', 'Ăn uống lành mạnh'],
        keyFactors: ['Cholesterol cao', 'Tuổi > 50'],
        explanation: 'Chỉ số cholesterol và tuổi là yếu tố chính.',
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header đồng bộ web */}
        <View style={styles.headerWrap}>
          <View style={styles.headerIconRow}>
            <View style={styles.headerIcon}><Heart color="#059669" size={32} /></View>
            <View style={styles.headerIcon}><ActivityIcon color="#059669" size={32} /></View>
          </View>
          <Text style={styles.headerTitle}>Chuẩn đoán thông minh bệnh tim mạch</Text>
          <Text style={styles.headerDesc}>
            Nhập các chỉ số sức khỏe để nhận đánh giá AI về nguy cơ bệnh tim mạch. Hệ thống sử dụng trí tuệ nhân tạo để phân tích và đưa ra khuyến nghị chuyên môn.
          </Text>
        </View>

        {/* Form nhập liệu */}
        <View style={styles.form}>
          <FormInput label="Tuổi" value={form.age} onChangeText={(v: string) => handleChange('age', v)} placeholder="Nhập tuổi..." keyboardType="numeric" />
          <FormInput label="Giới tính" value={form.gender} onChangeText={(v: string) => handleChange('gender', v)} placeholder="Nam/Nữ" />
          <FormInput label="Loại đau ngực" value={form.chestPainType} onChangeText={(v: string) => handleChange('chestPainType', v)} placeholder="Kiểu đau ngực" />
          <FormInput label="Huyết áp nghỉ" value={form.restingBP} onChangeText={(v: string) => handleChange('restingBP', v)} placeholder="mmHg" keyboardType="numeric" />
          <FormInput label="Cholesterol" value={form.cholesterol} onChangeText={(v: string) => handleChange('cholesterol', v)} placeholder="mg/dL" keyboardType="numeric" />
          <FormInput label="Đường huyết lúc đói (FastingBS)" value={form.fastingBS} onChangeText={(v: string) => handleChange('fastingBS', v)} placeholder="0/1" keyboardType="numeric" />
          <FormInput label="Điện tâm đồ nghỉ (RestingECG)" value={form.restingECG} onChangeText={(v: string) => handleChange('restingECG', v)} placeholder="Kiểu điện tâm đồ" />
          <FormInput label="Nhịp tim tối đa" value={form.maxHR} onChangeText={(v: string) => handleChange('maxHR', v)} placeholder="bpm" keyboardType="numeric" />
          <FormInput label="Đau thắt ngực khi gắng sức (ExerciseAngina)" value={form.exerciseAngina} onChangeText={(v: string) => handleChange('exerciseAngina', v)} placeholder="Có/Không" />
          <FormInput label="Oldpeak (ST depression)" value={form.oldpeak} onChangeText={(v: string) => handleChange('oldpeak', v)} placeholder="Giá trị oldpeak" keyboardType="numeric" />
          <FormInput label="Độ dốc ST (ST Slope)" value={form.stSlope} onChangeText={(v: string) => handleChange('stSlope', v)} placeholder="Kiểu slope" />
          <FormInput label="Số lượng mạch vành chính (ca)" value={form.ca} onChangeText={(v: string) => handleChange('ca', v)} placeholder="0-3" keyboardType="numeric" />
          <FormInput label="Thalassemia (thal)" value={form.thal} onChangeText={(v: string) => handleChange('thal', v)} placeholder="Kiểu thal" />
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Dự đoán</Text>}
          </TouchableOpacity>
        </View>

        {/* Kết quả AI */}
        {result && (
          <View style={styles.resultBox}>
            <View style={[styles.riskBadge, { backgroundColor: riskColors[result.riskLevel] + '22' }]}> 
              {riskIcons[result.riskLevel]}
              <Text style={{ color: riskColors[result.riskLevel], fontWeight: 'bold' }}>{riskLabels[result.riskLevel]}</Text>
            </View>
            <Text style={styles.resultPercent}>Xác suất: <Text style={{ fontWeight: 'bold', color: riskColors[result.riskLevel] }}>{result.riskPercentage}%</Text></Text>
            <Text style={styles.resultAdviceTitle}>Khuyến nghị:</Text>
            {result.recommendations.map((rec: string, idx: number) => (
              <Text key={idx} style={styles.resultAdvice}>- {rec}</Text>
            ))}
            <Text style={styles.resultAdviceTitle}>Yếu tố chính:</Text>
            {result.keyFactors.map((f: string, idx: number) => (
              <Text key={idx} style={styles.resultAdvice}>• {f}</Text>
            ))}
            <Text style={styles.resultExplain}>{result.explanation}</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormInput({ label, value, onChangeText, placeholder, keyboardType }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: '#f0fdf4',
    flexGrow: 1,
    alignItems: 'center',
  },
  headerWrap: {
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  headerIconRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  headerIcon: {
    backgroundColor: '#d1fae5',
    borderRadius: 999,
    padding: 8,
    marginHorizontal: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerDesc: {
    color: '#374151',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#059669',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 15,
    color: '#111827',
  },
  submitBtn: {
    backgroundColor: '#059669',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 8,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
    marginTop: 2,
  },
  resultPercent: {
    fontSize: 15,
    marginBottom: 2,
  },
  resultAdviceTitle: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 2,
    color: '#374151',
  },
  resultAdvice: {
    color: '#059669',
    fontSize: 14,
  },
  resultExplain: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
});