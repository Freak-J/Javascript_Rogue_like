import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { Player, Monster } from './class.js';

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 정보 HP: ${player.hp} Attack: ${player.minAttack}-${player.maxAttack} `,
    ) +
    chalk.redBright(
      `| 몬스터 정보 HP: ${monster.hp} Attack: ${monster.Attack} `,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];
  let addHp = 50;
  let count = 1;

  // 스테이지 클리어시 체력회복, player 능력치 random 상승
  if (stage >= 2) {
    logs.push(chalk.greenBright(`체력이 ${addHp} 회복되었습니다.`))
    player.hp += addHp;
    const hppp = Math.floor(Math.random() * (51 - 5)) + 5;
    player.hp += hppp;
    const atpp = Math.floor(Math.random() * (11 - 1)) + 1;
    player.maxAttack += atpp;
    player.minAttack += atpp;
    logs.push(chalk.greenBright(`플레이어의 체력이 ${hppp}, 공격력이 ${atpp}만큼 상승하셨습니다.`));
  }

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    // 몬스터의 체력이 0이 됐을때 battle 종료
    if (monster.hp <= 0) {
      return 0;
    }
    console.log(
      chalk.green(
        `\n1. 공격한다 | 2. 연속공격(50%) | 3. 방어(40%) | 4. 흡성대법(20%) | 5. 도망치기.(10%) | `,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 선택지 확률 (while 반복문 돌때마다 리셋)
    const random = Math.floor(Math.random() * 10 + 1);

    // 플레이어의 선택에 따라 다음 행동 처리
    switch (choice) {

      case '1': // 공격한다
        player.attack(player, monster, logs, count);
        monster.attack(player, monster, logs, count);
        break;

      case '2': // 연속공격(50%)
        if (random >= 1 && random <= 5) {
          player.doubleAtk(player, monster, logs, count);
        } else {
          logs.push(chalk.red(`연속공격에 실패하셨습니다..`))
        }
        monster.attack(player, monster, logs, count);
        break;

      case '3': // 방어(40%)
        if (random >= 1 && random <= 4) {
          player.defense(player, monster, logs, count);
        } else {
          logs.push(chalk.red(`방어에 실패하셨습니다..`));
          monster.attack(player, monster, logs, count);
        }
        break;

      case '4': // 흡성대법(20%)
        if(monster.Attack > 5){
          if (random >= 1 && random <= 2) {
            player.Drain_Life(player, monster, logs, count);
            monster.attack(player, monster, logs, count);
          } else {
            logs.push(chalk.red(`흡성대법에 실패하셨습니다..`));
            monster.attack(player, monster, logs, count);
          } 
        } else {
          logs.push(chalk.red(`더 이상 흡수할 수 없습니다!!!`));
          monster.attack(player, monster, logs, count);
        }
        break;

      case '5': // 도망친다(10%)
        if (random === 1) {
          return 0;
        } else {
          logs.push(chalk.red(`도망에 실패하셨습니다..`))
          monster.attack(player, monster, logs, count);
          break;
        }
    }
    // 턴 count
    count++
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    // monster instance 에 random값을 받아서 monster 능력치 랜덤 상승 stage도 받아서 고정능력치 상승
    let random = Math.floor(Math.random() * (6 - 1)) + 1;
    const monster = new Monster(stage, random);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건

    // player의 체력이 0이 됐을때
    if (player.hp <= 0) {
      console.log(chalk.redBright(`패배하셨습니다!`));
      const choice = readlineSync.question('다시시작하시겠습니까? 1 : 예, 2: 아니오');
      switch (choice) {
        case '1':
          startGame();
        case '2':
          return 0;
      }
    }

    stage++;

    // 10stage의 monster의 체력이 0이 됐을때 게임 클리어
    if (monster.hp <= 0 && stage > 10) {
      console.log(chalk.greenBright(`Stage를 모두 클리어하셨습니다!`));
      const choice = readlineSync.question('다시시작하시겠습니까? 1 : 예, 2: 아니오');
      switch (choice) {
        case '1':
          startGame();
        case '2':
          return 0;
      }
    }
  }
}
