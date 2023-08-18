export interface Student {
  name: string;
  startingSemester: string;
  enrollmentId: number | null;
  career: string;
  email: string;
  phoneNumber: number | null;
}

export interface StudentRegistration extends Student {
  registrationTime: string;
}
