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
        padding:30px;
      }

      h2{
        text-align:center;
      }

    </style>

  </head>

  <body>

    <h2>
      JJN HUB INVOICE
    </h2>

    <hr>

    <p>
      <strong>Invoice No:</strong>
      ${data.invoice_number}
    </p>

    <p>
      <strong>Customer:</strong>
      ${data.customer_name}
    </p>

    <p>
      <strong>Description:</strong>
      ${data.description}
    </p>

    <p>
      <strong>Total:</strong>
      ₦${Number(data.total).toLocaleString()}
    </p>

    <p>
      <strong>Status:</strong>
      ${data.status}
    </p>

  </body>

  </html>
  `);

  win.document.close();

  win.print();

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
