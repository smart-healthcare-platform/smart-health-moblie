
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { Heart, Activity as ActivityIcon, CheckCircle, AlertTriangle, Info } from 'lucide-react-native';
import { diagnosisService } from '../../src/services/diagnosis.service';
import { LinearGradient } from 'expo-linear-gradient';

// Options mirrored from website route.ts mapping and form
const genderOptions = [
  { label: 'Nam', value: 'M' },
  { label: 'Nữ', value: 'F' },
];
const chestPainTypeOptions = [
  { label: 'Đau ngực điển hình', value: '0' },
  { label: 'Đau ngực không điển hình', value: '1' },
  { label: 'Đau không do tim', value: '2' },
  { label: 'Không có triệu chứng', value: '3' },
];
const restingECGOptions = [
  { label: 'Bình thường', value: 'Normal' },
  { label: 'Bất thường ST-T', value: 'ST' },
  { label: 'Phì đại thất trái', value: 'LVH' },
];
const exerciseAnginaOptions = [
  { label: 'Có', value: 'Y' },
  { label: 'Không', value: 'N' },
];
const stSlopeOptions = [
  { label: 'Tăng', value: '0' },
  { label: 'Phẳng', value: '1' },
  { label: 'Giảm', value: '2' },
];
const caOptions = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
];
const thalOptions = [
  { label: 'Không có', value: '0' },
  { label: 'Bình thường', value: '1' },
  { label: 'Khiếm khuyết cố định', value: '2' },
  { label: 'Khiếm khuyết có thể đảo ngược', value: '3' },
];

const fastingBSOptions = [
  { label: '< 120 mg/dl', value: '0' },
  { label: '> 120 mg/dl', value: '1' },
];

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

// Form state
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

type DiagnosisResult = {
  riskLevel: 'low' | 'medium' | 'high';
  riskPercentage: number;
  recommendations: string[];
  keyFactors: string[];
  explanation: string;
};

export default function DiagnosisScreen() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHelper, setShowHelper] = useState(false);

  const handleChange = (key: keyof typeof initialForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(initialForm);
    setResult(null);
    setError(null);
  };

  const isValid = useMemo(() => {
    // All fields required similar to website form (required attributes)
    return Object.values(form).every((v) => v !== '' && v !== null && v !== undefined);
  }, [form]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await diagnosisService.predict({
        age: form.age as string,
        gender: form.gender as 'M' | 'F',
        chestPainType: form.chestPainType as '0' | '1' | '2' | '3',
        restingBP: form.restingBP as string,
        cholesterol: form.cholesterol as string,
        fastingBS: form.fastingBS as '0' | '1',
        restingECG: form.restingECG as 'Normal' | 'ST' | 'LVH',
        maxHR: form.maxHR as string,
        exerciseAngina: form.exerciseAngina as 'Y' | 'N',
        oldpeak: form.oldpeak as string,
        stSlope: form.stSlope as '0' | '1' | '2',
        ca: form.ca as '0' | '1' | '2' | '3',
        thal: form.thal as '0' | '1' | '2' | '3',
      });
      setResult(data);
    } catch (e) {
      setError('Không thể phân tích. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header (gradient like website) */}
        <LinearGradient colors={["#d1fae5", "#eef2ff"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerGradient}>
          <View style={styles.headerWrap}>
            <View style={styles.headerIconRow}>
              <View style={styles.headerIcon}>
                <Heart color="#059669" size={28} />
              </View>
              <View style={styles.headerIcon}>
                <ActivityIcon color="#059669" size={28} />
              </View>
            </View>
            <Text style={styles.headerTitle}>Chuẩn đoán thông minh bệnh tim mạch</Text>
            <Text style={styles.headerDesc}>
              Nhập các chỉ số sức khỏe của bạn để nhận đánh giá AI và khuyến nghị chuyên môn.
            </Text>
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={styles.formCard}>
          <View style={styles.formCardHeader}>
            <View style={styles.formCardHeaderIcon}><Heart color="#fff" size={16} /></View>
            <Text style={styles.formCardHeaderText}>Nhập thông tin sức khỏe</Text>
          </View>
          <FormInput
            label="Tuổi"
            value={form.age}
            onChangeText={(v: string) => handleChange('age', v)}
            placeholder="Nhập tuổi..."
            keyboardType="numeric"
          />
          <FormPicker
            label="Giới tính"
            selectedValue={form.gender}
            onValueChange={(v: string) => handleChange('gender', v)}
            options={genderOptions}
          />
          <FormPicker
            label="Loại đau ngực"
            selectedValue={form.chestPainType}
            onValueChange={(v: string) => handleChange('chestPainType', v)}
            options={chestPainTypeOptions}
          />
          <FormInput
            label="Huyết áp nghỉ"
            value={form.restingBP}
            onChangeText={(v: string) => handleChange('restingBP', v)}
            placeholder="mmHg"
            keyboardType="numeric"
          />
          <FormInput
            label="Cholesterol"
            value={form.cholesterol}
            onChangeText={(v: string) => handleChange('cholesterol', v)}
            placeholder="mg/dL"
            keyboardType="numeric"
          />
          <FormPicker
            label="Đường huyết lúc đói (FastingBS)"
            selectedValue={form.fastingBS}
            onValueChange={(v: string) => handleChange('fastingBS', v)}
            options={fastingBSOptions}
          />
          <FormPicker
            label="Điện tâm đồ nghỉ (RestingECG)"
            selectedValue={form.restingECG}
            onValueChange={(v: string) => handleChange('restingECG', v)}
            options={restingECGOptions}
          />
          <FormInput
            label="Nhịp tim tối đa"
            value={form.maxHR}
            onChangeText={(v: string) => handleChange('maxHR', v)}
            placeholder="bpm"
            keyboardType="numeric"
          />
          <FormPicker
            label="Đau thắt ngực khi gắng sức (ExerciseAngina)"
            selectedValue={form.exerciseAngina}
            onValueChange={(v: string) => handleChange('exerciseAngina', v)}
            options={exerciseAnginaOptions}
          />
          <FormInput
            label="Oldpeak (ST depression)"
            value={form.oldpeak}
            onChangeText={(v: string) => handleChange('oldpeak', v)}
            placeholder="Giá trị oldpeak"
            keyboardType="numeric"
          />
          <FormPicker
            label="Độ dốc ST (ST Slope)"
            selectedValue={form.stSlope}
            onValueChange={(v: string) => handleChange('stSlope', v)}
            options={stSlopeOptions}
          />
          <FormPicker
            label="Số lượng mạch vành chính (ca)"
            selectedValue={form.ca}
            onValueChange={(v: string) => handleChange('ca', v)}
            options={caOptions}
          />
          <FormPicker
            label="Thalassemia (thal)"
            selectedValue={form.thal}
            onValueChange={(v: string) => handleChange('thal', v)}
            options={thalOptions}
          />
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, !isValid || loading ? styles.btnDisabled : null]} onPress={handleSubmit} disabled={!isValid || loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionBtnText}>Phân tích nguy cơ tim mạch</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetBtn} onPress={resetForm} disabled={loading}>
              <Text style={styles.resetBtnText}>Làm mới</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Result */}
        {result && (
          <View style={styles.resultBox}>
            <View style={[styles.riskBadge, { backgroundColor: riskColors[result.riskLevel] + '22' }]}>
              {riskIcons[result.riskLevel]}
              <Text style={{ color: riskColors[result.riskLevel], fontWeight: 'bold' }}>
                {riskLabels[result.riskLevel]}
              </Text>
            </View>
            <Text style={styles.resultPercent}>
              Xác suất: <Text style={{ fontWeight: 'bold', color: riskColors[result.riskLevel] }}>{result.riskPercentage}%</Text>
            </Text>
            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, result.riskPercentage))}%`, backgroundColor: riskColors[result.riskLevel] }]} />
            </View>
            <Text style={styles.resultAdviceTitle}>Khuyến nghị:</Text>
            {result.recommendations.map((rec, idx) => (
              <Text key={idx} style={styles.resultAdvice}>- {rec}</Text>
            ))}
            <Text style={styles.resultAdviceTitle}>Yếu tố chính:</Text>
            <View style={styles.chipsWrap}>
              {result.keyFactors.map((f, idx) => (
                <View key={idx} style={styles.chip}><Text style={styles.chipText}>{f}</Text></View>
              ))}
            </View>
            <Text style={styles.resultExplain}>{result.explanation}</Text>
            {/* Disclaimer */}
            <View style={styles.alertBox}>
              <AlertTriangle color="#92400e" size={16} style={{ marginRight: 6 }} />
              <Text style={styles.alertText}>
                Lưu ý: Kết quả chỉ mang tính tham khảo và không thay thế cho chẩn đoán của bác sĩ chuyên khoa.
              </Text>
            </View>
          </View>
        )}

        {/* Helper/AI guidance (collapsible) */}
        <View style={styles.helperCard}>
          <TouchableOpacity onPress={() => setShowHelper((s) => !s)}>
            <Text style={styles.helperTitle}>{showHelper ? 'Ẩn hướng dẫn' : 'Hướng dẫn & trợ lý AI'}</Text>
          </TouchableOpacity>
          {showHelper && (
            <Text style={styles.helperText}>
              Hãy nhập đầy đủ các chỉ số. Nếu bạn không chắc về một chỉ số, tham khảo kết quả xét nghiệm gần nhất. Sau khi có kết quả, bạn có thể trao đổi với bác sĩ để được tư vấn chi tiết.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
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

function FormPicker({ label, selectedValue, onValueChange, options }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f3f4f6' }}>
        {/* @ts-ignore */}
        <RNPicker selectedValue={selectedValue} onValueChange={onValueChange} style={{ color: '#111827', fontSize: 15 }}>
          <RNPicker.Item label="Chọn..." value="" />
          {options.map((opt: any) => (
            <RNPicker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </RNPicker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: '#f0fdf4',
    flexGrow: 1,
  },
  headerGradient: {
    borderRadius: 16,
    marginBottom: 12,
  },
  headerWrap: {
    alignItems: 'center',
    paddingVertical: 16,
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
  formCard: {
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
  formCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  formCardHeaderIcon: {
    backgroundColor: '#ffffff33',
    padding: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  formCardHeaderText: {
    color: '#fff',
    fontWeight: '600',
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
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  btnDisabled: {
    opacity: 0.7,
  },
  resetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  resetBtnText: {
    color: '#374151',
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 13,
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
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
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
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    color: '#374151',
    fontSize: 12,
  },
  resultExplain: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  alertText: {
    color: '#92400e',
    flex: 1,
    fontSize: 12,
  },
  helperCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  helperTitle: {
    color: '#059669',
    fontWeight: '700',
    marginBottom: 6,
  },
  helperText: {
    color: '#374151',
    fontSize: 13,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

