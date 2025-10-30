PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS __new_media;

CREATE TABLE __new_media (
  	`id` text(36) PRIMARY KEY NOT NULL,
  	`is_art` integer DEFAULT true,
  	`alt` text NOT NULL,
  	`caption` text,
  	`artwork_id` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`url` text,
  	`thumbnail_u_r_l` text,
  	`filename` text,
  	`mime_type` text,
  	`filesize` numeric,
  	`width` numeric,
  	`height` numeric,
  	`focal_x` numeric,
  	`focal_y` numeric
  );
INSERT INTO `__new_media`(
  "id",
   "is_art", 
   "alt",
    "caption",
     "artwork_id",
      "updated_at",
       "created_at",
        "url",
         "thumbnail_u_r_l",
          "filename",
           "mime_type",
            "filesize",
             "width",
              "height",
               "focal_x",
                "focal_y")
  SELECT "id", "is_art", "alt", "caption", "artwork_id", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y" 
  FROM `media`;
  DROP TABLE `media`;
  ALTER TABLE `__new_media` RENAME TO `media`;
  PRAGMA foreign_keys=ON;
  CREATE INDEX `media_updated_at_idx` ON `media` (`updated_at`);
  CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);
  CREATE UNIQUE INDEX `media_filename_idx` ON `media` (`filename`);
