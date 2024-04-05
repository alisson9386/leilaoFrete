import React, { Component } from "react";
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

class HomeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fretes: {},
    };
  }

  async componentDidMount() {
    try {
      const fretes = await AppServices.listFretes();
      if (fretes.data) {
        const freteStatusCount = fretes.data.reduce((acc, f) => {
          const status = f.status;
          const statusLabel = this.getStatusLabel(status);
          acc[statusLabel] = (acc[statusLabel] || 0) + 1;
          return acc;
        }, {});

        this.setState({ fretes: freteStatusCount });
      }
    } catch (error) {
      console.error("Erro ao carregar fretes:", error);
      // Trate o erro conforme necessário
    }
  }

  getStatusLabel(status) {
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
  }

  renderCustomBar = (props) => {
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

  render() {
    const data = Object.entries(this.state.fretes).map(([key, Quantidade]) => ({
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
                  shape={this.renderCustomBar}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeComponent;
