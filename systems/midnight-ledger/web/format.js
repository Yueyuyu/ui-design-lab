export function ledgerFormat(value,{kind="number",currency="CNY",digits=2,sign=false,locale="zh-CN"}={}) {
 if(typeof value!=="number"||!Number.isFinite(value))return "—";
 return new Intl.NumberFormat(locale,{style:kind==="money"?"currency":kind==="percent"?"percent":"decimal",...(kind==="money"?{currency}:{}),minimumFractionDigits:digits,maximumFractionDigits:digits,signDisplay:sign?"exceptZero":"auto"}).format(value);
}
