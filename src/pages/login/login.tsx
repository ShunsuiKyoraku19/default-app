import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { styles } from "./styles";
import { themas } from "../../global/themes";
import { MaterialIcons } from "@expo/vector-icons";

export default function Register() {
  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.backIcon}>←</Text>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerTitle}>Definir o nome</Text>
          </View>
        </View>

        <Text style={styles.title}>Cadastrar</Text>
        <Text style={styles.subtitle}>Crie Sua Conta Agora</Text>

        <View style={styles.formField}>
          <Text style={styles.label}>Seu nome completo</Text>
          <TextInput
            placeholder="Digite seu nome"
            placeholderTextColor="#83838D"
            style={[styles.input, { backgroundColor: themas.colors.inputBackground }]}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Digite seu email"
            placeholderTextColor="#83838D"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, { backgroundColor: themas.colors.inputBackground }]}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#83838D"
            secureTextEntry
            style={[styles.input, { backgroundColor: themas.colors.inputBackground }]}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput
            placeholder="Confirme sua senha"
            placeholderTextColor="#83838D"
            secureTextEntry
            style={[styles.input, { backgroundColor: themas.colors.inputBackground }]}
          />
        </View>

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Criar conta</Text>
        </Pressable>
        </View>
      </View>

      <View style={styles.bottomTabs}>
        <View style={styles.tabItem}>
          <MaterialIcons name="login" size={22} style={styles.tabIcon} />
          <Text style={styles.tabLabel}>Login</Text>
        </View>

        <View style={styles.tabItemActive}>
          <MaterialIcons name="person" size={22} style={styles.tabIcon} />
          <Text style={styles.tabLabelActive}>Cadastro</Text>
        </View>
      </View>
    </View>
  );
}
