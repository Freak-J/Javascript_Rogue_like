import chalk from 'chalk';

export class Player {
    constructor() {
        this.hp = 200;
        this.Attack = 15;
    }

    // player 피해
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

    // 흡성대법 (hp,Attack 흡수)
    Drain_Life(player, monster, logs, count) {
        const drainhp = Math.floor(Math.random() * (31 - 5)) + 5;
        const drainat = Math.floor(Math.random() * (6 - 1)) + 1;
        player.hp += drainhp;
        player.Attack += drainat;
        monster.hp -= drainhp;
        monster.Attack -= drainat;
        logs.push(chalk.greenBright(`[${count}] 상대의 체력을 ${drainhp}, 공격력을 ${drainat}만큼 흡수하셨습니다!`));
    }
}

export class Monster {
    constructor(stage, random) {
        this.hp = 100 + (stage * 10) + (random * 5);
        this.Attack = 3 + (stage * 2) + (random * 1);
    }

    takedamage(player) {
        this.hp -= player.Attack;
    }

    // 몬스터의 공격
    attack(player, monster, logs, count) {
        const random = Math.floor(Math.random() * 10 + 1);
        if (random === 1) {
            this.doubleAtk(player, monster, logs, count);
        } else {
            player.takedamage(monster);
            logs.push(chalk.red(`[${count}] 몬스터에게 ${monster.Attack}의 피해를 입었습니다.`))
        }

    }

    doubleAtk(player, monster, logs, count) {
        player.takedamage(monster);
        player.takedamage(monster);
        logs.push(chalk.red(`[${count}] 더블어택 !! 몬스터에게 ${monster.Attack * 2}의 피해를 입었습니다.`))
    }

}