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
				className="glossary-item mb-3 d-flex flex-column flex-sm-row align-items-center text-center text-sm-start bg-dark p-3 rounded"
			>
				<div className="glossary-icon fs-1 mb-2 mb-sm-0 me-sm-3">
					{item.emoji}
				</div>
				<div>
					<h3 className="glossary-title text-warning fs-5 fs-sm-4">
						{item.nome}
					</h3>
					<p className="glossary-desc text-white mb-0 fs-6">
						{item.descricao}
					</p>
				</div>
			</div>
		));
	};

	return (
		<div
			className="d-flex flex-column justify-content-center align-items-center position-relative w-100"
			style={{
				backgroundImage: `url(${fundoJogo})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				backgroundAttachment: "fixed",
				minHeight: "100vh",
				overflowY: "auto",
				overflowX: "hidden",
			}}
		>
			{/* NAVEGAÇÃO SUPERIOR - Paddings responsivos (p-2 no celular, p-4 no PC) */}
			<nav className="fixed-top p-2 p-md-4 d-flex justify-content-between w-100">
				<button
					className="btn btn-wood px-3 px-md-4 py-2 rounded shadow text-uppercase fw-bold text-white fs-6 fs-md-5"
					onClick={() => setModalGlossario(true)}
				>
					<span className="d-none d-sm-inline">
						Glossário
					</span>
					<span className="d-inline d-sm-none">📖</span>
				</button>
				<button
					className="btn btn-wood px-3 px-md-4 py-2 rounded shadow text-white fs-6 fs-md-5"
					onClick={() => setModalConfig(true)}
				>
					⚙️{" "}
					<span className="d-none d-sm-inline">Config</span>
				</button>
			</nav>

			{/* CONTEÚDO CENTRAL - Tamanho do painel e imagem responsivos */}
			<main
				className="wood-panel p-3 p-md-5 text-center shadow-lg rounded"
				style={{
					zIndex: 1,
					marginTop: "80px",
					marginBottom: "80px",
					width: "90%",
					maxWidth: "1200px",
				}}
			>
				<img
					src={logo}
					alt="Logo do Jogo"
					className="img-fluid mb-4"
				/>
				<br />
				<button
					className="btn btn-gold btn-lg px-4 px-md-5 py-2 py-md-3 text-uppercase fw-bold fs-5 fs-md-4 rounded-pill w-100 w-sm-auto"
					onClick={aoIniciarJogo}
				>
					Iniciar Jogo
				</button>
			</main>

			{/* RODAPÉ - Flex-wrap para evitar quebra de layout */}
			<footer className="fixed-bottom p-2 p-md-4 d-flex flex-wrap justify-content-between align-items-center w-100 gap-2">
				<button
					className="btn btn-wood px-3 py-2 rounded shadow text-white text-uppercase fs-6 fs-md-5"
					onClick={() => setModalEquipe(true)}
				>
					Equipe
				</button>

				<div className="hud-box text-warning bg-dark p-2 px-md-3 py-md-2 rounded border border-warning shadow fw-bold fs-6 fs-md-5 text-center">
					RECORDE: <br className="d-block d-sm-none" />{" "}
					{recorde}
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
						<div className="modal-content wood-panel border border-warning border-4 mx-2">
							<div className="modal-header border-bottom border-warning p-3 p-md-4">
								<h5 className="modal-title text-warning fw-bold fs-4 fs-md-3">
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
							<div className="modal-body custom-scroll p-3 p-md-4">
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
						<div className="modal-content wood-panel border border-warning border-4 mx-2">
							<div className="modal-header border-bottom border-warning p-3 p-md-4">
								<h5 className="modal-title text-warning fw-bold fs-5 fs-md-4">
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
							<div className="modal-body text-white p-3 p-md-4 fs-6 fs-md-5">
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
						<div className="modal-content wood-panel border border-warning border-4 mx-2">
							<div className="modal-header border-bottom border-warning p-3 p-md-4">
								<h5 className="modal-title text-warning fw-bold fs-5 fs-md-4">
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
							<div className="modal-body d-flex flex-column gap-2 gap-md-3 p-3 p-md-4">
								<button className="btn btn-outline-light fs-6 fs-md-5">
									Diminuir Música 🔉
								</button>
								<button className="btn btn-outline-light fs-6 fs-md-5">
									Mudar Linguagem 🌐
								</button>
								<button className="btn btn-success fs-6 fs-md-5">
									Baixar Save 💾
								</button>
								<button className="btn btn-primary fs-6 fs-md-5">
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
