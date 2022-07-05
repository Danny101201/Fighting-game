/* eslint-disable default-case */
const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: './img/background.png',
});
const shop = new Sprite({
  position: {
    x: 620,
    y: 128,
  },
  imgSrc: './img/shop.png',
  scale: 2.75,
  framermax: 6,
});
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 215,
    y: 250,
  },
  framermax: 8,
  imgSrc: './img/samuraiMack/Idle.png',
  scale: 2.5,
  sprites: {
    idle: {
      imgSrc: './img/samuraiMack/Idle.png',
      framermax: 8,
    },
    run: {
      imgSrc: './img/samuraiMack/Run.png',
      framermax: 8,
    },
    jump: {
      imgSrc: './img/samuraiMack/Jump.png',
      framermax: 2,
    },
    fall: {
      imgSrc: './img/samuraiMack/Fall.png',
      framermax: 2,
    },
    Attack1: {
      imgSrc: './img/samuraiMack/Attack1.png',
      framermax: 6,
    },
    TakeHit: {
      imgSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      framermax: 4,
    },
    Death: {
      imgSrc: './img/samuraiMack/Death.png',
      framermax: 6,
    },
  },
  attachedBox: {
    offset: {
      x: -50,
      y: 20,
    },
    width: 200,
    height: 50,
  },
});
const enemy = new Fighter({
  position: {
    x: 950,
    y: 150,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 220,
    y: 265,
  },
  framermax: 4,
  imgSrc: './img/kenji/Idle.png',
  scale: 2.5,
  sprites: {
    idle: {
      imgSrc: './img/kenji/Idle.png',
      framermax: 4,
    },
    run: {
      imgSrc: './img/kenji/Run.png',
      framermax: 8,
    },
    jump: {
      imgSrc: './img/kenji/Jump.png',
      framermax: 2,
    },
    fall: {
      imgSrc: './img/kenji/Fall.png',
      framermax: 2,
    },
    Attack1: {
      imgSrc: './img/kenji/Attack1.png',
      framermax: 4,
    },
    TakeHit: {
      imgSrc: './img/kenji/Take hit.png',
      framermax: 3,
    },
    Death: {
      imgSrc: './img/kenji/Death.png',
      framermax: 7,
    },
  },
  attachedBox: {
    offset: {
      x: 150,
      y: 25,
    },
    width: 200,
    height: 50,
  },
});
const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

setTimer();

function animate() {
  c.fillStyle = 'rgb(0,0,0)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = 'rgb(0,0,0)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  // draw bg
  background.update();
  shop.update();
  player.update();
  enemy.update();
  requestAnimationFrame(animate);

  // player move

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -Fighter.moveSpeed;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = Fighter.moveSpeed;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
    player.velocity.x = 0;
  }
  // player jump
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }
  // enemy move
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -Fighter.moveSpeed;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = Fighter.moveSpeed;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
    enemy.velocity.x = 0;
  }
  // enemy jump
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  // detect for collisions with player
  if (
    rentangularCollison({
      rentangular1: player,
      rentangular2: enemy,
    })
    && player.isAttack
    && player.framCurrent === 4
  ) {
    player.isAttack = false;
    enemy.takeHit()
    gsap.to('#enemyHealth', {
      width: `${enemy.health}%`
    })
  }
  // if player misses
  if (
    player.isAttack
    && player.framCurrent === 4
  ) {
    player.isAttack = false;
  }

  // detect for collisions with enemy
  if (
    // eslint-disable-next-line no-undef
    rentangularCollison({
      rentangular1: enemy,
      rentangular2: player,
    })
    && enemy.isAttack
    && enemy.framCurrent === 2
  ) {
    enemy.isAttack = false;
    player.takeHit()
    gsap.to('#playerHealth', {
      width: `${player.health}%`
    })
  }
  // if enemy misses
  if (
    enemy.isAttack
    && enemy.framCurrent === 4
  ) {
    enemy.isAttack = false;
  }
  // check wind
  if (player.health <= 0 || enemy.health <= 0) {
    // eslint-disable-next-line no-undef
    drawWinner({ player, enemy, timerId });
  }
}
animate();

// eslint-disable-next-line no-restricted-globals
addEventListener('keydown', (e) => {
  // eslint-disable-next-line default-case
  if (!player.death) {

    switch (e.key) {
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'w':
        player.velocity.y = -20;
        break;
      case ' ':
        player.Attack();
        break;
    }
  }

  if (!enemy.death) {
    switch (e.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        enemy.velocity.y = -20;
        break;
      case 'ArrowDown':
        enemy.Attack();
        break;
    }
  }
});
// eslint-disable-next-line no-restricted-globals
addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }
  switch (e.key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
  }
});
// addEventListener('load', () => {
//   document.querySelector('.loadingPage').classList.add('hidden')
//   setTimeout(() => {
//     document.querySelector('.loadingPage').style.display = 'none'
//   }, 2000)
// })
