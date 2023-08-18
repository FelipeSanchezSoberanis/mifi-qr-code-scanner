import { Button } from "react-native-paper";
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native";
import { StudentRegistration } from "../types";

export default function ButtonGroupComponent(props: {
  studentRegistrations: StudentRegistration[];
  style: StyleProp<ViewStyle>;
  onShowCamera: () => any;
  onDeleteRegisters: () => any;
}) {
  return (
    <View style={props.style}>
      <Button style={styles.button} icon="camera" mode="contained" onPress={props.onShowCamera}>
        Abrir scanner
      </Button>
      <Button
        disabled={!props.studentRegistrations.length}
        style={styles.button}
        icon="delete"
        mode="contained"
        onPress={props.onDeleteRegisters}
      >
        Borrar registros
      </Button>
      <Button
        disabled={!props.studentRegistrations.length}
        style={styles.button}
        icon="file-account"
        mode="contained"
        onPress={() => console.log("Guardar registros en archivo")}
      >
        Guardar registros
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 25
  }
});
