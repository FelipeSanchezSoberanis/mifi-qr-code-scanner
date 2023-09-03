import { View } from "react-native";
import { Checkbox } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Career, StudentRegistration } from "../types";
import { Modal, Text, Button } from "react-native-paper";
import { useState } from "react";

const careers: Career[] = [
  "Ingeniería civil",
  "Ingeniería mecatrónica",
  "Ingeniería en energías renovables",
  "Ingeniería física"
];

export default function CareerSelectModal(props: {
  show: boolean;
  studentRegistrations: StudentRegistration[];
  handleCareerSelected: (career: Career | null) => any;
}) {
  const [selectedCareer, setSelectedCareer] = useState<null | Career>(null);

  return (
    <Modal
      visible={props.show}
      contentContainerStyle={styles.careerSelectModal}
      dismissable={false}
    >
      <Text variant="titleMedium" style={{ marginBottom: 15, textAlign: "center" }}>
        Carrera de {props.studentRegistrations[0]?.name}
      </Text>
      {careers.map((career, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
          <Checkbox
            status={selectedCareer === career ? "checked" : "unchecked"}
            onPress={() => setSelectedCareer(career)}
          />
          <Text>{career}</Text>
        </View>
      ))}
      <Button
        style={{ marginTop: 15 }}
        disabled={!selectedCareer}
        mode="contained"
        onPress={() => {
          props.handleCareerSelected(selectedCareer);
          setSelectedCareer(null);
        }}
      >
        Seleccionar
      </Button>
    </Modal>
  );
}

const styles = StyleSheet.create({
  careerSelectModal: { backgroundColor: "white", padding: 25, margin: 50 }
});
