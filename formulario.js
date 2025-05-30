window.addEventListener("load", () => {
  const container = document.querySelector(".container-principal");
  if (container) container.classList.add("ativo");
});

// Lógica do formulário
document
  .getElementById("form-signo")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const dataNascimento = document.getElementById("data-nascimento").value;

    if (!dataNascimento)
      return alert("Por favor, informe a data de nascimento.");

    const data = new Date(dataNascimento);
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const nascimentoFormatado = `${mes}-${dia}`;

    try {
      const response = await fetch("signos.xml");
      if (!response.ok) throw new Error("Erro ao carregar arquivo signos.xml");
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      const signos = xmlDoc.getElementsByTagName("signo");

      let signoEncontrado = null;

      for (let i = 0; i < signos.length; i++) {
        const signo = signos[i];
        const nomeSigno = signo.getElementsByTagName("nome")[0].textContent;
        const inicio = signo.getElementsByTagName("inicio")[0].textContent;
        const fim = signo.getElementsByTagName("fim")[0].textContent;
        const descricao =
          signo.getElementsByTagName("descricao")[0].textContent;

        if (
          (nascimentoFormatado >= inicio && nascimentoFormatado <= fim) ||
          (inicio > fim &&
            (nascimentoFormatado >= inicio || nascimentoFormatado <= fim))
        ) {
          signoEncontrado = { nome: nomeSigno, descricao };
          break;
        }
      }

      const form = document.getElementById("form-signo");
      const imagemSigno = document.querySelector(".imagem-signo");

      // Remove o <h1> da tela, se existir
      const titulo = document.querySelector(".coluna-direita h1");
      if (titulo) titulo.remove();

      if (signoEncontrado) {
        form.innerHTML = `
          
        <h2>Olá, ${nome}!</h2>
          <h3>Seu signo é <strong>${signoEncontrado.nome}</strong>.</h3>
          <p>${signoEncontrado.descricao}</p>
        `;

        document.querySelector(".coluna-direita").classList.add("resultado");

        const nomeImagem = signoEncontrado.nome
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

        imagemSigno.src = `imagens/${nomeImagem}.png`;
        imagemSigno.alt = `Imagem do signo ${signoEncontrado.nome}`;
      } else {
        form.innerHTML = `<p>Não conseguimos identificar seu signo. Verifique a data.</p>`;
      }
    } catch (error) {
      console.error(error);
      alert(
        "Erro ao processar o arquivo XML. Verifique se o arquivo signos.xml está disponível."
      );
    }
  });
