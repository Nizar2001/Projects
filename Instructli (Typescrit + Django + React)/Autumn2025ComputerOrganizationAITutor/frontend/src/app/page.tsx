'use client';

export default function Home() {
  return (
    <div className="h-screen w-full bg-gradient-to-bl from-[#f3f3f3] to-[#7b93b8] flex flex-col items-center justify-center py-8 px-4 sm:px-8 lg:px-20 text-center relative">
      <div className="w-full max-w-6xl h-full overflow-y-auto overflow-x-hidden text-black text-left" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style> 

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 mt-20 lg:mt-40" style={{ paddingTop: "100px" }}>
            Welcome to <span className="text-[#36517d]">Instruct<span className="text-[#7b93b8]">li</span></span>
          </h1>

          <p className="w-full text-lg sm:text-xl text-gray-600 pb-8 max-w-4xl mx-auto" style={{ paddingBottom: "200px" }}>
            Your AI-powered tutor and learning platform for Computer Organization and Architecture.
          </p>
        </div>

        {/* About Section */}
        <section className="mb-16">
          <h2 className="text-[#36517d] text-2xl font-bold mb-4">About:</h2>
          <p className="text-base leading-relaxed mb-8">
            Instructli is designed to help guide you through complex diagrams of <b>single-cycle and five-stage pipelined 
            processors</b> using RISC-V Assembly instructions, featuring animations and further in-depth explanations. If 
            any questions arise in relation to those diagrams, feel free to converse and refer to your <b>own specialized 
            AI tutor</b>, as they will always be happy to help. 
          </p>
        
          {/* <div className="w-full sm:w-2/3 border-b border-dashed border-gray-500 mx-auto my-8"></div> */}
       
          <p className="text-base leading-relaxed mb-8">
            <b>Please note:</b> A guest session is <b>automatically created</b> once the page loads, so you may continue 
            <b> without signing in</b>. However, signing in afterward will <b>transfer data</b> such as conversations and summaries 
            to your new account. 
          </p>

          <div className="w-full sm:w-2/3 border-b border-dashed border-gray-500 mx-auto my-12"></div>
        </section>

        {/* Single-Cycle Processor Section */}
        <section className="mb-16">
          <h2 className="text-[#36517d] text-2xl font-bold mb-8">Single-Cycle Processor Diagram Page:</h2>
        
          <div className="flex flex-col lg:flex-row gap-8 items-start mb-10">
            <div className="flex-1 lg:w-1/3 lg:min-w-0"> 
              <p className="text-base leading-relaxed"> 
                To visualize an instruction through the single-cycle processor, you can use the two dropdown menus near the 
                bottom of the page. The one on the left allows you to change the <b>instruction type</b>, while the right 
                one changes the <b>exact instruction</b> based on the type. The <b>current selected instruction</b> is
                displayed in the rectangular textbox right below. 
              </p>
            </div>
            <div className="flex-1 lg:w-2/3">
              <img 
                className="w-full h-auto max-w-full object-contain rounded-lg shadow-sm" 
                src="/images/s1.png" 
                alt="single-cycle selection interface showing dropdown menus for instruction selection"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse gap-8 items-start mb-8">
            <div className="flex-1 lg:w-1/3 lg:min-w-0"> 
              <p className="text-base leading-relaxed"> 
                After selecting an instruction, click on the <b>'Execute Command'</b> text to run the instruction. You should 
                now see the highlighted paths in red, representing which components are being used during the execution of the 
                instruction. If you <b>hover your mouse</b> over certain components, you can view specific information 
                regarding them as well. 
              </p>
            </div>
            <div className="flex-1 lg:w-2/3">
              <img 
                className="w-full h-auto max-w-full object-contain rounded-lg shadow-sm" 
                src="/images/s2.png" 
                alt="single-cycle processor diagram with highlighted execution paths"
              />
            </div>
          </div>
          
          <p className="text-base leading-relaxed mb-8">
            If you wish to change the instruction and execute another, simply select the type and instruction from the 
            dropdowns below and click on the <b>'Execute Command'</b> text again.  
          </p>

          <div className="w-full sm:w-2/3 border-b border-dashed border-gray-500 mx-auto my-12"></div>
        </section>

        {/* 5-Stage Pipelined Processor Section */}
        <section className="mb-16">
          <h2 className="text-[#36517d] text-2xl font-bold mb-8">5-Stage Pipelined Processor Diagram Page:</h2>
        
          <div className="flex flex-col lg:flex-row gap-8 items-start mb-8">
            <div className="flex-1 lg:w-1/3 lg:min-w-0"> 
              <p className="text-base leading-relaxed"> 
                Visualizing instructions on the <b>5-stage pipelined processor diagram</b> is similar to the single-cycle 
                diagram, but instead of executing instructions line by line, you execute them <b>cycle by cycle</b>. From 
                the dropdown menu on the bottom-left, you are presented with four hazard examples to view: <b>data hazards, 
                control hazards, mixed hazard examples, or no hazards</b>.
              </p>
            </div>
            <div className="flex-1 lg:w-2/3">
              <img 
                className="w-full h-auto max-w-full object-contain rounded-lg shadow-sm" 
                src="/images/p1.png" 
                alt="pipeline hazard selection dropdown menu interface"
              />
            </div>
          </div>
        
          <p className="text-base leading-relaxed mb-8">
            After selecting a hazard preset, click on the <b>'Next'</b> text, found near the bottom-right 
            of the page, to run the first cycle of the first instruction. This will light up the paths in the diagram 
            that show which components are being used during the execution of the first cycle of the current instruction 
            (highlighted in grey).
          </p>

          <div className="flex flex-col lg:flex-row-reverse gap-8 items-start mb-8">
            <div className="flex-1 lg:w-1/3 lg:min-w-0"> 
              <p className="text-base leading-relaxed"> 
                On the bottom-left of the diagram, there is a scrollable explanation of each hazard. However, if 
                you <b>hover your mouse</b> over certain components, you can still gain additional information about that 
                component. If a hazard is detected in one of the cycles, the hazard button on the middle-left side of the 
                page will turn <b>red</b>, and you can <b>hover your mouse</b> over it to get a detailed description.
              </p>
            </div>
            <div className="flex-1 lg:w-2/3">
              <img 
                className="w-full h-auto max-w-full object-contain rounded-lg shadow-sm" 
                src="/images/p2.png" 
                alt="pipeline processor diagram showing hazard detection and execution paths"
              />
            </div>
          </div>
         
          <div className="w-full sm:w-2/3 border-b border-dashed border-gray-500 mx-auto my-12"></div>
        </section>

        {/* AI Chatbot Section */}
        <section className="mb-16">
          <h2 className="text-[#36517d] text-2xl font-bold mb-8">AI Chatbot:</h2>
        
          <div className="flex flex-col lg:flex-row gap-8 items-start mb-8">
            <div className="flex-1 lg:w-1/3 lg:min-w-0"> 
              <p className="text-base leading-relaxed"> 
                The AI chatbot is located on the far right of the processor diagrams and is always available to assist 
                with any questions. The chatbot is trained in both single-cycle and pipelined processors with RISC-V 
                Assembly instructions. Clicking on the name of the chat at the top of the chatbot panel gives you a 
                dropdown with the following options: <b>'Rename', 'Summarize', and 'Delete'</b>. 
              </p>
            </div>
            <div className="flex-1 lg:w-2/3">
              <img 
                className="w-full h-auto max-w-full object-contain rounded-lg shadow-sm" 
                src="/images/a1.png" 
                alt="AI chatbot interface showing dropdown menu options"
              />
            </div>
          </div>
        
          <p className="text-base leading-relaxed mb-8">
            For <b>'Summarize:'</b>, the chat will be summarized and stored within the <b>'Chat Summaries'</b> page. 
            Once a conversation has been successfully summarized, a blue notification with the 
            words <b>'summarized'</b> will pop up right beside the chat name. <b>Please note:</b> If you summarize 
            the chat and then delete the chat, the <b>summarization will be deleted as well</b>.
          </p>

          <div className="flex flex-col lg:flex-row-reverse gap-8 items-start mb-8">
            <div className="flex-1 lg:w-1/3 lg:min-w-0"> 
              <p className="text-base leading-relaxed"> 
                If you click on the <b>+</b> icon on the right side of the chatbot panel, you will get another dropdown 
                menu. The topmost option will allow you to create a new chat, while the other options will lead you to
                a history of your <b>previous conversations</b>. If the chatbot is prompted with any additional 
                questions <b>unrelated</b> to processor diagrams, you may be redirected to a more relevant topic instead.
              </p>
            </div>
            <div className="flex-1 lg:w-2/3">
              <img 
                className="w-full h-auto max-w-full object-contain rounded-lg shadow-sm" 
                src="/images/a2.png" 
                alt="AI chatbot showing conversation history and new chat options"
              />
            </div>
          </div>

          <div className="w-full sm:w-2/3 border-b border-dashed border-gray-500 mx-auto my-12"></div>
        </section>

        {/* Chat Summaries Section */}
        <section className="mb-16">
          <h2 className="text-[#36517d] text-2xl font-bold mb-8">Chat Summaries Page:</h2>
        
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 lg:w-1/3 lg:min-w-0"> 
              <p className="text-base leading-relaxed"> 
                The <b>chat summaries page</b> will include <b>summaries and entries</b> of all the conversations 
                you have chosen to save with the chatbot, along with a descriptive title and date. On the top-right, 
                there are two icons: the left one brings up the chatbot and your history, allowing you to continue your 
                conversation, and the right one (trash can) deletes the current summary entry.          
              </p>
            </div>
            <div className="flex-1 lg:w-2/3">
              <img 
                className="w-full h-auto max-w-full object-contain rounded-lg shadow-sm" 
                src="/images/c1.png" 
                alt="Chat summaries page showing saved conversation summaries with titles and dates"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}