import React, { useState, useEffect } from "react";
import TelaInicial from "./components/TelaInicial";
import TelaJogo from "./components/TelaJogo";
import TelaFinal from "./components/TelaFinal";

function App() {
    // 1. ESTADOS GLOBAIS
    // Controla qual tela está aparecendo: 'inicial', 'jogo' ou 'final'
    const [telaAtual, setTelaAtual] = useState("inicial");

    // Salva o recorde de pontuação
    const [recorde, setRecorde] = useState(0);

    // Guarda os IDs dos itens que o jogador já acertou e liberou no glossário
    const [itensDesbloqueados, setItensDesbloqueados] = useState([]);

    // Estados temporários para passar da Tela de Jogo para a Tela Final
    const [pontuacaoDaRodada, setPontuacaoDaRodada] = useState(0);
    
    // Voltando para o array vazio!
    const [itensDaRodada, setItensDaRodada] = useState([]);

    // 2. EFEITO DE CARREGAMENTO (Executa apenas uma vez quando o jogo abre)
    useEffect(() => {
        // Busca o recorde salvo no cache (localStorage)
        const recordeSalvo = localStorage.getItem("ecoquest_recorde");
        if (recordeSalvo) {
            setRecorde(parseInt(recordeSalvo));
        }

        // Busca os itens desbloqueados salvos no cache
        const itensSalvos = localStorage.getItem("ecoquest_itens");
        if (itensSalvos) {
            setItensDesbloqueados(JSON.parse(itensSalvos));
        }
    }, []);

    // 3. FUNÇÕES DE ATUALIZAÇÃO (Atualizam o Estado e o Cache)
    const atualizarRecorde = (novoRecorde) => {
        setRecorde(novoRecorde);
        localStorage.setItem("ecoquest_recorde", novoRecorde);
    };

    const adicionarItemDesbloqueado = (idDoItem) => {
        // Só adiciona se o ID ainda não estiver na lista
        if (!itensDesbloqueados.includes(idDoItem)) {
            const novaLista = [...itensDesbloqueados, idDoItem];
            setItensDesbloqueados(novaLista);
            localStorage.setItem(
                "ecoquest_itens",
                JSON.stringify(novaLista),
            );
        }
    };

    // 4. RENDERIZAÇÃO CONDICIONAL (O "Roteador" do jogo)
    return (
        <div>
            {/* Se a telaAtual for 'inicial', mostra a TelaInicial */}
            {telaAtual === "inicial" && (
                <TelaInicial
                    aoIniciarJogo={() => setTelaAtual("jogo")}
                    recorde={recorde}
                    itensDesbloqueados={itensDesbloqueados}
                />
            )}

            {/* Se a telaAtual for 'jogo', mostra a TelaJogo */}
            {telaAtual === "jogo" && (
                <TelaJogo
                    aoFinalizar={(pontuacaoFinal, itensSorteados) => {
                        setPontuacaoDaRodada(pontuacaoFinal);
                        setItensDaRodada(itensSorteados);
                        setTelaAtual("final");
                    }}
                    adicionarItem={adicionarItemDesbloqueado}
                    voltarInicio={() => setTelaAtual("inicial")}
                />
            )}

            {/* Se a telaAtual for 'final', mostra a TelaFinal */}
            {telaAtual === "final" && (
                <TelaFinal
                    pontuacaoAtual={pontuacaoDaRodada}
                    recorde={recorde}
                    atualizarRecorde={atualizarRecorde}
                    itensDaRodada={itensDaRodada}
                    jogarNovamente={() => setTelaAtual("jogo")}
                    voltarInicio={() => setTelaAtual("inicial")}
                />
            )}
        </div>
    );
}

export default App;