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
    <div className={`border rounded-2xl p-4 bg-white flex items-center justify-between ${status === 'Active' ? 'ring-2 ring-green-100 shadow-md' : ''}`}>
      <div>
        <p className="text-sm text-gray-500">{currency}</p>
        <p className="text-2xl font-bold mt-1 text-gray-900">{balance}</p>
        <div className="mt-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="w-64 h-36 bg-gray-50 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-md bg-gray-200" />
          <div className="flex items-center">
            {logoSrc ? <img src={logoSrc} alt="brand" className="h-6" /> : <div className="text-xs text-gray-400">{brand}</div>}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">{type}</div>
          <div className="text-xs text-gray-400 tracking-widest mt-2">**** **** **** {last4 || brand?.slice(-4)}</div>
        </div>
      </div>
    </div>
  );
}
