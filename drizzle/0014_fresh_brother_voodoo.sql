CREATE TABLE `metadata` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`key` text NOT NULL,
	`value` text(65535)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `metadata_key_unique` ON `metadata` (`key`);