import React, { Component } from "react";
import history from '../history'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

class HomeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
        fretes: {'Aberto ': 5, 'Em lance': 1, 'Pré-coleta': 8, 'Encerrado': 28}
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="containerCenterHome">
        <br />
        <br />
        <h3>Número de fretes por status</h3>
        <div className="col-sm-6">
          <div className="col-sm-6">
            <BarChart
              width={600}
              height={400}
              data={Object.entries(this.state.fretes)}
              onClick={() => history.push('/fretes')}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="0" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="1" fill="#1C7754" name="Fretes" />
            </BarChart>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeComponent;
