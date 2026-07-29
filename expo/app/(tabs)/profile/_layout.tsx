import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.navy },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: "600" as const },
        contentStyle: { backgroundColor: Colors.navy },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Brand Profile" }}
      />
    </Stack>
  );
}
