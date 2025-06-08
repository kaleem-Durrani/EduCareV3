import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import screens
import Notes from "../screens/Teacher/Notes/Notes";
import NoteDetails from "../screens/Teacher/NotesDetails/NotesDeatils";

export type NotesStackParamList = {
  Notes: undefined;
  NoteDetails: undefined;
};

const Stack = createStackNavigator<NotesStackParamList>();

export const NotesNavigator = () => {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen
        name="Notes"
        component={Notes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NoteDetails"
        component={NoteDetails}
        options={{ title: "News Details" }}
      />
    </Stack.Navigator>
  );
};
