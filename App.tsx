import * as React from "react";
import { StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { StudentRegistration } from "./src/types";
import StudentRegistrationsListComponent from "./src/components/student-registration-list-component";
import ButtonGroupComponent from "./src/components/button-group-component";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Text } from "react-native-paper";

export default function Main() {
  const [studentRegistrations, setStudentRegistrations] = React.useState<StudentRegistration[]>([]);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function getCameraPermission() {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === "granted");
    }

    getCameraPermission();
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

  return (
    <PaperProvider>
      <View style={styles.mainView}>
        <StudentRegistrationsListComponent
          style={styles.list}
          studentRegistrations={studentRegistrations}
        />
        <ButtonGroupComponent style={styles.buttonGroup} />
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
