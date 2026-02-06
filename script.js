import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ELEMENTOS */
const dashboard = document.getElementById("dashboard");
const novaVenda = document.getElementById("novaVenda");
const relatorio = document.getElementById("relatorio");

/* MENU */
window.toggleMenu = function () {
  document.querySelector(".sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
};

/* NAVEGAÇÃO */
window.mostrarDashboard = function () {
  dashboard.style.display = "block";
  novaVenda.style.display = "none";
  relatorio.style.display = "none";
  carregarDashboard();
};

window.mostrarNovaVenda = function () {
  dashboard.style.display = "none";
  novaVenda.style.display = "block";
  relatorio.style.display = "none";
};

window.mostrarRelatorio = function () {
  dashboard.style.display = "none";
  novaVenda.style.display = "none";
  relatorio.style.display = "block";
  carregarRelatorio();
};

/* REGISTRAR VENDA */
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

  alert("Venda salva 🚀");
  form.reset();
  mostrarDashboard();
});

/* DASHBOARD */
async function carregarDashboard() {
  const q = query(collection(db, "vendas"), orderBy("data", "desc"));
  const snap = await getDocs(q);

  let total = 0;
  let qtd = 0;

  const lista = document.getElementById("listaVendas");
  lista.innerHTML = "";

  snap.forEach(doc => {
    const v = doc.data();
    qtd++;
    total += v.valor;

    const li = document.createElement("li");
    li.textContent = `${v.produto} - R$ ${v.valor.toFixed(2)} (${v.pagamento})`;
    lista.appendChild(li);
  });

  document.getElementById("totalVendas").textContent = qtd;
  document.getElementById("faturamento").textContent = total.toFixed(2);
}

/* RELATÓRIO */
async function carregarRelatorio() {
  const q = query(collection(db, "vendas"), orderBy("data", "desc"));
  const snap = await getDocs(q);

  const lista = document.getElementById("listaRelatorio");
  const totalSpan = document.getElementById("totalRelatorio");

  lista.innerHTML = "";
  let total = 0;

  snap.forEach(doc => {
    const v = doc.data();
    const d = v.data.toDate();
    total += v.valor;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.toLocaleDateString("pt-BR")}</td>
      <td>${d.toLocaleTimeString("pt-BR")}</td>
      <td>${v.produto}</td>
      <td>${v.pagamento}</td>
      <td>R$ ${v.valor.toFixed(2)}</td>
    `;
    lista.appendChild(tr);
  });

  totalSpan.textContent = total.toFixed(2);
}

/* INICIAR */
document.addEventListener("DOMContentLoaded", () => {
  mostrarDashboard();
});
