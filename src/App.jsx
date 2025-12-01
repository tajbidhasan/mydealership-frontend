import React, { useState } from "react";
import "./App.css";

const ZIP_RATES = {
  "10701": { tax_rate: 8.875 },
  "10801": { tax_rate: 8.375 },
  "10451": { tax_rate: 8.875 },
};

const getDefaultDate = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const toNum = (v) => (v ? parseFloat(v) : 0);

function App() {
  // LOGIN
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "651033") {
      setIsAuthorized(true);
    } else {
      alert("Incorrect passcode.");
    }
  };

  // TOP INFO
  const [customerName, setCustomerName] = useState("");
  const [vehicleDesc, setVehicleDesc] = useState("");
  const [date, setDate] = useState(getDefaultDate());
  const [vin, setVin] = useState("");
  const [stock, setStock] = useState("");
  const [salesperson, setSalesperson] = useState("TJ");

  // VEHICLE & TAXES
  const [sellingPrice, setSellingPrice] = useState("");
  const [fees, setFees] = useState("495");
  const [salesTaxRate, setSalesTaxRate] = useState("8.875");
  const [taxExempt, setTaxExempt] = useState(false);
  const [rebates, setRebates] = useState("0");

  // CASH & TRADE
  const [cashDown, setCashDown] = useState("0");
  const [tradeAllowance, setTradeAllowance] = useState("0");
  const [tradePayoff, setTradePayoff] = useState("0");

  // TERMS
  const [financeAPR, setFinanceAPR] = useState("5.9");
  const [residualPercent, setResidualPercent] = useState("60");
  const [moneyFactor, setMoneyFactor] = useState("0.00125");
  const [acquisitionFee, setAcquisitionFee] = useState("895");

  // CALCULATED
  const [vehiclePrice, setVehiclePrice] = useState(0);
  const [totalDueAtSigning, setTotalDueAtSigning] = useState(0);
  const [totalSavingsEquity, setTotalSavingsEquity] = useState(0);
  const [netTradeEquity, setNetTradeEquity] = useState(0);

  const [financePayA, setFinancePayA] = useState(0);
  const [financePayB, setFinancePayB] = useState(0);
  const [leasePayA, setLeasePayA] = useState(0);
  const [leasePayB, setLeasePayB] = useState(0);
  const [outTheDoor, setOutTheDoor] = useState(0);

  const handleZipLookup = (zip) => {
    const info = ZIP_RATES[zip];
    if (!info) {
      alert("ZIP not in static table yet.");
      return;
    }
    setSalesTaxRate(info.tax_rate.toString());
  };

  const handleUpdatePayments = () => {
    const sp = toNum(sellingPrice);
    const fee = toNum(fees);
    const taxRate = toNum(salesTaxRate);
    const rebate = toNum(rebates);

    const cash = toNum(cashDown);
    const ta = toNum(tradeAllowance);
    const tp = toNum(tradePayoff);

    const fApr = toNum(financeAPR);
    const residPct = toNum(residualPercent);
    const mf = toNum(moneyFactor);
    const acq = toNum(acquisitionFee);

    // vehicle price
    setVehiclePrice(sp);

    // trade equity
    const nte = ta - tp;
    setNetTradeEquity(nte);

    // tax and OTD
    const taxableBase = taxExempt ? 0 : Math.max(sp + fee - rebate - nte, 0);
    const taxes = taxableBase * (taxRate / 100);

    const todayOutTheDoor = sp + fee + taxes - rebate - nte;
    setOutTheDoor(todayOutTheDoor);

    // due at signing (cash + acq)
    setTotalDueAtSigning(cash + acq);

    // total savings / equity
    setTotalSavingsEquity(rebate + nte);

    const effectiveDown = cash + Math.max(nte, 0);

    // finance amount
    const baseAmtFin = Math.max(
      sp + fee + taxes - effectiveDown - rebate,
      0
    );

    // lease cap cost
    const capCostBase = Math.max(
      sp + fee + acq - effectiveDown - rebate,
      0
    );
    const residVal = sp * (residPct / 100);

    const makeFinancePay = (term) => {
      if (!baseAmtFin || !term) return 0;
      const r = fApr / 100 / 12;
      if (r === 0) return baseAmtFin / term;
      return (baseAmtFin * r) / (1 - Math.pow(1 + r, -term));
    };

    const makeLeasePay = (term) => {
      if (!capCostBase || !term) return 0;
      const dep = (capCostBase - residVal) / term;
      const fin = (capCostBase + residVal) * mf;
      const base = dep + fin;
      return base * (1 + taxRate / 100);
    };

    // four payment options
    setFinancePayA(makeFinancePay(72)); // Finance A
    setFinancePayB(makeFinancePay(60)); // Finance B
    setLeasePayA(makeLeasePay(36));     // Lease A
    setLeasePayB(makeLeasePay(24));     // Lease B
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

  const effectiveDownDisplay =
    toNum(cashDown) + Math.max(netTradeEquity, 0);

  return (
    <div className="app-root">
      <div className="page worksheet-page">
        {/* HEADER */}
        <header className="top-bar">
          <div>
            <h1 className="title">PAYMENT OPTIONS WORKSHEET</h1>
            <p className="subtitle">Toyota – Sales Quote (Estimate Only)</p>
          </div>
          <div className="toyota-pill">TOYOTA</div>
        </header>

        {/* CUSTOMER / VEHICLE */}
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
            <select
              className="field-select"
              onChange={(e) => setVehicleDesc(e.target.value)}
              value=""
            >
              <option value="">Select Toyota model…</option>
              <option value="2024 Toyota RAV4 XLE">2024 Toyota RAV4 XLE</option>
              <option value="2024 Toyota RAV4 LE">2024 Toyota RAV4 LE</option>
              <option value="2024 Toyota Camry LE">2024 Toyota Camry LE</option>
              <option value="2024 Toyota Camry SE">2024 Toyota Camry SE</option>
              <option value="2024 Toyota Corolla LE">
                2024 Toyota Corolla LE
              </option>
              <option value="2024 Toyota Highlander XLE">
                2024 Toyota Highlander XLE
              </option>
              <option value="2024 Toyota Grand Highlander XLE">
                2024 Toyota Grand Highlander XLE
              </option>
              <option value="2024 Toyota Sienna XLE">
                2024 Toyota Sienna XLE
              </option>
              <option value="2024 Toyota Tundra SR5">
                2024 Toyota Tundra SR5
              </option>
            </select>
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

        {/* SUMMARY STRIP */}
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

        {/* DEALER INPUTS */}
        <section className="cols-3">
          <div className="card">
            <h2 className="card-title">Vehicle &amp; Taxes</h2>
            <div className="field">
              <label>Selling Price ($)</label>
              <input
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="field">
              <label>Doc / DMV / Other Fees ($)</label>
              <input
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="495"
              />
            </div>
            <div className="field">
              <label>Sales Tax Rate (%)</label>
              <input
                value={salesTaxRate}
                onChange={(e) => setSalesTaxRate(e.target.value)}
                placeholder="8.875"
              />
            </div>
            <div className="field checkbox-row">
              <input
                type="checkbox"
                checked={taxExempt}
                onChange={(e) => setTaxExempt(e.target.checked)}
              />
              <span>Tax exempt / out of state</span>
            </div>
            <div className="field">
              <label>Rebates / Incentives ($)</label>
              <input
                value={rebates}
                onChange={(e) => setRebates(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="field">
              <label>Quick ZIP Tax Lookup</label>
              <input
                placeholder="Enter ZIP e.g. 10801"
                onBlur={(e) => handleZipLookup(e.target.value)}
              />
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Cash &amp; Trade</h2>
            <div className="field">
              <label>Customer Cash Down ($)</label>
              <input
                value={cashDown}
                onChange={(e) => setCashDown(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="field">
              <label>Trade Allowance ($)</label>
              <input
                value={tradeAllowance}
                onChange={(e) => setTradeAllowance(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="field">
              <label>Trade Payoff ($)</label>
              <input
                value={tradePayoff}
                onChange={(e) => setTradePayoff(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="field">
              <label>Net Trade Equity (Auto)</label>
              <input value={netTradeEquity.toFixed(2)} readOnly />
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Terms</h2>
            <div className="field">
              <label>Finance APR (%)</label>
              <input
                value={financeAPR}
                onChange={(e) => setFinanceAPR(e.target.value)}
                placeholder="5.9"
              />
            </div>
            <div className="field">
              <label>Residual (% of price)</label>
              <input
                value={residualPercent}
                onChange={(e) => setResidualPercent(e.target.value)}
                placeholder="60"
              />
            </div>
            <div className="field">
              <label>Money Factor</label>
              <input
                value={moneyFactor}
                onChange={(e) => setMoneyFactor(e.target.value)}
                placeholder="0.00125"
              />
            </div>
            <div className="field">
              <label>Acquisition Fee ($)</label>
              <input
                value={acquisitionFee}
                onChange={(e) => setAcquisitionFee(e.target.value)}
                placeholder="895"
              />
            </div>
          </div>
        </section>

        {/* FOUR PAYMENT OPTIONS */}
        <section className="payments-row">
          <div className="payment-card finance">
            <div className="payment-label">Finance Options</div>
            <div className="payment-grid">
              <div className="payment-option">
                <div className="payment-main">
                  ${financePayA.toFixed(2)}<span>/mo</span>
                </div>
                <div className="payment-sub">
                  Finance A · Down ${effectiveDownDisplay.toFixed(2)}
                </div>
              </div>
              <div className="payment-option">
                <div className="payment-main">
                  ${financePayB.toFixed(2)}<span>/mo</span>
                </div>
                <div className="payment-sub">
                  Finance B · Down ${effectiveDownDisplay.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="payment-card lease">
            <div className="payment-label">Lease Options</div>
            <div className="payment-grid">
              <div className="payment-option">
                <div className="payment-main">
                  ${leasePayA.toFixed(2)}<span>/mo</span>
                </div>
                <div className="payment-sub">
                  Lease A · Down ${effectiveDownDisplay.toFixed(2)}
                </div>
              </div>
              <div className="payment-option">
                <div className="payment-main">
                  ${leasePayB.toFixed(2)}<span>/mo</span>
                </div>
                <div className="payment-sub">
                  Lease B · Down ${effectiveDownDisplay.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM TOTALS */}
        <section className="totals-strip">
          <div className="totals-box">
            <div className="totals-label">Cash Price</div>
            <div className="totals-value">
              ${sellingPrice || "0"}
            </div>
          </div>
          <div className="totals-box">
            <div className="totals-label">Tax</div>
            <div className="totals-value">
              {(vehiclePrice
                ? (vehiclePrice +
                    toNum(fees) -
                    toNum(rebates) -
                    netTradeEquity) *
                  (toNum(salesTaxRate) / 100)
                : 0
              ).toFixed(2)}
            </div>
          </div>
          <div className="totals-box">
            <div className="totals-label">Doc / DMV / Fees</div>
            <div className="totals-value">
              ${fees || "0"}
            </div>
          </div>
          <div className="totals-box totals-emphasis">
            <div className="totals-label">Today Out‑The‑Door</div>
            <div className="totals-value">
              ${outTheDoor.toFixed(2)}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section className="footer-row">
          <div className="sig-col">
            <div className="sig-line">Customer Signature</div>
          </div>
          <div className="buttons-col">
            <button type="button" onClick={handleUpdatePayments}>
              Update Payments
            </button>
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

export default App;
