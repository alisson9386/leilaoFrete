import React from "react";
import backgroundImage from "../assets/img/road.jpg"; // Substitua pelo caminho correto da sua imagem

const Layout = ({ children }) => {
  const estiloDeFundo = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover", // Para ajustar a imagem ao tamanho do contêiner
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    width: "100vw", // Largura igual à largura da viewport
    height: "100vh", // Altura igual à altura da viewport
    position: "fixed", // Posição fixa para cobrir a tela inteira
    top: 0,
    left: 0,
    zIndex: -1,
    overflowY: "auto",
    opacity: 0.5, // Ajuste a opacidade conforme necessário
  };

  return (
    <div>
      <div style={estiloDeFundo}></div>{" "}
      <div style={{ position: "relative", zIndex: 0 }}>{children}</div>
    </div>
  );
};

export default Layout;
