import React, { useState, useEffect } from 'react';
import history from "../history";
import AppServices from "../service/app-service";
import {
 BarChart,
 Bar,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 Legend,
 ResponsiveContainer,
} from "recharts";

const HomeComponent = () => {
 const [fretes, setFretes] = useState({});

 useEffect(() => {
    const fetchFretes = async () => {
      try {
        const fretesData = await AppServices.listFretes();
        if (fretesData.data) {
          const freteStatusCount = fretesData.data.reduce((acc, f) => {
            const status = f.status;
            const statusLabel = getStatusLabel(status);
            acc[statusLabel] = (acc[statusLabel] || 0) + 1;
            return acc;
          }, {});

          setFretes(freteStatusCount);
        }
      } catch (error) {
        console.error("Erro ao carregar fretes:", error);
        // Trate o erro conforme necessário
      }
    };

    fetchFretes();
 }, []);

 const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return "Aberto";
      case 2:
        return "Em lance";
      case 3:
        return "Pré-coleta";
      case 4:
        return "Encerrado";
      default:
        return "Desconhecido";
    }
 };

 const renderCustomBar = (props) => {
    const { fill, x, y, width, height } = props;
    const status = props.payload.name;
    let color;

    switch (status) {
      case "Aberto":
        color = "gray";
        break;
      case "Em lance":
        color = "red";
        break;
      case "Pré-coleta":
        color = "yellow";
        break;
      case "Encerrado":
        color = "green";
        break;
      default:
        color = fill;
    }

    return <rect x={x} y={y} width={width} height={height} fill={color} />;
 };

 const data = Object.entries(fretes).map(([key, Quantidade]) => ({
    name: key,
    Quantidade: Quantidade,
 }));

 return (
    <div className="containerCenterHome">
      <br />
      <br />
      <h3>Número de fretes por status</h3>
      <div className="col-sm-6">
        <div className="col-sm-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              width={600}
              height={400}
              data={data}
              onClick={() => history.push("/fretes")}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Quantidade"
                fill="#8884d8"
                shape={renderCustomBar}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
 );
};

export default HomeComponent;