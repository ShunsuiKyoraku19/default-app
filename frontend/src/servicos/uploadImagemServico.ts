import { urlApiUpload } from '../config';

// manda a imagem pro servidor ou devolve a URI local pro banco
export async function resolverUriCapa(uriLocal: string): Promise<string> {
  if (!urlApiUpload) {
    return uriLocal;
  }

  try {
    const extensao = uriLocal.toLowerCase().includes('.png') ? 'png' : 'jpg';
    const tipoMime = extensao === 'png' ? 'image/png' : 'image/jpeg';

    const dados = new FormData();
    dados.append('arquivo', {
      uri: uriLocal,
      name: `capa.${extensao}`,
      type: tipoMime,
    } as unknown as Blob);

    const resposta = await fetch(`${urlApiUpload}/api/upload`, {
      method: 'POST',
      body: dados,
    });

    if (!resposta.ok) {
      return uriLocal;
    }

    const corpo = (await resposta.json()) as { caminho?: string };
    if (corpo.caminho) {
      return `${urlApiUpload}${corpo.caminho}`;
    }
  } catch {
    // sem rede / deu erro, fica na URI local
  }

  return uriLocal;
}
