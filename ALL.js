function setDefaultDate() {
  const dateInput = document.getElementById("datePicker");
  const formDateInput = document.getElementById("date");
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  const currentDate = `${yyyy}-${mm}-${dd}`;

  const savedDate = localStorage.getItem("selectedDate");

  if (savedDate) {
      dateInput.value = savedDate;
      formDateInput.value = savedDate;
  } else {
      dateInput.value = currentDate;
      formDateInput.value = currentDate;
  }
}

function syncDateInputs() {
  const dateInput = document.getElementById("datePicker");
  const formDateInput = document.getElementById("date");

  dateInput.addEventListener("change", () => {
      formDateInput.value = dateInput.value;
      localStorage.setItem("selectedDate", dateInput.value);
  });

  formDateInput.addEventListener("change", () => {
      dateInput.value = formDateInput.value;
      localStorage.setItem("selectedDate", formDateInput.value);
  });
}

function filterTransactionsByDate(selectedDate) {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  return transactions.filter(transaction => transaction.date === selectedDate);
}

const addButton = document.getElementById("Add");
const contentHead = document.getElementById("content");
const closeButton = document.getElementById("close");
const form = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

addButton.addEventListener("click", () => {
  contentHead.style.display = "block";
});

closeButton.addEventListener("click", () => {
  contentHead.style.display = "none";
  displayTransactions();
  calculateTotals();
});

function saveTransaction(category, title, amount, date) {
  const transaction = {
      category,
      title,
      amount,
      date
  };
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  calculateTotals();
}

function displayTransactions() {
  const selectedDate = document.getElementById("datePicker").value; 
  const transactions = selectedDate ? filterTransactionsByDate(selectedDate) : JSON.parse(localStorage.getItem("transactions")) || [];

  transactionList.innerHTML = ""; 

  if (transactions.length === 0) {
      transactionList.innerHTML = "<p>No transactions recorded for this date.</p>";
      return;
  }

  const table = document.createElement("table");
  table.style.width = "75%";
  table.style.borderCollapse = "collapse";
  table.style.backgroundColor = "transparent"; 
  table.innerHTML = `
<thead>
  <tr>
    <th style="width: 0px;">#</th>
    <th style="width: 0px;">ประเภท</th>
    <th style="width: 40%;">เรื่อง</th>
    <th style="width: 20%;">จำนวน</th>
    <th style="width: 10%;">วันที่</th>
    <th style="width: 10%;">Action</th>
  </tr>
</thead>
<tbody>
</tbody>
`;
  const tbody = table.querySelector("tbody");

  transactions.forEach((transaction, index) => {
      const row = document.createElement("tr");

      const indexCell = document.createElement("td");
      indexCell.textContent = index + 1;
      indexCell.style.border = "2px solid #dddddd";
      indexCell.style.padding = "8px";
      indexCell.style.textAlign = "center";
      indexCell.style.backgroundColor = transaction.category === "Expense" ? "#f44336" : "#4CAF50"; 
      indexCell.style.color = "#fff"; 
      indexCell.style.fontWeight = "bold";

      const categoryCell = document.createElement("td");

      if (transaction.category === "Income") {
          categoryCell.textContent = "รายรับ";
          categoryCell.style.backgroundColor = "#4CAF50"; 
      } else if (transaction.category === "Expense") {
          categoryCell.textContent = "รายจ่าย";
          categoryCell.style.backgroundColor = "#f44336";
      }

      categoryCell.style.border = "2px solid #dddddd";
      categoryCell.style.padding = "8px";
      categoryCell.style.textAlign = "center";
      categoryCell.style.color = "#fff"; 

      const titleCell = document.createElement("td");
      titleCell.textContent = transaction.title;
      titleCell.style.border = "2px solid #dddddd";
      titleCell.style.padding = "8px";
      titleCell.style.paddingLeft = "15px";
      titleCell.style.textAlign = "left";
      titleCell.style.backgroundColor = transaction.category === "Expense" ? "#f44336" : "#4CAF50";
      titleCell.style.color = "#fff"; 
      const amountCell = document.createElement("td");
      amountCell.textContent = `${transaction.amount}฿`;
      amountCell.style.border = "2px solid #dddddd";
      amountCell.style.padding = "8px";
      amountCell.style.backgroundColor = transaction.category === "Expense" ? "#f44336" : "#4CAF50";
      amountCell.style.color = "#fff"; 

      const dateCell = document.createElement("td");
      dateCell.textContent = transaction.date;
      dateCell.style.border = "2px solid #dddddd";
      dateCell.style.padding = "8px";
      dateCell.style.textAlign = "center";
      dateCell.style.backgroundColor = transaction.category === "Expense" ? "#f44336" : "#4CAF50";
      dateCell.style.color = "#fff"; 

      const actionCell = document.createElement("td");
      actionCell.style.border = "2px solid #dddddd";
      actionCell.style.padding = "8px";
      actionCell.style.backgroundColor = "transparent";
      actionCell.style.textAlign = "center";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-btn");
      deleteButton.setAttribute("data-index", index);
      deleteButton.setAttribute("data-date", transaction.date); 
      actionCell.appendChild(deleteButton);

      row.appendChild(indexCell);
      row.appendChild(categoryCell);
      row.appendChild(titleCell);
      row.appendChild(amountCell);
      row.appendChild(dateCell);
      row.appendChild(actionCell);

      tbody.appendChild(row);
  });

  transactionList.appendChild(table);

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(button => {
      button.addEventListener("click", (event) => {
          const index = event.target.getAttribute("data-index");
          const selectedDate = event.target.getAttribute("data-date"); 
          deleteTransaction(index, selectedDate);
      });
  });
}

function deleteTransaction(index, selectedDate) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let filteredTransactions = transactions.filter(transaction => transaction.date === selectedDate);

  filteredTransactions.splice(index, 1);

  transactions = transactions.filter(transaction => transaction.date !== selectedDate).concat(filteredTransactions);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  displayTransactions(); 
  calculateTotals(); 
}


form.addEventListener("submit", (event) => {
  event.preventDefault(); 

  const category = document.getElementById("Category").value;
  const title = document.getElementById("title").value;
  const amount = document.getElementById("Amount").value;
  const date = document.getElementById("date").value;

  saveTransaction(category, title, amount, date);

  displayTransactions();

  contentHead.style.display = "none";

  form.reset();

  setDefaultDate();
});

function calculateTotals() {
  const selectedDate = document.getElementById("datePicker").value; // วันที่ที่เลือกจาก datePicker
  const transactions = selectedDate ? filterTransactionsByDate(selectedDate) : JSON.parse(localStorage.getItem("transactions")) || [];

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(transaction => {
      if (transaction.category === "Income") {
          totalIncome += parseFloat(transaction.amount);
      } else if (transaction.category === "Expense") {
          totalExpense += parseFloat(transaction.amount);
      }
  });

  const totalBalance = totalIncome - totalExpense;

  const summary = document.getElementById("summary");
  if (transactions.length > 0) {
      summary.innerHTML = `
  <p class="summarybox"><strong>วันที่: ${selectedDate}</strong></p>
  <p class="summarybox">รายรับ: ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}฿</p>
  <p class="summarybox">รายจ่าย: ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}฿</p>
  <p class="summarybox">ยอดรวม: ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}฿</p>
  `;
  } else {
      summary.innerHTML = "<p>ไม่พบข้อมูลการบันทึก</p>";
  }
}

function getSummaryData() {
  const allTransactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let incomeTotal = 0;
  let expenseTotal = 0;

  allTransactions.forEach(transaction => {
      if (transaction.category === "Income") {
          incomeTotal += parseFloat(transaction.amount);
      } else if (transaction.category === "Expense") {
          expenseTotal += parseFloat(transaction.amount);
      }
  });

  const balanceTotal = incomeTotal - expenseTotal;

  return {
      incomeTotal: parseFloat(incomeTotal.toFixed(3)).toLocaleString(),
      expenseTotal: parseFloat(expenseTotal.toFixed(3)).toLocaleString(),
      balanceTotal: parseFloat(balanceTotal.toFixed(3)).toLocaleString(),
  };
}

function renderSummaryOnHome() {
  const summaryResult = getSummaryData();

  console.log("Summary Result:", summaryResult);

  if (summaryResult) {
      document.getElementById("incomeTotalDisplay").textContent = `รายรับรวม: ${summaryResult.incomeTotal}฿`;
      document.getElementById("expenseTotalDisplay").textContent = `รายจ่ายรวม: ${summaryResult.expenseTotal}฿`;
      document.getElementById("balanceTotalDisplay").textContent = `ยอดคงเหลือ: ${summaryResult.balanceTotal}฿`;
  } else {
      console.error("ไม่พบข้อมูลสรุปยอดรวม");
  }
}

window.onload = () => {
  setDefaultDate();
  syncDateInputs();
  calculateTotals(); 
  displayTransactions(); 
  renderSummaryOnHome();
};

document.getElementById("datePicker").addEventListener("change", () => {
  displayTransactions(); 
  calculateTotals();
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector('.toggle-btn');
  const leftbar = document.querySelector('.leftbar');

  if (toggleButton && leftbar) {
      toggleButton.addEventListener('click', () => {
          leftbar.classList.toggle('open');
      });
  } else {
      console.error("ไม่พบ toggle-btn หรือ leftbar ใน HTML");
  }
});
