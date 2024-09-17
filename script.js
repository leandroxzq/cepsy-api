const outputEstado = document.getElementById("estado");
const outputLocalidade = document.getElementById("localidade");
const outputBairro = document.getElementById("bairro");
const outputLogradouro = document.getElementById("logradouro");

let receberResposta = async (cep) => {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const req = await fetch(url)
    const obj = await req.json()

    if (obj.erro) {
        throw new Error();
    }

    return obj;
}

document.getElementById("form").addEventListener('submit', async (event) => {
    event.preventDefault();

    const cep = document.getElementById("cep").value;

    const saida = document.querySelector(".section-output");
    const buscar = document.querySelector(".section-find");
    const errorDiv = document.getElementById("error");

    if (cep === "" || isNaN(cep) || cep.length <= 7) {
        const input = document.querySelector(".find__input");
        input.style.border = "2px solid red"
        input.classList.add("shake")
        errorDiv.textContent = "Digite 8 números"
        errorDiv.classList.remove("disabled")

        setTimeout(() => {
            input.classList.remove("shake");
        }, 1000);
        return;
    } else {
        try {
            const array = await receberResposta(cep)

            if (array) {
                outputEstado.textContent = array.estado + "-" + array.uf;
                outputLocalidade.textContent = array.localidade;
                outputBairro.textContent = array.bairro;
                outputLogradouro.textContent = array.logradouro;
        
                buscar.classList.add("disabled");
                saida.classList.remove("disabled");
        
                const buttonReturn = document.querySelector(".return");
        
                buttonReturn.addEventListener("click", () => {
                    const buscar = document.querySelector(".section-find");
                    const saida = document.querySelector(".section-output");
                    const cepInput = document.getElementById("cep");
        
                    buscar.classList.remove("disabled");
                    buscar.classList.add("active");
                    saida.classList.remove("active");
                    saida.classList.add("disabled");
                    errorDiv.classList.add("disabled");
                    const input = document.querySelector(".find__input");
                    input.style.border = "2px solid #dbdbdb"
                    cepInput.value = "";
                });
            } 
        } catch (error) {
            errorDiv.textContent = "CEP inválido"
            errorDiv.classList.remove("disabled")
        }
    }
})

document.getElementById("copyButton").addEventListener("click", async () => {

    const dados = `Estado: ${outputEstado.innerText}\nLocalidade: ${outputLocalidade.innerText}\nBairro: ${outputBairro.innerText}\nLogradouro: ${outputLogradouro.innerText}`;

    await navigator.clipboard.writeText(dados)
        alert("Dados copiados para a área de transferência!");

});