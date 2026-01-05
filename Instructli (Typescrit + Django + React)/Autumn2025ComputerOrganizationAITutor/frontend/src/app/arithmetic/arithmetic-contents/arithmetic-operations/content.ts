export const arithmeticOperationsContent = `
<div class="flex-1 overflow-auto p-10 text-gray-800 w-full max-w-none">

          <h1 class="text-3xl font-bold mb-4 text-[#253657]">Arithmetic Operations</h1>

          <p class="max-w-[135ch] leading-relaxed">
            In computer systems, arithmetic operations such as addition and subtraction are 
            performed directly on binary numbers. 
            Since computers represent all data in binary form, understanding how these basic 
            operations work is essential to see how processors handle calculations at the hardware level.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            In this section, we’ll focus on how binary 
            <span class="font-semibold text-[#2B5DBF]"> addition</span> and 
            <span class="font-semibold text-[#2B5DBF]"> subtraction</span> are performed — 
            using <span class="font-semibold text-[#2B5DBF]"> carry</span> and 
            <span class="font-semibold text-[#2B5DBF]"> borrow</span> bits, as well as the 
            <span class="font-semibold text-[#2B5DBF]"> two’s complement</span> method.
          </p>

          <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />

          <h1 class="text-2xl font-bold mt-12 mb-4 text-[#253657]">Binary Addition</h1>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Just like in the decimal system, addition in binary involves adding digits together 
            — but since binary numbers only use the digits 0 and 1, the possible outcomes are much simpler. 
            Because each position in binary can only hold a single bit, when the sum of two bits 
            becomes larger than 1, the system produces a 
            <span class="font-semibold text-[#2B5DBF]"> carry bit</span>. 
            This carry is passed on to the next higher bit position, just like how you “carry over” 
            in regular decimal addition when the sum exceeds 9.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            The basic rules for adding two binary digits are as follows:
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>0 + 0 =  0</pre>
            <pre>0 + 1 =  1</pre>
            <pre>1 + 0 =  1</pre>
            <pre>1 + 1 = 10</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            The last case, <b>1 + 1 = 10₂</b>, is what introduces the concept of a 
            <span class="font-semibold text-[#2B5DBF]"> carry bit</span>. 
            Since the sum is greater than 1, the result cannot fit into a single binary digit. 
            Therefore, a <b>0</b> is written in the current column, and a <b>1</b> is carried 
            over to the next higher bit position.
          </p>



          <p class="max-w-[135ch] leading-relaxed mt-8">
            To better understand how binary addition works, let’s start with an example in the decimal system.
            Suppose we want to add <b>69</b> and <b>26</b>. We add the digits column by column, starting from 
            the rightmost side. If the sum in a column is greater than 9, we keep the rightmost digit as the result 
            and carry the extra 1 into the next column on the left.
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>      1  0  (carry)</pre>

            <pre>          </pre>
            <pre>      6  3</pre>
            <pre>   +  2  9</pre>
            <pre>   -------</pre>
            <pre>      9  2</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            In the ones column, <b>3 + 9 = 12</b>. We write down the 2 and carry 1 to the tens column.  
            In the tens column, <b>6 + 2 = 8</b>, and adding the carried 1 gives <b>9</b>.  
            The final result is <b>92</b>.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-8">
            The same process applies when we perform the addition in 
            <span class="font-semibold text-[#2B5DBF]"> binary</span>.  
            The number <b>63</b> in 8-bit binary is <b>00111111₂</b>, and <b>29</b> is <b>00011101₂</b>.  
            We add them bit by bit from right to left.  
            Whenever the sum of two bits becomes <b>2</b> (that is, <b>1 + 1</b>), 
            we write 0 in that column and carry 1 into the next bit on the left.
          </p>


          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>     0 1 1 1 1 1 1 0   (carry)</pre>
            <pre>                    </pre>
            <pre>     0 0 1 1 1 1 1 1</pre>
            <pre>  +  0 0 0 1 1 1 0 1</pre>
            <pre>  -------------------</pre>
            <pre>     0 1 0 1 1 1 0 0</pre>
          </div>


          <p class="max-w-[135ch] leading-relaxed mt-4">
            After all the carries are applied, the final sum is <b>01011100₂</b>, which equals <b>92₁₀</b>.  
            This confirms that binary addition follows the same carry-over principle as decimal addition — 
            just with two symbols instead of ten.
          </p>

          <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />

          <h1 class="text-2xl font-bold mt-12 mb-4 text-[#253657]">Binary Subtraction</h1>


          <p class="max-w-[135ch] leading-relaxed mt-4">
            Similar to binary addition, binary subtraction follows the same logic as subtraction in the 
            <span class="font-semibold text-[#2B5DBF]"> decimal system</span>, except that it only uses the digits 
            <b> 0 </b> and <b> 1</b>.  When the upper bit in a column is greater than or equal to the lower bit, 
            the subtraction is performed directly. However, when a <b>1</b> must be subtracted from a <b>0</b>, 
            we need to <span class="font-semibold text-[#2B5DBF]">borrow</span> from the next higher bit, 
            just like borrowing in decimal subtraction.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            The basic subtraction rules for single binary digits are:
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre> 0 − 0 = 0</pre>
            <pre> 1 − 0 = 1</pre>
            <pre> 1 − 1 = 0</pre>
            <pre> 0 − 1 → cannot subtract directly, so borrow from the next higher bit</pre>
            <pre>10 − 1 = 1</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-8">
            To see this in action, let’s first consider subtraction in the decimal system.  
            Suppose we want to perform the following: <b>58 − 29</b>. 
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>        4   18  (borrow)</pre>
            <pre>        <del>5   8</del> </pre>
            <pre>     −  2   9 </pre>
            <pre>     ---------</pre>
            <pre>        2   9 </pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            We start from the rightmost column.  
            Since 8 is smaller than 9, we borrow 1 from the next column, turning the 5 into a 4 
            and adding 10 to the ones column. Now, <b>18 − 9 = 9</b> and <b>4 − 2 = 2</b>, giving <b>29</b>.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-8">
            The same principle applies to <span class="font-semibold text-[#2B5DBF]">binary subtraction</span>.  
            The number <b>58</b> in 8-bit binary is <b>00111010₂</b>, and <b>29</b> is <b>00011101₂</b>.  
            We subtract each bit column from right to left. Whenever a column requires subtracting 1 from 0, 
            we borrow 1 from the next higher bit — just like borrowing 10 in decimal subtraction.
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>     0   0   0   10</pre>
            <pre>     <del>0   0   1   0</del>   10   </pre>
            <pre>     <del>0   0   1   1   0</del>   10   </pre>
            <pre>     <del>0   0   1   1   1   0</del>   0   </pre>
            <pre>     <del>0   0   1   1   1   0   0</del>   10  </pre>
            <pre>     <del>0   0   1   1   1   0   1   0</del></pre>
            <pre>  −  0   0   0   1   1   1   0   1</pre>
            <pre>  --------------------------------y</pre>
            <pre>     0   0   0   1   1   1   0   1</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            After completing all the borrows, the result is <b>00011101₂</b>, which equals <b>29₁₀</b>.  
            This example shows that the borrow mechanism in binary subtraction works exactly like 
            the carry process in binary addition..
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-8">
            While the borrowing method clearly shows how binary subtraction works,  
            it can become <b>tedious</b> when dealing with larger numbers or long sequences of borrows.  
            Performing each borrow step takes time and can make the process feel repetitive.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            To make subtraction simpler and more efficient, there’s another approach that removes the need for borrowing entirely —  
            the <span class="font-semibold text-[#2B5DBF]">two’s complement</span> method.
          </p>


          <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />
          <h2 class="text-lg font-bold mt-12 mb-4 text-[#253657]">Two's Complement Method</h2>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            The <span class="font-semibold text-[#2B5DBF]">two’s complement</span> method is an easier and faster way to perform subtraction in binary.  
            Instead of borrowing, this method converts the negative number into its 
            <span class="font-semibold text-[#2B5DBF]">two’s complement</span> 
            form and then adds it to the positive number.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            This approach works because taking the two’s complement of a binary number effectively represents its negative value.  
            By turning subtraction into addition, the process becomes much simpler — there’s no borrowing involved,  
            and both addition and subtraction can use the same basic operation.
          </p>

         <h2 class="text-base font-bold mt-8 mb-4 text-[#253657]">Steps to Perform Subtraction Using Two’s Complement</h2>

          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
            <ol class="list-decimal list-inside space-y-2">
              <li>Express both numbers in binary using the same number of bits.</li>
              <li>Convert the <b>negative number</b> into its <b>two’s complement form</b> — this represents its negative value in binary.</li>
              <li>Add the two binary values together, just as in normal binary addition.</li>
              <li>If a carry is generated beyond the leftmost bit, simply ignore it.</li>
            </ol>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-8">
            To see how this works in practice, let’s subtract <b>29</b> from <b>58</b> using two's complement method.
          </p>



          <p class="max-w-[135ch] leading-relaxed mt-4">
            First, represent both numbers in 8-bit binary form:
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>58₁₀ = 00111010₂</pre>
            <pre>29₁₀ = 00011101₂</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Next, take the <b>two’s complement</b> of 29 (the negative number).  
            To do this, first invert all bits, then add 1 to that result.
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>      29         → 00011101₂</pre>
            <pre>Invert all bits  → 11100010₂</pre>
            <pre>     Add 1       → 11100011₂</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Now, add <b>11100011₂</b> to the binary form of 58₁₀:
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>     00111010</pre>
            <pre>  +  11100011</pre>
            <pre>  ------------</pre>
            <pre>   1 00011101</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Notice that a carry is produced beyond the 8th bit. In the two’s complement method, this carry is ignored,  
            leaving the final 8-bit result <b>00011101₂</b>, which equals <b>29₁₀</b> in decimal.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            This confirms that <b>58 − 29 = 29</b>. The two’s complement method allows subtraction to be performed entirely through addition — 
            without borrowing or intermediate steps.
          </p>



          <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />
          <h2 class="text-lg font-bold mt-12 mb-4 text-[#253657]">The Addition of Negative Numbers</h2>

          <p class="max-w-[135ch] leading-relaxed mt-8">
            The two’s complement method can also be used to directly add negative numbers together.  
            In this representation, negative values are already stored in their two’s complement form, 
            so they can be added just like positive numbers.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            For example, let’s add <b>−25</b> and <b>−13</b> using 8-bit binary numbers.
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>          +25          →  00011001₂</pre>
            <pre>Two’s complement (−25) →  11100111₂</pre>
            <pre>          +13          →  00001101₂</pre>
            <pre>Two’s complement (−13) →  11110011₂</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Now, add the two negative numbers:
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>     11100111</pre>
            <pre>  +  11110011</pre>
            <pre>  ------------</pre>
            <pre>   1 11011010</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            The carry beyond the 8th bit is ignored, giving <b>11011010₂</b>.  
            Since the leftmost bit is 1, the result is negative.  
            To find its decimal value, we take the two’s complement of <b>11011010₂</b>:
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>11011010      →  invert → 00100101</pre>
            <pre>00100101 + 1  →  00100110</pre>
            <pre>00100110₂     =  38₁₀</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Since the sign bit is <b>1</b> and the magnitude is <b>38₁₀</b>, the final value is <b>−38₁₀</b>.
            Therefore, the result represents <b>−38₁₀</b>, which matches the expected sum of <b>−25 + (−13) = −38</b>.
          </p>
        </div>`;