import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { styles } from "./styles";
import { themas } from "../../global/themes";
import { MaterialIcons } from "@expo/vector-icons";

export default function Register() {
  // 🔥 estados
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // 🚀 função de cadastro
  const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      return Alert.alert("Erro", "Preencha todos os campos");
    }

    if (senha !== confirmarSenha) {
      return Alert.alert("Erro", "As senhas não coincidem");
    }

    try {
      const res = await fetch("http://192.168.1.3:3000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          email,
          senha
        })
      });

      const data = await res.json();

      Alert.alert("Sucesso", "Conta criada!");
      console.log(data);

      // limpar campos
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Erro ao conectar com servidor");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.card}>
          
          <Text style={styles.title}>Cadastrar</Text>
          <Text style={styles.subtitle}>Crie Sua Conta Agora</Text>

          {/* NOME */}
          <View style={styles.formField}>
            <Text style={styles.label}>Seu nome completo</Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome"
              placeholderTextColor="#83838D"
              style={[styles.input, { backgroundColor: themas.colors.inputBackground }]}
            />
          </View>

          {/* EMAIL */}
          <View style={styles.formField}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              placeholderTextColor="#83838D"
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, { backgroundColor: themas.colors.inputBackground }]}
            />
          </View>

          {/* SENHA */}
          <View style={styles.formField}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              value={senha}
              onChangeText={setSenha}
              placeholder="Digite sua senha"
              placeholderTextColor="#83838D"
              secureTextEntry
              style={[styles.input, { backgroundColor: themas.colors.inputBackground }]}
            />
          </View>

          {/* CONFIRMAR */}
          <View style={styles.formField}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="Confirme sua senha"
              placeholderTextColor="#83838D"
              secureTextEntry
              style={[styles.input, { backgroundColor: themas.colors.inputBackground }]}
            />
          </View>

          {/* BOTÃO */}
          <Pressable style={styles.primaryButton} onPress={handleRegister}>
            <Text style={styles.primaryButtonText}>Criar conta</Text>
          </Pressable>

        </View>
      </View>
    </View>
  );
}