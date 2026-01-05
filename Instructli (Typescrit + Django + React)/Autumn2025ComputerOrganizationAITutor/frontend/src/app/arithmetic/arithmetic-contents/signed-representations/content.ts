export const signedRepresentationContent = `
 <div class="flex-1 overflow-auto p-10 text-gray-800 w-full max-w-none">
          <h1 class="text-3xl font-bold mb-4 text-[#253657]">Number Representation</h1>
          <p class="max-w-[135ch] leading-relaxed">
            Every piece of data that a computer stores or processes — whether it’s a number, a character, 
            or even a program instruction — is ultimately represented in binary, using only the 
            digits 0 and 1. Because the hardware can only understand these two symbols, all forms
             of data, including numbers, must be written as combinations of bits that the system 
             can read and manipulate.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Among the different types of data represented in 
            <span class="font-semibold text-[#2B5DBF]"> binary</span>, 
            numbers are the most fundamental. 
            Computers can represent several kinds of numbers, but the two most common are 
            <span class="font-semibold text-[#2B5DBF]"> integers</span> and 
            <span class="font-semibold text-[#2B5DBF]"> floating-point values</span>. </p>

            <p class="max-w-[135ch] leading-relaxed mt-4">
            In this section, we’ll focus on 
            <span class="font-semibold text-[#2B5DBF]"> integers</span> — 
            whole numbers that are stored directly in binary form using 32 bits. 
            Each bit can only have a value of 0 or 1, but depending on how these 
            bits are interpreted, they can represent numbers in different ways. 
            Numbers that are treated as 
            <span class="font-semibold text-[#2B5DBF]"> unsigned </span> 
            can only represent  zero and  positive values, 
            while <span class="font-semibold text-[#2B5DBF]"> signed </span> numbers 
            can represent both positive and negative values.
          </p>


          <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />
 
          <h1 class="text-2xl font-bold mt-12 mb-4 text-[#253657]">Unsigned Representation</h1>


          <p class="max-w-[135ch] leading-relaxed">
            When integers are treated as <span class="font-semibold text-[#2B5DBF]">unsigned</span>, they represent
            only non-negative values— that is, zero and positive integers. In this form, all the bits are used to represent
            the magnitude of the number, and no bit is reserved to indicate the sign.
            .
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            For example, a <b>32-bit unsigned</b> integer can represent values from
            <b> 0 </b> up to <b>2<sup>32</sup> − 1</b>, or <b>0</b> to <b>4,294,967,295</b> in decimal form.
            Because every bit contributes to the numerical value, unsigned integers can represent a larger 
            range of positive numbers compared to their signed counterparts.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
              Unsigned numbers are often used for quantities that are always zero or positive — values that can never be negative. 
              Examples include <b>memory sizes</b>, <b>file sizes</b> and <b>addresses in main memory</b>.
              In these cases, negative values would not make sense, so using unsigned representation is more appropriate.

          </p>

          <h3 class="text-lg font-bold mt-8 mb-3 text-[#253657]">Example</h3>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Suppose we have an <b>8-bit unsigned</b> integer. Since it uses 8 bits, it can represent values from 
            <b> 0 </b> to <b> 2<sup>8</sup> − 1</b>, or <b>0</b> to <b>255</b> in decimal form.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            The smallest value, when all bits are <b>0</b>, represents zero, and the largest value, when all bits are <b>1</b>, represents 255:
          </p>

          <p class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            00000000 → 0<br />
            11111111 → 255
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            In general, the more bits available, the larger the range of values that can be represented.
            For example, a <b>16-bit unsigned</b> integer can represent values from <b>0</b> to <b>65,535</b>, 
            while a <b>32-bit unsigned</b> integer can represent values up to <b>4,294,967,295</b>.
          </p>

          <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />
 
          <h1 class="text-2xl font-bold mt-12 mb-4 text-[#253657]">Signed Representation</h1>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            In computer systems, it’s important to represent both positive and negative integers. 
            Since <b> unsigned</b> representation can only handle zero and positive values, 
            we need a different method that allows binary numbers to include negative values as well. 
            To make this possible, computers use <span class="font-semibold text-[#2B5DBF]">signed representation</span>, 
             which defines how both positive and negative integers can be expressed in binary.
          </p>


          <p class="max-w-[135ch] leading-relaxed mt-4">
            Unlike unsigned integers, where all bits are used to represent positive values, 
            signed representations divide the available bits into two groups — one for positive numbers (including zero) 
            and one for negative numbers. The exact way this division happens depends on the representation method used.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            There are several common methods for representing signed integers in binary. Two of the most commons include 
            <span class="font-semibold text-[#2B5DBF]"> sign-magnitude</span> and 
            <span class="font-semibold text-[#2B5DBF]"> two’s complement</span>. 
            Each method follows different rules for how to interpret the bits and how arithmetic operations like addition or subtraction work. 
            In the following sections, we’ll explore each method, starting with
            <span class="font-semibold text-[#2B5DBF]"> sign-magnitude</span> and then moving to
            <span class="font-semibold text-[#2B5DBF]"> two’s complement</span>.
          </p>


          <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />
 
          <h1 class="text-2xl font-bold mt-12 mb-4 text-[#253657]">Sign-Magnitude</h1>




          <p class="max-w-[135ch] leading-relaxed mt-4">
            The <span class="font-semibold text-[#2B5DBF]">sign-magnitude representation</span> 
            is one of the simplest ways to represent signed integers in binary. 
            In this method, the leftmost bit, known as the 
            <span class="font-semibold text-[#2B5DBF]"> most significant bit (MSB)</span>, 
            indicates the sign of the number, while the remaining bits represent its 
            <span class="font-semibold text-[#2B5DBF]"> magnitude</span> or absolute value.
              A sign bit of <b>0</b> indicates that the number is <b>positive</b>, 
             whereas a sign bit of <b>1</b> indicates that the number is <b>negative</b>.
          </p>


          <p class="max-w-[135ch] leading-relaxed mt-4">
            For example, in an <b>8-bit</b> system, the first bit is used for the sign 
            and the remaining seven bits represent the value of the number:
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>0 0000101 → +5</pre>
            <pre>1 0000101 → −5</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Here, both patterns use the same seven bits for magnitude, 
            but the sign bit changes the interpretation of the value.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Larger magnitudes follow the same principle. 
            For example, with 8 bits, the highest positive number that can be represented is <b>+127</b>, 
            and the smallest negative number is <b>−127</b>:
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre>0 1111111 → +127</pre>
            <pre>1 1111111 → −127</pre>
          </div>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            In general, an <b>n-bit</b> sign-magnitude number can represent values from 
            −(2<sup>n−1</sup> − 1) to +(2<sup>n−1</sup> − 1). 
            The more bits available, the larger the range of values that can be represented.
          </p>


          <h2 class="text-lg font-bold mt-12 mb-4 text-[#253657]">Limitation: Two Representations of Zero</h2>

          <p class="max-w-[135ch] leading-relaxed mt-2">
            However, the <span class="font-semibold text-[#2B5DBF]">sign-magnitude</span> system has one major problem — 
            it allows for two different representations of zero: one positive and one negative.
          </p>

          <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
            <pre>0 0000000 → +0</pre>
            <pre>1 0000000 → −0</pre>
          </div>

         <p class="max-w-[135ch] leading-relaxed mt-4">
            Although both patterns represent the same numeric value, the computer treats them as 
            two distinct binary codes. This means that computers treats +0 and −0 as two different values,
            because their bit patterns are different — even though mathematically they are the same. 
            This inconsistency introduces unnecessary complexity in equality checks and in 
            the implementation of arithmetic operations.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            This duplication also wastes one possible bit pattern that could have been used to represent 
            an additional number. For instance, an <b>8-bit sign-magnitude</b> system provides 
            <b> 2⁸ = 256</b> total bit combinations, but because there are two versions of zero, 
            only <b>255 distinct</b> numerical values can actually be represented.
          </p>


          <p class="max-w-[135ch] leading-relaxed mt-4">
            Because of these issues, modern computer architectures no longer use sign-magnitude for general 
            integer storage or arithmetic. Instead, they rely on more practical systems that eliminate the 
            duplicate zero and simplify hardware operations — such as 
            <span class="font-semibold text-[#2B5DBF]"> two’s complement</span>, 
            which we’ll explore next.
          </p>

          <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />
 
          <h1 class="text-2xl font-bold mt-12 mb-4 text-[#253657]">Two's Complement</h1>


          <p class="max-w-[135ch] leading-relaxed mt-4">
            The <span class="font-semibold text-[#2B5DBF]"> two’s complement representation</span> 
            is the standard method used by modern computers to represent signed integers. 
            It eliminates the issue of having two zeros and makes arithmetic operations such as addition, subtraction, 
            and comparison straightforward to implement in hardware.
          </p>

          <p class="max-w-[135ch] leading-relaxed mt-4">
            Just like sign-magnitude, the leftmost bit — known as the 
            <span class="font-semibold text-[#2B5DBF]"> most significant bit (MSB)</span> — 
            still indicates the sign of the number. 
            A sign bit of <b>0</b> means the number is <b>positive</b>, and a sign bit of <b>1</b> means it is <b>negative</b>. 
            However, in two’s complement, negative numbers are not stored as a simple “sign” plus a magnitude. 
            Instead, the entire bit pattern is changed when representing negative values.
          </p>


        <h3 class="text-lg font-bold mt-12 mb-3 text-[#253657]">Representing Positive Values</h3>

        <p class="max-w-[135ch] leading-relaxed mt-4">
          For positive numbers, the two’s complement system works exactly the same way as sign-magnitude.
        </p>

        <p class="max-w-[135ch] leading-relaxed mt-4">
          For example, in an <b>8-bit</b> system:
        </p>

        <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
          <pre>0 0000001 → +1<br /></pre>
          <pre>0 0000101 → +5<br /></pre>
          <pre>0 1111111 → +127</pre>
        </div>

        <p class="max-w-[135ch] leading-relaxed mt-4">
          All of these have a <b>0</b> in the sign bit, meaning they are positive values.
        </p>

        <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />

        <h3 class="text-lg font-bold mt-12 mb-3 text-[#253657]">Representing Negative Values</h3>


        <p class="max-w-[135ch] leading-relaxed mt-4">
          For negative numbers, the <span class="font-semibold text-[#2B5DBF]">two’s complement</span> system 
          uses a different method compared to <span class="font-semibold text-[#2B5DBF]">sign-magnitude</span>. 
          Instead of keeping a separate sign bit, the entire binary pattern is modified to represent a negative value. 
          This is done in two steps.
        </p>

    
        <p class="max-w-[135ch] leading-relaxed mt-4">To represent a negative number, start from its positive binary representation and follow the two steps below:</p>

        <div class="bg-[#f8fafc] border border-gray-200 rounded-lg p-5 mt-4 mb-2">
          <ol class="list-decimal pl-6 space-y-3 text-[15px] text-gray-800">
            <li>
              <b>Invert all the bits</b> — change every <code>0</code> to <code>1</code> and every 
              <code>1</code> to <code>0</code>. This reverses the bit pattern of the number.
            </li>
            <li>
              <b>Add 1</b> to the result. After adding 1, the new pattern represents 
              the negative version of the original number in binary.
            </li>
          </ol>
        </div>

        <p class="max-w-[135ch] leading-relaxed mt-4">
          To illustrate, consider representing the unsigned integer <b>−73</b> in an <b>8-bit</b> system. 
        </p>

        <p class="max-w-[135ch] leading-relaxed mt-4">
          We first write its positive form in binary:
        </p>

        <p class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
          +73 → 01001001
        </p>

        <p class="max-w-[135ch] leading-relaxed mt-4">
          Step&nbsp;1: Invert all the bits:
        </p>

        <p class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
          01001001 → 10110110
        </p>

        <p class="max-w-[135ch] leading-relaxed mt-4">
          Step&nbsp;2: Add <b>1</b> to the result:
        </p>

        <p class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
          10110110 + 1 → 10110111
        </p>

        <p class="max-w-[135ch] leading-relaxed mt-4">
          Therefore, the binary representation of <b> −73 </b> in an 8-bit 
          <span class="font-semibold text-[#2B5DBF]"> two’s complement </span> system is:
        </p>

        <p class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
          −73 → 10110111
        </p>

        <p class="max-w-[135ch] leading-relaxed mt-4">
          The leftmost bit is <b>1</b>, indicating that the number is negative. 
        </p>

        <hr class="my-8 border-t mt-12 border-dotted border-[#9DAAC0] w-full" />

        <h2 class="text-lg font-bold mt-12 mb-4 text-[#253657]">Eliminating the Two-Zero Problem</h2>

        <p class="max-w-[135ch] leading-relaxed mt-4">
          One important feature of the 
          <span class="font-semibold text-[#2B5DBF]"> two’s complement </span> system 
          is that it eliminates the issue of having two separate representations of zero, 
          which existed in the <span class="font-semibold text-[#2B5DBF]">sign-magnitude</span> method. 
        </p>

        <p class="max-w-[135ch] leading-relaxed mt-4">
          In two’s complement, this problem disappears naturally. 
          If we try to find the negative of zero using the same two-step process, the result remains unchanged:
        </p>

        <div class="font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
          <pre>+0          →  00000000</pre>
          <pre>Invert bits →  11111111</pre>
          <pre>Add 1       →  00000000</pre>
        </div>

        <p class="max-w-[135ch] leading-relaxed mt-4">
          The final result is still <b>00000000</b>, which means that system has only
          <b> one unique zero</b>, making arithmetic and comparisons much simpler and 
          more consistent.
        </p>


        </div>
`;