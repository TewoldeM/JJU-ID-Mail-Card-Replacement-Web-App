// // components/collection/ReusableComponets/DatePicker.tsx
// "use client";
// import { MAX_DATE_RANGE_DAYS } from "@/app/lib/contants/MAX_DATE_RANGE_DAYS";
// import { DateRangePicker } from "@/components/ui/DateRangerPicker";
// import { toast } from "@/hooks/use-toast";
// import { differenceInDays, startOfMonth } from "date-fns";
// import React, { useState } from "react";


// const DatePicker = () => {
//   const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
//     from: startOfMonth(new Date()),
//     to: new Date(),
//   });

//   return (
//     <div className="border-b bg-card">
//       <DateRangePicker
//         initialDateFrom={dateRange.from}
//         initialDateTo={dateRange.to}
//         onUpdate={(value) => {
//           const { from, to } = value.range;
//           if (!from || !to) return;
//           if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
//             toast({
//               title: "Error",
//               description: `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days.`,
//               variant: "destructive",
//             });
//             return;
//           }
//           setDateRange({ from, to });
//         }}
//       />
//     </div>
//   );
// };

// export default DatePicker;
