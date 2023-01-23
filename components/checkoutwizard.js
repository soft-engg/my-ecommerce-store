import React from 'react';

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <div className="mb-5 flex flex-wrap">
      {['User Login', 'Shipping Address', 'Payment Method', 'place order'].map(
        (step, index) => (
          <div
            className={`flex-1 text-sm border-b-2 text-center font-medium 
          ${
            index <= activeStep
              ? 'border-amber-500 text-amber-500'
              : 'border-gray-400 text-gray-400'
          }`}
            key={step}
          >
            {step}
          </div>
        )
      )}
    </div>
  );
}
