import { Button } from "react-native-paper";
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native";
import { StudentRegistration } from "../types";

export default function ButtonGroupComponent(props: {
  studentRegistrations: StudentRegistration[];
  style: StyleProp<ViewStyle>;
  onShowCamera: () => any;
  onDeleteRegistrations: () => any;
  onSaveRegistrations: () => any;
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
        onPress={props.onDeleteRegistrations}
      >
        Borrar registros
      </Button>
      <Button
        disabled={!props.studentRegistrations.length}
        style={styles.button}
        icon="file-account"
        mode="contained"
        onPress={props.onSaveRegistrations}
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
