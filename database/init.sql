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
4	2025-07-12 20:33:17.71969+07	\N	\N	http://localhost:9000/antrakt-images/achievements/99da911b8c3b41d19fa0951f3ffd1b69.jpg	Краевой конкурс любительских театров "Рампа" г. Красноярск 2024 год: Спектакль «Вечно живые» - Лауреат (Гран при).	2024-06-15	{}
1	2025-07-12 20:32:00.953869+07	\N	\N	http://localhost:9000/antrakt-images/achievements/9364d8ca189f48e0bb37c39fc95ac605.webp	Краевой конкурс любительского театрального искусства "Рампа" г. Красноярск: Спектакль «Свадьба» - Диплом 1 степени.	2023-10-04	{}
2	2025-07-12 20:32:18.516156+07	\N	\N	http://localhost:9000/antrakt-images/achievements/7ee3694030c240e8b0f398aa035885ab.jpg	Межрегионального конкурса для взрослых любительских театральных коллективов «АРТ-СИБИРСК», г. Новосибирск: Спектакль «Свадьба» - Дипломанты 3 степени.	2024-03-12	{}
3	2025-07-12 20:32:52.323233+07	\N	\N	http://localhost:9000/antrakt-images/achievements/b35a5865a9104da285aee728a41b541e.jpg	Международный фестиваль любительских и народных театров им. Ф.Г. Раневской "ФЛИНТ#ТРАМПЛИН", г. Москва: Спектакль «Тёща браку не помеха» - Диплом лауреата 2 степени.	2023-11-23	{}
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
5	2025-07-09 22:37:06.858944+07	2026-07-09 11:32:16.620911+07	\N	Екатерина Наконечная	"Норильскникельремонт" Инженер 1 категории	{"Н.В. Гоголь","М.А. Булгаков"}	{"Хью Гласс (Выживший)"}	{"Иван Айвазовский","Исаак Левитан","Клод Моне"}	{"Дневник памяти",1+1,"Один дома","33 несчастья","Молчание ягнят"}	{"Бесприданница (А.Н. Островский)","На дне (М. Горький)","Вишневый сад (А.П. Чехов)","Анна Каренина (Л. Толстой)"}	Если бы смысл театра был только в развлекательном зрелище, быть может, и не стоило бы класть в него столько труда. Но театр есть искусство отражать жизнь	К.С. Станиславский	{"Чужой среди своих"}	{Polnalyubvi}	{"Тёща браку не помеха",Дюймовочка,"Вечно живые","Девочка со спичками",Горка}	{"Тёща Амалия",Жучиха,Нюра,Ложь,Настя}	http://localhost:9000/antrakt-images/actors/6c5e86c969154591bd0a971653b8b2e4.jpg	2023-07-01	\N
13	2025-07-20 12:18:49.222792+07	\N	\N	Авдиенко Инна	свободный "художник"	{"нет такого. Меня цепляют сами произведения, идеи, заложенные в них смыслы. Мне нравятся создания, а не создатели"}	{"нет такого"}	{"очень много разных художников у которых прекрасная передача событий, характеров и состояний через краски. У каждого можно найти что-то интересное, но я никого не могу выделить как \\"любимого\\". Любить можно искусство, любить художника-человека, это про другое"}	{"мне нравятся постановки Марка Захарова"}	{"\\"Обыкновенное чудо\\" (Евгений Шварц)"}	такие цитаты существуют	Неизвестно	{"тоже самое, что и про художников. Музыка подбирается под настроение. Слушаю то, где в словах есть смысл, поэтому современный \\"фольклор\\" я практически не слушаю."}	{Неизвестно}	{"О царе Салтане","Девочка со спичками",Лазарет}	{Повариха,"Бабушка девочки","Галина Петровна"}	http://localhost:9000/antrakt-images/actors/d9bed67328084fbaafd417938c861d28.jpg	2024-07-01	\N
16	2025-07-20 12:35:16.936235+07	2026-07-09 11:32:21.323438+07	\N	Гасанова Оксана	ООО "ННР" ПО"НР" уч.49	{"И.А. Крылов","Л.Н. Толстой"}	{"Их много, и злые, добры, интересные"}	{"Люблю всех чьи картины вызывают эмоцию"}	{"Только который заставил задуматься"}	{Яма}	"Театр жив, пока на сцене «Три сестры», а в зале толпа народа. Вот если будет наоборот, тогда конец"	Неизвестно	{"Редко слушаю, фаворитов среди песен нет"}	{Неизвестно}	{"О царе Салтане","Девочка со спичками","Про козлёнка, который хотел стать взрослым","8 любящих женщин",Монтировщики}	{Ткачиха,Жадность,Петух,Шанель,"Тётя Ася"}	http://localhost:9000/antrakt-images/actors/55c8942322cd4c65b49a30ef3a945891.jpg	2022-07-01	\N
19	2025-07-20 12:55:11.165008+07	2026-07-09 11:32:24.968057+07	\N	Гузель Садртдинова	Норильскникельремонт	{"Эрих Мария Ремарк"}	{"Роберт Локамп, в принципе все главные герои Ремарка"}	{"Ван Гог",Пикассо,Дега,Моне,Сезан}	{Карате-пацан,"Тепло наших тел","Время жить"}	{"Трамвай \\"Желание\\""}	Театр сильнее всего воздействует тогда, когда он делает нереальные вещи реальными. Тогда сцена становится перископом души, позволяющим заглянуть в действительность изнутри	Франц Кафка	{"Here without you"}	{Неизвестно}	{"О царе Салтане","Девочка со спичками","Любовь. Жизнь. Кошки.",Горка,Рикки-Тикки-Тави}	{Прокурор,Уныние,Тамара,"Актриса массовки",Чучундра}	http://localhost:9000/antrakt-images/actors/debc9af4024b49db8059fe8936353cb9.jpg	2023-07-01	\N
17	2025-07-20 12:48:28.363721+07	2026-07-06 18:46:56.698244+07	\N	Фартушина Юлия	архитектор, фотограф	{"Диана Гэблдон"}	{"Капитан Джек Воробей"}	{Тициан,"Сальвадор Дали"}	{"тот который хочется пересматривать много раз и таких фильмов много"}	{}	Театр никогда меня не оставляет. Мой театр всегда со мной"	О. Бузова	{"та которую хочется петь, которая поднимает настроение"}	{Неизвестно}	{"Девочка со спичками",Свадьба,"Вечно живые",Дюймовочка,"8 любящих женщин"}	{"Мать девочки",Мозговая,"Варвара Капитоновна","Мама Дюймовочки",Бабушка}	http://localhost:9000/antrakt-images/actors/b01d180c89fe493e9732d9ab5eb631b2.png	2022-07-01	\N
20	2025-08-12 22:32:39.92117+07	2026-07-08 19:39:46.101868+07	\N	Бордюгова Марина	Салон красоты./парикмахер стилист; эвент "Команда А"/ праздники, корпоративы, свадьбы	{"Михаил Булгаков"}	{"Уилл Тёрнер"}	{"Илья Репин"}	{Перл-Харбор,Люцифер,"Теория большого взрыва"}	{"Трамвай \\"Желание\\""}	Если бы смысл театра был только в развлекательном зрелище, быть может, и не стоило бы класть в него столько труда. Но театр есть искусство отражать жизнь	К.С. Станиславский	{"When I Win"}	{Miyagi}	{Свадьба,"Трамвай 'Желание'","Любовь. Жизнь. Кошки."}	{Тамада,Юнис,Тата}	http://localhost:9000/antrakt-images/actors/22984f2f330b43fc8c8656639b13bd32.jpg	2023-07-01	\N
23	2025-08-22 23:18:18.785721+07	2026-07-09 11:32:30.399135+07	\N	Миронова Татьяна	Индивидуальный предпрениматель	{"Лев Толстой"}	{"Екатерина Великая"}	{"Густав Климт"}	{"Визит к Минотавру"}	{"Старомодная комедия"}	Театр- это сила , соединяющая в себе все виды искусства.	Неизвестно	{Ноктюрн}	{Магомаев}	{"О царе Салтане","Любовь. Жизнь. Кошки.","Внучка для Бабы Яги"}	{Царица,"Мать Юли","Мама Кати"}	http://localhost:9000/antrakt-images/actors/5567767813bb482cac40c66332d2438a.jpg	2024-07-01	\N
4	2025-07-09 21:26:36.871513+07	2026-07-09 11:32:24.919158+07	\N	Дустимова Ксения	Частная практика. Дефектолог, тренер по речи. Детский психолог.	{"Клайв Стэйплз Льюис"}	{"Гарри Поттер"}	{"Леонардо да Винчи"}	{"Люди в чёрном",Человек-паук,"Железный человек"}	{"Ромео и Джульетта (У. Шекспир)"}	Если бы смысл театра был только в развлекательном зрелище, быть может, и не стоило бы класть в него столько труда. Но театр есть искусство отражать жизнь.	К.С. Станиславский	{Воля}	{MIRAVI}	{"О царе Салтане","Девочка со спичками","Тёща браку не помеха","Вечно живые",Дюймовочка,Свадьба,"8 любящих женщин",Рикки-Тикки-Тави}	{Судья,Гнев,Лиза,Антонина,"Ведьма Атрен и Богиня Нерта",Дымба,Габи,Нагайна}	http://localhost:9000/antrakt-images/actors/d36e1a238ecc4b85abb6c855762572c7.jpg	2022-07-01	\N
8	2025-07-10 10:24:22.979062+07	2026-07-09 11:32:30.403124+07	\N	Герасимова Ксения	ООО «Норникель Спутник», Аналитик	{"Терри Пратчетт"}	{"Ганнибал Лектор (сериал)"}	{"Сесилия Викунья"}	{"Дневник Памяти"}	{"Ревизор (Н.В. Гоголь)"}	Давайте ограничимся тем, что скажем, что театр, как и Жизнь, — это мечта, не слишком беспокоясь о лжи.	Жан-Луи Барро	{"How Soon Is Now?"}	{"The Smiths"}	{"Вечно живые","О царе Салтане","Девочка со спичками","Любовь. Жизнь. Кошки.","Внучка для Бабы Яги"}	{Варя,"Судебный писарь",Зависть,Юля,Кот}	http://localhost:9000/antrakt-images/actors/702729378a7f469f8ebc3434d76d6e51.jpg	2024-07-01	\N
10	2025-07-11 21:07:52.419018+07	2026-07-06 18:46:56.686372+07	\N	Умблия Ольга	ПАО " ГМК "Норильский Никель" , Медный завод , инженер.	{"Эрих Мария Ремарк"}	{"Бриджит Джонс"}	{"Сальвадор Дали"}	{"Гордость и Предубеждения (1994 г)","Дневник Бриджит Джонс ( 2001 г)","Городской романс (1971 г)","Одесса (2019 г)"}	{"Вишневый сад (А.П. Чехов)"}	«Пьеса и "роль" для актёра- только "текст". От текста же до игры - расстояние громадное»	Густав Шпет	{"Роковая женщина"}	{"В. Кузьмин"}	{Свадьба,Дюймовочка,"Девочка со спичками","Трамвай 'Желание'","8 любящих женщин"}	{Дашенька,Жаба,Гордыня,"Бланш Дюбуа",Пьеретта}	http://localhost:9000/antrakt-images/actors/1aac1f5b93174c2c93f10430bda71421.jpg	2023-07-01	\N
21	2025-08-21 23:33:42.960499+07	2026-07-08 19:39:46.104916+07	\N	Юсупова Зайнап	Индивидуальный предпрениматель	{"А.С. Пушкин"}	{Белоснежка}	{"Пабло Пикассо"}	{Хатико}	{"Ромэе и Джульетта"}	Умейте любить искусство в себе, а не себя в искусстве.	К.С. Станиславский	{"Мне нравится, что вы больны не мной"}	{"Алла Пугачёва"}	{"Про козлёнка, который хотел стать взрослым","Любовь. Жизнь. Кошки."}	{Коза,Софья}	http://localhost:9000/antrakt-images/actors/296742dea9fe470683c11a22a3f72d05.jpg	2025-07-01	\N
22	2025-08-21 23:38:23.169622+07	2026-07-09 11:32:21.338195+07	\N	Кондратьев Алексей	Норникель Спутник	{"Роберт Хайнлайн"}	{"Валентайн Майкл Смит из романа \\"Чужак в стране чужой\\""}	{"Иван Константинович Айвазовский"}	{Кин-дза-дза}	{"Рок-опера \\"Последнее испытание\\""}	--	Неизвестно	{"Somewhere over the Rainbow"}	{"Израэля Камакавивооле"}	{"Про козлёнка, который хотел стать взрослым",Монтировщики}	{Волчонок,"Анатолий Гурков"}	http://localhost:9000/antrakt-images/actors/4bd91ae0a2824d9e8f58b113e4931ae5.jpg	2025-07-01	\N
7	2025-07-09 23:36:26.811078+07	2026-07-06 18:46:56.665056+07	\N	Постникова Марина	ООО «Норильский обеспечивающий комплекс». Ведущий специалист Группы кадрового администрирования и подбора персонала Отдела оплаты труда и кадровой политики Аппарата управления.	{"Пауло Коэльо"}	{"Миранда Пристли","Форест Гамп","Скарлетт О`Хара"}	{--}	{1+1,"Хижина (2017г.)","Брат (1997г.)"}	{"Дом, где разбиваются сердца (Бернард Шоу)"}	Автор пишет одну пьесу, актеры играют другую, а зрители видят третью.	Шарль Баре	{"мой рок-н-ролл"}	{"Би-2 feat. Чичерина"}	{"О царе Салтане","Трамвай 'Желание'","8 любящих женщин"}	{Царица,Стелла,Огюстина}	http://localhost:9000/antrakt-images/actors/8e67f4603cef4de2aa76d927c2c6274e.jpg	2024-07-01	\N
18	2025-07-20 12:51:14.67282+07	2026-07-08 19:39:46.092379+07	\N	Протченко Татьяна	ПАО ГМК "Норильский Никель" Отдел организации документооборота. Специалист.	{"Эрих Мария Ремарк"}	{"Хюррем (сериал Великолепный век)"}	{"Иван Айвозовский"}	{"⁠Назад в будущее (1985г)"}	{"Гамлет (У. Шекспир)"}	Весь мир — театр, а люди в нём — актёры, для каждого судьба распределяет роли	Неизвестно	{"What have I got to do to make you love me"}	{"Elton John"}	{"О царе Салтане","Про козлёнка, который хотел стать взрослым","8 любящих женщин","Любовь. Жизнь. Кошки."}	{Бабариха,Зайчонок,Луиза,Нюся}	http://localhost:9000/antrakt-images/actors/ff4398c7da304bf5bdd3504fbd0c2fc1.jpg	2023-07-01	\N
24	2026-07-08 10:40:39.410602+07	2026-07-09 11:32:30.412301+07	\N	Харитонова Ева	Городской центр культуры (ГЦК)	{Салтыков-Щедрин}	{"Кот Бегемот - персонаж романа Михаила Булгакова \\"Мастер и Маргарита\\""}	{"Луис Уильям Уэйн"}	{"\\"Визит\\""}	{"\\"Папа\\" - Флориан Зеллер"}	Театр начинается с вешалки	К.С. Станиславский	{"\\"Не забывай\\""}	{Ермак}	{"Маленький принц","Алиса в стране чудес",Морозко,Дюймовочка,"Вечно живые","Любовь. Жизнь. Кошки.","Внучка для Бабы Яги"}	{Принц,"Чеширский кот",Мачеха,Эльф,Вероника,Кошка,"Баба Яга"}	http://localhost:9000/antrakt-images/actors/e8fee4e4f0f74b22b23c53bc19d2a354.jfif	2024-09-01	\N
6	2025-07-09 23:08:08.251611+07	2026-07-09 11:32:24.930455+07	\N	Курченкова Елена	Проектный офис по реализации инвестиционных проектов АО"НТЭК "	{"М. Павич","К. Воннегут","В. Пелевин"}	{"Willy Wonka"}	{"В. Васнецов","Н. Чекколи"}	{Револьвер,"Шапито-шоу: Любовь и Дружба","Шапито-шоу: Сотрудничество и Уважение","Лемони Сникет:33 несчастья",Чай}	{"Шесть персонажей в поисках автора (Л. Пиранделло)"}	Театр больше похож на настоящую жизнь: свои достижения вы выносите на сцену и показываете в течение двух-трёх часов. И больше это никогда не повторится. Я бы сравнил это с хождением по канату в ста футах над землёй и безо всякой страховки. А в кино канат лежит на полу…	Аль Пачино	{Шарманка}	{Пикник}	{"О царе Салтане",Дюймовочка,"Вечно живые","Девочка со спичками",Горка,Рикки-Тикки-Тави}	{Корабельщик,Мышь,"Анна Михайловна Ковалёва",Хореограф,"Жанна Борисовна; Марина, Зульфия Фаридовна",Рикки-Тикки-Тави}	http://localhost:9000/antrakt-images/actors/1094f360a7374fb3aab83958dbc6936e.jpg	2023-07-01	\N
25	2026-07-08 21:44:49.721999+07	2026-07-09 11:32:30.422548+07	\N	Нусс Анастасия	Не указано	{"Ирвин Ялом"}	{"Наташа Ростова"}	{"Владимир Лукич Боровиковский"}	{"\\"Ешь, молись, люби\\""}	{"\\"Волки и Овцы\\" - А.Н. Островский"}	Театр — это такая кафедра, с которой можно много сказать миру добра	Николай Гоголь	{"Pumped Up Kicks"}	{People}	{"О царе Салтане",Лазарет,Горка,Монтировщики,Рикки-Тикки-Тави,"Внучка для Бабы Яги"}	{Писарь,Лилия,"Актриса массовки",Лена,Элли,Катя}	http://localhost:9000/antrakt-images/actors/2fa0793d6ed6422187ad5377f631ea32.png	2024-09-01	\N
15	2025-07-20 12:29:42.726829+07	2026-07-09 11:32:30.426547+07	\N	Захаров Илья	«IT-Куб.Норильск» — филиал автономной некоммерческой организации «Красноярский детский технопарк „Кванториум“»	{"Лев Толстой","Михаил Булгаков"}	{"Тоби Маршал (\\"Жажда скорости\\")","Тони (\\"Зелёная книга)"}	{"Репин Илья"}	{"\\"Жажда скорости\\" (2014г.)","\\"Зелёная книга\\" (2018г.)","\\"Пираты Карибского моря\\" (все части)"}	{"\\"Бесприданница\\" (А.Н. Островский)"}	Молодые актеры! Бойтесь ваших поклонниц! Ухаживайте за ними, если угодно, но не говорите с ними об искусстве! Учитесь вовремя, с первых шагов слушать, понимать и любить жестокую правду о себе! И знайте тех, кто вам поможет её сказать. Вот с такими людьми говорите побольше об искусстве. Пусть они почаще ругают вас	К.С. Станиславский	{"Рюмка водки на столе"}	{"Григорий Лепс"}	{Дюймовочка,"Вечно живые","Девочка со спичками",Свадьба,Лазарет,"Трамвай 'Желание'","О царе Салтане",Монтировщики,"Внучка для Бабы Яги"}	{"Майский Жук",Владимир,Мальчик,Ять,"Терехов Иван",Юноша,"Князь Гвидон",Михаил,Гном}	http://localhost:9000/antrakt-images/actors/d461c2d0d9144e63b61f7522b3e63c46.jpg	2022-07-01	\N
9	2025-07-10 19:53:45.492165+07	2026-07-09 11:32:24.937056+07	\N	Кононыхин Михаил	"РМ Инжиниринг Лимитед". Ведущий специалист по финансовому контролю	{"А.П. Чехов"}	{"Крот Фри (Дюймовочка)"}	{"М. Врубель"}	{"Летят журавли"}	{"Трамвай Желания (Т. Уильямс)"}	Учитесь слушать, понимать и любить правду о себе	К.С. Станиславский	{"Последняя поэма"}	{"к/ф \\"Вам и не снилось\\""}	{Дюймовочка,"Вечно живые","Трамвай 'Желание'",Горка,Монтировщики,Рикки-Тикки-Тави}	{"Крот Фри","Фёдор Иванович",Митч,"Актёр массовки","Седой Человек",Наг}	http://localhost:9000/antrakt-images/actors/1295c150187049b383871362b8b117be.jpg	2024-07-01	\N
14	2025-07-20 12:23:29.587566+07	2026-07-09 11:32:21.37879+07	\N	Евстигнеев Ярослав	ЗФ ПАО "ГМК Норильский Никель", Центр диагностики - Специалист по неразрушающему контролю	{"Эдмонд Гамильтон"}	{"Гаррет (Приключения Гаррета)","Глен Кука"}	{"А.А. Леонов"}	{"Назад в будущее"}	{Ханума,Примадонны}	Для хороших актеров нет дурных ролей	Неизвестно	{"My Dark Disquiet"}	{"Poets of the Fall"}	{"Девочка со спичками","Вечно живые","Про козлёнка, который хотел стать взрослым",Горка,Монтировщики}	{Чревоугодие,Степан,Петух,"Актёр массовки",Александр}	http://localhost:9000/antrakt-images/actors/966b52fe96ad4cf1a73135d5133f8974.jpg	2024-07-01	\N
3	2025-07-09 21:21:23.002813+07	2026-07-09 11:32:24.901887+07	\N	Молодчая Анна	ООО «Медвежий ручей» оператор ЭВМ	{"Борис Акунин"}	{"Чендлер (сериал Друзья)","Тирион Ланистер"}	{"Репин Илья"}	{"Республика Шкид (1966г.)","1408 (2007г.)","Белый Бим Чёрное Ухо (1977г.)"}	{"На дне (М. Горький)","Чайка (А. Чехов)"}	Если бы смысл театра был только в развлекательном зрелище, быть может, и не стоило бы класть в него столько труда. Но театр есть искусство отражать жизнь.	К.С. Станиславский	{"I Will Always Love You"}	{"Whitney Houston"}	{"Вечно живые","Девочка со спичками","Про козлёнка, который хотел стать взрослым","8 любящих женщин",Рикки-Тикки-Тави}	{Ирина,Ангел,Козлёнок,Сюзон,Чуя}	http://localhost:9000/antrakt-images/actors/581ab8bb29a6499595b80a30c32d0bce.jpg	2023-07-01	\N
11	2025-07-13 20:49:28.361468+07	2026-07-09 11:32:24.947069+07	\N	Кравченко Сергей	ООО "Норильскникельремонт", главный специалист отдела экологии лицензирования и качества.	{"Ричард Бах","Виктор Пелевин","Карлос Кастанеда","Братья Стругацкие","Габриэль Гарсия Маркес","Михаил Булгаков"}	{"Чертенок 13"}	{"Густав Климт"}	{Револьвер,"Упражнения в прекрасном","Танец Дели","Весна, лето, осень, зима и снова весна",Кин-Дза-Дза,"Бойцовский клуб","Собачье сердце","Как Царь Петр Арапа женил, Узник замка Иф"}	{"Сказка про последнего ангела"}	Весь мир - театр, а люди в нём - актёры! И каждый не одну играет роль	Уильям Шекспир	{"А знаешь, всё ещё будет..."}	{"А. Пугачева"}	{"Вечно живые","О царе Салтане","Девочка со спичками","Трамвай 'Желание'",Горка,Монтировщики,Рикки-Тикки-Тави}	{Степан,"Царь Салтан","Отец девочки",Стенли,"Олег; Дядя Ваня",Олег,"Папа Джозеф"}	http://localhost:9000/antrakt-images/actors/0b7d06c505f44187a9b5caa20a652aa7.jpg	2024-07-01	\N
12	2025-07-20 12:05:39.220656+07	2026-07-09 11:32:24.955063+07	\N	Качаева Назира	Ресо-Гарантия специалист по страхованию	{"Михаил Булгаков"}	{"Хюррем (Великолепный век)","Джек Воробей"}	{"Сальвадор Дали"}	{"Унесённые ветром","Пираты Карибского моря"}	{"\\"Дядя Ваня\\" (А.П. Чехов)"}	Высшая степень мастерства комедийного актера - когда над его плачем, смеются; Высшая степень мастерства драматического актера - когда над его смехом, плачут	Неизвестно	{greedy}	{"Tate McRae"}	{"О царе Салтане","Про козлёнка, который хотел стать взрослым","Любовь. Жизнь. Кошки.",Рикки-Тикки-Тави}	{"Царевна Лебедь",Зайчиха,Лара,"Мама Мэри"}	http://localhost:9000/antrakt-images/actors/1fbd3ee91e2a441c886c38b935ae5f50.jpg	2024-07-01	\N
\.


--
-- Data for Name: archive; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.archive (id, created_at, updated_at, deleted_at, description, premiere_date, afisha, image_url, title, archive_image, age_limit, images_list) FROM stdin;
1	2025-07-12 21:49:33.835069+07	\N	\N	12 апреля в 18:00 в Малом зале Городского центра культуры состоялся литературный вечер, посвященный русскому драматургу Александру Николаевичу Островскому.\n\n12 апреля исполнится 202 года со дня рождения Александра Николаевича Островского. Гений русской драматургии, чьи произведения до сих пор покоряют сердца зрителей по всему миру. Его пьесы — это зеркало русской души, отражающее жизнь во всем её многообразии.\n\nВ этот особенный день театр-студия «Антракт» приглашает вас окунуться в мир Островского! Наши артисты, с любовью и преданностью делу, подготовили для вас уникальную программу - отрывки из самых известных и любимых пьес великого драматурга. Вы увидите, как оживают сцены, давно ставшие классикой, но не утратившие своей остроты и актуальности.	2025-04-12	f	http://localhost:9000/antrakt-images/archive/69e4890f2ac5425fb4d4905ca5d22c0e.jpg	Вечер, посвящённый русскому драматургу О.Н. Островскому	http://localhost:9000/antrakt-images/archive/7d56d7aff1aa48b282b61a785f9d092f.jpg	12+	{}
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
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add user	4	add_user
14	Can change user	4	change_user
15	Can delete user	4	delete_user
16	Can view user	4	view_user
17	Can add content type	5	add_contenttype
18	Can change content type	5	change_contenttype
19	Can delete content type	5	delete_contenttype
20	Can view content type	5	view_contenttype
21	Can add session	6	add_session
22	Can change session	6	change_session
23	Can delete session	6	delete_session
24	Can view session	6	view_session
25	Can add user	7	add_user
26	Can change user	7	change_user
27	Can delete user	7	delete_user
28	Can view user	7	view_user
29	Can add achievements	8	add_achievements
30	Can change achievements	8	change_achievements
31	Can delete achievements	8	delete_achievements
32	Can view achievements	8	view_achievements
33	Can add actors	9	add_actors
34	Can change actors	9	change_actors
35	Can delete actors	9	delete_actors
36	Can view actors	9	view_actors
37	Can add archive	10	add_archive
38	Can change archive	10	change_archive
39	Can delete archive	10	delete_archive
40	Can view archive	10	view_archive
41	Can add directors theatre	11	add_directorstheatre
42	Can change directors theatre	11	change_directorstheatre
43	Can delete directors theatre	11	delete_directorstheatre
44	Can view directors theatre	11	view_directorstheatre
45	Can add news	12	add_news
46	Can change news	12	change_news
47	Can delete news	12	delete_news
48	Can view news	12	view_news
49	Can add peromances	13	add_peromances
50	Can change peromances	13	change_peromances
51	Can delete peromances	13	delete_peromances
52	Can view peromances	13	view_peromances
53	Can add perfomances	13	add_perfomances
54	Can change perfomances	13	change_perfomances
55	Can delete perfomances	13	delete_perfomances
56	Can view perfomances	13	view_perfomances
57	Can add blacklisted token	14	add_blacklistedtoken
58	Can change blacklisted token	14	change_blacklistedtoken
59	Can delete blacklisted token	14	delete_blacklistedtoken
60	Can view blacklisted token	14	view_blacklistedtoken
61	Can add outstanding token	15	add_outstandingtoken
62	Can change outstanding token	15	change_outstandingtoken
63	Can delete outstanding token	15	delete_outstandingtoken
64	Can view outstanding token	15	view_outstandingtoken
65	Can add performance show	16	add_performanceshow
66	Can change performance show	16	change_performanceshow
67	Can delete performance show	16	delete_performanceshow
68	Can view performance show	16	view_performanceshow
69	Can add performance cast	17	add_performancecast
70	Can change performance cast	17	change_performancecast
71	Can delete performance cast	17	delete_performancecast
72	Can view performance cast	17	view_performancecast
73	Can add review	18	add_review
74	Can change review	18	change_review
75	Can delete review	18	delete_review
76	Can view review	18	view_review
77	Can add review reaction	19	add_reviewreaction
78	Can change review reaction	19	change_reviewreaction
79	Can delete review reaction	19	delete_reviewreaction
80	Can view review reaction	19	view_reviewreaction
81	Can add email verification	20	add_emailverification
82	Can change email verification	20	change_emailverification
83	Can delete email verification	20	delete_emailverification
84	Can view email verification	20	view_emailverification
85	Can add birthday greeting	21	add_birthdaygreeting
86	Can change birthday greeting	21	change_birthdaygreeting
87	Can delete birthday greeting	21	delete_birthdaygreeting
88	Can view birthday greeting	21	view_birthdaygreeting
89	Can add site content	22	add_sitecontent
90	Can change site content	22	change_sitecontent
91	Can delete site content	22	delete_sitecontent
92	Can view site content	22	view_sitecontent
93	Can add actor birthday	23	add_actorbirthday
94	Can change actor birthday	23	change_actorbirthday
95	Can delete actor birthday	23	delete_actorbirthday
96	Can view actor birthday	23	view_actorbirthday
97	Can add vk parser state	24	add_vkparserstate
98	Can change vk parser state	24	change_vkparserstate
99	Can delete vk parser state	24	delete_vkparserstate
100	Can view vk parser state	24	view_vkparserstate
101	Can add site review	25	add_sitereview
102	Can change site review	25	change_sitereview
103	Can delete site review	25	delete_sitereview
104	Can view site review	25	view_sitereview
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
1	pbkdf2_sha256$1000000$CGFsf6hrR1pCzRslk2bkZF$XsFbSTIjKbmtAjYO1jLJcFZsu16o1b9ApkPDsR4Rj0g=	2025-07-01 19:11:39.469295+07	t	admin			zaharovila780@gmail.com	t	t	2025-07-01 19:11:13.792095+07
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
1	Сегодня день рождения у {name}! 🎉 Коллектив Норильского народного театра от всей души поздравляет и желает вдохновения, ярких ролей и оваций!	t	2026-07-09 00:06:01.935403+07
2	С днём рождения, {name}! 🎂 Пусть каждый выход на сцену дарит радость, а зал всегда встречает тёплыми аплодисментами!	t	2026-07-09 00:06:01.936526+07
3	Поздравляем {name} с днём рождения! 🌟 Желаем творческих успехов, крепкого здоровья и незабываемых премьер!	t	2026-07-09 00:06:01.937132+07
\.


--
-- Data for Name: directors_theatre; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directors_theatre (id, created_at, updated_at, deleted_at, name, description, perfomances, years, team_name, image_url) FROM stdin;
1	2025-07-03 20:36:37.955881+07	2026-07-08 20:27:09.372843+07	\N	Дустимов Андрей	Дустимов Андрей Аидмазонович в феврале 2020 года создал на базе учреждения детскую театральную студию «ДА». В 2021 году создал театр-студию «Антракт» для взрослых. Закончил в 2013 г. «Московский государственный университет культуры и искусств», в 2021 г. поступил в «Новосибирский государственный театральный институт» по специальности режиссер драмы, учится по сей день. В 2020 году прошел профессиональную переподготовку в АНО «Академия дополнительного профессионального образования» по специальности «Руководитель театрального коллектива». Стаж в должности – 5 лет.	{"Предновогодняя сказка «Морозко»","Драматическая сказка «Маленький принц»","Спектакль «Девочка со спичками»","Предновогодняя сказка «По Щучьему веленью»","Комедия А.П. Чехова «Свадьба»","Драматическая сказка «Алиса»","Комедия «Тёща браку не помеха»","Спектакль «Вечно живые»","Сказка «Дюймовочка»","Сказка-фарс «О царе Салтане»","Спектакль \\"Трамвай 'Желание'\\"","Трагикомедия \\"4айка\\"","Сказка \\"Про козлёнка, который хотел стать взрослым\\"","8 любящих женщин",Горка,"Любовь. Жизнь. Кошки.",Монтировщики,Рикки-Тикки-Тави,"Внучка для Бабы Яги"}	{2021,2022,2022,2023,2023,2023,2024,2024,2024,2024,2024,2025,2025,2025,2025,2026,2026,2026,2026}	{"Образцовый коллектив театральная студия «ДА»","Образцовый коллектив театральная студия «ДА»","Театр-студия «Антракт»","Образцовый коллектив театральная студия «ДА»","Театр-студия «Антракт»","Образцовый коллектив театральная студия «ДА»","Театр-студия «Антракт»","Театр-студия «Антракт»","Театр-студия «Антракт» и Образцовый коллектив театральная студия «ДА»","Театр-студия «Антракт»","Театр-студия \\"Антракт\\"","Театр-студия \\"Антракт\\"","Театр-студия \\"Антракт\\"","Труппа норильского народного театра","Труппа норильского народного театра","Труппа норильского народного театра","Труппа норильского народного театра","Труппа норильского народного театра","Труппа норильского народного театра"}	http://localhost:9000/antrakt-images/directors/a13b1ec76a014238a6a15e1db3d2ed0d.jpg
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
1	admin	logentry
2	auth	permission
3	auth	group
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	my_app1	user
8	my_app1	achievements
9	my_app1	actors
10	my_app1	archive
11	my_app1	directorstheatre
12	my_app1	news
13	my_app1	perfomances
14	token_blacklist	blacklistedtoken
15	token_blacklist	outstandingtoken
16	my_app1	performanceshow
17	my_app1	performancecast
18	my_app1	review
19	my_app1	reviewreaction
20	my_app1	emailverification
21	my_app1	birthdaygreeting
22	my_app1	sitecontent
23	my_app1	actorbirthday
24	my_app1	vkparserstate
25	my_app1	sitereview
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
2	2025-07-10 19:05:00.778217+07	\N	\N	Триумф на Рампе!	Триумф на «Рампе»! Театр выходит в финал краевого конкурса!\nОтличные новости! Театр принял участие в отборочном этапе краевого конкурса любительского театрального искусства «Рампа» и одержал блестящую победу, завоевав Диплом I степени!\n\nЭто огромное достижение, подтверждающее талант и усердие всего коллектива. Теперь, вдохновленные этим успехом, театр готовится к следующему, ещё более ответственному этапу.\n\nВ ноябре коллектив отправится в Красноярск, чтобы побороться за победу в финале конкурса «Рампа»! Это будет серьезное испытание, но театр полон решимости показать всё, на что способен.\n\nПоздравляем всех, кто причастен к этой замечательной победе, и желаем удачи в финале! Верим, что в Красноярске талант и страсть к театру приведут коллектив к новым высотам.	http://localhost:9000/antrakt-images/news/c76c13a42aaf45f6a1711d68193eb4dc.jpg	Триумф на «Рампе»! Театр выходит в финал краевого конкурса!\nОтличные новости! Театр принял участие в отборочном этапе краевого конкурса любительского театрального искусства «Рампа» и одержал блестящую победу, завоевав Диплом I степени!	t	{http://localhost:9000/antrakt-images/news/1aabd33c02a74738a9af4f8eb7cee6e8.webp}	2025-05-23
4	2025-08-12 01:27:37.268098+07	\N	\N	Наш театр вновь сияет!	Наш театр вновь сияет на небосклоне искусства! Мы с гордостью сообщаем: на прошедшем Всероссийской творческом конкурсе мы вновь одержали верх и завоевали дипломы победителей!\n\nЭто потрясающий результат, подтверждающий не только талант, но и колоссальный труд, усердие и самоотдачу каждого члена нашей команды. Каждая победа — это общая заслуга, и мы бесконечно гордимся каждым нашим участником!\n\nСпасибо всем, кто верил в нас, поддерживал и вдохновлял на новые свершения. Ваши аплодисменты — лучшая награда!\n\nВперёд, к новым вершинам! 🚀	http://localhost:9000/antrakt-images/news/2a69b92bdc004a24a9760d7caa178aab.jpg	Наш театр вновь сияет на небосклоне искусства! Мы с гордостью сообщаем: на прошедшем Всероссийской творческом конкурсе мы вновь одержали верх и завоевали дипломы победителей!	t	{}	2025-07-31
1	2025-07-03 21:04:13.489618+07	2025-07-03 21:00:18.588+07	\N	Важная награда!	Сегодня в театре-студии «Антракт» особенный день, наполненный радостью и гордостью! Наш руководитель был удостоен благодарственного письма от главы города Дмитрия Владимировича Карасева за вклад в развитие культуры нашего города. Это признание – результат кропотливой и преданной работы всей нашей команды, и мы от всего сердца поздравляем Дустимова Андрея Аидмазоновича с этой заслуженной наградой!\n\nИ, конечно же, мы не можем не поздравить всех причастных с Днём работника культуры! Этот праздник – дань уважения тем, кто посвятил свою жизнь искусству, кто творит и вдохновляет, кто делает наш мир ярче и богаче.\n\nТеатр-студия «Антракт» желает всем работникам культуры неиссякаемого вдохновения, творческих взлётов, благодарных зрителей и слушателей! Пусть каждый ваш проект будет наполнен любовью и страстью, пусть искусство дарит вам радость и удовлетворение!\n\nМы верим, что культура – это душа общества, и мы гордимся тем, что являемся частью этого великого дела. Спасибо вам за ваш труд!	http://localhost:9000/antrakt-images/news/37a4f400a3b14d8ebd791753790327a7.jpg	Сегодня в театре-студии «Антракт» особенный день, наполненный радостью и гордостью! Наш руководитель был удостоен благодарственного письма от главы города Дмитрия Владимировича Карасева за вклад в развитие культуры нашего города.	t	{}	2025-03-10
3	2025-07-16 19:29:04.717898+07	\N	\N	🚀 ПОБЕДА! 🚀	🚀 ПОБЕДА! 🚀\n\nНаш театр с огромной гордостью сообщает: мы приняли участие в международном фестивале-конкурсе искусства и творчества «Новые таланты» и заняли призовые места!\n\nЭто фантастический успех и подтверждение нашего таланта! Спасибо всем, кто был с нами!	http://localhost:9000/antrakt-images/news/d06a4bc81d7a4aa5af40ecdb71338c59.jpg	Наш театр с огромной гордостью сообщает: мы приняли участие в международном фестивале-конкурсе искусства и творчества «Новые таланты» и заняли призовые места!	t	{http://localhost:9000/antrakt-images/news/3b3e381234d4407f860b1c93969ed7ff.jpg,http://localhost:9000/antrakt-images/news/0ba36a14ce474e68bf23645f23e86e16.jpg,http://localhost:9000/antrakt-images/news/f11e78d79cd746c391534be5a3654481.jpg}	2025-07-16
\.


--
-- Data for Name: perfomances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.perfomances (id, created_at, updated_at, deleted_at, title, author, genre, age_limit, duration, premiere_date, production_team, description, afisha, image_url, performances_image, images_list, ticket_url, roles_propagated, director_id, production_collective, production_title, production_year, director_propagated) FROM stdin;
8	2025-07-22 20:31:35.897916+07	2026-07-06 18:17:48.829944+07	\N	4айка	Антон Чехов	Трагикомедия	16+	02:00:00	2025-03-22	{"Режиссер спектакля – Андрей Дустимов","Художник по свету – Иван Пирютко","Звукорежиссер – Дмитрий Цитович"}	В этом году мы отмечаем 165-летие со дня рождения великого русского драматурга Антона Павловича Чехова. Театр-студия "Антракт" подготовила для вас особенный подарок: нашу интерпретацию знаменитой пьесы. Режиссер предлагает свежий взгляд на классическое произведение, перенося нас в современный контекст. Цифра "4" в названии спектакля "4айка" не случайна. Она символизирует число кармических задач, которое, согласно нумерологии, призывает нас жить в реальности, отбросить иллюзии и смотреть правде в глаза.\nСпектакль представляет собой иллюзию, как смысл в жизни. Герои пьесы живут в мире, оторванном от реальности. Они мечтают о любви, славе, признании, о новой жизни, но эти мечты часто оказываются несбыточными. Чехов подчеркивает, что мечты, не подкрепленные реальными действиями и усилиями, обречены на провал.	f	http://localhost:9000/antrakt-images/perfomances/1c6e5a2549ce4818b7326db3c4913685.jpg	http://localhost:9000/antrakt-images/perfomances/5622865d57584770a51a2822bac3a432.jpg	{http://localhost:9000/antrakt-images/perfomances/d7cab0ea558e46e08b599da441318a43.jpg,http://localhost:9000/antrakt-images/perfomances/035b479cf6344c69831472c09f786ae0.jpg,http://localhost:9000/antrakt-images/perfomances/9d82d1658bcf497d80f16685e531906e.jpg,http://localhost:9000/antrakt-images/perfomances/8a8a224a6aba41a1ba6b2e89bced5915.jpg,http://localhost:9000/antrakt-images/perfomances/2333ca55325847bfbfc1c932438967a7.jpg}		t	\N			\N	f
2	2025-07-11 14:45:25.809834+07	2026-07-06 18:10:02.979797+07	\N	Трамвай 'Желание'	Теннеси Уильямс	Драма	18+	01:40:00	2024-09-28	{"Режиссёр спектакля - Андрей Дустимов","Художник по свету – Иван Пирютко","Звукорежиссер – Дмитрий Цитович"}	Бланш Дюбуа, хрупкая и уязвимая женщина, ищет спасения в объятиях сестры. Но вместо утешения находит лишь безжалостную реальность. Ее мир, построенный на иллюзиях и воспоминаниях, рушится на глазах. Психологическая драма "Трамвай "Желание" – это история о столкновении мечты и действительности, о потере и обретении.	f	http://localhost:9000/antrakt-images/perfomances/f6b0343c872a40daa14ed8a2628912db.jpg	http://localhost:9000/antrakt-images/perfomances/95df3230ea1b415a9e53395f0ad273d4.jpg	{http://localhost:9000/antrakt-images/perfomances/7ff5dd5dbbe147fcaa42b8f86425b0c2.jpg,http://localhost:9000/antrakt-images/perfomances/c6f4746318c0414a96c9f0a60ba02da8.jpg,http://localhost:9000/antrakt-images/perfomances/fd1c9f8b6e3a417592d6b6f97d8eace4.jpg,http://localhost:9000/antrakt-images/perfomances/73a353b4c2d74bde908e53401e344358.jpg,http://localhost:9000/antrakt-images/perfomances/e7bda4aff15d4dc49a6866a993bb947f.jpg}		t	\N			\N	f
9	2025-07-22 20:34:59.8631+07	2026-07-06 18:18:36.542665+07	\N	Одна вторая	С. Дерби	Моноспектакль	16+	00:55:00	2025-05-17	{"Режиссёр спектакля - Марина Шевелер","Художник по свету - Алексей Казаринов"}	«Одна-Вторая» - участник престижного конкурса «Золотой фонд театральных постановок России 2025». Эта смешная и одновременно трогательная история проведет нас сквозь откровения женщины, чья жизнь неожиданно обрела публичность и узнаваемость. Несмотря на обстоятельства, которые, казалось бы, должны сломить, она учится жить с достоинством, сохраняя в себе удивительную женственность и неиссякаемую доброту. «Одна-Вторая» — это исследование стойкости духа, умения находить свет даже в самые темные времена, и напоминание о том, что истинная красота человека часто скрыта от поверхностного\nвзгляда.\nИсполнительница главной роли Елена Телегина является вдохновителем постановки. Талантливый режиссер, преподаватель кафедры актерского мастерства и режиссуры Новосибирского государственного театрального института, которая сотрудничает с непрофессиональным театром «Антракт» над спектаклем «Лазарет». Обладая глубоким пониманием человеческой психологии и богатым актерским опытом, Елена Телегина мастерски воплощает на сцене образ героини, передавая всю палитру ее эмоций. Зритель сможет проследить за ее внутренним миром, за тем, как неожиданная известность влияет на ее самовосприятие и взаимоотношения с окружающими, и вместе с ней попытаться ответить на вопросы, которые ставит спектакль.	f	http://localhost:9000/antrakt-images/perfomances/064954bb40a2441fa5ad98c02980553e.jpg	http://localhost:9000/antrakt-images/perfomances/3a7182532a6246779d0e6021aa1b81c1.jpg	{http://localhost:9000/antrakt-images/perfomances/8951836fc3d44a0d993e492103aa0a67.jpg,http://localhost:9000/antrakt-images/perfomances/dec8c6cd99134560a18e05ef10be1fbe.jpg,http://localhost:9000/antrakt-images/perfomances/f0dd8ae769694784b4423d31873c70c6.jpg,http://localhost:9000/antrakt-images/perfomances/367af6ef651f4ef58a723788394fe310.jpg,http://localhost:9000/antrakt-images/perfomances/b97b4e69e7c34a6b8d4eb80e95ffd642.jpg}		t	\N			\N	f
5	2025-07-22 20:20:40.333226+07	2026-07-06 18:14:26.271738+07	\N	Тёща браку не помеха	Лилия Моцарь	Комедия	18+	01:00:00	2022-09-30	{"Режиссер спектакля – Андрей Дустимов","Художник по свету – Ильяс Байсалов","Звукорежиссер – Артем Кузьменко"}	Амалия – не просто теща, а настоящая стратег. Скрупулезно изучив семейную динамику, она разрабатывает хитроумный план, чтобы спасти брак своей дочери. Ее методы нестандартны и часто вызывают смех. Но за каждой шуткой скрывается глубокое понимание человеческой психологии. В роли гениального режиссера Амалия умело манипулирует событиями, ставя перед героями спектакля нелегкие задачи. Каждый персонаж – это отдельная история, полная страхов, надежд и противоречий. Амалия же мастерски сплетает их в единый узор.	f	http://localhost:9000/antrakt-images/perfomances/51b0b2a731be49c29e8f9a92a24a6d47.jpg	http://localhost:9000/antrakt-images/perfomances/a52084115a1b4464878be6e965083a8e.jpg	{http://localhost:9000/antrakt-images/perfomances/21a1d53576f24d00870fcbe289ba50fb.jpg,http://localhost:9000/antrakt-images/perfomances/6c6c011cbc27490096d4f69da97a84c1.jpg,http://localhost:9000/antrakt-images/perfomances/2056ac5be4c94a1797b9913edd23848e.jpg,http://localhost:9000/antrakt-images/perfomances/3c84fe058a084ed18ae02253c89f2b75.jpg,http://localhost:9000/antrakt-images/perfomances/c63f4146be7c47098ec82f953bfdcabe.jpg}		t	\N			\N	f
6	2025-07-22 20:24:49.781842+07	2026-07-06 18:15:15.483823+07	\N	Вечно живые	Виктор Розов	Драма	16+	01:25:00	2024-04-27	{"Режиссер спектакля – Андрей Дустимов","Художник по свету – Ильяс Байсалов","Звукорежиссер – Денис Золоторев"}	"Вечно живые" - драматический спектакль о том, как война пришла в обычную советскую молодую семью. Он мог бы достичь небывалых высот в инженерии. Она могла бы стать талантливым скульптором. И они могли бы прожить долгую и насыщенную жизнь вместе. Но судьба преподносит героям суровое испытание, которое заставляет каждого сделать нелегкий нравственный выбор, поделив их на два лагеря: «ради людей» и «ради себя». Жестокая реальность войны проявляет в каждом человеке истинную сущность. Как выжить и не потерять себя в это поистине мрачное время в истории нашей Родины?	f	http://localhost:9000/antrakt-images/perfomances/0aebce2956374385bdae9bd8c2aa21d0.jpg	http://localhost:9000/antrakt-images/perfomances/54e2715f7bff40ed86403ee3abe917a8.jpg	{http://localhost:9000/antrakt-images/perfomances/5db09d7f8d444c41b18f465ac75ef2f0.jpg,http://localhost:9000/antrakt-images/perfomances/66d39cb7eab648779d77d7de416a1f03.jpg,http://localhost:9000/antrakt-images/perfomances/790dbad8a437460a8e00aa6a902dc9f2.jpg,http://localhost:9000/antrakt-images/perfomances/a9acb7c7f1e44f1f91538e1074e0eb08.jpg,http://localhost:9000/antrakt-images/perfomances/dff9778e45904053a61de99431f03322.jpg}		t	\N			\N	f
1	2025-07-02 22:04:43.080874+07	2025-07-02 21:54:13.096+07	\N	Дюймовочка	Ганс Христиан Андерсен	Сказка	6+	00:52:00	2024-03-24	{"Режиссер спектакля – Андрей Дустимов","Художник по свету – Иван Пирютко","Звукорежиссер – Андрей Колябин"}	Знакомая всем с детства сказка Ганса Христиана Андерсена «Дюймовочка» предстанет перед вами в новом, необычном свете. Мало кто знает, что, создавая эту историю, Андерсен черпал вдохновение в древних легендах о крошечных человечках, которых в германо-скандинавских мифах называли «пикси». Эти миниатюрные существа обитали в самых разных уголках мира.\nНаш спектакль расскажет о маленькой девочке, которая оказывается лицом к лицу с большим и загадочным миром. Не имея опыта и знаний, она отправляется в увлекательное путешествие, полное приключений. На своем пути она встретит множество удивительных персонажей и столкнется с различными испытаниями. Вместе с Дюймовочкой зрители отправятся в поиски ее истинного предназначения.	f	http://localhost:9000/antrakt-images/perfomances/71c4499a17bc497fa0659bb395279bbf.jpg	http://localhost:9000/antrakt-images/perfomances/5ffc4397173b45b09c96a5a15b05c284.png	{http://localhost:9000/antrakt-images/perfomances/8b7b483cf5344a5d9b43c757b346c933.jpg,http://localhost:9000/antrakt-images/perfomances/42dec72a2b7441fea62f8def3fc1de8e.jpg,http://localhost:9000/antrakt-images/perfomances/ffa9e23735cb4b97a28f069594d81eca.jpg,http://localhost:9000/antrakt-images/perfomances/f983b8f65464499baa67220de649e436.jpg,http://localhost:9000/antrakt-images/perfomances/ab8e6ad3778c416d8c21cf185b4b52aa.jpg}		f	\N			\N	f
11	2025-07-28 19:04:43.491792+07	2026-07-06 18:20:19.252521+07	\N	Про козлёнка, который хотел стать взрослым	Дмитрий Бочаров	Сказка	0+	00:45:00	2025-06-01	{"Режиссёр спектакля - Андрей Дустимов","Хореограф - Елена Курченкова"}	1 июня в 15:00 Большом зале Городского центра культуры состоится премьера благотворительного спектакля «Про Козлёнка, который хотел стать взрослым», посвященный Международному дню защиты детей.\n\nАвтором этой замечательной истории является талантливый драматург Дмитрий Бочаров. Его пьесы отличаются теплотой, мудростью и способностью говорить с детьми на понятном и увлекательном языке.\n\nЭта постановка расскажет юным зрителям и их родителям о взрослении, о мечтах и о том, как важно оставаться собой, даже стремясь к чему-то новому. Спектакль обещает быть ярким, музыкальным и поучительным, наполненным добрым юмором и важными жизненными уроками.\n\nЧтобы сделать праздник по-настоящему незабываемым, в 14:30 в Выставочном зале начнётся развлекательная программа для детей! Вас ждут веселые игры, конкурсы, аниматоры и множество сюрпризов, которые подарят отличное настроение перед просмотром спектакля.\n\nОтметьте Международный день защиты детей всей семьей в Городском центре культуры!	f	http://localhost:9000/antrakt-images/perfomances/eab5c907fa014b83b8bbbf30873e16e7.jpg	http://localhost:9000/antrakt-images/perfomances/9f10090b0eb848fa8984202c6036c942.jpg	{http://localhost:9000/antrakt-images/perfomances/5baaed139f6649ebbb5f93796c4a6a19.jpg,http://localhost:9000/antrakt-images/perfomances/14410bf7e4084dbaad174b1b8ee3cbf4.jpg,http://localhost:9000/antrakt-images/perfomances/aec8a30e5bfa4b70adfb6f5ff0ebb8f3.jpg,http://localhost:9000/antrakt-images/perfomances/eed89c34bae340ef8cdbdfb69ffff151.jpg,http://localhost:9000/antrakt-images/perfomances/4525de06e5964bfe9c8bc4b3d8d79a35.jpg}		t	\N			\N	f
3	2025-07-14 17:39:53.517562+07	2026-07-09 11:31:50.627606+07	\N	О царе Салтане	Андрей Дустимов	Сказка-фарс	16+	00:50:00	2024-05-11	{"Режиссёр спектакля - Андрей Дустимов","Художник по свету – Ильяс Байсалов","Звукорежиссер – Артем Кузьменко"}	«Не судите, да не судимы будете» — это библейское изречение уже тысячи лет остаётся актуальным. Главный герой постановки - царь Салтан, который предстаёт перед судом за совершённые проступки. Царь Салтан – великодушный и наивный правитель. Он, как большой ребенок, топающий ногами, слепо верящий придворной лжи и мечтающий о простом счастье. Но как он мог оказаться на скамье подсудимых? Это и предстоит выяснить нашему дорогому зрителю - действительно ли Салтан виновен, или же три сестрицы дерзко его оклеветали.	f	http://localhost:9000/antrakt-images/perfomances/5ebe9262ecae4200b9a29820c63d13be.jpg	http://localhost:9000/antrakt-images/perfomances/ee37984ae5bc4a5696d6309f39e7d20b.jpg	{http://localhost:9000/antrakt-images/perfomances/6a0cb2f4374f4d8c8fb61c0f97d228cb.jpg,http://localhost:9000/antrakt-images/perfomances/2eb3113a269f46319f51c9347ac26583.jpg,http://localhost:9000/antrakt-images/perfomances/a8170b8ddb134011a92578197e8ee84f.jpg,http://localhost:9000/antrakt-images/perfomances/4c411a321c0e4a638f5a3a7f8684bfcd.jpg,http://localhost:9000/antrakt-images/perfomances/b7b3937db6ba4f89a31d4eef04e604c6.jpg}	https://iframeab-pre5855.intickets.ru	t	\N			\N	f
4	2025-07-22 20:04:11.726655+07	2026-07-06 18:13:09.745595+07	\N	Девочка со спичками	Ганс Христиан Андерсен	Драма	16+	01:00:00	2022-12-03	{"Режиссер спектакля – Андрей Дустимов","Художник по свету – Иван Пирютко","Звукорежиссер – Дмитрий Цитович","Видеограф – Михаил Шаров","Хореограф-постановщик - Елена Курченкова"}	В центре спектакля – история маленькой девочки, пытающейся согреться и утолить голод, продавая спички на холодной улице. Окружающие взрослые, погруженные в свои дела, не замечают ее страданий. Эта трогательная сказка напоминает нам о важности человечности, сострадания и взаимопомощи. Каждый из нас может сделать этот мир чуточку добрее.	f	http://localhost:9000/antrakt-images/perfomances/cd04e4ceb1954dd5b8c3bbfbfec769eb.jpg	http://localhost:9000/antrakt-images/perfomances/c84dfccd2c0840f2813d1e26412f5539.jpg	{http://localhost:9000/antrakt-images/perfomances/6b8217bac3414eeea753799205b8842a.jpg,http://localhost:9000/antrakt-images/perfomances/443e29dd4e1f4dbfa8cd250d3eae4a03.jpg,http://localhost:9000/antrakt-images/perfomances/c8ab1b13675e4623a5b9256f244c2d61.jpg,http://localhost:9000/antrakt-images/perfomances/cf71f6377e07464587bdd8bf4a027275.jpg,http://localhost:9000/antrakt-images/perfomances/2a4529aca81445a192c5ce8cc220939f.jpg}		t	\N			\N	f
10	2025-07-22 20:43:24.40842+07	2026-07-09 11:32:09.603322+07	\N	Лазарет	С. Дерби	Драмеди	16+	01:15:00	2025-05-30	{"Режиссёр спектакля - Елена Телегина","Художник по свету - Ольга Карпова"}	Театр-студия «Антракт» совместно с приглашенным режиссером Еленой Телегиной, преподавателем кафедры актерского мастерства и режиссуры Новосибирского государственного театрального института, представляет нашумевший в Новосибирске спектакль «Лазарет» в необычном жанре драмеди, который смогут увидеть зрители Норильска.\n\nО чем же спектакль? Спокойный субботний день в хорошей клинике не предвещает никаких событий. Откуда возникает любовь, разочарование, дружба? Может они всегда находятся с нами? И, от каждого зависит, что материализуется в итоге, кто платит по счетам, а кто получает награду. Спектакль покажет наполненный страстями путь из одиночества, подарит надежду тем, кто не ждёт никаких перемен в своей обыденной жизни.	f	http://localhost:9000/antrakt-images/perfomances/c0ae21ba7fed427bb58999560f104cf5.jpg	http://localhost:9000/antrakt-images/perfomances/e3657369f46243a78adbe343fbce0c15.jpg	{http://localhost:9000/antrakt-images/perfomances/2b3181194bfb4d46a45e5f2364b2aec2.jpg,http://localhost:9000/antrakt-images/perfomances/ec87b42b280348aeb23ae2521fec5c1b.jpg,http://localhost:9000/antrakt-images/perfomances/c9420c600795411ebc5edf62e4387ca2.jpg,http://localhost:9000/antrakt-images/perfomances/a4e320527cdd4f3c944ac1583859be05.jpg,http://localhost:9000/antrakt-images/perfomances/48d68155f1b14a679de32a6cfcf9075f.jpg}		t	\N			\N	f
7	2025-07-22 20:27:56.495767+07	2026-07-06 18:15:58.176518+07	\N	Свадьба	Антон Чехов	Комедия	16+	00:45:00	2023-04-23	{"Режиссер спектакля – Андрей Дустимов","Художник по свету – Ольга Карпова","Звукорежиссер – Артем Кузьменко"}	Водевиль «Свадьба» – созданный по одноимённой пьесе Антона Павловича Чехова, является язвительной сатирой на обывательские нравы мещан дореволюционной России. На свадьбе раскрываются все прекрасные эмоции... И не прекрасные... Любовь, благодарность родителям за жениха и невесту, подарки от души, веселье и радость... Но есть такие свадьбы, где раскрывается обман, алчность, зависть, злость и...	f	http://localhost:9000/antrakt-images/perfomances/c26ffbff49884435a81dc428deb697ca.jpg	http://localhost:9000/antrakt-images/perfomances/6096d950ce0b495a812c2a117ec852f8.jpg	{http://localhost:9000/antrakt-images/perfomances/951c32df2cd1451aad774da8f19248a2.jpg,http://localhost:9000/antrakt-images/perfomances/a466afec9e4e4070baf5eaa15942afb9.jpg,http://localhost:9000/antrakt-images/perfomances/8c77a40f34ca483ba2ea62075c82eab6.jpg,http://localhost:9000/antrakt-images/perfomances/7885e201e4ca434388964183e2ff99bc.jpg,http://localhost:9000/antrakt-images/perfomances/4e00104e889b4c7a9872fb04452b1cab.jpg}		t	\N			\N	f
13	2026-07-08 01:26:28.351518+07	2026-07-09 11:32:16.604606+07	\N	Горка	Алексей Житковский	Драма	16+	01:00:00	2025-12-06	{"Режиссёр - Андрей Дустимов","Хореограф - Елена Курченкова"}	6 декабря в 18:00 в Малом зале МБУК «Городской центр культуры» состоится премьера драматического спектакля «Горка» современного драматурга Алексея Житковского.\n\nНепрофессиональный театр «Антракт» с гордостью объявляет о подготовке новой постановки! Мы объединили усилия с одним из самых талантливых современных драматургов, Алексеем Житковским, чтобы представить вам спектакль под символичным названием «Горка».\n\nАлексей Житковский – яркий представитель нового поколения российских драматургов, чьи пьесы заставляют говорить, спорить и, главное, думать. Его тексты отличает острота, социальная направленность и удивительное умение улавливать самые болевые точки современного общества.\n\n«Горка» — это современная, очень актуальная и одновременно смешная и грустная пьеса в жанре трагикомедии. В центре внимания — жизнь молодой воспитательницы детского сада, которая сталкивается с повседневным абсурдом и бесконечным потоком проблем: от строительства необходимой ледяной горки до требований из родительских чатов и неустроенности личной жизни. Пьеса, наполненная узнаваемыми и комичными ситуациями, на самом деле рассказывает о «маленьком человеке», его борьбе за человеческое достоинство и о ежедневном подвиге выживания в суровой, но иногда неожиданно милосердной реальности.	f	http://localhost:9000/antrakt-images/perfomances/88b551e28bb3493691af2e3c58b46782.jpg	http://localhost:9000/antrakt-images/perfomances/599f53c0ded64ef8b78dc0d4ba9d884d.jpg	{http://localhost:9000/antrakt-images/perfomances/8282c8616a91475f84423059cc77c627.jpg,http://localhost:9000/antrakt-images/perfomances/2120d41f3c67436eacc3e1ff56a04ffd.jpg,http://localhost:9000/antrakt-images/perfomances/972ef4719dfa474d9944b5c80be019cc.jpg,http://localhost:9000/antrakt-images/perfomances/7e558711d89d472eaa7c24ba0af464d7.jpg,http://localhost:9000/antrakt-images/perfomances/9b1c997cb3554742b1190915cf4c6bcb.jpg}	\N	t	1	Труппа норильского народного театра		2025	t
12	2025-08-21 23:25:18.855148+07	2026-07-08 10:42:07.810667+07	\N	8 любящих женщин	Роберт Тома	Детектив	16+	01:10:00	2025-09-27	{"Режиссёр спектакля - Андрей Дустимов"}	27 сентября в 18:00 и 28 сентября в 16:00 в Малом зале МБУК «Городской центр культуры» состоится премьера спектакля Робера Тома «8 «любящих».\nНепрофессиональный театр «Антракт» представляет для жителей самого северного города безумную черную комедию французского драматурга Робера Тома «8 любящих женщин». \nЭто не просто детектив, а ироничная и захватывающая история, которая заставит вас смеяться и переживать одновременно. События разворачиваются в загородном доме, где под одной крышей собирается восемь женщин. Праздничная идиллия рушится в один миг, когда хозяина дома находят убитым. Все восемь героинь становятся главными подозреваемыми, ведь у каждой есть свой мотив и скелет в шкафу.\nСпектакль «8 «любящих» – это напряженная игра характеров, полная интриг, взаимных обвинений и неожиданных поворотов. На протяжении всего действия героини разоблачают самые тщательно скрываемые тайны, а их «любовь» к убитому подвергается серьёзной проверке.	f	http://localhost:9000/antrakt-images/perfomances/6240e24ac8574d91bf0f4b84740e7119.jpg	http://localhost:9000/antrakt-images/perfomances/053dbbe1b78346869e6fb8aefcee6485.jpg	{http://localhost:9000/antrakt-images/perfomances/839c73fdcd6f4631a86ae6bc72b87281.jpg,http://localhost:9000/antrakt-images/perfomances/52f6876d06af46dab2af116ae78a78d2.jpg,http://localhost:9000/antrakt-images/perfomances/9a38a888c55d4555b866a35d25adc293.jpg,http://localhost:9000/antrakt-images/perfomances/5696749219374eb4823c18d614dc3a5d.jpg,http://localhost:9000/antrakt-images/perfomances/a0ceca6994434edcbbb1a1b582a0c660.jpg}	https://iframeab-pre5855.intickets.ru/event/65862341	t	1	Труппа норильского народного театра	8 любящих женщин	2025	t
14	2026-07-08 19:39:33.508166+07	2026-07-08 19:39:46.122014+07	\N	Любовь. Жизнь. Кошки.	Неизвестно	Комедия	16+	01:00:00	2026-02-18	{"Режиссёр - Андрей Дустимов"}	14 февраля в 18:00 в Малом зале Городского центра культуры состоится премьера комедии в День влюбленных «Любовь. Жизнь. Кошки».\n\nЮля планировала свадьбу, но вместо этого попала в аварию и ушла в глубокий сон. Пока она «отдыхала», жизнь вокруг заиграла новыми красками: жених от стресса внезапно оказался в постели с её подругой, а мама не планировала всю оставшуюся жизнь ухаживать за дочерью. Но Юля решила вернуться! Оказывается, очнуться и разогнать всех «сочувствующих» — лучший детокс в жизни.\n\nПорой требуется время, чтобы убедиться, что горькая правда — лучшее средство, чтобы понять, кто любит тебя по‑настоящему.\n\nПриходите посмеяться над тем, как рушатся планы, когда жизнь дарит второй шанс, а в доме остаётся только самая верная — кошка.\n\nЖдём вас на нашем спектакле!	f	http://localhost:9000/antrakt-images/perfomances/f6d32a91c709428882db80c163616794.jpg	http://localhost:9000/antrakt-images/perfomances/fe82868a6a014929a84decf7c90a7844.jpg	{http://localhost:9000/antrakt-images/perfomances/a9f989ef03c54b2d87d9acb91ab1f536.jpg,http://localhost:9000/antrakt-images/perfomances/f6c54023e18a4bb4adf637c243d53c39.jpg,http://localhost:9000/antrakt-images/perfomances/bead9a4678f2425f9ffc8decb04225df.jpg,http://localhost:9000/antrakt-images/perfomances/f0a00b63d526426c808e7011770027c1.jpg,http://localhost:9000/antrakt-images/perfomances/61662b6b76c749b2a816b4a395fbd77a.jpg}	\N	t	1	Труппа норильского народного театра		2026	t
16	2026-07-08 20:10:26.404353+07	2026-07-09 11:32:24.887088+07	\N	Рикки-Тикки-Тави	По мотивам "Книга Джунглей" Р. Д. Киплинга	Пластическая сказка	12+	00:50:00	2026-04-18	{"Режиссёр - Андрей Дустимов","Хореограф - Елена Курченкова"}	18 апреля в 18:00 и 19 апреля в 14:00 в Малом зале Городского центра культуры состоятся премьерные показы пластической сказки «Рикки-Тикки-Тави» по мотивам произведения «Книга джунглей» Р. Киплинга.\n\nПостановка представляет собой смелый художественный эксперимент нашего театра. Основным языком повествования становится пластика, движение и выразительность человеческого тела. Режиссёр Андрей Дустимов и артистка театра, ответственная за пластическое решение, Елена Курченкова, создают спектакль, где каждый жест, поза и мимика актёров складываются в понятный и эмоционально насыщенный визуальный текст.\n\nСпектакль погружает зрителя в атмосферу индийских джунглей, где разворачивается вечная битва между храбростью и коварством. История отважного мангуста Рикки-Тикки-Тави, вступившего в смертельную схватку с кобрами Нагом и Нагайной ради спасения своей человеческой семьи, раскрывается через динамичные сцены погони, напряжённые дуэли и трогательные моменты дружбы.\n\nЭта постановка — не просто инсценировка известного сюжета, а глубокое исследование тем самопожертвования, долга и защиты слабых. Она демонстрирует, как с помощью чистого движения можно говорить о самых важных человеческих ценностях.\n\nСпектакль рассчитан на семейный просмотр и призван стать событием, которое объединит детей и взрослых общими впечатлениями от встречи с классикой в абсолютно новом, современном прочтении.	f	http://localhost:9000/antrakt-images/perfomances/3ba1e0a1a20b4a01b21abcc446cfbe57.jpg	http://localhost:9000/antrakt-images/perfomances/4b1a7c590f5f4941b467856ae84b926f.jpg	{http://localhost:9000/antrakt-images/perfomances/6a5a7195d20a4ba98f3febc39e9bfff5.jpg,http://localhost:9000/antrakt-images/perfomances/957e6048842543caa3c18b6cf5ea35ac.jpg,http://localhost:9000/antrakt-images/perfomances/deb529b8951245cc8635e126e83ea801.jpg,http://localhost:9000/antrakt-images/perfomances/7cbce7caefa34c1eb62fe879c9c260ea.jpg,http://localhost:9000/antrakt-images/perfomances/577de5d4753447d980f1f85e24e4b419.jpg}	\N	t	1	Труппа норильского народного театра		2026	t
17	2026-07-08 20:27:02.772837+07	2026-07-09 11:32:30.38839+07	\N	Внучка для Бабы Яги	Диана Гилязова	Сказка	6+	00:50:00	2026-06-01	{"Режиссёр - Андрей Дустимов"}	1 июня в 19:00 в Большом зале Городского центра культуры состоится премьера сказки «Внучка для Бабы Яги».\n\nВ Международный день защиты детей юных зрителей и их родителей приглашаем погрузиться в мир настоящего сказочного волшебства. Вечер будет наполнен весельем, добрым юмором и неожиданными сюжетными поворотами.\n\nПрограмма начнется в 18:30 с интерактивного блока от студии праздников «ТУТ». Это время игр, конкурсов и отличного настроения — идеальный старт праздника, который подарит детям заряд энергии перед главным событием вечера.\n\nВ 19:00 начнется показ спектакля «Внучка для Бабы Яги». Это захватывающая сказка по пьесе Дианы Гилязовой, представленная в прочтении театра-студии «Антракт» под чутким руководством режиссера Андрея Дустимова.\n\nСюжет перевернет привычные представления о сказочных злодеях! Зрители познакомятся с Бабой Ягой, которая решила, что пора завести внучку! Баба Яга желает найти себе достойную смену. Такую же «вредную» и своенравную девочку, которой можно будет торжественно вручить ступу и передать «секретные знания» колдовства.\n\nЕсть только одна маленькая проблема: сама Баба Яга колдовать толком не умеет и никогда этому не училась, но не это главное. Главное – чтобы внучка была. Что из этого выйдет, удастся ли найти подходящую наследницу, и к чему приведут попытки обучить внучку «вредностям» — узнают только те, кто придет на этот яркий и по-настоящему смешной спектакль.\n\nПостановка наполнена искрометным юмором, доброй иронией и волшебством, которое будет понятно и детям, и их родителям. Это идеальная история о том, как важно не быть вредной, хорошо учиться и стремиться к добру.	f	http://localhost:9000/antrakt-images/perfomances/d113caf6a58944ddb580b04c7d86b91d.jpg	http://localhost:9000/antrakt-images/perfomances/ad36d46f41574542b9f2cdab3d477ff0.jpg	{http://localhost:9000/antrakt-images/perfomances/f0e564bf0ca64c4fade0d139185e1b5a.jpg,http://localhost:9000/antrakt-images/perfomances/30c2a5da4cc241cfb15241dbf2bc11e7.jpg,http://localhost:9000/antrakt-images/perfomances/a53aaa2247954b2984658c3e7f7f86c3.jpg,http://localhost:9000/antrakt-images/perfomances/7e84b4ebb27d4648b7d42bf638b826d9.jpg}	\N	t	1	Труппа норильского народного театра		2026	t
15	2026-07-08 19:51:09.169737+07	2026-07-09 11:32:21.314215+07	\N	Монтировщики	Сергей Кочнев	Комедия	16+	00:55:00	2026-02-28	{"Режиссёр - Андрей Дустимов"}	28 марта в 18:00 в Малом зале Городского центра культуры состоится премьера комедии «Монтировщики» Сергея Кочнева.\n\nТеатр «Антракт» готовит особенный подарок для норильских зрителей в преддверии Всемирного дня театра. Драматург Сергей Кочнев, чьи пьесы успешно идут во многих российских театрах, предоставил «Антракту» право постановки «Монтировщиков» в Норильске.\n\nСпектакль посвящён тем, кто остаётся за кулисами, но без кого невозможна магия сцены — монтировщикам. Это история о людях, которые не выходят на поклоны, но чья любовь к театру, преданность и ежедневный труд создают тот самый волшебный мир, в который погружается зритель.\n\n«Монтировщики» — это разговор о простых, но важных вещах: о верности, дружбе, любви к своему делу и, конечно, о том волшебстве, которое рождается, когда на пустой сцене появляются декорации и загорается свет. Режиссёр-постановщик Андрей Дустимов спектакля обещает зрителям динамичное действие, яркие характеры и множество тонких театральных отсылок, которые оценят как знатоки, так и те, кто впервые знакомится с закулисной жизнью.	f	http://localhost:9000/antrakt-images/perfomances/2b4ac33ce13341b5bf38d6d416d03b51.jpg	http://localhost:9000/antrakt-images/perfomances/39f7120fd1fb417d9dc2e7db2f823462.jpg	{http://localhost:9000/antrakt-images/perfomances/547305bd2c9f4c61af7dfb5620f91907.jpg,http://localhost:9000/antrakt-images/perfomances/38dacea106f249fdb0c047d5d6cafb19.jpg,http://localhost:9000/antrakt-images/perfomances/c4e83590a9154c759d594bb736248ad9.jpg,http://localhost:9000/antrakt-images/perfomances/3b5dc560debb4f8486e692673d8be57d.jpg,http://localhost:9000/antrakt-images/perfomances/0b6d7d570a8441198d8c8673de5698ac.jpg}	\N	t	1	Труппа норильского народного театра		2026	t
\.


--
-- Data for Name: performance_cast; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.performance_cast (id, role, created_at, actor_id, performance_id, actor_name, director_id) FROM stdin;
164	Князь Гвидон	2026-07-09 11:31:50.550711+07	15	3	Захаров Илья	\N
165	Писарь	2026-07-09 11:31:50.587863+07	25	3	Нусс Анастасия	\N
166	Лилия	2026-07-09 11:32:09.583291+07	25	10	Нусс Анастасия	\N
167	Настя	2026-07-09 11:32:16.534935+07	5	13	Екатерина Наконечная	\N
168	Жанна Борисовна; Марина, Зульфия Фаридовна	2026-07-09 11:32:16.536801+07	6	13	Курченкова Елена	\N
169	Олег; Дядя Ваня	2026-07-09 11:32:16.537284+07	11	13	Кравченко Сергей	\N
170	Актриса массовки	2026-07-09 11:32:16.538333+07	19	13	Гузель Садртдинова	\N
171	Актриса массовки	2026-07-09 11:32:16.538333+07	25	13	Нусс Анастасия	\N
172	Актёр массовки	2026-07-09 11:32:16.538333+07	9	13	Кононыхин Михаил	\N
173	Актёр массовки	2026-07-09 11:32:16.538333+07	14	13	Евстигнеев Ярослав	\N
174	Михаил	2026-07-09 11:32:21.234385+07	15	15	Захаров Илья	\N
175	Тётя Ася	2026-07-09 11:32:21.238122+07	16	15	Гасанова Оксана	\N
176	Олег	2026-07-09 11:32:21.239613+07	11	15	Кравченко Сергей	\N
177	Александр	2026-07-09 11:32:21.240981+07	14	15	Евстигнеев Ярослав	\N
178	Анатолий Гурков	2026-07-09 11:32:21.243162+07	22	15	Кондратьев Алексей	\N
179	Седой Человек	2026-07-09 11:32:21.247703+07	9	15	Кононыхин Михаил	\N
87	Юля	2026-07-08 19:39:46.048765+07	8	14		\N
88	Мать Юли	2026-07-08 19:39:46.049896+07	23	14		\N
89	Кошка	2026-07-08 19:39:46.049896+07	24	14		\N
90	Тата	2026-07-08 19:39:46.049896+07	20	14		\N
91	Лара	2026-07-08 19:39:46.055356+07	12	14		\N
92	Тамара	2026-07-08 19:39:46.05663+07	19	14		\N
93	Софья	2026-07-08 19:39:46.05663+07	21	14		\N
94	Нюся	2026-07-08 19:39:46.05663+07	18	14		\N
180	Лена	2026-07-09 11:32:21.249853+07	25	15	Нусс Анастасия	\N
181	Рикки-Тикки-Тави	2026-07-09 11:32:24.75437+07	6	16	Курченкова Елена	\N
182	Чучундра	2026-07-09 11:32:24.755763+07	19	16	Гузель Садртдинова	\N
183	Чуя	2026-07-09 11:32:24.762689+07	3	16	Молодчая Анна	\N
184	Мама Мэри	2026-07-09 11:32:24.762689+07	12	16	Качаева Назира	\N
185	Папа Джозеф	2026-07-09 11:32:24.773409+07	11	16	Кравченко Сергей	\N
186	Наг	2026-07-09 11:32:24.77869+07	9	16	Кононыхин Михаил	\N
187	Нагайна	2026-07-09 11:32:24.781603+07	4	16	Дустимова Ксения	\N
188	Элли	2026-07-09 11:32:24.784508+07	25	16	Нусс Анастасия	\N
189	Кот	2026-07-09 11:32:30.333098+07	8	17	Герасимова Ксения	\N
190	Гном	2026-07-09 11:32:30.334675+07	15	17	Захаров Илья	\N
191	Баба Яга	2026-07-09 11:32:30.336305+07	24	17	Харитонова Ева	\N
192	Мама Кати	2026-07-09 11:32:30.336305+07	23	17	Миронова Татьяна	\N
193	Катя	2026-07-09 11:32:30.34241+07	25	17	Нусс Анастасия	\N
63	Габи	2026-07-08 10:42:07.776435+07	4	12		\N
64	Сюзон	2026-07-08 10:42:07.779555+07	3	12		\N
65	Огюстина	2026-07-08 10:42:07.782311+07	7	12		\N
66	Шанель	2026-07-08 10:42:07.784777+07	16	12		\N
67	Пьеретта	2026-07-08 10:42:07.788558+07	10	12		\N
68	Луиза	2026-07-08 10:42:07.79115+07	18	12		\N
69	Бабушка	2026-07-08 10:42:07.792998+07	17	12		\N
70	Катрин	2026-07-08 10:42:07.795314+07	24	12		\N
\.


--
-- Data for Name: performance_show; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.performance_show (id, show_datetime, ticket_url, created_at, updated_at, performance_id) FROM stdin;
23	2025-09-27 18:00:00+07	\N	2026-07-08 10:42:07.758274+07	2026-07-08 10:42:07.758274+07	12
24	2025-09-28 16:00:00+07	\N	2026-07-08 10:42:07.760307+07	2026-07-08 10:42:07.760307+07	12
27	2026-02-18 18:00:00+07	\N	2026-07-08 19:39:46.043948+07	2026-07-08 19:39:46.043948+07	14
39	2025-12-06 18:00:00+07	\N	2026-07-09 11:32:16.524936+07	2026-07-09 11:32:16.524936+07	13
40	2026-02-28 18:00:00+07	\N	2026-07-09 11:32:16.531093+07	2026-07-09 11:32:16.531093+07	13
41	2026-02-28 18:00:00+07	\N	2026-07-09 11:32:21.22858+07	2026-07-09 11:32:21.22858+07	15
42	2026-04-18 18:00:00+07	\N	2026-07-09 11:32:24.742361+07	2026-07-09 11:32:24.742361+07	16
43	2026-06-01 19:00:00+07	\N	2026-07-09 11:32:30.324755+07	2026-07-09 11:32:30.324755+07	17
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.review (id, text, created_at, updated_at, actor_id, author_id, performance_id, archive_id, director_id, news_id, deleted_at) FROM stdin;
2	АААА!!! ВОТ ЭТО КРУТО!!!! Я БЫ ВООБЩЕ ЁБНЕ!	2026-07-09 10:31:30.729293+07	2026-07-09 10:31:30.729293+07	\N	18	13	\N	\N	\N	\N
3	ыаврпмр	2026-07-09 11:14:16.031811+07	2026-07-09 11:14:16.031811+07	\N	19	\N	\N	1	\N	\N
\.


--
-- Data for Name: review_reaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.review_reaction (id, reaction, created_at, review_id, user_id) FROM stdin;
8	laugh	2026-07-09 11:14:33.86351+07	2	19
9	like	2026-07-09 11:14:35.291423+07	2	19
10	heart	2026-07-09 11:14:36.269348+07	2	19
\.


--
-- Data for Name: site_content; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_content (id, key, value, section, label, multiline, "order", updated_at) FROM stdin;
16	about.mission_title	Наша миссия	О театре	Заголовок «Миссия»	f	30	2026-07-09 10:27:53.798765+07
17	about.mission_text	Мы создаём пространство, где рождается настоящее искусство. Творчество норильчан для норильчан: вместе мы создаём театр!	О театре	Текст миссии	t	40	2026-07-09 10:27:53.799746+07
5	footer.tagline	Профессиональная театральная студия, где каждый может раскрыть свой творческий потенциал и найти свою сцену.	Футер	Описание под названием	t	10	2026-07-09 10:27:53.802554+07
6	footer.director	Дустимов Андрей Аидмазонович	Футер	Руководитель	f	20	2026-07-09 10:27:53.80441+07
3	hero.title	Норильский народный театр	Главная (над фото)	Заголовок	f	10	2026-07-09 10:27:53.788435+07
4	hero.subtitle	Где каждый находит свою сцену и раскрывает творческий потенциал	Главная (над фото)	Подзаголовок	t	20	2026-07-09 10:27:53.792633+07
14	about.title	О театре	О театре	Заголовок страницы	f	10	2026-07-09 10:27:53.794753+07
15	about.intro	Театр-студия «Антракт» была основана в 2021 году под руководством художественного руководителя Андрея Аидмазоновича Дустимова. В 2026 году, коллектив получил звание народного театра. На данный момент, это единственный творческий коллектив в Норильске, носящий такое высокое звание.	О театре	Вступительный текст	t	20	2026-07-09 10:27:53.796756+07
7	footer.email	ADustimov@mail.ru	Футер	Email	f	30	2026-07-09 10:27:53.805438+07
8	footer.phone	+7-913-161-00-34	Футер	Телефон	f	40	2026-07-09 10:27:53.807479+07
9	footer.address	г. Норильск, ул. Орджоникидзе, д. 15	Футер	Адрес	f	50	2026-07-09 10:27:53.809779+07
10	footer.hours	Пн-Сб: 10:00 - 22:00, Вс: 11:00 - 20:00	Футер	Часы работы	f	60	2026-07-09 10:27:53.811442+07
11	footer.partner_title	Наш партнёр	Футер	Заголовок блока партнёра	f	70	2026-07-09 10:27:53.812824+07
12	footer.partner_text	Городской центр культуры — центр развития творчества и досуга жителей Норильска с 1992 года.	Футер	Текст о партнёре	t	80	2026-07-09 10:27:53.814394+07
13	footer.copyright	Норильский народный театр. Все права защищены.	Футер	Копирайт (год добавляется автоматически)	f	90	2026-07-09 10:27:53.815371+07
1	nav.logo	ННТ	Шапка	Логотип (монограмма)	f	10	2026-07-09 10:27:53.816483+07
2	nav.brand_full	Норильский народный театр	Шапка	Полное название театра	f	20	2026-07-09 10:27:53.818555+07
\.


--
-- Data for Name: site_review; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_review (id, author_name, role, avatar_url, rating, text, review_date, source_url, source, vk_owner_id, vk_post_id, vk_comment_id, pinned, hidden, "position", created_at, updated_at) FROM stdin;
1	Мария Иванова	Зритель		5	Посетили спектакль с дочерью. Были потрясены игрой актёров и глубиной проработки персонажей. Обязательно придём ещё!	2025-06-15		manual	\N	\N	\N	f	f	0	2026-07-09 23:31:01.45535+07	2026-07-09 23:31:01.45535+07
2	Алексей Петров	Студент театрального		5	Учусь актёрскому мастерству в этой студии уже полгода. Преподаватели — профессионалы высшего уровня. Особенно рекомендую курс сценической речи!	2025-06-12		manual	\N	\N	\N	f	f	0	2026-07-09 23:31:01.461351+07	2026-07-09 23:31:01.461351+07
3	Ольга Сидорова	Театральный критик		5	Свежий взгляд на классику. Современные решения не нарушили дух оригинала, а лишь усилили его.	2025-06-10		manual	\N	\N	\N	f	f	0	2026-07-09 23:31:01.461351+07	2026-07-09 23:31:01.461351+07
4	Дмитрий Козлов	Родитель		5	Мой сын занимается в детской группе студии. Заметны огромные изменения в его уверенности и коммуникативных навыках. Спасибо педагогам!	2025-06-08		manual	\N	\N	\N	f	f	0	2026-07-09 23:31:01.461351+07	2026-07-09 23:31:01.461351+07
5	Екатерина Волкова	Актриса		5	Уровень постановок здесь не уступает многим профессиональным театрам. Особенно впечатлили декорации и свет.	2025-06-05		manual	\N	\N	\N	f	f	0	2026-07-09 23:31:01.461351+07	2026-07-09 23:31:01.461351+07
6	Артём Фёдоров	Режиссёр		5	Работал со студией над совместным проектом. Поразила дисциплина и преданность делу всех участников. Настоящие профессионалы!	2025-06-01		manual	\N	\N	\N	f	f	0	2026-07-09 23:31:01.461351+07	2026-07-09 23:31:01.461351+07
\.


--
-- Data for Name: token_blacklist_blacklistedtoken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token_blacklist_blacklistedtoken (id, blacklisted_at, token_id) FROM stdin;
1	2025-07-09 14:39:49.123726+07	3
2	2025-07-09 14:39:59.154905+07	4
3	2025-07-09 14:41:59.960082+07	5
4	2025-07-09 14:44:24.297818+07	6
5	2025-07-09 14:50:19.732589+07	7
6	2025-07-09 15:06:04.046369+07	8
7	2025-07-09 15:15:43.842066+07	9
8	2025-07-09 18:43:42.451625+07	11
9	2025-07-09 19:38:46.817129+07	12
10	2025-07-09 20:33:46.76015+07	13
11	2025-07-09 21:21:51.498583+07	14
12	2025-07-09 22:18:03.775881+07	15
13	2025-07-09 23:13:03.451519+07	16
14	2025-07-10 11:55:25.924951+07	18
15	2025-07-10 12:50:26.00932+07	19
16	2025-07-10 16:18:14.370378+07	21
17	2025-07-10 17:13:14.960918+07	22
18	2025-07-10 18:20:32.377186+07	23
19	2025-07-10 19:30:23.685237+07	25
20	2025-07-10 20:25:23.414138+07	26
21	2025-07-10 21:20:23.589333+07	27
22	2025-07-10 21:34:42.360045+07	28
23	2025-07-11 13:38:25.688955+07	30
24	2025-07-11 13:38:44.289534+07	31
25	2025-07-11 14:33:52.867864+07	32
26	2025-07-11 17:04:31.404233+07	33
27	2025-07-11 17:59:32.192724+07	34
28	2025-07-11 19:25:00.428694+07	35
29	2025-07-11 20:20:00.852245+07	36
30	2025-07-11 21:15:01.174831+07	37
31	2025-07-11 22:10:02.291388+07	38
32	2025-07-12 12:03:51.491969+07	40
33	2025-07-12 12:30:21.274154+07	42
34	2025-07-12 12:30:43.358872+07	43
35	2025-07-12 18:41:29.475617+07	45
36	2025-07-12 19:36:29.552948+07	46
37	2025-07-12 22:04:12.118419+07	49
38	2025-07-13 11:36:52.420959+07	50
39	2025-07-13 11:38:56.836036+07	51
40	2025-07-13 16:34:36.144348+07	52
41	2025-07-13 20:49:37.997751+07	53
42	2025-07-13 22:36:12.111748+07	54
43	2025-07-14 21:16:50.430659+07	56
44	2025-07-15 16:57:18.466896+07	57
45	2025-07-15 18:38:22.625055+07	58
46	2025-07-15 19:33:22.667286+07	59
47	2025-07-16 17:26:35.384824+07	60
48	2025-07-16 19:54:59.011461+07	61
49	2025-07-17 13:12:50.840591+07	62
50	2025-07-17 14:35:49.387684+07	63
51	2025-07-17 15:57:01.347432+07	64
52	2025-07-17 16:52:01.246966+07	65
53	2025-07-17 18:42:31.88116+07	66
54	2025-07-17 21:01:21.395898+07	67
55	2025-07-18 13:29:38.505796+07	68
56	2025-07-18 14:24:39.020986+07	69
57	2025-07-18 17:23:28.76362+07	70
58	2025-07-18 22:26:46.529327+07	72
59	2025-07-19 14:09:16.882577+07	73
60	2025-07-19 15:04:17.025161+07	74
61	2025-07-19 18:38:44.991232+07	75
62	2025-07-19 20:15:00.368104+07	76
63	2025-07-19 21:10:00.887759+07	77
64	2025-07-19 22:17:14.55758+07	78
65	2025-07-20 12:42:49.101895+07	80
66	2025-07-20 21:36:32.782749+07	81
67	2025-07-21 15:12:10.290336+07	83
68	2025-07-21 20:25:38.561297+07	84
69	2025-07-21 21:45:47.029747+07	85
70	2025-07-22 18:36:18.184267+07	86
71	2025-07-22 18:38:55.918381+07	87
72	2025-07-22 18:39:10.791815+07	88
73	2025-07-22 19:35:40.857961+07	89
74	2025-07-22 20:30:40.08979+07	90
75	2025-07-24 21:28:02.037146+07	92
76	2025-07-25 09:55:17.168781+07	93
77	2025-07-25 09:59:19.564949+07	95
78	2025-07-25 09:59:31.033874+07	96
79	2025-07-28 17:50:52.077154+07	98
80	2025-07-28 17:50:52.188265+07	99
81	2025-07-28 20:07:55.520698+07	100
82	2025-08-01 01:15:38.33369+07	102
83	2025-08-01 01:15:38.453362+07	103
85	2025-08-03 00:04:36.955488+07	104
86	2025-08-06 01:32:40.075142+07	106
87	2025-08-08 00:48:01.105495+07	108
88	2025-08-08 00:48:01.298181+07	110
89	2025-08-08 00:50:26.07066+07	111
90	2025-08-12 01:07:38.567195+07	114
91	2025-08-12 01:07:38.703634+07	115
92	2025-08-12 20:51:04.525558+07	116
93	2025-08-12 21:46:04.569375+07	117
96	2025-08-12 23:51:53.596016+07	120
97	2025-08-13 00:27:35.562726+07	122
98	2025-08-16 23:58:59.084139+07	124
99	2025-08-16 23:59:26.033376+07	125
100	2025-08-17 00:09:30.45977+07	126
101	2025-08-19 00:10:50.658489+07	128
102	2025-08-19 00:10:50.768152+07	129
103	2025-08-20 00:49:06.61284+07	130
104	2025-08-20 00:56:42.793493+07	132
105	2025-08-20 01:44:56.420717+07	131
106	2025-08-21 23:11:53.00846+07	134
107	2025-08-22 00:07:03.08886+07	135
108	2025-08-22 01:02:03.913489+07	136
109	2025-08-22 01:57:03.86753+07	137
110	2025-08-22 02:52:03.85918+07	138
111	2025-08-22 03:47:03.851009+07	139
112	2025-08-22 04:42:03.852199+07	140
113	2025-08-22 05:37:03.86971+07	141
114	2025-08-22 06:32:03.855394+07	142
115	2025-08-22 07:27:03.861396+07	143
116	2025-08-22 08:22:03.857358+07	144
117	2025-08-22 23:50:06.525403+07	145
118	2025-09-03 15:16:14.875338+07	147
119	2025-09-03 15:16:14.979723+07	148
120	2025-09-05 11:13:30.580517+07	149
121	2025-09-10 09:55:34.73605+07	152
122	2025-09-10 09:55:34.842185+07	153
123	2025-09-11 14:53:16.931174+07	154
124	2025-09-11 15:02:59.466812+07	155
125	2025-09-17 09:38:59.970089+07	156
126	2025-10-21 15:33:08.821056+07	158
127	2025-12-18 14:25:21.238602+07	160
128	2025-12-22 00:57:06.253021+07	163
129	2025-12-22 00:57:06.372215+07	164
130	2026-02-10 18:50:24.123988+07	166
131	2026-06-30 00:24:29.522544+07	167
132	2026-07-01 10:51:40.486368+07	171
133	2026-07-01 12:20:23.246613+07	172
134	2026-07-06 15:30:51.296521+07	175
135	2026-07-06 18:01:38.3544+07	176
136	2026-07-06 18:56:43.171103+07	178
137	2026-07-06 19:51:43.156173+07	179
138	2026-07-07 10:16:51.449052+07	180
139	2026-07-07 21:38:59.491422+07	181
140	2026-07-07 22:33:56.211958+07	183
141	2026-07-07 22:34:32.16504+07	184
142	2026-07-07 23:29:32.244479+07	185
143	2026-07-08 00:24:32.063896+07	186
144	2026-07-08 01:19:32.076078+07	187
145	2026-07-08 19:27:34.881314+07	189
146	2026-07-08 20:22:34.060467+07	191
147	2026-07-08 20:23:11.058833+07	192
148	2026-07-08 21:17:34.162226+07	193
149	2026-07-08 21:18:11.151144+07	194
150	2026-07-08 22:12:35.869825+07	195
151	2026-07-08 22:13:12.869649+07	196
152	2026-07-08 23:08:12.94066+07	197
153	2026-07-09 00:03:12.954265+07	198
154	2026-07-09 00:18:33.046315+07	199
155	2026-07-09 10:24:23.748432+07	200
156	2026-07-09 10:31:43.627962+07	202
157	2026-07-09 11:19:17.194576+07	203
158	2026-07-09 11:30:56.689415+07	204
159	2026-07-09 22:18:25.819516+07	205
160	2026-07-09 23:31:47.43372+07	206
161	2026-07-09 23:36:31.937152+07	208
162	2026-07-10 00:31:36.22329+07	209
163	2026-07-10 00:36:20.899712+07	210
164	2026-07-10 00:41:43.041903+07	211
\.


--
-- Data for Name: token_blacklist_outstandingtoken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token_blacklist_outstandingtoken (id, token, created_at, expires_at, user_id, jti) FROM stdin;
1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjA2OTY4MSwiaWF0IjoxNzUxOTgzMjgxLCJqdGkiOiIyYjljYjE2MmY3YmE0MmNhOTRhYWYwYTk2ODYyZTQwNCIsInVzZXJfaWQiOjEzfQ.IKImP9gttLtx9dFL82y5RvBNxPRDu1VZ3UpwmgZF290	2025-07-08 21:01:21.795401+07	2025-07-09 21:01:21+07	13	2b9cb162f7ba42ca94aaf0a96862e404
2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjEyNzI1MiwiaWF0IjoxNzUyMDQwODUyLCJqdGkiOiI3MDZkZjI2MTM3NjM0YjQ2YmQ2ZjY0NWJiYzMyMDczNyIsInVzZXJfaWQiOjEzfQ.ud0UrAZLE1rcybLDOFj3VF8JUYQEBZYEPLLvhm-ulRE	2025-07-09 13:00:52.844607+07	2025-07-10 13:00:52+07	13	706df26137634b46bd6f645bbc320737
3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjEzMzE2MSwiaWF0IjoxNzUyMDQ2NzYxLCJqdGkiOiJmMTBkNzQ5NjY3ZDg0NDllOGQ0NDhmZjMzZDVmMGMzMyIsInVzZXJfaWQiOjEzfQ.i7R1yM-LOmr2Yf7mnqL1mfyZxznmV3OkyedBRR6rAc4	2025-07-09 14:39:21.948411+07	2025-07-10 14:39:21+07	13	f10d749667d8449e8d448ff33d5f0c33
4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjEzMzE5NCwiaWF0IjoxNzUyMDQ2Nzk0LCJqdGkiOiJjZGQ4YWMwZjVkMDM0ZmY4YjRiMDAyYmRjM2ZiNzVjOCIsInVzZXJfaWQiOjEzfQ.vJBSi0J7pxAxmMHHeujJr-u3O_RhfwzL0p7ROC0q_dM	2025-07-09 14:39:54.166629+07	2025-07-10 14:39:54+07	13	cdd8ac0f5d034ff8b4b002bdc3fb75c8
5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjEzMzI2MywiaWF0IjoxNzUyMDQ2ODYzLCJqdGkiOiIzYzU1OGFlNDc4OGM0ZDY2ODU4OWJjZjliZTNhNThlNSIsInVzZXJfaWQiOjEzfQ.Bv1yBjRQPWiC48caxecHBcsSfSjoT2Wqsq1pDLQ7QRQ	2025-07-09 14:41:03.858825+07	2025-07-10 14:41:03+07	13	3c558ae4788c4d668589bcf9be3a58e5
6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjEzMzQ1NywiaWF0IjoxNzUyMDQ3MDU3LCJqdGkiOiI3YTE4MTBjZmUwYmU0NzA3ODkyODZjODY3MTJhZTA0MiIsInVzZXJfaWQiOjEzfQ.rOepejVSs0SGZeE8cihT1DYO5eOxDWFHpf2OFnf9oQY	2025-07-09 14:44:17.219132+07	2025-07-10 14:44:17+07	13	7a1810cfe0be470789286c86712ae042
7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjEzMzgxMiwiaWF0IjoxNzUyMDQ3NDEyLCJqdGkiOiJmZDZkMDZhNmE3Y2U0ZTc1YmI1ODQzMDhlZmJjNGJjZiIsInVzZXJfaWQiOjE0fQ.NfIx9hYanBHfhZbxaGTRIPOV3-s4SdL6lVfT9tM9yXs	2025-07-09 14:50:12.144121+07	2025-07-10 14:50:12+07	14	fd6d06a6a7ce4e75bb584308efbc4bcf
8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjEzNDczNiwiaWF0IjoxNzUyMDQ4MzM2LCJqdGkiOiJlNjY1MWZkNmFiYzk0MTkxOWEwMzQ3ODhhMWM4MTY3MSIsInVzZXJfaWQiOjEzfQ.U_ihoOjFDE8IX6RkoJ6OvGkgVzMlLRVfC1rw8oP-vDA	2025-07-09 15:05:36.028398+07	2025-07-10 15:05:36+07	13	e6651fd6abc941919a034788a1c81671
9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjEzNTM0MCwiaWF0IjoxNzUyMDQ4OTQwLCJqdGkiOiI4N2NmZDhhMmI5ZWQ0YmU1YTdiYjZiNDUxNmZiZjBhOCIsInVzZXJfaWQiOjEzfQ.N_0EJR4gPgY6KHzpcJjMeJLVmGFKFGMj0YNzMib-sn4	2025-07-09 15:15:40.43623+07	2025-07-10 15:15:40+07	13	87cfd8a2b9ed4be5a7bb6b4516fbf0a8
10	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjEzNzEwNywiaWF0IjoxNzUyMDUwNzA3LCJqdGkiOiI5NzhiZjIzOTg0MGM0ZmE5ODY4NTNiNWU0YTJlN2QyMSIsInVzZXJfaWQiOjE4fQ.-QXx_Yocqd-D1uV96HqW47bt1ypgSXA0rQLp6dG_v1c	2025-07-09 15:45:07.272852+07	2025-07-10 15:45:07+07	18	978bf239840c4fa986853b5e4a2e7d21
11	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjE0Nzc4NSwiaWF0IjoxNzUyMDYxMzg1LCJqdGkiOiJjNWRmYTU2ZjM3ZWU0NDljYWQ3MDZjZGY1ZDk1ZWY0MCIsInVzZXJfaWQiOjE4fQ.oKAXhb8490fVbNpM7XT-i7uXJjU4ZrcLj9Q-WoqoDbM	2025-07-09 18:43:05.94587+07	2025-07-10 18:43:05+07	18	c5dfa56f37ee449cad706cdf5d95ef40
12	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjE0NzgyNiwiaWF0IjoxNzUyMDYxNDI2LCJqdGkiOiJhZTQxYjgzMDk3NWU0ZTExODRlZWFhNDU2MTZhYzE2MSIsInVzZXJfaWQiOjE4fQ.26a6KiRRsqMxYSnWbXYWE5adH57iUJdZF8KC0kaffOE	2025-07-09 18:43:46.941298+07	2025-07-10 18:43:46+07	18	ae41b830975e4e1184eeaa45616ac161
13	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjE1MTEyNiwiaWF0IjoxNzUyMDY0NzI2LCJqdGkiOiI2MjI1ZTEyYjk4NWY0M2MzOWEwODM5NjFiZWY5Y2YwMSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.Ei0i2J3qLiOKwu6F2PVvt4M7YjC7WmRWthQVK5ARkjg	2025-07-09 19:38:46.70053+07	2025-07-10 19:38:46+07	18	6225e12b985f43c39a083961bef9cf01
14	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjE1NDQyNiwiaWF0IjoxNzUyMDY4MDI2LCJqdGkiOiIwMTM4ZDY3YmI5MDI0N2YxYWVhYWMzMjRiNWRjZjdjYyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.A9KEwfsDPGS4xIufNkV8xzJDgDxby-NtFaw33uBLN6g	2025-07-09 20:33:46.682283+07	2025-07-10 20:33:46+07	18	0138d67bb90247f1aeaac324b5dcf7cc
15	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjE1NzMxNiwiaWF0IjoxNzUyMDcwOTE2LCJqdGkiOiIxOTU2NGVhMTZhZTc0MzA5OTJkYjhjMDQ1NWQzYTQyNyIsInVzZXJfaWQiOjE4fQ.lbpptPYkOzv5Gape7IbYUj9Fzq2kG1uQ2dU4eoXYa-I	2025-07-09 21:21:56.045806+07	2025-07-10 21:21:56+07	18	19564ea16ae7430992db8c0455d3a427
16	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjE2MDY4MywiaWF0IjoxNzUyMDc0MjgzLCJqdGkiOiJjMDJhNTAyYTFhNGU0ZmMzOGE1ZTcwOTdlZDA5YzkxNiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.zFg1awM3rj39IRdOeGss8eJdrkXkL6yTGfmaqnYqzPM	2025-07-09 22:18:03.678693+07	2025-07-10 22:18:03+07	18	c02a502a1a4e4fc38a5e7097ed09c916
17	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjE2Mzk4MywiaWF0IjoxNzUyMDc3NTgzLCJqdGkiOiI3NGNiOTU2NGU3YWE0ODIxOTNmZjIyYmZkZjlhMWMwZSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.8bMRaGcePjZ3D3WTe4J0zEWdI8CvDmu0UjCj2OMQBcg	2025-07-09 23:13:03.355871+07	2025-07-10 23:13:03+07	18	74cb9564e7aa482193ff22bfdf9a1c0e
18	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjIwMzM4OSwiaWF0IjoxNzUyMTE2OTg5LCJqdGkiOiJkN2M2M2FmMGUyZjA0ZTIyODI3YmU4MWU2ODU0YmJlZSIsInVzZXJfaWQiOjE4fQ.lGqMmGbSEmdzY7HtxUHzVWNubTDTkQsGrcNj52G0Ibk	2025-07-10 10:09:49.194652+07	2025-07-11 10:09:49+07	18	d7c63af0e2f04e22827be81e6854bbee
19	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjIwOTcyNSwiaWF0IjoxNzUyMTIzMzI1LCJqdGkiOiJiYThlNWU0ZTU2ZWQ0NjZjOTNmZTZhMDQ0YTFmNDExMyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.4LYprgGWFajq1O0PZKrFgn52UY8VaPSTVLfBvVpYT8w	2025-07-10 11:55:25.809514+07	2025-07-11 11:55:25+07	18	ba8e5e4e56ed466c93fe6a044a1f4113
20	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjIxMzAyNSwiaWF0IjoxNzUyMTI2NjI1LCJqdGkiOiIyM2YwOTFhYTJmYTI0ZmI1OTc1NmUyZjU2ZjAzMTFhNSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.bFvfmDRQGt_5SyK9MNFVY19HFosn-WCGEvelb0KfvvM	2025-07-10 12:50:25.840419+07	2025-07-11 12:50:25+07	18	23f091aa2fa24fb59756e2f56f0311a5
21	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjIyMDY2OSwiaWF0IjoxNzUyMTM0MjY5LCJqdGkiOiJkNjc4MDM2NjIzZTQ0OGM2YjY0NmRmZmJjMmM1YWM4NyIsInVzZXJfaWQiOjE4fQ.LY526hTLBhwYr9GVN8g0X0zCzrd9l-IoaVJDlceBQiE	2025-07-10 14:57:49.349508+07	2025-07-11 14:57:49+07	18	d678036623e448c6b646dffbc2c5ac87
22	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjIyNTQ5NCwiaWF0IjoxNzUyMTM5MDk0LCJqdGkiOiI2YTFjNmMzNTE5Yjg0Yzk4YWU3ZTE0ZThhOTZjMDNiMSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.J_6HdXhKj55cJuEqh0ewrgiufw9PHmT4y_omI_OSliw	2025-07-10 16:18:14.208523+07	2025-07-11 16:18:14+07	18	6a1c6c3519b84c98ae7e14e8a96c03b1
23	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjIyODc5NCwiaWF0IjoxNzUyMTQyMzk0LCJqdGkiOiIxYTQ1NDdkOTJlZDE0ODNkOWI1M2ZhMTg1YjU2OGIzZCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.6OMB1jDVK1Nt5wl7NHaJ87-TLLbUHK1sCh8cUQrNZ4c	2025-07-10 17:13:14.839185+07	2025-07-11 17:13:14+07	18	1a4547d92ed1483d9b53fa185b568b3d
24	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjIzMjgzMiwiaWF0IjoxNzUyMTQ2NDMyLCJqdGkiOiI5ODY1ZDcwYzMwMGI0OWIwODNjMTc3Y2QyZDJhYmU3YiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.vhGJoeF3UMVTKimLTEGeomq7sk4I5pBeyxyDsz0ynXk	2025-07-10 18:20:32.169637+07	2025-07-11 18:20:32+07	18	9865d70c300b49b083c177cd2d2abe7b
25	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjIzMzcyMywiaWF0IjoxNzUyMTQ3MzIzLCJqdGkiOiJjZjMwNTBhOTMyMTQ0Yjk3OTI0MmQxNGRhZmVmMjZlOCIsInVzZXJfaWQiOjE4fQ.u_xzD8UMgJXHcd5R7gSr_uwbyjw0OZIgHr0fdWO-WJQ	2025-07-10 18:35:23.195347+07	2025-07-11 18:35:23+07	18	cf3050a932144b979242d14dafef26e8
26	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjIzNzAyMywiaWF0IjoxNzUyMTUwNjIzLCJqdGkiOiJhOTI4NzQ5MzA5Nzk0MzMyYmUzYzJmM2RhZTkyZTJhMCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.O0eNkfsqRi1_zEEPvuZ25eLyK2XZq5fS4HnBrO1x2C4	2025-07-10 19:30:23.538795+07	2025-07-11 19:30:23+07	18	a928749309794332be3c2f3dae92e2a0
27	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjI0MDMyMywiaWF0IjoxNzUyMTUzOTIzLCJqdGkiOiJlZGM5MDY2ODllYWE0MDVkODcyM2Y4YzA5OWFjZmQyMSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.m5_ZPd31G3HHac5H-BhVBugMQZYO7LyaQcbJcmBuy1Y	2025-07-10 20:25:23.332036+07	2025-07-11 20:25:23+07	18	edc906689eaa405d8723f8c099acfd21
28	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjI0MzYyMywiaWF0IjoxNzUyMTU3MjIzLCJqdGkiOiI0NWJhZTBlZTliMDg0Y2VkYThkMWYzNTQzM2MwZDZjZSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.X8fNZQwmd0wWIgG309PVLnPsaU_3qAtxAZPvfASfeug	2025-07-10 21:20:23.523953+07	2025-07-11 21:20:23+07	18	45bae0ee9b084ceda8d1f35433c0d6ce
29	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjI0NDQ4OCwiaWF0IjoxNzUyMTU4MDg4LCJqdGkiOiJiNzcwNzA3NDMxZmY0YTZhYWFkOGQ0YjI3NWU4ZTRjNCIsInVzZXJfaWQiOjE4fQ.cp-dpJEEsnGhqg6O_UKR1ru5dZ7I-X5Wif1Wm52X7C8	2025-07-10 21:34:48.827285+07	2025-07-11 21:34:48+07	18	b770707431ff4a6aaad8d4b275e8e4c4
30	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjMwMDk0MywiaWF0IjoxNzUyMjE0NTQzLCJqdGkiOiI5N2IzM2M4ODI5M2U0MjkzOTQyMzk3Yjk4NDBhY2Q1MCIsInVzZXJfaWQiOjE4fQ.CBTdR4NcZXHPUnCSvAlQWOuYwrtpnittMz5bZs_escE	2025-07-11 13:15:43.417014+07	2025-07-12 13:15:43+07	18	97b33c88293e4293942397b9840acd50
31	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjMwMjMxNywiaWF0IjoxNzUyMjE1OTE3LCJqdGkiOiI0NzE5N2IxMDk0MjQ0NmZhOTJlOTNlZDBiNDQ2ODg5OSIsInVzZXJfaWQiOjEzfQ.48BxlGr_Xr86WaV7wTGceytG6c83uZRU4MLNMCxB0v8	2025-07-11 13:38:37.878169+07	2025-07-12 13:38:37+07	13	47197b10942446fa92e93ed0b4468899
32	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjMwMjMzMiwiaWF0IjoxNzUyMjE1OTMyLCJqdGkiOiIyOWVjZTliZjQxZjg0NzkzYTcxMGJhZWIzNTFkYTk4ZCIsInVzZXJfaWQiOjE4fQ.IqaEqy3jtAb1F1EsBY-rGHiZZTTHrgKHpnAdR1GpPDQ	2025-07-11 13:38:52.047896+07	2025-07-12 13:38:52+07	18	29ece9bf41f84793a710baeb351da98d
33	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjMwNTYzMiwiaWF0IjoxNzUyMjE5MjMyLCJqdGkiOiIxZWRlZjgyZGFiYWE0YmJiOTQ3MTkyYjE1MjdkZjkwMCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.khwP2veyPHM4fFiW43SMyp7rH_57Dbpfkt6gROHTy7I	2025-07-11 14:33:52.79003+07	2025-07-12 14:33:52+07	18	1edef82dabaa4bbb947192b1527df900
34	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjMxNDY3MSwiaWF0IjoxNzUyMjI4MjcxLCJqdGkiOiIwNGNkYTRiZTU3NWU0YTdkYmZjNWZjNjYzNjY5NGNhMiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.dpXksvEQvR0vkjErbSbYEphH0r1-LS1sSn388ObdOHE	2025-07-11 17:04:31.07869+07	2025-07-12 17:04:31+07	18	04cda4be575e4a7dbfc5fc6636694ca2
35	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjMxNzk3MiwiaWF0IjoxNzUyMjMxNTcyLCJqdGkiOiI5ZDI4MmI3ZjgxYTY0YTBhOGE5ZGU5ZWI3MjJjZjM2MSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.slyqis8DTBNVJtFnELAFK79B4XUZUKCu4quO3KgFKPo	2025-07-11 17:59:32.097247+07	2025-07-12 17:59:32+07	18	9d282b7f81a64a0a8a9de9eb722cf361
36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjMyMzEwMCwiaWF0IjoxNzUyMjM2NzAwLCJqdGkiOiIzMzBhNWZiZTM5ZGM0ZGUxYTg0MWE5ZWI3ZDE5Y2RiNyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.4uVzXNw1iN8a_rMwcxaKdElqBjYw2MIP2Ke9qk3Ew0k	2025-07-11 19:25:00.278916+07	2025-07-12 19:25:00+07	18	330a5fbe39dc4de1a841a9eb7d19cdb7
37	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjMyNjQwMCwiaWF0IjoxNzUyMjQwMDAwLCJqdGkiOiJlNWQ5OWViYjBlMzg0OTcyOTI4YjE4YzMzM2E2ZWZjZSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.eOUUokXe4rpHqv9OJUpRa0I-aQ43edVmg9UHrIau_Mg	2025-07-11 20:20:00.779131+07	2025-07-12 20:20:00+07	18	e5d99ebb0e384972928b18c333a6efce
38	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjMyOTcwMSwiaWF0IjoxNzUyMjQzMzAxLCJqdGkiOiI0NGZhMTc0NzdkOWI0YTI0ODgwMWQ1N2RlNjllMWU5MiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.3HtONc8Avj5QYbcILwlnSEdAuNnr826JCX4Hbx2CefM	2025-07-11 21:15:01.093257+07	2025-07-12 21:15:01+07	18	44fa17477d9b4a248801d57de69e1e92
39	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjMzMzAwMiwiaWF0IjoxNzUyMjQ2NjAyLCJqdGkiOiIwZmJlNjcwZDAxM2M0ODM1OTY4NDEyODY0Y2Y0NDE5MiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.3hjI18BGM354Jo0Yi1-HT2xbJpaFtzjKQDorIhPQd0w	2025-07-11 22:10:02.085617+07	2025-07-12 22:10:02+07	18	0fbe670d013c4835968412864cf44192
40	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjMzNDg0NCwiaWF0IjoxNzUyMjQ4NDQ0LCJqdGkiOiI3NDY0Nzk5MTdiOTI0NDJiYmFhZDMyMmQxMmZjNzhhNyIsInVzZXJfaWQiOjE4fQ.noO3m9t-jsIGKNoZZhVkFAyYDkqV16v9ZNvmgpM6DXA	2025-07-11 22:40:44.082096+07	2025-07-12 22:40:44+07	18	746479917b92442bbaad322d12fc78a7
41	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjM4MzAzMSwiaWF0IjoxNzUyMjk2NjMxLCJqdGkiOiJiOWY0MzUzYjQ5OTM0ZjkwYmJhZmRkZTI0MzY1YTJiMyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.27FKMeJqX1njRQso3kAjukNJbDtI9mjbV7p7GSEWQrc	2025-07-12 12:03:51.212395+07	2025-07-13 12:03:51+07	18	b9f4353b49934f90bbafdde24365a2b3
42	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjM4MzA2MiwiaWF0IjoxNzUyMjk2NjYyLCJqdGkiOiJiMTJhODE1MzJiZjY0ZDAxOGMzZWYzZjRmMGViMmIyYiIsInVzZXJfaWQiOjE4fQ.3csYx_e5e5d6d3e2XYZ1FLtQrP_hsjJB5Bo5FMPoPQ4	2025-07-12 12:04:22.729171+07	2025-07-13 12:04:22+07	18	b12a81532bf64d018c3ef3f4f0eb2b2b
43	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjM4NDYzMCwiaWF0IjoxNzUyMjk4MjMwLCJqdGkiOiJkY2MwOTk4MzFmZDU0ZDYxOTE1ZjNkMDFjZDlhNjViYyIsInVzZXJfaWQiOjEzfQ.9xLIi4SOnMXeail6zAH9_m238CZOVhiJmUgPJxf3f08	2025-07-12 12:30:30.586141+07	2025-07-13 12:30:30+07	13	dcc099831fd54d61915f3d01cd9a65bc
44	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjM4NDY0OCwiaWF0IjoxNzUyMjk4MjQ4LCJqdGkiOiIwMjM3ZGViYTQzMzM0YWRlYmI2Y2UzNzUyNDFkOGQyZSIsInVzZXJfaWQiOjE4fQ.MvaqzdugWzXWkjIz687-XGBM63QmqY25uJISC1X0xAs	2025-07-12 12:30:48.366267+07	2025-07-13 12:30:48+07	18	0237deba43334adebb6ce375241d8d2e
45	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjQwMjEwMCwiaWF0IjoxNzUyMzE1NzAwLCJqdGkiOiIwMmM5NjQ5MjA0NDY0YjU5OTAwN2RhMzVlZWQ5OTIwOSIsInVzZXJfaWQiOjE4fQ.C0uHd70iDM1g4t8wZ3bNI8Y_WStxB0tHOuBTmCn1K-I	2025-07-12 17:21:40.476133+07	2025-07-13 17:21:40+07	18	02c9649204464b599007da35eed99209
46	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjQwNjg4OSwiaWF0IjoxNzUyMzIwNDg5LCJqdGkiOiI4YTJiZWFlMzAxN2U0MmEyODlhNjU1YTMyMzFmNDNkYSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.T6bEJFfcUKv1WVzj2wnZV_51sYPgElevBTyzxiYPkHQ	2025-07-12 18:41:29.341776+07	2025-07-13 18:41:29+07	18	8a2beae3017e42a289a655a3231f43da
47	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjQxMDE4OSwiaWF0IjoxNzUyMzIzNzg5LCJqdGkiOiI2YWZlNTJiZTViNTg0N2NiYjVhNjE1NDM2ZjQ2ZjZmYSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9._j1x1Pdle3-ZktxZ1ymNoGKkfJyipA-0B08vswf9p4w	2025-07-12 19:36:29.380949+07	2025-07-13 19:36:29+07	18	6afe52be5b5847cbb5a615436f46f6fa
48	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjQxMjYyMCwiaWF0IjoxNzUyMzI2MjIwLCJqdGkiOiIxYjMzMWExYjhjMjk0ODQyYmVlNWMyMmJlMDhlYTNkNiIsInVzZXJfaWQiOjE4fQ.S_jI-ioM4Xwl3O6SoQ8yRdgmnJADZSYWE7JMakiK1P8	2025-07-12 20:17:00.67229+07	2025-07-13 20:17:00+07	18	1b331a1b8c294842bee5c22be08ea3d6
49	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjQxNjY2MiwiaWF0IjoxNzUyMzMwMjYyLCJqdGkiOiJjYjBhMjkzMWM4YzU0NzlhOTYyMDUzMGFjOTRhYjRkYyIsInVzZXJfaWQiOjE4fQ.H3EyBOxDVyD1OF6UEUk8ir9S-8JSE_UK24uMu1Q4rI8	2025-07-12 21:24:22.39874+07	2025-07-13 21:24:22+07	18	cb0a2931c8c5479a9620530ac94ab4dc
50	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjQxOTQwOCwiaWF0IjoxNzUyMzMzMDA4LCJqdGkiOiJiNDc3MmYwNTVlODY0NmY5OTc5YjdjNTU2ODYwNjc3ZCIsInVzZXJfaWQiOjE4fQ.CQ7HGbaaJOb_jAURFofVyL4VG2hGkV1fD910irp3EMA	2025-07-12 22:10:08.824807+07	2025-07-13 22:10:08+07	18	b4772f055e8646f9979b7c556860677d
51	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjQ2NzgzMSwiaWF0IjoxNzUyMzgxNDMxLCJqdGkiOiI2MzFkNTg5MTBiMzc0Yzk2YmZkZWZiMzk0N2Y2OGY5NyIsInVzZXJfaWQiOjE4fQ.CkBE_VoGJDdrdrcmmKhXxJZA-3NkwU1YxSZcw0A5rKs	2025-07-13 11:37:11.96694+07	2025-07-14 11:37:11+07	18	631d58910b374c96bfdefb3947f68f97
52	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjQ4NTYyMywiaWF0IjoxNzUyMzk5MjIzLCJqdGkiOiI4ODAzYmZhMTE2MzE0YzhhOWYwYzNlN2Q2MzdlNjZkYyIsInVzZXJfaWQiOjE4fQ.lZw0chVRut_3VpHb32IIRqzLVzY2PJjtma2E4sCWkKs	2025-07-13 16:33:43.442473+07	2025-07-14 16:33:43+07	18	8803bfa116314c8a9f0c3e7d637e66dc
53	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjUwMDYxNCwiaWF0IjoxNzUyNDE0MjE0LCJqdGkiOiIyMmY1NWIwNWUyNjE0NDYzYmQ5YzlmZmUxYWM0NDgyMCIsInVzZXJfaWQiOjE4fQ.FpUC6wAShGoRgy9zp25qpH1RbmMEWP5HRlVlvMkntWU	2025-07-13 20:43:34.982896+07	2025-07-14 20:43:34+07	18	22f55b05e2614463bd9c9ffe1ac44820
54	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjUwNDA3MiwiaWF0IjoxNzUyNDE3NjcyLCJqdGkiOiJiNDEwMjY4Mjk3ZjM0ZGEyYjBiOTFjMWM1NzQ1ZWY5ZSIsInVzZXJfaWQiOjE4fQ.ctao8ROXu1cUXd7iWrsQyGo2j_6MpFJF4fLP95pf0q4	2025-07-13 21:41:12.894775+07	2025-07-14 21:41:12+07	18	b410268297f34da2b0b91c1c5745ef9e
55	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjU3MzQ0OCwiaWF0IjoxNzUyNDg3MDQ4LCJqdGkiOiJhOWMzOWQ1MTg4ODI0Y2Y3OTk3ZmNmYjFjNGE2YjlmOSIsInVzZXJfaWQiOjE4fQ._fkt8O0kW0LzD957z8GR5RO2eYjv9W6DmPb0Oekxpn4	2025-07-14 16:57:28.413019+07	2025-07-15 16:57:28+07	18	a9c39d5188824cf7997fcfb1c4a6b9f9
56	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjU4NTcxMCwiaWF0IjoxNzUyNDk5MzEwLCJqdGkiOiIyZDk1MTNmYzlkMTE0MGI1ODU2N2FkNWM4YzZhNmU2MCIsInVzZXJfaWQiOjE4fQ.dJWb6ev7rdHZzA2ANm-mTSfMFn-ZobBy8Em4FfZxit0	2025-07-14 20:21:50.986653+07	2025-07-15 20:21:50+07	18	2d9513fc9d1140b58567ad5c8c6a6e60
57	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjU4OTAxMCwiaWF0IjoxNzUyNTAyNjEwLCJqdGkiOiJkYjcxNmIzMTM3YWY0Njk3YTUyNzM1YjcwYmE4NjJhZCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.WGAQdrj6jxeogdOPoHZNhwzLvlvPHBKhtnVrVC7Z2CU	2025-07-14 21:16:50.349508+07	2025-07-15 21:16:50+07	18	db716b3137af4697a52735b70ba862ad
58	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjY1OTgzOCwiaWF0IjoxNzUyNTczNDM4LCJqdGkiOiI2ODA0NTE1N2M3ZGU0OWY0OWU0YTA0ZGQ4OWEyMTFkZSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.D_bND7bHcegkh0pU_Bk34KY0Ne-sbCREDjkOIoAEEJU	\N	2025-07-16 16:57:18+07	\N	68045157c7de49f49e4a04dd89a211de
59	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjY2NTkwMiwiaWF0IjoxNzUyNTc5NTAyLCJqdGkiOiIzZmI3NzMxOWNlMTg0ZWI0ODcwYmJiM2VmZDQ1MjI2MiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.3pjYMGgb6-oFomjZlKDMXFB1RmG5BgOxWrT5w6ybXlY	\N	2025-07-16 18:38:22+07	\N	3fb77319ce184eb4870bbb3efd452262
60	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjY2OTIwMiwiaWF0IjoxNzUyNTgyODAyLCJqdGkiOiJkNzE5ZGMyMTM1ODc0OGZjYjY3ZGVkYTI2OWFkMWVlMyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.V9a2zXwgMhh110LaxqHWSgrGfmNfylBE4INKI60F85w	\N	2025-07-16 19:33:22+07	\N	d719dc21358748fcb67deda269ad1ee3
61	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Mjc1MzI3MywiaWF0IjoxNzUyNjY2ODczLCJqdGkiOiI0NjAwZjFkMjY1Zjg0NGYzYTVhZGVlYjc5ODFlZDY0ZCIsInVzZXJfaWQiOjE4fQ.g80JFnegtcCITGyMLmqCCaVJkIOPuZD6dQvxPxUxWjw	2025-07-16 18:54:33.078359+07	2025-07-17 18:54:33+07	18	4600f1d265f844f3a5adeeb7981ed64d
62	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Mjc1Njg5OCwiaWF0IjoxNzUyNjcwNDk4LCJqdGkiOiI5NDA3NWRjZjVjZTg0YTg2OTlkZTAzYTgzZjdmODM0YiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.sWc-ocWU2iuY7KzFlLuPMoqF5ZMm8qogUQizbisI0GU	\N	2025-07-17 19:54:58+07	\N	94075dcf5ce84a8699de03a83f7f834b
63	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjgxOTE3MCwiaWF0IjoxNzUyNzMyNzcwLCJqdGkiOiI0ZTVhNzEwNjAxMDE0YTIyOTQ3MGQ3YzhlYWYxYTczNCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.auY13typHPPf8k8uXVNce-X9TX_R28CJBcG1105aats	\N	2025-07-18 13:12:50+07	\N	4e5a710601014a229470d7c8eaf1a734
64	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjgyNDE0OSwiaWF0IjoxNzUyNzM3NzQ5LCJqdGkiOiI1ZGU3NTRkMDVhZmQ0NDIwODBiNDBiYzdlZWNlODUzYSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.b31Jxzrc6CR6kH460ibH7zoVbDwqRfg5FwZToTjGqfQ	\N	2025-07-18 14:35:49+07	\N	5de754d05afd442080b40bc7eece853a
65	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjgyOTAyMSwiaWF0IjoxNzUyNzQyNjIxLCJqdGkiOiI3MzkxNDVlNDQ3OWY0MDBhYjA5OTY5OTk0ZDQ0MTk1NSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.Wmr0nvDnq-NfIefgoHeI6gfQU2cXfcxRzI-_1L1ZDt0	\N	2025-07-18 15:57:01+07	\N	739145e4479f400ab09969994d441955
66	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjgzMjMyMSwiaWF0IjoxNzUyNzQ1OTIxLCJqdGkiOiI2NmQwODMzMWMzZjE0MmE1OThkZTIyZjllODhlZjQwZiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.aC7aeX1pHtf0c2XEoyUOzZj7OBcWFf_7nQ7_TpR6VLQ	\N	2025-07-18 16:52:01+07	\N	66d08331c3f142a598de22f9e88ef40f
67	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjgzOTI0OSwiaWF0IjoxNzUyNzUyODQ5LCJqdGkiOiIyZDMyY2I1ODEyZjg0NTBhOGQ2MWU0MDQyNGFhM2NmMCIsInVzZXJfaWQiOjE4fQ.y3NLUN6GpERzZoYRWp2YdFVmhSjymrlBD5AUQHez_Os	2025-07-17 18:47:29.557944+07	2025-07-18 18:47:29+07	18	2d32cb5812f8450a8d61e40424aa3cf0
68	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Mjg0NzI4MSwiaWF0IjoxNzUyNzYwODgxLCJqdGkiOiJlMGY4OWIyZGEzNjA0ZmE3OGQwMjk4YjRmNDUwNDU1ZCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.gmE_7oDqyXVDuwxNQpsQ090IDzKDjsgrVW8LaCJITSI	\N	2025-07-18 21:01:21+07	\N	e0f89b2da3604fa78d0298b4f450455d
69	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjkwNjU3OCwiaWF0IjoxNzUyODIwMTc4LCJqdGkiOiI5MTE5YTM5ZTdkOTk0OGRkYjk3NTI0MDMwMTczNjFmZSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.EYAP6ueXY5zz6C1XMpvcy6RboAqHHmOOvn40Bn26rJc	\N	2025-07-19 13:29:38+07	\N	9119a39e7d9948ddb9752403017361fe
70	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjkwOTg3OCwiaWF0IjoxNzUyODIzNDc4LCJqdGkiOiJjOTA5Zjg4MmVhNmM0ZDcwOGIyMTk0NzVkOGZmM2ZhZiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.0ftvFSxpCOY_H-xGgg7k9PMTnpsiyBSm_8g3SoqsLyI	\N	2025-07-19 14:24:38+07	\N	c909f882ea6c4d708b219475d8ff3faf
71	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjkyMjczOCwiaWF0IjoxNzUyODM2MzM4LCJqdGkiOiJkNjVkZTBhZDQ1NTE0NzEzOTBjMDAyNDFhNjkwZDcxNiIsInVzZXJfaWQiOjE4fQ.T68xXvCjd7KEceiTjwgN2r2p1v_p95zCbBHZtzeIBuI	2025-07-18 17:58:58.607028+07	2025-07-19 17:58:58+07	18	d65de0ad4551471390c00241a690d716
72	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjkzNTUwNiwiaWF0IjoxNzUyODQ5MTA2LCJqdGkiOiJkY2Y5ZTZlZmI2NGM0NDM5YTU4ZGY0OGY2ZjIwYzc5OSIsInVzZXJfaWQiOjE4fQ.tkh4B_hh1TVzxrEZynwdGhPxCuJLTXdpatcc0zDzRgg	2025-07-18 21:31:46.673905+07	2025-07-19 21:31:46+07	18	dcf9e6efb64c4439a58df48f6f20c799
73	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjkzODgwNiwiaWF0IjoxNzUyODUyNDA2LCJqdGkiOiJiY2EwOTE5MjA1Nzk0ZWJhYTU5MWE4NDIyZTA3YWJlZCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.w69XdqeYZuF5ecJHdOPmzpfx4aVndHQQiCgiGgcA96g	\N	2025-07-19 22:26:46+07	\N	bca0919205794ebaa591a8422e07abed
74	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Mjk5NTM1NiwiaWF0IjoxNzUyOTA4OTU2LCJqdGkiOiIwYTUzM2ZjMDYzNmU0YmViOGE2ZGFiZjNlNDdlZGVhMSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.CR_P-k5RcrADSNjNSVnSmVm6oL_zg82bPZH5iIDHDYk	\N	2025-07-20 14:09:16+07	\N	0a533fc0636e4beb8a6dabf3e47edea1
75	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzAwNjk2NywiaWF0IjoxNzUyOTIwNTY3LCJqdGkiOiJhNzQ2NjhmMWE3ZmI0MTg4YWQ4YzQyZWRlZDNjYjM3MiIsInVzZXJfaWQiOjE4fQ.GEjudhirVj68_B6iEvDwaDeSj8a95UXjFklQDzHBepo	2025-07-19 17:22:47.692071+07	2025-07-20 17:22:47+07	18	a74668f1a7fb4188ad8c42eded3cb372
76	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzAxMTUyNCwiaWF0IjoxNzUyOTI1MTI0LCJqdGkiOiJlMWIwNDdkOTI3NWQ0YmE0OGQyZDg2YWY5MjY1MDhkYyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.BZKoyRr-WIL6ObU6ZyPz1U_illjpehG703Gi_8cD7QA	\N	2025-07-20 18:38:44+07	\N	e1b047d9275d4ba48d2d86af926508dc
77	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzAxNzMwMCwiaWF0IjoxNzUyOTMwOTAwLCJqdGkiOiJhZmZlYTVhNzc1ZjM0NDM3OTZkZTVmYTFhNDIyNjE0YSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.QFX2o3Cvxgggn1AyfvLOsV3l29scWiLsMo81r3PZI_8	2025-07-19 21:10:00.755542+07	2025-07-20 20:15:00+07	18	affea5a775f3443796de5fa1a422614a
78	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzAyMDYwMCwiaWF0IjoxNzUyOTM0MjAwLCJqdGkiOiI3ZjJhMDQ1ZGYxYjg0ODJhYjI0NWMxODcyNjRjYjRhMyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.C7TtAGBJ1yLbfU_V1AkgIbRe1o8iu06N-tlz_RlH0FM	2025-07-19 21:10:00.755542+07	2025-07-20 21:10:00+07	18	7f2a045df1b8482ab245c187264cb4a3
79	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzAyNDYzNCwiaWF0IjoxNzUyOTM4MjM0LCJqdGkiOiIxMGNkMjFkZDc1Mzk0ZTk4OGU3Njc0OTg0YmM0YTE2MSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.ndj2p1z1dTJ-KlW1oaumiLimw86e0_6WxqErrjBjnEE	2025-07-19 22:17:14.444936+07	2025-07-20 22:17:14+07	18	10cd21dd75394e988e7674984bc4a161
80	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzA3MzI2OSwiaWF0IjoxNzUyOTg2ODY5LCJqdGkiOiI1MWIyY2RiZWRjY2E0OTdkYTIzZTUyYzU1MjViZDQwMCIsInVzZXJfaWQiOjE4fQ.mG6F3K_TRirkoyY8wfF5H8mr1wsXLq-6L-cLy7V0y0w	2025-07-20 11:47:49.377473+07	2025-07-21 11:47:49+07	18	51b2cdbedcca497da23e52c5525bd400
81	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzA3NjU2OSwiaWF0IjoxNzUyOTkwMTY5LCJqdGkiOiIwOWY5ZWM3NWZlNzg0ZTdjODA2MDA1YzQyNWVhMTc2ZCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.Mk2EINrutYHWIaqTBXqtvJ1nRGUzvhDF-OVI-0-iO_0	2025-07-20 12:42:49.001472+07	2025-07-21 12:42:49+07	18	09f9ec75fe784e7c806005c425ea176d
82	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzEwODU5MiwiaWF0IjoxNzUzMDIyMTkyLCJqdGkiOiI5ZjU2ZGU4OTI2OTE0MjczOGI4Njk1OWU4YTFjNTc2MCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.sz6lYORHbForpDGOvSaVqAOW4eGNmIE0kPmp5xxGrnQ	2025-07-20 21:36:32.073622+07	2025-07-21 21:36:32+07	18	9f56de89269142738b86959e8a1c5760
83	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzEwODgzMiwiaWF0IjoxNzUzMDIyNDMyLCJqdGkiOiJjMDIyZGZmNzAzNDU0NzBlYmZiZmVjMDEwNzQ4MzU0NiIsInVzZXJfaWQiOjE4fQ.Wjn3E4PkQmwdCZaGk3OovFWwRNCjwYNmRZoF2Zvx3YU	2025-07-20 21:40:32.427255+07	2025-07-21 21:40:32+07	18	c022dff70345470ebfbfec0107483546
84	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzE3MTkzMCwiaWF0IjoxNzUzMDg1NTMwLCJqdGkiOiIwYmQ4ZTBiYmQzMGM0OWM2YmNmN2M3NzRlNjkzMDAzNCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.QZN_Yvi1nMDti5ESSPe8DD3w2EjLo2hk3Nszbrjai8A	\N	2025-07-22 15:12:10+07	\N	0bd8e0bbd30c49c6bcf7c774e6930034
106	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NDUwMTg1OSwiaWF0IjoxNzU0NDE1NDU5LCJqdGkiOiJjOTcwZGFlMGVkZWQ0MWYzODkyMDBjOTg0ZmE5ZGFiZSIsInVzZXJfaWQiOjE4fQ.0OI0elD3YESmPA7db3ADQBNS1K-5zRYotbUdkJBTQmA	2025-08-06 00:37:39.896916+07	2025-08-07 00:37:39+07	18	c970dae0eded41f389200c984fa9dabe
85	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzE5MDczOCwiaWF0IjoxNzUzMTA0MzM4LCJqdGkiOiI0ODUwMGI5NTU5YjE0ZmVmYjBlNDIxZTc5OTcyNWJmNiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.MpwhzRWV1igmCUc8OmmsDAiq7fm0kaQFmrP1-iXAs7I	\N	2025-07-22 20:25:38+07	\N	48500b9559b14fefb0e421e799725bf6
86	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzI2NzI3OCwiaWF0IjoxNzUzMTgwODc4LCJqdGkiOiIzNTc3ZmQzMjVmMjk0YmY5YTQxYzI0NmE2OWNkOWNjZiIsInVzZXJfaWQiOjE4fQ.IJiohL73Mklb9ZMYUvy5DJxr3C-yMbb7gHujUhkBQ9c	2025-07-22 17:41:18.928568+07	2025-07-23 17:41:18+07	18	3577fd325f294bf9a41c246a69cd9ccf
87	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzI3MDU3OCwiaWF0IjoxNzUzMTg0MTc4LCJqdGkiOiJiMTVmMDFkZWI4NzI0MGJhOWM0ZWQ5NGM4MjEwYTdmMSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.fbsQ9HidKIJLkeCx7h6PaLeAXeXQgqsUbdxKrqN201s	2025-07-22 18:36:18.026622+07	2025-07-23 18:36:18+07	18	b15f01deb87240ba9c4ed94c8210a7f1
88	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzI3MDc0MiwiaWF0IjoxNzUzMTg0MzQyLCJqdGkiOiI1ZWY2ZjAwZjFjZjI0NTU0YmMyYzNiMDQ2MzJjYTMyNCIsInVzZXJfaWQiOjEzfQ.IovzsJQL5QpyCLJI_sKUOokCGh1-BMNJEOokS9IoQoY	2025-07-22 18:39:02.738197+07	2025-07-23 18:39:02+07	13	5ef6f00f1cf24554bc2c3b04632ca324
89	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzI3MDg0MCwiaWF0IjoxNzUzMTg0NDQwLCJqdGkiOiJmMTM5NDk5NjRhZWI0ZmMxODllMzU1M2M2MmI2YzBhYiIsInVzZXJfaWQiOjE4fQ.q_lg-ykGUz7fJXqrwFcOQSUdqNkNUeKly2gCkIilzmM	2025-07-22 18:40:40.307961+07	2025-07-23 18:40:40+07	18	f13949964aeb4fc189e3553c62b6c0ab
90	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzI3NDE0MCwiaWF0IjoxNzUzMTg3NzQwLCJqdGkiOiI5N2ZmZDUzYjU3NTA0ZTEwYjM3Y2UxZDk0YTNhMjEwMyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.2qcbYfOobAY0HWfyPM2wSfFX7lBP08Hw5fKf8Qg5eWY	2025-07-22 19:35:40.671107+07	2025-07-23 19:35:40+07	18	97ffd53b57504e10b37ce1d94a3a2103
91	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzI3NzQ0MCwiaWF0IjoxNzUzMTkxMDQwLCJqdGkiOiJmZGZmMTBlZTgyNDU0NWQ1OTFhNzY3ZDBiMjQ2M2Y4NyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.mlJUMqa1q-ceQK8NbIGjpKcOlZcNRT3LyI5IiD4YNxY	2025-07-22 20:30:40.006023+07	2025-07-23 20:30:40+07	18	fdff10ee824545d591a767d0b2463f87
92	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzQ1MDM4MSwiaWF0IjoxNzUzMzYzOTgxLCJqdGkiOiJkNzEwMWVmOGRmMGE0NDM3OTljMDlmZWM2MWJjZjA2YSIsInVzZXJfaWQiOjE4fQ.7H1ePMGI9OMVTc7lSXclsmOvpQAcBmWhOQOq_KrZ35U	2025-07-24 20:33:01.697834+07	2025-07-25 20:33:01+07	18	d7101ef8df0a443799c09fec61bcf06a
93	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzQ1MzY4MSwiaWF0IjoxNzUzMzY3MjgxLCJqdGkiOiI5YTBlZTdkNjc3ODY0ZDQ5ODVkNjdjNGFmZTEyZDA5MSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.1sDiA08NjbFPcJrmMZtoycCrv6zHDhBBJVpUfc_IE4w	2025-07-24 21:28:01.851514+07	2025-07-25 21:28:01+07	18	9a0ee7d677864d4985d67c4afe12d091
94	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzQ5ODUxNiwiaWF0IjoxNzUzNDEyMTE2LCJqdGkiOiI1YTBkMzIyNzcxOTg0YzEwOTkwZGFjODA4OWE3MmRjZSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.v2bEw96iqU9I63FSDECmj7I9OF4-SjZBdlURqlD10ME	2025-07-25 09:55:16.955395+07	2025-07-26 09:55:16+07	18	5a0d322771984c10990dac8089a72dce
95	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzQ5ODUyNywiaWF0IjoxNzUzNDEyMTI3LCJqdGkiOiIwOGVhYTFmMGJmNzI0MGY0ODA0NzNkNzcyMDNjNDZlYiIsInVzZXJfaWQiOjE4fQ.qMAnkajKO5IquJqtKBDa4vUIQDKS_Hp8TAA9OnsUIw8	2025-07-25 09:55:27.030922+07	2025-07-26 09:55:27+07	18	08eaa1f0bf7240f480473d77203c46eb
96	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzQ5ODc2MiwiaWF0IjoxNzUzNDEyMzYyLCJqdGkiOiI5YTZmYjU4YjAxNTk0ZmMyOWNhM2U5NDhmNjU3NmM3MyIsInVzZXJfaWQiOjE4fQ.LQVSV_-Y6RItDW5_qIU2Blhg1_la9aRHvPUEQifSLzM	2025-07-25 09:59:22.488689+07	2025-07-26 09:59:22+07	18	9a6fb58b01594fc29ca3e948f6576c73
97	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MzQ5ODc4NCwiaWF0IjoxNzUzNDEyMzg0LCJqdGkiOiIxYzNlYThjNWVjYjk0NGY4YjIzYzg0Y2EyYmUzY2MxYyIsInVzZXJfaWQiOjE4fQ.zfB_dNdhxFjI39Vv2BplB0Jux9IzJ4xPBuB_YEqIeyI	2025-07-25 09:59:44.311093+07	2025-07-26 09:59:44+07	18	1c3ea8c5ecb944f8b23c84ca2be3cc1c
98	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Mzc4NjI1MSwiaWF0IjoxNzUzNjk5ODUxLCJqdGkiOiI4OTM5NDBkMmI1MWE0NDczYWNjZGYyMzA5MmI5YWQyYSIsInVzZXJfaWQiOjE4fQ.HgtfImxhURnHdIBJfZAeFFtEuxXsIgLKJ2Wm1Dq_rJk	2025-07-28 17:50:51.960424+07	2025-07-29 17:50:51+07	18	893940d2b51a4473accdf23092b9ad2a
99	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Mzc4NjI1MiwiaWF0IjoxNzUzNjk5ODUyLCJqdGkiOiIwOWM2MjExOGQ5Zjg0NWIzODA3M2MxMTM5NDYyNzNlYyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.E9xAw8Wo79SDbQ9CpUuXLgJd-g4lSTt-n4v0tt_8_Mc	2025-07-28 17:50:52.001816+07	2025-07-29 17:50:52+07	18	09c62118d9f845b38073c113946273ec
100	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Mzc5MDQ1MSwiaWF0IjoxNzUzNzA0MDUxLCJqdGkiOiI4OWRmODJhNDEwZjU0Y2I4YTI3OTNkMzg4N2RiZGViNiIsInVzZXJfaWQiOjE4fQ.79Iyu4oRElV8EACsPjOtGoam28t8zSIWGh-Br2LejrA	2025-07-28 19:00:51.215032+07	2025-07-29 19:00:51+07	18	89df82a410f54cb8a2793d3887dbdeb6
101	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Mzc5NDQ3NSwiaWF0IjoxNzUzNzA4MDc1LCJqdGkiOiI0YmUyNjk0Y2M2YmE0NjgyYWY5Y2I1ZGVmNjQyMzc2YyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.GOXdouKZ6iDEmbnXyyQwDjuhv4yyML8SgbZzPohWF00	2025-07-28 20:07:55.413115+07	2025-07-29 20:07:55+07	18	4be2694cc6ba4682af9cb5def642376c
102	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NDA3MjEzOCwiaWF0IjoxNzUzOTg1NzM4LCJqdGkiOiJmYTYwYjEyODQ3ZjE0MmM3OTFmMGI1NWE1NzdmYmU1OSIsInVzZXJfaWQiOjE4fQ.CqxfTkBlaJsVpgA29q4xJ7TyfkFO73TastSQ6_xb4Pk	2025-08-01 01:15:38.183406+07	2025-08-02 01:15:38+07	18	fa60b12847f142c791f0b55a577fbe59
103	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NDA3MjEzOCwiaWF0IjoxNzUzOTg1NzM4LCJqdGkiOiJjMTVhMzIxNjlhNmY0NWI1OWNjNWRmODgwOTUyNTFlMiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.mc7BdAPwOFgNToT-ZvAYEMdh0b1ZvMgAYGq7F_x6hjw	2025-08-01 01:15:38.239476+07	2025-08-02 01:15:38+07	18	c15a32169a6f45b59cc5df88095251e2
105	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NDI0MDc5MCwiaWF0IjoxNzU0MTU0MzkwLCJqdGkiOiI5ZWJhN2MwMTdhYzc0NjYxYjZmYTljNThhYzEzNzIxYSIsInVzZXJfaWQiOjE4fQ.NnHgJd86zOgO1k0i-qs7cU_VsoscjimYeO2O0nck7Zg	2025-08-03 00:06:30.7373+07	2025-08-04 00:06:30+07	18	9eba7c017ac74661b6fa9c58ac13721a
107	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NDUwNTE1OSwiaWF0IjoxNzU0NDE4NzU5LCJqdGkiOiJmNWUyOTE2OGE2Nzg0MzNlOTQwYWUwYmFmZDQwOTc0ZCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.Qcwe0GV8Ia1fQKxlISBNajYoA5b6t9ywinyd5mjsbAo	2025-08-06 01:32:39.807268+07	2025-08-07 01:32:39+07	18	f5e29168a678433e940ae0bafd40974d
108	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NDY3NTI4MCwiaWF0IjoxNzU0NTg4ODgwLCJqdGkiOiIxN2U0ZjY2ZTliMGE0N2IwYTlkZjJjOWI2YmI2NGViOSIsInVzZXJfaWQiOjE4fQ.LZtSiGfnEplYalhXKZM3xPVechj-v8zvdan0i77Hwuk	2025-08-08 00:48:00.775098+07	2025-08-09 00:48:00+07	18	17e4f66e9b0a47b0a9df2c9b6bb64eb9
110	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NDY3NTI4MCwiaWF0IjoxNzU0NTg4ODgwLCJqdGkiOiIxOWMxNGU5NjJkNGQ0MTEwYWM3ZDlkMjQwOTYzM2ViYSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.O7J0QA44uNASrCITg_WVKjDVAYn6IeMDkMwGWu21B34	\N	2025-08-09 00:48:00+07	\N	19c14e962d4d4110ac7d9d2409633eba
111	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NDY3NTM5NiwiaWF0IjoxNzU0NTg4OTk2LCJqdGkiOiI0Yzk3ZmViZTRkZmU0MWQxYjBlODJiNWI0M2JhYTk3OSIsInVzZXJfaWQiOjE4fQ.6kAQXCAGjaBom9rCtf5X_ekNJu7bmrwZKnxZtIqlIJs	2025-08-08 00:49:56.14444+07	2025-08-09 00:49:56+07	18	4c97febe4dfe41d1b0e82b5b43baa979
112	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NDkyODYzNiwiaWF0IjoxNzU0ODQyMjM2LCJqdGkiOiI5OGQwYzgyOTZhMjc0NmNjYjRhYmZlY2NkNzgzYWJmMSIsInVzZXJfaWQiOjE4fQ.PFEVg8reZzZ34jLopYWjfndDKBbO4s0PZECGb_DGmy0	2025-08-10 23:10:36.951248+07	2025-08-11 23:10:36+07	18	98d0c8296a2746ccb4abfeccd783abf1
113	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NDkzNDE5MiwiaWF0IjoxNzU0ODQ3NzkyLCJqdGkiOiJkZGFjN2FlMmE1OTg0M2RmOGQxMDJiNzVmZDMxZTFmMSIsInVzZXJfaWQiOjE4fQ.fY3NUKJJna5ci_EWXnuToqbupg8ao9xr5TW4bY71hSk	2025-08-11 00:43:12.977732+07	2025-08-12 00:43:12+07	18	ddac7ae2a59843df8d102b75fd31e1f1
114	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTAyMjA1OCwiaWF0IjoxNzU0OTM1NjU4LCJqdGkiOiI1NDZkYjMxMDk2MDE0NzA2OWJlMjFjYmQ0NWJhZDZjNCIsInVzZXJfaWQiOjE4fQ.bR3zrsItSiY_gjTLopHAWFoaG_zTw7OiU8_ritgx2BI	2025-08-12 01:07:38.424203+07	2025-08-13 01:07:38+07	18	546db310960147069be21cbd45bad6c4
115	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTAyMjA1OCwiaWF0IjoxNzU0OTM1NjU4LCJqdGkiOiI2MzU1ZjZhNGZkMjk0NGMzYmMxZjZkMmY2N2MyZjVkMCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.6dcTui5vJuGJDkEgWH9-0YJhyRe8Q_JAb5i7LPwDTZI	2025-08-12 01:07:38.470349+07	2025-08-13 01:07:38+07	18	6355f6a4fd2944c3bc1f6d2f67c2f5d0
116	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTAyMjEzMiwiaWF0IjoxNzU0OTM1NzMyLCJqdGkiOiIwNmIwOGRlMWZjN2Q0YjBiOGNiMzE0NmQ1MDIzMzJjMSIsInVzZXJfaWQiOjE4fQ.oO68WXjm2xFIrIKWGXVjuVeK8lGOUkwOKNw4EJ6q-3g	2025-08-12 01:08:52.037091+07	2025-08-13 01:08:52+07	18	06b08de1fc7d4b0b8cb3146d502332c1
117	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTA5MzA2NCwiaWF0IjoxNzU1MDA2NjY0LCJqdGkiOiIyYTg2ZjZiOTU4NjM0N2Y0Yjg5OGY4ZTY2NDlhOWYwNSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.O4xDeFc1oB5ZpqtqMjTJu0FqvwV1dxl0gZdsjnZu4q4	2025-08-12 20:51:04.346194+07	2025-08-13 20:51:04+07	18	2a86f6b9586347f4b898f8e6649a9f05
118	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTA5NjM2NCwiaWF0IjoxNzU1MDA5OTY0LCJqdGkiOiIxYjJlMjM3ZDU5NTQ0ZDkxYTlhMmUyYWI5N2Y3NjE0YSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.NFGPbN_BLHgrE1xXp2XNdI1pLYNOU9VSBAw87D1v6Bo	2025-08-12 21:46:04.498929+07	2025-08-13 21:46:04+07	18	1b2e237d59544d91a9a2e2ab97f7614a
119	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTEwMDEzNywiaWF0IjoxNzU1MDEzNzM3LCJqdGkiOiJkZGZmOTY3ZDdmNzc0MGUwOWU3NDI0YzEwODRhNTE3NCIsInVzZXJfaWQiOjE4fQ.q4vxB_TtT72X_plIsN0QayBG_F37e6yYp08hPZRx_Bo	2025-08-12 22:48:57.2987+07	2025-08-13 22:48:57+07	18	ddff967d7f7740e09e7424c1084a5174
120	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTEwMDYxMywiaWF0IjoxNzU1MDE0MjEzLCJqdGkiOiI1MTg0MDNhZTNlMmE0MWQwYmRiOTEyM2U2MGIwZTg0ZiIsInVzZXJfaWQiOjE4fQ.LpInbKq9fKYtjvr2054StBLFT9hgSY9h9Hf2pob1BRE	2025-08-12 22:56:53.310495+07	2025-08-13 22:56:53+07	18	518403ae3e2a41d0bdb9123e60b0e84f
121	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTEwMzkxMywiaWF0IjoxNzU1MDE3NTEzLCJqdGkiOiJkMDg3ZDE0OTE3ZjA0NTA1YmI5MGRhMDM4MjczNzc4NiIsInVzZXJfaWQiOjE4fQ.tdD5691idlnxt8FgnDSJTsz-XcP9YpRvP5mirGychyI	2025-08-12 23:51:53.498855+07	2025-08-13 23:51:53+07	18	d087d14917f04505bb90da0382737786
123	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTEwMzkxMywiaWF0IjoxNzU1MDE3NTEzLCJqdGkiOiJmOTBjODRhM2RlNDk0NzM4YjM2NGNmY2QxYjZhYmMwMCIsInVzZXJfaWQiOjE4fQ.LPcflel2dpQugCOBMVeXMUc6U4hni0Hi8F-B71M8rN0	2025-08-12 23:51:53.502331+07	2025-08-13 23:51:53+07	18	f90c84a3de494738b364cfcd1b6abc00
122	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTEwMzkxMywiaWF0IjoxNzU1MDE3NTEzLCJqdGkiOiI4YzE1OTYxZWRmYTg0YjJmODQxN2QxMzdlMGQyOTk2YSIsInVzZXJfaWQiOjE4fQ.7_9h29NnboU2sfeMsujg-sCJKLJ1ieLNJN7xY57c0og	2025-08-12 23:51:53.505956+07	2025-08-13 23:51:53+07	18	8c15961edfa84b2f8417d137e0d2996a
124	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTM2OTk3NCwiaWF0IjoxNzU1MjgzNTc0LCJqdGkiOiI0NDkwMjRkYjVhMDQ0ZjFmYmQxZTc3MTRmNWQxYTU0NiIsInVzZXJfaWQiOjE4fQ.wfKG7wtqqQfHwNQAnXAXzdlPfOnI36NAY7tKVn-fI-8	2025-08-16 01:46:14.208033+07	2025-08-17 01:46:14+07	18	449024db5a044f1fbd1e7714f5d1a546
125	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTQ0OTk0OCwiaWF0IjoxNzU1MzYzNTQ4LCJqdGkiOiI2YWRiMzFmYWRhZWM0MTc0YjE4MjY2MTMyOTcwNGY1ZSIsInVzZXJfaWQiOjE4fQ.yYih1y0eH8uB2oB2LP2mZS28DyCZYTpJlfuD5D8uomg	2025-08-16 23:59:08.235211+07	2025-08-17 23:59:08+07	18	6adb31fadaec4174b182661329704f5e
126	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTQ1MDU0NywiaWF0IjoxNzU1MzY0MTQ3LCJqdGkiOiJjZTA3NGFlM2UzMDU0MTQ3ODdhNDRlOWNmNGQ3YTgwYSIsInVzZXJfaWQiOjE4fQ.gsNoj2Xwsquk_eveRYAMea7EN3WxgCMVcM5De5IuA8o	2025-08-17 00:09:07.430822+07	2025-08-18 00:09:07+07	18	ce074ae3e305414787a44e9cf4d7a80a
127	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTQ1MzkyOSwiaWF0IjoxNzU1MzY3NTI5LCJqdGkiOiI4ZTI2ZDJlZTNkZTA0ZTBmYmFmODdjMjRkMzZmY2I2YSIsInVzZXJfaWQiOjE4fQ.ohN7s_EQ8euLiHcEvpqCOlHdw7aZXr_NfwYCAEH7wB8	2025-08-17 01:05:29.812339+07	2025-08-18 01:05:29+07	18	8e26d2ee3de04e0fbaf87c24d36fcb6a
128	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTYyMzQ1MCwiaWF0IjoxNzU1NTM3MDUwLCJqdGkiOiI5NTBjODE0NTY1YzQ0ZDk3ODM5YzYxOTEzNDhhNTQ3MCIsInVzZXJfaWQiOjE4fQ.O2_XxgQ8yXcB3oO7lKDJf5-efiFg8SNRDi3pBhyELbg	2025-08-19 00:10:50.573537+07	2025-08-20 00:10:50+07	18	950c814565c44d97839c6191348a5470
129	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTYyMzQ1MCwiaWF0IjoxNzU1NTM3MDUwLCJqdGkiOiI5ZTcxNGMyNmZiMjg0OTY0OTFhYjJkZGVlY2JjYjEzMiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.RCMPJsQHszWfvyxfJ3jJvAyVOuwqBJiQbQ0i_gtWWGg	\N	2025-08-20 00:10:50+07	\N	9e714c26fb28496491ab2ddeecbcb132
130	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTYzMjAwNSwiaWF0IjoxNzU1NTQ1NjA1LCJqdGkiOiIwOTY1NWViOTAzY2Y0YTI1YTQ3ZmZmNDZkMjdjNzViMSIsInVzZXJfaWQiOjE4fQ.Nt7bwBPp4XvlO2j3ppCoBmoyZ9NQykExDys0tJv1CLI	2025-08-19 02:33:25.514569+07	2025-08-20 02:33:25+07	18	09655eb903cf4a25a47fff46d27c75b1
131	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTcxMjE5NSwiaWF0IjoxNzU1NjI1Nzk1LCJqdGkiOiI2ZWZmMzg1MWYyMzU0ZDU0OTk5YmVlYmMzYmFiYmMzMyIsInVzZXJfaWQiOjE4fQ.yE_2Jj37IfJbwP9ZjvnG8c-VWB3mPVO4eEzjWco7rIg	2025-08-20 00:49:55.507016+07	2025-08-21 00:49:55+07	18	6eff3851f2354d54999beebc3babbc33
132	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTcxMjQ1NywiaWF0IjoxNzU1NjI2MDU3LCJqdGkiOiJmMTNkMTQxZDI4MzY0NDQwOTcwNDA1NjIzNzllZmMxNyIsInVzZXJfaWQiOjE4fQ.4o9AbHCyoGqupN0Cf3nOdL7BxNfmy2lNRFDyk-_1R6g	2025-08-20 00:54:17.276423+07	2025-08-21 00:54:17+07	18	f13d141d2836444097040562379efc17
133	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTcxMjY3MywiaWF0IjoxNzU1NjI2MjczLCJqdGkiOiJiYzY4MmJkNTg0OWY0Y2M4YjUxN2JmYmIwYzIyMTQ5OSIsInVzZXJfaWQiOjE4fQ.gfmr7_jF-LT3IH0iJHF2Tw57iWFlS9ps0F_d-kic1hU	2025-08-20 00:57:53.149375+07	2025-08-21 00:57:53+07	18	bc682bd5849f4cc8b517bfbb0c221499
134	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTg1MzI4NywiaWF0IjoxNzU1NzY2ODg3LCJqdGkiOiJjZjBmYzIxMTY4MWE0Nzk0OGM1MjMwZGJmZDExYjZiOCIsInVzZXJfaWQiOjE4fQ.36wLWF6Gz3D_7X7Hc_d-AsWZVR82QniIzRe1cjBtv4M	2025-08-21 16:01:27.851975+07	2025-08-22 16:01:27+07	18	cf0fc211681a47948c5230dbfd11b6b8
135	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTg3OTEyMywiaWF0IjoxNzU1NzkyNzIzLCJqdGkiOiI4ZTllNGFhYzdmMDM0MmNhOWE4M2U3NmZjMWQyYzBmNiIsInVzZXJfaWQiOjE4fQ.gULlxWjSEFbeUOCSFBtiprpCilybdfcxvTuYST0sVvE	2025-08-21 23:12:03.304736+07	2025-08-22 23:12:03+07	18	8e9e4aac7f0342ca9a83e76fc1d2c0f6
136	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTg4MjQyMywiaWF0IjoxNzU1Nzk2MDIzLCJqdGkiOiJlZTJjNjU3YjU3Zjg0ZGNiOTI1ZjJhYmMxM2E5ZmJhNiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.c-YUVDuyGbiUbOdvuAQCubTZR_knBTa2C5rL2fASrgg	\N	2025-08-23 00:07:03+07	\N	ee2c657b57f84dcb925f2abc13a9fba6
137	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTg4NTcyMywiaWF0IjoxNzU1Nzk5MzIzLCJqdGkiOiJmYWYyYjY5MjVjNDI0YzAyYjE2NDg4ZTdhZmRiNWY2ZCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.aqVEyyfciVuE8brdLM1lgaRC7in-mhfAuoL5DpoYttA	\N	2025-08-23 01:02:03+07	\N	faf2b6925c424c02b16488e7afdb5f6d
138	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTg4OTAyMywiaWF0IjoxNzU1ODAyNjIzLCJqdGkiOiIzMGY1ZTVjMzhiZmQ0MmYyYWZjMjAzZGI2ZTQxNDhlNSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.JYsP6RU6Je-zhbrgQh0gjVu_uD6Ee5O8HbQRktEJI_Y	\N	2025-08-23 01:57:03+07	\N	30f5e5c38bfd42f2afc203db6e4148e5
139	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTg5MjMyMywiaWF0IjoxNzU1ODA1OTIzLCJqdGkiOiI2ZGVlOGY2MWFmZmQ0YmVlYTA3Y2E5OWFlOTU5MzBmZiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.ubNKcmUN_e4Feh6oSw1zUlVi9YovZMrdBWLhzUFsRo8	\N	2025-08-23 02:52:03+07	\N	6dee8f61affd4beea07ca99ae95930ff
140	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTg5NTYyMywiaWF0IjoxNzU1ODA5MjIzLCJqdGkiOiJlZTY4NzJkNGEzZTA0NTkwOTMzNjUwNDM0ZTg1OThmMCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.u4qqduHP52nKBYlSeqjAtgBnssgKaFGJ47vG7QYrtxk	\N	2025-08-23 03:47:03+07	\N	ee6872d4a3e04590933650434e8598f0
141	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTg5ODkyMywiaWF0IjoxNzU1ODEyNTIzLCJqdGkiOiJiMTI3MDhjZTFkOTE0NzJiYjkxZTEzMTYxM2UwYjE2ZCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.7YnnSO7EfjR97s7nfBO1iyactYcgpbzp4DXaW9W1-Uk	\N	2025-08-23 04:42:03+07	\N	b12708ce1d91472bb91e131613e0b16d
142	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTkwMjIyMywiaWF0IjoxNzU1ODE1ODIzLCJqdGkiOiIxNzAzNDYyYzFlNmY0M2ZjODE2ODYyNzVkM2NkYzRlNSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.gBhPJ66hlvUXkiwkVDRl5sPyrEr7JzD9xTFude0dgPM	\N	2025-08-23 05:37:03+07	\N	1703462c1e6f43fc81686275d3cdc4e5
143	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTkwNTUyMywiaWF0IjoxNzU1ODE5MTIzLCJqdGkiOiI1OTFlNTZmYTQ2M2Y0MDljODNkZGExYWJkMDdhNmY0NyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.JFjrHbSJ4aKcRlnrIQJWLNTFj-Ob2zW5C9VpZjy65gE	\N	2025-08-23 06:32:03+07	\N	591e56fa463f409c83dda1abd07a6f47
144	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTkwODgyMywiaWF0IjoxNzU1ODIyNDIzLCJqdGkiOiIxYzMzYzhjYmY0NDc0OTRkYThiZjdkODhlMTJmNDk5ZCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.v9VyZ_NqxwM28GJQy7KIHFIs4OeHWiVsOzVBHqv6zvI	\N	2025-08-23 07:27:03+07	\N	1c33c8cbf447494da8bf7d88e12f499d
145	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTk2NDUwNiwiaWF0IjoxNzU1ODc4MTA2LCJqdGkiOiJlMGE3MDY4NDMwZjQ0MTM5OGU5ZjExYmQ0ZWU0ODcxOCIsInVzZXJfaWQiOjE4fQ.g7jRHsWN3tx-mKJE8WFzxLVv_50R6x7j_Tm-r7CxrPo	2025-08-22 22:55:06.154591+07	2025-08-23 22:55:06+07	18	e0a7068430f441398e9f11bd4ee48718
146	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Njg3NzAxMiwiaWF0IjoxNzU2NzkwNjEyLCJqdGkiOiI0ZWRiODhhNTRkYmE0NjhmODg2MGI5OTlkOTFkZDUwNCIsInVzZXJfaWQiOjE4fQ.I4FsQDOKcdvXSTt6J0mWIKbSNf3AtMjawxnDHNPVLGY	2025-09-02 12:23:32.854264+07	2025-09-03 12:23:32+07	18	4edb88a54dba468f8860b999d91dd504
147	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Njk3Mzc3NCwiaWF0IjoxNzU2ODg3Mzc0LCJqdGkiOiJlODMzODVjNjBiMGI0ZTY0YjRiOTljMDI2ODE5ZGYyNiIsInVzZXJfaWQiOjE4fQ.5wpA6TqkVPrUseYFh07tUoUHiOR3gyP-zwMZGYnSpbA	2025-09-03 15:16:14.732342+07	2025-09-04 15:16:14+07	18	e83385c60b0b4e64b4b99c026819df26
148	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Njk3Mzc3NCwiaWF0IjoxNzU2ODg3Mzc0LCJqdGkiOiI3MzQxZGFhZjVjMGY0YjdmOTM1YjNkZGI3OWM3N2E1ZSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.lSDFV3ccSvIiLr1_cdttUA5cIszRYidxzbz1k6PglHI	\N	2025-09-04 15:16:14+07	\N	7341daaf5c0f4b7f935b3ddb79c77a5e
149	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NzEzMDU1MiwiaWF0IjoxNzU3MDQ0MTUyLCJqdGkiOiJmOTM1Yzc0NDA4NDc0NWJhYTVmYjliYTU4NDEyOTU1YSIsInVzZXJfaWQiOjE4fQ.HKlHkjTrjKd3pEEltDZ4erzkjmvSS2YcwQ2PlPjV3B4	2025-09-05 10:49:12.138144+07	2025-09-06 10:49:12+07	18	f935c744084745baa5fb9ba58412955a
150	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NzMxMTE2MSwiaWF0IjoxNzU3MjI0NzYxLCJqdGkiOiI1MjIyMmUyMDFlOTY0ZjgxOWVjODAxYjU0ZmE3MDY5MiIsInVzZXJfaWQiOjE4fQ.4NjxHo-zDMWfwVDcnxgdqow5BbSjlQUpg7e533dv8zA	2025-09-07 12:59:21.48334+07	2025-09-08 12:59:21+07	18	52222e201e964f819ec801b54fa70692
151	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NzM4NzQwNCwiaWF0IjoxNzU3MzAxMDA0LCJqdGkiOiI2NDBjNWRlYTA3MGY0ZmI4OGRlMzdiYWNmMWRmZmE0ZSIsInVzZXJfaWQiOjE4fQ.TX44OsOh67XWM6CTgALfI9M2iY9vDqEtxmixEbbeY5w	2025-09-08 10:10:04.650342+07	2025-09-09 10:10:04+07	18	640c5dea070f4fb88de37bacf1dffa4e
152	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NzU1OTMzNCwiaWF0IjoxNzU3NDcyOTM0LCJqdGkiOiIxM2QwYTk2OGViOWU0ZDVhOTRmOWZjNGJkMTQ0NzM1MyIsInVzZXJfaWQiOjE4fQ.EFMBdrnWwZATZHV-aofSKnbFwLWEbG2CJg3j0134MvI	2025-09-10 09:55:34.630245+07	2025-09-11 09:55:34+07	18	13d0a968eb9e4d5a94f9fc4bd1447353
153	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NzU1OTMzNCwiaWF0IjoxNzU3NDcyOTM0LCJqdGkiOiIyZmU5Y2MwOThkOTA0MjkyOGJmZTgxMGVhNmFkMWRkZCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.oqYgBegXMy_dZSvCHF3v5vKvg7TtIshjmVU5_ak2Nx8	\N	2025-09-11 09:55:34+07	\N	2fe9cc098d9042928bfe810ea6ad1ddd
154	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NzY2MzU4MiwiaWF0IjoxNzU3NTc3MTgyLCJqdGkiOiIwYTg3MGU5MTc0M2Q0NjQ2YWI4MTQyOTFhZTU4MGQyYSIsInVzZXJfaWQiOjE4fQ.482PDstZQzkqQTP5GzCrhiDHhppvScAMrzQ0KNp2DJ8	2025-09-11 14:53:02.730657+07	2025-09-12 14:53:02+07	18	0a870e91743d4646ab814291ae580d2a
155	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NzY2Mzg1MywiaWF0IjoxNzU3NTc3NDUzLCJqdGkiOiIwODk1NTAwYjkwYjY0MWM2OThlM2MwNjQxNjRkOGYzMiIsInVzZXJfaWQiOjE4fQ.CL5kQoR56kh35PxjuHNc0P81eYQ8OPMNgYoysl_lAi0	2025-09-11 14:57:33.512253+07	2025-09-12 14:57:33+07	18	0895500b90b641c698e3c064164d8f32
156	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1ODE2MjkzNCwiaWF0IjoxNzU4MDc2NTM0LCJqdGkiOiJjMGU0ZGRiOTA3YTU0NDUwYTNhYWQwNmUwMWQ2NGYwZSIsInVzZXJfaWQiOjE4fQ.ueJ_rh6EKdO6SQC8cGXaoo9Au1iQN9DkVrhAshOaO6Q	2025-09-17 09:35:34.723121+07	2025-09-18 09:35:34+07	18	c0e4ddb907a54450a3aad06e01d64f0e
157	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1OTQ4ODgyNCwiaWF0IjoxNzU5NDAyNDI0LCJqdGkiOiIxOWQ5OTNiOWU5YTk0ZTI2Yjc5YzQ3MjFmZjQzM2VlNyIsInVzZXJfaWQiOjE4fQ.qWoJOn0sHHPEcwBEzOTOWuamqWB3Agp7ZNJvRRS0Tgs	2025-10-02 17:53:44.848834+07	2025-10-03 17:53:44+07	18	19d993b9e9a94e26b79c4721ff433ee7
158	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MTA0MzgyNSwiaWF0IjoxNzYwOTU3NDI1LCJqdGkiOiIyMjVhZjgzZDczOTM0OTcxYmU0ZmYyM2JkOGNmMDVhNiIsInVzZXJfaWQiOjE4fQ.wezBYSMpOrrC0DtE8-W68tkBJ34Yqj7nWBVxMb7iDwE	2025-10-20 17:50:25.773422+07	2025-10-21 17:50:25+07	18	225af83d73934971be4ff23bd8cf05a6
159	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MTEyMjAzMCwiaWF0IjoxNzYxMDM1NjMwLCJqdGkiOiIyYTIzMTdiZDRiY2U0OTllODMwNjY4MTRkZWY3Yzk5YyIsInVzZXJfaWQiOjE4fQ.oZt_RI4Wos7Z4hTm4izv9kHLz_KQ7mzb9DzxK2T-aj8	2025-10-21 15:33:50.638122+07	2025-10-22 15:33:50+07	18	2a2317bd4bce499e83066814def7c99c
160	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1NDkzMCwiaWF0IjoxNzY1OTY4NTMwLCJqdGkiOiIxYTM2YjQyNDRmZGE0ODA0OWU1YTIxY2NiNDNkNmJjZiIsInVzZXJfaWQiOjE4fQ.G2OLP_wyU_NruOjetmRiI7Obo9aMl25TevRNnaoZ2Qk	2025-12-17 17:48:50.256146+07	2025-12-18 17:48:50+07	18	1a36b4244fda48049e5a21ccb43d6bcf
161	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjEyOTEyMCwiaWF0IjoxNzY2MDQyNzIwLCJqdGkiOiI1OTQ0YWZjMGEyNjQ0ZGJiOGY3OTcxODJjZDE3ZGJjMSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.YhKEnKlD76MnqHLo81_OystQcNB3PzjXv17VMdWRmAk	2025-12-18 14:25:20.027593+07	2025-12-19 14:25:20+07	18	5944afc0a2644dbb8f797182cd17dbc1
162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjEyOTE0MCwiaWF0IjoxNzY2MDQyNzQwLCJqdGkiOiI4MTE3NjQ0YjQ0OTU0ZjlhYThmY2RmYTU5ZDZlYTk1NSIsInVzZXJfaWQiOjE4fQ.aKoPbN_GhbRFvlt3sFb3fXk6VJbLk21s3C_geCulBkY	2025-12-18 14:25:40.993692+07	2025-12-19 14:25:40+07	18	8117644b44954f9aa8fcdfa59d6ea955
163	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjQyNjIyNiwiaWF0IjoxNzY2MzM5ODI2LCJqdGkiOiI4NTFkYWZhMzg2NDk0NDFmODFlNmQ0NTkyNmRjNTg2YiIsInVzZXJfaWQiOjE4fQ.adcOPWc8-ya6UbJHWWTD4XfqaYAQ3IlHDu29-lcunts	2025-12-22 00:57:06.095002+07	2025-12-23 00:57:06+07	18	851dafa38649441f81e6d45926dc586b
164	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjQyNjIyNiwiaWF0IjoxNzY2MzM5ODI2LCJqdGkiOiJhNDdmNmIzMGY2OWQ0ZjEwOGE0MTRiNDY3YmJkNDRmOCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.aB6jI3b29OrUl5dUJ5cAo68D-lSKNcnmfbV8aBfrhlw	2025-12-22 00:57:06.15627+07	2025-12-23 00:57:06+07	18	a47f6b30f69d4f108a414b467bbd44f8
165	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzUzNzQxNSwiaWF0IjoxNzY3NDUxMDE1LCJqdGkiOiJmZTc1M2Y4OGU1MDU0ZTdmYmIwYWJjYmE1MDY5ODFjMiIsInVzZXJfaWQiOjE4fQ.2L00mGUHSwRM8nnJrPO4UXzCpYAcluNs1HR1zk-uQDE	2026-01-03 21:36:55.346765+07	2026-01-04 21:36:55+07	18	fe753f88e5054e7fbb0abcba506981c2
166	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3MDgwOTc4MiwiaWF0IjoxNzcwNzIzMzgyLCJqdGkiOiJmZWFjOTJkMzk1MTA0M2ZiOGRmNzhhYzZlMmRkNGQwZCIsInVzZXJfaWQiOjE4fQ.J4kGyxRblWD4BSkK7BtFgZgvdRNDlkDLcovQxXh1_80	2026-02-10 18:36:22.896767+07	2026-02-11 18:36:22+07	18	feac92d3951043fb8df78ac6e2dd4d0d
167	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MjgzMDI5NywiaWF0IjoxNzgyNzQzODk3LCJqdGkiOiI3YjdlMDA3ZDI3M2U0MDM3YTFiM2Q5MGY2Y2FhZWRiNCIsInVzZXJfaWQiOjE4fQ.l4HcepRJ7JY0MvXRediRzWZbiEIIY6oYPnoCD5-4Cwk	2026-06-29 21:38:17.946522+07	2026-06-30 21:38:17+07	18	7b7e007d273e4037a1b3d90f6caaedb4
168	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4Mjg0MDI2OSwiaWF0IjoxNzgyNzUzODY5LCJqdGkiOiJjMGM3MmRkYTNmODQ0NjY4YmE1NGUwNjIyMDc4MGRlYSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.1M7Zsw1LawbQZNxc2FxmFU38I8ZIAl5ENOVmrLOAf2M	2026-06-30 00:24:29.217551+07	2026-07-01 00:24:29+07	18	c0c72dda3f844668ba54e06220780dea
169	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4Mjg0MDI4NiwiaWF0IjoxNzgyNzUzODg2LCJqdGkiOiIxMTYyNWQwNDhlZDg0NGQ5YjlkMDMwODA3MDg0YjIwOCIsInVzZXJfaWQiOjE4fQ.IRS6s6hdaAIAQoSOeVTfgMYC64iZW4PnJzzK0ImLxBc	2026-06-30 00:24:46.433461+07	2026-07-01 00:24:46+07	18	11625d048ed844d9b9d030807084b208
170	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MjkyOTU1NiwiaWF0IjoxNzgyODQzMTU2LCJqdGkiOiJlM2QwODE5Yzc1NjU0YzQ3YTRmZDE5MGQyZWI2NDE5MiIsInVzZXJfaWQiOjE4fQ.vQeNOI7DNazCL1FAbedNElel8S5O-3Zx7iATPYOSQH4	2026-07-01 01:12:36.052151+07	2026-07-02 01:12:36+07	18	e3d0819c75654c47a4fd190d2eb64192
171	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4Mjk2NDI4NCwiaWF0IjoxNzgyODc3ODg0LCJqdGkiOiJhMjFhNTFkMzc0MjM0ZTZhOWIxNWZkNTBlZmE4ODhiYiIsInVzZXJfaWQiOjE4fQ.UR-dnmuVSCmSamIqBfuGnQQkVgIpUvUkzJj4C6xNigE	2026-07-01 10:51:24.092786+07	2026-07-02 10:51:24+07	18	a21a51d374234e6a9b15fd50efa888bb
173	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzA5NjI1NiwiaWF0IjoxNzgzMDA5ODU2LCJqdGkiOiI1MTE3OTg1ZDFjZGE0MGRjYjEyMDFkZmQ4ZDY3YWZlNSIsInVzZXJfaWQiOjE4fQ.ZPLWvmJ10QGIxDdOnGew2VwVbIjTM9YqzHscvLre1dM	2026-07-02 23:30:56.960232+07	2026-07-03 23:30:56+07	18	5117985d1cda40dcb1201dfd8d67afe5
174	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzA5NjY1MiwiaWF0IjoxNzgzMDEwMjUyLCJqdGkiOiI3NDMyMTVmMjBjOGQ0YjZjYTA2ZWMyYTgwMGI3NzQ0YSIsInVzZXJfaWQiOjE4fQ.CPi-zZxkTI-rraAyQQKYjhVA_qj6z-uX5XY5nuJVp78	2026-07-02 23:37:32.252694+07	2026-07-03 23:37:32+07	18	743215f20c8d4b6ca06ec2a800b7744a
175	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzQwOTc1MSwiaWF0IjoxNzgzMzIzMzUxLCJqdGkiOiIwZDhmOGQwZDYxMjc0YzJlOGZjNWI3NjJjNDcyZTI5OCIsInVzZXJfaWQiOjE4fQ._Kc3_XFRpXmhygQDFiHu4HdCkidTMOmtV_Qpt9bnhhA	2026-07-06 14:35:51.270556+07	2026-07-07 14:35:51+07	18	0d8f8d0d61274c2e8fc5b762c472e298
176	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzQxMzA1MSwiaWF0IjoxNzgzMzI2NjUxLCJqdGkiOiJhNjBhYzQ4YWUxYTM0YTgxYTFkOWJhNmMzOTE3NmZiNiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.qI66xx1ioZIfSRw5ZdL8xVinhZKLtTEIZQ38DkBLZck	2026-07-06 15:30:51.112153+07	2026-07-07 15:30:51+07	18	a60ac48ae1a34a81a1d9ba6c39176fb6
177	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzQyMjA5NywiaWF0IjoxNzgzMzM1Njk3LCJqdGkiOiI5MDI4MmY1YTk1NzQ0MTRlYWU4YTA1OWEwZjk0MTc1MSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.ALP4SygWRKI4GTRo-HDkBs3Z_yEdfVtChpNr8AnUKhc	2026-07-06 18:01:37.170191+07	2026-07-07 18:01:37+07	18	90282f5a9574414eae8a059a0f941751
178	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzQyMjEwMywiaWF0IjoxNzgzMzM1NzAzLCJqdGkiOiJmYzdmMGRmMjNiMzE0MDRjYTQwODEzNjkzODJjOWQwMiIsInVzZXJfaWQiOjE4fQ.VLpwQ88QF4PAhemIRgsrZBW3H1OyXeOIurcj4ogdUKo	2026-07-06 18:01:43.495525+07	2026-07-07 18:01:43+07	18	fc7f0df23b31404ca4081369382c9d02
179	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzQyNTQwMywiaWF0IjoxNzgzMzM5MDAzLCJqdGkiOiIzMDcxN2RlMjYzNDA0YTE0YjY5ZDFmOTMwNDViZWNkOCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.NCeZIW2I3R4Gp_gbHhyIM-kz0nEYD0xEqFBfe0iFHZg	2026-07-06 18:56:43.01115+07	2026-07-07 18:56:43+07	18	30717de263404a14b69d1f93045becd8
180	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzQyODcwMywiaWF0IjoxNzgzMzQyMzAzLCJqdGkiOiI2MmExMTM3NDYwZjU0YzMzYmU3NWEzNjUwOTY2MjFhNyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.a3rdHJP-JZeWgyPoPd7Ly9sCNZYT-XC-qLL4lrJ9zww	2026-07-06 19:51:43.100124+07	2026-07-07 19:51:43+07	18	62a1137460f54c33be75a365096621a7
181	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzQ4MDYxMSwiaWF0IjoxNzgzMzk0MjExLCJqdGkiOiIzZDYyMzMzZjcxZWI0YzNiYjRmODczNzQ5NjM2ODBlNyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.d8jYqGYbLrgwqwYFKl2arOTw_1_ZTdYHEMnWg7Y-eyQ	2026-07-07 10:16:51.279203+07	2026-07-08 10:16:51+07	18	3d62333f71eb4c3bb4f87374963680e7
182	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzUyMTUzNiwiaWF0IjoxNzgzNDM1MTM2LCJqdGkiOiI3ZjhkYzhlOTFiNzI0Y2QzYTA1NTgyNzY0ZTc1ZTA5NCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.z5nNlzOZ3R9FImYUwK4sBBi2fnygC9uzI30ff7feKUs	2026-07-07 21:38:56.146293+07	2026-07-08 21:38:56+07	18	7f8dc8e91b724cd3a05582764e75e094
183	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzUyMTU3MiwiaWF0IjoxNzgzNDM1MTcyLCJqdGkiOiIwN2UxYzVjOTg4ZjI0MmJmYjUzYTBiMWUwZTVmZTcxYSIsInVzZXJfaWQiOjE4fQ.O0doJEherJ9spjg6BMWo5VVfvM1MyeSXGPQY78Az4MY	2026-07-07 21:39:32.081892+07	2026-07-08 21:39:32+07	18	07e1c5c988f242bfb53a0b1e0e5fe71a
184	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzUyNDgzNiwiaWF0IjoxNzgzNDM4NDM2LCJqdGkiOiI3NDFkY2NmMjg0MWE0NjgzOGJjYzgxNmZhMWVmMWFlYiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.rcCrB0uSX3sdG7T6OSzvu465tmkyRZcuSMg_Nw7ADaM	2026-07-07 22:33:56.135695+07	2026-07-08 22:33:56+07	18	741dccf2841a46838bcc816fa1ef1aeb
185	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzUyNDg3MiwiaWF0IjoxNzgzNDM4NDcyLCJqdGkiOiI4MzBlZDE4MDkwYWE0MGFjYmY2NDFmNjBmNjIzY2IyOCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.-stymuEgSYFJRep-QQ26JtPy46pskzJVcRtOzXd0_6Q	2026-07-07 22:34:32.110276+07	2026-07-08 22:34:32+07	18	830ed18090aa40acbf641f60f623cb28
186	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzUyODE3MiwiaWF0IjoxNzgzNDQxNzcyLCJqdGkiOiI3NzZhMDhlNWMxMzM0ZjYxYTc2NDRiN2UxMzIxYWQ2NCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.HB8h3dlPB_2-tveHR-klXLHPuVU0XUOh8V71RSF3AT8	2026-07-07 23:29:32.129129+07	2026-07-08 23:29:32+07	18	776a08e5c1334f61a7644b7e1321ad64
187	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzUzMTQ3MiwiaWF0IjoxNzgzNDQ1MDcyLCJqdGkiOiJlZmQ0YzRmMTIwOWE0NDA0OGMzNmM3Yzk5MWZkODkzOCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.3QG7eXfqVYlyWE96QBRhLL-VbJBvF2WMuNG8rURniyo	2026-07-08 00:24:32.009185+07	2026-07-09 00:24:32+07	18	efd4c4f1209a44048c36c7c991fd8938
188	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzUzNDc3MiwiaWF0IjoxNzgzNDQ4MzcyLCJqdGkiOiJiNWFiMjBlZDhhOTk0YzI0YjNjZjkzMDE5NDY3ZjZkYiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.PtbUjFi77EMWsofal7Pzph1PGrdjAEFI4OyH5wo3FM8	2026-07-08 01:19:32.008568+07	2026-07-09 01:19:32+07	18	b5ab20ed8a994c24b3cf93019467f6db
189	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzU2NjgxNiwiaWF0IjoxNzgzNDgwNDE2LCJqdGkiOiJiZjdiM2ZlZGVjMDk0OGUzYjE5MDM4ODdhZGE4NjFmMSIsInVzZXJfaWQiOjE4fQ.LVu9xw9TFZ73CY_nA_qY9u0GheOy2Kz31iekWcVwOhI	2026-07-08 10:13:36.202589+07	2026-07-09 10:13:36+07	18	bf7b3fedec0948e3b1903887ada861f1
190	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzYwMDA1NCwiaWF0IjoxNzgzNTEzNjU0LCJqdGkiOiIxMmViZTU3ZmM3ZmI0NTdkOTRmOTIyZTlmOTI3ZmJjYSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.blfTnNqjVARGeyqMR0vkCKZbL_zF7dbAYxTd8eY8AeU	2026-07-08 19:27:34.164788+07	2026-07-09 19:27:34+07	18	12ebe57fc7fb457d94f922e9f927fbca
191	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzYwMDA5MSwiaWF0IjoxNzgzNTEzNjkxLCJqdGkiOiIwY2QxOTEyZTVkMWE0ZDQ1YWM3ZWVjZGY5NWI5MWVjOCIsInVzZXJfaWQiOjE4fQ.s1Xs5ae4lgwVQKAi7ALwpk2JCiKN3D81X6_XEvBTaAQ	2026-07-08 19:28:11.638498+07	2026-07-09 19:28:11+07	18	0cd1912e5d1a4d45ac7eecdf95b91ec8
192	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzYwMzM1NCwiaWF0IjoxNzgzNTE2OTU0LCJqdGkiOiJjYzQ1MjRhZTVlNzU0MjYxODUwNzYxY2RlOWU4ZTljYSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.jM8kFmQWC1UB0uIb-vSChjOr9tIcLBz0uaCC905fYIQ	2026-07-08 20:22:34.007707+07	2026-07-09 20:22:34+07	18	cc4524ae5e754261850761cde9e8e9ca
193	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzYwMzM5MSwiaWF0IjoxNzgzNTE2OTkxLCJqdGkiOiJmMDQyYTEyNzFmNmM0N2Y1YjdiZjA2NGNhZTY0NDNhOCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.jfa0kVVbtifIdWT-TQbOppgsR73l7ESh3hasjI9HA_4	2026-07-08 20:23:11.006213+07	2026-07-09 20:23:11+07	18	f042a1271f6c47f5b7bf064cae6443a8
194	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzYwNjY1NCwiaWF0IjoxNzgzNTIwMjU0LCJqdGkiOiJiM2ZlMTZhNmFhY2Y0YjNhODdlNWU4YzAwZThlMzFjZiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.FRDU4OONEDMmQGqkrQfk7fBE6zEOEF_g6FhKJR1_81Q	2026-07-08 21:17:34.107691+07	2026-07-09 21:17:34+07	18	b3fe16a6aacf4b3a87e5e8c00e8e31cf
195	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzYwNjY5MSwiaWF0IjoxNzgzNTIwMjkxLCJqdGkiOiI1ZDgxZGY4MjkwZDU0NWI3YWZkYzE2NDg2M2RkYjljYiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.Se1u2tRriWsWAkbjmqCPkvG7m-FbpUrgKg_9usc5FJ0	2026-07-08 21:18:11.101209+07	2026-07-09 21:18:11+07	18	5d81df8290d545b7afdc164863ddb9cb
196	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzYwOTk1NSwiaWF0IjoxNzgzNTIzNTU1LCJqdGkiOiJmOTEwMzI3MTI4ODU0Njc4OTAyZjZlYzAyOGNmOTk0YyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.FEOSRQfVRj3uBtbdcssfJNm61YcS9iwKPs4g9E7WsVc	2026-07-08 22:12:35.796834+07	2026-07-09 22:12:35+07	18	f910327128854678902f6ec028cf994c
197	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzYwOTk5MiwiaWF0IjoxNzgzNTIzNTkyLCJqdGkiOiI4OWRiNGMwNDM0OTM0NWZhODc1NGMyZjZkOGY2YmUwNiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.WtnC16HfgxSOdea85tsTyPOfZdGd65UttIFhFbDKvro	2026-07-08 22:13:12.790268+07	2026-07-09 22:13:12+07	18	89db4c04349345fa8754c2f6d8f6be06
104	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NDI0MDY2NiwiaWF0IjoxNzU0MTU0MjY2LCJqdGkiOiIyNWRmMTA4NDc3ODA0ZjI5ODk0M2U2N2E5ZTQ1ZmI4YyIsInVzZXJfaWQiOjF9.Kq29eP8r4VstObFYmlVxiFXj9uH7DASr1c5jmcCtTMc	2025-08-03 00:04:26.847004+07	2025-08-04 00:04:26+07	\N	25df108477804f298943e67a9e45fb8c
172	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4Mjk2OTQ3NCwiaWF0IjoxNzgyODgzMDc0LCJqdGkiOiJmMjliZTNkMDYxZTE0MTI5OWU4NTM4MjA0Mzk0YTAxOCIsInVzZXJfaWQiOjF9.oAaseLpfk_q1hTzk2pebsMDvnhhz5ph_8EGQ_LKmXB4	2026-07-01 12:17:54.46722+07	2026-07-02 12:17:54+07	\N	f29be3d061e141299e8538204394a018
198	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzYxMzI5MiwiaWF0IjoxNzgzNTI2ODkyLCJqdGkiOiIwNTBmY2IxZDQxY2Q0MGY0OTU1OTk1ZGI5NDUyYjU4MyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.Dl6ribv8lDMxNs3gkv0hI1pJdV5eZTLsrcNdzNXYUr8	2026-07-08 23:08:12.884045+07	2026-07-09 23:08:12+07	18	050fcb1d41cd40f4955995db9452b583
199	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzYxNjU5MiwiaWF0IjoxNzgzNTMwMTkyLCJqdGkiOiJhZGE1ODcwZGRkYjg0OTA4YjNiNWRmNDMyMmRmODk1OSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.rLJ7T3pwj3AnWQflXmRGmkx0Y7fPcKZx4dhULEOgKzU	2026-07-09 00:03:12.898867+07	2026-07-10 00:03:12+07	18	ada5870dddb84908b3b5df4322df8959
200	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzYxNzk3MCwiaWF0IjoxNzgzNTMxNTcwLCJqdGkiOiJkMDJkNGVlNjU4M2Q0ZWVmOGY2ZmM5ZWI5MjgwZTc3NyIsInVzZXJfaWQiOjE4fQ.tZDUKhCpxtX1Qomk3R7T6RKHiF-iqDl8htH52D8RIsY	2026-07-09 00:26:10.208555+07	2026-07-10 00:26:10+07	18	d02d4ee6583d4eef8f6fc9eb9280e777
201	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzY1Mzg1NywiaWF0IjoxNzgzNTY3NDU3LCJqdGkiOiI4YzE0NDY1Mzc0ZGU0OWZiYjM5M2ZkNTgzNzgyZjc2ZCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.KqNa7jKAqhRXUpjwwgAMCbjQRtLU0V-pA0Rdc0EuPrg	2026-07-09 10:24:17.958752+07	2026-07-10 10:24:17+07	18	8c14465374de49fbb393fd583782f76d
202	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzY1MzkzMiwiaWF0IjoxNzgzNTY3NTMyLCJqdGkiOiJkMGRiNDY2MzcxZDA0OWM3ODlkM2I4YWY2YzFhNjAzOSIsInVzZXJfaWQiOjE4fQ.8EBHqspLoE6_uZbx96AwY9_akMt3vehf8432pPIIzQw	2026-07-09 10:25:32.648048+07	2026-07-10 10:25:32+07	18	d0db466371d049c789d3b8af6c1a6039
203	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzY1NjgxOSwiaWF0IjoxNzgzNTcwNDE5LCJqdGkiOiI3ZjY0YjdiMjMyNDY0YjNmOTlmYTBjZmU3MDM3ZWE3NSIsInVzZXJfaWQiOjE5fQ.OHgIwuTNk4uKM7pWV2bFws4AKeE5AORhOJeIcO-Pgxk	2026-07-09 11:13:39.316647+07	2026-07-10 11:13:39+07	19	7f64b7b232464b3f99fa0cfe7037ea75
204	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzY1NzE1NywiaWF0IjoxNzgzNTcwNzU3LCJqdGkiOiJkZWI5YWZiZThiYTk0MzkyYWQ5MWRlYzk1YWE2MjEyZCIsInVzZXJfaWQiOjE5LCJlbWFpbCI6InphaGFyb3ZpbGE3ODBAZ21haWwuY29tIiwicGhvbmVfbnVtYmVyIjpudWxsfQ.gaIK6r6X3KeuZhsKfQ-O__MYnaxQc21utqJxWw5HRRI	2026-07-09 11:19:17.112926+07	2026-07-10 11:19:17+07	19	deb9afbe8ba94392ad91dec95aa6212d
205	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzY1Nzg2MSwiaWF0IjoxNzgzNTcxNDYxLCJqdGkiOiJlMmE2ZDRhNTFkNjE0ZWQ5YmE0ZWZkMzM2OTM4ZGE2MSIsInVzZXJfaWQiOjE4fQ.dcq3lFvpcapByEuqrysui2_736Yp7sPCsoQgkYSoDAk	2026-07-09 11:31:01.301506+07	2026-07-10 11:31:01+07	18	e2a6d4a51d614ed9ba4efd336938da61
206	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzY5NjcwNCwiaWF0IjoxNzgzNjEwMzA0LCJqdGkiOiIwZGEyZDQ4NGY5YTk0ZWM0OTU5NGE0NWUyOWNjOTAzOSIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.00hcCskZt9kUfPgxx8716s0b1rixk2qwCRAqtHsQTlw	2026-07-09 22:18:24.732956+07	2026-07-10 22:18:24+07	18	0da2d484f9a94ec49594a45e29cc9039
207	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzcwMTEwNiwiaWF0IjoxNzgzNjE0NzA2LCJqdGkiOiI5YzM0ZWU1ODc4MjY0MGFiYmI4NmI0YTllNWExYjRjYyIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.5B9vvP9KT-2KZb2LEhMrDCqIMWhUalbpVZmFQTfBhQs	2026-07-09 23:31:46.85644+07	2026-07-10 23:31:46+07	18	9c34ee58782640abbb86b4a9e5a1b4cc
208	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzcwMTE2MSwiaWF0IjoxNzgzNjE0NzYxLCJqdGkiOiJlNGQyMDcxNDJiMWM0MGFmYjMxOTZiZTA0N2M4MmQyNiIsInVzZXJfaWQiOjE5fQ.jCB-Wu6a9O67rqLc0P1ZJrCghR2patZby5w1-SigT-g	2026-07-09 23:32:41.251177+07	2026-07-10 23:32:41+07	19	e4d207142b1c40afb3196be047c82d26
209	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzcwMTM5NiwiaWF0IjoxNzgzNjE0OTk2LCJqdGkiOiJkZDliZTVjNzA5ZTE0NzAyOTNhODg1MGEyMTc3NjQ0OSIsInVzZXJfaWQiOjE4fQ.tfqcao3EESpk_q1IOnVKrOLT-Psoq9arqTMq4MbCU30	2026-07-09 23:36:36.439409+07	2026-07-10 23:36:36+07	18	dd9be5c709e1470293a8850a21776449
210	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzcwNDY5NiwiaWF0IjoxNzgzNjE4Mjk2LCJqdGkiOiIzNzRlOWNkM2RjNzQ0YTVhOTJmYTczY2NlMjE2ZWU1MCIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.wLkd-PmxtV4Z_xZtwWoQDvBO0hi1cDO9nHNMSoH9eZQ	2026-07-10 00:31:36.108649+07	2026-07-11 00:31:36+07	18	374e9cd3dc744a5a92fa73cce216ee50
211	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzcwNTA1MSwiaWF0IjoxNzgzNjE4NjUxLCJqdGkiOiJhNWFhOTIzYzRjOGU0YTIzOTljY2Y0MWUyYWZjMzE3MyIsInVzZXJfaWQiOjE4fQ.7jw_gAs3XY061RSUq2JY5Qma47WPeEz8ef0NVhGxN3o	2026-07-10 00:37:31.252179+07	2026-07-11 00:37:31+07	18	a5aa923c4c8e4a2399ccf41e2afc3173
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, created_at, updated_at, deleted_at, email, password, phone_number, last_login, is_superuser, is_staff, access_token, refresh_token, profile_photo) FROM stdin;
13	2025-07-08 14:50:06.962723+07	\N	2025-07-23 01:39:10.664619+07	test11@test.com	pbkdf2_sha256$1000000$ylxJkwDvro9HMmN7GeqaVU$OjapoTbgnD5IPaRSmEF9sbb6EN5WiKR+7lqGIbAHie8=	+7 (111) 111-11-11	2025-07-22 18:39:02.738197+07	f	f	\N	\N	
14	2025-07-09 14:50:03.284459+07	\N	\N	test12@test.com	pbkdf2_sha256$1000000$axv22rd4UI2hN8y6sRRe42$rX68Q3I83hxFHEUnEudYKa9BxF37kpTExj+IHMvYp/8=	+7 (212) 121-21-21	2025-07-09 14:50:12.150554+07	f	f	\N	\N	
4	2025-07-07 20:46:17.277225+07	\N	\N	test3@test.com	pbkdf2_sha256$1000000$jAwUHyvnH14GvYqr6c971z$/kFlUqnZq5VIohvBFDGHhXvSiJc4jDC/ddc9wuZwGH4=	+7 (333) 333-33-33	2025-07-07 21:28:22.215726+07	f	f	\N	\N	
6	2025-07-07 21:43:42.429466+07	\N	\N	test5@test.com	pbkdf2_sha256$1000000$FU424ex6l0Wc7qMKefo0dy$ueb0UVlxliu4Zdjc/r+H+CP5ORHJX7I6EGs+25CoOFY=	+7 (555) 555-55-55	\N	f	f	\N	\N	
7	2025-07-08 10:29:33.505277+07	\N	\N	test6@test.com	pbkdf2_sha256$1000000$kNaxH6zwQpb6yTE7HKR34T$MzQfqawTf6p79zun+HvKwiUxk412LPrifWFYR03LgbM=	+7 (666) 666-66-66	2025-07-08 10:29:43.920868+07	f	f	\N	\N	
5	2025-07-07 21:37:11.320834+07	\N	\N	test4@test.com	pbkdf2_sha256$1000000$jUhLnqJtPkCWrmnkkAQy7i$wE4Du7xE30BJe5Uxe6kcBDRjqpF92NUor6Xx2pQcyIA=	+7 (444) 444-44-44	2025-07-08 14:12:07.925803+07	f	f	\N	\N	
9	2025-07-08 14:45:18.839992+07	\N	\N	test7@test.com	pbkdf2_sha256$1000000$OgxNSZ47QjvOP8V4ZM9jWO$EO0UL4nb/IWZRO6wgkwZysMz5WjW6dzesDPtxkjJDRE=	+7 (777) 777-77-77	\N	f	f	\N	\N	
10	2025-07-08 14:46:14.781586+07	\N	\N	test8@test.com	pbkdf2_sha256$1000000$ySfV5gE0AtjwZ4G8s4SwHX$CcYG/msPK4NLGfKpUddDuK/vTeGZ2MtisU8XkJOfl+A=	+7 (888) 888-88-88	\N	f	f	\N	\N	
11	2025-07-08 14:47:16.744241+07	\N	\N	test9@test.com	pbkdf2_sha256$1000000$dyEIPm5uYqAXgqgp1WiYDU$u/GltRumlmyjqQCgx20WYitxI8oWBBLczAmId9yGbmg=	+7 (999) 999-99-99	\N	f	f	\N	\N	
12	2025-07-08 14:48:28.321704+07	\N	\N	test10@test.com	pbkdf2_sha256$1000000$GLOUkhrjIVxRePBvLeIcPj$/oqZHxvjJ5gMXFDbhUbKHFIRS/fE8CDN9zY1pQPJYmU=	+7 (010) 101-01-01	\N	f	f	\N	\N	
15	2025-07-09 15:34:56.283214+07	\N	\N	admin123@admin.com	pbkdf2_sha256$1000000$afiCX3IdbSofJk51M3zJbF$bFhKO0dDLDzHg1lhPj4Y8rltSwG74PgwpDr6zOT+L94=	+7-982-343-56-19	\N	f	f	\N	\N	
18	2025-07-09 15:44:01.072223+07	\N	\N	np1r777@admin.com	pbkdf2_sha256$1000000$Rb1I6jrxw6VoGU7tCrLRbV$R0NOg++NlyZPuTXGddT/9blB6bS6ROKGH/g4VNN0BAo=	+7-982-343-56-13	2026-07-10 00:37:31.261945+07	t	f	\N	\N	
8	2025-07-08 14:20:18.714952+07	\N	\N	admin@admin.com	pbkdf2_sha256$1000000$0sNGEkelBZdHNQBkKzNhVi$VfLHy7EgfKi4KX92rrVE46dLB5osT+SvYrWHXu8cVpU=	+7-913-589-34-57	2025-07-08 15:08:01.458797+07	f	f	\N	\N	
19	2026-07-09 11:13:38.650075+07	\N	\N	zaharovila780@gmail.com	pbkdf2_sha256$1000000$Es6NRBlHb9mSahii8YhJM1$qOe+MQlWGbpqoh6CAQ3YTi4hdDU91Ls3/NUs5zP8HEo=	\N	2026-07-09 23:32:41.270807+07	f	f	\N	\N	
17	2025-07-09 15:42:06.908023+07	\N	\N	admin777@admin.com	pbkdf2_sha256$1000000$MLFI7AZ8Rvn4GNG6uuCNYq$MJWLGwkTryWcuQOWrFtWqzxNGlnEM++iUCtPOt1oTTU=	+7-982-343-56-17	\N	f	f	\N	\N	
\.


--
-- Data for Name: vk_parser_state; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vk_parser_state (id, initial_done, last_run_at, last_result) FROM stdin;
1	t	2026-07-10 00:28:43.564367+07	Постов-приглашений: 0, новых отзывов: 0
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

