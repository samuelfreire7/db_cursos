-- CreateTable
CREATE TABLE `Alunos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `curso_id` INTEGER NOT NULL,

    UNIQUE INDEX `Alunos_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Alunos` ADD CONSTRAINT `Alunos_curso_id_fkey` FOREIGN KEY (`curso_id`) REFERENCES `Cursos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
