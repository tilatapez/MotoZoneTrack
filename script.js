    // Get the form element and the history table
    const form = document.getElementById('deal-form');
    const historyTable = document.getElementById('history-table');
    // Listen for form submission
    form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    // Get input values
    const purchasePrice = parseFloat(document.getElementById('purchase_price').value);
    const repairCost = parseFloat(document.getElementById('repair_cost').value);
    const salePrice = parseFloat(document.getElementById('sale_price').value);
    // perform calculations
    const totalCost = purchasePrice + repairCost;
    const aseelShare = salePrice * 0.1; // 10% Aseel's share
    const profit = salePrice - (totalCost- aseelShare); // profit after Aseel's share
    const reinvestment = totalCost + profit * 0.20; // 20% reinvestment
    const remainingProfit = salePrice - (reinvestment + aseelShare);
    const yourShare = (remainingProfit * 0.5)+ aseelShare; // 50% your share
    const partnerShare = (remainingProfit * 0.5)+ reinvestment; // 50% partner's share
    //display summary
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = `
        <p><strong> Purchase Price:</strong> $${purchasePrice.toFixed(2)}</p>
        <p><strong> Repair Cost:</strong> $${repairCost.toFixed(2)}</p>
        <p><strong> Sale Price:</strong> $${salePrice.toFixed(2)}</p>
        <p><strong> Total Cost:</strong> $${totalCost.toFixed(2)}</p>
        <p><strong> Your Share :</strong> $${yourShare.toFixed(2)}</p>
        <p><strong> Partner's Share :</strong> $${partnerShare.toFixed(2)}</p> `;
        //        <p><strong> Aseel's Share (10%):</strong> $${aseelShare.toFixed(2)}</p> `;
        // <p><strong> Remaining Profit:</strong> $${remainingProfit.toFixed(2)}</p>
        // <p><strong> Reinvestment (20% of profit):</strong> $${reinvestment.toFixed(2)}</p>
    // add to history
    const dealObj = {
       purchasePrice,
        repairCost,
        salePrice,
        totalCost,
        profit,
        reinvestment,
        remainingProfit,
        yourShare,
        partnerShare
    };
    // --- 1) save to localStorage ---
    const savedDeals = JSON.parse(localStorage.getItem('carDeals')) || [];
        savedDeals.push(dealObj);
        localStorage.setItem('carDeals', JSON.stringify(savedDeals));
    // --- 2) show on the page right away ---
        addRowToTable(dealObj, savedDeals.length - 1); // Add new row to history table
        buildSplitTable(); // Update split table
    // Clear the form
        form.reset(); 
    });

    // Function to add a new row to the history table
    // This function is called when a new deal is added or when the page loads
    function addRowToTable(deal, index) {
    const newRow = historyTable.querySelector('tbody').insertRow();  // ✅ inside <tbody>
    newRow.insertCell().textContent = deal.purchasePrice;
    newRow.insertCell().textContent = deal.repairCost;
    newRow.insertCell().textContent = deal.salePrice;
    newRow.insertCell().textContent = deal.totalCost;
    newRow.insertCell().textContent = deal.profit;
    newRow.insertCell().textContent = deal.reinvestment;
    newRow.insertCell().textContent = deal.remainingProfit;
    newRow.insertCell().textContent = deal.yourShare;
    newRow.insertCell().textContent = deal.partnerShare;  

    const delCell = newRow.insertCell();  
    const btn = document.createElement('button');
    btn.textContent = '🗑️';
    btn.addEventListener('click', () => deleteDeal(index));
    delCell.appendChild(btn);
    }   

    // Function to build the split table
    function buildSplitTable() {
    const tbody =document.querySelector('#split-table tbody');
    tbody.innerHTML= ''; // Clear existing rows
    const saved=JSON.parse(localStorage.getItem('carDeals')) || [];
    let yourTotal=0;
    saved.forEach(deal => 
    {
        const row=tbody.insertRow();
        row.insertCell().textContent = deal.reinvestment;   
        row.insertCell().textContent = deal.yourShare;
        row.insertCell().textContent = deal.partnerShare;
        yourTotal += parseFloat(deal.yourShare);
    })
    document.getElementById('your-total-amount').textContent = `$${yourTotal.toFixed(2)}`;  
    }

    // Function to delete a deal from history
    /* ---------- delete with undo ---------- */
    function deleteDeal(idx){
    const deals = JSON.parse(localStorage.getItem('carDeals') || '[]')|| [];
    const [removed] = deals.splice(idx, 1);          // take it out
    localStorage.setItem('carDeals', JSON.stringify(deals));
    rebuildAll();                                    // refresh tables

    // --- toast popup ---
    showToast("Deal deleted", () => {
    deals.splice(idx, 0, removed);                 // put it back
    localStorage.setItem('carDeals', JSON.stringify(deals));
    rebuildAll();
    });
    }

    function showToast(msg, undoFn){
    const toast = document.getElementById('toast');
    toast.innerHTML = `${msg} <button>Undo</button>`;
    toast.classList.add('show');

    const btn = toast.querySelector('button');
    const hide = () => toast.classList.remove('show');

    const timer = setTimeout(hide, 5000);              // 5-second window
    btn.onclick = () => { clearTimeout(timer); undoFn(); hide(); };
    }
    // End of delete with undo

    // Function to rebuild the history table and split table
    function rebuildAll() {
    document.querySelector('#history-table tbody').innerHTML= ''; // Clear history table
    const saved = JSON.parse(localStorage.getItem('carDeals')) || [];
    saved.forEach((deal, index) => addRowToTable(deal, index)); // Re-add all deals
    buildSplitTable(); // Rebuild split table
    }
    function showTab(tabId) {
    // Hide all pages
    document.querySelectorAll('.tab-page').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all buttons
    document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabId).classList.add('active');

    // Activate selected button
    const index = tabId === 'add' ? 0 : tabId === 'history' ? 1 : 2;
    document.querySelectorAll('.tab')[index].classList.add('active');

    // If split tab is selected, update the values
    if (tabId === 'split') {
       buildSplitTable();
    }

    }

    rebuildAll(); // Load history and split table on page load