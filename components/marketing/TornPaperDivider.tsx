import Image from "next/image";

export function TornPaperDivider() {
  return (
    <div
      className="w-full relative overflow-hidden"
      style={{ height: "40px", marginTop: "-1px", marginBottom: "-1px" }}
    >
      <Image
        src="/assets/torn-top.png"
        alt=""
        width={1200}
        height={40}
        className="w-full h-full object-cover object-top block"
        style={{ display: "block" }}
      />
    </div>
  );
}
