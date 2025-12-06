import { Check, Plus } from "lucide-react";
import paymenticon from "../../assets/paymentcard.svg"

export default function Wallet() {
  return (
    <div className="min-h-screen px-3 sm:px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Wallet Balance */}
        <div className="bg-white rounded-xl flex flex-col space-y-4 p-3">
          <div className="bg-gradient-to-r from-[#014205] via-[#01F8225] via-[#1B7920] to-[#014205] rounded-2xl p-6 text-white shadow-lg">

            <p className="text-green-100 text-sm font-medium text-center">Available Balance</p>
            <div className="text-3xl font-bold text-center my-2">$500.30</div>
            <div className="text-green-200 text-sm font-light text-center mb-6">$58.00 Pending</div>

            {/* Responsive 2-column to 1-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

              <div className="bg-white rounded-xl p-4 text-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">Total Saved</span>
                </div>
                <div className="text-lg font-semibold">$1500.39</div>
              </div>

              <div className="bg-white rounded-xl p-4 text-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">Total Saved this Month</span>
                </div>
                <div className="text-lg font-semibold">$200.12</div>
              </div>

            </div>

            <button className="w-full bg-white text-green-600 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-green-50 transition-colors">
              <Plus className="w-5 h-5" />
              Add Money to Wallet
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h2 className="text-lg text-green-600 font-semibold">Payment Methods</h2>
            <button className="flex items-center gap-1 text-green-600 font-medium">
              <Plus className="w-4 h-4" />
              Add Cards
            </button>
          </div>

          <div className="space-y-3">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-xl gap-3">
              <div className="flex items-center gap-3">
                <img src={paymenticon} className="w-10 h-10" />
                <div>
                  <div className="font-medium">VISA***4242</div>
                  <div className="text-sm text-gray-500">Synced with escrow</div>
                </div>
              </div>
              <div className="text-green-600 text-sm font-medium">Default</div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-xl gap-3">
              <div className="flex items-center gap-3">
                <img src={paymenticon} className="w-10 h-10" />
                <div>
                  <div className="font-medium">Mastercard***8182</div>
                  <div className="text-sm text-gray-500">Synced with escrow</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Transaction History</h2>

          <div className="flex flex-wrap gap-4 mb-6 border-b border-gray-200 pb-2">
            {["All", "Payments", "Refunds", "Deposits"].map(tab => (
              <button
                key={tab}
                className={`pb-2 ${
                  tab === "All"
                    ? "text-green-600 border-b-2 border-green-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">

            <div className="flex flex-col sm:flex-row justify-between items-start py-3 border-b border-gray-100">
              <div className="flex-1">
                <div className="font-medium">Groceries Split - Walmart</div>
                <div className="text-sm text-gray-500">Oct 11, 10:30 AM • 4 People</div>
              </div>
              <div className="text-red-600 font-medium">-$50.10</div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start py-3 border-b border-gray-100">
              <div className="flex-1">
                <div className="font-medium">Cancelled: Movie Night</div>
                <div className="text-sm text-gray-500">Oct 15, 12:30 PM • 3 People</div>
                <div className="text-sm text-gray-500">Refunded</div>
              </div>
              <div className="text-green-600 font-medium">+$25.10</div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start py-3 border-b border-gray-100">
              <div className="flex-1">
                <div className="font-medium">Uber Ride Downtown</div>
                <div className="text-sm text-gray-500">Oct 19, 10:30 PM • 2 People</div>
              </div>
              <div className="text-red-600 font-medium">-$12.10</div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start py-3 border-b border-gray-100">
              <div className="flex-1">
                <div className="font-medium">Wallet Top-up</div>
                <div className="text-sm text-gray-500">Oct 20, 12:30 AM</div>
              </div>
              <div className="text-green-600 font-medium">+$1000.00</div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start py-3">
              <div className="flex-1">
                <div className="font-medium">Netflix Subscription</div>
                <div className="text-sm text-gray-500">Oct 22, 8:00 PM • 4 People</div>
              </div>
              <div className="text-red-600 font-medium">-$5.08</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
