<<<<<<<< HEAD:drizzle/0000_lush_morgan_stark.sql
CREATE TABLE `Test` (
========
CREATE TABLE `attendance` (
>>>>>>>> dev:drizzle/0000_true_the_initiative.sql
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`school_subject` text NOT NULL,
	`date` integer NOT NULL,
	`music_lesson_topic` text,
	`school_year` text NOT NULL,
	`note` text,
	`note2` text
);
--> statement-breakpoint
<<<<<<<< HEAD:drizzle/0000_lush_morgan_stark.sql
CREATE TABLE `Attendance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`school_subject` text NOT NULL,
	`date` integer NOT NULL,
	`music_lesson_topic` text,
	`school_year` text NOT NULL,
	`schoolclass_mode_id` integer NOT NULL,
	`note` text,
	`note2` text,
	FOREIGN KEY (`schoolclass_mode_id`) REFERENCES `SchoolclassMode`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Examinant` (
========
CREATE TABLE `examinant` (
>>>>>>>> dev:drizzle/0000_true_the_initiative.sql
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`role` text NOT NULL,
	`full_name` text,
	`attendance_id` integer NOT NULL,
	FOREIGN KEY (`attendance_id`) REFERENCES `attendance`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `school_class_mode` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`mode` text NOT NULL,
	`full_name` text,
<<<<<<<< HEAD:drizzle/0000_lush_morgan_stark.sql
	`attendance_id` integer NOT NULL,
	FOREIGN KEY (`attendance_id`) REFERENCES `Attendance`(`id`) ON UPDATE no action ON DELETE no action
========
	`attendance_id` integer,
	FOREIGN KEY (`attendance_id`) REFERENCES `attendance`(`id`) ON UPDATE no action ON DELETE cascade
>>>>>>>> dev:drizzle/0000_true_the_initiative.sql
);
