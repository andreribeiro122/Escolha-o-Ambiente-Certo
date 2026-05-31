import React from "react";

function TelaJogo({ voltarInicio }) {
	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "#1e120c",
				color: "white",
			}}
		>
			<h1>Tela de Jogo 🚧</h1>
			<button
				onClick={voltarInicio}
				style={{
					padding: "10px 20px",
					marginTop: "20px",
					cursor: "pointer",
				}}
			>
				Voltar ao Início
			</button>
		</div>
	);
}

// Esta é a linha que estava faltando e causou o erro!
export default TelaJogo;
