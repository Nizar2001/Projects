import { useState } from "react";

export default function ProcessTest() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
        <svg width="100%" height="100%" viewBox="0 0 884 623" fill="transparent" preserveAspectRatio="xMidYMid meet">
        
        {/* INSTRUCTION MEMORY BOX */}
        <g 
            onMouseEnter={() => setHovered("Instruction Memory:")}
            onMouseLeave={() => setHovered(null)}
        >
            <rect x="158.501" y="272.735" width="86" height="154.75" stroke="black"/>
            <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="162.001" y="293.651">Address</tspan></text>
            <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="190.001" y="348.621">Instruction</tspan></text>
            <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="184.001" y="393.121">Instruction</tspan><tspan x="184.001" y="405.121">   memory</tspan></text>
            {/* instruction memory paths */}
            <path d="M303.001 272.89L297.972 270.091L298.032 275.865L303.001 272.89ZM266.001 273.544L266.006 274.044L298.507 273.469L298.502 272.969L298.497 272.469L265.996 273.044L266.001 273.544Z" fill="black"/>
            <path d="M263.335 318.044C263.335 319.517 264.528 320.711 266.001 320.711C267.474 320.711 268.668 319.517 268.668 318.044C268.668 316.571 267.474 315.377 266.001 315.377C264.528 315.377 263.335 316.571 263.335 318.044ZM303.001 318.044L298.001 315.157V320.931L303.001 318.044ZM266.001 318.044V318.544H298.501V318.044V317.544H266.001V318.044Z" fill="black"/>
            <path d="M263.335 383.485C263.335 384.958 264.528 386.152 266.001 386.152C267.474 386.152 268.668 384.958 268.668 383.485C268.668 382.012 267.474 380.818 266.001 380.818C264.528 380.818 263.335 382.012 263.335 383.485ZM303.001 383.485L298.001 380.598V386.372L303.001 383.485ZM266.001 383.485V383.985H298.501V383.485V382.985H266.001V383.485Z" fill="black"/>
            <path d="M263.335 347.492C263.335 348.965 264.528 350.159 266.001 350.159C267.474 350.159 268.668 348.965 268.668 347.492C268.668 346.02 267.474 344.826 266.001 344.826C264.528 344.826 263.335 346.02 263.335 347.492ZM245.001 347.492V347.992H266.001V347.492V346.992H245.001V347.492Z" fill="black"/>
            <path d="M266.501 273.544V542.507" stroke="black"/>
            <path d="M354.002 542.172L349.002 539.285V545.059L354.002 542.172ZM266.001 542.172V542.672H349.502V542.172V541.672H266.001V542.172Z" fill="black"/>
            <line y1="-0.5" x2="21.1997" y2="-0.5" transform="matrix(0.377363 0.926065 -0.819987 0.572383 330.001 532.691)" stroke="black"/>
        </g>

        {/* PC BOX */}
        <rect x="104.501" y="249.176" width="25" height="89.3088" stroke="black"/>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="110.001" y="296.268">PC</tspan></text>
        {/* PC paths */}
        <path d="M154.004 292.849L149.004 289.962V295.736L154.004 292.849ZM129.999 292.849V293.349H149.504V292.849V292.349H129.999V292.849Z" fill="black"/>
        <path d="M138.501 214.598C137.028 214.598 135.835 215.792 135.835 217.265C135.835 218.737 137.028 219.931 138.501 219.931C139.974 219.931 141.168 218.737 141.168 217.265C141.168 215.792 139.974 214.598 138.501 214.598ZM138.501 290.51C137.028 290.51 135.835 291.703 135.835 293.176C135.835 294.649 137.028 295.843 138.501 295.843C139.974 295.843 141.168 294.649 141.168 293.176C141.168 291.703 139.974 290.51 138.501 290.51ZM138.501 217.265H138.001V293.176H138.501H139.001V217.265H138.501Z" fill="black"/>
        <line x1="92.0012" y1="216.765" x2="234.001" y2="216.765" stroke="black"/>
        <line x1="92.5012" y1="150.515" x2="92.5012" y2="217.264" stroke="black"/>
        <path d="M115.004 150.187L110.004 147.301V153.074L115.004 150.187ZM91.9985 150.187V150.687H110.504V150.187V149.687H91.9985V150.187Z" fill="black"/>
        <path d="M234.001 105.03V217.264" stroke="black"/>
        <path d="M501.001 105.852L496.001 102.966V108.739L501.001 105.852ZM234.001 105.852V106.352H496.501V105.852V105.352H234.001V105.852Z" fill="black"/>
        
        {/* DATA MEMORY BOX */}
        <rect x="672.501" y="271.426" width="99" height="200.559" stroke="black"/>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="679.001" y="332.916">Address</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="710.339" y="378.724">Data</tspan><tspan x="701.882" y="390.724">memory</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="743.802" y="346.004">Read</tspan><tspan x="746.634" y="358.004">data</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="679.001" y="445.474">Write</tspan><tspan x="679.001" y="457.474">data</tspan></text>
        {/* data memory path */}
        <path d="M825.002 353.049L820.002 350.162V355.936L825.002 353.049ZM771 353.049V353.549H820.502V353.049V352.549H771V353.049Z" fill="black"/>
        
        {/* REGISTER FILE BOX */}
        <rect x="306.501" y="254.412" width="115" height="200.559" stroke="black"/>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="312.001" y="270.092">Read</tspan><tspan x="312.001" y="282.092">register 1</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="312.001" y="314.592">Read</tspan><tspan x="312.001" y="326.592">register 2</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="312.001" y="374.798">Write</tspan><tspan x="312.001" y="386.798">register</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="312.001" y="424.533">Write</tspan><tspan x="312.001" y="436.533">data</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="389.802" y="271.401">Read</tspan><tspan x="385.261" y="283.401">data 1</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="389.802" y="380.033">Read</tspan><tspan x="383.855" y="392.033">data 2</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="342.001" y="355.166">Registers</tspan></text>
        {/* register file paths */}
        <path d="M529.001 274.853L524.001 271.966V277.74L529.001 274.853ZM421.001 274.853V275.353H524.501V274.853V274.353H421.001V274.853Z" fill="black"/>
        <path d="M479.001 349.456L474.001 346.569V352.342L479.001 349.456ZM421.001 349.456V349.956H474.501V349.456V348.956H421.001V349.456Z" fill="black"/>
        <path d="M668.001 455.47L663.001 452.584V458.357L668.001 455.47ZM454.001 455.47V455.97L663.501 455.97V455.47V454.97L454.001 454.97V455.47Z" fill="black"/>
        <path d="M454.501 346.789C453.028 346.789 451.835 347.983 451.835 349.456C451.835 350.928 453.028 352.122 454.501 352.122C455.974 352.122 457.168 350.928 457.168 349.456C457.168 347.983 455.974 346.789 454.501 346.789ZM454.501 349.456H454.001V455.47H454.501H455.001V349.456H454.501Z" fill="black"/>
        
        {/* SHIFT LEFT 1 BOX */}
        <rect x="446.501" y="148.397" width="36" height="78" rx="50" stroke="black"/>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="452.824" y="177.166">Shift</tspan><tspan x="452.429" y="189.166">left 1</tspan></text>
        {/* shift left 1 path */}
        <path d="M501.006 184.38L496.006 181.494V187.267L501.006 184.38ZM482 184.38V184.88H496.506V184.38V183.88H482V184.38Z" fill="black"/>
        
        {/* IMM GEN BOX */}
        <rect x="357.501" y="479.529" width="48" height="118" rx="70" stroke="black"/>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="371.816" y="531.857">Imm</tspan><tspan x="372.333" y="543.857">Gen</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="321.712" y="518.768">32</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="409.551" y="518.768">64</tspan></text>
        {/* imm gen paths */}
        <line x1="405.001" y1="541.353" x2="465.001" y2="541.353" stroke="black"/>
        <line x1="464.501" y1="226.426" x2="464.501" y2="541.853" stroke="black"/>
        <line y1="-0.5" x2="21.1997" y2="-0.5" transform="matrix(0.377363 0.926065 -0.819987 0.572383 414.001 531.382)" stroke="black"/>
        <path d="M461.335 418.823C461.335 420.296 462.528 421.49 464.001 421.49C465.474 421.49 466.668 420.296 466.668 418.823C466.668 417.35 465.474 416.156 464.001 416.156C462.528 416.156 461.335 417.35 461.335 418.823ZM479.001 418.823L474.001 415.936L474.001 421.71L479.001 418.823ZM464.001 418.823L464.001 419.323L474.501 419.323L474.501 418.823L474.501 418.323L464.001 418.323L464.001 418.823Z" fill="black"/>
        
        {/* MUX 3 BOX */}
        <rect x="827.501" y="334.25" width="34" height="112.868" rx="17" stroke="black"/>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="844.514" y="380.033">M</tspan><tspan x="846.028" y="392.033">u</tspan><tspan x="846.247" y="404.033">x</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="835.774" y="431.077">0</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="836.638" y="353.857">1</tspan></text>
        {/* mux 3 paths */}
        <line x1="861.001" y1="388.22" x2="883.001" y2="388.22" stroke="black"/>
        <line x1="276.001" y1="622.5" x2="883.001" y2="622.5" stroke="black"/>
        <line x1="882.753" y1="387.409" x2="882.753" y2="623" stroke="black"/>
        <line y1="-0.5" x2="193.706" y2="-0.5" transform="matrix(3.46462e-05 1 -1 5.93495e-05 276.001 427.985)" stroke="black"/>
        <path d="M303.001 427.985L298.001 425.098L298.001 430.872L303.001 427.985ZM276.001 427.985L276.001 428.485L298.501 428.485L298.501 427.985L298.501 427.485L276.001 427.485L276.001 427.985Z" fill="black"/>
        
        {/* MUX 2 BOX */}
        <rect x="483.501" y="334.25" width="34" height="112.868" rx="17" stroke="black"/>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="500.514" y="373.489">M</tspan><tspan x="502.028" y="385.489">u</tspan><tspan x="502.247" y="397.489">x</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="492.638" y="420.607">1</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="491.774" y="352.548">0</tspan></text>
        {/* mux 2 path */}
        <path d="M529.001 383.485L524.001 380.598V386.372L529.001 383.485ZM517.001 383.485V383.985H524.501V383.485V382.985H517.001V383.485Z" fill="black"/>
        
        {/* MUX 1 BOX */}
        <rect x="55.5012" y="242.632" width="30" height="106.323" rx="15" stroke="black"/>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="71.5139" y="280.563">M</tspan><tspan x="73.0276" y="292.563">u</tspan><tspan x="73.2473" y="304.563">x</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="63.6379" y="327.68">1</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="62.7737" y="259.621">0</tspan></text>
        {/* mux 1 path */}
        <path d="M101.005 293.503L96.0054 290.617V296.39L101.005 293.503ZM85.9971 293.503V294.003H96.5054V293.503V293.003H85.9971V293.503Z" fill="black"/>
        
        {/* ALU BOX */}
        <path d="M533.501 238.206V307.573M533.501 336.367V405.735M533.388 307.159L542.388 321.556M542.401 321.054L533.401 336.76M533.737 405.179L599.737 351.517M533.737 238.762L599.737 292.423M599.501 291.867V352.073" stroke="black"/>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="544.491" y="321.136">ALU</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="571.539" y="296.269">Zero</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="575.982" y="326.371">ALU </tspan><tspan x="566.236" y="338.371">Result</tspan></text>
        {/* alu paths */}
        <path d="M668.002 332.114L663.002 329.227V335.001L668.002 332.114ZM599 332.114V332.614H663.502V332.114V331.614H599V332.114Z" fill="black"/>
        <path d="M657.001 297.103L652.001 294.216V299.99L657.001 297.103ZM599.001 297.103V297.603H652.501V297.103V296.603H599.001V297.103Z" fill="black"/>
        <path d="M825.001 430.603L820.001 427.716V433.489L825.001 430.603ZM808.001 430.603V431.103H820.501V430.603V430.103H808.001V430.603Z" fill="black"/>
        <path d="M622.501 329.774C621.028 329.774 619.835 330.968 619.835 332.441C619.835 333.914 621.028 335.108 622.501 335.108C623.974 335.108 625.168 333.914 625.168 332.441C625.168 330.968 623.974 329.774 622.501 329.774ZM622.501 332.441H622.001V509.132H622.501H623.001V332.441H622.501Z" fill="black"/>
        <line x1="622.001" y1="508.632" x2="809.001" y2="508.632" stroke="black"/>
        <line x1="808.501" y1="430.603" x2="808.501" y2="509.132" stroke="black"/>
        
        {/* ADD SUM BOX */}
        <path d="M505.114 65.4412V134.809M505.114 163.603V232.97M505.001 134.394L514.001 148.791M514.014 148.29L505.014 163.996M505.35 232.415L571.35 178.753M505.35 65.997L571.35 119.659M571.114 119.103V179.309" stroke="black"/>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="515.783" y="152.298">ADD</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="546.891" y="145.754">Sum</tspan></text>
        {/* add sum paths */}
        <path d="M0.501221 0L0.501221 305.877" stroke="black"/>
        <path d="M51.0025 305.276L46.0025 302.39V308.163L51.0025 305.276ZM0 305.276V305.776H46.5025V305.276V304.776H0V305.276Z" fill="black"/>
        <line x1="0.0012207" y1="0.808838" x2="713.001" y2="0.808838" stroke="black"/>
        <line x1="712.501" x2="712.501" y2="146.588" stroke="black"/>
        <line x1="571.001" y1="146.088" x2="713.001" y2="146.088" stroke="black"/>
        
        {/* ADD 4 BOX */}
        <path d="M119.114 23.5588V92.9264M119.114 121.721V191.088M119.001 92.512L128.001 106.909M128.014 106.407L119.014 122.113M119.351 190.532L185.351 136.871M119.351 24.1147L185.351 77.7764M185.114 77.2206V137.426" stroke="black"/>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="154.785" y="107.798">Add</tspan></text>
        <text fill="black" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} fontSize="10" fontWeight="500" letterSpacing="0em"><tspan x="93.2299" y="63.2981">4</tspan></text>
        {/* add 4 paths */}
        <line x1="206.501" y1="9.16174" x2="206.501" y2="106.015" stroke="black"/>
        <line x1="185.001" y1="105.515" x2="206.001" y2="105.515" stroke="black"/>
        <line x1="36.0013" y1="9.97058" x2="206.001" y2="9.97058" stroke="black"/>
        <line x1="36.5013" y1="10.4706" x2="36.5013" y2="255.22" stroke="black"/>
        <path d="M51.0023 255.057L46.0023 252.17V257.944L51.0023 255.057ZM35.9961 255.057V255.557H46.5023V255.057V254.557H35.9961V255.057Z" fill="black"/>
        <path d="M115.001 62.8235L110.001 59.9367V65.7102L115.001 62.8235ZM101.001 62.8235V63.3235H110.501V62.8235V62.3235H101.001V62.8235Z" fill="black"/>
        
        {/* HOVERING DISPLAY */}
        {hovered && (
            <>
                <rect x="1" y="460" width="240" height="145" stroke="black"/>
                <text fontSize="15" fill="black"><tspan x="10" y="480">
                    {hovered}
                </tspan></text>
            </>
        )}

        </svg>
    </>
  );
}