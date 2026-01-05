export default function RegMemory() {
  return (
    <div className="text-black w-[100px] h-[200px] border flex flex-col justify-between p-1">
      <span></span>  
      <span></span>
      <div className="flex justify-between">
        <span>Address</span>
        <span className="text-right">Read data</span>
      </div>

      <div className="flex justify-center">
        <span className="text-center w-[50%]">Data memory</span>
      </div>
      
      <div className="w-[40%]">
        <span>Write data</span>
      </div>
    </div>
  );
}