import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.Attack = 10;
  }

  takedamage(monster) {
    this.hp -= monster.Attack;
  }

  // 플레이어의 공격
  attack(player, monster, logs, count) {
    monster.takedamage(player);
    logs.push(chalk.greenBright(`[${count}] 몬스터에게 ${player.Attack}의 피해를 입혔습니다.`));
  }

  // 연속공격
  doubleAtk(player, monster, logs, count) {
    monster.takedamage(player);
    monster.takedamage(player);
    logs.push(chalk.greenBright(`[${count}] 연속공격 성공 !!`));
    logs.push(chalk.greenBright(`[${count}] 몬스터에게 ${player.Attack * 2}의 피해를 입혔습니다.`));
  }

  // 방어
  defense(player, monster, logs, count) {
    logs.push(chalk.greenBright(`[${count}] 방어 성공!!`));
    this.attack(player, monster, logs, count);
  }
}

class Monster {
  constructor(stage) {
    this.hp = 100 + (stage * 10);
    this.Attack = 3 + (stage * 2);
  }

  takedamage(player) {
    this.hp -= player.Attack;
  }

  // 몬스터의 공격
  attack(player, monster, logs, count) {
    player.takedamage(monster);
    logs.push(chalk.red(`[${count}] 몬스터가 ${monster.Attack}의 피해를 입혔습니다.`))
  }

  doubleAtk(player, monster, logs, count) {
    player.takedamage(monster);
    player.takedamage(monster);
    logs.push(chalk.red(`[${count}] 몬스터가 ${monster.Attack * 2}의 피해를 입혔습니다.`))
  }

}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 정보 HP: ${player.hp} Attack: ${player.Attack} `,
    ) +
    chalk.redBright(
      `| 몬스터 정보 HP: ${monster.hp} Attack: ${monster.Attack} `,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];
  let addHp = 10;
  let count = 1;

  if (stage >= 2) {
    logs.push(chalk.greenBright(`체력이 ${addHp} 회복되었습니다.`))
    player.hp = player.hp + addHp;
  }

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 | 2. 연속공격(50%) | 3. 방어(30%) | 4. 도망치기.(10%) | `,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    const random = Math.floor(Math.random() * 10 + 1);

    // 플레이어의 선택에 따라 다음 행동 처리
    switch (choice) {
      case '1':
        player.attack(player, monster, logs, count);
        monster.attack(player, monster, logs, count);
        break;
      case '2':
        if (random >= 1 && random <= 5) {
          player.doubleAtk(player, monster, logs, count);
        } else {
          logs.push(chalk.red(`연속공격에 실패하셨습니다..`))
        }

        monster.attack(player, monster, logs, count);
        break;
      case '3':
        if (random >= 1 && random <= 3) {
          player.defense(player, monster, logs, count);
        } else {
          logs.push(chalk.red(`방어에 실패하셨습니다..`));
          monster.attack(player, monster, logs, count);
        }
        break;
      case '4':
        if (random === 1) {
          return 0;
        } else {
          logs.push(chalk.red(`도망에 실패하셨습니다..`))
          monster.attack(player, monster, logs, count);
        }
    }
    if (monster.hp <= 0) {
      return 0;
    }
    count++
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);
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
    // 스테이지 클리어 및 게임 종료 조건
    stage++;
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
