const customerSupabase = supabaseClient;
const form =
document.getElementById("customerForm");

const tableBody =
document.getElementById("customerTableBody");

async function loadCustomers() {

const { data, error } =
await customerSupabase
.from("customers")
.select("*")
.order("id", { ascending: false });

console.log("CUSTOMERS:", data);
console.log("ERROR:", error);

if(error){
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
<button class="action-btn">
View
</button>
</td>
</tr>
`;

});

}

form.addEventListener(
"submit",
async (e)=>{

e.preventDefault();

const customer_name =
document.getElementById(
"customer_name"
).value;

const company_name =
document.getElementById(
"company_name"
).value;

const email =
document.getElementById(
"email"
).value;

const phone =
document.getElementById(
"phone"
).value;

const address =
document.getElementById(
"address"
).value;

console.log("Submitting customer...");

const { data, error } =
await supabase
.from("customers")
.insert([{
customer_name,
company_name,
email,
phone,
address
}])
.select();

console.log("DATA:", data);
console.log("ERROR:", error);

if(error){

console.log(error);

alert(error.message);

return;

}

alert("Customer Added Successfully");

alert("Customer Added");

form.reset();

loadCustomers();

});

loadCustomers();
