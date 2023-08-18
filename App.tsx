import * as React from "react";
import { StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { StudentRegistration } from "./src/types";
import StudentRegistrationsListComponent from "./src/components/student-registration-list-component";
import ButtonGroupComponent from "./src/components/button-group-component";

export default function Main() {
  const [studentRegistrations, setStudentRegistrations] = React.useState<StudentRegistration[]>([]);

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
