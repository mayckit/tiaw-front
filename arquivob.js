//URL da api:
const URL = 'https://tiaw-one.vercel.app/barbeiros';
const URLU = 'https://tiaw-one.vercel.app/usuarios';

const DadosBarbeiros = document.getElementById('main');

fetch(URL)
  .then(res => res.json())
  .then(dados => {
    let lista_barbeiro = '';
    for (let i = 0; i < dados.length; i++) {
      let data = dados[i]; 
      lista_barbeiro += `
      <div class="shop-profile">
      <div class="foto-perfil-cliente">
      <img class="img-perfil-cliente" src="${data.foto}" alt="" />
      </div>  
      <!-- Botão para trocar/adicionar a foto de perfil -->
      <button onclick="mudarFotoPerfil(${i})">Trocar/Adicionar Foto</button><br>
      <!-- Botão para remover a foto de perfil -->
      <button onclick="removerFotoPerfil(${data.id}, ${i})">Remover Foto</button><br>
      <!-- Botão para abrir o modal -->
      <button class="btn-aditar" onclick="openModale(${i})"><h2>editar perfil</h2></button>
      <h1>${data.nome}</h1>
      <p>${data.desde}</p>
    </div>
    <div class="shop-bio">
      <h2>Sobre</h2>
      <p>${data.sobre}</p>
    </div>
    <div class="shop-details">
      <h2>Detalhes da barbearia:</h2>
      <p><h5>Telefone:</h5>${data.fone}</p>
      <p><h5>Endereço:</h5>${data.endereco}</p>
      <p><h5>Especialidades:</h5>${data.especialidades}</p>
      <p><h5>horário de funcionamento:</h5>${data.funcionamento}</p>
    </div>
    <button class="btn-agendar" onclick="openModal(${i})"><h2>Agendar</h2></button>
    <!-- Modal -->
    <div id="myModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeModal()">&times;</span>
        <h2>Agendamento de Horário</h2>
        <form id="agendamento-form">
          <label for="nome">Nome:</label>
          <input type="text" id="nome" name="nome" required /><br /><br />
          <label for="telefone">Telefone:</label>
          <input type="text" id="telefone" name="telefone" required /><br /><br />
          <label for="data">Data:</label>
          <input type="date" id="data" name="data" required /><br /><br />
          <label for="hora">Hora:</label>
          <input type="time" id="hora" name="hora" required /><br /><br />
          <input type="submit" value="Agendar" />
        </form>
      </div>
    </div>
    <div class="shop-photos">
      <h2>Fotos</h2>
      <!-- Botão para trocar/adicionar a foto do portfólio -->
      <button onclick="mudarFotoPortifolio(${i})">Trocar/Adicionar Foto Portfólio</button><br>
      <!-- Botão para remover a foto do portfólio -->
      <button onclick="removerFotoPortifolio(${data.id}, ${i})">Remover Foto Portfólio</button><br>
      <img src="${data.portifolio}"/>
    </div> `;
    }

    DadosBarbeiros.innerHTML = lista_barbeiro;
  });


  function mudarFotoPortifolio(index) {
    // Recupere os dados do usuário com base no índice
    fetch(URL)
      .then(res => res.json())
      .then(dados => {
        const usuario = dados[index];
  
        // Crie um elemento de input para selecionar a nova foto do portfólio
        const inputFoto = document.createElement('input');
        inputFoto.type = 'file';
        inputFoto.accept = 'image/*';
        inputFoto.addEventListener('change', (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const novaFoto = event.target.result;
              usuario.portifolio = novaFoto;
  
              // Atualize a imagem exibida
              const imgPortifolio = document.querySelector(`#main .shop-photos img`);
              imgPortifolio.src = novaFoto;
  
              // Atualize os dados do usuário na API
              fetch(`${URL}/${usuario.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
              })
                .then(res => res.json())
                .then(updatedUsuario => {
                  // Exiba uma mensagem de sucesso ou atualize a interface conforme necessário
                  console.log('Dados do usuário atualizados:', updatedUsuario);
                });
            };
            reader.readAsDataURL(file);
          }
        });
  
        // Dispare um clique no elemento de input para abrir o seletor de arquivo
        inputFoto.click();
      });
  }
  
  function removerFotoPortifolio(usuarioId, index) {
    // Recupere os dados do usuário com base no ID
    fetch(`${URL}/${usuarioId}`)
      .then(res => res.json())
      .then(usuario => {
        // Verifique se o usuário possui uma foto no portfólio
        if (!usuario.portifolio) {
          return;
        }
  
        // Remova a foto do portfólio do servidor
        fetch(usuario.portifolio, {
          method: 'DELETE',
        })
          .then(() => {
            // Atualize o campo "portifolio" no JSON com uma string vazia
            usuario.portifolio = '';
  
            // Atualize a imagem exibida
            const imgPortifolio = document.querySelector(`#main .shop-photos img`);
            imgPortifolio.src = ''; // Defina uma imagem de espaço reservado ou deixe em branco, conforme necessário
  
            // Atualize os dados do usuário na API
            fetch(`${URL}/${usuarioId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(usuario),
            })
              .then(res => res.json())
              .then(updatedUsuario => {
                // Exiba uma mensagem de sucesso ou atualize a interface conforme necessário
                console.log('Dados do usuário atualizados:', updatedUsuario);
              });
          })
          .catch(error => {
            console.error('Erro ao remover a foto do portfólio:', error);
          });
      });
  }
 
function mudarFotoPerfil(index) {
  // Recupere os dados do usuário com base no índice
  fetch(URL)
    .then(res => res.json())
    .then(dados => {
      const usuario = dados[index];

      // Crie um elemento de input para selecionar a nova foto
      const inputFoto = document.createElement('input');
      inputFoto.type = 'file';
      inputFoto.accept = 'image/*';
      inputFoto.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const novaFoto = event.target.result;
            usuario.foto = novaFoto;

            // Atualize a imagem exibida
            const imgPerfil = document.querySelector(`#main .shop-profile:nth-child(${index + 1}) .foto-perfil-cliente`);
            imgPerfil.src = novaFoto;

            // Atualize os dados do usuário na API
            fetch(`${URL}/${usuario.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(usuario),
            })
              .then(res => res.json())
              .then(updatedUsuario => {
                // Exiba uma mensagem de sucesso ou atualize a interface conforme necessário
                console.log('Dados do usuário atualizados:', updatedUsuario);
              });
          };
          reader.readAsDataURL(file);
        }
      });

      // Dispare um clique no elemento de input para abrir o seletor de arquivo
      inputFoto.click();
    });
}

function removerFotoPerfil(usuarioId, index) {
  // Recupere os dados do usuário com base no ID
  fetch(`${URL}/${usuarioId}`)
    .then(res => res.json())
    .then(usuario => {
      // Verifique se o usuário possui uma foto de perfil
      if (!usuario.foto) {
        return;
      }

      // Remova a foto do servidor
      fetch(usuario.foto, {
        method: 'DELETE',
      })
        .then(() => {
          // Atualize o campo "foto" no JSON com uma string vazia
          usuario.foto = '';

          // Atualize a imagem exibida
          const imgPerfil = document.querySelector(`#main .shop-profile:nth-child(${index + 1}) .foto-perfil-cliente`);
          imgPerfil.src = ''; // Defina uma imagem de espaço reservado ou deixe em branco, conforme necessário

          // Atualize os dados do usuário na API
          fetch(`${URL}/${usuarioId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
          })
            .then(res => res.json())
            .then(updatedUsuario => {
              // Exiba uma mensagem de sucesso ou atualize a interface conforme necessário
              console.log('Dados do usuário atualizados:', updatedUsuario);
            });
        })
        .catch(error => {
          console.error('Erro ao remover a foto:', error);
        });
    });
}


  const dadosPerfil = document.getElementById('modalzin');
  fetch(URL)
  .then(res => res.json())
  .then(dado => {
    let lista_perfil = '';
    for (let i = 0; i < dado.length; i++) {
      let data = dado[i]; 
      lista_perfil += `
    <!-- Modal -->
 <div id="editModal" class="modal">
   <div class="modal-content">
     <span class="close" onclick="closeModale()">&times;</span>
     <h2>Editar Perfil</h2>
     <form id="edit-form">
       <label for="editNome">Nome:</label>
        <input type="text" id="editNome" name="nome" required /><br /><br />
       <label for="modal-telefone">Telefone:</label>
        <input type="tel" id="modal-telefone" required><br /><br />
       <label for="editDesde">Desde:</label>
        <input type="text" id="editDesde" name="desde" required /><br /><br />
       <label for="editSobre">Sobre:</label>
        <textarea id="editSobre" name="sobre" rows="4" required></textarea><br /><br />
       <label for="editEndereco">Endereço:</label>
        <input type="text" id="editEndereco" name="endereco" required /><br /><br />
       <label for="editEspecialidades">Especialidades:</label>
        <textarea id="editEspecialidades" name="especialidades" rows="4" required></textarea><br /><br />
       <label for="editFuncionamento">Horário de Funcionamento:</label>
        <textarea id="editFuncionamento" name="funcionamento" rows="4" required></textarea><br /><br />
        <input type="submit" value="Salvar" onclick="updateBarbeiro(currentIndex)" />
     </form>
   </div>
 </div>`;
    }

    dadosPerfil.innerHTML = lista_perfil;
  });
// Função para exibir o modal
function openModale(index) {
  var modal = document.getElementById("editModal");
  modal.style.display = "block";

  fetch(URL)
    .then(res => res.json())
    .then(dados => {
      const barbeiro = dados[index];

      // Preenche o modal com os dados do usuário
      document.getElementById('editNome').value = barbeiro.nome;
      document.getElementById('editDesde').value = barbeiro.desde;
      document.getElementById('editSobre').value = barbeiro.sobre;
      document.getElementById('editEndereco').value = barbeiro.endereco;
      document.getElementById('editEspecialidades').value = barbeiro.especialidades;
      document.getElementById('editFuncionamento').value = barbeiro.funcionamento;
      document.getElementById('modal-telefone').value = barbeiro.fone;

      // Adiciona o evento de envio do formulário ao modal
      const modalForm = document.getElementById('edit-form');
      modalForm.onsubmit = (event) => {
        event.preventDefault(); // Impede o envio do formulário

        // Atualiza os dados do usuário com os novos valores do modal
        barbeiro.nome = document.getElementById('editNome').value;
        barbeiro.desde = document.getElementById('editDesde').value;
        barbeiro.sobre = document.getElementById('editSobre').value;
        barbeiro.endereco = document.getElementById('editEndereco').value;
        barbeiro.especialidades = document.getElementById('editEspecialidades').value;
        barbeiro.funcionamento = document.getElementById('editFuncionamento').value;
        barbeiro.fone = document.getElementById('modal-telefone').value;

        // Atualize os dados do usuário no db.json
        fetch(`${URL}/${barbeiro.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(barbeiro),
        })
          .then(res => res.json())
          .then(updatedBarbeiro => {
            // Mensagem de sucesso ou atualização
            console.log('Dados do usuário atualizados:', updatedBarbeiro);
          });

        closeModal(); // Fecha o modal após a atualização
      };

      // Abre o modal
      document.getElementById('editModal').style.display = 'block';
    });
}

// Função para fechar o modale
function closeModale() {
  var modal = document.getElementById("editModal");
  modal.style.display = "none";
}

// Função para exibir o modal
function openModal(index) {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";

  fetch(URLU)
    .then(res => res.json())
    .then(dados => {
      const barbeiro = dados[index];

      // Preenche o modal com os dados do usuário
      document.getElementById('nome').value = barbeiro.nome;
      document.getElementById('telefone').value = barbeiro.fone;

      // Adiciona o evento de envio do formulário ao modal
      const modalForm = document.getElementById('agendamento-form');
      modalForm.onsubmit = (event) => {
        event.preventDefault(); // Impede o envio do formulário

        // Obtém a data e a hora selecionadas pelo usuário
        const dataSelecionada = document.getElementById('data').value;
        const horaSelecionada = document.getElementById('hora').value;

        // Combina a data e a hora em um único formato (opcional)
        const horarioSelecionado = `${dataSelecionada} ${horaSelecionada}`;

        // Atualiza o campo "horarios" do usuário com o horário selecionado
        barbeiro.horarios.push(horarioSelecionado);

        // Atualiza os dados do usuário na API
        fetch(`${URLU}/${barbeiro.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(barbeiro),
        })
          .then(res => res.json())
          .then(updatedBarbeiro => {
            // Mensagem de sucesso ou atualização
            console.log('Dados do usuário atualizados:', updatedBarbeiro);
          });

        closeModal(); // Fecha o modal após o envio do formulário
      };

      // Abre o modal
      document.getElementById('myModal').style.display = 'block';
    });
}

// Função para fechar o modal
function closeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}





