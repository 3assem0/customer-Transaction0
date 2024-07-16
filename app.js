document.addEventListener('DOMContentLoaded', () => {
  const data = {
      "customers": [
          { "id": 1, "name": "Ahmed Ali" },
          { "id": 2, "name": "Aya Elsayed" },
          { "id": 3, "name": "Mina Adel" },
          { "id": 4, "name": "Sarah Reda" },
          { "id": 5, "name": "Mohamed Sayed" }
      ],
      "transactions": [
          { "id": 1, "customer_id": 1, "date": "2022-01-01", "amount": 1000 },
          { "id": 2, "customer_id": 1, "date": "2022-01-02", "amount": 2000 },
          { "id": 3, "customer_id": 2, "date": "2022-01-01", "amount": 550 },
          { "id": 4, "customer_id": 3, "date": "2022-01-01", "amount": 500 },
          { "id": 5, "customer_id": 2, "date": "2022-01-02", "amount": 1300 },
          { "id": 6, "customer_id": 4, "date": "2022-01-01", "amount": 750 },
          { "id": 7, "customer_id": 3, "date": "2022-01-02", "amount": 1250 },
          { "id": 8, "customer_id": 5, "date": "2022-01-01", "amount": 2500 },
          { "id": 9, "customer_id": 5, "date": "2022-01-02", "amount": 875 }
      ]
  };

  const customerTableBody = document.querySelector('#customerTable tbody');
  const filterNameInput = document.getElementById('filterName');
  const filterAmountInput = document.getElementById('filterAmount');
  const ctx = document.getElementById('transactionChart').getContext('2d');

  function displayTable(customers, transactions) {
      customerTableBody.innerHTML = '';

      transactions.forEach(transaction => {
          const customer = customers.find(c => c.id === transaction.customer_id);
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${customer.name}</td>
              <td>${transaction.date}</td>
              <td>${transaction.amount}</td>
          `;
          customerTableBody.appendChild(row);
      });
  }

  function filterTable() {
      const filterName = filterNameInput.value.toLowerCase();
      const filterAmount = filterAmountInput.value;

      const filteredTransactions = data.transactions.filter(transaction => {
          const customer = data.customers.find(c => c.id === transaction.customer_id);
          return customer.name.toLowerCase().includes(filterName) && (filterAmount === '' || transaction.amount >= filterAmount);
      });

      displayTable(data.customers, filteredTransactions);
  }

  function displayChart(customerId) {
      const customerTransactions = data.transactions.filter(t => t.customer_id === customerId);
      const dates = [...new Set(customerTransactions.map(t => t.date))];
      const amounts = dates.map(date => customerTransactions.filter(t => t.date === date).reduce((acc, t) => acc + t.amount, 0));

      new Chart(ctx, {
          type: 'line',
          data: {
              labels: dates,
              datasets: [{
                  label: 'Total Transaction Amount',
                  data: amounts,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
  }

  filterNameInput.addEventListener('input', filterTable);
  filterAmountInput.addEventListener('input', filterTable);

  customerTableBody.addEventListener('click', (e) => {
    if (e.target.tagName === 'TD') {
        const row = e.target.parentElement;
        const customerName = row.cells[0].textContent;
        const customer = data.customers.find(c => c.name === customerName);
        displayChart(customer.id);
    }
});

displayTable(data.customers, data.transactions);
});
