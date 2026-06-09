const supabaseUrl = "https://aosewocqcpoffckmnfpn.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvc2V3b2NxY3BvZmZja21uZnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MTY2MDgsImV4cCI6MjA5NjM5MjYwOH0.qKK1snP7cOytwoLl_aqqvLm3OFCsgG8lQGR2_i4UXwo";

const supabase =
window.supabase.createClient(
supabaseUrl,
supabaseKey
);

const form =
document.getElementById("customerForm");

const tableBody =
document.getElementById("customerTableBody");

async function loadCustomers() {

const { data, error } =
await supabase
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

const { error } =
await supabase
.from("customers")
.insert([{
customer_name,
company_name,
email,
phone,
address
}]);

if(error){

alert(error.message);
return;

}

alert("Customer Added");

form.reset();

loadCustomers();

});

loadCustomers();
