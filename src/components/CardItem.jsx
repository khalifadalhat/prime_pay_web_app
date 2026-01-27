import mastercard from "../assets/mastercard.svg";
import visa from "../assets/visa.svg";
import amazon from "../assets/amazon.svg";

export default function CardItem({
  currency,
  balance,
  status,
  type,
  brand,
  logo,
  last4,
}) {
  const logoSrc =
    (logo && logo.includes("master") && mastercard) ||
    (logo && logo.includes("visa") && visa) ||
    (logo && logo.includes("amazon") && amazon) ||
    null;

  return (
    <div className={`rounded-2xl p-4 bg-white relative overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-150 ${status === 'Active' ? 'ring-2 ring-green-100' : ''}`}>
      <div className="flex flex-col">
        <div className="whitespace-nowrap">
          <p className="text-2xl font-bold text-gray-900">{balance}</p>
          <p className="text-sm text-gray-500 mt-1">{currency}</p>
        </div>

        <div className="mt-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-40 h-24 bg-gray-50 rounded-tl-xl p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-6 h-6 rounded-md bg-gray-200" />
          <div className="flex items-center">
            {logoSrc ? <img src={logoSrc} alt="brand" className="h-4" /> : <div className="text-xs text-gray-400">{brand}</div>}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">{type}</div>
          <div className="text-[10px] text-gray-400 tracking-widest mt-1">**** **** **** {last4 || brand?.slice(-4)}</div>
        </div>
      </div>
    </div>
  );
}
