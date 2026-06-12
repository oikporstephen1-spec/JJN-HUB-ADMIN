alert("Invoices JS Loaded");
const invoiceSupabase =
window.supabaseClient;

const tableBody =
document.getElementById(
"invoiceTableBody"
);
console.log("Invoices JS Loaded");
console.log("TABLE:", tableBody);
console.log("SUPABASE:", invoiceSupabase);

async function loadInvoices(){

  const { data, error } =
  await invoiceSupabase
  .from("invoices")
  .select("*")
  .order("id",
  {
    ascending:false
  });
console.log("DATA:", data);
console.log("ERROR:", error);
  
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
        ${invoice.status}
      </td>

      <td>

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

loadInvoices();
