import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiBook,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import { transactionAPI } from "../services/api";
import TransactionTable from "../components/TransactionTable";

const TransactionsBySchool = () => {
  const [transactions, setTransactions] = useState([]);
  const [schoolIds, setSchoolIds] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadSchoolIds = async () => {
      try {
        const ids = await transactionAPI.getSchoolIds();
        setSchoolIds(ids);
      } catch (error) {
        console.error("Failed to load school IDs:", error);
        setError("Failed to load school IDs. Please try again.");
      }
    };
    loadSchoolIds();
  }, []);

  const fetchTransactionsBySchool = async (schoolId) => {
    if (!schoolId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await transactionAPI.getTransactionsBySchool(schoolId);
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch school transactions:", error);
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolSelect = (schoolId) => {
    setSelectedSchoolId(schoolId);
    fetchTransactionsBySchool(schoolId);
  };

  const filteredSchoolIds = schoolIds.filter((id) =>
    id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats for selected school
  const stats = selectedSchoolId
    ? {
        total: transactions.length,
        successful: transactions.filter((t) => t.status === "Success").length,
        pending: transactions.filter((t) => t.status === "Pending").length,
        failed: transactions.filter((t) => t.status === "Failed").length,
        totalAmount: transactions.reduce(
          (sum, t) => sum + t.transaction_amount,
          0
        ),
      }
    : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="animate-slideIn">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          School by Transactions
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 p-4 rounded-lg animate-slideIn">
          {error}
        </div>
      )}

      {/* School Selection */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 animate-scaleIn hover:shadow-lg transition-all duration-300">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search and Select School
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 animate-pulse-slow" />
            <input
              type="text"
              placeholder="Search school IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none focus:outline-none focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 transform"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-60 overflow-y-auto">
          {filteredSchoolIds.map((schoolId, index) => (
            <button
              key={schoolId}
              onClick={() => handleSchoolSelect(schoolId)}
              className={`
                flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-100 hover:shadow-md animate-slideIn
                ${
                  selectedSchoolId === schoolId
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-2 border-blue-500"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600"
                }
              `}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <FiBook className="h-4 w-4 mr-1 transition-transform duration-200 group-hover:scale-110" />
              {schoolId}
            </button>
          ))}
        </div>

        {filteredSchoolIds.length === 0 && searchQuery && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No schools found matching "{searchQuery}"
          </p>
        )}
      </div>

      {/* School Stats */}
      {selectedSchoolId && stats && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 animate-scaleIn hover:shadow-lg transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Statistics for {selectedSchoolId}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div
              className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-slideIn hover:scale-105 transition-all duration-200"
              style={{ animationDelay: "0.1s" }}
            >
              <FiCreditCard className="h-8 w-8 text-blue-500 animate-pulse-slow" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
            </div>

            <div
              className="flex items-center space-x-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg animate-slideIn hover:scale-105 transition-all duration-200"
              style={{ animationDelay: "0.2s" }}
            >
              <FiCheckCircle className="h-8 w-8 text-emerald-500 animate-pulse-slow" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Successful
                </p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.successful}
                </p>
              </div>
            </div>

            <div
              className="flex items-center space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg animate-slideIn hover:scale-105 transition-all duration-200"
              style={{ animationDelay: "0.3s" }}
            >
              <FiClock className="h-8 w-8 text-amber-500 animate-pulse-slow" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.pending}
                </p>
              </div>
            </div>

            <div
              className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg animate-slideIn hover:scale-105 transition-all duration-200"
              style={{ animationDelay: "0.4s" }}
            >
              <FiXCircle className="h-8 w-8 text-red-500 animate-pulse-slow" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Failed
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.failed}
                </p>
              </div>
            </div>

            <div
              className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-slideIn hover:scale-105 transition-all duration-200"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse-slow">
                <span className="text-white font-bold text-sm">₹</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Amount
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ₹{stats.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      {selectedSchoolId && (
        <div className="animate-slideIn" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Transactions for {selectedSchoolId}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {transactions.length} transaction
              {transactions.length !== 1 ? "s" : ""}
            </span>
          </div>

          <TransactionTable
            transactions={transactions}
            sortConfig={null}
            onSort={() => {}} // No sorting for this view
            loading={loading}
          />
        </div>
      )}

      {/* Empty State */}
      {!selectedSchoolId && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-12 text-center animate-scaleIn">
          <FiBook className="mx-auto h-12 w-12 text-gray-400 animate-pulse-slow" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Select a School to View Transactions
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Choose a school from the list above to see its transaction history
            and statistics.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionsBySchool;
