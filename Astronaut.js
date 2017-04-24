var context = myCanvas.getContext('2d');
var ctxArray = {
  player: {
    model: document.getElementById("astroR"),
    activeLook: "R",
    health: 100,
    score: 0,
    weapon: {
      damageMult: 1,
      damageMultMax: 10},
    x: window.innerWidth/2,
    y: window.innerHeight/2,
    xEnd: 0,
    yEnd: 0,
    width: 48,
    height: 68},
  enemies: [],
  bullets: [],
  powerUps: []};

// Some variables
var leaderboardHost = "https://gist.githubusercontent.com/EdenPlus/d331eabe16e7ffac8c515acf94b561ae/raw/172cc3c593707a1ea71bf055182fb01c2d444901/astronautLeaderboard.txt";

var moveSpeed = 5;
var bulletSpeed = 2;
var breathingRoom = 50;

var w_keyDown = false;
var a_keyDown = false;
var s_keyDown = false;
var d_keyDown = false;

var sUp_keyDown = false;
var sLeft_keyDown = false;
var sDown_keyDown = false;
var sRight_keyDown = false;

var gameManager;
var enemyManager;
var shootManager;

// Shortcuts
var shortcuts = {
  gameScore: document.getElementById("gameScore"),
  endScore: document.getElementById("endScore"),
  healthNum: document.getElementById("healthNum"),
  playerName: "",
  startInterface: document.getElementById("startInterface"),
  gameInterface: document.getElementById("gameInterface"),
  endInterface: document.getElementById("endInterface"),
  leaderboardBody: document.getElementById("leaderboardBody"),
  leaderboardStorage: [],
  w_key: document.getElementById("wIcon"),
  a_key: document.getElementById("aIcon"),
  s_key: document.getElementById("sIcon"),
  d_key: document.getElementById("dIcon"),
  sUp_key: document.getElementById("sUpIcon"),
  sLeft_key: document.getElementById("sLeftIcon"),
  sDown_key: document.getElementById("sDownIcon"),
  sRight_key: document.getElementById("sRightIcon"),
  astroR: document.getElementById("astroR"),
  astroL: document.getElementById("astroL"),
  astroRU: document.getElementById("astroRU"),
  astroRD: document.getElementById("astroRD"),
  astroLU: document.getElementById("astroLU"),
  astroLD: document.getElementById("astroLD"),
  enemy: {
    basic: {
      model: document.getElementById("enemyBasic"), 
      width: 40, 
      height: 40}},
  shots: {
    basic: {
      model: document.getElementById("shotBasic"),
      damage: 10,
      width: 8,
      height: 8}}
}

// Some EventListeners
window.addEventListener("resize", function() {
  resizeCanvas();
});

window.addEventListener("load", function() {
  shortcuts.startInterface.style.display = "none";
  shortcuts.gameInterface.style.display = "none";
  shortcuts.endInterface.style.display = "block";
  getLeaderboard(leaderboardHost, function(text) {
    if (text === null) {
      return '{position: "Error", name: "Error", score="Error"}';
    } else {
      shortcuts.leaderboardStorage = JSON.parse(text);
      retrieveLeaderboard();
    }
  });
});

function start() {
  resizeCanvas();
  shortcuts.startInterface.style.display = "none";
  shortcuts.gameInterface.style.display = "block";
  shortcuts.endInterface.style.display = "none";
  shortcuts.w_key.style.backgroundColor = "grey";
  shortcuts.a_key.style.backgroundColor = "grey";
  shortcuts.s_key.style.backgroundColor = "grey";
  shortcuts.d_key.style.backgroundColor = "grey";
  shortcuts.sUp_key.style.backgroundColor = "grey";
  shortcuts.sLeft_key.style.backgroundColor = "grey";
  shortcuts.sDown_key.style.backgroundColor = "grey";
  shortcuts.sRight_key.style.backgroundColor = "grey";
  if (document.getElementById("playerName").value == "") {
    shortcuts.playerName = "Unnamed";
  }
  else {
    shortcuts.playerName = document.getElementById("playerName").value;
  }
  shortcuts.endScore.innerHTML = "SCORE: 0";
  shortcuts.gameScore.innerHTML = "SCORE: 0";
  ctxArray.bullets = [];
  ctxArray.enemies = [];
  ctxArray.player.health = 100;
  ctxArray.player.score = 0;
  shortcuts.healthNum.value = ctxArray.player.health;
  ctxArray.player.xEnd = ctxArray.player.x + ctxArray.player.width;
  ctxArray.player.yEnd = ctxArray.player.y + ctxArray.player.height;
  gameManager = setInterval(master,20);
  enemyManager = setInterval(enemySpawn,120);
  shootManager = setInterval(shoot,355);
}

function resizeCanvas() {
  myCanvas.width = window.innerWidth;
  myCanvas.height = window.innerHeight;
}

window.addEventListener("keydown", handleKeyDown, true);
window.addEventListener("keyup", handleKeyUp, true);

function handleKeyDown(event) {
  if (event.keyCode == 37)
    sLeft_keyDown = true;
  else if (event.keyCode == 39)
    sRight_keyDown = true;
  if (event.keyCode == 38)
    sUp_keyDown = true;
  else if (event.keyCode == 40)
    sDown_keyDown = true;
  if (event.keyCode == 65)
    a_keyDown = true;
  else if (event.keyCode == 68)
    d_keyDown = true;
  if (event.keyCode == 83)
    s_keyDown = true;
  else if (event.keyCode == 87) 
    w_keyDown = true;
}

function handleKeyUp(event) {
  if (event.keyCode == 37)
    sLeft_keyDown = false;
  else if (event.keyCode == 39)
    sRight_keyDown = false;
  if (event.keyCode == 38)
    sUp_keyDown = false;
  else if (event.keyCode == 40)
    sDown_keyDown = false;
  if (event.keyCode == 65)
    a_keyDown = false;
  else if (event.keyCode == 68)
    d_keyDown = false;
  if (event.keyCode == 83)
    s_keyDown = false;
  else if (event.keyCode == 87) 
    w_keyDown = false;
}

function master() {
  context.clearRect(0, 0, myCanvas.width, myCanvas.height);
  interfaceCheck();
  move();
  bulletTravel();
  enemyTravel();
  clearDeads();
}

function interfaceCheck() {
  if(w_keyDown) {
    shortcuts.w_key.style.backgroundColor = "blue";
  }
  else {
    shortcuts.w_key.style.backgroundColor = "grey";
  }
  if(a_keyDown) {
    shortcuts.a_key.style.backgroundColor = "blue";
  }
  else {
    shortcuts.a_key.style.backgroundColor = "grey";
  }
  if(s_keyDown) {
    shortcuts.s_key.style.backgroundColor = "blue";
  }
  else {
    shortcuts.s_key.style.backgroundColor = "grey";
  }
  if(d_keyDown) {
    shortcuts.d_key.style.backgroundColor = "blue";
  }
  else {
    shortcuts.d_key.style.backgroundColor = "grey";
  }
  if(sUp_keyDown) {
    shortcuts.sUp_key.style.backgroundColor = "blue";
  }
  else {
    shortcuts.sUp_key.style.backgroundColor = "grey";
  }
  if(sLeft_keyDown) {
    shortcuts.sLeft_key.style.backgroundColor = "blue";
    if (sUp_keyDown) {
      ctxArray.player.model = shortcuts.astroLU;
      ctxArray.player.activeLook = "LU";
    }
    else if (sDown_keyDown) {
      ctxArray.player.model = shortcuts.astroLD;
      ctxArray.player.activeLook = "LD";
    }
    else {
      ctxArray.player.model = shortcuts.astroL;
      ctxArray.player.activeLook = "L";
    }
  }
  else {
    shortcuts.sLeft_key.style.backgroundColor = "grey";
  }
  if(sDown_keyDown) {
    shortcuts.sDown_key.style.backgroundColor = "blue";
  }
  else {
    shortcuts.sDown_key.style.backgroundColor = "grey";
  }
  if(sRight_keyDown) {
    shortcuts.sRight_key.style.backgroundColor = "blue";
    if (sUp_keyDown) {
      ctxArray.player.model = shortcuts.astroRU;
      ctxArray.player.activeLook = "RU";
    }
    else if (sDown_keyDown) {
      ctxArray.player.model = shortcuts.astroRD;
      ctxArray.player.activeLook = "RD";
    }
    else {
      ctxArray.player.model = shortcuts.astroR;
      ctxArray.player.activeLook = "R";
    }
  }
  else {
    shortcuts.sRight_key.style.backgroundColor = "grey";
  }
}

function move() {
  if (w_keyDown) {
    if(ctxArray.player.y - 1 >= 0 && ctxArray.player.yEnd - 1 >= 0) {
      ctxArray.player.y--;
      ctxArray.player.yEnd--;
    }
  }
  if (a_keyDown) {
    if(ctxArray.player.x - 1 >= 0 && ctxArray.player.xEnd - 1 >= 0) {
      ctxArray.player.x--;
      ctxArray.player.xEnd--;
    }
  }
  if (s_keyDown) {
    if(ctxArray.player.y + 1 <= myCanvas.height && ctxArray.player.yEnd + 1 <= myCanvas.height) {
      ctxArray.player.y++;
      ctxArray.player.yEnd++;
    }
  }
  if (d_keyDown) {
    if(ctxArray.player.x + 1 <= myCanvas.width && ctxArray.player.xEnd + 1 <= myCanvas.width) {
      ctxArray.player.x++;
      ctxArray.player.xEnd++;
    }
  }
  context.drawImage(ctxArray.player.model, ctxArray.player.x, ctxArray.player.y, ctxArray.player.width, ctxArray.player.height);
}

function shoot() {
  if((sRight_keyDown || sLeft_keyDown) || (sUp_keyDown || sDown_keyDown)) {
    var startX = 0;
    var startY = 0;
    switch (ctxArray.player.activeLook) {
      case "R":
        startX = ctxArray.player.x + ctxArray.player.width;
        startY = ctxArray.player.y + (ctxArray.player.height / 2) - 3;
        break;
      case "L":
        startX = ctxArray.player.x - 8;
        startY = ctxArray.player.y + (ctxArray.player.height / 2) - 3;
        break;
      case "RU":
        startX = ctxArray.player.x + ctxArray.player.width;
        startY = ctxArray.player.y + (ctxArray.player.height / 4) - 5;
        break;
      case "RD":
        startX = ctxArray.player.x + ctxArray.player.width;
        startY = ctxArray.player.y + (ctxArray.player.height / 2) + 11;
        break;
      case "LU":
        startX = ctxArray.player.x - 8;
        startY = ctxArray.player.y + (ctxArray.player.height / 4) - 5;
        break;
      case "LD":
        startX = ctxArray.player.x - 8;
        startY = ctxArray.player.y + (ctxArray.player.height / 2) + 11;
        break;
      default:
        break;
                                      };
    ctxArray.bullets.push({model: shortcuts.shots.basic.model,
                           x: startX,
                           y: startY,
                           xEnd: startX + shortcuts.shots.basic.width,
                           yEnd: startY + shortcuts.shots.basic.height,
                           width: shortcuts.shots.basic.width,
                           height: shortcuts.shots.basic.height,
                           damage: (shortcuts.shots.basic.damage * ctxArray.player.damageMult),
                           toDelete: false,
                           direction: ctxArray.player.activeLook});
  }
}

function bulletTravel() {
  for(var i = 0; i < ctxArray.bullets.length; i++) {
    var currentBullet_bulletTravel = ctxArray.bullets[i];
    if(currentBullet_bulletTravel.x<0 || currentBullet_bulletTravel.xEnd>myCanvas.width) {
      currentBullet_bulletTravel.toDelete = true;
    }
    else if(currentBullet_bulletTravel.y<0 || currentBullet_bulletTravel.yEnd>myCanvas.height) {
      currentBullet_bulletTravel.toDelete = true;
    }
    else {
      switch (currentBullet_bulletTravel.direction) {
        case "R":
          currentBullet_bulletTravel.x += bulletSpeed;
          currentBullet_bulletTravel.xEnd += bulletSpeed;
          break;
        case "RU":
          currentBullet_bulletTravel.x += bulletSpeed;
          currentBullet_bulletTravel.y -= bulletSpeed;
          currentBullet_bulletTravel.xEnd += bulletSpeed;
          currentBullet_bulletTravel.yEnd -= bulletSpeed;
          break;
        case "RD":
          currentBullet_bulletTravel.x += bulletSpeed;
          currentBullet_bulletTravel.y += bulletSpeed;
          currentBullet_bulletTravel.xEnd += bulletSpeed;
          currentBullet_bulletTravel.yEnd += bulletSpeed;
          break;
        case "L":
          currentBullet_bulletTravel.x -= bulletSpeed;
          currentBullet_bulletTravel.xEnd -= bulletSpeed;
          break;
        case "LU":
          currentBullet_bulletTravel.x -= bulletSpeed;
          currentBullet_bulletTravel.y -= bulletSpeed;
          currentBullet_bulletTravel.xEnd -= bulletSpeed;
          currentBullet_bulletTravel.yEnd -= bulletSpeed;
          break;
        case "LD":
          currentBullet_bulletTravel.x -= bulletSpeed;
          currentBullet_bulletTravel.y += bulletSpeed;
          currentBullet_bulletTravel.xEnd -= bulletSpeed;
          currentBullet_bulletTravel.yEnd += bulletSpeed;
          break;
        default:
          break;
                                                  }
      context.drawImage(currentBullet_bulletTravel.model, currentBullet_bulletTravel.x, currentBullet_bulletTravel.y, currentBullet_bulletTravel.width, currentBullet_bulletTravel.height);
    }
  }
}

function enemySpawn() {
  if (ctxArray.enemies.length < 10) {
    var startX = Math.floor(Math.random() * (myCanvas.width-45));
    var startXEnd = startX + shortcuts.enemy.basic.width;
    var startY = Math.floor((Math.random() * (myCanvas.height-45)));
    var startYEnd = startY + shortcuts.enemy.basic.height;
    while (checkHitboxes({x: startX, y: startY, xEnd: startXEnd, yEnd: startYEnd}, {x: (ctxArray.player.x - breathingRoom), y: (ctxArray.player.y - breathingRoom), xEnd: (ctxArray.player.xEnd + breathingRoom), yEnd: (ctxArray.player.yEnd + breathingRoom)})) {
      var startX = Math.floor(Math.random() * (myCanvas.width-45));
      var startXEnd = startX + shortcuts.enemy.basic.width;
      var startY = Math.floor((Math.random() * (myCanvas.height-45)));
      var startYEnd = startY + shortcuts.enemy.basic.height;
    }
    ctxArray.enemies.push({name: "basic",
                           model: shortcuts.enemy.basic.model, 
                           health: 20,
                           damage: 10, 
                           scoreValue: 10,
                           playerKilled: false,
                           speedX: 1, 
                           speedY: 1, 
                           x: startX, 
                           y: startY, 
                           xEnd: startXEnd,
                           yEnd: startYEnd,
                           width: shortcuts.enemy.basic.width, 
                           height: shortcuts.enemy.basic.height});
  }
}

function enemyTravel() {
  enemyTravelLogic:
  for(var a = 0; a < ctxArray.enemies.length; a++) {
    var currentEnemy_enemyTravel = ctxArray.enemies[a];
    bulletLogic:
    for (var b = 0; b < ctxArray.bullets.length; b++) {
      var currentBullet_enemyTravel = ctxArray.bullets[b];
      if (currentBullet_enemyTravel.toDelete) {
        continue bulletLogic;
      }
      if (checkHitboxes(currentEnemy_enemyTravel, currentBullet_enemyTravel)) {
        currentEnemy_enemyTravel.health -= currentBullet_enemyTravel.damage;
        currentBullet_enemyTravel.damage = 0;
        currentBullet_enemyTravel.toDelete = true;
        ctxArray.player.score += currentEnemy_enemyTravel.scoreValue;
        console.log(ctxArray.player.score);
        shortcuts.gameScore.innerHTML = "SCORE: " + ctxArray.player.score;
        if (currentEnemy_enemyTravel.health <= 0) {
          continue enemyTravelLogic;
        }
      }
    }
    // Enemy attack logic
    if (checkHitboxes(currentEnemy_enemyTravel, ctxArray.player)) {
      if(currentEnemy_enemyTravel.health > 0) {
        ctxArray.player.health -= currentEnemy_enemyTravel.damage;
        shortcuts.healthNum.value = ctxArray.player.health;
        currentEnemy_enemyTravel.health = 0;
        if (ctxArray.player.health <= 0) {
          gameOver();
        }
      }
    }
    else {
      context.drawImage(currentEnemy_enemyTravel.model, currentEnemy_enemyTravel.x, currentEnemy_enemyTravel.y, currentEnemy_enemyTravel.width, currentEnemy_enemyTravel.height);
      // Enemy movement logic
      if( currentEnemy_enemyTravel.x<0 || currentEnemy_enemyTravel.xEnd>myCanvas.width) currentEnemy_enemyTravel.speedX=-currentEnemy_enemyTravel.speedX;
      if( currentEnemy_enemyTravel.y<0 || currentEnemy_enemyTravel.yEnd>myCanvas.height) currentEnemy_enemyTravel.speedY=-currentEnemy_enemyTravel.speedY;
      currentEnemy_enemyTravel.x+=currentEnemy_enemyTravel.speedX;
      currentEnemy_enemyTravel.xEnd+=currentEnemy_enemyTravel.speedX;
      currentEnemy_enemyTravel.y+=currentEnemy_enemyTravel.speedY;
      currentEnemy_enemyTravel.yEnd+=currentEnemy_enemyTravel.speedY;
    }
  }
}

function clearDeads() {
  var newEnemies = ctxArray.enemies.filter(function(enemy) {
    return enemy.health > 0;
  });
  ctxArray.enemies = newEnemies;

  var newBullets = ctxArray.bullets.filter(function(bullet) {
    return !bullet.toDelete;
  });
  ctxArray.bullets = newBullets;
}

function gameOver() {
  clearInterval(gameManager);
  clearInterval(enemyManager);
  clearInterval(shootManager);
  shortcuts.endScore.innerHTML = "SCORE: " + ctxArray.player.score;
  /*leaderboardCheck: for (var a = 0; a < shortcuts.leaderboardStorage.length; a++) {
    if (ctxArray.player.score >= shortcuts.leaderboardStorage[a].score) {
      shortcuts.leaderboardStorage.splice(a, 0, ({position: a, name: shortcuts.playerName, score: ctxArray.player.score}))
      if (shortcuts.leaderboardStorage.length >= 100) {
        shortcuts.leaderboardStorage.pop();
      }
      
      break leaderboardCheck;
    }
  }*/
  retrieveLeaderboard();
  shortcuts.startInterface.style.display = "none";
  shortcuts.gameInterface.style.display = "none";
  shortcuts.endInterface.style.display = "block";
}

function checkHitboxes(attacker, defender) {
  // If one rectangle is on left side of other
  if (attacker.x > defender.xEnd || defender.x > attacker.xEnd) {
    return false;
  }

  // If one rectangle is above other
  if (attacker.y > defender.yEnd || defender.y > attacker.yEnd) {
    return false;
  }

  return true;
}

function retrieveLeaderboard() {
  shortcuts.leaderboardBody.innerHTML = "";
  for (var a = 0; a < shortcuts.leaderboardStorage.length; a++) {
    shortcuts.leaderboardBody.innerHTML += "<div>#" + shortcuts.leaderboardStorage[a].position + " | " + shortcuts.leaderboardStorage[a].name + " | " + shortcuts.leaderboardStorage[a].score + "</div>";
  }
}

function getLeaderboard(url, doneCallback) {
  var xhr;

  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = handleStateChange;
  xhr.open("GET", url, true);
  xhr.send();

  function handleStateChange() {
    if (xhr.readyState === 4) {
      doneCallback(xhr.status == 200 ? xhr.responseText : null);
    }
  }
}

function setLeaderboard(url, doneCallback) {
  var xhr;

  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = handleStateChange;
  xhr.open("GET", url, true);
  xhr.send();

  function handleStateChange() {
    if (xhr.readyState === 4) {
      doneCallback(xhr.status == 200 ? xhr.responseText : null);
    }
  }
}
