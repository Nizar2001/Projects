import LayoutWrapper from "../../arithmetic-contents/layout/ArithmeticLayout";

export default function NumberSystemsPage() {
  

  return (

      <LayoutWrapper>
        <div className="flex-1 overflow-auto p-10 text-gray-800 w-full max-w-none">
          <h1 className="text-3xl font-bold mb-4 text-[#253657]">Number Systems</h1>
          <p className="max-w-[125ch] leading-relaxed">
            Computers represent and process all forms of data using numbers.
            Every type of data — whether it’s text, images, or the code you have 
            written in Python or any other programming languages — is eventually
             converted into a numeric form so that the computer’s hardware can 
             understand and process it.
          </p>



          <p className="max-w-[125ch] leading-relaxed mt-4">
            However, numbers come in different forms and can be represented in various ways.
            For example, the number "ten" can be written as 10 in the decimal system,
            1010 in binary, or A in hexadecimal — all representing the same value but in
            different forms. These variations exist because different 
            <span className="font-semibold text-[#2B5DBF]"> number systems</span> use different
            sets of symbols and bases to express numbers.
          </p>
          
          <hr className="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />
 
        <h1 className="text-2xl font-bold mt-12 mb-4 text-[#253657]">What is a Number System?</h1>

          <p className="max-w-[125ch] leading-relaxed mt-4">
              A <span className="font-semibold text-[#2B5DBF]"> number system</span>, as its name suggets, 
              is a system used to represent numbers using a set of symbols. It defines the rules
              for how these symbols can be arranged to represent any numerical value. Every number system
              has two key components: the <span className="font-semibold text-[#2B5DBF]"> base </span> and
               the <span className="font-semibold text-[#2B5DBF]"> symbols </span>.
          </p>

          <p className="max-w-[125ch] leading-relaxed mt-4">
              The <span className="font-semibold text-[#2B5DBF]">base</span> of a number system defines 
              how many unique <span className="font-semibold text-[#2B5DBF]">symbols</span> the system uses 
              and determines the value of each symbol (digit) based on its position in the number. 
              In a base-10 (decimal) system, for example, a digit <em>x</em> in position <em> y </em> 
              represents the value <em>x</em> × 10<sup>y</sup>. 
              In a base-16 (hexadecimal) system, the same digit <em>x</em> in position <em> y </em> 
              represents <em> x </em> × 16<sup>y</sup>. 
              In general, the <span className="font-semibold text-[#2B5DBF]">base</span> of a number system 
              determines the weight of each position. Therefore, the overall value of a number depends 
              both on the symbols used and the base itself.
          </p>

          <p className="max-w-[125ch] leading-relaxed mt-4">
            <span className="font-semibold text-[#2B5DBF]">Symbols</span> of a number system, on the other hand,
             refers to the digits or characters
            that a system uses to represent values. The number of symbols available in a system depends
            on its <span className="font-semibold text-[#2B5DBF]">base</span>. For example, a base-2 system like
            <span className="font-semibold text-[#2B5DBF]"> binary</span> uses two symbols, while a
            base-16 system like <span className="font-semibold text-[#2B5DBF]"> hexadecimal</span> uses sixteen
            symbols.
          </p>

          <p className="max-w-[125ch] leading-relaxed mt-4">
            To make this clearer, consider the decimal number <b>425</b>. 
            It can be expanded based on its base (10) as:
          </p>

          <div className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>425₁₀ = (4 × 10²) + (2 × 10¹) + (5 × 10⁰) </pre>
            <pre>       =    400   +     20    +     5     </pre>
          </div>

          <p className="max-w-[125ch] leading-relaxed mt-4">
            This shows how the base and position of each symbol determine the overall value of the number. 
            The same idea applies to all number systems, whether binary, octal, or hexadecimal.
          </p>


          <hr className="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />          

          <h1 className="text-2xl font-bold mt-12 mb-4 text-[#253657]">Common Number Systems</h1>
          <p className="max-w-[125ch] leading-relaxed mt-4">
            Some of the most common examples of these systems are 
            <span className="font-semibold text-[#2B5DBF]"> decimal </span> (base-10), 
            <span className="font-semibold text-[#2B5DBF]"> binary </span> (base-2), 
            <span className="font-semibold text-[#2B5DBF]"> hexadecimal </span> (base-16), 
            and <span className="font-semibold text-[#2B5DBF]"> octal </span> (base-8), which we will discuss in detail.
          </p>

          <h1 className="text-2xl font-bold mt-12 mb-4 text-[#253657]">Decimal System</h1>
                      
            <p className="max-w-[125ch] leading-relaxed mt-4">
              The <span className="font-semibold text-[#2B5DBF]">decimal system</span> is the most widely used number system in everyday life. 
              It is a <span className="font-semibold text-[#2B5DBF]">base-10</span> system, meaning it consists of ten unique symbols: 
              0, 1, 2, 3, 4, 5, 6, 7, 8, and 9. Every numeric value in this system is expressed as a combination of these ten symbols, 
              arranged according to their positional values.
            </p>

            <p className="max-w-[125ch] leading-relaxed mt-4">
              In the decimal system, each digit’s value depends on both the digit itself and its position within the number. 
              The rightmost position represents units (<em>10⁰</em>), the next position represents tens (<em>10¹</em>), 
              followed by hundreds (<em>10²</em>), thousands (<em>10³</em>), and so on.
            </p>

            <p className="max-w-[125ch] leading-relaxed mt-4">
              For example, consider the decimal number <em>5702</em>.  
              Its total value can be determined by multiplying each digit by its corresponding power of ten:
              <br />
              (5 × 10³) + (7 × 10²) + (0 × 10¹) + (2 × 10⁰) = 5000 + 700 + 0 + 2 = <b>5702</b>.
            </p>

            <p className="max-w-[125ch] leading-relaxed mt-4">
              Because the decimal system is simple and widely understood, we will use it as a
               reference point to explain and understand the 
                <span className="font-semibold text-[#2B5DBF]"> binary</span>, 
                <span className="font-semibold text-[#2B5DBF]"> octal</span>, 
                  and <span className="font-semibold text-[#2B5DBF]"> hexadecimal </span> number systems discussed in the
                   following sections.
            </p>

            <hr className="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" /> 

            <h1 className="text-2xl font-bold mt-12 mb-4 text-[#253657]">Binary System</h1>
              <p className="max-w-[125ch] leading-relaxed mt-4">
                The <span className="font-semibold text-[#2B5DBF]">binary system</span> is the fundamental language of computers. 
                Everything that a computer processes — from images, videos, and sounds to text and even program instructions — 
                is ultimately converted into binary form so that the hardware can interpret and manipulate it. 
                Understanding binary numbers is therefore essential to understanding how computers represent and process data.
              </p>

              <p className="max-w-[125ch] leading-relaxed mt-4">
                Binary is a <span className="font-semibold text-[#2B5DBF]">base-2</span> number system that uses only two symbols: 
                0 and 1. Each position in a binary number represents a power of two, starting from 2⁰ on the right and increasing 
                to 2¹, 2², and so on toward the left. To fully understand how binary system represents numbers, it is helpful to learn
                the conversion techniques between binary and decimal — that is, how to convert a binary number into its decimal equivalent
                 and vice versa.
              </p>

              <h2 className="text-lg font-bold mt-12 mb-4 text-[#253657]">Binary to Decimal Conversion</h2>

              <p className="max-w-[125ch] leading-relaxed mt-4">
                As mentioned earlier, the binary system is a base-2 system that uses only two digits: 0 and 1. 
                Consider the binary number <em>10110110</em>. To convert it into its decimal equivalent, 
                each binary digit, also known as bit, is multiplied by 2 raised to the power of its positional index, starting from 0 on the right.
              </p>

              <p className="max-w-[125ch] leading-relaxed mt-4">
                Consider the binary number <em>10110110</em> which has eight bits, with indices ranging from 0 to 7 (right to left):
              </p>

              <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                
                Bits: &#8202;   1  0  1  1  0  1  1  0<br />
                Index:  7  6  5  4  3  2  1  0

              </p>

              <p className="max-w-[125ch] leading-relaxed mt-4">
                    To find the decimal equivalent, we multiply each binary digit by 2 raised to the power of its positional index and then add the results together.
              </p>

              <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                &#8201; (1×2⁷) + (0×2⁶) + (1×2⁵) + (1×2⁴) + (0×2³) + (1×2²) + (1×2¹) + (0×2⁰)<br />
                = 128 &nbsp; + &#8201; &#8202; 0 &#8201; &#8202; + &#8201; &#8202; 32 &#8201;  + 
                &#8201; &#8202; 16 &#8201; + &#8201; &#8202; 0 &#8201; &#8202; + 
                &#8201; &#8202; 4 &#8201; &#8202; +  &#8201; &#8202; 2 &#8201; &#8202; 
                + &#8201; &#8202; 0 &#8201; &#8202; = <b>182</b>
              </p>

              <p className="max-w-[125ch] leading-relaxed mt-4">
                Therefore, the binary number <em>10110110₂</em> is equal to <b>182₁₀</b> in decimal form.
              </p>
              

              <h2 className="text-lg font-bold mt-12 mb-4 text-[#253657]">Decimal to Binary Conversion</h2>

              <p className="max-w-[125ch] leading-relaxed mt-4">
                Just as binary numbers can be converted into decimal form, decimal numbers can also be represented in binary. 
                This is done by repeatedly dividing the decimal number by 2 and keeping track of the remainders until the quotient becomes 0.
              </p>

              <p className="max-w-[125ch] leading-relaxed mt-4">
                To illustrate, consider converting the decimal number <em>156</em> into binary. 
                We repeatedly divide 156 by 2 until the quotient becomes 0, while keeping track of each remainder. 
                These remainders represent the binary digits (bits) of the number, read from bottom to top.
              </p>

              <div className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                <pre>156 ÷ 2 = 78  remainder 0</pre>
                <pre> 78 ÷ 2 = 39  remainder 0 </pre>
                <pre> 39 ÷ 2 = 19  remainder 1</pre>
                <pre> 19 ÷ 2 = 9   remainder 1</pre>
                <pre>  9 ÷ 2 = 4   remainder 1</pre>
                <pre>  4 ÷ 2 = 2   remainder 1</pre>
                <pre>  2 ÷ 2 = 1   remainder 0</pre>
                <pre>  1 ÷ 2 = 0   remainder 1</pre>
              </div>

              <p className="max-w-[125ch] leading-relaxed mt-4">
                Reading the remainders in reverse order (from the bottom to top) gives the binary representation:
              </p>

              <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                156₁₀ = 10111100₂
              </p>

              <p className="max-w-[125ch] leading-relaxed mt-4">
                Therefore, the decimal number <em>156</em> is equal to <b>10111100</b> in binary form. 
                Each binary digit, known as a <span className="font-semibold text-[#2B5DBF]">bit</span>, 
                corresponds to a power of two, just as digits in the decimal system correspond to powers of ten.
              </p>

            <hr className="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" /> 

            <h1 className="text-2xl font-bold mt-12 mb-4 text-[#253657]">Octal System</h1>

            <p className="max-w-[125ch] leading-relaxed mt-4">
              The <span className="font-semibold text-[#2B5DBF]">octal system</span> is a number system with a 
              <span className="font-semibold text-[#2B5DBF]"> base of 8</span>, which means it uses eight symbols: 
              0, 1, 2, 3, 4, 5, 6, and 7. Each position in an octal number represents a power of 8, 
              just like in the decimal and binary systems where the positions represent powers of 10 and 2, respectively.
            </p>


            <p className="max-w-[125ch] leading-relaxed mt-4">
                The process of converting an <span className="font-semibold text-[#2B5DBF]">octal</span> number to decimal is similar to the one we discussed for binary and decimal conversion. 
                The only difference is that instead of multiplying each digit by powers of 2 as we did for binary, here we multiply each digit by powers of 8 based on its position.
            </p>


            <p className="max-w-[125ch] leading-relaxed mt-4">
              For example, the octal number <em>127₈</em> can be converted into decimal as follows:
            </p>

            <div className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
              
              <pre>  127₈ = (1 × 8²) + (2 × 8¹) + (7 × 8⁰)</pre>
              <pre>       =    64    +    16    +    7     = <b>87₁₀</b></pre>
            </div>

            <p className="max-w-[125ch] leading-relaxed mt-4">
              So, <em>127₈</em> in octal is equal to <b>87₁₀</b> in decimal.
            </p>



            <p className="max-w-[125ch] leading-relaxed mt-8">
              Similarly, we can convert a <span className="font-semibold text-[#2B5DBF]">decimal</span> number to 
              <span className="font-semibold text-[#2B5DBF]"> octal</span> by repeatedly dividing the decimal number by 8 
              and writing down the remainders. Once the quotient becomes 0, we read the remainders from the bottom to the top 
              to get the octal representation.
            </p>

            <p className="max-w-[125ch] leading-relaxed mt-4">
              For example, we can convert the decimal number <em>278</em> into octal:
            </p>

            <div className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
              <pre>278 ÷ 8 = 34 remainder 6</pre>
              <pre> 34 ÷ 8 = 4  remainder 2</pre>
              <pre>  4 ÷ 8 = 0  remainder 4</pre>
            </div>

            <p className="max-w-[125ch] leading-relaxed mt-4">
              Reading the remainders from bottom to top gives the final result:
            </p>

            <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
              278₁₀ = 426₈
            </p>

            <p className="max-w-[125ch] leading-relaxed mt-4">
              Therefore, the decimal number <b>278</b> is equal to <b>426</b> in the octal number system.
            </p>


            <hr className="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />

            <h2 className="text-lg font-bold mt-12 mb-4 text-[#253657]">Binary to Octal Conversion</h2>
          

            <p className="max-w-[125ch] leading-relaxed mt-4">
                The process of converting an <span className="font-semibold text-[#2B5DBF]">octal</span> number to 
                <span className="font-semibold text-[#2B5DBF]"> binary</span> is straightforward. 
                Since <b>8 = 2³</b>, each octal digit can be directly replaced by a group of 
                <span className="font-semibold text-[#2B5DBF]"> three binary digits (bits)</span>. 
                This pattern makes the conversion between binary and octal quick and easy to perform.
            </p>

            <p className="max-w-[125ch] leading-relaxed mt-4">
              The following table shows how each octal digit corresponds to a binary group:
            </p>

            <table className="text-sm border-collapse border border-gray-200 mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2">Octal Digit</th>
                  <th className="border border-gray-200 px-4 py-2">Binary Equivalent</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 px-4 py-1 text-center">0</td><td className="border border-gray-200 px-4 py-1 text-center">000</td></tr>
                <tr><td className="border border-gray-200 px-4 py-1 text-center">1</td><td className="border border-gray-200 px-4 py-1 text-center">001</td></tr>
                <tr><td className="border border-gray-200 px-4 py-1 text-center">2</td><td className="border border-gray-200 px-4 py-1 text-center">010</td></tr>
                <tr><td className="border border-gray-200 px-4 py-1 text-center">3</td><td className="border border-gray-200 px-4 py-1 text-center">011</td></tr>
                <tr><td className="border border-gray-200 px-4 py-1 text-center">4</td><td className="border border-gray-200 px-4 py-1 text-center">100</td></tr>
                <tr><td className="border border-gray-200 px-4 py-1 text-center">5</td><td className="border border-gray-200 px-4 py-1 text-center">101</td></tr>
                <tr><td className="border border-gray-200 px-4 py-1 text-center">6</td><td className="border border-gray-200 px-4 py-1 text-center">110</td></tr>
                <tr><td className="border border-gray-200 px-4 py-1 text-center">7</td><td className="border border-gray-200 px-4 py-1 text-center">111</td></tr>
              </tbody>
            </table>

            <p className="max-w-[125ch] leading-relaxed mt-4">
              For example:
            </p>

            <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
              101101₂ = 55₈
            </p>

            <p className="max-w-[125ch] leading-relaxed mt-4">
              This is done by grouping the binary digits into sets of three, starting from the right, 
              and replacing each group with its corresponding octal digit.
            </p>

            <p className="max-w-[125ch] leading-relaxed mt-4">
                If the number of binary digits is not a multiple of three, add zeros to the left of the binary number until the total number of digits becomes a multiple of three. 
            </p>


            <p className="max-w-[125ch] leading-relaxed mt-4">
              For example, consider the binary number <em>1011011</em>. It has 7 digits, and since 7 is not a multiple of 3, 
              we add two zeros to the left to make the number of digits a multiple of three:
            </p>

            <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
              1011011 → 001011011
            </p>

            <p className="max-w-[125ch] leading-relaxed mt-4">
              Now we can divide the binary number into groups of three from right to left:
            </p>

            <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
              001&nbsp;&nbsp;011&nbsp;&nbsp;011
            </p>


          <h2 className="text-lg font-bold mt-12 mb-4 text-[#253657]">Octal to Binary Conversion</h2>
          



          <p className="max-w-[125ch] leading-relaxed mt-4">
            We’ve seen how a binary number can be converted to octal by grouping its digits in sets of three. 
            Now, let’s look at the reverse — converting an 
            <span className="font-semibold text-[#2B5DBF]"> octal number </span> back into 
            <span className="font-semibold text-[#2B5DBF]"> binary</span>. 
            This process is even simpler since each octal digit can be directly replaced by its 
            three-digit binary form.
          </p>

          <p className="max-w-[125ch] leading-relaxed mt-4">
            For example, consider the octal number <b>125₈</b>:
          </p>

          <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            1 → 001 <br />
            2 → 010 <br />
            5 → 101
          </p>

          <p className="max-w-[125ch] leading-relaxed mt-4">
            Putting them together gives the binary equivalent:
          </p>

          <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            001010101₂
          </p>



          <hr className="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" /> 

          <h1 className="text-2xl font-bold mt-12 mb-4 text-[#253657]">Hexadecimal System</h1>

      <p className="max-w-[125ch] leading-relaxed mt-4">
        The <span className="font-semibold text-[#2B5DBF]">hexadecimal system</span> is another commonly used number system, 
        especially in computer science. It has a 
        <span className="font-semibold text-[#2B5DBF]"> base of 16</span>, meaning it uses sixteen unique symbols to represent numbers.
        These symbols include the digits <b>0–9</b> and the letters <b>A–F</b>, where A through F represent the decimal values 10 through 15.
      </p>

      <p className="max-w-[125ch] leading-relaxed mt-4">
        Each position in a hexadecimal number represents a power of 16, just like the decimal system is based on powers of 10 
        and the binary system on powers of 2.
      </p>

      <p className="max-w-[125ch] leading-relaxed mt-4">
        For example, the hexadecimal number <em>3A₁₆</em> can be converted into decimal as:
      </p>

      <div className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
        <pre>3A₁₆ = (3 × 16¹) + (10 × 16⁰)</pre>
        <pre>     =     48    +     10     = <b>58₁₀</b></pre>
      </div>

      <p className="max-w-[125ch] leading-relaxed mt-4">
        So, <em>3A₁₆</em> in hexadecimal is equal to <b>58₁₀</b> in decimal.
      </p>

      <p className="max-w-[125ch] leading-relaxed mt-8">
        In the same way, a decimal number can also be converted to hexadecimal by repeatedly dividing the number by 16 
        and writing down the remainders. Once the quotient becomes 0, the remainders are read from the bottom to the top 
        to form the hexadecimal number.
      </p>

      <p className="max-w-[125ch] leading-relaxed mt-4">
        For example, let’s convert the decimal number <em>350</em> into hexadecimal:
      </p>

      <div className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
        <pre>350 ÷ 16 = 21 remainder 14 → E</pre>
        <pre> 21 ÷ 16 = 1  remainder 5</pre>
        <pre>  1 ÷ 16 = 0  remainder 1</pre>
      </div>

      <p className="max-w-[125ch] leading-relaxed mt-4">
        Reading the remainders from bottom to top gives:
      </p>

      <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
        350₁₀ = 15E₁₆
      </p>

      <p className="max-w-[125ch] leading-relaxed mt-4">
        Therefore, the decimal number <b>350</b> is equal to <b>15E₁₆</b> in hexadecimal.
      </p>

      <hr className="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />

      <h2 className="text-lg font-bold mt-12 mb-4 text-[#253657]">Binary and Hexadecimal Relationship</h2>

      <p className="max-w-[125ch] leading-relaxed mt-4">
        One of the main reasons hexadecimal is so important in computer science is because it connects perfectly with binary. 
        Since <b>16 = 2⁴</b>, each hexadecimal digit can be represented using four binary digits (bits). 
        This makes large binary values much easier to read and write.
      </p>

      <p className="max-w-[125ch] leading-relaxed mt-4">
        The table below shows how each hexadecimal digit corresponds to its 4-bit binary equivalent:
      </p>
        <table className="text-sm border-collapse border border-gray-200 mt-4 w-full max-w-[600px] text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Hex</th>
              <th className="border border-gray-200 px-4 py-2">Binary</th>
              <th className="border border-gray-200 px-4 py-2">Hex</th>
              <th className="border border-gray-200 px-4 py-2">Binary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-3 py-1">0</td><td className="border border-gray-200 px-3 py-1">0000</td>
              <td className="border border-gray-200 px-3 py-1">8</td><td className="border border-gray-200 px-3 py-1">1000</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-1">1</td><td className="border border-gray-200 px-3 py-1">0001</td>
              <td className="border border-gray-200 px-3 py-1">9</td><td className="border border-gray-200 px-3 py-1">1001</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-1">2</td><td className="border border-gray-200 px-3 py-1">0010</td>
              <td className="border border-gray-200 px-3 py-1">A</td><td className="border border-gray-200 px-3 py-1">1010</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-1">3</td><td className="border border-gray-200 px-3 py-1">0011</td>
              <td className="border border-gray-200 px-3 py-1">B</td><td className="border border-gray-200 px-3 py-1">1011</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-1">4</td><td className="border border-gray-200 px-3 py-1">0100</td>
              <td className="border border-gray-200 px-3 py-1">C</td><td className="border border-gray-200 px-3 py-1">1100</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-1">5</td><td className="border border-gray-200 px-3 py-1">0101</td>
              <td className="border border-gray-200 px-3 py-1">D</td><td className="border border-gray-200 px-3 py-1">1101</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-1">6</td><td className="border border-gray-200 px-3 py-1">0110</td>
              <td className="border border-gray-200 px-3 py-1">E</td><td className="border border-gray-200 px-3 py-1">1110</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-1">7</td><td className="border border-gray-200 px-3 py-1">0111</td>
              <td className="border border-gray-200 px-3 py-1">F</td><td className="border border-gray-200 px-3 py-1">1111</td>
            </tr>
          </tbody>
        </table>

      <p className="max-w-[125ch] leading-relaxed mt-4">
        For example, the binary number <b>11011110₂</b> can be converted to hexadecimal by grouping the digits into sets of four from right to left:
      </p>

      <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
        1101&nbsp;&nbsp;1110 → D&nbsp;&nbsp;E → <b>DE₁₆</b>
      </p>

          <p className="max-w-[125ch] leading-relaxed mt-4">
            Converting from <span className="font-semibold text-[#2B5DBF]">hexadecimal</span> back to 
            <span className="font-semibold text-[#2B5DBF]"> binary</span> is even easier. 
            Since each hexadecimal digit directly represents a group of four binary digits, 
            we can simply replace every hex digit with its corresponding 4-bit binary value.
          </p>

          <p className="max-w-[125ch] leading-relaxed mt-4">
            For example, let’s convert the hexadecimal number <em>2F₁₆</em> into binary:
          </p>

          <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            2 → 0010 <br />
            F → 1111
          </p>

          <p className="max-w-[125ch] leading-relaxed mt-4">
            Putting them together gives the binary representation:
          </p>

          <p className="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            2F₁₆ = 00101111₂
          </p>
        </div>
      </LayoutWrapper>

  );
}