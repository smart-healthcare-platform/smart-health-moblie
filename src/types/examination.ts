export interface VitalSigns {
    bloodPressureSystolic?: number
    bloodPressureDiastolic?: number
    heartRate?: number
    temperature?: number
    weight?: number
    height?: number
    bmi?: number
    respiratoryRate?: number
    oxygenSaturation?: number
    notes?: string
}


export interface ExaminationData {
    // Step 1: Patient verification (just confirmation)
    patientVerified: boolean

    // Step 2: Vital signs
    vitalSigns?: VitalSigns

    // Step 3: Examination details
    chiefComplaint?: string
    symptoms?: string
    examination?: string
    diagnosis?: string
    prescription?: string
    labTests?: string

    // Step 4: Summary
    followUpDate?: string
    additionalNotes?: string
}

export interface ExaminationRecord {
    id: string
    appointmentId: string
    patientId: string
    doctorId: string
    startTime: string
    endTime?: string
    data: ExaminationData
    status: "in-progress" | "completed"
}

export type ExaminationStep = 1 | 2 | 3 | 4

export interface PatientVerificationData {
    patientName: string
    dateOfBirth: string
    gender: string
    phone: string
    address: string
    bloodType?: string
    allergies?: string
    chronicDiseases?: string
    reason?: string
}

export interface VitalSignsStepProps {
    data?: VitalSigns
    onUpdate: (data: VitalSigns) => void
    onNext: () => void
    onPrevious: () => void
}

export interface ExaminationStepData {
    chiefComplaint?: string
    symptoms?: string
    examination?: string
    diagnosis?: string
    prescription?: string
    labTests?: string
}

export interface ExaminationStepProps {
    data: ExaminationStepData
    onUpdate: (data: Partial<ExaminationStepData>) => void
    onNext: () => void
    onPrevious: () => void
}

export interface SummaryStepProps {
    appointment: PatientVerificationData & {
        id: string
        patientId: string
        appointmentTime: string
    }
    examinationData: ExaminationData
    onComplete: () => void
    onPrevious: () => void
}