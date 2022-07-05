/* eslint-disable lines-between-class-members */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
class Sprite {
  constructor({
    position, imgSrc, scale = 1, framermax = 1, offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.img = new Image();
    this.img.src = imgSrc;
    this.scale = scale;
    this.framermax = framermax;
    this.framCurrent = 0;
    this.frameHold = 0;
    this.frameElasped = 5;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.img,
      this.framCurrent * (this.img.width / this.framermax),
      0,
      this.img.width / this.framermax,
      this.img.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.img.width / this.framermax) * this.scale,
      this.img.height * this.scale,
    );
  }

  animateFrame() {
    this.frameHold++;
    if (this.frameHold % this.frameElasped === 0) {
      if (this.framCurrent < this.framermax - 1) {
        this.framCurrent += 1;
      } else {
        this.framCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrame();
  }
}
class Fighter extends Sprite {
  static gravity = 0.9;

  static moveSpeed = 8;

  constructor({
    position,
    imgSrc, scale,
    framermax, velocity, offset = { x: 0, y: 0 }, sprites,
    attachedBox = {
      offset: { x: 0, y: 0 }, width: undefined, height: undefined,
    },
  }) {
    super({
      position,
      imgSrc,
      scale,
      framermax,
      offset,
    });
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.isAttack = false;
    this.lastKey = '';
    this.death = false
    this.attachedBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attachedBox.offset,
      width: attachedBox.width,
      height: attachedBox.height,
    };
    this.health = 100;
    this.sprites = sprites;
    for (const sprite in this.sprites) {
      sprites[sprite].img = new Image();
      sprites[sprite].img.src = sprites[sprite].imgSrc;
    }
  }
  // draw() {
  //   c.fillStyle = this.color
  //   c.fillRect(this.position.x, this.position.y, this.width, this.height)

  //   //Attack now
  //   if (this.isAttack) {
  //     c.fillStyle = 'green'
  //     c.fillRect(this.attachedBox.position.x, this.attachedBox.position.y, this.attachedBox.width, this.attachedBox.height)
  //   }
  // }
  update() {
    this.draw();
    if (!this.death) this.animateFrame();
    // draw attackBox
    // c.fillRect(this.attachedBox.position.x, this.attachedBox.position.y, this.attachedBox.width, this.attachedBox.height)
    // draw modal
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // change attackBox
    this.attachedBox.position.x = this.position.x - this.attachedBox.offset.x;
    this.attachedBox.position.y = this.position.y - this.attachedBox.offset.y;

    if (this.position.y + this.height + this.velocity.y > canvas.height) {
      this.velocity.y = 0;
      this.position.y = 427;
    } else {
      this.velocity.y += Fighter.gravity;
    }
  }

  Attack() {
    this.isAttack = true;
    this.switchSprite('Attack1');
    setTimeout(() => {
      this.isAttack = false;
    }, 1000);
  }
  takeHit() {
    this.health -= 20
    if (this.health > 0) {
      this.switchSprite('TakeHit')
    } else {
      this.switchSprite('Death')
    }
  }
  switchSprite(sprite) {
    if (!this.sprites.hasOwnProperty(sprite)) return;
    if (this.img === this.sprites.Death.img) {
      if (this.framCurrent === this.sprites.Death.framermax - 1) {
        this.death = true
      }
      return
    }
    if (this.img === this.sprites.Attack1.img && this.framCurrent < this.sprites.Attack1.framermax - 1) return;
    if (this.img === this.sprites.TakeHit.img && this.framCurrent < this.sprites.TakeHit.framermax - 1) return;
    this.img = this.sprites[sprite].img;
    if (this.framermax !== this.sprites[sprite].framermax) {
      this.framermax = this.sprites[sprite].framermax;
      this.framCurrent = 0;
    }
  }
}
