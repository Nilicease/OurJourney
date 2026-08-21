export function Jeepney() {
   return (
      <svg
         className="jeepney-svg"
         viewBox="0 0 360 165"
         role="img"
         aria-label="A classic Filipino jeepney"
      >
         <defs>
            <linearGradient id="body" x1="0" x2="1">
               <stop stopColor="#126d77" />
               <stop offset=".5" stopColor="#0a3e50" />
               <stop offset="1" stopColor="#b98b41" />
            </linearGradient>
            <linearGradient id="chrome" x1="0" x2="1">
               <stop stopColor="#e5f7f5" />
               <stop offset=".45" stopColor="#529ba1" />
               <stop offset="1" stopColor="#f9d77e" />
            </linearGradient>
         </defs>
         <ellipse
            cx="181"
            cy="147"
            rx="145"
            ry="11"
            fill="#001e2c"
            opacity=".55" />
         <path
            d="M35 121V64q0-17 17-17h167l20-23h73q17 0 17 19v76H35Z"
            fill="url(#body)"
            stroke="url(#chrome)"
            strokeWidth="5" />
         <path
            d="M45 56h171l17-21h78M27 122h309"
            fill="none"
            stroke="#f5c668"
            strokeWidth="6" />
         <path
            d="M51 63h46v43H51zM105 63h56v43h-56zM170 63h50v43h-50zM230 57h46v49h-46z"
            fill="#062b39"
            stroke="#89ced0"
            strokeWidth="3" />
         <circle
            cx="87"
            cy="128"
            r="24"
            fill="#092c39"
            stroke="#e9c76e"
            strokeWidth="5" />
         <circle cx="87" cy="128" r="10" fill="#5db8bd" />
         <circle
            cx="270"
            cy="128"
            r="24"
            fill="#092c39"
            stroke="#e9c76e"
            strokeWidth="5" />
         <circle cx="270" cy="128" r="10" fill="#5db8bd" />
         <path d="M48 112h171M50 42h168" stroke="#e3be67" strokeWidth="2" />
         <path d="M300 100h28" stroke="#ffe19a" strokeWidth="9" />
         <circle cx="331" cy="101" r="5" fill="#fff0a9" />
      </svg>
   );
}
