import React, { useState, useEffect } from "react";
import TelaInicial from "./components/TelaInicial";
import TelaJogo from "./components/TelaJogo";
import TelaFinal from "./components/TelaFinal";

function App() {
    // 1. ESTADOS GLOBAIS
    const [telaAtual, setTelaAtual] = useState("inicial");
    const [recorde, setRecorde] = useState(0);
    const [itensDesbloqueados, setItensDesbloqueados] = useState([]);
    const [pontuacaoDaRodada, setPontuacaoDaRodada] = useState(0);
    const [itensDaRodada, setItensDaRodada] = useState([]);

    // 2. EFEITO DE CARREGAMENTO
    useEffect(() => {
        const recordeSalvo = localStorage.getItem("ecoquest_recorde");
        if (recordeSalvo) {
            setRecorde(parseInt(recordeSalvo));
        }

        const itensSalvos = localStorage.getItem("ecoquest_itens");
        if (itensSalvos) {
            setItensDesbloqueados(JSON.parse(itensSalvos));
        }
    }, []);

    // 3. FUNÇÕES DE ATUALIZAÇÃO
    const atualizarRecorde = (novoRecorde) => {
        setRecorde(novoRecorde);
        localStorage.setItem("ecoquest_recorde", novoRecorde);
    };

    // ✨ FUNÇÃO ÚNICA DE IMPORTAÇÃO (Corrigida)
    const aplicarSaveImportado = (novoRecorde, novosItens) => {
        setRecorde(novoRecorde);
        setItensDesbloqueados(novosItens);
        localStorage.setItem("ecoquest_recorde", novoRecorde);
        localStorage.setItem("ecoquest_itens", JSON.stringify(novosItens));
    };

    const adicionarItemDesbloqueado = (idDoItem) => {
        if (!itensDesbloqueados.includes(idDoItem)) {
            const novaLista = [...itensDesbloqueados, idDoItem];
            setItensDesbloqueados(novaLista);
            localStorage.setItem("ecoquest_itens", JSON.stringify(novaLista));
        }
    };

    // 4. RENDERIZAÇÃO
    return (
        <div>
            {telaAtual === "inicial" && (
                <TelaInicial
                    aoIniciarJogo={() => setTelaAtual("jogo")}
                    recorde={recorde}
                    itensDesbloqueados={itensDesbloqueados}
                    aoImportarSave={aplicarSaveImportado}
                />
            )}

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