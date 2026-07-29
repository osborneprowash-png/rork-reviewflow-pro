// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BrandProfileProvider } from "@/providers/BrandProfileProvider";
import { WorkflowProvider } from "@/providers/WorkflowProvider";
import Colors from "@/constants/colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: Colors.navy },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: "600" as const },
        contentStyle: { backgroundColor: Colors.navy },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="new-workflow" options={{ title: "New Workflow" }} />
      <Stack.Screen name="generated-content" options={{ title: "Generated Content" }} />
      <Stack.Screen name="checklist" options={{ title: "Posting Checklist" }} />
      <Stack.Screen name="workflow-detail" options={{ title: "Workflow Detail" }} />
      <Stack.Screen name="modal" options={{ presentation: "modal", headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BrandProfileProvider>
          <WorkflowProvider>
            <RootLayoutNav />
          </WorkflowProvider>
        </BrandProfileProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
