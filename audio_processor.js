function drawWaveForm(data) {
  data = [...data];
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const max = data.reduce((a, b) => Math.max(a, b));
  if (max > 155) {
    ctx.lineWidth = 2;
    const opac = Math.min(max / 400, 1);
    let c = 255 - ((max - 165) / 20) * 255;
    ctx.strokeStyle = 'rgb(' + 0 + ', ' + 0 + ', ' + 0 + ')';
    ctx.beginPath();
    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = data[i] / 128.0;
      const y = v * canvas.height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }
}