const customer =
JSON.parse(
localStorage.getItem(
"invoiceCustomer"
)
);

document.getElementById(
"customer_name"
).value =
customer.customer_name;

document.getElementById(
"company_name"
).value =
customer.company_name;

function calculateTotal(){

  const qty =
    Number(
      document.getElementById(
        "quantity"
      ).value
    ) || 0;

  const price =
    Number(
      document.getElementById(
        "unit_price"
      ).value
    ) || 0;

  document.getElementById(
    "total"
  ).value =
    (qty * price).toFixed(2);

}

document.getElementById(
"quantity"
).addEventListener(
"input",
calculateTotal
);

document.getElementById(
"unit_price"
).addEventListener(
"input",
calculateTotal
);

const invoiceSupabase =
window.supabaseClient;

document.getElementById(
"invoiceForm"
).addEventListener(
"submit",
async (e)=>{

e.preventDefault();

const description =
document.getElementById(
"description"
).value.trim();

const quantity =
Number(
document.getElementById(
"quantity"
).value
);

const unit_price =
Number(
document.getElementById(
"unit_price"
).value
);

const due_date =
document.getElementById(
"due_date"
).value;

const total =
Number(
document.getElementById(
"total"
).value
);
if(
  !description ||
  !quantity ||
  !unit_price ||
  !due_date
){
  alert(
    "All invoice fields are required."
  );
  return;
}
const invoice_number =
"INV-" +
Date.now();

const { error } =
await invoiceSupabase
.from("invoices")
.insert([
{
customer_id: customer.id,
customer_name: customer.customer_name,
company_name: customer.company_name,
customer_email: customer.email,
invoice_number,
description,
quantity,
unit_price,
total,
due_date,
status: "Draft"
}
]);

if(error){

alert(error.message);

return;

}

alert(
"Invoice Saved Successfully"
);

document.getElementById(
"invoiceForm"
).reset();

document.getElementById(
"customer_name"
).value =
customer.customer_name;

document.getElementById(
"company_name"
).value =
customer.company_name;

document.getElementById(
"total"
).value = "0";

}
);
function emailInvoice(){

  const description =
    document.getElementById(
      "description"
    ).value;

  const total =
    document.getElementById(
      "total"
    ).value;

  const subject =
    "JJN HUB Invoice";

  const body =
`Dear ${customer.customer_name},

Invoice Details

Description:
${description}

Total Amount:
₦${total}

Thank you for doing business with us.

JJN HUB`;

  window.location.href =
    `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

}

function closeInvoice(){

  window.location.href =
    "customers.html";

}
