import React, { useState } from "react";
import "../assets/css/tela_inicial.css";
import logo from "../assets/images/LOGO_JOGO.png";
import itensData from "../assets/dados/intens.json";
import fundoJogo from "../assets/images/FUNDO_JOGO.png";

function TelaInicial({ aoIniciarJogo, recorde, itensDesbloqueados }) {
	const [modalGlossario, setModalGlossario] = useState(false);
	const [modalEquipe, setModalEquipe] = useState(false);
	const [modalConfig, setModalConfig] = useState(false);

	const renderizarGlossario = () => {
		const itensParaMostrar = itensData.filter((item) =>
			itensDesbloqueados.includes(item.id),
		);
		if (itensParaMostrar.length === 0) {
			return (
				<p className="text-center text-white mt-4">
					Você ainda não descobriu nenhum item. Jogue para
					desbloquear!
				</p>
			);
		}
		return itensParaMostrar.map((item) => (
			<div
				key={item.id}
				className="glossary-item mb-3 d-flex align-items-center bg-dark p-3 rounded"
			>
				<div className="glossary-icon fs-1 me-3">
					{item.emoji}
				</div>
				<div>
					<h3 className="glossary-title text-warning">
						{item.nome}
					</h3>
					<p className="glossary-desc text-white mb-0">
						{item.descricao}
					</p>
				</div>
			</div>
		));
	};

	return (
		<div
			className="d-flex flex-column justify-content-center align-items-center position-relative"
			style={{
				backgroundImage: `url(${fundoJogo})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				backgroundAttachment:
					"fixed" /* Trava o fundo para não rolar */,
				minHeight: "100vh" /* Garante 100% da altura */,
				width: "100vw" /* Garante 100% da largura */,
				overflow: "hidden" /* Esconde barrinhas de rolagem indesejadas */,
			}}
		>
			{/* NAVEGAÇÃO SUPERIOR */}
			<nav className="fixed-top p-4 d-flex justify-content-between w-100">
				<button
					className="btn btn-wood px-4 py-2 rounded shadow text-uppercase fw-bold text-white"
					onClick={() => setModalGlossario(true)}
				>
					Glossário
				</button>
				<button
					className="btn btn-wood px-4 py-2 rounded shadow text-white"
					onClick={() => setModalConfig(true)}
				>
					⚙️ Configurações
				</button>
			</nav>

			{/* CONTEÚDO CENTRAL */}
			<main className="wood-panel p-5 text-center mt-5 mb-4 shadow-lg rounded">
				<img
					src={logo}
					alt="Logo do Jogo"
					className="img-fluid mb-4"
					style={{ maxWidth: "400px" }}
				/>
				<br />
				<button
					className="btn btn-gold btn-lg px-5 py-3 text-uppercase fw-bold fs-4 rounded-pill"
					onClick={aoIniciarJogo}
				>
					Iniciar Jogo
				</button>
			</main>

			{/* RODAPÉ */}
			<footer className="fixed-bottom p-4 d-flex justify-content-between align-items-end w-100">
				<button
					className="btn btn-wood px-3 py-2 rounded shadow text-white text-uppercase"
					onClick={() => setModalEquipe(true)}
				>
					Sobre a Equipe
				</button>

				<div className="hud-box text-warning bg-dark p-2 rounded border border-warning shadow fw-bold">
					RECORDE DE PONTOS: {recorde}
				</div>
			</footer>

			{/* ================= MODAIS (POP-UPS) ================= */}

			{/* MODAL GLOSSÁRIO */}
			{modalGlossario && (
				<div
					className="modal d-block"
					style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
					tabIndex="-1"
				>
					<div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
						<div className="modal-content wood-panel border border-warning border-4">
							<div className="modal-header border-bottom border-warning">
								<h5 className="modal-title text-warning fw-bold fs-3">
									📖 Glossário
								</h5>
								<button
									type="button"
									className="btn-close btn-close-white"
									onClick={() =>
										setModalGlossario(
											false,
										)
									}
								></button>
							</div>
							<div className="modal-body custom-scroll">
								{renderizarGlossario()}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* MODAL SOBRE A EQUIPE */}
			{modalEquipe && (
				<div
					className="modal d-block"
					style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
					tabIndex="-1"
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content wood-panel border border-warning border-4">
							<div className="modal-header border-bottom border-warning">
								<h5 className="modal-title text-warning fw-bold">
									👨‍💻 Sobre a Equipe
								</h5>
								<button
									type="button"
									className="btn-close btn-close-white"
									onClick={() =>
										setModalEquipe(
											false,
										)
									}
								></button>
							</div>
							<div className="modal-body text-white">
								<p>
									Este jogo foi desenvolvido
									com muito carinho e
									dedicação para ensinar
									sobre a sustentabilidade e
									os ambientes do nosso
									planeta!
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* MODAL CONFIGURAÇÕES */}
			{modalConfig && (
				<div
					className="modal d-block"
					style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
					tabIndex="-1"
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content wood-panel border border-warning border-4">
							<div className="modal-header border-bottom border-warning">
								<h5 className="modal-title text-warning fw-bold">
									⚙️ Configurações
								</h5>
								<button
									type="button"
									className="btn-close btn-close-white"
									onClick={() =>
										setModalConfig(
											false,
										)
									}
								></button>
							</div>
							<div className="modal-body d-flex flex-column gap-3">
								<button className="btn btn-outline-light">
									Diminuir Música 🔉
								</button>
								<button className="btn btn-outline-light">
									Mudar Linguagem 🌐
								</button>
								<button className="btn btn-success">
									Baixar Save 💾
								</button>
								<button className="btn btn-primary">
									Importar Save 📂
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default TelaInicial;
