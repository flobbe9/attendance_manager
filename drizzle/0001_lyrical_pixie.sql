CREATE TABLE `Attendance` (
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
CREATE TABLE `Examinant` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`role` text NOT NULL,
	`full_name` text,
	`attendance_id` integer NOT NULL,
	FOREIGN KEY (`attendance_id`) REFERENCES `Attendance`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `SchoolclassMode` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`mode` text NOT NULL,
	`full_name` text,
	`attendance_id` integer NOT NULL,
	FOREIGN KEY (`attendance_id`) REFERENCES `Attendance`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `User`;