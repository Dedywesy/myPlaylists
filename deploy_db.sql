--Create Users table

CREATE TABLE public.users
(
    "Salt" character varying COLLATE pg_catalog."default" NOT NULL,
    "Name" character varying COLLATE pg_catalog."default" NOT NULL,
    "Email" character varying COLLATE pg_catalog."default" NOT NULL,
    "ID" integer NOT NULL DEFAULT nextval('"users_ID_seq"'::regclass),
    "Hash" character varying COLLATE pg_catalog."default" NOT NULL,
    "ProfilePic" character varying COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY ("ID")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to Username ;

--Create Playlists table

CREATE TABLE public.playlists
(
    "ID" integer NOT NULL DEFAULT nextval('"playlists_ID_seq"'::regclass),
    "UserID" integer NOT NULL,
    "IsPublic" boolean NOT NULL,
    "Name" character varying COLLATE pg_catalog."default" NOT NULL,
    "Description" character varying COLLATE pg_catalog."default",
    "JsonPlaylist" json,
    CONSTRAINT playlists_pkey PRIMARY KEY ("ID"),
    CONSTRAINT "fk_userID" FOREIGN KEY ("UserID")
        REFERENCES public.users ("ID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.playlists
    OWNER to Username ;

CREATE INDEX "fki_fk_userID"
    ON public.playlists USING btree
    (UserID)
    TABLESPACE pg_default;

-- Create Comments table

CREATE TABLE public.comments
(
    "ID" integer NOT NULL DEFAULT nextval('"comments_ID_seq"'::regclass),
    "UserID" integer NOT NULL,
    "PlaylistID" integer NOT NULL,
    "Date" timestamp without time zone NOT NULL DEFAULT now(),
    "Content" text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT comments_pkey PRIMARY KEY ("ID"),
    CONSTRAINT fk_playlist FOREIGN KEY ("PlaylistID")
        REFERENCES public.playlists ("ID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("UserID")
        REFERENCES public.users ("ID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.comments
    OWNER to Username ;

CREATE INDEX fki_fk_playlist
    ON public.comments USING btree
    (PlaylistID)
    TABLESPACE pg_default;


CREATE INDEX fki_fk_user
    ON public.comments USING btree
    (UserID)
    TABLESPACE pg_default;

--Create Likes table

CREATE TABLE public.likes
(
    "ID" integer NOT NULL DEFAULT nextval('"likes_ID_seq"'::regclass),
    "UserID" integer NOT NULL,
    "PlaylistID" integer NOT NULL,
    CONSTRAINT likes_pkey PRIMARY KEY ("ID"),
    CONSTRAINT "fk_UserID" FOREIGN KEY ("UserID")
        REFERENCES public.users ("ID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_playlist FOREIGN KEY ("PlaylistID")
        REFERENCES public.playlists ("ID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.likes
    OWNER to Username;

CREATE INDEX "fki_fk_Playlist"
    ON public.likes USING btree
    (PlaylistID)
    TABLESPACE pg_default;

CREATE INDEX "fki_fk_UserID"
    ON public.likes USING btree
    (UserID)
    TABLESPACE pg_default;
