import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Papaparse from "papaparse";
import Share from "react-native-share";
import { StudentRegistration } from "../types";
import { Alert } from "react-native";
import moment from "moment";
import { datetimeFormat } from "../constants";
import { blobToBase64 } from "../utils/file-utils";
import { asyncStorages } from "../async-storages";

export default function useStudentRegistrations() {
  const [studentRegistrations, setStudentRegistrations] = useState<StudentRegistration[]>([]);
  const [doneRetrievingSavedStudentRegistrations, setDoneRetrievingSavedStudentRegistrations] =
    useState(false);

  const addStudentRegistration = (studentRegistration: StudentRegistration) => {
    setStudentRegistrations((currentStudentRegistrations) => [
      studentRegistration,
      ...currentStudentRegistrations
    ]);
  };

  const deleteStudentRegistration = (studentRegistrationToDelete: StudentRegistration) => {
    setStudentRegistrations((currentStudentRegistrations) => {
      return [
        ...currentStudentRegistrations.filter(
          (i) => i.registrationTime !== studentRegistrationToDelete.registrationTime
        )
      ];
    });
  };

  const deleteAllStudentRegistrations = () => {
    Alert.alert("¿Borrar registros?", "Esta acción no puede ser revertida", [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", onPress: () => setStudentRegistrations([]), style: "default" }
    ]);
  };

  const shareStudentRegistrations = async () => {
    let localStudRegs = [...studentRegistrations];
    localStudRegs = localStudRegs.map((reg) => {
      const newRegTime = moment(new Date(reg.registrationTime)).format(datetimeFormat);
      return { ...reg, registrationTime: newRegTime };
    });
    const csvContent = Papaparse.unparse(localStudRegs);
    const csvFile = new Blob([csvContent], { type: "text/csv" });
    const csvBase64 = await blobToBase64(csvFile);

    try {
      await Share.open({
        url: csvBase64,
        filename: `asistencia-${moment(new Date()).format(datetimeFormat)}`
      });
    } catch {}
  };

  const retrieveSavedStudentRegistrations = async () => {
    const savedStudentRegistrationsString = await AsyncStorage.getItem(
      asyncStorages.studentRegistrations
    );

    if (!savedStudentRegistrationsString) {
      setDoneRetrievingSavedStudentRegistrations(true);
      return;
    }

    const savedStudentRegistrations = JSON.parse(
      savedStudentRegistrationsString
    ) as StudentRegistration[];

    setStudentRegistrations(savedStudentRegistrations);

    setDoneRetrievingSavedStudentRegistrations(true);
  };

  useEffect(() => {
    if (!doneRetrievingSavedStudentRegistrations) return;
    AsyncStorage.setItem(asyncStorages.studentRegistrations, JSON.stringify(studentRegistrations));
  }, [studentRegistrations]);

  return [
    studentRegistrations,
    addStudentRegistration,
    deleteStudentRegistration,
    deleteAllStudentRegistrations,
    shareStudentRegistrations,
    retrieveSavedStudentRegistrations
  ] as const;
}
