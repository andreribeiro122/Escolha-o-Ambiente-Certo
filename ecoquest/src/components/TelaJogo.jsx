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

	// ZONAS DE DROP (Organizado em Array para não poluir o HTML)
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

	// REGRAS DO JOGO
	const tratarAcerto = () => {
		setFeedback("acerto");
		const novaPontuacao = pontuacaoTotal + pontosItemAtual;
		setPontuacaoTotal(novaPontuacao);
		adicionarItem(itemAtual.id);

		setTimeout(() => {
			avancarParaProximoItem(novaPontuacao);
		}, 1500);
	};

	const tratarErro = () => {
		setFeedback("erro");
		const novaTentativa = tentativasErradas + 1;
		setTentativasErradas(novaTentativa);

		if (novaTentativa === 1) {
			setPontosItemAtual(Math.max(5, pontosItemAtual - 5));
			setDicaAtual(itemAtual.dicas[0]);
			setIndiceDica(1);
		} else if (novaTentativa === 2) {
			setPontosItemAtual(Math.max(5, pontosItemAtual - 10));
		} else if (novaTentativa >= 3) {
			setPontosItemAtual(0);
			setTimeout(() => {
				avancarParaProximoItem(pontuacaoTotal);
			}, 1500);
			return;
		}

		setTimeout(() => setFeedback(null), 1000);
	};

	const pedirDica = () => {
		if (indiceDica >= itemAtual.dicas.length) return;
		setPontosItemAtual(Math.max(5, pontosItemAtual - 5));
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
			className="game-container d-flex flex-column"
			style={{ backgroundImage: `url(${fundoJogo})` }}
		>
			{/* ÁREA DO MAPA RESPONSIVO */}
			<div className="flex-grow-1 d-flex justify-content-center align-items-center p-2 p-md-4 w-100">
				<div className="map-wrapper">
					<img
						src={mapaBg}
						alt="Mapa de Aventura"
						className="map-image"
						draggable="false"
					/>

					{/* ZONAS INVISÍVEIS (Geradas automaticamente a partir do Array) */}
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
					<strong className="text-white">
						Correto! +{pontosItemAtual} pts
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

			{/* HUD INFERIOR: Layout com 3 colunas */}
			{/* A mágica do "align-items-md-end" faz os botões laterais acompanharem o emoji! */}
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-end px-2 pt-2 pb-4 px-md-4 pt-md-2 pb-md-4 gap-3 gap-md-4 w-100 z-3">
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
					{/* ENVELOPE DAS INFOS (Agora empurra o mapa automaticamente, sem invadir!) */}
					<div className="floating-info">
						{dicaAtual && (
							<div className="dica-box smoke-effect">
								<strong>Dica:</strong>{" "}
								{dicaAtual}
							</div>
						)}

						{feedback !== "acerto" &&
							tentativasErradas < 3 && (
								<div
									key={`valendo-${animacaoKey}`}
									className="valendo-card smoke-effect"
								>
									💰 Valendo:{" "}
									<span>
										{pontosItemAtual}{" "}
										pts
									</span>
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

							<div className="item-name text-warning fw-bold text-truncate mt-1 pointer-none">
								{itemAtual.nome}
							</div>
						</div>
					</div>
				</div>

				{/* DIREITA: Dica e Total de Pontos */}
				<div className="hud-section order-3 d-flex flex-column flex-md-row gap-3 gap-md-4 align-items-center justify-content-center justify-content-md-end">
					{/* Apenas o botão de Dica, sem o texto pequeno embaixo */}
					<button
						className="btn btn-hint"
						onClick={pedirDica}
						disabled={
							indiceDica >= itemAtual.dicas.length
						}
						style={{
							opacity:
								indiceDica >=
								itemAtual.dicas.length
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
