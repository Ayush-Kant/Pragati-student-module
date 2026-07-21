import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Gift,
  Eye,
  Calendar,
  DollarSign,
  CheckCircle,
} from "lucide-react";

export default function Step3Pricing({ courseData, onUpdate, onNext, onBack }) {
  // Local state initialized with form fields or sensible defaults
  const [pricingModel, setPricingModel] = useState(
    courseData.pricingModel || "Paid",
  );
  const [currency, setCurrency] = useState(courseData.currency || "INR");
  const [basePrice, setBasePrice] = useState(courseData.basePrice || "1249");
  const [discountType, setDiscountType] = useState(
    courseData.discountType || "Percentage",
  );
  const [discountValue, setDiscountValue] = useState(
    courseData.discountValue || "20",
  );
  const [startDate, setStartDate] = useState(
    courseData.startDate || "2026-05-24",
  );
  const [endDate, setEndDate] = useState(courseData.endDate || "2026-06-24");
  const [applyCoupon, setApplyCoupon] = useState(
    courseData.applyCoupon !== false,
  );

  // Dynamic derivation metrics for the live preview summary card
  const [finalPrice, setFinalPrice] = useState(999);
  const [discountPillText, setDiscountPillText] = useState("20% OFF");

  useEffect(() => {
    const base = parseFloat(basePrice) || 0;
    const disc = parseFloat(discountValue) || 0;

    if (pricingModel === "Free") {
      setFinalPrice(0);
      setDiscountPillText("FREE");
      return;
    }

    if (discountType === "Percentage") {
      const calculated = base - base * (disc / 100);
      setFinalPrice(Math.max(0, Math.round(calculated)));
      setDiscountPillText(`${disc}% OFF`);
    } else {
      const calculated = base - disc;
      setFinalPrice(Math.max(0, Math.round(calculated)));
      setDiscountPillText(`Flat Discount`);
    }
  }, [pricingModel, basePrice, discountType, discountValue]);

  // Sync back state modifications to multi-step parent layer object wrapper
  const handleFormSync = (updatedFields) => {
    onUpdate({
      pricingModel,
      currency,
      basePrice,
      discountType,
      discountValue,
      startDate,
      endDate,
      applyCoupon,
      ...updatedFields,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column Input Parameter Forms Workspace */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 space-y-6 shadow-sm">
        {/* Pricing Model Card Selectors */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Pricing Model
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: "Paid",
                title: "Paid Course",
                icon: <CreditCard className="text-blue-500" size={18} />,
                desc: "Learners need to pay to access this course.",
              },
              {
                id: "Free",
                title: "Free Course",
                icon: <Gift className="text-purple-500" size={18} />,
                desc: "This course will be available for free to all learners.",
              },
              {
                id: "Preview",
                title: "Paid & Free (Preview)",
                icon: <Eye className="text-amber-500" size={18} />,
                desc: "Some content is free. Learners pay to access the full course.",
              },
            ].map((model) => (
              <label
                key={model.id}
                className={`p-4 border rounded-xl cursor-pointer flex flex-col justify-between transition-all select-none hover:bg-gray-50/50 ${
                  pricingModel === model.id
                    ? "border-blue-600 bg-blue-50/20 ring-1 ring-blue-600"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between w-full mb-2">
                  <span className="p-1.5 bg-gray-50 rounded-lg border">
                    {model.icon}
                  </span>
                  <input
                    type="radio"
                    name="pricingModel"
                    checked={pricingModel === model.id}
                    onChange={() => {
                      setPricingModel(model.id);
                      handleFormSync({ pricingModel: model.id });
                    }}
                    className="text-blue-600 focus:ring-blue-500 mt-1"
                  />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-800 mb-0.5">
                    {model.title}
                  </span>
                  <span className="block text-[11px] text-gray-400 leading-normal">
                    {model.desc}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {pricingModel !== "Free" && (
          <>
            {/* Course Base Pricing Form Section */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Course Price
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Set the price for your course content layer asset metrics.
              </p>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                <select
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    handleFormSync({ currency: e.target.value });
                  }}
                  className="bg-gray-50 border-r border-gray-300 px-3 text-xs font-bold text-gray-600 outline-none cursor-pointer"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => {
                    setBasePrice(e.target.value);
                    handleFormSync({ basePrice: e.target.value });
                  }}
                  className="flex-1 px-3 py-2 text-sm outline-none font-semibold text-gray-700"
                  placeholder="999"
                />
                <span className="bg-gray-50 border-l border-gray-300 px-3 flex items-center text-xs font-bold text-gray-400">
                  .00
                </span>
              </div>
            </div>

            {/* Discount Form Configuration Node Block Matrix */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Discount (Optional)
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Offer a promotional pricing mark down reduction metric variable
                asset value.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={discountType}
                  onChange={(e) => {
                    setDiscountType(e.target.value);
                    handleFormSync({ discountType: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed">Fixed Amount</option>
                </select>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => {
                      setDiscountValue(e.target.value);
                      handleFormSync({ discountValue: e.target.value });
                    }}
                    className="flex-1 px-3 py-2 text-sm outline-none font-semibold text-gray-700"
                    placeholder="20"
                  />
                  <span className="bg-gray-50 border-l border-gray-300 px-3 flex items-center text-xs font-bold text-gray-500">
                    {discountType === "Percentage"
                      ? "%"
                      : currency === "INR"
                        ? "₹"
                        : "$"}
                  </span>
                </div>
              </div>
            </div>

            {/* Duration Tracking Interface Blocks Ranges */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Discount Duration
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Set start and end validation timestamp tracking frameworks.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-[11px] font-bold text-gray-500 mb-1">
                    Start Date
                  </span>
                  <div className="relative flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        handleFormSync({ startDate: e.target.value });
                      }}
                      className="w-full text-xs font-semibold text-gray-700 outline-none bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-gray-500 mb-1">
                    End Date
                  </span>
                  <div className="relative flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        handleFormSync({ endDate: e.target.value });
                      }}
                      className="w-full text-xs font-semibold text-gray-700 outline-none bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Checkbox Interactive Boolean Flag Actions mapping */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={applyCoupon}
                  onChange={(e) => {
                    setApplyCoupon(e.target.checked);
                    handleFormSync({ applyCoupon: e.target.checked });
                  }}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-gray-300"
                />
                <div>
                  <span className="block text-xs font-bold text-gray-800">
                    Apply coupon code
                  </span>
                  <span className="block text-[11px] text-gray-400 leading-normal">
                    Allow learners to apply coupon codes at checkout checkouts
                    frameworks.
                  </span>
                </div>
              </label>
            </div>
          </>
        )}
      </div>

      {/* Right Column Layout Frame Live Summary Card Interface Preview */}
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Pricing Summary</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              See how your course price matrix node appears to targeted active
              consumers.
            </p>
          </div>

          {/* Interactive UI Mock Card Layer Wrapper asset */}
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white p-4 space-y-3">
            <div className="aspect-video w-full bg-slate-900 rounded-lg relative flex items-center justify-center overflow-hidden border">
              {/* Simple stylized code graphics framework decoration */}
              <div className="absolute text-slate-700 font-mono text-[10px] space-y-1 opacity-20 left-2 top-2 select-none pointer-events-none">
                <p>const course = "JS";</p>
                <p>function init() {"{"}</p>
                <p> return true;</p>
                <p>{"}"}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner z-10">
                <span className="text-lg font-mono font-bold">&lt;/&gt;</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-gray-800 truncate">
                {courseData.title || "JavaScript Fundamentals"}
              </h4>
              <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                {courseData.shortDescription ||
                  "Learn the basics of JavaScript programming language from scratch operations details."}
              </p>
            </div>

            {/* Dynamically derived Pricing display calculations */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-base font-black text-gray-900">
                {currency === "INR" ? "₹" : "$"}
                {pricingModel === "Free" ? "0" : finalPrice}
              </span>
              {pricingModel !== "Free" &&
                parseFloat(basePrice) > finalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {currency === "INR" ? "₹" : "$"}
                    {basePrice}
                  </span>
                )}
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded">
                {discountPillText}
              </span>
            </div>

            {pricingModel !== "Free" && (
              <div className="bg-emerald-50/50 border border-dashed border-emerald-200 rounded-lg p-2 flex items-center gap-2 text-[10px] font-semibold text-emerald-800">
                <Calendar size={12} className="shrink-0" />
                <span>
                  Promo window operational active tracking schema limits.
                </span>
              </div>
            )}

            {/* Standard deliverables bullet layout loops matrices */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                What learners will get:
              </span>
              {[
                "Full access to all course content structure",
                "Certificate of completion verification asset",
                "Access layout responsiveness on mobile and desktop platforms",
                "Lifetime access to resource updates",
              ].map((benefit, bIdx) => (
                <div
                  key={bIdx}
                  className="flex items-start gap-2 text-[10px] font-medium text-gray-600"
                >
                  <CheckCircle
                    size={12}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simple Information Banner context overlay notification box */}
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex gap-2.5 items-start">
            <InfoIcon className="text-blue-600 shrink-0 mt-0.5" size={14} />
            <div>
              <span className="block text-[10px] font-bold text-blue-900">
                Note
              </span>
              <span className="block text-[10px] text-blue-700/90 leading-normal mt-0.5">
                You can change the pricing or discount settings anytime before
                publishing your course.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Layout Footer control bar element component structure */}
      <div className="col-span-1 lg:col-span-3 bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition-colors"
        >
          ← Back: Curriculum
        </button>
        <button
          onClick={() => {
            handleFormSync();
            onNext();
          }}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
        >
          Next: Additional Settings →
        </button>
      </div>
    </div>
  );
}

// Inner support component to limit boilerplate lucide layouts mapping allocations
function InfoIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
