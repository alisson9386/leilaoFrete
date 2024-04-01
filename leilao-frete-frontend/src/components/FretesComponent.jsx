import React, { Component } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";

class FretesComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      options: [
        { name: "Option 1️", id: 1 },
        { name: "Option 2️", id: 2 },
      ],
      minDate: "",
    };
  }

  componentDidMount() {
    const today = new Date().toISOString().split("T")[0];
    this.setState({ minDate: today });
  }

  handleShow = () => {
    this.setState({
      showModal: true,
    });
  };

  handleClose = () => {
    this.setState({
      showModal: false,
    });
    this.componentDidMount();
  };

  render() {
    return (
      <>
        <div className="containerUsually">
          <br />
          <br />
          <Button
            variant="primary"
            size="sm"
            data-toggle="tooltip"
            id="termosButton"
            data-placement="right"
            onClick={() => this.handleShow()}
          >
            Novo leilão
          </Button>
          <br/><br/>
        </div>
        <Modal
          className="modal modal-lg"
          show={this.state.showModal}
          onHide={this.handleClose}
          dialogClassName="custom-modal-leilao"
        >
          <Modal.Header closeButton>
            <Modal.Title>Novo leilão de frete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Data de validade do leilão</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Data de validade"
                    min={this.state.minDate}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Lance máximo</Form.Label>
                  <Form.Control type="number" placeholder="Lance máximo" />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Data de coleta da ordem de coleta</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Data de validade"
                    min={this.state.minDate}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Tipos de veículos</Form.Label>
                  <Multiselect
                    options={this.state.options}
                    selectedValues={this.state.selectedValue}
                    onSelect={this.onSelect}
                    onRemove={this.onRemove}
                    displayValue="name"
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>Local de origem da coleta</Form.Label>
                  <Form.Select defaultValue="Choose...">
                    <option>Choose...</option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Data máxima de entrega destino</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Data de validade"
                    min={this.state.minDate}
                  />
                </Form.Group>
              </Row>

              <br />
              <Form.Label>Local de destino da coleta</Form.Label>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Número da ordem de venda</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Número da ordem de venda"
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Razão social do cliente destino</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Razão social do cliente destino"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>Logradouro</Form.Label>
                  <Form.Control type="text" placeholder="Logradouro" />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Número</Form.Label>
                  <Form.Control type="number" placeholder="Número" />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>CEP</Form.Label>
                  <Form.Control type="number" placeholder="CEP" />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control type="text" placeholder="Cidade" />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>UF</Form.Label>
                  <Form.Select defaultValue="Choose...">
                    <option>Choose...</option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>IE</Form.Label>
                  <Form.Control type="number" placeholder="IE" />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Produtos</Form.Label>
                  <Multiselect
                    options={this.state.options}
                    selectedValues={this.state.selectedValue}
                    onSelect={this.onSelect}
                    onRemove={this.onRemove}
                    displayValue="name"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Quantidade (s) por produto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Quantidade (s) por produto"
                  />
                </Form.Group>
              </Row>

              <br />
              <Form.Group className="mb-3" id="formGridCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <span style={{ marginLeft: "10px" }}></span>
            <Button variant="info" onClick={this.handleClose}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default FretesComponent;
