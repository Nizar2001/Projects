export const overflowContent = `
 <div class="flex-1 overflow-auto p-10 text-gray-800 w-full max-w-none">

          <h1 class="text-3xl font-bold mb-4 text-[#253657]">Understanding Overflow</h1>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Computers perform all arithmetic operations using a fixed number of bits.  
            These bits can only represent values within a specific range.  
            For example, an 8-bit unsigned system can store numbers from <b>0</b> to <b>255</b>, 
            while an 8-bit signed system (using two’s complement) can represent values from <b>−128</b> to <b>+127</b>.  
            When the result of an operation goes beyond this range, the extra bit information cannot be stored and is lost.
            This condition is known as an  <span class="font-semibold text-[#2B5DBF]"> overflow</span>.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Overflow can happen in both <b>unsigned</b> and <b>signed</b> arithmetic.  
            However, the way it occurs and how it affects the result are different in each case.  
            Let’s go through both to see how overflow takes place in each situation.
          </p>

          <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />
          <h1 class="text-2xl font-bold mt-12 mb-4 text-[#253657]">Unsigned Overflow</h1>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            When performing arithmetic operations on <span class="font-semibold text-[#2B5DBF]">unsigned integers</span>, 
            overflow happens when the result of an addition goes beyond the range that can be represented 
            with the available number of bits. </p>


          <p class="max-w-[135ch] leading-relaxed mt-4">
            When performing arithmetic operations on unsigned integers, 
            overflow occurs when the result of an addition becomes larger than the highest value that can be represented 
            with the given number of bits. Since there are no extra bits to store the extra value, the carry out of the 
            most significant bit (MSB) is lost.
          </p>


          <p class="max-w-[135ch] leading-relaxed mt-4">
            For example, in an 8-bit unsigned system, the largest value that can be represented is <b>255</b> (<b>11111111₂</b>).  
            Adding <b>1</b> to it gives:
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>  1 1 1 1 1 1 1 1</pre>
            <pre>+ 0 0 0 0 0 0 0 1</pre>
            <pre>-----------------</pre>
            <pre>1 0 0 0 0 0 0 0 0</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            The extra <b>1</b> on the left is the carry that goes beyond the 8 bits. 
            Since there is no space to store it, the carry is simply dropped.  
            The remaining 8 bits are <b>00000000₂</b>, which equals <b>0₁₀</b> in decimal.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            This means that even though the correct mathematical result of 255 + 1 is 256, 
            the system cannot represent 256 using only 8 bits. 
            As a result, the value stored becomes <b>0</b> instead of <b>256</b>. 
            This situation is what we call an <span class="font-semibold text-[#2B5DBF]">overflow</span>.
          </p>


          <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />
          <h1 class="text-2xl font-bold mt-12 mb-4 text-[#253657]">Signed Overflow</h1>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            When performing arithmetic operations on <b>signed integers</b> (using 
            <span class="font-semibold text-[#2B5DBF]"> two’s complement</span> representation), 
            overflow happens when the result of an operation is too large or too small 
            to fit within the range that can be represented by the available number of bits.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            In an 8-bit system that uses <span class="font-semibold text-[#2B5DBF]">two’s complement</span> representation, 
            numbers within a fixed range can be represented — from <b>−128</b> (<b>10000000₂</b>) to <b>+127</b> (<b>01111111₂</b>).  
            If the result of an operation goes outside this range, it can no longer be represented correctly within 8 bits.  
            As a result, the sign bit (the leftmost bit) flips, turning what should have been a positive result into a 
            negative one, or vice versa.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            For example, let’s add <b>+127</b> (<b>01111111₂</b>) and <b>+1</b> (<b>00000001₂</b>):
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>  0 1 1 1 1 1 1 1</pre>
            <pre>+ 0 0 0 0 0 0 0 1</pre>
            <pre>-----------------</pre>
            <pre>  1 0 0 0 0 0 0 0</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            The result <b>10000000₂</b> represents <b> −128₁₀ </b> in two’s complement form, 
            even though we were adding two positive numbers. 
            This happens because the result exceeded the maximum positive range that 8 bits can represent. 
            The sign bit flipped, which indicates an <b>overflow</b>.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-8">
            Similarly, adding two large negative numbers can also cause overflow if the result goes below 
            the minimum representable value of <b>−128</b>.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            For example, if we add <b>−100</b> (<b>10011100₂</b>) and <b>−50</b> (<b>11001110₂</b>) in an 8-bit system, the result should be <b>−150</b>.  
            However, since <b>−150</b> is outside the representable range of <b>−128</b> to <b>+127</b>, we get the following result:
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>  1 0 0 1 1 1 0 0  (−100)</pre>
            <pre>+ 1 1 0 0 1 1 1 0  (−50)</pre>
            <pre>-----------------</pre>
            <pre>1 0 1 1 0 1 0 1 0</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Ignoring the carry beyond the 8th bit leaves the final 8-bit result as <b>01101010₂</b>, which equals <b>+106₁₀</b> in decimal.  
            This is incorrect, because adding two negative numbers should never produce a positive result.  
            The reason this happens is because the true result (−150) is smaller than what can be represented using 8 bits, 
             causing the sign bit to flip from <b>1</b> to <b>0</b> — leading to 
          <span class="font-semibold text-[#2B5DBF]"> signed overflow</span>.
          </p>
          

          <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />
          <h1 class="text-2xl font-bold mt-12 mb-4 text-[#253657]">Handling Overflow: Saturated vs Unsaturated</h1>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            When overflow occurs, the way a computer handles it depends on how arithmetic operations are defined for that system.  
            The two most common methods are <b>unsaturated arithmetic</b> and <b>saturated arithmetic</b>.
          </p>

          <h2 class="text-lg font-bold mt-12 mb-4 text-[#253657]">Unsaturated Arithmetic</h2>

          <p class="max-w-[135ch] leading-relaxed mt-2">
            In <span class="font-semibold text-[#2B5DBF]">unsaturated arithmetic</span>, 
              when the result of an operation exceeds the largest value that can be represented with the available bits, 
              the system cannot store the extra bit that is produced. Therefore, the extra carry bit is removed, and the remaining 
              bits are stored as the final result — which no longer represents the correct numerical value.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            For example, in an <b>8-bit unsigned</b> system, the largest value that can be represented is <b>255</b> (<b>11111111₂</b>).  
            If we add <b>1</b> to this value, the sum requires 9 bits, but since the system can only store 8 bits, 
            the leftmost carry bit is dropped.
          </p>


          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>  1 1 1 1 1 1 1 1</pre>
            <pre>+ 0 0 0 0 0 0 0 1</pre>
            <pre>------------</pre>
            <pre>1 0 0 0 0 0 0 0 0</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            After discarding the extra carry bit, the result becomes <b>00000000₂</b>, which is <b>0₁₀</b>.  
            This happens because the extra bit that could represent <b>256</b> is lost — the system has no room to store it.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-8">
            The same idea applies to <b>signed 8-bit numbers</b> represented using two’s complement.  
            The largest positive number that can be stored is <b>+127</b> (<b>01111111₂</b>).  
            Adding <b>1</b> to it causes the sign bit (the leftmost bit) to change, making the result appear as a negative value instead.
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>  0 1 1 1 1 1 1 1  (+127)</pre>
            <pre>+ 0 0 0 0 0 0 0 1  (+1)</pre>
            <pre>------------</pre>
            <pre>  1 0 0 0 0 0 0 0  (−128)</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            The final result, <b>10000000₂</b>, represents <b>−128</b> in two’s complement — even though we were adding two positive numbers.  
          </p>


          <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />
          <h2 class="text-lg font-bold mt-12 mb-4 text-[#253657]">Saturated Arithmetic</h2>

          <p class="max-w-[135ch] leading-relaxed mt-2">
            In <span class="font-semibold text-[#2B5DBF]">saturated arithmetic</span>, 
            if the result of an operation becomes larger than the maximum value that can be represented, 
            the system stores the largest possible value instead.  
            Likewise, if the result becomes smaller than the minimum value that can be represented, 
            the system stores the smallest possible value.  
            This prevents the sign bit from changing and keeps the result within the valid range of the number system.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-8">
            For example, in an <b>8-bit signed</b> system, values can range from <b>−128</b> (<b>10000000₂</b>) 
            to <b>+127</b> (<b>01111111₂</b>).  
            If we try to add <b>100</b> (<b>01100100₂</b>) and <b>50</b> (<b>00110010₂</b>), 
            the correct mathematical result is <b>150</b>, but this value cannot be represented in 8 bits.
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>  0 1 1 0 0 1 0 0  (+100)</pre>
            <pre>+ 0 0 1 1 0 0 1 0  (+50)</pre>
            <pre>------------------</pre>
            <pre>  1 0 0 1 0 1 1 0  (wrong result — exceeds the 8-bit range)</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            The correct result of <b>100 + 50</b> is <b>150₁₀</b>. However, an 8-bit signed system can only represent values up to 
            <b>+127</b>. The binary result <b>10010110₂</b> goes beyond this range and cannot be stored correctly.  
            In <span class="font-semibold text-[#2B5DBF]">saturated arithmetic</span>, instead of storing this wrong result, 
            the system stores the maximum representable value — <b>01111111₂</b>, which equals <b>+127₁₀</b>.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-8">
            Similarly, when performing subtraction or adding two negative numbers,  
            the result can become smaller than the minimum value that can be stored with the available bits.  
            In such cases, <span class="font-semibold text-[#2B5DBF]">saturated arithmetic</span> 
            sets the result to the lowest value that can be represented with those bits, 
            instead of producing an incorrect positive value.
          </p>


          <p class="max-w-[135ch] leading-relaxed mt-4">
            For example, in an 8-bit signed system, the smallest value that can be represented is <b>−128</b> (<b>10000000₂</b>).  
            If we add <b>−100</b> (<b>10011100₂</b>) and <b>−50</b> (<b>11001110₂</b>), 
            the correct result should be <b>−150</b>, which cannot be represented with 8 bits.
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>  1 0 0 1 1 1 0 0  (−100)</pre>
            <pre>+ 1 1 0 0 1 1 1 0  (−50)</pre>
            <pre>------------------</pre>
            <pre>  0 1 1 0 1 0 1 0  (wrong result — exceeds the negative limit)</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Since the actual result, <b>−150</b>, is smaller than the minimum value that can be represented in an 8-bit signed system (<b>−128</b>),
            this out-of-range result is replaced with the smallest representable value — <b>10000000₂</b>, which corresponds to <b>−128₁₀</b>.
          </p>


        </div>
`;