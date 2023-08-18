export interface Student {
  name: string;
  startingSemester: string;
  enrollmentId: number | null;
  email: string;
  phoneNumber: number | null;
}

export interface StudentRegistration extends Student {
  registrationTime: string;
}
