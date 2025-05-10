ALTER TABLE `school_class_mode` RENAME TO `schoolclass_mode`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_schoolclass_mode` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`mode` text NOT NULL,
	`full_name` text,
	`attendance_id` integer NOT NULL,
	FOREIGN KEY (`attendance_id`) REFERENCES `attendance`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_schoolclass_mode`("id", "created", "updated", "mode", "full_name", "attendance_id") SELECT "id", "created", "updated", "mode", "full_name", "attendance_id" FROM `schoolclass_mode`;--> statement-breakpoint
DROP TABLE `schoolclass_mode`;--> statement-breakpoint
ALTER TABLE `__new_schoolclass_mode` RENAME TO `schoolclass_mode`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_test` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`some_text` text,
	`schoolclass_mode_id` integer,
	FOREIGN KEY (`schoolclass_mode_id`) REFERENCES `schoolclass_mode`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_test`("id", "created", "updated", "some_text", "schoolclass_mode_id") SELECT "id", "created", "updated", "some_text", "schoolclass_mode_id" FROM `test`;--> statement-breakpoint
DROP TABLE `test`;--> statement-breakpoint
ALTER TABLE `__new_test` RENAME TO `test`;