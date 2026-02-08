import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAcL7ZHc4470P0_DRJB6bTBOzjocz5JKtc",
  authDomain: "vendas-8bdec.firebaseapp.com",
  projectId: "vendas-8bdec",
  storageBucket: "vendas-8bdec.firebasestorage.app",
  messagingSenderId: "506252133539",
  appId: "1:506252133539:web:ac15699d0282d00ea9ab16"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================== DOM READY ==================
document.addEventListener("DOMContentLoaded", () => {

  // 🔥 AGORA OS ELEMENTOS EXISTEM
  const dashboard = document.getElementById("dashboard");
  const novaVenda = document.getElementById("novaVenda");
  const relatorio = document.getElementById("relatorio");
  const form = document.getElementById("formVenda");

  // ====== CONTROLE DE TELAS ======
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

  window.toggleMenu = function () {
    document.querySelector(".sidebar").classList.toggle("open");
    document.getElementById("overlay").classList.toggle("show");
  };

  // ====== SALVAR VENDA ======
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const produto = document.getElementById("produto").value;
    const valor = parseFloat(
      document.getElementById("valor").value.replace(",", ".")
    );
    const pagamento = document.getElementById("pagamento").value;
    const observacao = document.getElementById("observacao").value;


    if (isNaN(valor) || valor <= 0) {
      alert("Digite um valor válido");
      return;
    }

    await addDoc(collection(db, "vendas"), {
      produto,
      valor,
      pagamento,
      observacao,
      data: Timestamp.now()
    });

    alert("Venda salva 🚀");
    form.reset();
    window.mostrarDashboard();
  });

  // 🚀 PRIMEIRA TELA AO ABRIR
  window.mostrarDashboard();
});

// ================== DASHBOARD ==================
async function carregarDashboard() {
  const q = query(collection(db, "vendas"), orderBy("data", "desc"));
  const snapshot = await getDocs(q);

  let total = 0;
  let qtd = 0;

  const lista = document.getElementById("listaVendas");
  lista.innerHTML = "";

  snapshot.forEach(doc => {
    const v = doc.data();
    qtd++;
    total += Number(v.valor);

    const li = document.createElement("li");
    li.textContent = `${v.produto} - R$ ${v.valor.toFixed(2)} (${v.pagamento})`;
    lista.appendChild(li);
  });

  document.getElementById("totalVendas").textContent = qtd;
  document.getElementById("faturamento").textContent = total.toFixed(2);
}

// ================== RELATÓRIO ==================
async function carregarRelatorio() {
  const q = query(collection(db, "vendas"), orderBy("data", "desc"));
  const snapshot = await getDocs(q);

  const lista = document.getElementById("listaRelatorio");
  const totalSpan = document.getElementById("totalRelatorio");

  lista.innerHTML = "";
  let total = 0;

  snapshot.forEach(doc => {
    const v = doc.data();
    const data = v.data.toDate();

    total += Number(v.valor);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.toLocaleDateString("pt-BR")}</td>
      <td>${data.toLocaleTimeString("pt-BR")}</td>
      <td>${v.produto}</td>
      <td>${v.pagamento}</td>
      <td>${v.observacao || "-"}</td>
      <td>R$ ${v.valor.toFixed(2)}</td>
    `;
    lista.appendChild(tr);
  });

  totalSpan.textContent = total.toFixed(2);
}




