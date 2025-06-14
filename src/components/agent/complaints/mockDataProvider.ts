
import { CustomerComplaint } from './types';

export const getMockComplaints = (chatId: number): CustomerComplaint[] => {
  const mockComplaints: { [key: number]: CustomerComplaint[] } = {
    1: [
      {
        id: "C001",
        date: "2024-01-08",
        subject: "Delayed shipment notification",
        category: "Shipping",
        status: "resolved",
        priority: "medium",
        lastUpdate: "2024-01-09"
      },
      {
        id: "C002",
        date: "2024-01-05",
        subject: "Product quality issue",
        category: "Product",
        status: "resolved",
        priority: "high",
        lastUpdate: "2024-01-06"
      },
      {
        id: "C003",
        date: "2023-12-28",
        subject: "Billing discrepancy",
        category: "Billing",
        status: "resolved",
        priority: "low",
        lastUpdate: "2023-12-30"
      }
    ],
    2: [
      {
        id: "C004",
        date: "2024-01-06",
        subject: "Account access issue",
        category: "Account",
        status: "resolved",
        priority: "medium",
        lastUpdate: "2024-01-07"
      }
    ],
    3: [
      {
        id: "C005",
        date: "2024-01-10",
        subject: "Subscription cancellation",
        category: "Billing",
        status: "pending",
        priority: "medium",
        lastUpdate: "2024-01-11"
      },
      {
        id: "C006",
        date: "2024-01-07",
        subject: "Feature request",
        category: "Product",
        status: "open",
        priority: "low",
        lastUpdate: "2024-01-08"
      }
    ],
    4: [
      {
        id: "C007",
        date: "2024-01-09",
        subject: "Technical support needed",
        category: "Technical",
        status: "open",
        priority: "high",
        lastUpdate: "2024-01-10"
      }
    ]
  };

  return mockComplaints[chatId] || [];
};
