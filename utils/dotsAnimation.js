function startDotsAnimation(text, speed) {
  let i = 0;
  const animationId = setInterval(() => {
    console.log(text.repeat(i++));
    if (i === 5) i = 0;
  }, speed);
  return animationId;
}

function stopDotsAnimation(animationId) {
  clearInterval(animationId);
}

export { startDotsAnimation, stopDotsAnimation };
