import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { normalizarTipoUsuario, type SessaoUsuario } from '../tipos/usuario';
import { autenticar } from '../servicos/usuarioServico';
import { carregarSessao, limparSessao, salvarSessao } from '../servicos/sessaoServico';

type ContextoAutenticacaoTipo = {
  usuario: SessaoUsuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<boolean>;
  sair: () => Promise<void>;
};

const ContextoAutenticacao = createContext<ContextoAutenticacaoTipo | undefined>(
  undefined
);

function normalizarSessao(s: SessaoUsuario): SessaoUsuario {
  const tipo = normalizarTipoUsuario(String(s.tipo));
  return {
    ...s,
    id: Number(s.id),
    tipo,
    cidadeNome: s.cidadeNome ?? null,
    ufSigla: s.ufSigla ?? null,
  };
}

export function ProvedorAutenticacao({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<SessaoUsuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    (async () => {
      const bruta = await carregarSessao();
      const sessao = bruta ? normalizarSessao(bruta) : null;
      if (ativo) {
        setUsuario(sessao);
        setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    const sessaoBruta = await autenticar(email, senha);
    if (!sessaoBruta) return false;
    const sessao = normalizarSessao(sessaoBruta);
    await salvarSessao(sessao);
    setUsuario(sessao);
    return true;
  }, []);

  const sair = useCallback(async () => {
    await limparSessao();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      carregando,
      entrar,
      sair,
    }),
    [usuario, carregando, entrar, sair]
  );

  return (
    <ContextoAutenticacao.Provider value={valor}>{children}</ContextoAutenticacao.Provider>
  );
}

export function useAutenticacao(): ContextoAutenticacaoTipo {
  const ctx = useContext(ContextoAutenticacao);
  if (!ctx) {
    throw new Error('useAutenticacao deve ser usado dentro de ProvedorAutenticacao');
  }
  return ctx;
}
