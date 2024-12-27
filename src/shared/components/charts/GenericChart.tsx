interface GenericChartProps {
  dateRange: string;
}

export default function GenericChart({ dateRange }: GenericChartProps) {
  return (
    <div className="glass rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-200">
          Revenue Over Time ({dateRange})
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <span className="text-sm text-gray-400">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-400/20"></div>
            <span className="text-sm text-gray-400">Previous Period</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] flex items-center justify-center text-gray-400">
        Chart visualization would go here
      </div>
    </div>
  );
}
