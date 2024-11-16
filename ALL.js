// ตั้งวันที่ปัจจุบันใน Date Picker และ Date input
function setDefaultDate() {
  const dateInput = document.getElementById("datePicker");
  const formDateInput = document.getElementById("date");
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  const currentDate = `${yyyy}-${mm}-${dd}`;

  // เช็คว่ามีวันที่ถูกบันทึกใน localStorage หรือไม่
  const savedDate = localStorage.getItem("selectedDate");

  // ถ้ามีวันที่บันทึกไว้ใน localStorage ให้ใช้วันที่นั้น
  if (savedDate) {
      dateInput.value = savedDate;
      formDateInput.value = savedDate;
  } else {
      // ถ้าไม่มี ให้ใช้วันที่ปัจจุบัน
      dateInput.value = currentDate;
      formDateInput.value = currentDate;
  }
}

// ซิงค์ค่า datePicker และ date input ในฟอร์ม
function syncDateInputs() {
  const dateInput = document.getElementById("datePicker");
  const formDateInput = document.getElementById("date");

  // เมื่อ datePicker เปลี่ยน ให้ซิงค์ค่าไปที่ formDateInput
  dateInput.addEventListener("change", () => {
      formDateInput.value = dateInput.value;
      // บันทึกวันที่ที่เลือกใน localStorage
      localStorage.setItem("selectedDate", dateInput.value);
  });

  // เมื่อ formDateInput เปลี่ยน ให้ซิงค์ค่าไปที่ datePicker
  formDateInput.addEventListener("change", () => {
      dateInput.value = formDateInput.value;
      // บันทึกวันที่ที่เลือกใน localStorage
      localStorage.setItem("selectedDate", formDateInput.value);
  });
}

// ฟังก์ชันกรองข้อมูลตามวันที่ที่เลือก
function filterTransactionsByDate(selectedDate) {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  return transactions.filter(transaction => transaction.date === selectedDate);
}

// เปิดฟอร์มการกรอกข้อมูล
const addButton = document.getElementById("Add");
const contentHead = document.getElementById("content");
const closeButton = document.getElementById("close");
const form = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

addButton.addEventListener("click", () => {
  contentHead.style.display = "block";
});

// ปิดฟอร์มการกรอกข้อมูล
closeButton.addEventListener("click", () => {
  contentHead.style.display = "none";
  displayTransactions();
  calculateTotals();
});


// บันทึกข้อมูลลงใน Local Storage
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

// ฟังก์ชันแสดงรายการธุรกรรม
function displayTransactions() {
  const selectedDate = document.getElementById("datePicker").value; // วันที่ที่เลือกจาก datePicker
  const transactions = selectedDate ? filterTransactionsByDate(selectedDate) : JSON.parse(localStorage.getItem("transactions")) || [];

  transactionList.innerHTML = ""; // ล้างรายการเดิม

  if (transactions.length === 0) {
      transactionList.innerHTML = "<p>No transactions recorded for this date.</p>";
      return;
  }

  const table = document.createElement("table");
  table.style.width = "75%";
  table.style.borderCollapse = "collapse";
  table.style.backgroundColor = "transparent"; // ปรับให้ตารางไม่มีพื้นหลัง
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

      // สร้างเซลล์ Index
      const indexCell = document.createElement("td");
      indexCell.textContent = index + 1;
      indexCell.style.border = "2px solid #dddddd";
      indexCell.style.padding = "8px";
      indexCell.style.textAlign = "center";
      indexCell.style.backgroundColor = transaction.category === "Expense" ? "#f44336" : "#4CAF50"; // สีที่แตกต่างกัน
      indexCell.style.color = "#fff"; // ให้ข้อความเป็นสีขาว
      indexCell.style.fontWeight = "bold";

      // สร้างเซลล์ Category
      const categoryCell = document.createElement("td");

      // ตรวจสอบค่าและแสดงข้อความเป็นภาษาไทย
      if (transaction.category === "Income") {
          categoryCell.textContent = "รายรับ";
          categoryCell.style.backgroundColor = "#4CAF50"; // สีเขียวสำหรับรายรับ
      } else if (transaction.category === "Expense") {
          categoryCell.textContent = "รายจ่าย";
          categoryCell.style.backgroundColor = "#f44336"; // สีแดงสำหรับรายจ่าย
      }

      categoryCell.style.border = "2px solid #dddddd";
      categoryCell.style.padding = "8px";
      categoryCell.style.textAlign = "center";
      categoryCell.style.color = "#fff"; // ให้ข้อความเป็นสีขาว

      // สร้างเซลล์ Title
      const titleCell = document.createElement("td");
      titleCell.textContent = transaction.title;
      titleCell.style.border = "2px solid #dddddd";
      titleCell.style.padding = "8px";
      titleCell.style.paddingLeft = "15px";
      titleCell.style.textAlign = "left";
      titleCell.style.backgroundColor = transaction.category === "Expense" ? "#f44336" : "#4CAF50";
      titleCell.style.color = "#fff"; // ให้ข้อความเป็นสีขาว

      // สร้างเซลล์ Amount
      const amountCell = document.createElement("td");
      amountCell.textContent = `${transaction.amount}฿`;
      amountCell.style.border = "2px solid #dddddd";
      amountCell.style.padding = "8px";
      amountCell.style.backgroundColor = transaction.category === "Expense" ? "#f44336" : "#4CAF50";
      amountCell.style.color = "#fff"; // ให้ข้อความเป็นสีขาว

      // สร้างเซลล์ Date
      const dateCell = document.createElement("td");
      dateCell.textContent = transaction.date;
      dateCell.style.border = "2px solid #dddddd";
      dateCell.style.padding = "8px";
      dateCell.style.textAlign = "center";
      dateCell.style.backgroundColor = transaction.category === "Expense" ? "#f44336" : "#4CAF50";
      dateCell.style.color = "#fff"; // ให้ข้อความเป็นสีขาว

      // สร้างเซลล์ Action (ปุ่มลบ)
      const actionCell = document.createElement("td");
      actionCell.style.border = "2px solid #dddddd";
      actionCell.style.padding = "8px";
      actionCell.style.backgroundColor = "transparent";
      actionCell.style.textAlign = "center";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-btn");
      deleteButton.setAttribute("data-index", index);
      deleteButton.setAttribute("data-date", transaction.date); // เพิ่ม data-date
      actionCell.appendChild(deleteButton);

      // เพิ่มข้อมูลแต่ละคอลัมน์เข้าไปในแถว
      row.appendChild(indexCell);
      row.appendChild(categoryCell);
      row.appendChild(titleCell);
      row.appendChild(amountCell);
      row.appendChild(dateCell);
      row.appendChild(actionCell);

      // เพิ่มแถวเข้าไปใน tbody
      tbody.appendChild(row);
  });

  // เพิ่มตารางลงใน transactionList
  transactionList.appendChild(table);

  // ฟังก์ชันลบข้อมูลเมื่อคลิกปุ่ม Delete
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(button => {
      button.addEventListener("click", (event) => {
          const index = event.target.getAttribute("data-index");
          const selectedDate = event.target.getAttribute("data-date"); // ใช้วันที่จากปุ่มลบ
          deleteTransaction(index, selectedDate);
      });
  });
}

// ฟังก์ชันลบธุรกรรมตามดัชนีที่ระบุ
function deleteTransaction(index, selectedDate) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  // กรองรายการตามวันที่ที่เลือก
  let filteredTransactions = transactions.filter(transaction => transaction.date === selectedDate);

  // ลบรายการที่ต้องการ
  filteredTransactions.splice(index, 1); // ลบรายการที่เลือก

  // อัปเดต transactions ที่เหลือใน localStorage
  transactions = transactions.filter(transaction => transaction.date !== selectedDate).concat(filteredTransactions);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // รีเฟรชการแสดงผลรายการธุรกรรมหลังจากลบ
  displayTransactions(); // แสดงรายการใหม่
  calculateTotals(); // คำนวณยอดรวมใหม่
}


// บันทึกข้อมูลเมื่อส่งฟอร์ม
form.addEventListener("submit", (event) => {
  event.preventDefault(); // ป้องกันการรีเฟรชหน้าเมื่อส่งฟอร์ม

  const category = document.getElementById("Category").value;
  const title = document.getElementById("title").value;
  const amount = document.getElementById("Amount").value;
  const date = document.getElementById("date").value;

  // บันทึกธุรกรรมใหม่
  saveTransaction(category, title, amount, date);

  // แสดงรายการธุรกรรมใหม่
  displayTransactions();

  // ปิด Pop-up หลังจากการส่งฟอร์ม
  contentHead.style.display = "none";

  // รีเซ็ตฟอร์ม
  form.reset();

  // ตั้งค่าวันที่ปัจจุบันในฟอร์มหลังจากบันทึก
  setDefaultDate();
});

// ฟังก์ชันคำนวณยอดรวมของรายได้และรายจ่ายตามวันที่เลือก
function calculateTotals() {
  const selectedDate = document.getElementById("datePicker").value; // วันที่ที่เลือกจาก datePicker
  const transactions = selectedDate ? filterTransactionsByDate(selectedDate) : JSON.parse(localStorage.getItem("transactions")) || [];

  let totalIncome = 0;
  let totalExpense = 0;

  // คำนวณยอดรวมรายได้และรายจ่ายตามวันที่เลือก
  transactions.forEach(transaction => {
      if (transaction.category === "Income") {
          totalIncome += parseFloat(transaction.amount);
      } else if (transaction.category === "Expense") {
          totalExpense += parseFloat(transaction.amount);
      }
  });

  const totalBalance = totalIncome - totalExpense;

  // แสดงผลยอดรวมตามวันที่เลือก
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

// ฟังก์ชันคำนวณสรุปยอดรวมของรายรับและรายจ่าย
function getSummaryData() {
  const allTransactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let incomeTotal = 0;
  let expenseTotal = 0;

  // คำนวณยอดรวมของรายรับและรายจ่าย
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

  // ตรวจสอบว่าได้รับข้อมูลหรือไม่
  if (summaryResult) {
      document.getElementById("incomeTotalDisplay").textContent = `รายรับรวม: ${summaryResult.incomeTotal}฿`;
      document.getElementById("expenseTotalDisplay").textContent = `รายจ่ายรวม: ${summaryResult.expenseTotal}฿`;
      document.getElementById("balanceTotalDisplay").textContent = `ยอดคงเหลือ: ${summaryResult.balanceTotal}฿`;
  } else {
      console.error("ไม่พบข้อมูลสรุปยอดรวม");
  }
}



// เรียกใช้ฟังก์ชันเมื่อโหลดหน้าเว็บ
window.onload = () => {
  setDefaultDate();
  syncDateInputs();
  calculateTotals(); // คำนวณยอดรวมทั้งหมด
  displayTransactions(); // แสดงรายการธุรกรรมทั้งหมด
  renderSummaryOnHome();
};

// ฟังก์ชันกรองข้อมูลจาก DatePicker
document.getElementById("datePicker").addEventListener("change", () => {
  displayTransactions(); // เมื่อเลือกวันที่ใหม่ให้รีเฟรชการแสดงผล
  calculateTotals();
});

// ตรวจสอบว่าปุ่มและ leftbar ถูกเลือกได้ถูกต้อง
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