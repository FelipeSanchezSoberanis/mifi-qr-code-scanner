import { Button } from "react-native-paper";
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native";

export default function ButtonGroupComponent(props: { style: StyleProp<ViewStyle> }) {
  return (
    <View style={props.style}>
      <Button
        style={styles.button}
        icon="camera"
        mode="contained"
        onPress={() => console.log("Abrir scanner")}
      >
        Abrir scanner
      </Button>
      <Button
        style={styles.button}
        icon="camera"
        mode="contained"
        onPress={() => console.log("Borrar registros")}
      >
        Borrar registros
      </Button>
      <Button
        style={styles.button}
        icon="camera"
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
