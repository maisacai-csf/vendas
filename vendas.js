import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("formVenda");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const produto = document.getElementById("produto").value;
  const valor = parseFloat(
    document.getElementById("valor").value.replace(",", ".")
  );
  const pagamento = document.getElementById("pagamento").value;

  if (isNaN(valor) || valor <= 0) {
    alert("Digite um valor válido");
    return;
  }

  await addDoc(collection(db, "vendas"), {
    produto,
    valor,
    pagamento,
    data: new Date()
  });

  form.reset();
  window.mostrarDashboard();
  carregarDashboard();
});

window.carregarDashboard = async function () {
  const q = query(collection(db, "vendas"), orderBy("data", "desc"));
  const snapshot = await getDocs(q);

  let total = 0;
  let qtd = 0;

  listaVendas.innerHTML = "";

  snapshot.forEach(doc => {
    const v = doc.data();
    if (!v.valor) return;

    qtd++;
    total += Number(v.valor);

    const li = document.createElement("li");
    li.textContent = `${v.produto} - R$ ${v.valor.toFixed(2)} (${v.pagamento})`;
    listaVendas.appendChild(li);
  });

  totalVendas.textContent = qtd;
  faturamento.textContent = total.toFixed(2);
};

window.carregarRelatorio = async function () {
  const q = query(collection(db, "vendas"), orderBy("data", "desc"));
  const snapshot = await getDocs(q);

  listaRelatorio.innerHTML = "";
  let total = 0;

  snapshot.forEach(doc => {
    const v = doc.data();
    if (!v.data) return;

    const d = v.data.toDate();
    total += Number(v.valor);

    listaRelatorio.innerHTML += `
      <tr>
        <td>${d.toLocaleDateString("pt-BR")}</td>
        <td>${d.toLocaleTimeString("pt-BR")}</td>
        <td>${v.produto}</td>
        <td>${v.pagamento}</td>
        <td>R$ ${v.valor.toFixed(2)}</td>
      </tr>
    `;
  });

  totalRelatorio.textContent = total.toFixed(2);
};

carregarDashboard();
