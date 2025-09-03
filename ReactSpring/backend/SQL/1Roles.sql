Use `todo_list`;

drop table if exists `todo_list`.`roles`;

create table `todo_list`.`roles`
(
    `role_id`   integer unsigned not null auto_increment primary key,
    `role_name` varchar(20)      not null,
    unique key `uq_role_name` (`role_name`)
) engine = InnoDB default charset = utf8mb4;