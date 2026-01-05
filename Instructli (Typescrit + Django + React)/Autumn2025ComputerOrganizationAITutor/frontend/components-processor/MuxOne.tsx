export default function RegMemory() {
  return (
    <div className="text-black w-[35px] h-[120px] border rounded-[20px] flex flex-col justify-between p-1">
      <div className="w-[60%]">
        <span>0</span>
      </div>
      
      <div className="flex flex-col justify-between">
        <span className="text-right">M</span>
        <span className="text-right">U</span>
        <span className="text-right">X</span>
      </div>    

      <span>1</span>
    </div>
  );
}