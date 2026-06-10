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
          <button class="action-btn">View</button>
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

loadCustomers();
