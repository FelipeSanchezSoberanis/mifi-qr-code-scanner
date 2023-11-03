import { IconButton, List, Text, TextInput } from "react-native-paper";
import { StudentRegistration } from "../types";
import { useState, useEffect } from "react";
import { Alert, FlatList, StyleProp, View, ViewStyle } from "react-native";
import moment from "moment";
import "moment/dist/locale/es";
import { datetimeFormat } from "../constants";

export default function StudentRegistrationsListComponent(props: {
  studentRegistrations: StudentRegistration[];
  style: StyleProp<ViewStyle>;
  handleDeleteStudentRegistration: (studReg: StudentRegistration) => any;
}) {
  const [shownStudentRegistrations, setShownStudentRegistrations] = useState<StudentRegistration[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  function deleteRegistration(studReg: StudentRegistration) {
    Alert.alert("¿Borrar registro?", prettyStudentInfoWithName(studReg), [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Borrar",
        onPress: () => props.handleDeleteStudentRegistration(studReg),
        style: "default"
      }
    ]);
  }

  function showPrettyStudentInfo(studentRegistration: StudentRegistration) {
    Alert.alert(
      `Información de ${studentRegistration.name}`,
      prettyStudentInfo(studentRegistration)
    );
  }

  function prettyStudentInfoWithName(reg: StudentRegistration) {
    return `Nombre:\n${reg.name}\n\n` + prettyStudentInfo(reg);
  }

  function prettyStudentInfo(reg: StudentRegistration) {
    return `Matrícula:\n${reg.enrollmentId || "No otorgado"}\n\n
Carrera:\n${reg.career || "No otorgado"}\n\n
Correo:\n${reg.email || "No otorgado"}\n\n
Teléfono:\n${reg.phoneNumber || "No otorgado"}\n\n
Semestre de inicio:\n${reg.startingSemester || "No otorgado"}\n\n
Hora de registro:\n${moment(new Date(reg.registrationTime)).format(datetimeFormat)}\n\n`;
  }

  useEffect(() => {
    if (!searchTerm) {
      setShownStudentRegistrations(props.studentRegistrations);
    } else {
      setShownStudentRegistrations(
        props.studentRegistrations.filter((reg) =>
          reg.name.toUpperCase().includes(searchTerm.toUpperCase())
        )
      );
    }
  }, [searchTerm, props.studentRegistrations]);

  return (
    <View style={props.style}>
      <Text style={{ marginBottom: 15 }} variant="titleLarge">
        Registros ({shownStudentRegistrations.length})
      </Text>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          value={searchTerm!}
          onChangeText={(text) => setSearchTerm(text)}
          style={{ flex: 9 }}
          label="Buscar por nombre"
        />
        <IconButton
          disabled={!searchTerm}
          style={{ flex: 1 }}
          icon={"cancel"}
          onPress={() => setSearchTerm(null)}
        />
      </View>
      <FlatList
        data={shownStudentRegistrations}
        renderItem={(reg) => {
          let timePassedSinceReg = moment(reg.item.registrationTime).fromNow();
          timePassedSinceReg =
            timePassedSinceReg.charAt(0).toUpperCase() +
            timePassedSinceReg.slice(1, timePassedSinceReg.length);

          return (
            <List.Item
              style={{ paddingEnd: 0 }}
              title={reg.item.name}
              description={timePassedSinceReg}
              left={() => <List.Icon icon="account" />}
              right={() => (
                <>
                  <IconButton icon="eye" onPress={() => showPrettyStudentInfo(reg.item)} />
                  <IconButton icon="delete" onPress={() => deleteRegistration(reg.item)} />
                </>
              )}
            />
          );
        }}
      />
    </View>
  );
}
