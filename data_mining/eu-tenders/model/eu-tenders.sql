SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `eu-tenders` ;
CREATE SCHEMA IF NOT EXISTS `eu-tenders` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `eu-tenders` ;

-- -----------------------------------------------------
-- Table `program`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `program` ;

CREATE TABLE IF NOT EXISTS `program` (
  `id` INT NOT NULL,
  `name` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `contractor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `contractor` ;

CREATE TABLE IF NOT EXISTS `contractor` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(500) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `project` ;

CREATE TABLE IF NOT EXISTS `project` (
  `id` INT NOT NULL,
  `isun` VARCHAR(255) NOT NULL,
  `project_number` INT NULL,
  `name` VARCHAR(500) NOT NULL,
  `beneficiary_id` INT NOT NULL,
  `program_id` INT NOT NULL,
  `date_contract` DATE NULL,
  `date_begin` DATE NULL,
  `date_end` DATE NULL,
  `status` VARCHAR(45) NULL,
  `place` VARCHAR(45) NULL,
  `activities` TEXT NULL,
  `budget_approved` INT NULL,
  `budget_total` INT NULL,
  `budget_fin_help` INT NULL,
  `budget_paid` INT NULL,
  `duration` DECIMAL NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_project_program1_idx` (`program_id` ASC),
  INDEX `fk_project_contractor1_idx` (`beneficiary_id` ASC),
  CONSTRAINT `fk_project_program1`
    FOREIGN KEY (`program_id`)
    REFERENCES `program` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_project_contractor1`
    FOREIGN KEY (`beneficiary_id`)
    REFERENCES `contractor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project_has_contractor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `project_has_contractor` ;

CREATE TABLE IF NOT EXISTS `project_has_contractor` (
  `project_id` INT NOT NULL,
  `contractor_id` INT NOT NULL,
  PRIMARY KEY (`project_id`, `contractor_id`),
  INDEX `fk_project_has_contractor_contractor1_idx` (`contractor_id` ASC),
  INDEX `fk_project_has_contractor_project_idx` (`project_id` ASC),
  CONSTRAINT `fk_project_has_contractor_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `project` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_project_has_contractor_contractor1`
    FOREIGN KEY (`contractor_id`)
    REFERENCES `contractor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project_has_partner`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `project_has_partner` ;

CREATE TABLE IF NOT EXISTS `project_has_partner` (
  `project_id` INT NOT NULL,
  `contractor_id` INT NOT NULL,
  PRIMARY KEY (`project_id`, `contractor_id`),
  INDEX `fk_project_has_contractor1_contractor1_idx` (`contractor_id` ASC),
  INDEX `fk_project_has_contractor1_project1_idx` (`project_id` ASC),
  CONSTRAINT `fk_project_has_contractor1_project1`
    FOREIGN KEY (`project_id`)
    REFERENCES `project` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_project_has_contractor1_contractor1`
    FOREIGN KEY (`contractor_id`)
    REFERENCES `contractor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
