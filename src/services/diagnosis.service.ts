import { apiNoAuth } from '../lib/axios';

export type HealthMetrics = {
  age: string;
  gender: 'M' | 'F';
  chestPainType: '0' | '1' | '2' | '3';
  restingBP: string;
  cholesterol: string;
  fastingBS: '0' | '1';
  restingECG: 'Normal' | 'ST' | 'LVH';
  maxHR: string;
  exerciseAngina: 'Y' | 'N';
  oldpeak: string;
  stSlope: '0' | '1' | '2';
  ca: '0' | '1' | '2' | '3';
  thal: '0' | '1' | '2' | '3';
};

export type DiagnosisResult = {
  riskLevel: 'low' | 'medium' | 'high';
  riskPercentage: number;
  recommendations: string[];
  keyFactors: string[];
  explanation: string;
};

function transformMetricsToModelInput(metrics: HealthMetrics): number[] {
  const toNum = (s: string) => {
    const n = parseFloat(String(s).replace(',', '.').trim());
    return Number.isNaN(n) ? 0 : n;
  };
  const gender = metrics.gender === 'M' ? 1 : 0;
  const exerciseAngina = metrics.exerciseAngina === 'Y' ? 1 : 0;

  const chestPainTypeMap: Record<string, number> = { '0': 0, '1': 1, '2': 2, '3': 3 };
  const chestPainType = chestPainTypeMap[metrics.chestPainType];

  const restingECGMap: Record<string, number> = { Normal: 0, ST: 1, LVH: 2 };
  const restingECG = restingECGMap[metrics.restingECG];

  const stSlopeMap: Record<string, number> = { '0': 0, '1': 1, '2': 2 };
  const stSlope = stSlopeMap[metrics.stSlope];

  return [
    toNum(metrics.age),
    gender,
    chestPainType,
    toNum(metrics.restingBP),
    toNum(metrics.cholesterol),
    toNum(metrics.fastingBS),
    restingECG,
    toNum(metrics.maxHR),
    exerciseAngina,
    toNum(metrics.oldpeak),
    stSlope,
    toNum(metrics.ca),
    toNum(metrics.thal),
  ];
}

export const diagnosisService = {
  async predict(metrics: HealthMetrics): Promise<DiagnosisResult> {
    // Call backend prediction endpoint like the website does
    // POST { input_data: number[] } -> { prediction: number[] }
    const response = await apiNoAuth.post<{ prediction: number[] }>(
      '/prediction/predict',
      { input_data: transformMetricsToModelInput(metrics) }
    );

    const prediction = response.data?.prediction;
    if (!prediction || typeof prediction[0] !== 'number') {
      throw new Error('Invalid prediction response');
    }

    // Invert the probability: model returns prob of NO disease, risk = 1 - p
    const riskPercentage = Math.round((1 - prediction[0]) * 100);
    const riskLevel: DiagnosisResult['riskLevel'] =
      riskPercentage < 30 ? 'low' : riskPercentage < 60 ? 'medium' : 'high';

    return {
      riskLevel,
      riskPercentage,
      recommendations: [
        'Duy trì chế độ ăn uống lành mạnh, ít muối và chất béo bão hòa.',
        'Tập thể dục đều đặn, ít nhất 150 phút mỗi tuần.',
        'Kiểm tra huyết áp và cholesterol định kỳ.',
        'Tránh hút thuốc và hạn chế rượu bia.',
        'Quản lý căng thẳng hiệu quả.',
      ],
      keyFactors: ['Tuổi', 'Huyết áp', 'Cholesterol', 'Nhịp tim tối đa'],
      explanation: `Dựa trên các chỉ số bạn cung cấp, hệ thống AI ước tính nguy cơ mắc bệnh tim của bạn là ${riskPercentage}%. Đây là mức ${riskLevel === 'low' ? 'thấp' : riskLevel === 'medium' ? 'trung bình' : 'cao'}.`,
    };
  },
};
