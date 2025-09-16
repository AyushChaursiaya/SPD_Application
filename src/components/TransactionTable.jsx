import React from 'react';
import { HiChevronUp, HiChevronDown, HiSelector } from 'react-icons/hi';

const formatDate = (isoDate) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(isoDate));
};

const TransactionTable = ({
  transactions,
  sortConfig,
  onSort,
  loading = false,
}) => {
  const columns = [
    { key: 'collect_id', label: 'Collect ID' },
    { key: 'school_id', label: 'School ID' },
    { key: 'gateway', label: 'Gateway' },
    { key: 'order_amount', label: 'Order Amount' },
    { key: 'transaction_amount', label: 'Transaction Amount' },
    { key: 'status', label: 'Status' },
    { key: 'custom_order_id', label: 'Custom Order ID' },
    { key: 'created_at', label: 'Date' },
  ];

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === 'asc' ? (
        <HiChevronUp className="h-4 w-4" />
      ) : (
        <HiChevronDown className="h-4 w-4" />
      );
    }
    return <HiSelector className="h-4 w-4 text-gray-400" />;
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
      Failed: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusStyles[status]
        }`}
      >
        {status}
      </span>
    );
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
          </div>
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="border-t border-gray-200 dark:border-gray-700 px-6 py-4"
            >
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden animate-scaleIn">
      <div className="overflow-x-auto lg:overflow-x-hidden sm:overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
                  onClick={() => onSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.collect_id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 transform hover:scale-[1.01] animate-slideIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                  {transaction.collect_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {transaction.school_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {transaction.gateway}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {formatAmount(transaction.order_amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {formatAmount(transaction.transaction_amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                  {transaction.custom_order_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(transaction.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;