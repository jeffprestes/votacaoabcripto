const VotacaoAssembleiaABI = [{"constant":true,"inputs":[],"name":"totalDeVotantes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"numeroProposta","type":"uint256"}],"name":"propostaAprovada","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"indiceVotante","type":"uint256"}],"name":"pesquisarVotantePorIndice","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"qualTextoDaProposta","type":"string"},{"name":"qualProponente","type":"address"},{"name":"qualQuotaMinimaParaAprovacao","type":"uint256"}],"name":"incluiProposta","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"detalhesAssembleia","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"qualDataInicioVotacao","type":"uint256"}],"name":"definirInicioVotacao","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"qualDataFimVotacao","type":"uint256"}],"name":"definirFimVotacao","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"quandoEncerraVotacao","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"numeroProposta","type":"uint256"},{"name":"favoravelAProposta","type":"uint8"}],"name":"votar","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"numeroProposta","type":"uint256"}],"name":"pesquisarProposta","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"qualMotivoDaConvocatoria","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"indiceVotante","type":"address"}],"name":"pesquisarVotante","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"enderecoVotante","type":"address"},{"name":"quotaDeVotos","type":"uint256"},{"name":"qualIDVotante","type":"string"}],"name":"incluiVotante","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalDePropostas","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"secretarioDesignado","type":"address"}],"name":"designarSecretario","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"qualMotivoConvocatoria","type":"string"},{"name":"eNecessarioSecretario","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"quemVotou","type":"address"},{"indexed":false,"name":"propostaVotada","type":"uint256"},{"indexed":false,"name":"qualVoto","type":"uint8"}],"name":"Votou","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"quando","type":"uint256"},{"indexed":false,"name":"quemVotou","type":"address"},{"indexed":false,"name":"propostaVotada","type":"uint256"},{"indexed":false,"name":"qualVoto","type":"uint8"}],"name":"FoiAUrna","type":"event"}];
const contractAddress = "0xccd87ebe58f7f6a3eddefb1ee443c7ed9cf9b9b1";
var contract;
var conta;
var trxObj;


window.addEventListener('load', async (event) => {
    // Navegadores com novo Metamask    
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Solicita acesso a carteira Ethereum se necessário
            ethereum.enable();
            console.log("É o Metamask? " + web3.givenProvider.isMetaMask);
            estaConectado();
        } catch (err) { // Usuário ainda não deu permissão para acessar a carteira Ethereum     
            console.error(err);   
            alert('Por favor, dê permissão para acessarmos a sua carteira Ethereum.');
            return false;
        }
    } else {
        if (window.web3 != null) {
            window.web3 = new Web3(web3.currentProvider);
            console.log("É o Metamask? " + web3.givenProvider.isMetaMask);
            estaConectado();
        } else { 
            alert('Para utilizar os nossos serviços você precisa instalar o Metamask. Por favor, visite: metamask.io');
            return false;
        }
    }
});


function instanciaContrato() {
    contract = new web3.eth.Contract(VotacaoAssembleiaABI, contractAddress); 
}

function verificaConta() {
    if (web3 != null) {
        web3.eth.getAccounts(function(err, accounts) {
            if (err != null) {
                console.error(err);
            } else {
                conta = accounts[0];
                exibeStatusConexao();
                trxObj = {from: conta, gas: 4000000, value: 0}
                var evt = $.Event('smartcontractdisponivel');
                evt.state = true;
                $(window).trigger(evt);
            }
        });
    }
}

function exibeStatusConexao() {
    let objStatus = document.getElementById("conectado");
    objStatus.innerText = "Sim";
    let objLink = document.getElementById("linkContrato");
    objLink.setAttribute("href", "https://rinkeby.etherscan.io/address/" + contractAddress);
    objLink.innerText = contractAddress;
}

function setupContaEContrato() {
    instanciaContrato();
    verificaConta();
}

function estaConectado() {
    web3.eth.net.isListening().then(function() {
        setupContaEContrato();
    })
    .catch(e => console.log('Não, não esta conectado. Erro: ' + e));
}

function obterTotalDeVotantes() {
    if (verificaCondicoesInteragirSmartContract()) {
        contract.methods.totalDeVotantes().call({from: conta, gas: 3000000, value: 0}, function (err, result) {
            if (err)    {
                console.error(err);
            } else {
                var nroVotantes = result*1;
                if (nroVotantes>0) {
                    let objStatus = document.getElementById("conectado");
                    objStatus.innerText = "Sim";
                }
            }
        });
    }
}

function verificaCondicoesInteragirSmartContract() {
    if (web3 != null && contract != null && conta != null) {
        return true;
    } else {
        console.log(web3 != null)
        console.log(contract != null)
        console.log(conta != null)
        return false;
    }
}