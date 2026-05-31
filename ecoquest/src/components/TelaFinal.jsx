import React, { useEffect } from "react";
import "../assets/css/CSS.css"; // Importando o seu CSS da tela final

function TelaFinal({
	pontuacaoAtual,
	recorde,
	atualizarRecorde,
	itensDaRodada,
	jogarNovamente,
	voltarInicio,
}) {
	// Efeito que roda assim que a tela abre: verifica se bateu o recorde
	useEffect(() => {
		if (pontuacaoAtual > recorde) {
			atualizarRecorde(pontuacaoAtual);
		}
	}, [pontuacaoAtual, recorde, atualizarRecorde]);

	// Função para dar uma cor de borda diferente baseada no ambiente do item (usando as classes do seu CSS)
	const obterClasseRaridade = (ambiente) => {
		switch (ambiente) {
			case "mar":
				return "raro"; // Borda azul
			case "gelo":
				return "raro"; // Borda azul
			case "deserto":
				return "lendario"; // Borda laranja
			case "floresta":
				return "epico"; // Borda roxa
			case "cidade":
				return "comum"; // Borda dourada
			case "lixao":
				return "comum"; // Borda dourada
			default:
				return "comum";
		}
	};

	return (
		// Coloquei um fundo escuro genérico para garantir que a imagem de fundo do CSS apareça bem
		<div
			className="bg-dark"
			style={{
				minHeight: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				padding: "40px",
			}}
		>
			<div className="container">
				{/* TOPO */}
				<div className="top-banner">🎉 Parabéns!</div>

				{/* PONTUAÇÃO */}
				<div className="score-area">
					<div className="score-card">
						<h3>🏆 Melhor Pontuação</h3>
						<p>
							{Math.max(pontuacaoAtual, recorde)}{" "}
							pts
						</p>
					</div>

					<div className="score-card">
						<h3>⭐ Pontuação Atual</h3>
						<p>{pontuacaoAtual} pts</p>
					</div>
				</div>

				{/* BOTÕES */}
				<div className="buttons">
					<button
						className="game-btn"
						onClick={jogarNovamente}
					>
						🎮 Jogar Novamente
					</button>

					<button
						className="game-btn"
						onClick={voltarInicio}
					>
						🔳 Voltar ao Início
					</button>
				</div>

				{/* ITENS COLETADOS */}
				<h2 className="inventory-title">✦ Itens Coletados ✦</h2>

				<div className="items-grid">
					{/* Se houver itens jogados na rodada, ele cria os cards automaticamente */}
					{itensDaRodada && itensDaRodada.length > 0 ? (
						itensDaRodada.map((item, index) => (
							<div
								key={index}
								className={`item-card ${obterClasseRaridade(item.ambiente)}`}
							>
								<div className="emoji">
									{item.emoji}
								</div>
								<span>{item.nome}</span>

								{/* Pop-up de descrição (Tooltip) que você criou no CSS */}
								<div className="tooltip">
									<h4>{item.nome}</h4>
									<p
										style={{
											fontSize: "14px",
											lineHeight:
												"1.2",
										}}
									>
										{item.descricao}
									</p>
								</div>
							</div>
						))
					) : (
						// Caso chegue nessa tela sem jogar de verdade (apenas testando)
						<p
							style={{
								color: "white",
								textAlign: "center",
								width: "100%",
							}}
						>
							Nenhum item coletado nesta rodada.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default TelaFinal;
