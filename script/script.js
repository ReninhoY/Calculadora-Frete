function buscarCep(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((res)=>{
        return res.json()
            .then((json)=>{
                console.log(json)
                if (json.erro == true) {
                    exibirErro("Não foi possível encontrar o CEP")
                }
                else {
                    campos[1].value = json.logradouro
                    campos[2].value = json.bairro
                    campos[3].value = json.localidade
                    campos[4].value = json.uf
                    reverterErro()
                }
            })
    }).catch((err)=>{
        exibirErro("Não foi possível encontrar o CEP")
    })

}

var precoFinal = document.querySelector("#finalPrice")

function buscarFrete(cepReme,cepDest,peso,altura,largura,comprimento ) {
    cepReme = cepReme.split("-").join("");
    cepDest = cepDest.split("-").join("");
    exibirErro("Aguarde...")
    fetch(`https://www.cepcerto.com/ws/json-frete/${cepReme}/${cepDest}/${peso}/${altura}/${largura}/${comprimento}/d3f804f484073d726c54bb177fccccd25d2ebf66`)
    .then((res)=>{
        return res.json()
        .then((json)=>{
            console.log(json)
            precoFinal.innerText = `R$${json.valorpac}`
            reverterErro()
        })
    }).catch((err)=>{
        exibirErro("Não foi possível calcular o frete")
    })

}

var boca = document.querySelector(".mouth-container")
var erroCampo = document.querySelector("#error")


function exibirErro(msg) {
    boca.classList.add('error')
    erroCampo.innerHTML = msg
    erroStatus = true
}

function reverterErro() {
    boca.classList.remove('error')
    erroCampo.innerHTML = ""
    erroStatus = false
}

var campos = document.querySelectorAll('.field')
var btnContinuar = document.querySelector('#btn')
var titulo = document.querySelector("#title-1")

var remetenteCEP
var remetenteRua
var remetenteBairro
var remetenteCidade
var remetenteEstado

var destinatarioCEP
var destinatarioRua
var destinatarioBairro
var destinatarioCidade
var destinatarioEstado

var altura
var largura
var comprimento
var peso

var erroStatus = false

var parteAtual = 0

btnContinuar.addEventListener('click',()=>{
    btnContinuar.innerText="Continuar"
    if (campos[0].value != "") {
        switch (parteAtual) {
            case 0:
                if (erroStatus == false) {
                    parteAtual++
                    btnContinuar.innerText="Inserido, clique para prosseguir!"
                }
                break;
        
            case 1:
                remetenteCEP = campos[0].value
                remetenteRua = campos[1].value
                remetenteBairro = campos[2].value
                remetenteCidade = campos[3].value
                remetenteEstado = campos[4].value
                campos[0].value = ""
                campos[1].value = ""
                campos[2].value = ""
                campos[3].value = ""
                campos[4].value = ""
                titulo.innerText = "Destinatário"
                btnContinuar.innerText="Continuar"
                if (erroStatus == false) {
                    parteAtual++
                   
                }
                break;
            
            case 2:
                destinatarioCEP = campos[0].value
                destinatarioRua = campos[1].value
                destinatarioBairro = campos[2].value
                destinatarioCidade = campos[3].value
                destinatarioEstado = campos[4].value
                if ((erroStatus == true) || (destinatarioCEP == remetenteCEP)) {
                    exibirErro("Insira um CEP diferente do Remetente")
                }
                else {
                    parteAtual++
                    btnContinuar.innerText="Inserido, clique para prosseguir!"
                    reverterErro()
                }
                break

            case 3: 
            campos[0].style.display = "none"
            campos[1].placeholder = "Altura"
            campos[2].placeholder = "Largura"
            campos[3].placeholder = "Comprimento"
            campos[4].placeholder = "Peso"
            campos[0].value = ""
            campos[1].value = ""
            campos[2].value = ""
            campos[3].value = ""
            campos[4].value = ""
            titulo.innerText = "Produto"
            break
        }

    }
    if ((campos[1].placeholder == "Altura") && (campos[1].value != '') && (campos[2].value != '') && (campos[3].value != '') && (campos[4].value != '')) {
        altura = campos[1].value
        largura = campos[2].value
        comprimento = campos[3].value
        peso = campos[4].value
        buscarFrete(remetenteCEP,destinatarioCEP,peso,altura,largura,comprimento)
    }
})




Array.from(campos).forEach((a,index)=>{
    campos[index].addEventListener('blur',()=>{

       if (campos[0].value != '') {
         buscarCep(campos[0].value)
       }
    })
})

var resultadoCEP = document.querySelector("#cep-found")
var erroCEP = document.querySelector("#erroCEP")

function buscarLogradouro(uf,cidade,logradouro) {
    fetch(`https://viacep.com.br/ws/${uf}/${cidade}/${logradouro}/json/ `)
    .then((res)=>{
        return res.json()
        .then((json)=>{
            console.log(json)
            erroCEP.innerText = ""
            resultadoCEP.innerText = json[0].cep
        })
    })
    .catch((err=>{
        erroCEP.innerText = "Lugar não encontrado"
    }))
}

var cepBTN = document.querySelector("#cep-btn")
var camposByCEP = document.querySelectorAll(".byLogradouro")

cepBTN.addEventListener("click",()=>{
    if ((camposByCEP[0]!="")&&(camposByCEP[1]!="")&&(camposByCEP[2]!="")) {
        let valorLogradouro = camposByCEP[2].value.replace(" ","+")

        buscarLogradouro(camposByCEP[0].value,camposByCEP[1].value,valorLogradouro)
    }

})

var btnBuscadorCEP = document.querySelector("#btnFindCep")
var exitBTN = document.querySelector("#exit")
var overlay = document.querySelector("#overlay")
var buscadorCEP = document.querySelector("#find-cep")

btnBuscadorCEP.addEventListener("click",()=>{
    overlay.style.display = "flex"
    buscadorCEP.style.display = "flex"
})

exitBTN.addEventListener("click",()=>{
    overlay.style.display = "none"
    buscadorCEP.style.display = "none"
})