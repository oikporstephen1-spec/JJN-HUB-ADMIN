const customerSupabase = window.supabaseClient;

const form = document.getElementById("customerForm");
const tableBody = document.getElementById("customerTableBody");

async function loadCustomers() {

  const { data, error } = await customerSupabase
    .from("customers")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  tableBody.innerHTML = "";

  data.forEach(customer => {

    tableBody.innerHTML += `
      <tr>
        <td>${customer.id}</td>
        <td>${customer.customer_name}</td>
        <td>${customer.company_name}</td>
        <td>${customer.email}</td>
        <td>${customer.phone}</td>
        <td>
          <button
            class="action-btn"
            onclick="viewCustomer(${customer.id})">
            View
          </button>
        </td>
      </tr>
    `;

  });

}

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const customer_name =
    document.getElementById("customer_name").value.trim();

  const company_name =
    document.getElementById("company_name").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  const address =
    document.getElementById("address").value.trim();

  try {

    const { error } = await customerSupabase
      .from("customers")
      .insert([
        {
          customer_name,
          company_name,
          email,
          phone,
          address
        }
      ]);

    if (error) throw error;

    alert("Customer Added Successfully");

    form.reset();

    await loadCustomers();

  } catch (err) {

    console.error(err);
    alert(err.message);

  }

});

async function viewCustomer(id) {

  const { data, error } = await customerSupabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    alert(error.message);
    return;
  }
currentCustomer = data;
  document.getElementById("customerDetails").innerHTML = `
    <p><strong>Name:</strong> ${data.customer_name}</p>
    <p><strong>Company:</strong> ${data.company_name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Address:</strong> ${data.address}</p>
    <hr>
  `;

  document.getElementById("customerModal").style.display = "flex";

}

function closeCustomerModal() {

  document.getElementById("customerModal").style.display = "none";

}

loadCustomers();
// CURRENT CUSTOMER
let currentCustomer = null;


// PRINT RECEIPT
function printReceipt(){

window.print();

}


// SEND INVOICE
function sendInvoice(){

alert(
"Invoice Generator Coming Next"
);

}


// SEND EMAIL
function sendEmail(){

if(!currentCustomer) return;

window.location.href =
`mailto:${currentCustomer.email}`;

}


// POLICY PDF
function openPolicy(){

window.open(
"assets/pdfs/policy-statement.pdf",
"_blank"
);

}


// CONTRACT PDF
function openContract(){

window.open(
"assets/pdfs/contract-terms.pdf",
"_blank"
);

}


// CUSTOMER DOCUMENTS
function customerDocuments(){

alert(
"Customer Documents Module"
);

}


// EDIT CUSTOMER
function editCustomer(){

if(!currentCustomer) return;

document.getElementById(
"customer_name"
).value =
currentCustomer.customer_name;

document.getElementById(
"company_name"
).value =
currentCustomer.company_name;

document.getElementById(
"email"
).value =
currentCustomer.email;

document.getElementById(
"phone"
).value =
currentCustomer.phone;

document.getElementById(
"address"
).value =
currentCustomer.address;

closeCustomerModal();

alert(
"Customer loaded into form for editing"
);

}


// DELETE CUSTOMER
async function deleteCustomer(){

if(!currentCustomer) return;

if(
!confirm(
"Delete this customer?"
)
){
return;
}

const { error } =
await customerSupabase
.from("customers")
.delete()
.eq(
"id",
currentCustomer.id
);

if(error){

alert(error.message);

return;

}

closeCustomerModal();

loadCustomers();

alert(
"Customer Deleted"
);

}


// CLOSE MODAL


document.getElementById(
"customerModal"
).style.display =
"none";

}
