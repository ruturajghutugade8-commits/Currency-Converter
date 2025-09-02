// 🔑 Replace with your real API key from https://www.exchangerate-api.com
const API_KEY = "1f3259fe8f9518e03c12ccdd";
const baseUrl = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

const dropDowns = document.querySelectorAll("select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Fill dropdowns
for (let select of dropDowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = "selected";
    }

    select.append(option);
  }
  select.addEventListener("change", (evt) => updateFlag(evt.target));
}

// Update flag image
function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  element.parentElement.querySelector("img").src = newSrc;
}

// Fetch and calculate exchange rate
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  try {
    const URL = `${baseUrl}${fromCurr.value}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (!data.conversion_rates) {
      throw new Error("Invalid API response");
    }

    let rate = data.conversion_rates[toCurr.value];
    let finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "❌ Error fetching data. Check API key or internet.";
    console.error(error);
  }
});
