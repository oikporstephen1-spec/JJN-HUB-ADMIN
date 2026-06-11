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
);

const price =
Number(
document.getElementById(
"unit_price"
).value
);

document.getElementById(
"total"
).value =
qty * price;

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

const invoice_number =
"INV-" +
Date.now();

const { error } =
await invoiceSupabase
.from("invoices")
.insert([
{
customer_id:
customer.id,
invoice_number,
description,
quantity,
unit_price,
total,
due_date
}
]);

if(error){

alert(error.message);

return;

}

alert(
"Invoice Saved Successfully"
);

}
);
