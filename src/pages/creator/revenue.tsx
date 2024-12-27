import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Download,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import GenericChart from '@/shared/components/charts/GenericChart';
import DateRangeMenu from '@/shared/components/DateRangeMenu';
import { formatCurrency } from '@/shared/utils/formatUtils';

interface Transaction {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
  app: string;
}

const transactions: Transaction[] = [
  {
    id: '1',
    date: '2024-03-10',
    customer: 'John Doe',
    amount: 9.99,
    status: 'completed',
    app: 'Stream Overlay Pro',
  },
  {
    id: '2',
    date: '2024-03-09',
    customer: 'Jane Smith',
    amount: 4.99,
    status: 'completed',
    app: 'Chat Analytics',
  },
  {
    id: '3',
    date: '2024-03-08',
    customer: 'Mike Johnson',
    amount: 9.99,
    status: 'refunded',
    app: 'Stream Overlay Pro',
  },
];

const stats = [
  {
    label: 'Total Revenue',
    value: 12849.99,
    change: 23.4,
    icon: DollarSign,
    positive: true,
  },
  {
    label: 'Average Price',
    value: 8.99,
    change: 12.1,
    icon: TrendingUp,
    positive: true,
  },
  {
    label: 'Active Customers',
    value: 1432,
    change: -5.2,
    icon: Users,
    positive: false,
  },
];

export default function RevenuePage() {
  const [dateRange, setDateRange] = useState('30d');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Revenue
            </h1>
            <p className="text-gray-400 mt-1">
              Track your earnings and financial performance
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <DateRangeMenu value={dateRange} onChange={setDateRange} />
            <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg px-4 py-2 font-medium transition-colors">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <stat.icon className="h-6 w-6 text-purple-400" />
                </div>
                <div
                  className={`flex items-center ${
                    stat.positive ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-200">
                {typeof stat.value === 'number' &&
                stat.label.includes('Revenue')
                  ? formatCurrency(stat.value)
                  : typeof stat.value === 'number' &&
                    stat.label.includes('Price')
                  ? formatCurrency(stat.value)
                  : stat.value.toLocaleString()}
              </h3>
              <p className="text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <GenericChart dateRange={dateRange} />

        {/* Recent Transactions */}
        <div className="glass rounded-xl">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-semibold text-gray-200">
              Recent Transactions
            </h2>
          </div>
          <div className="divide-y divide-white/5">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-6 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-200">
                      {transaction.app}
                    </h3>
                    <span
                      className={`
                  px-2 py-1 rounded-full text-xs
                  ${
                    transaction.status === 'completed'
                      ? 'bg-green-500/10 text-green-400'
                      : transaction.status === 'refunded'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }
                `}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      {transaction.customer} •{' '}
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                    <span
                      className={`font-medium ${
                        transaction.status === 'refunded'
                          ? 'text-red-400'
                          : 'text-gray-200'
                      }`}
                    >
                      {transaction.status === 'refunded' ? '-' : ''}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
