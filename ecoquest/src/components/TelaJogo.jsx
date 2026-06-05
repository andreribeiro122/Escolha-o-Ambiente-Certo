import React, { useState, useEffect } from "react";
import "../assets/css/tela_jogo.css";
import mapaBg from "../assets/images/MAPA.png";
import itensData from "../assets/dados/intens.json";
import fundoJogo from "../assets/images/FUNDO_JOGO.png";

function TelaJogo({ voltarInicio, aoFinalizar, adicionarItem }) {
	// ESTADOS DO JOGO
	const [itensRodada, setItensRodada] = useState([]);
	const [indiceAtual, setIndiceAtual] = useState(0);
	const [pontuacaoTotal, setPontuacaoTotal] = useState(0);

	const [pontosItemAtual, setPontosItemAtual] = useState(20);
	const [tentativasErradas, setTentativasErradas] = useState(0);
	const [indiceDica, setIndiceDica] = useState(0);
	const [dicaAtual, setDicaAtual] = useState("");

	const [feedback, setFeedback] = useState(null);
	const [animacaoKey, setAnimacaoKey] = useState(0);

	// ESTADOS DA FÍSICA DE ARRASTAR
	const [isDragging, setIsDragging] = useState(false);
	const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });
	const [translate, setTranslate] = useState({ x: 0, y: 0 });

	const zonasDeDrop = [
		{ id: "cidade", classeCSS: "zone-cidade" },
		{ id: "lixao", classeCSS: "zone-lixao" },
		{ id: "mar", classeCSS: "zone-mar" },
		{ id: "deserto", classeCSS: "zone-deserto" },
		{ id: "floresta", classeCSS: "zone-floresta" },
		{ id: "gelo", classeCSS: "zone-gelo" },
	];

	useEffect(() => {
		const itensEmbaralhados = [...itensData].sort(
			() => 0.5 - Math.random(),
		);
		setItensRodada(itensEmbaralhados.slice(0, 5));
	}, []);

	if (itensRodada.length === 0) return null;

	const itemAtual = itensRodada[indiceAtual];

	// LÓGICA DE ARRASTO (Pointer Events)
	const handlePointerDown = (e) => {
		if (
			feedback === "acerto" ||
			tentativasErradas >= 3 ||
			(e.pointerType === "mouse" && e.button !== 0)
		)
			return;

		setIsDragging(true);
		setStartMouse({ x: e.clientX, y: e.clientY });
		setTranslate({ x: 0, y: 0 });
		e.currentTarget.setPointerCapture(e.pointerId);
	};

	const handlePointerMove = (e) => {
		if (!isDragging) return;
		setTranslate({
			x: e.clientX - startMouse.x,
			y: e.clientY - startMouse.y,
		});
	};

	const handlePointerUp = (e) => {
		if (!isDragging) return;
		setIsDragging(false);
		e.currentTarget.releasePointerCapture(e.pointerId);

		e.currentTarget.style.visibility = "hidden";
		const elementoAlvo = document.elementFromPoint(
			e.clientX,
			e.clientY,
		);
		e.currentTarget.style.visibility = "visible";

		if (elementoAlvo) {
			const zona = elementoAlvo.getAttribute("data-ambiente");
			if (zona) {
				if (zona === itemAtual.ambiente) {
					tratarAcerto();
				} else {
					tratarErro();
				}
			}
		}
		setTranslate({ x: 0, y: 0 });
	};

	// REGRAS DE ERRO E ACERTO ATUALIZADAS
	const tratarAcerto = () => {
		setFeedback("acerto");

		// TRUQUE MÁGICO: Mesmo que o valor interno seja 0 (porque comprou dica), o prêmio mínimo é 5!
		const pontosGanhos = Math.max(5, pontosItemAtual);
		const novaPontuacao = pontuacaoTotal + pontosGanhos;

		setPontuacaoTotal(novaPontuacao);
		adicionarItem(itemAtual.id);

		setTimeout(() => {
			avancarParaProximoItem(novaPontuacao);
		}, 1500);
	};

	// REGRAS DE ERRO E ACERTO ATUALIZADAS
	const tratarErro = () => {
		setFeedback("erro");
		const novaTentativa = tentativasErradas + 1;
		setTentativasErradas(novaTentativa);

		if (novaTentativa === 1) {
			// Primeiro erro: Reduz 5 pontos (De 20 vai para 15)
			setPontosItemAtual((prev) => Math.max(0, prev - 5));
			// Aparece a dica genérica (não mexe nas dicas do botão)
			setDicaAtual(
				"Analise bem as características do item. Qual ambiente combina mais com ele?",
			);
		} else if (novaTentativa === 2) {
			// Segundo erro: Reduz 10 pontos de uma vez (De 15 vai para 5)
			setPontosItemAtual((prev) => Math.max(0, prev - 10));
			// Limpa a dica da tela
			setDicaAtual("");
		} else if (novaTentativa >= 3) {
			// Terceiro erro: Zera a pontuação e passa de fase
			setPontosItemAtual(0);
			setDicaAtual(""); // Mantém a tela limpa

			setTimeout(() => {
				avancarParaProximoItem(pontuacaoTotal);
			}, 1500);
			return;
		}

		setTimeout(() => setFeedback(null), 1000);
	};

	const pedirDica = () => {
		// Trava: se não tem dicas ou não tem pelo menos 5 pontos, não faz nada
		if (indiceDica >= itemAtual.dicas.length || pontosItemAtual < 5)
			return;

		// Desconta 5 pontos (agora cai para 0 se ele tinha 5)
		setPontosItemAtual((prev) => Math.max(0, prev - 5));
		setDicaAtual(itemAtual.dicas[indiceDica]);
		setIndiceDica(indiceDica + 1);
	};

	const avancarParaProximoItem = (pontuacaoFinal) => {
		if (indiceAtual < 4) {
			setIndiceAtual(indiceAtual + 1);
			setPontosItemAtual(20);
			setTentativasErradas(0);
			setIndiceDica(0);
			setDicaAtual("");
			setFeedback(null);
			setAnimacaoKey((prev) => prev + 1);
		} else {
			aoFinalizar(pontuacaoFinal, itensRodada);
		}
	};

	return (
		<div
			className="game-container d-flex flex-column position-relative"
			style={{ backgroundImage: `url(${fundoJogo})` }}
		>
			{/* DICA FLUTUANTE NO TOPO DA TELA (NÃO ATRAPALHA O MAPA) */}
			{dicaAtual && (
				<div
					className="smoke-effect position-absolute top-0 start-50 translate-middle-x mt-3 mt-md-4 z-3 text-center shadow-lg d-flex flex-column justify-content-center align-items-center"
					style={{
						width: "92%",
						maxWidth: "600px",
						height: "auto" /* Libera a altura */,
						minHeight:
							"fit-content" /* Força a caixa a crescer com o texto */,
						padding: "12px 20px" /* Dá um respiro lateral maior para o texto não colar na borda */,
						borderRadius: "10px",
						border: "2px solid #ffc107",
						wordBreak:
							"break-word" /* Evita que palavras muito longas quebrem o layout */,
						backgroundColor: "#b18b23",
					}}
				>
					<strong className="text-warning fs-5 mb-1">
						💡 Dica:
					</strong>
					<span
						className="text-white fs-6"
						style={{ lineHeight: "1.4" }}
					>
						{dicaAtual}
					</span>
				</div>
			)}

			{/* ÁREA DO MAPA RESPONSIVO */}
			<div className="flex-grow-1 d-flex justify-content-center align-items-end align-items-md-center p-2 p-md-4 pb-0 pb-md-4 w-100">
				<div
					className="map-wrapper"
					style={{ marginBottom: "50px" }}
				>
					<img
						src={mapaBg}
						alt="Mapa de Aventura"
						className="map-image"
						draggable="false"
					/>

					{zonasDeDrop.map((zona) => (
						<div
							key={zona.id}
							className={`drop-zone ${zona.classeCSS}`}
							data-ambiente={zona.id}
						></div>
					))}
				</div>
			</div>

			{/* FEEDBACK POPUPS */}
			{feedback === "acerto" && (
				<div className="feedback-popup border-success text-success">
					<span>✅</span>
					<br />
					{/* Exibe sempre no mínimo +5 pts no balãozinho */}
					<strong className="text-white">
						Correto! +{Math.max(5, pontosItemAtual)} pts
					</strong>
				</div>
			)}

			{feedback === "erro" && (
				<div className="feedback-popup border-danger text-danger">
					<span>❌</span>
					<br />
					<strong className="text-white">
						Ambiente Errado!
					</strong>
				</div>
			)}

			{/* HUD INFERIOR */}
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-end px-2 pt-0 pb-2 px-md-4 pt-md-2 pb-md-4 gap-2 gap-md-4 w-100 z-3">
				{/* ESQUERDA: Botão Voltar */}
				<div className="hud-section order-2 order-md-1 d-flex justify-content-center justify-content-md-start mb-2 mb-md-0">
					<button
						className="btn btn-back"
						onClick={voltarInicio}
					>
						Voltar ao Início
					</button>
				</div>

				{/* CENTRO: Item Arrastável, Card Valendo e Dica */}
				<div className="hud-section order-1 order-md-2 d-flex flex-column align-items-center">
					<div className="floating-info">
						{/* A CAIXA DE DICA FOI REMOVIDA DAQUI! */}

						{feedback !== "acerto" &&
							tentativasErradas < 3 && (
								<div
									key={`valendo-${animacaoKey}`}
									className="valendo-card smoke-effect text-center"
								>
									💰 VALENDO:{" "}
									<span>
										{Math.max(
											5,
											pontosItemAtual,
										)}{" "}
										pts
									</span>
									{/* SINALIZAÇÃO DE RISCO */}
									<small
										style={{
											fontSize: "12px",
											display: "block",
											opacity: 0.9,
											marginTop:
												"4px",
											color: "#ffaaaa",
										}}
									>
										{tentativasErradas ===
											0 &&
											"Se errar: -5 pontos"}
										{tentativasErradas ===
											1 &&
											"Se errar: -10 pontos"}
										{tentativasErradas ===
											2 &&
											"Última chance!"}
									</small>
								</div>
							)}
					</div>

					{/* ENVELOPE FÍSICO DO ITEM */}
					<div
						className="item-physical-envelope"
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerUp}
						onPointerCancel={handlePointerUp}
						style={{
							transform: `translate(${translate.x}px, ${translate.y}px) scale(${isDragging ? 1.05 : 1})`,
							transition: isDragging
								? "none"
								: "transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)",
							zIndex: isDragging ? 1000 : 1,
							cursor: isDragging
								? "grabbing"
								: "grab",
						}}
					>
						{/* ENVELOPE VISUAL DO ITEM */}
						<div
							key={animacaoKey}
							className={`item-draggable text-center ${
								feedback === "acerto" ||
								tentativasErradas >= 3
									? "invisible"
									: "smoke-effect"
							}`}
						>
							<div className="item-title text-white fw-bold mb-1 mb-md-2 pointer-none">
								Onde eu vivo?
							</div>

							<div className="pointer-none">
								{itemAtual.emoji}
							</div>

							<div className="mt-1 text-warning fw-bold item-name pointer-none">
								{itemAtual.nome}
							</div>
						</div>
					</div>
				</div>

				{/* DIREITA: Dica e Total de Pontos */}
				<div className="hud-section order-3 d-flex flex-column flex-md-row gap-3 gap-md-4 align-items-center justify-content-center justify-content-md-end">
					<button
						className="btn btn-hint"
						onClick={pedirDica}
						// O botão desativa se acabarem as dicas OU se ele não tiver 5 pontos
						disabled={
							indiceDica >=
								itemAtual.dicas.length ||
							pontosItemAtual < 5
						}
						style={{
							opacity:
								indiceDica >=
									itemAtual.dicas.length ||
								pontosItemAtual < 5
									? 0.5
									: 1,
						}}
					>
						💡 Dica{" "}
						<span className="hint-cost">(-5 pts)</span>
					</button>

					<div className="score-display">
						Total: <span>{pontuacaoTotal}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TelaJogo;
