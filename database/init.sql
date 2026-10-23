-- Sanitized development schema: all application, credential and session data removed.
-- Only Django migration metadata is retained. Seed synthetic content with seed_demo.
--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outstandingtoken_user_id_83bc629a_fk_user_id;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk;
ALTER TABLE IF EXISTS ONLY public.review_reaction DROP CONSTRAINT IF EXISTS review_reaction_user_id_f9818521_fk_user_id;
ALTER TABLE IF EXISTS ONLY public.review_reaction DROP CONSTRAINT IF EXISTS review_reaction_review_id_62d4624b_fk_review_id;
ALTER TABLE IF EXISTS ONLY public.review DROP CONSTRAINT IF EXISTS review_performance_id_88aa2a9d_fk_perfomances_id;
ALTER TABLE IF EXISTS ONLY public.review DROP CONSTRAINT IF EXISTS review_news_id_25f6914d_fk_news_id;
ALTER TABLE IF EXISTS ONLY public.review DROP CONSTRAINT IF EXISTS review_director_id_42ff8e31_fk_directors_theatre_id;
ALTER TABLE IF EXISTS ONLY public.review DROP CONSTRAINT IF EXISTS review_author_id_97444e9c_fk_user_id;
ALTER TABLE IF EXISTS ONLY public.review DROP CONSTRAINT IF EXISTS review_archive_id_d8c4a9dc_fk_archive_id;
ALTER TABLE IF EXISTS ONLY public.review DROP CONSTRAINT IF EXISTS review_actor_id_57514974_fk_actors_id;
ALTER TABLE IF EXISTS ONLY public.performance_show DROP CONSTRAINT IF EXISTS performance_show_performance_id_3b55fa5c_fk_perfomances_id;
ALTER TABLE IF EXISTS ONLY public.performance_cast DROP CONSTRAINT IF EXISTS performance_cast_performance_id_b9046ac1_fk_perfomances_id;
ALTER TABLE IF EXISTS ONLY public.performance_cast DROP CONSTRAINT IF EXISTS performance_cast_director_id_3c35cdea_fk_directors_theatre_id;
ALTER TABLE IF EXISTS ONLY public.performance_cast DROP CONSTRAINT IF EXISTS performance_cast_actor_id_65144cef_fk_actors_id;
ALTER TABLE IF EXISTS ONLY public.perfomances DROP CONSTRAINT IF EXISTS perfomances_director_id_e1747ed4_fk_directors_theatre_id;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_user_id_c564eba6_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_content_type_id_c4bce8eb_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_6a12ed8b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_group_id_97559544_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_2f476e4b_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_b120cbf9_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissio_permission_id_84c5c92e_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.actor_birthday DROP CONSTRAINT IF EXISTS actor_birthday_director_id_d22cf810_fk_directors_theatre_id;
ALTER TABLE IF EXISTS ONLY public.actor_birthday DROP CONSTRAINT IF EXISTS actor_birthday_actor_id_fededb13_fk_actors_id;
DROP INDEX IF EXISTS public.user_phone_number_181d522d_like;
DROP INDEX IF EXISTS public.user_email_54dc62b2_like;
DROP INDEX IF EXISTS public.uniq_vk_comment;
DROP INDEX IF EXISTS public.token_blacklist_outstandingtoken_user_id_83bc629a;
DROP INDEX IF EXISTS public.token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like;
DROP INDEX IF EXISTS public.site_content_key_cc487101_like;
DROP INDEX IF EXISTS public.review_reaction_user_id_f9818521;
DROP INDEX IF EXISTS public.review_reaction_review_id_62d4624b;
DROP INDEX IF EXISTS public.review_performance_id_88aa2a9d;
DROP INDEX IF EXISTS public.review_news_id_25f6914d;
DROP INDEX IF EXISTS public.review_director_id_42ff8e31;
DROP INDEX IF EXISTS public.review_author_id_97444e9c;
DROP INDEX IF EXISTS public.review_archive_id_d8c4a9dc;
DROP INDEX IF EXISTS public.review_actor_id_57514974;
DROP INDEX IF EXISTS public.performance_show_performance_id_3b55fa5c;
DROP INDEX IF EXISTS public.performance_cast_performance_id_b9046ac1;
DROP INDEX IF EXISTS public.performance_cast_director_id_3c35cdea;
DROP INDEX IF EXISTS public.performance_cast_actor_id_65144cef;
DROP INDEX IF EXISTS public.perfomances_director_id_e1747ed4;
DROP INDEX IF EXISTS public.email_verification_email_318edf73_like;
DROP INDEX IF EXISTS public.django_session_session_key_c0390e0f_like;
DROP INDEX IF EXISTS public.django_session_expire_date_a5c62663;
DROP INDEX IF EXISTS public.django_admin_log_user_id_c564eba6;
DROP INDEX IF EXISTS public.django_admin_log_content_type_id_c4bce8eb;
DROP INDEX IF EXISTS public.auth_user_username_6821ab7c_like;
DROP INDEX IF EXISTS public.auth_user_user_permissions_user_id_a95ead1b;
DROP INDEX IF EXISTS public.auth_user_user_permissions_permission_id_1fbb5f2c;
DROP INDEX IF EXISTS public.auth_user_groups_user_id_6a12ed8b;
DROP INDEX IF EXISTS public.auth_user_groups_group_id_97559544;
DROP INDEX IF EXISTS public.auth_permission_content_type_id_2f476e4b;
DROP INDEX IF EXISTS public.auth_group_permissions_permission_id_84c5c92e;
DROP INDEX IF EXISTS public.auth_group_permissions_group_id_b120cbf9;
DROP INDEX IF EXISTS public.auth_group_name_a6ea08ec_like;
ALTER TABLE IF EXISTS ONLY public.vk_parser_state DROP CONSTRAINT IF EXISTS vk_parser_state_pkey;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_pkey;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_phone_number_181d522d_uniq;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_email_key;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outstandingtoken_pkey;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_token_id_key;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_pkey;
ALTER TABLE IF EXISTS ONLY public.site_review DROP CONSTRAINT IF EXISTS site_review_pkey;
ALTER TABLE IF EXISTS ONLY public.site_content DROP CONSTRAINT IF EXISTS site_content_pkey;
ALTER TABLE IF EXISTS ONLY public.site_content DROP CONSTRAINT IF EXISTS site_content_key_key;
ALTER TABLE IF EXISTS ONLY public.review_reaction DROP CONSTRAINT IF EXISTS review_reaction_review_id_user_id_reaction_71d4cab4_uniq;
ALTER TABLE IF EXISTS ONLY public.review_reaction DROP CONSTRAINT IF EXISTS review_reaction_pkey;
ALTER TABLE IF EXISTS ONLY public.review DROP CONSTRAINT IF EXISTS review_pkey;
ALTER TABLE IF EXISTS ONLY public.performance_show DROP CONSTRAINT IF EXISTS performance_show_pkey;
ALTER TABLE IF EXISTS ONLY public.performance_cast DROP CONSTRAINT IF EXISTS performance_cast_pkey;
ALTER TABLE IF EXISTS ONLY public.performance_cast DROP CONSTRAINT IF EXISTS performance_cast_performance_id_actor_id_role_9e98cd73_uniq;
ALTER TABLE IF EXISTS ONLY public.perfomances DROP CONSTRAINT IF EXISTS perfomances_pkey;
ALTER TABLE IF EXISTS ONLY public.news DROP CONSTRAINT IF EXISTS news_pkey;
ALTER TABLE IF EXISTS ONLY public.email_verification DROP CONSTRAINT IF EXISTS email_verification_pkey;
ALTER TABLE IF EXISTS ONLY public.email_verification DROP CONSTRAINT IF EXISTS email_verification_email_key;
ALTER TABLE IF EXISTS ONLY public.django_session DROP CONSTRAINT IF EXISTS django_session_pkey;
ALTER TABLE IF EXISTS ONLY public.django_migrations DROP CONSTRAINT IF EXISTS django_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_app_label_model_76bd3d3b_uniq;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_pkey;
ALTER TABLE IF EXISTS ONLY public.directors_theatre DROP CONSTRAINT IF EXISTS directors_theatre_pkey;
ALTER TABLE IF EXISTS ONLY public.birthday_greeting DROP CONSTRAINT IF EXISTS birthday_greeting_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user DROP CONSTRAINT IF EXISTS auth_user_username_key;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_permission_id_14a6b632_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user DROP CONSTRAINT IF EXISTS auth_user_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_group_id_94350c0c_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_codename_01ab375a_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_permission_id_0cd325b0_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_name_key;
ALTER TABLE IF EXISTS ONLY public.archive DROP CONSTRAINT IF EXISTS archive_pkey;
ALTER TABLE IF EXISTS ONLY public.actors DROP CONSTRAINT IF EXISTS actors_pkey;
ALTER TABLE IF EXISTS ONLY public.actor_birthday DROP CONSTRAINT IF EXISTS actor_birthday_pkey;
ALTER TABLE IF EXISTS ONLY public.actor_birthday DROP CONSTRAINT IF EXISTS actor_birthday_director_id_key;
ALTER TABLE IF EXISTS ONLY public.actor_birthday DROP CONSTRAINT IF EXISTS actor_birthday_actor_id_key;
ALTER TABLE IF EXISTS ONLY public.achievements DROP CONSTRAINT IF EXISTS achievements_pkey;
DROP TABLE IF EXISTS public.vk_parser_state;
DROP TABLE IF EXISTS public."user";
DROP TABLE IF EXISTS public.token_blacklist_outstandingtoken;
DROP TABLE IF EXISTS public.token_blacklist_blacklistedtoken;
DROP TABLE IF EXISTS public.site_review;
DROP TABLE IF EXISTS public.site_content;
DROP TABLE IF EXISTS public.review_reaction;
DROP TABLE IF EXISTS public.review;
DROP TABLE IF EXISTS public.performance_show;
DROP TABLE IF EXISTS public.performance_cast;
DROP TABLE IF EXISTS public.perfomances;
DROP TABLE IF EXISTS public.news;
DROP TABLE IF EXISTS public.email_verification;
DROP TABLE IF EXISTS public.django_session;
DROP TABLE IF EXISTS public.django_migrations;
DROP TABLE IF EXISTS public.django_content_type;
DROP TABLE IF EXISTS public.django_admin_log;
DROP TABLE IF EXISTS public.directors_theatre;
DROP TABLE IF EXISTS public.birthday_greeting;
DROP TABLE IF EXISTS public.auth_user_user_permissions;
DROP TABLE IF EXISTS public.auth_user_groups;
DROP TABLE IF EXISTS public.auth_user;
DROP TABLE IF EXISTS public.auth_permission;
DROP TABLE IF EXISTS public.auth_group_permissions;
DROP TABLE IF EXISTS public.auth_group;
DROP TABLE IF EXISTS public.archive;
DROP TABLE IF EXISTS public.actors;
DROP TABLE IF EXISTS public.actor_birthday;
DROP TABLE IF EXISTS public.achievements;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievements (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    image_url character varying(200) NOT NULL,
    achievement character varying(500) NOT NULL,
    assigned date,
    images_list character varying(500)[] NOT NULL
);


--
-- Name: achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.achievements ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.achievements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: actor_birthday; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.actor_birthday (
    id bigint NOT NULL,
    birth_date date NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    actor_id bigint,
    director_id bigint,
    CONSTRAINT birthday_exactly_one_person CHECK ((((actor_id IS NOT NULL) AND (director_id IS NULL)) OR ((actor_id IS NULL) AND (director_id IS NOT NULL))))
);


--
-- Name: actor_birthday_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.actor_birthday ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.actor_birthday_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: actors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.actors (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    name character varying(50) NOT NULL,
    place_of_work character varying(200) NOT NULL,
    favorite_writer character varying(250)[] NOT NULL,
    favorite_character character varying(250)[] NOT NULL,
    favorite_painter character varying(350)[] NOT NULL,
    favorite_film character varying(250)[] NOT NULL,
    favorite_piece character varying(50)[] NOT NULL,
    favorite_quote character varying(1000) NOT NULL,
    author_quote character varying(50) NOT NULL,
    favorite_song character varying(250)[] NOT NULL,
    author_song character varying(250)[] NOT NULL,
    perfomances character varying(100)[] NOT NULL,
    role_in_perfomances character varying(50)[] NOT NULL,
    image_url character varying(200) NOT NULL,
    joined_at date,
    left_at date
);


--
-- Name: actors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.actors ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.actors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: archive; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.archive (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    description character varying(2000) NOT NULL,
    premiere_date date,
    afisha boolean NOT NULL,
    image_url character varying(200) NOT NULL,
    title character varying(100) NOT NULL,
    archive_image character varying(200),
    age_limit character varying(5),
    images_list character varying(200)[] NOT NULL
);


--
-- Name: archive_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.archive ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.archive_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_permission ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user_groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user_user_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: birthday_greeting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.birthday_greeting (
    id bigint NOT NULL,
    text text NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: birthday_greeting_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.birthday_greeting ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.birthday_greeting_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: directors_theatre; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.directors_theatre (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    name character varying(50) NOT NULL,
    description character varying(2000) NOT NULL,
    perfomances character varying(200)[] NOT NULL,
    years integer[] NOT NULL,
    team_name character varying(300)[] NOT NULL,
    image_url character varying(200) NOT NULL
);


--
-- Name: directors_theatre_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.directors_theatre ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.directors_theatre_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_admin_log ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_content_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_migrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


--
-- Name: email_verification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_verification (
    id bigint NOT NULL,
    email character varying(254) NOT NULL,
    code character varying(6) NOT NULL,
    password character varying(255) NOT NULL,
    phone_number character varying(20),
    attempts integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    last_sent_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT email_verification_attempts_check CHECK ((attempts >= 0))
);


--
-- Name: email_verification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.email_verification ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.email_verification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    title character varying(150) NOT NULL,
    description character varying(2000) NOT NULL,
    image_url character varying(200) NOT NULL,
    summary character varying(300) NOT NULL,
    is_published boolean NOT NULL,
    images_list character varying(200)[] NOT NULL,
    date_publish date
);


--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.news ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.news_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: perfomances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.perfomances (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    title character varying(50) NOT NULL,
    author character varying(50) NOT NULL,
    genre character varying(20) NOT NULL,
    age_limit character varying(5) NOT NULL,
    duration time without time zone,
    premiere_date date,
    production_team character varying(70)[] NOT NULL,
    description character varying(2000) NOT NULL,
    afisha boolean NOT NULL,
    image_url character varying(200) NOT NULL,
    performances_image character varying(200),
    images_list character varying(200)[] NOT NULL,
    ticket_url character varying(200),
    roles_propagated boolean NOT NULL,
    director_id bigint,
    production_collective character varying(300) NOT NULL,
    production_title character varying(200) NOT NULL,
    production_year integer,
    director_propagated boolean NOT NULL
);


--
-- Name: perfomances_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.perfomances ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.perfomances_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: performance_cast; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.performance_cast (
    id bigint NOT NULL,
    role character varying(100) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    actor_id bigint,
    performance_id bigint NOT NULL,
    actor_name character varying(100) NOT NULL,
    director_id bigint
);


--
-- Name: performance_cast_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.performance_cast ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.performance_cast_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: performance_show; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.performance_show (
    id bigint NOT NULL,
    show_datetime timestamp with time zone NOT NULL,
    ticket_url character varying(200),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    performance_id bigint NOT NULL
);


--
-- Name: performance_show_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.performance_show ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.performance_show_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: review; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review (
    id bigint NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    actor_id bigint,
    author_id bigint NOT NULL,
    performance_id bigint,
    archive_id bigint,
    director_id bigint,
    news_id bigint,
    deleted_at timestamp with time zone,
    CONSTRAINT review_exactly_one_target CHECK ((((actor_id IS NULL) AND (archive_id IS NULL) AND (director_id IS NULL) AND (news_id IS NULL) AND (performance_id IS NOT NULL)) OR ((actor_id IS NOT NULL) AND (archive_id IS NULL) AND (director_id IS NULL) AND (news_id IS NULL) AND (performance_id IS NULL)) OR ((actor_id IS NULL) AND (archive_id IS NULL) AND (director_id IS NOT NULL) AND (news_id IS NULL) AND (performance_id IS NULL)) OR ((actor_id IS NULL) AND (archive_id IS NOT NULL) AND (director_id IS NULL) AND (news_id IS NULL) AND (performance_id IS NULL)) OR ((actor_id IS NULL) AND (archive_id IS NULL) AND (director_id IS NULL) AND (news_id IS NOT NULL) AND (performance_id IS NULL))))
);


--
-- Name: review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.review ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: review_reaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_reaction (
    id bigint NOT NULL,
    reaction character varying(10) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    review_id bigint NOT NULL,
    user_id bigint NOT NULL
);


--
-- Name: review_reaction_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.review_reaction ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.review_reaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: site_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_content (
    id bigint NOT NULL,
    key character varying(100) NOT NULL,
    value text NOT NULL,
    section character varying(100) NOT NULL,
    label character varying(200) NOT NULL,
    multiline boolean NOT NULL,
    "order" integer NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: site_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.site_content ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.site_content_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: site_review; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_review (
    id bigint NOT NULL,
    author_name character varying(200) NOT NULL,
    role character varying(120) NOT NULL,
    avatar_url character varying(500) NOT NULL,
    rating smallint NOT NULL,
    text text NOT NULL,
    review_date date,
    source_url character varying(500) NOT NULL,
    source character varying(20) NOT NULL,
    vk_owner_id bigint,
    vk_post_id bigint,
    vk_comment_id bigint,
    pinned boolean NOT NULL,
    hidden boolean NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT site_review_rating_check CHECK ((rating >= 0))
);


--
-- Name: site_review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.site_review ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.site_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: token_blacklist_blacklistedtoken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_blacklist_blacklistedtoken (
    id bigint NOT NULL,
    blacklisted_at timestamp with time zone NOT NULL,
    token_id bigint NOT NULL
);


--
-- Name: token_blacklist_blacklistedtoken_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.token_blacklist_blacklistedtoken ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.token_blacklist_blacklistedtoken_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: token_blacklist_outstandingtoken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_blacklist_outstandingtoken (
    id bigint NOT NULL,
    token text NOT NULL,
    created_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    user_id bigint,
    jti character varying(255) NOT NULL
);


--
-- Name: token_blacklist_outstandingtoken_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.token_blacklist_outstandingtoken ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.token_blacklist_outstandingtoken_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    email character varying(254),
    password character varying(500) NOT NULL,
    phone_number character varying(20),
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    is_staff boolean NOT NULL,
    access_token character varying(500),
    refresh_token character varying(500),
    profile_photo character varying(200) NOT NULL
);


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public."user" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: vk_parser_state; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vk_parser_state (
    id bigint NOT NULL,
    initial_done boolean NOT NULL,
    last_run_at timestamp with time zone,
    last_result character varying(500) NOT NULL
);


--
-- Name: vk_parser_state_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.vk_parser_state ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.vk_parser_state_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.achievements (id, created_at, updated_at, deleted_at, image_url, achievement, assigned, images_list) FROM stdin;
\.


--
-- Data for Name: actor_birthday; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.actor_birthday (id, birth_date, created_at, updated_at, actor_id, director_id) FROM stdin;
\.


--
-- Data for Name: actors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.actors (id, created_at, updated_at, deleted_at, name, place_of_work, favorite_writer, favorite_character, favorite_painter, favorite_film, favorite_piece, favorite_quote, author_quote, favorite_song, author_song, perfomances, role_in_perfomances, image_url, joined_at, left_at) FROM stdin;
\.


--
-- Data for Name: archive; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.archive (id, created_at, updated_at, deleted_at, description, premiere_date, afisha, image_url, title, archive_image, age_limit, images_list) FROM stdin;
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: birthday_greeting; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.birthday_greeting (id, text, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: directors_theatre; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directors_theatre (id, created_at, updated_at, deleted_at, name, description, perfomances, years, team_name, image_url) FROM stdin;
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2025-07-01 19:08:57.574978+07
2	auth	0001_initial	2025-07-01 19:08:57.65132+07
3	admin	0001_initial	2025-07-01 19:08:57.675522+07
4	admin	0002_logentry_remove_auto_add	2025-07-01 19:08:57.685722+07
5	admin	0003_logentry_add_action_flag_choices	2025-07-01 19:08:57.691736+07
6	contenttypes	0002_remove_content_type_name	2025-07-01 19:08:57.714906+07
7	auth	0002_alter_permission_name_max_length	2025-07-01 19:08:57.722698+07
8	auth	0003_alter_user_email_max_length	2025-07-01 19:08:57.72834+07
9	auth	0004_alter_user_username_opts	2025-07-01 19:08:57.735102+07
10	auth	0005_alter_user_last_login_null	2025-07-01 19:08:57.742929+07
11	auth	0006_require_contenttypes_0002	2025-07-01 19:08:57.742929+07
12	auth	0007_alter_validators_add_error_messages	2025-07-01 19:08:57.748068+07
13	auth	0008_alter_user_username_max_length	2025-07-01 19:08:57.7655+07
14	auth	0009_alter_user_last_name_max_length	2025-07-01 19:08:57.773766+07
15	auth	0010_alter_group_name_max_length	2025-07-01 19:08:57.782764+07
16	auth	0011_update_proxy_permissions	2025-07-01 19:08:57.782764+07
17	auth	0012_alter_user_first_name_max_length	2025-07-01 19:08:57.790469+07
18	sessions	0001_initial	2025-07-01 19:08:57.804768+07
19	my_app1	0001_initial	2025-07-02 11:36:11.000033+07
20	my_app1	0002_achievements_actors_archive_directorstheatre_news_and_more	2025-07-02 21:07:14.432164+07
21	my_app1	0003_rename_peromances_perfomances	2025-07-02 21:11:53.246076+07
22	my_app1	0004_perfomances_image_url	2025-07-02 22:06:18.952664+07
23	my_app1	0005_alter_actors_deleted_at	2025-07-03 19:50:45.178893+07
24	my_app1	0006_alter_directorstheatre_years	2025-07-03 19:50:45.186484+07
25	my_app1	0007_alter_actors_deleted_at	2025-07-03 19:53:03.585376+07
26	my_app1	0008_user_last_login	2025-07-06 18:56:01.232464+07
27	my_app1	0009_user_is_superuser	2025-07-06 19:20:33.812391+07
28	my_app1	0010_user_is_staff	2025-07-08 10:58:25.944967+07
29	my_app1	0011_alter_user_deleted_at	2025-07-08 14:16:24.875535+07
30	token_blacklist	0001_initial	2025-07-08 21:01:10.047898+07
31	token_blacklist	0002_outstandingtoken_jti_hex	2025-07-08 21:01:10.059904+07
32	token_blacklist	0003_auto_20171017_2007	2025-07-08 21:01:10.084254+07
33	token_blacklist	0004_auto_20171017_2013	2025-07-08 21:01:10.104173+07
34	token_blacklist	0005_remove_outstandingtoken_jti	2025-07-08 21:01:10.124625+07
35	token_blacklist	0006_auto_20171017_2113	2025-07-08 21:01:10.134982+07
36	token_blacklist	0007_auto_20171017_2214	2025-07-08 21:01:10.193823+07
37	token_blacklist	0008_migrate_to_bigautofield	2025-07-08 21:01:10.260544+07
38	token_blacklist	0010_fix_migrate_to_bigautofield	2025-07-08 21:01:10.277484+07
39	token_blacklist	0011_linearizes_history	2025-07-08 21:01:10.285977+07
40	token_blacklist	0012_alter_outstandingtoken_user	2025-07-08 21:01:10.295228+07
41	my_app1	0012_fix_access_token_field	2025-07-09 12:59:45.062431+07
42	my_app1	0013_alter_actors_image_url	2025-07-09 20:13:41.111846+07
43	my_app1	0014_alter_actors_author_song	2025-07-09 21:10:41.120494+07
44	my_app1	0015_alter_actors_author_song	2025-07-09 21:10:41.14155+07
45	my_app1	0016_alter_actors_author_song	2025-07-09 21:10:41.152642+07
46	my_app1	0017_news_summary_alter_achievements_image_url_and_more	2025-07-10 18:37:40.001477+07
47	my_app1	0018_news_is_published	2025-07-10 18:40:04.972613+07
48	my_app1	0019_alter_news_summary	2025-07-10 18:49:07.038901+07
49	my_app1	0020_remove_achievements_image_url_and_more	2025-07-12 13:22:30.650327+07
50	my_app1	0021_remove_achievements_achievements_and_more	2025-07-12 20:06:20.267746+07
51	my_app1	0022_alter_achievements_description	2025-07-12 20:06:20.274711+07
52	my_app1	0023_remove_achievements_description_and_more	2025-07-12 20:06:20.282058+07
53	my_app1	0024_archive_title	2025-07-12 21:45:26.258767+07
54	my_app1	0025_perfomances_performances_image	2025-07-13 21:44:06.711994+07
55	my_app1	0026_perfomances_images_list	2025-07-14 20:10:46.203221+07
56	my_app1	0027_news_images_list	2025-07-16 19:04:04.302717+07
57	my_app1	0028_news_date_publish	2025-07-16 19:14:18.757461+07
58	my_app1	0029_perfomances_ticket_url	2025-07-17 17:04:35.763542+07
59	my_app1	0030_archive_archive_image	2025-07-18 14:29:43.059608+07
60	my_app1	0031_archive_age_limit	2025-07-18 17:28:55.534584+07
61	my_app1	0032_archive_images_list	2025-07-18 18:14:54.616944+07
62	my_app1	0033_alter_actors_author_song_alter_actors_favorite_song	2025-07-20 12:16:15.131078+07
63	my_app1	0034_alter_actors_favorite_painter_and_more	2025-07-20 12:17:25.368206+07
64	my_app1	0035_alter_actors_favorite_painter	2025-07-20 12:18:39.860097+07
65	my_app1	0036_alter_actors_favorite_character	2025-07-20 12:35:08.831586+07
66	my_app1	0037_alter_actors_favorite_film	2025-07-20 12:48:21.536157+07
67	my_app1	0038_user_profile_photo	2025-07-20 21:46:40.539339+07
68	my_app1	0039_achievements_assigned	2025-07-25 09:47:55.027353+07
69	my_app1	0002_alter_actors_author_song_and_more	2025-08-13 00:26:36.159286+07
70	my_app1	0003_perfomances_roles_propagated_and_more	2026-06-30 00:23:39.785879+07
71	my_app1	0004_remove_perfomances_the_cast	2026-06-30 00:23:39.795167+07
72	my_app1	0005_review_reviewreaction_and_more	2026-07-01 12:16:03.866772+07
73	my_app1	0006_actors_joined_left_at	2026-07-02 23:17:04.62229+07
74	my_app1	0007_review_director_archive_news	2026-07-02 23:17:04.73112+07
75	my_app1	0008_email_verification	2026-07-02 23:17:04.757252+07
76	my_app1	0009_perfomance_director	2026-07-06 18:00:41.50383+07
77	my_app1	0010_perfomance_production_fields	2026-07-06 20:27:45.891658+07
78	my_app1	0011_director_propagated_review_softdelete	2026-07-07 22:42:42.683046+07
79	my_app1	0012_birthdaygreeting_sitecontent_and_more	2026-07-09 00:06:01.893373+07
80	my_app1	0013_seed_site_content	2026-07-09 00:06:01.937132+07
81	my_app1	0014_actorbirthday_director_performancecast_director_and_more	2026-07-09 11:30:00.227001+07
82	my_app1	0015_vkparserstate_sitereview	2026-07-09 23:31:01.441277+07
83	my_app1	0016_seed_site_reviews	2026-07-09 23:31:01.461351+07
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- Data for Name: email_verification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.email_verification (id, email, code, password, phone_number, attempts, created_at, last_sent_at, expires_at) FROM stdin;
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news (id, created_at, updated_at, deleted_at, title, description, image_url, summary, is_published, images_list, date_publish) FROM stdin;
\.


--
-- Data for Name: perfomances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.perfomances (id, created_at, updated_at, deleted_at, title, author, genre, age_limit, duration, premiere_date, production_team, description, afisha, image_url, performances_image, images_list, ticket_url, roles_propagated, director_id, production_collective, production_title, production_year, director_propagated) FROM stdin;
\.


--
-- Data for Name: performance_cast; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.performance_cast (id, role, created_at, actor_id, performance_id, actor_name, director_id) FROM stdin;
\.


--
-- Data for Name: performance_show; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.performance_show (id, show_datetime, ticket_url, created_at, updated_at, performance_id) FROM stdin;
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.review (id, text, created_at, updated_at, actor_id, author_id, performance_id, archive_id, director_id, news_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: review_reaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.review_reaction (id, reaction, created_at, review_id, user_id) FROM stdin;
\.


--
-- Data for Name: site_content; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_content (id, key, value, section, label, multiline, "order", updated_at) FROM stdin;
\.


--
-- Data for Name: site_review; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_review (id, author_name, role, avatar_url, rating, text, review_date, source_url, source, vk_owner_id, vk_post_id, vk_comment_id, pinned, hidden, "position", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: token_blacklist_blacklistedtoken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token_blacklist_blacklistedtoken (id, blacklisted_at, token_id) FROM stdin;
\.


--
-- Data for Name: token_blacklist_outstandingtoken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token_blacklist_outstandingtoken (id, token, created_at, expires_at, user_id, jti) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, created_at, updated_at, deleted_at, email, password, phone_number, last_login, is_superuser, is_staff, access_token, refresh_token, profile_photo) FROM stdin;
\.


--
-- Data for Name: vk_parser_state; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vk_parser_state (id, initial_done, last_run_at, last_result) FROM stdin;
\.


--
-- Name: achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.achievements_id_seq', 4, true);


--
-- Name: actor_birthday_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.actor_birthday_id_seq', 8, true);


--
-- Name: actors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.actors_id_seq', 25, true);


--
-- Name: archive_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.archive_id_seq', 1, true);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 104, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, true);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: birthday_greeting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.birthday_greeting_id_seq', 3, true);


--
-- Name: directors_theatre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.directors_theatre_id_seq', 1, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 25, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 83, true);


--
-- Name: email_verification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.email_verification_id_seq', 1, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_id_seq', 4, true);


--
-- Name: perfomances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.perfomances_id_seq', 17, true);


--
-- Name: performance_cast_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.performance_cast_id_seq', 193, true);


--
-- Name: performance_show_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.performance_show_id_seq', 43, true);


--
-- Name: review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.review_id_seq', 3, true);


--
-- Name: review_reaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.review_reaction_id_seq', 10, true);


--
-- Name: site_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_content_id_seq', 17, true);


--
-- Name: site_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_review_id_seq', 6, true);


--
-- Name: token_blacklist_blacklistedtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.token_blacklist_blacklistedtoken_id_seq', 164, true);


--
-- Name: token_blacklist_outstandingtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.token_blacklist_outstandingtoken_id_seq', 211, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_id_seq', 19, true);


--
-- Name: vk_parser_state_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vk_parser_state_id_seq', 1, true);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: actor_birthday actor_birthday_actor_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actor_birthday
    ADD CONSTRAINT actor_birthday_actor_id_key UNIQUE (actor_id);


--
-- Name: actor_birthday actor_birthday_director_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actor_birthday
    ADD CONSTRAINT actor_birthday_director_id_key UNIQUE (director_id);


--
-- Name: actor_birthday actor_birthday_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actor_birthday
    ADD CONSTRAINT actor_birthday_pkey PRIMARY KEY (id);


--
-- Name: actors actors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_pkey PRIMARY KEY (id);


--
-- Name: archive archive_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.archive
    ADD CONSTRAINT archive_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: birthday_greeting birthday_greeting_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.birthday_greeting
    ADD CONSTRAINT birthday_greeting_pkey PRIMARY KEY (id);


--
-- Name: directors_theatre directors_theatre_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directors_theatre
    ADD CONSTRAINT directors_theatre_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: email_verification email_verification_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification
    ADD CONSTRAINT email_verification_email_key UNIQUE (email);


--
-- Name: email_verification email_verification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification
    ADD CONSTRAINT email_verification_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: perfomances perfomances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfomances
    ADD CONSTRAINT perfomances_pkey PRIMARY KEY (id);


--
-- Name: performance_cast performance_cast_performance_id_actor_id_role_9e98cd73_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_cast
    ADD CONSTRAINT performance_cast_performance_id_actor_id_role_9e98cd73_uniq UNIQUE (performance_id, actor_id, role);


--
-- Name: performance_cast performance_cast_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_cast
    ADD CONSTRAINT performance_cast_pkey PRIMARY KEY (id);


--
-- Name: performance_show performance_show_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_show
    ADD CONSTRAINT performance_show_pkey PRIMARY KEY (id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (id);


--
-- Name: review_reaction review_reaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_reaction
    ADD CONSTRAINT review_reaction_pkey PRIMARY KEY (id);


--
-- Name: review_reaction review_reaction_review_id_user_id_reaction_71d4cab4_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_reaction
    ADD CONSTRAINT review_reaction_review_id_user_id_reaction_71d4cab4_uniq UNIQUE (review_id, user_id, reaction);


--
-- Name: site_content site_content_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_content
    ADD CONSTRAINT site_content_key_key UNIQUE (key);


--
-- Name: site_content site_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_content
    ADD CONSTRAINT site_content_pkey PRIMARY KEY (id);


--
-- Name: site_review site_review_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_review
    ADD CONSTRAINT site_review_pkey PRIMARY KEY (id);


--
-- Name: token_blacklist_blacklistedtoken token_blacklist_blacklistedtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_blacklistedtoken
    ADD CONSTRAINT token_blacklist_blacklistedtoken_pkey PRIMARY KEY (id);


--
-- Name: token_blacklist_blacklistedtoken token_blacklist_blacklistedtoken_token_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_blacklistedtoken
    ADD CONSTRAINT token_blacklist_blacklistedtoken_token_id_key UNIQUE (token_id);


--
-- Name: token_blacklist_outstandingtoken token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_outstandingtoken
    ADD CONSTRAINT token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq UNIQUE (jti);


--
-- Name: token_blacklist_outstandingtoken token_blacklist_outstandingtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_outstandingtoken
    ADD CONSTRAINT token_blacklist_outstandingtoken_pkey PRIMARY KEY (id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_phone_number_181d522d_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_phone_number_181d522d_uniq UNIQUE (phone_number);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: vk_parser_state vk_parser_state_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vk_parser_state
    ADD CONSTRAINT vk_parser_state_pkey PRIMARY KEY (id);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: email_verification_email_318edf73_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX email_verification_email_318edf73_like ON public.email_verification USING btree (email varchar_pattern_ops);


--
-- Name: perfomances_director_id_e1747ed4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX perfomances_director_id_e1747ed4 ON public.perfomances USING btree (director_id);


--
-- Name: performance_cast_actor_id_65144cef; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX performance_cast_actor_id_65144cef ON public.performance_cast USING btree (actor_id);


--
-- Name: performance_cast_director_id_3c35cdea; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX performance_cast_director_id_3c35cdea ON public.performance_cast USING btree (director_id);


--
-- Name: performance_cast_performance_id_b9046ac1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX performance_cast_performance_id_b9046ac1 ON public.performance_cast USING btree (performance_id);


--
-- Name: performance_show_performance_id_3b55fa5c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX performance_show_performance_id_3b55fa5c ON public.performance_show USING btree (performance_id);


--
-- Name: review_actor_id_57514974; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX review_actor_id_57514974 ON public.review USING btree (actor_id);


--
-- Name: review_archive_id_d8c4a9dc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX review_archive_id_d8c4a9dc ON public.review USING btree (archive_id);


--
-- Name: review_author_id_97444e9c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX review_author_id_97444e9c ON public.review USING btree (author_id);


--
-- Name: review_director_id_42ff8e31; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX review_director_id_42ff8e31 ON public.review USING btree (director_id);


--
-- Name: review_news_id_25f6914d; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX review_news_id_25f6914d ON public.review USING btree (news_id);


--
-- Name: review_performance_id_88aa2a9d; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX review_performance_id_88aa2a9d ON public.review USING btree (performance_id);


--
-- Name: review_reaction_review_id_62d4624b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX review_reaction_review_id_62d4624b ON public.review_reaction USING btree (review_id);


--
-- Name: review_reaction_user_id_f9818521; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX review_reaction_user_id_f9818521 ON public.review_reaction USING btree (user_id);


--
-- Name: site_content_key_cc487101_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_content_key_cc487101_like ON public.site_content USING btree (key varchar_pattern_ops);


--
-- Name: token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like ON public.token_blacklist_outstandingtoken USING btree (jti varchar_pattern_ops);


--
-- Name: token_blacklist_outstandingtoken_user_id_83bc629a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX token_blacklist_outstandingtoken_user_id_83bc629a ON public.token_blacklist_outstandingtoken USING btree (user_id);


--
-- Name: uniq_vk_comment; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_vk_comment ON public.site_review USING btree (vk_owner_id, vk_post_id, vk_comment_id) WHERE (vk_comment_id IS NOT NULL);


--
-- Name: user_email_54dc62b2_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_email_54dc62b2_like ON public."user" USING btree (email varchar_pattern_ops);


--
-- Name: user_phone_number_181d522d_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_phone_number_181d522d_like ON public."user" USING btree (phone_number varchar_pattern_ops);


--
-- Name: actor_birthday actor_birthday_actor_id_fededb13_fk_actors_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actor_birthday
    ADD CONSTRAINT actor_birthday_actor_id_fededb13_fk_actors_id FOREIGN KEY (actor_id) REFERENCES public.actors(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: actor_birthday actor_birthday_director_id_d22cf810_fk_directors_theatre_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actor_birthday
    ADD CONSTRAINT actor_birthday_director_id_d22cf810_fk_directors_theatre_id FOREIGN KEY (director_id) REFERENCES public.directors_theatre(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: perfomances perfomances_director_id_e1747ed4_fk_directors_theatre_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfomances
    ADD CONSTRAINT perfomances_director_id_e1747ed4_fk_directors_theatre_id FOREIGN KEY (director_id) REFERENCES public.directors_theatre(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: performance_cast performance_cast_actor_id_65144cef_fk_actors_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_cast
    ADD CONSTRAINT performance_cast_actor_id_65144cef_fk_actors_id FOREIGN KEY (actor_id) REFERENCES public.actors(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: performance_cast performance_cast_director_id_3c35cdea_fk_directors_theatre_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_cast
    ADD CONSTRAINT performance_cast_director_id_3c35cdea_fk_directors_theatre_id FOREIGN KEY (director_id) REFERENCES public.directors_theatre(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: performance_cast performance_cast_performance_id_b9046ac1_fk_perfomances_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_cast
    ADD CONSTRAINT performance_cast_performance_id_b9046ac1_fk_perfomances_id FOREIGN KEY (performance_id) REFERENCES public.perfomances(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: performance_show performance_show_performance_id_3b55fa5c_fk_perfomances_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_show
    ADD CONSTRAINT performance_show_performance_id_3b55fa5c_fk_perfomances_id FOREIGN KEY (performance_id) REFERENCES public.perfomances(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: review review_actor_id_57514974_fk_actors_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_actor_id_57514974_fk_actors_id FOREIGN KEY (actor_id) REFERENCES public.actors(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: review review_archive_id_d8c4a9dc_fk_archive_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_archive_id_d8c4a9dc_fk_archive_id FOREIGN KEY (archive_id) REFERENCES public.archive(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: review review_author_id_97444e9c_fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_author_id_97444e9c_fk_user_id FOREIGN KEY (author_id) REFERENCES public."user"(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: review review_director_id_42ff8e31_fk_directors_theatre_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_director_id_42ff8e31_fk_directors_theatre_id FOREIGN KEY (director_id) REFERENCES public.directors_theatre(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: review review_news_id_25f6914d_fk_news_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_news_id_25f6914d_fk_news_id FOREIGN KEY (news_id) REFERENCES public.news(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: review review_performance_id_88aa2a9d_fk_perfomances_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_performance_id_88aa2a9d_fk_perfomances_id FOREIGN KEY (performance_id) REFERENCES public.perfomances(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: review_reaction review_reaction_review_id_62d4624b_fk_review_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_reaction
    ADD CONSTRAINT review_reaction_review_id_62d4624b_fk_review_id FOREIGN KEY (review_id) REFERENCES public.review(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: review_reaction review_reaction_user_id_f9818521_fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_reaction
    ADD CONSTRAINT review_reaction_user_id_f9818521_fk_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: token_blacklist_blacklistedtoken token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_blacklistedtoken
    ADD CONSTRAINT token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk FOREIGN KEY (token_id) REFERENCES public.token_blacklist_outstandingtoken(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: token_blacklist_outstandingtoken token_blacklist_outstandingtoken_user_id_83bc629a_fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_outstandingtoken
    ADD CONSTRAINT token_blacklist_outstandingtoken_user_id_83bc629a_fk_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

