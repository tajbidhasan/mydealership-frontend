import React, { useState } from "react";
import DealerSettings from "./DealerSettings.jsx";
import PaymentSummary from "./PaymentSummary.jsx";
import "./App.css";

const getDefaultDate = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

function PaymentWorksheet() {
  // login
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "651033") setIsAuthorized(true);
    else alert("Incorrect passcode.");
  };

  // top info
  const [customerName, setCustomerName] = useState("");
  const [vehicleDesc, setVehicleDesc] = useState("");
  const [date, setDate] = useState(getDefaultDate());
  const [vin, setVin] = useState("");
  const [stock, setStock] = useState("");
  const [salesperson, setSalesperson] = useState("TJ");

  // dealer fields
  const [sellingPrice, setSellingPrice] = useState("");
  const [fees, setFees] = useState("495");
  const [salesTaxRate, setSalesTaxRate] = useState("8.875");
  const [taxExempt, setTaxExempt] = useState(false);
  const [rebates, setRebates] = useState("0");
  const [cashDown, setCashDown] = useState("0");
  const [tradeAllowance, setTradeAllowance] = useState("0");
  const [tradePayoff, setTradePayoff] = useState("0");
  const [financeAPR, setFinanceAPR] = useState("5.9");
  const [residualPercent, setResidualPercent] = useState("60");
  const [moneyFactor, setMoneyFactor] = useState("0.00125");
  const [acquisitionFee, setAcquisitionFee] = useState("895");

  // calculated summary
  const [vehiclePrice, setVehiclePrice] = useState(0);
  const [totalDueAtSigning, setTotalDueAtSigning] = useState(0);
  const [totalSavingsEquity, setTotalSavingsEquity] = useState(0);
  // payments
  const [financePayA, setFinancePayA] = useState(0);
  const [financePayB, setFinancePayB] = useState(0);
  const [leasePayA, setLeasePayA] = useState(0);
  const [leasePayB, setLeasePayB] = useState(0);

  const handleDealerFieldChange = (field, value) => {
    const setters = {
      sellingPrice: setSellingPrice,
      fees: setFees,
      salesTaxRate: setSalesTaxRate,
      taxExempt: setTaxExempt,
      rebates: setRebates,
      cashDown: setCashDown,
      tradeAllowance: setTradeAllowance,
      tradePayoff: setTradePayoff,
      financeAPR: setFinanceAPR,
      residualPercent: setResidualPercent,
      moneyFactor: setMoneyFactor,
      acquisitionFee: setAcquisitionFee,
    };
    setters[field](value);
  };

  const handlePrint = () => window.print();

  if (!isAuthorized) {
    return (
      <div className="app-root">
        <div className="page login-page">
          <div className="login-header">
            <div className="toyota-pill">TOYOTA</div>
            <div>
              <h1 className="title">Payment Options Worksheet</h1>
              <p className="subtitle">Cash · Finance · Lease · Trade</p>
            </div>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <label className="login-label">Passcode</label>
            <input
              className="login-input"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter 651033"
            />
            <button type="submit" className="login-button">
              Enter
            </button>
            <p className="login-hint">
              Internal use only. Toyota sales quote – estimate only.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <div className="page worksheet-page">
        <header className="top-bar">
          <div>
            <h1 className="title">PAYMENT OPTIONS WORKSHEET</h1>
            <p className="subtitle">Toyota – Sales Quote (Estimate Only)</p>
          </div>
          <div className="toyota-pill">TOYOTA</div>
        </header>

        {/* customer / vehicle */}
        <section className="info-grid">
          <div className="field">
            <label>Customer Name</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer full name"
            />
          </div>
          <div className="field">
            <label>Vehicle (Year / Model / Trim)</label>
            <input
              value={vehicleDesc}
              onChange={(e) => setVehicleDesc(e.target.value)}
              placeholder="2024 Toyota RAV4 XLE"
            />
          </div>
          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="field">
            <label>VIN</label>
            <input
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="Last 8 if you want"
            />
          </div>
          <div className="field">
            <label>Stock #</label>
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Salesperson</label>
            <input
              value={salesperson}
              onChange={(e) => setSalesperson(e.target.value)}
            />
          </div>
        </section>

        {/* summary strip */}
        <section className="summary-strip">
          <div className="summary-box">
            <div className="summary-label">Vehicle Price</div>
            <div className="summary-value">${vehiclePrice.toFixed(2)}</div>
          </div>
          <div className="summary-box">
            <div className="summary-label">Total Due at Signing</div>
            <div className="summary-value">
              ${totalDueAtSigning.toFixed(2)}
            </div>
          </div>
          <div className="summary-box">
            <div className="summary-label">Total Savings / Equity</div>
            <div className="summary-value">
              ${totalSavingsEquity.toFixed(2)}
            </div>
          </div>
        </section>

        {/* dealer controls (math) */}
        <DealerSettings
          sellingPrice={sellingPrice}
          fees={fees}
          salesTaxRate={salesTaxRate}
          taxExempt={taxExempt}
          rebates={rebates}
          cashDown={cashDown}
          tradeAllowance={tradeAllowance}
          tradePayoff={tradePayoff}
          financeAPR={financeAPR}
          residualPercent={residualPercent}
          moneyFactor={moneyFactor}
          acquisitionFee={acquisitionFee}
          onFieldChange={handleDealerFieldChange}
          onRecalc={() => {}}
          setVehiclePrice={setVehiclePrice}
          setTotalDueAtSigning={setTotalDueAtSigning}
          setTotalSavingsEquity={setTotalSavingsEquity}
          setFinancePayA={setFinancePayA}
          setFinancePayB={setFinancePayB}
          setLeasePayA={setLeasePayA}
          setLeasePayB={setLeasePayB}
        />
        {/* 4 clean payments */}
        <PaymentSummary
          financePayA={financePayA}
          financePayB={financePayB}
          leasePayA={leasePayA}
          leasePayB={leasePayB}
        />

        <section className="footer-row">
          <div className="sig-col">
            <div className="sig-line">Customer Signature</div>
          </div>
          <div className="buttons-col">
            <button type="button" onClick={handlePrint}>
              Print Worksheet
            </button>
          </div>
          <div className="sig-col">
            <div className="sig-line">Manager / Salesperson</div>
          </div>
        </section>

        <p className="disclaimer">
          * All figures are estimates only – final terms subject to lender
          approval.
        </p>
      </div>
    </div>
  );
}

export default PaymentWorksheet;
