const dashboard = document.getElementById("dashboard");
const novaVenda = document.getElementById("novaVenda");
const relatorio = document.getElementById("relatorio");

window.mostrarDashboard = function () {
  dashboard.style.display = "block";
  novaVenda.style.display = "none";
  relatorio.style.display = "none";
}

window.mostrarNovaVenda = function () {
  dashboard.style.display = "none";
  novaVenda.style.display = "block";
  relatorio.style.display = "none";
}

window.mostrarRelatorio = function () {
  dashboard.style.display = "none";
  novaVenda.style.display = "none";
  relatorio.style.display = "block";

  if (window.carregarRelatorio) {
    window.carregarRelatorio();
  }
}

window.toggleMenu = function () {
  document.querySelector(".sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

