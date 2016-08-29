# Genie Top 50 Crawler
* `최근 몇 년간 Top 50에 가장 많이 있었던 아티스트는 누굴까?` 라는 단순한 궁금증으로 부터 시작된 작은 크롤러입니다.
* **참고용 / 학습용으로만 확인하시고, 사용 / 악용함으로써 발생하는 불이익은 모두 사용자에게 있습니다.**
* 이 작은 크롤러는 `node.js`로 작성되었습니다.
* 다음과 같은 npm 패키지들이 사용되었습니다.
  * `request` : for `HTTP` Request and Response
  * `cheerio` : `HTML` Parser like a jQuery
  * `moment` : Date Object Middleware
  * `dotenv` : for `.env` file & `process` enviorment variables
  * `mysql` : `MySQL`/`MariaDB` Connecter
  * `node-qsb` : `SQL` Builder

# Database DDL (MySQL, MariaDB)
## Table : musicInfos
```mysql
CREATE TABLE `musicInfos`(
  `idx` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `artist` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `rank` INT NOT NULL,
  PRIMARY KEY(`idx`)
) ENGINE = InnoDB;
```

## View : rankCountDesc
```mysql
CREATE VIEW `rankCountDesc` AS
SELECT
  `musicInfos`.`artist` AS `artist`,
  COUNT(`musicInfos`.`artist`) AS `count`
FROM
  `musicInfos`
GROUP BY
  `musicInfos`.`artist`
ORDER BY
  COUNT(`musicInfos`.`artist`) DESC;
```

# .env (Enviorment Variable Setting File)
* ST_YMD : 시작 날짜
* ED_YMD : 끝 날짜
* HOUR : 체크 시간 (Genie는 시간대 별로 Top 100을 가지고 있음)
* SET_TIMEOUT : Request별 시간 간격(ms)
* DB_HOST : 데이터베이스 호스트 네임
* DB_USER : 데이터베이스 유저 네임
* DB_PASSWORD : 데이터베이스 유저 비밀번호
* DB_DATABASE : 데이터베이스 이름

# Execute
```bash
npm install
cp .env.example .env
vi .env # Editing .env File
node app
```
