import { List, Text } from "react-native-paper";
import { StudentRegistration } from "../types";
import React from "react";
import { FlatList, StyleProp, View, ViewStyle } from "react-native";

export default function StudentRegistrationsListComponent(props: {
  studentRegistrations: StudentRegistration[];
  style: StyleProp<ViewStyle>;
}) {
  return (
    <View style={props.style}>
      <Text variant="titleLarge">Registros ({props.studentRegistrations.length})</Text>
      <FlatList
        data={props.studentRegistrations}
        renderItem={(reg) => (
          <List.Item title={reg.item.name} left={() => <List.Icon icon="account" />} />
        )}
      />
    </View>
  );
}
