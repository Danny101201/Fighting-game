/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable max-len */
function rentangularCollison({ rentangular1, rentangular2 }) {
  return (
    rentangular1.attachedBox.position.x + rentangular1.attachedBox.width >= rentangular2.position.x
    && rentangular1.attachedBox.position.x <= rentangular2.position.x + rentangular2.width
    && rentangular1.attachedBox.position.y + rentangular2.attachedBox.height >= rentangular2.position.y
    && rentangular1.attachedBox.position.y <= rentangular2.position.y + rentangular2.height
  );
}
function drawWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector('#displayText').style.display = 'grid';
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie';
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'player1 win';
  } else {
    document.querySelector('#displayText').innerHTML = 'player2 win';
  }
}
let timer = 60;
let timerId;
function setTimer() {
  if (timer >= 0) {
    timerId = setTimeout(setTimer, 1000);
    document.querySelector('#timer').innerHTML = timer;
    // eslint-disable-next-line no-plusplus
    timer--;
    return;
  }
  if (timer < 0) {
    drawWinner({ player, enemy, timerId });
  }
}
