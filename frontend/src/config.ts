import Constants from 'expo-constants';

// URL da API de upload (app.json → expo.extra.fluxcarrApiUrl)
function obterUrlApi(): string {
  const valor = Constants.expoConfig?.extra?.fluxcarrApiUrl;
  if (typeof valor === 'string' && valor.trim().length > 0) {
    return valor.trim().replace(/\/$/, '');
  }
  return '';
}

export const urlApiUpload = obterUrlApi();
