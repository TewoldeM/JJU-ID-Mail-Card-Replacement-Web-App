"use client"
import Head from "next/head";
import { useState } from "react";


interface Props {
  onPaymentSuccess: (paymentMethod: string) => void;

}



const PaymentGateway = ({ onPaymentSuccess }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const handleCardChange = (event: any) => {
    // setPaymentMethod(event.target.elements.card);
  };

  const handlePay = async () => {
    try {


    }
    catch (error:any) {
      setError(error.message);
    }
  } 
  return (
    <div className="h-screen mt-20">
      <div className="max-w-md mx-auto p-4 border-2 border-gray-600 rounded-md shadow-md ">
        <h2 className="text-lg font-bold mb-4">Payment Gateway</h2>
        <form>
          <div className="mb-4">
            <label className="block text-lg font-medium" htmlFor="card">
              Card details
            </label>
            <input
              type="text"
              id="card"
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              onChange={handleCardChange}
            />
          </div>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handlePay}
          >
            Pay
          </button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
  };

export default PaymentGateway;
