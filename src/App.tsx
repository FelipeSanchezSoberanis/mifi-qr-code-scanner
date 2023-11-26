import { StyleSheet, View } from "react-native";
import { Button, PaperProvider } from "react-native-paper";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Text } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import ButtonGroupComponent from "./components/button-group-component";
import StudentRegistrationsListComponent from "./components/student-registration-list-component";
import { QrCodeData, StudentRegistration } from "./types";
import { useEffect, useState } from "react";
import useStudentRegistrations from "./hooks/student-registrations";

SplashScreen.preventAutoHideAsync();

export default function Main() {
  const [
    studentRegistrations,
    addStudentRegistration,
    deleteStudentRegistration,
    deleteAllStudentRegistrations,
    shareStudentRegistrations,
    retrieveSavedStudentRegistrations
  ] = useStudentRegistrations();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  function handleBarCodeScanned({ data }: { data: string }) {
    const dataArray = JSON.parse(data) as string[];

    const qrCodeData: QrCodeData = {
      career: "",
      email: "",
      enrollmentId: "",
      name: "",
      phoneNumber: "",
      startingSemester: ""
    };
    const qrCodeDataKeys = (Object.keys(qrCodeData) as (keyof QrCodeData)[]).sort();

    for (let i = 0; i < dataArray.length; i++) qrCodeData[qrCodeDataKeys[i]] = dataArray[i];

    const newReg: StudentRegistration = {
      ...qrCodeData,
      registrationTime: new Date().toISOString()
    };

    addStudentRegistration(newReg);

    setShowCamera(false);
  }

  async function getCameraPermission() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasCameraPermission(status === "granted");
  }

  async function initialConfig() {
    const permissionsPromise = getCameraPermission();
    const savedRegistrationsPromise = retrieveSavedStudentRegistrations();
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

  return (
    <PaperProvider>
      <View style={styles.mainView}>
        <StudentRegistrationsListComponent
          style={styles.list}
          studentRegistrations={studentRegistrations}
          handleDeleteStudentRegistration={deleteStudentRegistration}
        />
        <ButtonGroupComponent
          style={styles.buttonGroup}
          onShowCamera={() => setShowCamera(true)}
          onDeleteRegistrations={deleteAllStudentRegistrations}
          onSaveRegistrations={shareStudentRegistrations}
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
  },
  mainScannerView: { flex: 1, justifyContent: "center", alignItems: "center" },
  noCameraPermissionView: { flex: 1, justifyContent: "center", alignItems: "center" },
  careerSelectModal: { backgroundColor: "white", padding: 25, margin: 50 }
});
