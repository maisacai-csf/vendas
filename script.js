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
const relatorio = document.getElementById("relatorio");

window.mostrarRelatorio = function () {
  dashboard.style.display = "none";
  novaVenda.style.display = "none";
  relatorio.style.display = "block";
  window.carregarRelatorio();
}
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
