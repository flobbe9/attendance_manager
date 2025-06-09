PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_attendance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`school_subject` text NOT NULL,
	`date` integer,
	`music_lesson_topic` text NOT NULL,
	`school_year` text NOT NULL,
	`note` text(65535),
	`note2` text(65535)
);
--> statement-breakpoint
INSERT INTO `__new_attendance`("id", "created", "updated", "school_subject", "date", "music_lesson_topic", "school_year", "note", "note2") SELECT "id", "created", "updated", "school_subject", "date", "music_lesson_topic", "school_year", "note", "note2" FROM `attendance`;--> statement-breakpoint
DROP TABLE `attendance`;--> statement-breakpoint
ALTER TABLE `__new_attendance` RENAME TO `attendance`;--> statement-breakpoint
PRAGMA foreign_keys=ON;