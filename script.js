const dashboard = document.getElementById("dashboard");
const novaVenda = document.getElementById("novaVenda");

window.mostrarDashboard = function () {
  dashboard.style.display = "block";
  novaVenda.style.display = "none";
}

window.mostrarNovaVenda = function () {
  dashboard.style.display = "none";
  novaVenda.style.display = "block";
}

window.toggleMenu = function () {
  document.querySelector(".sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}
