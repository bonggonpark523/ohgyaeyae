
### 수정된 game.js

```javascript
class SlotMachine {
  constructor() {
    this.parts = ['eyes', 'nose', 'mouth'];
    this.currentPart = 0;
    this.selections = {};
    this.intervals = {};
    this.init();
  }

  init() {
    this.parts.forEach(part => {
      const btn = document.querySelector(`[data-part="${part}"]`);
      btn.addEventListener('click', () => this.toggleSlot(part));
    });
  }

  toggleSlot(part) {
    const btn = document.querySelector(`[data-part="${part}"]`);
    
    if (btn.textContent === 'Démarrer') {
        this.startSlot(part);
        btn.textContent = 'Pause';
    } else {
        clearInterval(this.intervals[part]);
        
        const arrow = document.querySelector(`#${part}-row .arrow`);
        const arrowRect = arrow.getBoundingClientRect();
        const arrowX = arrowRect.left;
        
        const images = document.querySelectorAll(`#${part}-row img`);
        let minDistance = Infinity;
        let selectedIndex = 0;
        
        images.forEach((img, index) => {
            const imgRect = img.getBoundingClientRect();
            const imgCenterX = imgRect.left + (imgRect.width / 2);
            const distance = Math.abs(arrowX - imgCenterX);
            
            if (distance < minDistance) {
                minDistance = distance;
                selectedIndex = index;
            }
        });
        
        const selectedImg = images[selectedIndex];
        const imgRect = selectedImg.getBoundingClientRect();
        
        if (arrowX < imgRect.left || arrowX > imgRect.right) {
            const newPosition = imgRect.left + (imgRect.width / 2);
            arrow.style.left = `${newPosition}px`;
        }
        
        this.selections[part] = selectedImg.src;
        
        btn.textContent = 'Fin';
        btn.disabled = true;
        
        const allComplete = this.parts.every(p => {
            const button = document.querySelector(`[data-part="${p}"]`);
            return button.textContent === 'Fin';
        });
        
        if (allComplete) {
            setTimeout(() => this.showResult(), 1000);
        }
    }
  }

  startSlot(part) {
    const arrow = document.querySelector(`#${part}-row .arrow`);
    const imageWidth = 150;
    const gap = -3;
    let fullWidth, startPosition, moveSpeed;

    if (part === 'eyes') {
        startPosition = -160;
        fullWidth = (imageWidth + gap) * 6;
        moveSpeed = 88;
    } else if (part === 'mouth') {
        startPosition = -200;
        fullWidth = (imageWidth + gap) * 6;
        moveSpeed = 88;
    } else {
        startPosition = 60;
        fullWidth = (imageWidth + gap) * 4.5;
        moveSpeed = 65;
    }
    
    arrow.style.left = `${startPosition}px`;
    
    let position = startPosition;
    let direction = 1;
    
    this.intervals[part] = setInterval(() => {
      position += moveSpeed * direction;
      
      if (position >= fullWidth) {
        position = fullWidth;
        direction = -1;
      } else if (position <= startPosition) {
        position = startPosition;
        direction = 1;
      }
      
      arrow.style.left = `${position}px`;
    }, 30);
  }

  showResult() {
    document.getElementById('slot-machine').style.display = 'none';
    const resultSection = document.getElementById('result');
    resultSection.style.display = 'block';
    
    const combinedFace = document.querySelector('.combined-face');
    combinedFace.style.overflow = 'visible';
    
    combinedFace.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%;">
        <img src="${this.selections.eyes}" alt="눈" style="flex: 1; margin: 0; padding: 0; transform: translate(-120px, -10pt) scale(1.3);">
        <img src="${this.selections.nose}" alt="코" style="flex: 1; margin: 0; padding: 0; transform: translate(-120px, -20pt) scale(1.3);">
        <img src="${this.selections.mouth}" alt="" style="flex: 1; margin: 0; padding: 0; transform: translate(-120px, -5pt) scale(1.05);">
      </div>
    `;

    const leftBubble = document.querySelector('.left-bubble');
    const rightBubble = document.querySelector('.right-bubble');
    const character = document.getElementById('character');
    const restartBtn = document.getElementById('restart-btn');
    
    leftBubble.style.opacity = '0';
    rightBubble.style.opacity = '0';
    character.style.opacity = '0';
    restartBtn.style.display = 'none';
    restartBtn.style.opacity = '0';

    setTimeout(() => {
        leftBubble.style.opacity = '1';
    }, 1000);

    setTimeout(() => {
        character.style.opacity = '1';
    }, 2000);

    setTimeout(() => {
        rightBubble.style.opacity = '1';
        
        const messages = [
            'Qu\'est-ce que j\'ai fait de mal?',
            'Pourquoi tu fais ça?',
            'Pourquoi cette expression?',
            'Y a-t-il un problème?',
            'Tu es un peu bizarre.'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        rightBubble.textContent = randomMessage;
        
        setTimeout(() => {
            restartBtn.style.display = 'flex';
            restartBtn.style.opacity = '1';
        }, 1000);
    }, 3000);
  }
}

// 게임 시작
window.addEventListener('DOMContentLoaded', () => {
  new SlotMachine();
});
```
