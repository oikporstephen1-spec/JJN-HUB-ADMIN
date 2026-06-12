const invoiceSupabase =
window.supabaseClient;

const tableBody =
document.getElementById(
"invoiceTableBody"
);

async function loadInvoices(){

  const { data, error } =
  await invoiceSupabase
  .from("invoices")
  .select("*")
  .order("id", {
    ascending:false
  });

  if(error){
    alert(error.message);
    return;
  }

  tableBody.innerHTML = "";

  data.forEach(invoice => {

    tableBody.innerHTML += `
    <tr>

      <td>${invoice.id}</td>

      <td>${invoice.invoice_number}</td>

      <td>
        ${invoice.customer_name || "Unknown"}
      </td>

      <td>
        ₦${Number(
          invoice.total
        ).toLocaleString()}
      </td>

      <td>

        <span style="
          color:${
            invoice.status === "Paid"
            ? "lime"
            : "orange"
          };
          font-weight:bold;
        ">

        ${invoice.status}

        </span>

      </td>

      <td>

        <button
        class="action-btn"
        onclick="viewInvoice(${invoice.id})">
        View
        </button>

        <button
        class="action-btn"
        onclick="printInvoice(${invoice.id})">
        Print
        </button>

        <button
        class="action-btn"
        onclick="emailInvoice(${invoice.id})">
        Email
        </button>

        <button
        class="action-btn"
        onclick="markPaid(${invoice.id})">
        Paid
        </button>

        <button
        class="action-btn"
        onclick="deleteInvoice(${invoice.id})">
        Delete
        </button>

      </td>

    </tr>
    `;

  });

}

async function viewInvoice(id){

  const { data, error } =
  await invoiceSupabase
  .from("invoices")
  .select("*")
  .eq("id", id)
  .single();

  if(error){
    alert(error.message);
    return;
  }

  alert(
`Invoice No: ${data.invoice_number}

Customer: ${data.customer_name}

Description: ${data.description}

Amount: ₦${Number(data.total).toLocaleString()}

Status: ${data.status}`
  );

}

async function printInvoice(id){

  const { data, error } =
  await invoiceSupabase
  .from("invoices")
  .select("*")
  .eq("id", id)
  .single();

  if(error){
    alert(error.message);
    return;
  }

  const win =
  window.open("", "_blank");

  win.document.write(`

  <html>

  <head>

  <title>
  ${data.invoice_number}
  </title>

  <style>

  body{
    font-family:Arial,sans-serif;
    background:#f4f4f4;
    padding:20px;
  }

  .invoice-card{
    max-width:1100px;
    margin:auto;
    background:#fff;
    border-radius:20px;
    overflow:hidden;
    position:relative;
    box-shadow:0 0 15px rgba(0,0,0,.15);
  }

  .watermark{
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;
  z-index:0;
  }

  .header{
    background:#000;
    color:#fff;
    text-align:center;
    padding:25px;
    position:relative;
    z-index:1;
  }

  .logo{
    width:90px;
    margin-bottom:10px;
  }

  .header h1{
    margin:5px 0;
    color:#d4a017;
  }

  .header h2{
    margin-top:10px;
    letter-spacing:2px;
  }

.cards{
  display:flex;
  gap:15px;
  padding:25px;
  position:relative;
  z-index:1;
  flex-wrap:wrap;
}

.card{
  flex:1 1 240px;
  background:#fafafa;
  border-left:4px solid #d4a017;
  padding:15px;
  border-radius:8px;
  min-height:180px;
  box-sizing:border-box;
  overflow-wrap:break-word;
}

  .card h3{
    color:#d4a017;
    margin-top:0;
    margin-bottom:15px;
  }

  .card p{
    margin:8px 0;
    line-height:1.5;
  }

  .total-card{
    background:#000;
    color:#fff;
    text-align:center;
  }

  .total-card h3{
    color:#fff;
  }

 .total-card h1{
  color:#d4a017;
  font-size:32px;
  margin-top:20px;
  word-break:break-word;
}

  .verify{
    margin:20px;
    border:2px solid #d4a017;
    border-radius:10px;
    padding:15px;
    background:#fffdf5;
    position:relative;
    z-index:1;
  }

  .verify strong{
    color:#000;
  }

  .footer{
    text-align:center;
    padding:20px;
    color:#666;
    border-top:1px solid #ddd;
    position:relative;
    z-index:1;
  }

  @media print{

  body{
    background:#fff;
    padding:0;
  }

  .invoice-card{
    box-shadow:none;
    max-width:100%;
  }

  .cards{
    flex-wrap:nowrap;
  }

  .card{
    min-height:auto;
  }

}

  </style>

  </head>

  <body>

  <div class="invoice-card">

    <div class="watermark">

  <img
  src="${window.location.origin}/assets/logo.png"
  style="
  width:500px;
  opacity:0.05;
  ">

</div>

    <div class="header">

      <img
      src="${window.location.origin}/assets/logo.png"
      class="logo">

      <h1>
      JJN HUB
      </h1>

      <p>
      Jesse & Jeslyn Nigeria Limited
      </p>

      <h2>
      PROFESSIONAL INVOICE
      </h2>

    </div>

    <div class="cards">

      <div class="card">

        <h3>
        Invoice Info
        </h3>

        <p>
        <strong>No:</strong>
        ${data.invoice_number}
        </p>

        <p>
        <strong>Date:</strong>
        ${new Date(
          data.created_at
        ).toLocaleDateString()}
        </p>

        <p>
        <strong>Due:</strong>
        ${data.due_date}
        </p>

        <p>
        <strong>Status:</strong>
        ${data.status}
        </p>

      </div>

      <div class="card">

        <h3>
        Customer
        </h3>

        <p>
        ${data.customer_name}
        </p>

        <p>
        ${data.company_name}
        </p>

        <p>
        ${data.customer_email}
        </p>

      </div>

      <div class="card">

        <h3>
        Service
        </h3>

        <p>
        ${data.description}
        </p>

        <p>
        Quantity:
        ${data.quantity}
        </p>

        <p>
        Unit Price:
        ₦${Number(
          data.unit_price
        ).toLocaleString()}
        </p>

      </div>

      <div class="card total-card">

        <h3>
        Grand Total
        </h3>

        <h1>
        ₦${Number(
          data.total
        ).toLocaleString()}
        </h1>

      </div>

    </div>

    <div class="verify">

      <strong>
      ✓ VERIFIED JJN HUB DOCUMENT
      </strong>

      <br><br>

      Reference:
      ${data.invoice_number}

      <br><br>

      Digitally generated by
      JJN HUB Business Management System.

    </div>

    <div class="footer">

      www.jjnhub.com

      <br><br>

      Automotive • Engineering • Marine • Logistics

    </div>

  </div>

  </body>

  </html>

  `);

  win.document.close();

  setTimeout(() => {

    win.print();

  }, 500);

}
async function emailInvoice(id){

  const { data, error } =
  await invoiceSupabase
  .from("invoices")
  .select("*")
  .eq("id", id)
  .single();

  if(error){
    alert(error.message);
    return;
  }

  const subject =
  `Invoice ${data.invoice_number}`;

  const body =
`Invoice Number:
${data.invoice_number}

Description:
${data.description}

Amount:
₦${Number(data.total).toLocaleString()}

Thank you for doing business with us.

JJN HUB`;

  window.location.href =
  `mailto:${data.customer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

}

async function markPaid(id){

  const { error } =
  await invoiceSupabase
  .from("invoices")
  .update({
    status:"Paid"
  })
  .eq("id", id);

  if(error){
    alert(error.message);
    return;
  }

  loadInvoices();

}

async function deleteInvoice(id){

  if(!confirm("Delete Invoice?")){
    return;
  }

  const { error } =
  await invoiceSupabase
  .from("invoices")
  .delete()
  .eq("id", id);

  if(error){
    alert(error.message);
    return;
  }

  loadInvoices();

}

window.exitInvoices = function(){

  window.location.href =
  "dashboard.html";

};

window.viewInvoice = viewInvoice;
window.printInvoice = printInvoice;
window.emailInvoice = emailInvoice;
window.markPaid = markPaid;
window.deleteInvoice = deleteInvoice;

loadInvoices();
