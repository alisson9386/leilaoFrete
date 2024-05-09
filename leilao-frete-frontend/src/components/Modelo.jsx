import React, { useEffect } from "react";

const ModeloComponent = (props) => {
  useEffect(() => {
    // Equivalente a componentDidMount e componentDidUpdate
    return () => {
      // Equivalente a componentWillUnmount
    };
  }, []); // Array vazio como segundo argumento para garantir que o efeito seja executado apenas uma vez, equivalente a componentDidMount

  return (
    <div className="text-center p-3" style={{ color: "white" }}>
      {/* Conteúdo do componente */}
    </div>
  );
};

export default ModeloComponent;

/*import React, { Component } from "react";

class ModeloComponent extends Component {
 constructor(props) {
    super(props);

    this.state = {};
 }

 componentDidMount() {}

 render() {
    return (
        <div className='text-center p-3' style={{ color: 'white' }}>
        </div>
    );
 }
}

export default ModeloComponent;*/