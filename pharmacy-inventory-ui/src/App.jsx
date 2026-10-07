import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:8080/api";

const emptyMedicine = {
  medicineName: "",
  category: "",
  price: "",
  stock: "",
  expiryDate: "",
  supplierId: "",
};

const emptySupplier = {
  supplierName: "",
  contact: "",
  email: "",
  address: "",
};

const emptyPurchase = {
  medicineId: "",
  quantity: "",
  purchasePrice: "",
  purchaseDate: "",
};

const emptySale = {
  medicineId: "",
  quantity: "",
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);

  const [editingMedicine, setEditingMedicine] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);

  const [medicineForm, setMedicineForm] = useState(emptyMedicine);
  const [supplierForm, setSupplierForm] = useState(emptySupplier);
  const [purchaseForm, setPurchaseForm] = useState(emptyPurchase);
  const [saleForm, setSaleForm] = useState(emptySale);

  const [searchMedicine, setSearchMedicine] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [medicineData, supplierData, purchaseData, saleData] =
          await Promise.all([
            request("/medicines"),
            request("/suppliers"),
            request("/purchases"),
            request("/sales"),
          ]);

      setMedicines(Array.isArray(medicineData) ? medicineData : []);
      setSuppliers(Array.isArray(supplierData) ? supplierData : []);
      setPurchases(Array.isArray(purchaseData) ? purchaseData : []);
      setSales(Array.isArray(saleData) ? saleData : []);
    } catch (err) {
      setError(
          "Unable to connect to the Spring Boot backend. Make sure the backend is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  }

  async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      let errorText = "Request failed";

      try {
        errorText = await response.text();
      } catch {
        // Ignore response parsing errors
      }

      throw new Error(errorText || "Request failed");
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  function showMessage(text) {
    setMessage(text);
    setError("");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  function showError(text) {
    setError(text);
    setMessage("");

    setTimeout(() => {
      setError("");
    }, 4000);
  }

  function getMedicineName(medicine) {
    if (!medicine) return "-";

    if (typeof medicine === "object") {
      return medicine.medicineName || "-";
    }

    const found = medicines.find(
        (item) => String(item.medicineId) === String(medicine)
    );

    return found?.medicineName || "-";
  }

  function getSupplierName(supplier) {
    if (!supplier) return "-";

    if (typeof supplier === "object") {
      return supplier.supplierName || "-";
    }

    const found = suppliers.find(
        (item) => String(item.supplierId) === String(supplier)
    );

    return found?.supplierName || "-";
  }

  function getMedicineId(medicine) {
    if (!medicine) return "";

    if (typeof medicine === "object") {
      return medicine.medicineId || "";
    }

    return medicine;
  }

  function getSupplierId(supplier) {
    if (!supplier) return "";

    if (typeof supplier === "object") {
      return supplier.supplierId || "";
    }

    return supplier;
  }

  /* =========================
     MEDICINES
  ========================= */

  function openMedicineForm(medicine = null) {
    setEditingMedicine(medicine);

    if (medicine) {
      setMedicineForm({
        medicineName: medicine.medicineName || "",
        category: medicine.category || "",
        price: medicine.price ?? "",
        stock: medicine.stock ?? "",
        expiryDate: medicine.expiryDate || "",
        supplierId: getSupplierId(medicine.supplier),
      });
    } else {
      setMedicineForm(emptyMedicine);
    }

    setShowMedicineForm(true);
  }

  function validateMedicineForm() {
    const namePattern = /^[A-Za-z][A-Za-z .&'-]*$/;
    const categoryPattern = /^[A-Za-z][A-Za-z .&'-]*$/;
    const name = medicineForm.medicineName.trim();
    const category = medicineForm.category.trim();
    const price = Number(medicineForm.price);
    const stock = Number(medicineForm.stock);

    if (!name || !namePattern.test(name)) {
      showError("Medicine name must contain only letters, spaces and valid symbols.");
      return false;
    }

    if (!category || !categoryPattern.test(category)) {
      showError("Category must contain only letters, spaces and valid symbols.");
      return false;
    }

    if (!medicineForm.price || !Number.isFinite(price) || price <= 0) {
      showError("Price must be greater than 0.");
      return false;
    }

    if (
        medicineForm.stock === "" ||
        !Number.isInteger(stock) ||
        stock < 0
    ) {
      showError("Stock must be 0 or greater and must be a whole number.");
      return false;
    }

    if (!medicineForm.expiryDate) {
      showError("Expiry date is required.");
      return false;
    }

    if (!medicineForm.supplierId) {
      showError("Please select a supplier.");
      return false;
    }

    return true;
  }

  function validateSupplierForm() {
    const namePattern = /^[A-Za-z][A-Za-z .&'-]*$/;
    const contactPattern = /^[0-9]{10}$/;

    if (
        !supplierForm.supplierName.trim() ||
        !namePattern.test(supplierForm.supplierName.trim())
    ) {
      showError("Supplier name must contain only letters, spaces and valid symbols.");
      return false;
    }

    if (!contactPattern.test(supplierForm.contact.trim())) {
      showError("Contact number must contain exactly 10 digits.");
      return false;
    }

    if (!supplierForm.email.trim()) {
      showError("Email is required.");
      return false;
    }

    if (!supplierForm.address.trim()) {
      showError("Address is required.");
      return false;
    }

    return true;
  }

  async function saveMedicine(event) {
    event.preventDefault();

    if (!validateMedicineForm()) {
      return;
    }

    try {
      const payload = {
        medicineName: medicineForm.medicineName,
        category: medicineForm.category,
        price: Number(medicineForm.price),
        stock: Number(medicineForm.stock),
        expiryDate: medicineForm.expiryDate,
        supplier: {
          supplierId: Number(medicineForm.supplierId),
        },
      };

      if (editingMedicine) {
        await request(`/medicines/${editingMedicine.medicineId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        showMessage("Medicine updated successfully.");
      } else {
        await request("/medicines", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        showMessage("Medicine added successfully.");
      }

      setShowMedicineForm(false);
      setEditingMedicine(null);
      setMedicineForm(emptyMedicine);

      await loadAllData();
    } catch (err) {
      showError("Unable to save medicine.");
    }
  }

  async function deleteMedicine(id) {
    if (!window.confirm("Are you sure you want to delete this medicine?")) {
      return;
    }

    try {
      await request(`/medicines/${id}`, {
        method: "DELETE",
      });

      showMessage("Medicine deleted successfully.");
      await loadAllData();
    } catch (err) {
      showError("Unable to delete medicine. It may be referenced by purchases or sales.");
    }
  }

  /* =========================
     SUPPLIERS
  ========================= */

  function openSupplierForm(supplier = null) {
    setEditingSupplier(supplier);

    if (supplier) {
      setSupplierForm({
        supplierName: supplier.supplierName || "",
        contact: supplier.contact || "",
        email: supplier.email || "",
        address: supplier.address || "",
      });
    } else {
      setSupplierForm(emptySupplier);
    }

    setShowSupplierForm(true);
  }

  async function saveSupplier(event) {
    event.preventDefault();

    if (!validateSupplierForm()) {
      return;
    }

    try {
      const payload = {
        supplierName: supplierForm.supplierName,
        contact: supplierForm.contact,
        email: supplierForm.email,
        address: supplierForm.address,
      };

      if (editingSupplier) {
        await request(`/suppliers/${editingSupplier.supplierId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        showMessage("Supplier updated successfully.");
      } else {
        await request("/suppliers", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        showMessage("Supplier added successfully.");
      }

      setShowSupplierForm(false);
      setEditingSupplier(null);
      setSupplierForm(emptySupplier);

      await loadAllData();
    } catch (err) {
      showError("Unable to save supplier.");
    }
  }

  async function deleteSupplier(id) {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return;
    }

    try {
      await request(`/suppliers/${id}`, {
        method: "DELETE",
      });

      showMessage("Supplier deleted successfully.");
      await loadAllData();
    } catch (err) {
      showError("Unable to delete supplier. It may be linked to medicines.");
    }
  }

  /* =========================
     PURCHASES
  ========================= */

  function openPurchaseForm(purchase = null) {
    setEditingPurchase(purchase);

    if (purchase) {
      setPurchaseForm({
        medicineId: getMedicineId(purchase.medicine),
        quantity: purchase.quantity ?? "",
        purchasePrice: purchase.purchasePrice ?? "",
        purchaseDate: purchase.purchaseDate || "",
      });
    } else {
      setPurchaseForm({
        ...emptyPurchase,
        purchaseDate: new Date().toISOString().split("T")[0],
      });
    }

    setShowPurchaseForm(true);
  }

  async function savePurchase(event) {
    event.preventDefault();

    try {
      const payload = {
        medicine: {
          medicineId: Number(purchaseForm.medicineId),
        },
        quantity: Number(purchaseForm.quantity),
        purchasePrice: Number(purchaseForm.purchasePrice),
        purchaseDate: purchaseForm.purchaseDate,
      };

      if (editingPurchase) {
        await request(`/purchases/${editingPurchase.purchaseId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        showMessage("Purchase updated successfully.");
      } else {
        await request("/purchases", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        showMessage("Purchase recorded successfully.");
      }

      setShowPurchaseForm(false);
      setEditingPurchase(null);
      setPurchaseForm(emptyPurchase);

      await loadAllData();
    } catch (err) {
      showError("Unable to save purchase.");
    }
  }

  async function deletePurchase(id) {
    if (!window.confirm("Are you sure you want to delete this purchase?")) {
      return;
    }

    try {
      await request(`/purchases/${id}`, {
        method: "DELETE",
      });

      showMessage("Purchase deleted successfully.");
      await loadAllData();
    } catch (err) {
      showError("Unable to delete purchase.");
    }
  }

  /* =========================
     SALES
  ========================= */

  function openSaleForm() {
    setSaleForm({
      medicineId: "",
      quantity: "",
    });

    setShowSaleForm(true);
  }

  async function saveSale(event) {
    event.preventDefault();

    const selectedMedicine = medicines.find(
        (medicine) =>
            String(medicine.medicineId) === String(saleForm.medicineId)
    );

    if (!selectedMedicine) {
      showError("Please select a medicine.");
      return;
    }

    const quantity = Number(saleForm.quantity);

    if (quantity <= 0) {
      showError("Quantity must be greater than zero.");
      return;
    }

    if (quantity > Number(selectedMedicine.stock)) {
      showError("Insufficient medicine stock.");
      return;
    }

    try {
      const salePrice = Number(selectedMedicine.price);
      const saleAmount = quantity * salePrice;

      const payload = {
        medicine: {
          medicineId: Number(saleForm.medicineId),
        },
        quantity: quantity,
        salePrice: salePrice,
        saleAmount: saleAmount,
        saleDate: new Date().toISOString().split("T")[0],
      };

      await request("/sales", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      showMessage(
          `Sale recorded successfully. Amount: ₹${saleAmount.toFixed(2)}`
      );

      setShowSaleForm(false);
      setSaleForm(emptySale);

      await loadAllData();
    } catch (err) {
      showError("Unable to record sale.");
    }
  }

  async function deleteSale(id) {
    if (!window.confirm("Are you sure you want to delete this sale?")) {
      return;
    }

    try {
      await request(`/sales/${id}`, {
        method: "DELETE",
      });

      showMessage("Sale deleted successfully.");
      await loadAllData();
    } catch (err) {
      showError("Unable to delete sale.");
    }
  }

  /* =========================
     DASHBOARD DATA
  ========================= */

  const lowStockMedicines = useMemo(() => {
    return medicines.filter((medicine) => Number(medicine.stock) <= 20);
  }, [medicines]);

  const totalSalesAmount = useMemo(() => {
    return sales.reduce(
        (total, sale) => total + Number(sale.saleAmount || 0),
        0
    );
  }, [sales]);

  const filteredMedicines = useMemo(() => {
    const search = searchMedicine.toLowerCase().trim();

    if (!search) {
      return medicines;
    }

    return medicines.filter((medicine) =>
        [
          medicine.medicineName,
          medicine.category,
          getSupplierName(medicine.supplier),
        ]
            .join(" ")
            .toLowerCase()
            .includes(search)
    );
  }, [medicines, searchMedicine, suppliers]);

  function renderDashboard() {
    return (
        <>
          <div className="page-heading">
            <div>
              <h1>Dashboard</h1>
              <p>Overview of your pharmacy inventory.</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon medicine-icon">💊</div>
              <div>
                <span>Total Medicines</span>
                <strong>{medicines.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon supplier-icon">🚚</div>
              <div>
                <span>Total Suppliers</span>
                <strong>{suppliers.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purchase-icon">📦</div>
              <div>
                <span>Total Purchases</span>
                <strong>{purchases.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon sale-icon">🛒</div>
              <div>
                <span>Total Sales</span>
                <strong>{sales.length}</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2>Inventory Status</h2>
                  <p>Medicines requiring attention</p>
                </div>

                <button
                    className="small-button"
                    onClick={() => setActivePage("medicines")}
                >
                  View Medicines
                </button>
              </div>

              {lowStockMedicines.length === 0 ? (
                  <div className="empty-state">
                    <span>✓</span>
                    <h3>Stock looks good</h3>
                    <p>No medicines currently have low stock.</p>
                  </div>
              ) : (
                  <div className="stock-list">
                    {lowStockMedicines.map((medicine) => (
                        <div className="stock-row" key={medicine.medicineId}>
                          <div>
                            <strong>{medicine.medicineName}</strong>
                            <span>{medicine.category}</span>
                          </div>

                          <span className="stock-warning">
                      {medicine.stock} left
                    </span>
                        </div>
                    ))}
                  </div>
              )}
            </div>

            <div className="panel revenue-panel">
              <div className="panel-header">
                <div>
                  <h2>Sales Summary</h2>
                  <p>Total recorded sales</p>
                </div>
              </div>

              <div className="revenue-value">
                ₹{totalSalesAmount.toFixed(2)}
              </div>

              <div className="summary-line">
                <span>Transactions</span>
                <strong>{sales.length}</strong>
              </div>

              <button
                  className="primary-button full-button"
                  onClick={openSaleForm}
              >
                + Record New Sale
              </button>
            </div>
          </div>
        </>
    );
  }

  function renderMedicines() {
    return (
        <>
          <div className="page-heading">
            <div>
              <h1>Medicines</h1>
              <p>Manage medicines and monitor available stock.</p>
            </div>

            <button
                className="primary-button"
                onClick={() => openMedicineForm()}
            >
              + Add Medicine
            </button>
          </div>

          <div className="toolbar">
            <input
                type="text"
                placeholder="Search medicine, category or supplier..."
                value={searchMedicine}
                onChange={(event) => setSearchMedicine(event.target.value)}
            />
          </div>

          <div className="table-panel">
            <div className="table-wrapper">
              <table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Medicine</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Expiry</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {filteredMedicines.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="no-data">
                        No medicines found.
                      </td>
                    </tr>
                ) : (
                    filteredMedicines.map((medicine) => (
                        <tr key={medicine.medicineId}>
                          <td>#{medicine.medicineId}</td>

                          <td>
                            <strong>{medicine.medicineName}</strong>
                          </td>

                          <td>
                        <span className="category-badge">
                          {medicine.category}
                        </span>
                          </td>

                          <td>₹{Number(medicine.price).toFixed(2)}</td>

                          <td>
                        <span
                            className={
                              Number(medicine.stock) <= 20
                                  ? "stock-badge low"
                                  : "stock-badge"
                            }
                        >
                          {medicine.stock}
                        </span>
                          </td>

                          <td>{medicine.expiryDate}</td>

                          <td>{getSupplierName(medicine.supplier)}</td>

                          <td>
                            <div className="action-buttons">
                              <button
                                  className="edit-button"
                                  onClick={() => openMedicineForm(medicine)}
                              >
                                Edit
                              </button>

                              <button
                                  className="delete-button"
                                  onClick={() =>
                                      deleteMedicine(medicine.medicineId)
                                  }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </>
    );
  }

  function renderSuppliers() {
    return (
        <>
          <div className="page-heading">
            <div>
              <h1>Suppliers</h1>
              <p>Manage pharmacy supplier information.</p>
            </div>

            <button
                className="primary-button"
                onClick={() => openSupplierForm()}
            >
              + Add Supplier
            </button>
          </div>

          <div className="table-panel">
            <div className="table-wrapper">
              <table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Supplier Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {suppliers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-data">
                        No suppliers found.
                      </td>
                    </tr>
                ) : (
                    suppliers.map((supplier) => (
                        <tr key={supplier.supplierId}>
                          <td>#{supplier.supplierId}</td>

                          <td>
                            <strong>{supplier.supplierName}</strong>
                          </td>

                          <td>{supplier.contact || "-"}</td>

                          <td>{supplier.email || "-"}</td>

                          <td>{supplier.address || "-"}</td>

                          <td>
                            <div className="action-buttons">
                              <button
                                  className="edit-button"
                                  onClick={() => openSupplierForm(supplier)}
                              >
                                Edit
                              </button>

                              <button
                                  className="delete-button"
                                  onClick={() =>
                                      deleteSupplier(supplier.supplierId)
                                  }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </>
    );
  }

  function renderPurchases() {
    return (
        <>
          <div className="page-heading">
            <div>
              <h1>Purchases</h1>
              <p>Record and manage medicine purchases.</p>
            </div>

            <button
                className="primary-button"
                onClick={() => openPurchaseForm()}
            >
              + Record Purchase
            </button>
          </div>

          <div className="table-panel">
            <div className="table-wrapper">
              <table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Medicine</th>
                  <th>Quantity</th>
                  <th>Purchase Price</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {purchases.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-data">
                        No purchases found.
                      </td>
                    </tr>
                ) : (
                    purchases.map((purchase) => (
                        <tr key={purchase.purchaseId}>
                          <td>#{purchase.purchaseId}</td>

                          <td>
                            <strong>
                              {getMedicineName(purchase.medicine)}
                            </strong>
                          </td>

                          <td>{purchase.quantity}</td>

                          <td>
                            ₹{Number(purchase.purchasePrice).toFixed(2)}
                          </td>

                          <td>{purchase.purchaseDate}</td>

                          <td>
                            <div className="action-buttons">
                              <button
                                  className="edit-button"
                                  onClick={() => openPurchaseForm(purchase)}
                              >
                                Edit
                              </button>

                              <button
                                  className="delete-button"
                                  onClick={() =>
                                      deletePurchase(purchase.purchaseId)
                                  }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </>
    );
  }

  function renderSales() {
    return (
        <>
          <div className="page-heading">
            <div>
              <h1>Sales</h1>
              <p>Record medicine sales and track sale amounts.</p>
            </div>

            <button className="primary-button" onClick={openSaleForm}>
              + Record Sale
            </button>
          </div>

          <div className="table-panel">
            <div className="table-wrapper">
              <table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Medicine</th>
                  <th>Quantity</th>
                  <th>Sale Price</th>
                  <th>Sale Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {sales.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No sales found.
                      </td>
                    </tr>
                ) : (
                    sales.map((sale) => (
                        <tr key={sale.saleId}>
                          <td>#{sale.saleId}</td>

                          <td>
                            <strong>{getMedicineName(sale.medicine)}</strong>
                          </td>

                          <td>{sale.quantity}</td>

                          <td>
                            ₹{Number(sale.salePrice).toFixed(2)}
                          </td>

                          <td>
                            <strong>
                              ₹{Number(sale.saleAmount || 0).toFixed(2)}
                            </strong>
                          </td>

                          <td>{sale.saleDate}</td>

                          <td>
                            <button
                                className="delete-button"
                                onClick={() => deleteSale(sale.saleId)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </>
    );
  }

  function renderContent() {
    if (loading) {
      return (
          <div className="loading-screen">
            <div className="loader"></div>
            <p>Loading pharmacy data...</p>
          </div>
      );
    }

    switch (activePage) {
      case "medicines":
        return renderMedicines();

      case "suppliers":
        return renderSuppliers();

      case "purchases":
        return renderPurchases();

      case "sales":
        return renderSales();

      default:
        return renderDashboard();
    }
  }

  return (
      <div className="app-container">

        {/* Sidebar */}
        <aside className="sidebar">

          <div className="brand">
            <div className="brand-icon">💊</div>

            <div>
              <h2>PharmaCare</h2>
              <span>Inventory System</span>
            </div>
          </div>

          <div className="menu-title">MAIN MENU</div>

          <nav className="navigation">

            <button
                className={activePage === "dashboard" ? "nav-item active" : "nav-item"}
                onClick={() => setActivePage("dashboard")}
            >
              <span>📊</span>
              Dashboard
            </button>

            <button
                className={activePage === "medicines" ? "nav-item active" : "nav-item"}
                onClick={() => setActivePage("medicines")}
            >
              <span>💊</span>
              Medicines
            </button>

            <button
                className={activePage === "suppliers" ? "nav-item active" : "nav-item"}
                onClick={() => setActivePage("suppliers")}
            >
              <span>🚚</span>
              Suppliers
            </button>

            <button
                className={activePage === "purchases" ? "nav-item active" : "nav-item"}
                onClick={() => setActivePage("purchases")}
            >
              <span>📦</span>
              Purchases
            </button>

            <button
                className={activePage === "sales" ? "nav-item active" : "nav-item"}
                onClick={() => setActivePage("sales")}
            >
              <span>🛒</span>
              Sales
            </button>

          </nav>

          <div className="sidebar-bottom">
            <div className="system-status">
              <span className="status-dot"></span>
              System Online
            </div>
          </div>

        </aside>

        {/* Main */}
        <main className="main">

          <header className="topbar">

            <div>
              <span className="breadcrumb">Pharmacy Management</span>
              <h2>
                {activePage === "dashboard"
                    ? "Dashboard"
                    : activePage.charAt(0).toUpperCase() + activePage.slice(1)}
              </h2>
            </div>

            <div className="profile">
              <div className="profile-avatar">A</div>

              <div>
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>
            </div>

          </header>

          <section className="content">

            {message && (
                <div className="alert success-alert">
                  ✓ {message}
                </div>
            )}

            {error && (
                <div className="alert error-alert">
                  ⚠ {error}
                </div>
            )}

            {renderContent()}

          </section>

        </main>

        {/* =========================
          MEDICINE MODAL
      ========================= */}

        {showMedicineForm && (
            <div className="modal-overlay">

              <div className="modal">

                <div className="modal-header">
                  <div>
                    <h2>
                      {editingMedicine
                          ? "Edit Medicine"
                          : "Add Medicine"}
                    </h2>

                    <p>
                      Enter medicine information below.
                    </p>
                  </div>

                  <button
                      className="close-button"
                      onClick={() => setShowMedicineForm(false)}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={saveMedicine}>

                  <div className="form-grid">

                    <div className="form-group">
                      <label>Medicine Name</label>

                      <input
                          required
                          type="text"
                          value={medicineForm.medicineName}
                          onChange={(event) => {
                            const value = event.target.value;
                            if (/^[A-Za-z .&'-]*$/.test(value)) {
                              setMedicineForm({
                                ...medicineForm,
                                medicineName: value,
                              });
                            }
                          }}
                          placeholder="Enter medicine name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Category</label>

                      <input
                          required
                          type="text"
                          value={medicineForm.category}
                          onChange={(event) => {
                            const value = event.target.value;
                            if (/^[A-Za-z .&'-]*$/.test(value)) {
                              setMedicineForm({
                                ...medicineForm,
                                category: value,
                              });
                            }
                          }}
                          placeholder="Example: Antibiotic"
                      />
                    </div>

                    <div className="form-group">
                      <label>Price</label>

                      <input
                          required
                          min="0"
                          step="0.01"
                          type="number"
                          value={medicineForm.price}
                          onChange={(event) =>
                              setMedicineForm({
                                ...medicineForm,
                                price: event.target.value,
                              })
                          }
                          placeholder="0.00"
                      />
                    </div>

                    <div className="form-group">
                      <label>Stock</label>

                      <input
                          required
                          min="0"
                          type="number"
                          value={medicineForm.stock}
                          onChange={(event) =>
                              setMedicineForm({
                                ...medicineForm,
                                stock: event.target.value,
                              })
                          }
                          placeholder="0"
                      />
                    </div>

                    <div className="form-group">
                      <label>Expiry Date</label>

                      <input
                          required
                          type="date"
                          value={medicineForm.expiryDate}
                          onChange={(event) =>
                              setMedicineForm({
                                ...medicineForm,
                                expiryDate: event.target.value,
                              })
                          }
                      />
                    </div>

                    <div className="form-group">
                      <label>Supplier</label>

                      <select
                          required
                          value={medicineForm.supplierId}
                          onChange={(event) =>
                              setMedicineForm({
                                ...medicineForm,
                                supplierId: event.target.value,
                              })
                          }
                      >
                        <option value="">Select supplier</option>

                        {suppliers.map((supplier) => (
                            <option
                                key={supplier.supplierId}
                                value={supplier.supplierId}
                            >
                              {supplier.supplierName}
                            </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  <div className="modal-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowMedicineForm(false)}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="primary-button">
                      {editingMedicine ? "Update Medicine" : "Add Medicine"}
                    </button>

                  </div>

                </form>

              </div>

            </div>
        )}

        {/* =========================
          SUPPLIER MODAL
      ========================= */}

        {showSupplierForm && (
            <div className="modal-overlay">

              <div className="modal">

                <div className="modal-header">
                  <div>
                    <h2>
                      {editingSupplier
                          ? "Edit Supplier"
                          : "Add Supplier"}
                    </h2>

                    <p>
                      Enter supplier information below.
                    </p>
                  </div>

                  <button
                      className="close-button"
                      onClick={() => setShowSupplierForm(false)}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={saveSupplier}>

                  <div className="form-grid">

                    <div className="form-group">
                      <label>Supplier Name</label>

                      <input
                          required
                          type="text"
                          value={supplierForm.supplierName}
                          onChange={(event) => {
                            const value = event.target.value;
                            if (/^[A-Za-z .&'-]*$/.test(value)) {
                              setSupplierForm({
                                ...supplierForm,
                                supplierName: value,
                              });
                            }
                          }}
                          placeholder="Enter supplier name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Contact</label>

                      <input
                          type="text"
                          value={supplierForm.contact}
                          onChange={(event) =>
                              setSupplierForm({
                                ...supplierForm,
                                contact: event.target.value,
                              })
                          }
                          placeholder="Contact number"
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>

                      <input
                          type="email"
                          value={supplierForm.email}
                          onChange={(event) =>
                              setSupplierForm({
                                ...supplierForm,
                                email: event.target.value,
                              })
                          }
                          placeholder="supplier@example.com"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Address</label>

                      <textarea
                          value={supplierForm.address}
                          onChange={(event) =>
                              setSupplierForm({
                                ...supplierForm,
                                address: event.target.value,
                              })
                          }
                          placeholder="Supplier address"
                          rows="3"
                      />
                    </div>

                  </div>

                  <div className="modal-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowSupplierForm(false)}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="primary-button">
                      {editingSupplier ? "Update Supplier" : "Add Supplier"}
                    </button>

                  </div>

                </form>

              </div>

            </div>
        )}

        {/* =========================
          PURCHASE MODAL
      ========================= */}

        {showPurchaseForm && (
            <div className="modal-overlay">

              <div className="modal">

                <div className="modal-header">
                  <div>
                    <h2>
                      {editingPurchase
                          ? "Edit Purchase"
                          : "Record Purchase"}
                    </h2>

                    <p>
                      Enter purchase details below.
                    </p>
                  </div>

                  <button
                      className="close-button"
                      onClick={() => setShowPurchaseForm(false)}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={savePurchase}>

                  <div className="form-grid">

                    <div className="form-group">
                      <label>Medicine</label>

                      <select
                          required
                          value={purchaseForm.medicineId}
                          onChange={(event) =>
                              setPurchaseForm({
                                ...purchaseForm,
                                medicineId: event.target.value,
                              })
                          }
                      >
                        <option value="">Select medicine</option>

                        {medicines.map((medicine) => (
                            <option
                                key={medicine.medicineId}
                                value={medicine.medicineId}
                            >
                              {medicine.medicineName}
                            </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Quantity</label>

                      <input
                          required
                          min="1"
                          type="number"
                          value={purchaseForm.quantity}
                          onChange={(event) =>
                              setPurchaseForm({
                                ...purchaseForm,
                                quantity: event.target.value,
                              })
                          }
                          placeholder="Quantity"
                      />
                    </div>

                    <div className="form-group">
                      <label>Purchase Price</label>

                      <input
                          required
                          min="0"
                          step="0.01"
                          type="number"
                          value={purchaseForm.purchasePrice}
                          onChange={(event) =>
                              setPurchaseForm({
                                ...purchaseForm,
                                purchasePrice: event.target.value,
                              })
                          }
                          placeholder="0.00"
                      />
                    </div>

                    <div className="form-group">
                      <label>Purchase Date</label>

                      <input
                          required
                          type="date"
                          value={purchaseForm.purchaseDate}
                          onChange={(event) =>
                              setPurchaseForm({
                                ...purchaseForm,
                                purchaseDate: event.target.value,
                              })
                          }
                      />
                    </div>

                  </div>

                  <div className="modal-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowPurchaseForm(false)}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="primary-button">
                      {editingPurchase
                          ? "Update Purchase"
                          : "Record Purchase"}
                    </button>

                  </div>

                </form>

              </div>

            </div>
        )}

        {/* =========================
          SALE MODAL
      ========================= */}

        {showSaleForm && (
            <div className="modal-overlay">

              <div className="modal">

                <div className="modal-header">
                  <div>
                    <h2>Record Medicine Sale</h2>

                    <p>
                      Select medicine and enter quantity.
                    </p>
                  </div>

                  <button
                      className="close-button"
                      onClick={() => setShowSaleForm(false)}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={saveSale}>

                  <div className="form-grid">

                    <div className="form-group full-width">
                      <label>Medicine</label>

                      <select
                          required
                          value={saleForm.medicineId}
                          onChange={(event) =>
                              setSaleForm({
                                ...saleForm,
                                medicineId: event.target.value,
                              })
                          }
                      >
                        <option value="">Select medicine</option>

                        {medicines.map((medicine) => (
                            <option
                                key={medicine.medicineId}
                                value={medicine.medicineId}
                            >
                              {medicine.medicineName} — Stock:{" "}
                              {medicine.stock}
                            </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Quantity</label>

                      <input
                          required
                          min="1"
                          type="number"
                          value={saleForm.quantity}
                          onChange={(event) =>
                              setSaleForm({
                                ...saleForm,
                                quantity: event.target.value,
                              })
                          }
                          placeholder="Enter quantity"
                      />
                    </div>

                    {saleForm.medicineId && (
                        <div className="sale-preview">

                          {(() => {
                            const medicine = medicines.find(
                                (item) =>
                                    String(item.medicineId) ===
                                    String(saleForm.medicineId)
                            );

                            if (!medicine) return null;

                            const quantity = Number(
                                saleForm.quantity || 0
                            );

                            const amount =
                                quantity * Number(medicine.price);

                            return (
                                <>
                                  <div>
                                    <span>Price</span>
                                    <strong>
                                      ₹
                                      {Number(medicine.price).toFixed(
                                          2
                                      )}
                                    </strong>
                                  </div>

                                  <div>
                                    <span>Available Stock</span>
                                    <strong>{medicine.stock}</strong>
                                  </div>

                                  <div>
                                    <span>Sale Amount</span>
                                    <strong>
                                      ₹{amount.toFixed(2)}
                                    </strong>
                                  </div>
                                </>
                            );
                          })()}

                        </div>
                    )}

                  </div>

                  <div className="modal-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowSaleForm(false)}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="primary-button">
                      Record Sale
                    </button>

                  </div>

                </form>

              </div>

            </div>
        )}

      </div>
  );
}

export default App;
