import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCreditCard, FiTrendingUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import TransactionTable from '../components/TransactionTable';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import { transactionAPI } from '../services/api';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [stats, setStats] = useState({ successful: 0, pending: 0, failed: 0, totalAmount: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState(null);
  const [filters, setFilters] = useState({
    status: [],
    school_ids: [],
    date_from: '',
    date_to: '',
    search: '',
  });

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    
    const urlFilters = {
      status: urlParams.get('status') ? urlParams.get('status').split(',') : [],
      school_ids: urlParams.get('school_ids') ? urlParams.get('school_ids').split(',') : [],
      date_from: urlParams.get('date_from') || '',
      date_to: urlParams.get('date_to') || '',
      search: urlParams.get('search') || '',
    };

    setFilters(urlFilters);
    setCurrentPage(Number(urlParams.get('page')) || 1);
    setItemsPerPage(Number(urlParams.get('limit')) || 10);
    
    if (urlParams.get('sort_by') && urlParams.get('sort_order')) {
      setSortConfig({
        key: urlParams.get('sort_by'),
        direction: urlParams.get('sort_order'),
      });
    }
  }, [location.search]);

  // Update URL when filters change
  const updateURL = useCallback((newFilters, page, limit, sort) => {
    const params = new URLSearchParams();
    
    if (newFilters.status.length) params.set('status', newFilters.status.join(','));
    if (newFilters.school_ids.length) params.set('school_ids', newFilters.school_ids.join(','));
    if (newFilters.date_from) params.set('date_from', newFilters.date_from);
    if (newFilters.date_to) params.set('date_to', newFilters.date_to);
    if (newFilters.search) params.set('search', newFilters.search);
    if (page > 1) params.set('page', page.toString());
    if (limit !== 10) params.set('limit', limit.toString());
    if (sort) {
      params.set('sort_by', sort.key);
      params.set('sort_order', sort.direction);
    }

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    navigate(newUrl, { replace: true });
  }, [navigate]);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        page: currentPage,
        limit: itemsPerPage,
        sort_by: sortConfig?.key,
        sort_order: sortConfig?.direction,
      };

      const response = await transactionAPI.getTransactions(params);
      setTransactions(response.data);
      setTotalTransactions(response.total);
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Error loading transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, itemsPerPage, sortConfig]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters, 1, itemsPerPage, sortConfig);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: [],
      school_ids: [],
      date_from: '',
      date_to: '',
      search: '',
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    setSortConfig(null);
    updateURL(clearedFilters, 1, itemsPerPage, null);
  };

  const handleSort = (key) => {
    const newSortConfig = {
      key,
      direction: sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    };
    setSortConfig(newSortConfig);
    updateURL(filters, currentPage, itemsPerPage, newSortConfig);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL(filters, page, itemsPerPage, sortConfig);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
    updateURL(filters, 1, limit, sortConfig);
  };

  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="animate-slideIn">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction Dashboard</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 p-4 rounded-lg animate-slideIn">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg animate-scaleIn hover:shadow-lg transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.1s' }}>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCreditCard className="h-8 w-8 text-blue-500 animate-pulse-slow" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Transactions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalTransactions.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg animate-scaleIn hover:shadow-lg transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-8 w-8 text-emerald-500 animate-pulse-slow" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Successful
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.successful.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg animate-scaleIn hover:shadow-lg transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.3s' }}>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiTrendingUp className="h-8 w-8 text-amber-500 animate-pulse-slow" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.pending.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg animate-scaleIn hover:shadow-lg transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.4s' }}>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-8 w-8 text-red-500 animate-pulse-slow" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Failed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.failed.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg animate-scaleIn hover:shadow-lg transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.5s' }}>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse-slow">
                  <span className="text-white font-bold text-sm">₹</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Amount
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    ₹{stats.totalAmount.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="animate-slideIn" style={{ animationDelay: '0.5s' }}>
        <Filters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClear={handleClearFilters}
        />
      </div>

      {/* Transaction Table */}
      <div className="animate-slideIn" style={{ animationDelay: '0.6s' }}>
        <TransactionTable
          transactions={transactions}
          sortConfig={sortConfig}
          onSort={handleSort}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      <div className="animate-slideIn" style={{ animationDelay: '0.7s' }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalTransactions}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default Dashboard;