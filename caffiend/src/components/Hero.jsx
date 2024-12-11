export default function Hero() {
  return (
    <>
      <h1>
        为咖啡<abbr title="狂热爱好者或痴迷者">发烧友</abbr>设计的咖啡追踪工具！
      </h1>
      <div className="benefits-list">
        <h3 className="font-bolder">
          试试 <span className="text-gradient">Caffiend</span>，并开始...
        </h3>
        <p>✅ 追踪每杯咖啡</p>
        <p>✅ 测量你的血液咖啡因含量</p>
        <p>✅ 计算和量化你的咖啡消耗</p>
      </div>
      <div className="card info-card">
        <div>
          <i className="fa-solid fa-circle-info"></i>
          <h3>你知道吗...</h3>
        </div>
        <h5>咖啡因的半衰期大约是 5 小时？</h5>
        <p>
          这意味着在 5
          小时后，你摄入的一半咖啡因仍然在你的体内，保持你更长时间的清醒！
          所以如果你喝了一杯含有 200 毫克咖啡因的咖啡，5 小时后，你体内仍有大约
          100 毫克的咖啡因。
        </p>
      </div>
    </>
  );
}
