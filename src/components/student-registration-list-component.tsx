import { IconButton, List, Text, TextInput } from "react-native-paper";
import { StudentRegistration } from "../types";
import React from "react";
import { Alert, FlatList, StyleProp, View, ViewStyle } from "react-native";
import moment from "moment";
import "moment/dist/locale/es";
import { datetimeFormat } from "../constants";

export default function StudentRegistrationsListComponent(props: {
  studentRegistrations: StudentRegistration[];
  style: StyleProp<ViewStyle>;
}) {
  const [shownStudentRegistrations, setShownStudentRegistrations] = React.useState<
    StudentRegistration[]
  >([]);
  const [searchTerm, setSearchTerm] = React.useState<string | null>(null);

  function prettyStudentInfo(reg: StudentRegistration) {
    return `Matrícula:\n${reg.enrollmentId || "No otorgado"}\n\n
Correo:\n${reg.email || "No otorgado"}\n\n
Teléfono:\n${reg.phoneNumber || "No otorgado"}\n\n
Semestre de inicio:\n${reg.startingSemester || "No otorgado"}\n\n
Hora de registro:\n${moment(new Date(reg.registrationTime)).format(datetimeFormat)}\n\n`;
  }

  React.useEffect(() => {
    if (!searchTerm) {
      setShownStudentRegistrations(props.studentRegistrations);
    } else {
      setShownStudentRegistrations(
        props.studentRegistrations.filter((reg) => reg.name.includes(searchTerm))
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
              title={reg.item.name}
              description={timePassedSinceReg}
              left={() => <List.Icon icon="account" />}
              right={() => (
                <IconButton
                  icon={"eye"}
                  onPress={() =>
                    Alert.alert(`Información de ${reg.item.name}`, prettyStudentInfo(reg.item))
                  }
                />
              )}
            />
          );
        }}
      />
    </View>
  );
}
