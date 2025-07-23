function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function renderLists() {
  const serials = getFromStorage("serials");
  const companies = getFromStorage("companies");
  const reports = getFromStorage("reports");

  const serialList = document.getElementById("serialList");
  const companyList = document.getElementById("companyList");
  const reportList = document.getElementById("reportList");

  const selectSerial = document.getElementById("selectSerial");
  const selectCompany = document.getElementById("selectCompany");

  serialList.innerHTML = "";
  companyList.innerHTML = "";
  reportList.innerHTML = "";
  selectSerial.innerHTML = "";
  selectCompany.innerHTML = "";

  serials.forEach((serial, index) => {
    serialList.innerHTML += `<li>${serial}</li>`;
    selectSerial.innerHTML += `<option value="${index}">${serial}</option>`;
  });

  companies.forEach((company, index) => {
    companyList.innerHTML += `<li>${company.name} - ${company.address}</li>`;
    selectCompany.innerHTML += `<option value="${index}">${company.name}</option>`;
  });

  reports.forEach((report) => {
    const serial = serials[report.serialIndex];
    const company = companies[report.companyIndex];
    reportList.innerHTML += `<li><strong>${company.name}</strong> (${serial}) - ${report.details}</li>`;
  });
}

function addSerial() {
  const serial = document.getElementById("serialNumber").value.trim();
  if (!serial) return;
  const serials = getFromStorage("serials");
  serials.push(serial);
  saveToStorage("serials", serials);
  document.getElementById("serialNumber").value = "";
  renderLists();
}

function addCompany() {
  const name = document.getElementById("companyName").value.trim();
  const address = document.getElementById("companyAddress").value.trim();
  if (!name || !address) return;
  const companies = getFromStorage("companies");
  companies.push({ name, address });
  saveToStorage("companies", companies);
  document.getElementById("companyName").value = "";
  document.getElementById("companyAddress").value = "";
  renderLists();
}

function addServiceReport() {
  const serialIndex = document.getElementById("selectSerial").value;
  const companyIndex = document.getElementById("selectCompany").value;
  const details = document.getElementById("serviceDetails").value.trim();
  if (!details) return;
  const reports = getFromStorage("reports");
  reports.push({ serialIndex, companyIndex, details });
  saveToStorage("reports", reports);
  document.getElementById("serviceDetails").value = "";
  renderLists();
}

// Initial render
renderLists();