// =========================================
// JJN HUB Vehicle Import Cost Calculator
// automotive.js
// =========================================

function value(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function formatMoney(amount) {
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function calculateVehicleCost() {

    const purchase = value("purchasePrice");
    const auction = value("auctionFees");
    const inland = value("inlandTransport");
    const shipping = value("shippingCost");
    const insurance = value("insurance");
    const documentation = value("documentation");

    const exchange = value("exchangeRate");

    const clearing = value("clearingCost");
    const other = value("otherExpenses");
    const profit = value("desiredProfit");

    const totalUSD =
        purchase +
        auction +
        inland +
        shipping +
        insurance +
        documentation;

    const landedCost =
        (totalUSD * exchange) +
        clearing +
        other;

    const sellingPrice =
        landedCost +
        profit;

    document.getElementById("totalUSD").innerHTML =
        "$ " + formatMoney(totalUSD);

    document.getElementById("landedCost").innerHTML =
        "₦ " + formatMoney(landedCost);

    document.getElementById("sellingPrice").innerHTML =
        "₦ " + formatMoney(sellingPrice);
}

function clearCalculator(){

    const ids = [

        "purchasePrice",
        "auctionFees",
        "inlandTransport",
        "shippingCost",
        "insurance",
        "documentation",
        "exchangeRate",
        "clearingCost",
        "otherExpenses",
        "desiredProfit"

    ];

    ids.forEach(id => {

        document.getElementById(id).value = "";

    });

    document.getElementById("totalUSD").innerHTML = "$ 0.00";
    document.getElementById("landedCost").innerHTML = "₦ 0.00";
    document.getElementById("sellingPrice").innerHTML = "₦ 0.00";

}

function printEstimate(){

    window.print();

}

function saveEstimate(){

    alert(
        "Vehicle Cost Estimate Saved."
    );

}

function emailEstimate(){

    const body = `
JJN HUB Vehicle Cost Estimate

Total USD Cost:
${document.getElementById("totalUSD").innerText}

Landed Cost:
${document.getElementById("landedCost").innerText}

Recommended Selling Price:
${document.getElementById("sellingPrice").innerText}
`;

    window.location.href =
        "mailto:?subject=JJN HUB Vehicle Estimate&body=" +
        encodeURIComponent(body);

}

document.addEventListener("input", function(){

    calculateVehicleCost();

});
