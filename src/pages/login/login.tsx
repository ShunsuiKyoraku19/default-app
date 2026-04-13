import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { styles } from "./styles";
import { themas } from "../../global/themes";

export default function Login() {
  // 🚀 função de simulação de login
  const handleLogin = (perfil: string) => {
    Alert.alert("Simulação", `Entrando como ${perfil}`);
    // Aqui você pode adicionar lógica para navegar ou salvar o perfil
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.card}>
          
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Simule a entrada no ambiente autenticado</Text>

          {/* BOTÃO AUTOR */}
          <Pressable style={styles.primaryButton} onPress={() => handleLogin("Autor")}>
            <Text style={styles.primaryButtonText}>Entrar como Autor</Text>
          </Pressable>

          {/* BOTÃO LEITOR */}
          <Pressable style={[styles.primaryButton, { marginTop: 10 }]} onPress={() => handleLogin("Leitor")}>
            <Text style={styles.primaryButtonText}>Entrar como Leitor</Text>
          </Pressable>

          {/* BOTÃO SUPER ADMIN */}
          <Pressable style={[styles.primaryButton, { marginTop: 10 }]} onPress={() => handleLogin("Super Admin")}>
            <Text style={styles.primaryButtonText}>Entrar como Super Admin</Text>
          </Pressable>

        </View>
      </View>
    </View>
  );
}