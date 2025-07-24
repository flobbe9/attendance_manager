CREATE TABLE `attendance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`school_subject` text NOT NULL,
	`date` integer,
	`music_lesson_topic` text,
	`school_year` text,
	`note` text(65535),
	`note2` text(65535)
);
--> statement-breakpoint
CREATE TABLE `examinant` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`role` text NOT NULL,
	`full_name` text,
	`attendance_id` integer NOT NULL,
	FOREIGN KEY (`attendance_id`) REFERENCES `attendance`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `schoolclass_mode` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`mode` text NOT NULL,
	`full_name` text,
	`attendance_id` integer NOT NULL,
	FOREIGN KEY (`attendance_id`) REFERENCES `attendance`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `metadata` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`key` text NOT NULL,
	`value` text(65535)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `metadata_key_unique` ON `metadata` (`key`);