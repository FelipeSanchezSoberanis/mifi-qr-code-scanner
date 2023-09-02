import { Alert, StyleSheet, View } from "react-native";
import { Button, PaperProvider, Modal, Checkbox } from "react-native-paper";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Papaparse from "papaparse";
import Share from "react-native-share";
import moment from "moment";
import * as SplashScreen from "expo-splash-screen";
import { asyncStorages } from "./async-storages";
import ButtonGroupComponent from "./components/button-group-component";
import StudentRegistrationsListComponent from "./components/student-registration-list-component";
import { datetimeFormat } from "./constants";
import { Career, StudentRegistration } from "./types";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

const careers: Career[] = [
  "Ingeniería civil",
  "Ingeniería mecatrónica",
  "Ingeniería en energías renovables",
  "Ingeniería física"
];

export default function Main() {
  const [studentRegistrations, setStudentRegistrations] = useState<StudentRegistration[]>([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showCareerSelectModal, setShowCareerSelectModal] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<null | Career>(null);

  async function deleteRegistration(studRegToDel: StudentRegistration) {
    const indexToDelete = studentRegistrations.findIndex(
      (item) => item.registrationTime === studRegToDel.registrationTime
    );
    setStudentRegistrations((currStudRegs) => {
      currStudRegs.splice(indexToDelete, 1);
      return [...currStudRegs];
    });
    await AsyncStorage.setItem(
      asyncStorages.studentRegistrations,
      JSON.stringify(studentRegistrations)
    );
  }

  async function deleteRegistrations() {
    Alert.alert("¿Borrar registros?", "Esta acción no puede ser revertida", [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Borrar",
        onPress: () => handleAcceptToDeleteRegistrations(),
        style: "default"
      }
    ]);
  }

  async function handleAcceptToDeleteRegistrations() {
    setStudentRegistrations([]);
    await AsyncStorage.removeItem(asyncStorages.studentRegistrations);
  }

  async function blobToBase64(input: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = () => reject();
      fileReader.readAsDataURL(input);
    });
  }

  async function shareRegistrations() {
    let localStudentRegistrations = [...studentRegistrations];
    localStudentRegistrations = localStudentRegistrations.map((reg) => {
      const newRegTime = moment(new Date(reg.registrationTime)).format(datetimeFormat);
      return { ...reg, registrationTime: newRegTime };
    });
    const csvContent = Papaparse.unparse(localStudentRegistrations);
    const csvFile = new Blob([csvContent], { type: "text/csv" });
    const csvBase64 = await blobToBase64(csvFile);
    await Share.open({
      url: csvBase64,
      filename: `asistencia-${moment(new Date()).format(datetimeFormat)}`
    });
  }

  function handleBarCodeScanned({ data }: { data: string }) {
    setShowCamera(false);

    const fields = data.split("$");

    const newReg: StudentRegistration = {
      name: fields[0],
      enrollmentId: fields[1] ? Number(fields[1]) : null,
      startingSemester: fields[2],
      email: fields[3],
      phoneNumber: fields[4] ? Number(fields[4]) : null,
      registrationTime: new Date().toISOString(),
      career: ""
    };

    setStudentRegistrations((state) => {
      const newState = [newReg, ...state];
      AsyncStorage.setItem(asyncStorages.studentRegistrations, JSON.stringify(newState));
      return newState;
    });

    setShowCareerSelectModal(true);
  }

  async function getCameraPermission() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasCameraPermission(status === "granted");
  }

  async function retrieveSavedRegistrations() {
    const savedStudentRegistrationsString = await AsyncStorage.getItem(
      asyncStorages.studentRegistrations
    );

    if (!savedStudentRegistrationsString) return;

    const savedStudentRegistrations = JSON.parse(
      savedStudentRegistrationsString
    ) as StudentRegistration[];

    setStudentRegistrations(savedStudentRegistrations);
  }

  async function initialConfig() {
    const permissionsPromise = getCameraPermission();
    const savedRegistrationsPromise = retrieveSavedRegistrations();
    await Promise.all([permissionsPromise, savedRegistrationsPromise]);
    await SplashScreen.hideAsync();
  }

  useEffect(() => {
    initialConfig();
  }, []);

  if (!hasCameraPermission) {
    return (
      <View style={styles.noCameraPermissionView}>
        <Text variant="titleLarge" style={{ textAlign: "center" }}>
          La cámara es necesaria para poder utilizar la aplicación
        </Text>
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.mainScannerView}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <Button
          style={{ position: "absolute", bottom: 35 }}
          icon="cancel"
          mode="contained"
          onPress={() => setShowCamera(false)}
        >
          Cerrar scanner
        </Button>
      </View>
    );
  }

  function handleCareerSelected(): void {
    setShowCareerSelectModal(false);
  }

  return (
    <PaperProvider>
      <View style={styles.mainView}>
        <StudentRegistrationsListComponent
          style={styles.list}
          studentRegistrations={studentRegistrations}
          handleDeleteStudentRegistration={deleteRegistration}
        />
        <ButtonGroupComponent
          style={styles.buttonGroup}
          onShowCamera={() => setShowCamera(true)}
          onDeleteRegistrations={deleteRegistrations}
          onSaveRegistrations={shareRegistrations}
          studentRegistrations={studentRegistrations}
        />
        <Modal
          visible={showCareerSelectModal}
          contentContainerStyle={styles.careerSelectModal}
          dismissable={false}
        >
          <Text>Carrera de {studentRegistrations[0].name}</Text>
          {careers.map((career, i) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                key={i}
                status={selectedCareer === career ? "checked" : "unchecked"}
                onPress={() => setSelectedCareer(career)}
              />
              <Text>{career}</Text>
            </View>
          ))}
          <Button disabled={!selectedCareer} mode="contained" onPress={handleCareerSelected}>
            Seleccionar
          </Button>
        </Modal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 25,
    paddingTop: 50,
    paddingBottom: 50,
    display: "flex"
  },
  list: {
    flex: 9
  },
  buttonGroup: {
    flex: 3,
    marginTop: 25
  },
  mainScannerView: { flex: 1, justifyContent: "center", alignItems: "center" },
  noCameraPermissionView: { flex: 1, justifyContent: "center", alignItems: "center" },
  careerSelectModal: { backgroundColor: "white", padding: 25, margin: 50 }
});
