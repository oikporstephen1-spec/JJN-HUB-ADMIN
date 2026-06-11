const customerSupabase = window.supabaseClient;

const form = document.getElementById("customerForm");
const tableBody = document.getElementById("customerTableBody");

let currentCustomer = null;
let editingCustomerId = null;

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
const department =
  document.getElementById("department").value;

const status =
  document.getElementById("status").value;
  
if(
  !customer_name ||
  !company_name ||
  !email ||
  !phone ||
  !address
){
  alert(
    "All customer fields are required."
  );
  return;
}
if(
  !customer_name ||
  !company_name ||
  !email ||
  !phone ||
  !address
){
  alert(
    "All customer fields are required."
  );
  return;
}

if(!email.includes("@")){
  alert(
    "Enter a valid email address."
  );
  return;
}

if(phone.length < 8){
  alert(
    "Enter a valid phone number."
  );
  return;
}

  try {

    let error;
console.log(
  "SUBMIT EDITING ID:",
  editingCustomerId
);
    if(editingCustomerId){

     const result = await customerSupabase
  .from("customers")
  .update({
    customer_name,
    company_name,
    email,
    phone,
    address
  })
  .eq("id", editingCustomerId)
  .select();

console.log("UPDATE DATA:", result.data);
console.log("UPDATE ERROR:", result.error);
      error = result.error;

      editingCustomerId = null;

      alert("Customer Updated Successfully");

    } else {

      const result = await customerSupabase
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

      error = result.error;

      alert("Customer Added Successfully");

    }

    if(error) throw error;

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

function editCustomer(){

  if(!currentCustomer) return;

  editingCustomerId = currentCustomer.id;

  console.log(
    "EDITING CUSTOMER ID:",
    editingCustomerId
  );

  document.getElementById("customer_name").value =
    currentCustomer.customer_name;

  document.getElementById("company_name").value =
    currentCustomer.company_name;

  document.getElementById("email").value =
    currentCustomer.email;

  document.getElementById("phone").value =
    currentCustomer.phone;

  document.getElementById("address").value =
    currentCustomer.address;

  closeCustomerModal();

  alert(
    "Customer loaded for editing. Click Add Customer to save changes."
  );

}
async function deleteCustomer(){

  if(!currentCustomer){
    alert("No customer selected");
    return;
  }

  console.log("CURRENT CUSTOMER:", currentCustomer);

  if(!confirm("Delete this customer?")){
    return;
  }

  const { data, error } =
  await customerSupabase
    .from("customers")
    .delete()
    .eq("id", currentCustomer.id)
    .select();

  console.log("DELETE DATA:", data);
  console.log("DELETE ERROR:", error);

  if(error){
    alert(error.message);
    return;
  }

  closeCustomerModal();

  await loadCustomers();

  alert("Customer Deleted Successfully");

}
function createInvoice(){

  if(!currentCustomer){
    alert("No customer selected");
    return;
  }

  localStorage.setItem(
    "invoiceCustomer",
    JSON.stringify(currentCustomer)
  );

  window.location.href =
    "invoice.html";

}
function sendEmail(){

  if(!currentCustomer) return;

  window.location.href =
    `mailto:${currentCustomer.email}`;

}

function openPolicy(){

  window.open(
    "assets/pdfs/policy-statement.pdf",
    "_blank"
  );

}

function openContract(){

  window.open(
    "assets/pdfs/contract-terms.pdf",
    "_blank"
  );

}

function customerDocuments(){

  alert("Customer Documents Module");

}

function closeCustomerModal(){

  document.getElementById(
    "customerModal"
  ).style.display = "none";

}

loadCustomers();
