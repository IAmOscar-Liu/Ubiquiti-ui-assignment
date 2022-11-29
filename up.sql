set
    session sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

DROP TABLE IF EXISTS Food;

DROP TABLE IF EXISTS SubTask;

DROP TABLE IF EXISTS Task;

DROP TABLE IF EXISTS Account;

CREATE TABLE Account (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT unique_name UNIQUE (email)
);

INSERT INTO
    Account(name, email, password)
VALUES
    (
        "Oscar",
        "karta0989006@gmail.com",
        "$2a$12$B6dII6g8psuevYox7IWSVOuLSiB8k87Rsqhi/BwFu4/QWFCglxqqW"
    ),
    (
        "John",
        "john@gmail.com",
        "$2a$12$B6dII6g8psuevYox7IWSVOuLSiB8k87Rsqhi/BwFu4/QWFCglxqqW"
    ),
    (
        "Tony",
        "tony@gmail.com",
        "$2a$12$B6dII6g8psuevYox7IWSVOuLSiB8k87Rsqhi/BwFu4/QWFCglxqqW"
    );

CREATE TABLE Task (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price FLOAT(8) DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    deadline VARCHAR(20) NOT NULL,
    createdBy INT UNSIGNED NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(createdBy) REFERENCES Account(id)
);

INSERT INTO
    Task(name, description, price, deadline, createdBy)
VALUES
    (
        "Do the grocery",
        "Buy something for dinner",
        0,
        "1669560844403",
        1
    ),
    (
        "Buy an album",
        "Buy an album of Elvis Presley",
        50,
        "1669560843403",
        1
    ),
    (
        "Buy a book",
        "Buy a book",
        70,
        "1669560842403",
        1
    );

CREATE TABLE SubTask (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rootTask INT UNSIGNED NOT NULL,
    subTaskPath TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price FLOAT(8) DEFAULT 0,
    FOREIGN KEY(rootTask) REFERENCES Task(id)
);

INSERT INTO
    SubTask(rootTask, subTaskPath, name, description, price)
VALUES
    (
        1,
        "task:1",
        "milk",
        "Buy milk",
        40
    ),
    (
        1,
        "task:1",
        "eggs",
        "Buy eggs",
        40
    ),
    (
        1,
        "task:1",
        "chocolate",
        "Buy chocolate",
        40
    ),
    (
        1,
        "task:1 -> subTask:3",
        "vanilla",
        "vanilla chocolate",
        20
    ),
    (
        1,
        "task:1 -> subTask:3",
        "strawberry",
        "strawberry chocolate",
        20
    ),
    (
        3,
        "task:3",
        "Harry Potter",
        "buy Harry Potter",
        100
    );

CREATE TABLE Food (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    carbs FLOAT(8) NOT NULL,
    fats FLOAT(8) NOT NULL,
    protein FLOAT(8) NOT NULL,
    img VARCHAR(500) DEFAULT "/imgs/default_img.jpg",
    createdBy INT UNSIGNED NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(createdBy) REFERENCES Account(id)
);

INSERT INTO
    Food (name, carbs, fats, protein, img, createdBy)
VALUES
    (
        "bread",
        20,
        30,
        40,
        "/imgs/bread.jpg",
        1
    ),
    (
        "lettuce",
        10,
        5,
        5,
        "/imgs/lettuce.jpg",
        1
    ),
    (
        "carrot",
        15,
        3,
        10,
        "/imgs/carrot.jpg",
        1
    );