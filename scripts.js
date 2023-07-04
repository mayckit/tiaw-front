const url = "https://tiaw-one.vercel.app/usuarios";

//================> CRIAR PERFIL DE CLIENTE
function criar(event) {
  event.preventDefault(); // Impede o envio do formulário

  let nome = document.getElementById("nome").value;
  let cpf = document.getElementById("cpf").value;
  let email = document.getElementById("email").value;
  let senha = document.getElementById("senha").value;

  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      "nome": nome,
      "cpf": cpf,
      "email": email,
      "senha": senha
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log("Conta criada!");
    const id = data.id; // Obtém o ID retornado pelo servidor
    redirecionarParaIndex(id); // Redireciona para a página index.html com o ID
  });
}

// Função para redirecionar para a página index.html com o ID do usuário
function redirecionarParaIndex(id) {
  const urlParams = new URLSearchParams();
  urlParams.set('id', id);
  const newURL = "index.html" + '?' + urlParams.toString();
  window.location.href = newURL;
}
