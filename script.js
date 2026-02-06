import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const dashboard = document.getElementById("dashboard");
const novaVenda = document.getElementById("novaVenda");
const relatorio = document.getElementById("relatorio");

let grafico;

window.mostrarDashboard = function () {
  dashboard.style.display = "block";
  novaVenda.style.display = "none";
  relatorio.style.display = "none";

  carregarGraficoMensal();
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

  if (window.carregarRelatorio) {
    window.carregarRelatorio();
  }
};

window.toggleMenu = function () {
  document.querySelector(".sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
};

async function carregarGraficoMensal() {
  const canvas = document.getElementById("graficoVendas");
  if (!canvas) return;

  const vendasRef = collection(db, "vendas");
  const snapshot = await getDocs(vendasRef);

  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const totais = Array(12).fill(0);

  snapshot.forEach(doc => {
    const v = doc.data();
    if (!v.data) return;

    const mes = v.data.toDate().getMonth();
    totais[mes] += Number(v.valor);
  });

  if (grafico) grafico.destroy();

  grafico = new Chart(canvas, {
    type: "bar",
    data: {
      labels: meses,
      datasets: [{
        label: "Total vendido (R$)",
        data: totais
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

/* 👉 GARANTE QUE O GRÁFICO APAREÇA AO ABRIR A PÁGINA */
window.addEventListener("load", () => {
  mostrarDashboard();
});
