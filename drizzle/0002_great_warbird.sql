CREATE TABLE `test` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`some_text` text,
	`schoolclass_mode_id` integer,
	FOREIGN KEY (`schoolclass_mode_id`) REFERENCES `school_class_mode`(`id`) ON UPDATE no action ON DELETE no action
);
