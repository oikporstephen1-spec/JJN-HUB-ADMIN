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

  <title>${data.invoice_number}</title>

  <style>

  body{
    font-family:Arial,sans-serif;
    background:#f2f2f2;
    padding:20px;
  }

  .invoice-card{
    max-width:700px;
    margin:auto;
    background:#fff;
    border-radius:15px;
    overflow:hidden;
    box-shadow:0 0 15px rgba(0,0,0,.15);
  }

  .header{
    background:#000;
    color:#fff;
    text-align:center;
    padding:25px;
  }

  .logo{
    width:90px;
    margin-bottom:10px;
  }

  .company{
    color:#d4a017;
    font-size:32px;
    font-weight:bold;
  }

  .subtitle{
    margin-top:5px;
  }

  .content{
    padding:25px;
  }

  .section-title{
    color:#d4a017;
    font-weight:bold;
    margin-bottom:10px;
    font-size:18px;
  }

  .info-box{
    background:#fafafa;
    border-left:4px solid #d4a017;
    padding:15px;
    margin-bottom:20px;
  }

  table{
    width:100%;
    border-collapse:collapse;
  }

  th{
    background:#111;
    color:#fff;
    padding:10px;
  }

  td{
    border:1px solid #ddd;
    padding:10px;
  }

  .total-box{
    background:#000;
    color:#fff;
    text-align:center;
    padding:20px;
    border-radius:10px;
    margin-top:20px;
  }

  .total-box h1{
    color:#d4a017;
    font-size:48px;
    margin:10px 0;
  }

  .verify-box{
    margin-top:20px;
    border:2px solid #d4a017;
    padding:15px;
    border-radius:10px;
  }

  .footer{
    text-align:center;
    padding:20px;
    color:#666;
    border-top:1px solid #ddd;
  }

  </style>

  </head>

  <body>

  <div class="invoice-card">

    <div class="header">

      <img
      src="${window.location.origin}/assets/logo.png"
      class="logo">

      <div class="company">
      JJN HUB
      </div>

      <div class="subtitle">
      Jesse & Jeslyn Nigeria Limited
      </div>

      <h2>
      PROFESSIONAL INVOICE
      </h2>

    </div>

    <div class="content">

      <div class="section-title">
      INVOICE INFORMATION
      </div>

      <div class="info-box">

        <p><strong>Invoice No:</strong>
        ${data.invoice_number}</p>

        <p><strong>Issue Date:</strong>
        ${new Date(data.created_at).toLocaleDateString()}</p>

        <p><strong>Due Date:</strong>
        ${data.due_date}</p>

        <p><strong>Status:</strong>
        ${data.status}</p>

      </div>

      <div class="section-title">
      BILL TO
      </div>

      <div class="info-box">

        <p>${data.customer_name}</p>

        <p>${data.company_name}</p>

        <p>${data.customer_email}</p>

      </div>

      <div class="section-title">
      SERVICE DETAILS
      </div>

      <table>

        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Amount</th>
        </tr>

        <tr>
          <td>${data.description}</td>
          <td>${data.quantity}</td>
          <td>
          ₦${Number(data.total).toLocaleString()}
          </td>
        </tr>

      </table>

      <div class="total-box">

        <div>GRAND TOTAL</div>

        <h1>
        ₦${Number(data.total).toLocaleString()}
        </h1>

      </div>

      <div class="verify-box">

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

function exitInvoices(){

  window.location.href =
  "dashboard.html";

}

loadInvoices();
