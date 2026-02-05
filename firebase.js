import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
    data: new Date(),
    dataTexto: new Date().toLocaleString('pt-BR')
  });

  alert("Venda salva 🚀");
  form.reset();
  window.mostrarDashboard();
  window.carregarDashboard();
});

window.carregarDashboard = async function () {
  const q = query(collection(db, "vendas"), orderBy("data", "desc"));
  const querySnapshot = await getDocs(q);

  let total = 0;
  let qtd = 0;

  const lista = document.getElementById("listaVendas");
  lista.innerHTML = "";

  querySnapshot.forEach((doc) => {
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
window.carregarRelatorio = async function () {
  const q = query(collection(db, "vendas"), orderBy("data", "desc"));
  const querySnapshot = await getDocs(q);

  const lista = document.getElementById("listaRelatorio");
  lista.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const v = doc.data();
    const li = document.createElement("li");
    li.textContent = `${v.dataTexto} — ${v.produto} — R$ ${v.valor.toFixed(2)} — ${v.pagamento}`;
    lista.appendChild(li);
  });
};

window.carregarDashboard();
