const outputEstado = document.getElementById("estado");
const outputLocalidade = document.getElementById("localidade");
const outputBairro = document.getElementById("bairro");
const outputLogradouro = document.getElementById("logradouro");
const loadingIcon = document.querySelector(".loading-icon");
const buttonFind = document.querySelector(".button__find");
const containerWrapper = document.querySelector(".container-wrapper");
const input = document.querySelector(".find__input");
const uxError = document.getElementById("error");

let receberResposta = async (cep) => {
	const url = `https://viacep.com.br/ws/${cep}/json/`;
	const req = await fetch(url);
	const obj = await req.json();

	if (obj.erro) {
		throw new Error();
	}

	return obj;
};

const processarResposta = async (cep) => {
	try {
		const array = await receberResposta(cep);

		setTimeout(() => {
			if (array) {
				const sectionOutput = document.querySelector(".section-output");
				const sectionFind = document.querySelector(".section-find");

				outputEstado.textContent = array.estado + "-" + array.uf;
				outputLocalidade.textContent = array.localidade;
				outputBairro.textContent = array.bairro;
				outputLogradouro.textContent = array.logradouro;

				sectionFind.classList.remove("activated");
				sectionFind.classList.add("disabled");
				sectionOutput.classList.remove("disabled");
				sectionOutput.classList.add("activated");

				containerWrapper.classList.add("scale-animation");
				setTimeout(() => {
					containerWrapper.classList.remove("scale-animation");
				}, 0);

				buttonFind.textContent = "Buscar";
				loadingIcon.style.display = "none";
			}
		}, 1000);
	} catch (error) {
		setTimeout(() => {
			uxError.classList.remove("disabled");
			uxError.textContent = "CEP Inválido";
			loadingIcon.style.display = "none";
			buttonFind.textContent = "Buscar";
			input.style.border = "2px solid red";
			input.classList.add("shake");
			setTimeout(() => {
				input.classList.remove("shake");
			}, 1000);
		}, 1000);
	}
};

input.addEventListener("change", () => {
	input.style.border = "2px solid #dbdbdb";
	uxError.classList.add("disabled");
});

document.getElementById("form").addEventListener("submit", async (event) => {
	event.preventDefault();

	const cep = document.getElementById("cep").value;

	if (cep === "" || isNaN(cep) || cep.length <= 7 || cep.length >= 9) {
		input.style.border = "2px solid red";
		input.classList.add("shake");
		uxError.textContent = "Insira 8 dígitos";
		uxError.classList.remove("disabled");

		setTimeout(() => {
			input.classList.remove("shake");
		}, 1000);
	} else {
		buttonFind.textContent = "";
		loadingIcon.style.display = "flex";

		processarResposta(cep);
	}
});

document.getElementById("copyButton").addEventListener("click", async () => {
	const dados = `Estado: ${outputEstado.innerText}\nLocalidade: ${outputLocalidade.innerText}\nBairro: ${outputBairro.innerText}\nLogradouro: ${outputLogradouro.innerText}`;

	await navigator.clipboard.writeText(dados);
});

const buttonReturn = document.querySelector(".return");

buttonReturn.addEventListener("click", () => {
	const buscar = document.querySelector(".section-find");
	const saida = document.querySelector(".section-output");
	const cepInput = document.getElementById("cep");

	containerWrapper.classList.add("scale-animation");
	setTimeout(() => {
		containerWrapper.classList.remove("scale-animation");
	}, 0);

	buscar.classList.remove("disabled");
	buscar.classList.add("activated");
	saida.classList.remove("activated");
	saida.classList.add("disabled");
	uxError.classList.add("disabled");

	const input = document.querySelector(".find__input");
	input.style.border = "2px solid #dbdbdb";
	cepInput.value = "";
});
