export interface Student {
  name: string;
  startingSemester: string;
  enrollmentId: number | null;
  email: string;
  phoneNumber: number | null;
  career: string;
}

export interface StudentRegistration extends Student {
  registrationTime: string;
}

export type Career =
  | "Ingeniería mecatrónica"
  | "Ingeniería civil"
  | "Ingeniería en energías renovables"
  | "Ingeniería física";
