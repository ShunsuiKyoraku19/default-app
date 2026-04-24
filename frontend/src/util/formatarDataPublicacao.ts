// formata enquanto digita tipo dd/mm/aaaa
export function formatarDataPublicacaoDigitando(entrada: string): string {
  const digitos = entrada.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

export function dataPublicacaoCompleta(data: string): boolean {
  return data.replace(/\D/g, '').length === 8;
}
