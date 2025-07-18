// Seleciona os elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista
const expenselist = document.querySelector("ul");
const expensequantity = document.querySelector("aside header p span");
const expensestotal = document.querySelector("aside header h2");

// Captura o evento de input para formatar o valor em centavos
amount.oninput = () => {
    // Faz aceitar só números
    let value = amount.value.replace(/\D/g, "");
    // Transforma o valor em reais (divide por 100 para ajustar centavos)
    value = Number(value) / 100;
    // Formata o valor como moeda BRL
    amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
    // Formata o valor para o formato de moeda brasileiro
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Captura o evento de submit do formulário para obter os valores
form.onsubmit = (event) => {
    // Faz com que a página não recarregue
    event.preventDefault();

    // Cria um objeto com detalhes da nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value.replace("R$", ""), // Remove o símbolo R$ para cálculo se necessário
        created_at: new Date(),
    };

    // Chama a função que irá adicionar o item na lista
    expenseAdd(newExpense);
};

function expenseAdd(newExpense) {
    try {
        // Cria o elemento de li para adicionar o item (li) na lista (ul)
        const expenseItem = document.createElement("li");
        expenseItem.classList.add("expense");

        // Cria o ícone da categoria
        const expenseIcon = document.createElement("img");
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute("alt", newExpense.category_name);

        // Cria a info da despesa
        const expenseInfo = document.createElement("div");
        expenseInfo.classList.add("expense-info");

        // Cria o nome da despesa
        const expenseName = document.createElement("strong");
        expenseName.textContent = newExpense.expense;

        // Cria a categoria da despesa
        const expenseCategory = document.createElement("span");
        expenseCategory.textContent = newExpense.category_name;

        // Adiciona name e category na div das informações da despesa
        expenseInfo.append(expenseName, expenseCategory);

        // Cria o valor da despesa
        const expenseAmount = document.createElement("span");
        expenseAmount.classList.add("expense-amount");
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount}`;

        // Cria o ícone de remover
        const removeIcon = document.createElement("img");
        removeIcon.classList.add("remove-icon");
        removeIcon.setAttribute("src", "img/remove.svg");
        removeIcon.setAttribute("alt", "remover");

        // Adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

        // Adiciona o item na lista
        expenselist.append(expenseItem);

        // Limpa o formulário após adicionar
        form.reset();

        //limpa o formulario para adicionar uma nova despesa
        formclear();

        //atualiza os totais
        updateTotals();

    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas");
        console.log(error);
    }
}

//atualiza os totais
function updateTotals() {
    try{
        //recupera todos os itens da lista
        const items = expenselist.children

    //atualiza a quantidade de itens  da lista 
    expensequantity.textContent =`${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    //variável para armazenar o total
    let total = 0;
    //percorre cada item(li) da lista (ul)
    for(let item = 0; item <items.length; item++){
        const itemamount = items[item].querySelector(".expense-amount")

        //remove caracteres nao numericos e substitui a virula por ponto
        let value = itemamount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

        //converte o valor para float
        value = parseFloat(value);

        //verifica se um numero valido
        if(isNaN(value)){
            return alert("Valor inválido encontrado na lista de despesas");
        }
         //incrementa o total
        total += Number(value)
    }

    //cria a spon para adicionar o R$ formatado
    const symbomBRL = document.createElement("small");
    symbomBRL.textContent = "R$";

    //formata o valor e remove o símbolo R$ que sera exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")
    //limpa o conteudo do elemento
    expensestotal.innerHTML = "";
    //adicionao simbolo e o total formatado
    expensestotal.append(symbomBRL, total);

    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os totais")  
    }
}

//evento que captura o clique nos itens da lista
expenselist.addEventListener("click", function(event){
    //verifica se o elemento clicado é o ícone de remover
    if(event.target.classList.contains("remove-icon")){
        //obtem a li pai do elemento clicado
        const item = event.target.closest(".expense")
        //remove o item da lista
        item.remove()
        //atualiza o total
        updateTotals()
    }
})

function formclear(){
    expense.value = ""
    category.value = ""
    amount.value = ""

    //colocao o foco no campo do input
    expense.focus()
}