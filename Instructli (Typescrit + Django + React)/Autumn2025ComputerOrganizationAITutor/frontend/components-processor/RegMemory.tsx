export default function RegMemory() {
  return (
    <div className="text-black w-[130px] h-[230px] border flex flex-col justify-between p-1">
      <div className="flex justify-between">
        <span>Read register 1</span>
        <span className="text-right">Read data 1</span>
      </div>

      <div className="w-[60%]">
        <span>Read register 2</span>
      </div>

      <span className="text-center">Registers</span>
      
      <div className="flex justify-between">
        <span>Write register</span>
        <span className="text-right">Read data 2</span>
      </div>    

      <div className="w-[40%]">
        <span>Write data</span>
      </div>
    </div>
  );
}