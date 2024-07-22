import { StyleSheet, View } from "react-native";
import { Button, PaperProvider } from "react-native-paper";
import { Text } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import ButtonGroupComponent from "./components/button-group-component";
import StudentRegistrationsListComponent from "./components/student-registration-list-component";
import { QrCodeData, StudentRegistration } from "./types";
import { useEffect, useState } from "react";
import useStudentRegistrations from "./hooks/student-registrations";
import { CameraView, Camera, PermissionStatus } from "expo-camera";

SplashScreen.preventAutoHideAsync();

export default function Main() {
  const [studentRegistrations, studentRegistrationsReducer] = useStudentRegistrations();
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

    const newStudentRegistration: StudentRegistration = {
      ...qrCodeData,
      registrationTime: new Date().toISOString()
    };

    studentRegistrationsReducer(["add", newStudentRegistration]);

    setShowCamera(false);
  }

  async function getCameraPermission() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(status === PermissionStatus.GRANTED);
  }

  async function initialConfig() {
    const permissionsPromise = getCameraPermission();
    const savedRegistrationsPromise = studentRegistrationsReducer(["retrieveSaved"]);
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
        <CameraView onBarcodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
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
          handleDeleteStudentRegistration={(studentRegistrationToDelete) =>
            studentRegistrationsReducer(["delete", studentRegistrationToDelete])
          }
        />
        <ButtonGroupComponent
          style={styles.buttonGroup}
          onShowCamera={() => setShowCamera(true)}
          onDeleteRegistrations={() => studentRegistrationsReducer(["deleteAll"])}
          onSaveRegistrations={() => studentRegistrationsReducer(["share"])}
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
