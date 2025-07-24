// Storage helpers
function saveToStorage(k,d){localStorage.setItem(k,JSON.stringify(d))}
function getFromStorage(k){return JSON.parse(localStorage.getItem(k)||"[]")}

// Render UI
function renderLists(){
  const serials=getFromStorage("serials");
  const companies=getFromStorage("companies");
  const reports=getFromStorage("reports");
  document.getElementById("serialList").innerHTML=serials.map(s=>`<li>${s}</li>`).join("");
  document.getElementById("companyList").innerHTML=companies.map(c=>`<li>${c.name} - ${c.address} (${c.contact})</li>`).join("");
  document.getElementById("reportList").innerHTML=reports.map(r=>{
    const comp=companies[r.companyIndex], ser=serials[r.serialIndex];
    return `<li>${comp.name} / ${ser} / Eng: ${r.engineer} / Act:${r.action}</li>`;
  }).join("");
  document.getElementById("selectSerial").innerHTML=serials.map((s,i)=>`<option value="${i}">${s}</option>`).join("");
  document.getElementById("selectCompany").innerHTML=companies.map((c,i)=>`<option value="${i}">${c.name}</option>`).join("");
}

// Add items
function addSerial(){
  const v=document.getElementById("serialNumber").value.trim();
  if(v){const a=getFromStorage("serials");a.push(v);saveToStorage("serials",a);} document.getElementById("serialNumber").value="";
  renderLists();
}

function addCompany(){
  const name=document.getElementById("companyName").value.trim();
  const address=document.getElementById("companyAddress").value.trim();
  const contact=document.getElementById("companyContact").value.trim();
  if(name&&address){
    const a=getFromStorage("companies");
    a.push({name,address,contact});
    saveToStorage("companies",a);
  }
  ["companyName","companyAddress","companyContact"].forEach(id=>document.getElementById(id).value="");
  renderLists();
}

function addServiceReport(){
  const r={
    serialIndex:+document.getElementById("selectSerial").value,
    companyIndex:+document.getElementById("selectCompany").value,
    engineer:document.getElementById("engineerName").value.trim(),
    make:document.getElementById("make").value.trim(),
    capacity:document.getElementById("capacity").value.trim(),
    complaint:document.getElementById("complaint").value.trim(),
    action:document.getElementById("action").value.trim()
  };
  const arr=getFromStorage("reports");arr.push(r);saveToStorage("reports",arr);
  ["engineerName","make","capacity","complaint","action"].forEach(id=>document.getElementById(id).value="");
  renderLists();
}

function downloadExcel(){
  const serials=getFromStorage("serials"),companies=getFromStorage("companies"),reports=getFromStorage("reports");
  const data=reports.map(r=>({
    Serial:serials[r.serialIndex],
    Company:companies[r.companyIndex].name,
    Contact:companies[r.companyIndex].contact,
    Engineer:r.engineer,Make:r.make,Capacity:r.capacity,
    Complaint:r.complaint,Action:r.action
  }));
  const ws=XLSX.utils.json_to_sheet(data);
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Reports");
  XLSX.writeFile(wb,"ServiceReports.xlsx");
}

function printPDF(){
  const serials=getFromStorage("serials"),companies=getFromStorage("companies"),reports=getFromStorage("reports");
  const r=reports[reports.length-1];if(!r){alert("No report to print");return;}

  const comp=companies[r.companyIndex], ser=serials[r.serialIndex];
  const today=new Date().toLocaleDateString();

  const html=`
  <div style="margin:auto;width:800px;">
    ${document.getElementById("letterhead").outerHTML}
    <h2 style="text-align:center;">SERVICE REPORT</h2>
    <table border="1" width="100%" cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
      <tr>
        <td><strong>Customer:</strong><br>${comp.name}<br>${comp.address}</td>
        <td><strong>Contact:</strong> ${comp.contact}<br><strong>Date:</strong> ${today}</td>
      </tr>
    </table>
    <p><strong>Engineer:</strong> ${r.engineer}</p>
    <table border="1" width="100%" cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
      <tr><th>Make</th><th>Capacity</th><th>Serial No.</th></tr>
      <tr><td>${r.make}</td><td>${r.capacity}</td><td>${ser}</td></tr>
    </table>
    <p><strong>Complaint:</strong> ${r.complaint}</p>
    <p><strong>Action Taken:</strong> ${r.action}</p>
    <br>
    <table width="100%">
      <tr><td style="border-top:1px solid #000;">Customer Signature</td><td style="border-top:1px solid #000;">Engineer Signature</td></tr>
    </table>
  </div>`;

  const orig=document.body.innerHTML;
  document.body.innerHTML=html;
  window.print();
  document.body.innerHTML=orig;
  renderLists();
}

window.addEventListener("load",renderLists);