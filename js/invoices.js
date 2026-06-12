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
  .order("id",
  {
    ascending:false
  });

  if(error){

    alert(error.message);

    return;

  }

  tableBody.innerHTML = "";

  data.forEach(invoice=>{

    tableBody.innerHTML += `
    <tr>

      <td>${invoice.id}</td>

      <td>
        ${invoice.invoice_number}
      </td>

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

Total: ₦${Number(data.total).toLocaleString()}

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
    background:#f5f5f5;
    padding:30px;
  }

  .invoice-card{
    max-width:650px;
    margin:auto;
    background:#fff;
    border-radius:15px;
    overflow:hidden;
    box-shadow:0 0 20px rgba(0,0,0,.15);
  }

  .header{
    background:#111;
    color:#fff;
    text-align:center;
    padding:30px;
  }

  .logo{
    width:90px;
    margin-bottom:10px;
  }

  .company{
    font-size:28px;
    font-weight:bold;
    color:#d4a017;
  }

  .subtitle{
    margin-top:5px;
    font-size:14px;
  }

  .invoice-title{
    margin-top:15px;
    font-size:22px;
    letter-spacing:2px;
  }

  .content{
    padding:30px;
  }

  .section{
    margin-bottom:25px;
  }

  .section-title{
    color:#d4a017;
    font-weight:bold;
    margin-bottom:10px;
    text-transform:uppercase;
  }

  .amount-box{
    background:#111;
    color:#fff;
    text-align:center;
    padding:20px;
    border-radius:10px;
    margin-top:20px;
  }

  .amount-box h1{
    margin:0;
    color:#d4a017;
    font-size:36px;
  }

  .footer{
    text-align:center;
    font-size:13px;
    color:#666;
    padding:20px;
    border-top:1px solid #ddd;
  }

  .row{
    margin:8px 0;
  }

  .label{
    font-weight:bold;
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

      <div class="invoice-title">
      PROFESSIONAL INVOICE
      </div>

    </div>

    <div class="content">

      <div class="section">

        <div class="section-title">
        Invoice Information
        </div>

        <div class="row">
        <span class="label">
        Invoice No:
        </span>
        ${data.invoice_number}
        </div>

        <div class="row">
        <span class="label">
        Date:
        </span>
        ${new Date(
          data.created_at
        ).toLocaleDateString()}
        </div>

        <div class="row">
        <span class="label">
        Status:
        </span>
        ${data.status}
        </div>

      </div>

      <div class="section">

        <div class="section-title">
        Customer
        </div>

        <div class="row">
        ${data.customer_name}
        </div>

        <div class="row">
        ${data.company_name}
        </div>

        <div class="row">
        ${data.customer_email}
        </div>

      </div>

      <div class="section">

        <div class="section-title">
        Service Description
        </div>

        <div class="row">
        ${data.description}
        </div>

        <div class="row">
        Qty: ${data.quantity}
        </div>

        <div class="row">
        Unit Price:
        ₦${Number(
          data.unit_price
        ).toLocaleString()}
        </div>

      </div>

      <div class="amount-box">

        <div>
        TOTAL AMOUNT
        </div>

        <h1>
        ₦${Number(
          data.total
        ).toLocaleString()}
        </h1>

      </div>

      <div class="section">

        <div class="section-title">
        Verification
        </div>

        <div class="row">
        Generated by JJN HUB
        Business Management System
        </div>

        <div class="row">
        Reference:
        ${data.invoice_number}
        </div>

        <div class="row">
        This invoice is digitally
        generated and valid without
        signature.
        </div>

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
  .eq("id",id);

  if(error){

    alert(error.message);

    return;

  }

  alert(
    "Invoice Marked Paid"
  );

  loadInvoices();

}

async function deleteInvoice(id){

  if(
    !confirm(
      "Delete Invoice?"
    )
  ){
    return;
  }

  const { error } =
  await invoiceSupabase
  .from("invoices")
  .delete()
  .eq("id",id);

  if(error){

    alert(error.message);

    return;

  }

  alert(
    "Invoice Deleted"
  );

  loadInvoices();

}

function exitInvoices(){

  window.location.href =
  "dashboard.html";

}

loadInvoices();
