import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { styles } from "./styles";
import { themas } from "../../global/themes";
import { MaterialIcons } from "@expo/vector-icons";

export default function Login() {
  // 🚀 função de simulação de login
  const handleSimulateLogin = (role: string) => {
    Alert.alert("Simulação de Login", `Logado como ${role}`);
    // Aqui você pode adicionar lógica para navegar ou definir estado de autenticação
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.card}>
          
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Selecione seu perfil para simulação</Text>

          {/* BOTÃO AUTOR */}
          <Pressable style={styles.primaryButton} onPress={() => handleSimulateLogin("Autor")}>
            <Text style={styles.primaryButtonText}>Entrar como Autor</Text>
          </Pressable>

          {/* BOTÃO LEITOR */}
          <Pressable style={[styles.primaryButton, { marginTop: 16 }]} onPress={() => handleSimulateLogin("Leitor")}>
            <Text style={styles.primaryButtonText}>Entrar como Leitor</Text>
          </Pressable>

          {/* BOTÃO SUPER ADMIN */}
          <Pressable style={[styles.primaryButton, { marginTop: 16 }]} onPress={() => handleSimulateLogin("Super Admin")}>
            <Text style={styles.primaryButtonText}>Entrar como Super Admin</Text>
          </Pressable>

        </View>
      </View>
    </View>
  );
}