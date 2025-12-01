import React from "react";

function PaymentSummary({ financePayA, financePayB, leasePayA, leasePayB }) {
  return (
    <section className="payments-row">
      <div className="payment-card finance">
        <div className="payment-label">Finance Options</div>
        <div className="payment-grid">
          <div className="payment-option">
            <div className="payment-main">
              ${financePayA.toFixed(2)}<span>/mo</span>
            </div>
            <div className="payment-sub">Finance A</div>
          </div>
          <div className="payment-option">
            <div className="payment-main">
              ${financePayB.toFixed(2)}<span>/mo</span>
            </div>
            <div className="payment-sub">Finance B</div>
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
            <div className="payment-sub">Lease A</div>
          </div>
          <div className="payment-option">
            <div className="payment-main">
              ${leasePayB.toFixed(2)}<span>/mo</span>
            </div>
            <div className="payment-sub">Lease B</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PaymentSummary;
