PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_school_class_mode` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`mode` text NOT NULL,
	`full_name` text,
	`attendance_id` integer NOT NULL,
	FOREIGN KEY (`attendance_id`) REFERENCES `attendance`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_school_class_mode`("id", "created", "updated", "mode", "full_name", "attendance_id") SELECT "id", "created", "updated", "mode", "full_name", "attendance_id" FROM `school_class_mode`;--> statement-breakpoint
DROP TABLE `school_class_mode`;--> statement-breakpoint
ALTER TABLE `__new_school_class_mode` RENAME TO `school_class_mode`;--> statement-breakpoint
PRAGMA foreign_keys=ON;