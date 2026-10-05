import React from 'react';
import { Link } from 'react-router-dom';

const RecentShipmentsTable = () => {
  const shipments = [
    {
      trackingNo: 'TRK1234567890',
      sender: 'John Doe',
      receiver: 'Sarah Wilson',
      status: 'In Transit',
      date: 'Sep 23, 2026'
    },
    {
      trackingNo: 'TRK0987654321',
      sender: 'Mike Johnson',
      receiver: 'Emily Davis',
      status: 'Delivered',
      date: 'Sep 22, 2026'
    },
    {
      trackingNo: 'TRK5678901234',
      sender: 'Acme Corp',
      receiver: 'Robert Smith',
      status: 'Pending',
      date: 'Sep 22, 2026'
    },
    {
      trackingNo: 'TRK1122334455',
      sender: 'David Brown',
      receiver: 'Lisa Anderson',
      status: 'Cancelled',
      date: 'Sep 21, 2026'
    },
    {
      trackingNo: 'TRK9988776655',
      sender: 'Tech Solutions',
      receiver: 'James Miller',
      status: 'In Transit',
      date: 'Sep 20, 2026'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Transit':
        return 'bg-[#E3F2FD] text-[#0066CC] border border-[#B3E5FC]';
      case 'Delivered':
        return 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]';
      case 'Pending':
        return 'bg-[#FFF8E1] text-[#F57F17] border border-[#FFE082]';
      case 'Cancelled':
        return 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] font-['Inter']">
      
      {/* Header Row */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#233D19]">
          Recent Shipments
        </h3>

        <Link
          to="/shipments"
          className="text-xs font-semibold text-[#587640] hover:text-[#233D19] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[#EEF4E8] text-[11px] font-bold text-[#7E996C] uppercase tracking-wider">
              <th className="pb-3 pr-4">Tracking No.</th>
              <th className="pb-3 px-4">Sender</th>
              <th className="pb-3 px-4">Receiver</th>
              <th className="pb-3 px-4">Status</th>
              <th className="pb-3 pl-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F7EC]">
            {shipments.map((shipment) => (
              <tr
                key={shipment.trackingNo}
                className="hover:bg-[#F9FCF7] transition-colors text-xs text-[#233D19] group"
              >
                <td className="py-3.5 pr-4 font-bold font-mono text-[#233D19] group-hover:text-[#587640] transition-colors">
                  {shipment.trackingNo}
                </td>
                <td className="py-3.5 px-4 font-medium text-[#465E37]">
                  {shipment.sender}
                </td>
                <td className="py-3.5 px-4 font-medium text-[#465E37]">
                  {shipment.receiver}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-3 py-1 text-[11px] font-bold rounded-full text-center ${getStatusBadge(
                      shipment.status
                    )}`}
                  >
                    {shipment.status}
                  </span>
                </td>
                <td className="py-3.5 pl-4 text-right text-[#7A9567] font-medium text-[11px]">
                  {shipment.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default RecentShipmentsTable;
