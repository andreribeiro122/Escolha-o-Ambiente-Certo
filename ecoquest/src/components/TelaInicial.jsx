import React, { useState, useRef } from "react";
import "../assets/css/tela_inicial.css";
import logo from "../assets/images/LOGO_JOGO.svg";
import itensData from "../assets/dados/intens.json";
import fundoJogo from "../assets/images/FUNDO_JOGO.svg";

// Adicionamos a prop "aoImportarSave" para enviar os dados de volta ao App.jsx
function TelaInicial({
	aoIniciarJogo,
	recorde,
	itensDesbloqueados,
	aoImportarSave,
}) {
	const [modalGlossario, setModalGlossario] = useState(false);
	const [modalEquipe, setModalEquipe] = useState(false);
	const [modalConfig, setModalConfig] = useState(false);

	const [ambienteAberto, setAmbienteAberto] = useState(null);

	// Referência para o input de arquivo invisível
	const fileInputRef = useRef(null);

	const nomesAmbientes = {
		cidade: "🏙️ Cidade",
		lixao: "🗑️ Lixão",
		mar: "🌊 Mar",
		deserto: "🏜️ Deserto",
		floresta: "🌲 Floresta",
		gelo: "❄️ Gelo",
	};

	const alternarAmbiente = (ambiente) => {
		if (ambienteAberto === ambiente) {
			setAmbienteAberto(null);
		} else {
			setAmbienteAberto(ambiente);
		}
	};

	// ==========================================
	// LÓGICA DE SAVE: BAIXAR E IMPORTAR
	// ==========================================
	const baixarSave = () => {
		// 1. Reúne os dados atuais do jogador
		const dadosSave = {
			recorde: recorde,
			itensDesbloqueados: itensDesbloqueados,
		};

		// 2. Converte para texto JSON
		const stringJson = JSON.stringify(dadosSave);

		// 3. Cria um arquivo virtual e força o download
		const blob = new Blob([stringJson], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "meu_save_ecoquest.json"; // Nome do arquivo que será baixado
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const lidarComUploadSave = (evento) => {
		const arquivo = evento.target.files[0];
		if (!arquivo) return;

		// 1. Lê o arquivo enviado
		const leitor = new FileReader();
		leitor.onload = (e) => {
			try {
				// 2. Transforma o texto de volta em objeto JavaScript
				const dadosImportados = JSON.parse(e.target.result);

				// 3. Verifica se o arquivo tem o formato certo
				if (
					dadosImportados.recorde !== undefined &&
					Array.isArray(dadosImportados.itensDesbloqueados)
				) {
					// Manda os dados lá para o App.jsx
					if (aoImportarSave) {
						aoImportarSave(
							dadosImportados.recorde,
							dadosImportados.itensDesbloqueados,
						);
					}
					alert("✅ Save importado com sucesso!");
					setModalConfig(false); // Fecha a tela de config
				} else {
					alert(
						"❌ Arquivo de save inválido ou corrompido.",
					);
				}
			} catch (erro) {
				alert("❌ Erro ao ler o arquivo de save.");
			}
		};
		leitor.readAsText(arquivo);

		// Limpa o input para poder importar o mesmo arquivo novamente se precisar
		evento.target.value = null;
	};

	// ==========================================
	// RENDERIZAÇÃO DO GLOSSÁRIO
	// ==========================================
	const renderizarGlossario = () => {
		const itensAgrupados = itensData.reduce((acumulador, item) => {
			if (!acumulador[item.ambiente]) {
				acumulador[item.ambiente] = [];
			}
			acumulador[item.ambiente].push(item);
			return acumulador;
		}, {});

		return (
			<div className="glossario-container text-start w-100 mt-2">
				{Object.keys(itensAgrupados).map((ambienteChave) => (
					<div key={ambienteChave} className="mb-3">
						<button
							className="btn btn-dark w-100 d-flex justify-content-between align-items-center fw-bold border border-warning"
							onClick={() =>
								alternarAmbiente(ambienteChave)
							}
							style={{
								borderRadius: "8px",
								padding: "12px 20px",
							}}
						>
							<span className="text-warning fs-5">
								{nomesAmbientes[
									ambienteChave
								] || ambienteChave}
							</span>
							<span className="text-white fs-5">
								{ambienteAberto ===
								ambienteChave
									? "▲"
									: "▼"}
							</span>
						</button>

						{ambienteAberto === ambienteChave && (
							<div
								className="p-3 mt-2 text-white wood-panel border border-warning shadow-sm"
								style={{ borderRadius: "8px" }}
							>
								<ul className="list-unstyled mb-0">
									{itensAgrupados[
										ambienteChave
									].map((item) => {
										const isDesbloqueado =
											itensDesbloqueados.includes(
												item.id,
											);
										return (
											<li
												key={
													item.id
												}
												className="d-flex align-items-center mb-3 pb-3 border-bottom border-secondary last-no-border"
											>
												<div
													className="fs-1 me-3"
													style={
														!isDesbloqueado
															? {
																	filter: "brightness(0)",
																	opacity: 0.3,
																	userSelect:
																		"none",
																}
															: {}
													}
												>
													{
														item.emoji
													}
												</div>
												<div>
													<strong
														className={`d-block fs-5 ${isDesbloqueado ? "text-warning" : "text-secondary"}`}
													>
														{isDesbloqueado
															? item.nome
															: "???"}
													</strong>
													{isDesbloqueado && (
														<small className="text-light">
															{
																item.descricao
															}
														</small>
													)}
												</div>
											</li>
										);
									})}
								</ul>
							</div>
						)}
					</div>
				))}
			</div>
		);
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
								<p className="text-center mb-4">
									Este jogo foi desenvolvido
									com muito carinho e
									dedicação para ensinar
									sobre a sustentabilidade e
									os ambientes do nosso
									planeta!
								</p>

								<hr className="border-warning opacity-50 mx-4" />

								<h6 className="text-warning fw-bold text-center mb-3 fs-5">
									Desenvolvido por:
								</h6>
								<ul className="list-unstyled text-center lh-lg fw-semibold">
									<li>
										André Ribeiro de
										Souza
									</li>
									<li>
										André Nunes Valério
									</li>
									<li>
										Clever Cristian
										Blanco Mamani
									</li>
									<li>
										Pedro Moura de
										Oliveira
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* MODAL CONFIGURAÇÕES (ATUALIZADO) */}
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
								{/* Input Invisível para o Upload */}
								<input
									type="file"
									accept=".json"
									style={{
										display: "none",
									}}
									ref={fileInputRef}
									onChange={
										lidarComUploadSave
									}
								/>

								<button
									className="btn btn-success fs-6 fs-md-5 py-2"
									onClick={baixarSave}
								>
									Baixar Save 💾
								</button>

								<button
									className="btn btn-primary fs-6 fs-md-5 py-2"
									onClick={() =>
										fileInputRef.current.click()
									}
								>
									Importar Save 📂
								</button>

								<small className="text-light text-center mt-2">
									Exporte seu progresso para
									jogar em outro
									dispositivo!
								</small>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default TelaInicial;
