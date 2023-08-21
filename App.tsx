import * as React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, PaperProvider } from "react-native-paper";
import { StudentRegistration } from "./src/types";
import StudentRegistrationsListComponent from "./src/components/student-registration-list-component";
import ButtonGroupComponent from "./src/components/button-group-component";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { asyncStorages } from "./src/async-storages";
import Papaparse from "papaparse";
import Share from "react-native-share";
import moment from "moment";
import "moment/locale/es";
import { datetimeFormat } from "./src/constants";

export default function Main() {
  const [studentRegistrations, setStudentRegistrations] = React.useState<StudentRegistration[]>([]);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean>(false);
  const [showCamera, setShowCamera] = React.useState<boolean>(false);

  function deleteRegisters() {
    Alert.alert("¿Borrar registros?", "Esta acción no puede ser revertida", [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Borrar",
        onPress: () => {
          setStudentRegistrations([]);
          AsyncStorage.removeItem(asyncStorages.studentRegistrations);
        },
        style: "default"
      }
    ]);
  }

  async function toBase64(input: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = () => reject();
      fileReader.readAsDataURL(input);
    });
  }

  async function saveRegistrations() {
    let localStudentRegistrations = [...studentRegistrations];
    localStudentRegistrations = localStudentRegistrations.map((reg) => {
      const newRegTime = moment(new Date(reg.registrationTime)).format(datetimeFormat);
      return { ...reg, registrationTime: newRegTime };
    });
    const csvContent = Papaparse.unparse(localStudentRegistrations);
    const csvFile = new Blob([csvContent], { type: "text/csv" });
    const csvBase64 = await toBase64(csvFile);
    await Share.open({
      url: csvBase64,
      filename: `asistencia-${moment(new Date()).format(datetimeFormat)}`
    });
  }

  function handleBarCodeScanned({ data }: { data: string }) {
    const fields = data.split("$");

    const newReg: StudentRegistration = {
      name: fields[0],
      enrollmentId: fields[1] ? Number(fields[1]) : null,
      startingSemester: fields[2],
      email: fields[3],
      phoneNumber: fields[4] ? Number(fields[4]) : null,
      registrationTime: new Date().toISOString()
    };

    setStudentRegistrations((state) => {
      const newState = [newReg, ...state];
      AsyncStorage.setItem(asyncStorages.studentRegistrations, JSON.stringify(newState));
      return newState;
    });

    setShowCamera(false);
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

  React.useEffect(() => {
    getCameraPermission();
    retrieveSavedRegistrations();
  }, []);

  if (!hasCameraPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="titleLarge" style={{ textAlign: "center" }}>
          La cámara es necesaria para poder utilizar la aplicación
        </Text>
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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

  return (
    <PaperProvider>
      <View style={styles.mainView}>
        <StudentRegistrationsListComponent
          style={styles.list}
          studentRegistrations={studentRegistrations}
        />
        <ButtonGroupComponent
          style={styles.buttonGroup}
          onShowCamera={() => setShowCamera(true)}
          onDeleteRegistrations={deleteRegisters}
          onSaveRegistrations={saveRegistrations}
          studentRegistrations={studentRegistrations}
        />
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
  }
});
