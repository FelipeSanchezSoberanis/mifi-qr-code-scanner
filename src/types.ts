export interface QrCodeData {
  name: string;
  startingSemester: string;
  enrollmentId: string;
  email: string;
  phoneNumber: string;
  career: string;
}

export interface StudentRegistration extends QrCodeData {
  registrationTime: string;
}

export type Career =
  | "Ingeniería mecatrónica"
  | "Ingeniería civil"
  | "Ingeniería en energías renovables"
  | "Ingeniería física";
