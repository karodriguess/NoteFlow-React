import { useState, useEffect } from "react";

import "./App.css";

export default function App() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pessoaParaDeletar, setPessoaParaDeletar] = useState(null);
  const [pessoas, setPessoas] = useState(() => {
    const stored = localStorage.getItem("pessoas");
    return stored ? JSON.parse(stored) : [];
  });

  const [formVisible, setFormVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [busca, setBusca] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    localStorage.setItem("pessoas", JSON.stringify(pessoas));
  }, [pessoas]);

  const pessoasFiltradas = pessoas.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function gerarProximoId() {
    if (pessoas.length === 0) return 1;
    const ids = pessoas.map((p) => p.id);
    return Math.max(...ids) + 1;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !telefone.trim()) return;

    if (editandoId !== null) {
      const atualizadas = pessoas.map((p) =>
        p.id === editandoId ? { ...p, nome, email, telefone } : p
      );
      setPessoas(atualizadas);
      setEditandoId(null);
    } else {
      setPessoas([
        ...pessoas,
        {
          id: gerarProximoId(),
          nome,
          email,
          telefone,
        },
      ]);
    }

    setNome("");
    setEmail("");
    setTelefone("");
    setFormVisible(false);
  }

  function editarPessoa(pessoa) {
    setNome(pessoa.nome);
    setEmail(pessoa.email);
    setTelefone(pessoa.telefone);
    setEditandoId(pessoa.id);
    setFormVisible(true);
  }

  function confirmarDeletar() {
    const novasPessoas = pessoas.filter((p) => p.id !== pessoaParaDeletar);

    setPessoas(novasPessoas);
    setMostrarModal(false);
    setPessoaParaDeletar(null);
  }

  return (
    <div className="container">
      <h1>Cadastro</h1>

      <div className="top-bar">
        <button onClick={() => setFormVisible(!formVisible)}>
          {formVisible ? "X" : "Adicionar"}
        </button>

        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input-claro"
        />
      </div>

      {formVisible && (
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="input-claro"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-claro"
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="input-claro"
          />
          <button type="submit">{editandoId ? "Salvar" : "Adicionar"}</button>
        </form>
      )}

      {pessoasFiltradas.map((pessoa) => (
        <div key={pessoa.id} className="pessoa">
          <div className="info">
            <span>{pessoa.id}</span>
            <span>{pessoa.nome}</span>
            <span>{pessoa.email}</span>
            <span>{pessoa.telefone}</span>
          </div>
          <div className="acoes">
            <button onClick={() => editarPessoa(pessoa)} title="Editar">
              <img src="./src/icons/edit.png" alt="Editar" className="icone" />
            </button>

            <button
              onClick={() => {
                setPessoaParaDeletar(pessoa.id);
                setMostrarModal(true);
              }}
              title="Deletar"
            >
              <img
                src="./src/icons/delete.png"
                alt="Deletar"
                className="icone-delete"
              />
            </button>
          </div>
        </div>
      ))}
      <div className="lista-pessoas">
        {busca && pessoasFiltradas.length === 0 && (
          <p className="sem-resultados">
            Nenhuma pessoa encontrada! <br />
            Certifique-se que o nome foi digitado corretamente.
          </p>
        )}
      </div>
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Tem certeza? 😬</h3>
            <p>Essa ação não pode ser desfeita.</p>

            <div className="modal-botoes">
              <button
                className="cancelar"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>

              <button className="deletar" onClick={confirmarDeletar}>
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
