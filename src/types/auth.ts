interface BaseUser {
    id: string;
    username: string;
    role: "PATIENT" | "DOCTOR" | "ADMIN";
    phone: string;
    email: string;
    createdAt: string;
    referenceId?: string;
    avatarUrl?: string; // Add avatar URL field
}

interface PatientProfile {
    fullName: string;
    gender: string;
    address: string;
    dateOfBirth: string;
}

interface DoctorProfile {
    fullName: string;
    specialty: string;
    yearsOfExperience: number;
    dateOfBirth: string;
    avatar: string;
    gender: string
}

export type User =
    | (BaseUser & { role: "PATIENT"; profile?: PatientProfile })
    | (BaseUser & { role: "DOCTOR"; profile?: DoctorProfile })
    | (BaseUser & { role: "ADMIN" });