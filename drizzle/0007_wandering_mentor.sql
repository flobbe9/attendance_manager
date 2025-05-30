CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`key` text NOT NULL,
	`value` text(65535)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);