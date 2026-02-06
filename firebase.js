import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formVenda");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const produto = document.getElementById("produto").value;
    const valorInput = document.getElementById("valor").value.replace(",", ".");
    const valor = parseFloat(valorInput);
    if (isNaN(valor) || valor <= 0) {
      alert("Digite um valor válido");
      return;
    }

    const pagamento = document.getElementById("pagamento").value;

    await addDoc(collection(db, "vendas"), {
      produto,
      valor: Number(valor),
      pagamento,
      data: Timestamp.fromDate(new Date()),       // Timestamp oficial
      dataTexto: new Date().toLocaleString('pt-BR') // opcional, pra mostrar bonito
    });

    alert("Venda salva 🚀");
    form.reset();
    window.mostrarDashboard();
    window.carregarDashboard();
  });

  // Carrega dashboard inicial
  window.mostrarDashboard();
});

// Função dashboard
window.carregarDashboard = async function () {
  const q = query(collection(db, "vendas"), orderBy("data", "desc"));
  const snapshot = await getDocs(q);

  let total = 0;
  let qtd = 0;

  const lista = document.getElementById("listaVendas");
  lista.innerHTML = "";

  snapshot.forEach(doc => {
    const v = doc.data();
    qtd++;
    total += v.valor;

    const li = document.createElement("li");
    li.textContent = `${v.produto} - R$ ${v.valor.toFixed(2)} (${v.pagamento})`;
    lista.appendChild(li);
  });

  document.getElementById("totalVendas").textContent = qtd;
  document.getElementById("faturamento").textContent = total.toFixed(2);
};

// Função relatório
window.carregarRelatorio = async function () {
  const q = query(collection(db, "vendas"), orderBy("data", "desc"));
  const snapshot = await getDocs(q);

  const lista = document.getElementById("listaRelatorio");
  const totalSpan = document.getElementById("totalRelatorio");

  lista.innerHTML = "";
  let total = 0;

  snapshot.forEach(doc => {
    const v = doc.data();
    if (!v.data || !v.valor) return;

    const data = v.data.toDate(); // agora funciona corretamente
    total += Number(v.valor);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.toLocaleDateString("pt-BR")}</td>
      <td>${data.toLocaleTimeString("pt-BR")}</td>
      <td>${v.produto}</td>
      <td>${v.pagamento}</td>
      <td>R$ ${Number(v.valor).toFixed(2)}</td>
    `;
    lista.appendChild(tr);
  });

  totalSpan.textContent = total.toFixed(2);
};
