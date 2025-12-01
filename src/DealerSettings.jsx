import React from "react";

const ZIP_RATES = {
  "10701": { tax_rate: 8.875 },
  "10801": { tax_rate: 8.375 },
  "10451": { tax_rate: 8.875 },
};

const toNum = (v) => (v ? parseFloat(v) : 0);

function DealerSettings({
  sellingPrice,
  fees,
  salesTaxRate,
  taxExempt,
  rebates,
  cashDown,
  tradeAllowance,
  tradePayoff,
  financeAPR,
  residualPercent,
  moneyFactor,
  acquisitionFee,
  setSellingPrice,
  setFees,
  setSalesTaxRate,
  setTaxExempt,
  setRebates,
  setCashDown,
  setTradeAllowance,
  setTradePayoff,
  setFinanceAPR,
  setResidualPercent,
  setMoneyFactor,
  setAcquisitionFee,
  setVehiclePrice,
  setNetTradeEquity,
  setTotalDueAtSigning,
  setTotalSavingsEquity,
  setFinancePayA,
  setFinancePayB,
  setLeasePayA,
  setLeasePayB,
}) {
  const handleZipLookup = (zip) => {
    const info = ZIP_RATES[zip];
    if (!info) {
      alert("ZIP not in static table yet.");
      return;
    }
    setSalesTaxRate(info.tax_rate.toString());
  };

  const recalc = () => {
    const sp = toNum(sellingPrice);
    const fee = toNum(fees);
    const taxRate = toNum(salesTaxRate);
    const rebate = toNum(rebates);
    const cash = toNum(cashDown);
    const ta = toNum(tradeAllowance);
    const tp = toNum(tradePayoff);
    const apr = toNum(financeAPR);
    const residPct = toNum(residualPercent);
    const mf = toNum(moneyFactor);
    const acq = toNum(acquisitionFee);

    setVehiclePrice(sp);

    const nte = ta - tp;
    setNetTradeEquity(nte);

    const taxableBase = taxExempt ? 0 : Math.max(sp + fee - rebate - nte, 0);
    const taxes = taxableBase * (taxRate / 100);

    const effectiveDown = cash + Math.max(nte, 0);
    const baseAmtFin = Math.max(sp + fee + taxes - effectiveDown - rebate, 0);

    setTotalDueAtSigning(cash + acq);
    setTotalSavingsEquity(rebate + nte);

    const capCostBase = Math.max(sp + fee + acq - effectiveDown - rebate, 0);
    const residVal = sp * (residPct / 100);

    // finance A (72 mo) & B (60 mo)
    const makeFinancePay = (term) => {
      if (!baseAmtFin || !term) return 0;
      const r = apr / 100 / 12;
      return r === 0
        ? baseAmtFin / term
        : (baseAmtFin * r) / (1 - Math.pow(1 + r, -term));
    };

    setFinancePayA(makeFinancePay(72));
    setFinancePayB(makeFinancePay(60));

    // lease A (36 mo) & B (24 mo)
    const makeLeasePay = (term) => {
      if (!capCostBase || !term) return 0;
      const dep = (capCostBase - residVal) / term;
      const fin = (capCostBase + residVal) * mf;
      const base = dep + fin;
      return base * (1 + taxRate / 100);
    };

    setLeasePayA(makeLeasePay(36));
    setLeasePayB(makeLeasePay(24));
  };

  return (
    <div className="dealer-panel">
      <button type="button" className="dealer-toggle" onClick={recalc}>
        Update payments (dealer)
      </button>

      <div className="cols-3">
        <div className="card">
          <h2 className="card-title">Vehicle &amp; Taxes</h2>
          <div className="field">
            <label>Selling Price ($)</label>
            <input
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Doc / DMV / Other Fees ($)</label>
            <input
              value={fees}
              onChange={(e) => setFees(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Sales Tax Rate (%)</label>
            <input
              value={salesTaxRate}
              onChange={(e) => setSalesTaxRate(e.target.value)}
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
            />
          </div>
          <div className="field">
            <label>Trade Allowance ($)</label>
            <input
              value={tradeAllowance}
              onChange={(e) => setTradeAllowance(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Trade Payoff ($)</label>
            <input
              value={tradePayoff}
              onChange={(e) => setTradePayoff(e.target.value)}
            />
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Terms</h2>
          <div className="field">
            <label>Finance APR (%)</label>
            <input
              value={financeAPR}
              onChange={(e) => setFinanceAPR(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Residual (% of price)</label>
            <input
              value={residualPercent}
              onChange={(e) => setResidualPercent(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Money Factor</label>
            <input
              value={moneyFactor}
              onChange={(e) => setMoneyFactor(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Acquisition Fee ($)</label>
            <input
              value={acquisitionFee}
              onChange={(e) => setAcquisitionFee(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealerSettings;
