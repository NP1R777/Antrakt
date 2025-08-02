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
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_user_id_c564eba6_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_content_type_id_c4bce8eb_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_6a12ed8b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_group_id_97559544_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_2f476e4b_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_b120cbf9_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissio_permission_id_84c5c92e_fk_auth_perm;
DROP INDEX IF EXISTS public.user_email_54dc62b2_like;
DROP INDEX IF EXISTS public.token_blacklist_outstandingtoken_user_id_83bc629a;
DROP INDEX IF EXISTS public.token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like;
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
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_pkey;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_email_key;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outstandingtoken_pkey;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_token_id_key;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_pkey;
ALTER TABLE IF EXISTS ONLY public.perfomances DROP CONSTRAINT IF EXISTS perfomances_pkey;
ALTER TABLE IF EXISTS ONLY public.news DROP CONSTRAINT IF EXISTS news_pkey;
ALTER TABLE IF EXISTS ONLY public.django_session DROP CONSTRAINT IF EXISTS django_session_pkey;
ALTER TABLE IF EXISTS ONLY public.django_migrations DROP CONSTRAINT IF EXISTS django_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_app_label_model_76bd3d3b_uniq;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_pkey;
ALTER TABLE IF EXISTS ONLY public.directors_theatre DROP CONSTRAINT IF EXISTS directors_theatre_pkey;
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
ALTER TABLE IF EXISTS ONLY public.achievements DROP CONSTRAINT IF EXISTS achievements_pkey;
DROP TABLE IF EXISTS public."user";
DROP TABLE IF EXISTS public.token_blacklist_outstandingtoken;
DROP TABLE IF EXISTS public.token_blacklist_blacklistedtoken;
DROP TABLE IF EXISTS public.perfomances;
DROP TABLE IF EXISTS public.news;
DROP TABLE IF EXISTS public.django_session;
DROP TABLE IF EXISTS public.django_migrations;
DROP TABLE IF EXISTS public.django_content_type;
DROP TABLE IF EXISTS public.django_admin_log;
DROP TABLE IF EXISTS public.directors_theatre;
DROP TABLE IF EXISTS public.auth_user_user_permissions;
DROP TABLE IF EXISTS public.auth_user_groups;
DROP TABLE IF EXISTS public.auth_user;
DROP TABLE IF EXISTS public.auth_permission;
DROP TABLE IF EXISTS public.auth_group_permissions;
DROP TABLE IF EXISTS public.auth_group;
DROP TABLE IF EXISTS public.archive;
DROP TABLE IF EXISTS public.actors;
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
    assigned date
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
-- Name: actors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.actors (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    name character varying(50) NOT NULL,
    place_of_work character varying(200) NOT NULL,
    time_in_theatre character varying(10) NOT NULL,
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
    image_url character varying(200) NOT NULL
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
    the_cast character varying(50)[] NOT NULL,
    description character varying(2000) NOT NULL,
    afisha boolean NOT NULL,
    image_url character varying(200) NOT NULL,
    performances_image character varying(200),
    images_list character varying(200)[] NOT NULL,
    ticket_url character varying(200)
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
    email character varying(254) NOT NULL,
    password character varying(500) NOT NULL,
    phone_number character varying(20) NOT NULL,
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
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.achievements (id, created_at, updated_at, deleted_at, image_url, achievement, assigned) FROM stdin;
4	2025-07-12 20:33:17.71969+07	\N	\N	http://localhost:9000/antrakt-images/achievements/2025/07/12/3e4a2136-d35b-40c1-9eee-84d0423a8372.jpg	Краевой конкурс любительских театров "Рампа" г. Красноярск 2024 год: Спектакль «Вечно живые» - Лауреат (Гран при).	\N
3	2025-07-12 20:32:52.323233+07	\N	\N	http://localhost:9000/antrakt-images/achievements/2025/07/12/60eca6e5-a949-477f-8736-a8baa1276698.jpg	Международный фестиваль любительских и народных театров им. Ф.Г. Раневской "ФЛИНТ#ТРАМПЛИН", г. Москва: Спектакль «Тёща браку не помеха» - Диплом лауреата 2 степени.	\N
2	2025-07-12 20:32:18.516156+07	\N	\N	http://localhost:9000/antrakt-images/achievements/2025/07/12/97b96f12-461c-4982-a145-6ba20909b5a1.jpg	Межрегионального конкурса для взрослых любительских театральных коллективов «АРТ-СИБИРСК», г. Новосибирск: Спектакль «Свадьба» - Дипломанты 3 степени.	\N
1	2025-07-12 20:32:00.953869+07	\N	\N	http://localhost:9000/antrakt-images/achievements/2025/07/12/dbb487b5-c3cc-4e12-abf6-a5e82640106b.webp	Краевой конкурс любительского театрального искусства "Рампа" г. Красноярск: Спектакль «Свадьба» - Диплом 1 степени.	\N
\.


--
-- Data for Name: actors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.actors (id, created_at, updated_at, deleted_at, name, place_of_work, time_in_theatre, favorite_writer, favorite_character, favorite_painter, favorite_film, favorite_piece, favorite_quote, author_quote, favorite_song, author_song, perfomances, role_in_perfomances, image_url) FROM stdin;
8	2025-07-10 10:24:22.979062+07	\N	\N	Герасимова Ксения	ООО «Норникель Спутник», Аналитик	2	{"Терри Пратчетт"}	{"Ганнибал Лектор (сериал)"}	{"Сесилия Викунья"}	{"Дневник Памяти"}	{"Ревизор (Н.В. Гоголь)"}	Давайте ограничимся тем, что скажем, что театр, как и Жизнь, — это мечта, не слишком беспокоясь о лжи.	Жан-Луи Барро	{"How Soon Is Now?"}	{"The Smiths"}	{"Вечно живые","О царе Салтане","Девочка со спичками"}	{Варя,"Судебный писарь",Зависть}	http://localhost:9000/antrakt-images/actors/2025/07/10/bcc65faf-3d9a-47d9-bd9e-5015b479e656.jpg
7	2025-07-09 23:36:26.811078+07	\N	\N	Постникова Марина	ООО «Норильский обеспечивающий комплекс». Ведущий специалист Группы кадрового администрирования и подбора персонала Отдела оплаты труда и кадровой политики Аппарата управления.	2	{"Пауло Коэльо"}	{"Миранда Пристли","Форест Гамп","Скарлетт О`Хара"}	{--}	{1+1,"Хижина (2017г.)","Брат (1997г.)"}	{"Дом, где разбиваются сердца (Бернард Шоу)"}	Автор пишет одну пьесу, актеры играют другую, а зрители видят третью.	Шарль Баре	{"мой рок-н-ролл"}	{"Би-2 feat. Чичерина"}	{"О царе Салтане","Трамвай Желание"}	{Царица,Стелла}	http://localhost:9000/antrakt-images/actors/2025/07/10/8d229e57-c44e-4d8d-8dc2-1f18296d08cf.JPG
3	2025-07-09 21:21:23.002813+07	\N	\N	Молодчая Анна	ООО «Медвежий ручей» оператор ЭВМ	3	{"Борис Акунин"}	{"Чендлер (сериал Друзья)","Тирион Ланистер"}	{"Репин Илья"}	{"Республика Шкид (1966г.)","1408 (2007г.)","Белый Бим Чёрное Ухо (1977г.)"}	{"На дне (М. Горький)","Чайка (А. Чехов)"}	Если бы смысл театра был только в развлекательном зрелище, быть может, и не стоило бы класть в него столько труда. Но театр есть искусство отражать жизнь.	К.С. Станиславский	{"I Will Always Love You"}	{"Whitney Houston"}	{"Вечно живые","Девочка со спичками"}	{Ирина,Ангел}	http://localhost:9000/antrakt-images/actors/2025/07/10/b987bb78-3683-4e47-924a-1c26972551fc.jpg
5	2025-07-09 22:37:06.858944+07	\N	\N	Екатерина Наконечная	"Норильскникельремонт" Инженер 1 категории	3	{"Н.В. Гоголь","М.А. Булгаков"}	{"Хью Гласс (Выживший)"}	{"Иван Айвазовский","Исаак Левитан","Клод Моне"}	{"Дневник памяти",1+1,"Один дома","33 несчастья","Молчание ягнят"}	{"Бесприданница (А.Н. Островский)","На дне (М. Горький)","Вишневый сад (А.П. Чехов)","Анна Каренина (Л. Толстой)"}	Если бы смысл театра был только в развлекательном зрелище, быть может, и не стоило бы класть в него столько труда. Но театр есть искусство отражать жизнь	К.С. Станиславский	{"Чужой среди своих"}	{Polnalyubvi}	{"Тёща браку не помеха",Дюймовочка,"Вечно живые","Девочка со спичками"}	{"Тёща Амалия",Жучиха,Нюра,Ложь}	http://localhost:9000/antrakt-images/actors/2025/07/10/f7ae6065-c89e-4090-9c5e-ea95b13614b6.jpg
4	2025-07-09 21:26:36.871513+07	\N	\N	Никифорук Ксения	Частная практика. Дефектолог, тренер по речи. Детский психолог.	4	{"Клайв Стэйплз Льюис"}	{"Гарри Поттер"}	{"Леонардо да Винчи"}	{"Люди в чёрном",Человек-паук,"Железный человек"}	{"Ромео и Джульетта (У. Шекспир)"}	Если бы смысл театра был только в развлекательном зрелище, быть может, и не стоило бы класть в него столько труда. Но театр есть искусство отражать жизнь.	К.С. Станиславский	{Воля}	{MIRAVI}	{"О царе Салтане","Девочка со спичками","Тёща браку не помеха","Вечно живые",Дюймовочка,Свадьба}	{Судья,Гнев,Лиза,Антонина,"Ведьма Атрен и Богиня Нерта",Дымба}	http://localhost:9000/antrakt-images/actors/2025/07/10/879e0f25-e1c2-4a44-96b9-7399bb858f29.jpg
6	2025-07-09 23:08:08.251611+07	\N	\N	Курченкова Елена	Проектный офис по реализации инвестиционных проектов АО"НТЭК "	3	{"М. Павич","К. Воннегут","В. Пелевин"}	{"Willy Wonka"}	{"В. Васнецов","Н. Чекколи"}	{Револьвер,"Шапито-шоу: Любовь и Дружба","Шапито-шоу: Сотрудничество и Уважение","Лемони Сникет:33 несчастья",Чай}	{"Шесть персонажей в поисках автора (Л. Пиранделло)"}	Театр больше похож на настоящую жизнь: свои достижения вы выносите на сцену и показываете в течение двух-трёх часов. И больше это никогда не повторится. Я бы сравнил это с хождением по канату в ста футах над землёй и безо всякой страховки. А в кино канат лежит на полу…	Аль Пачино	{Шарманка}	{Пикник}	{"О царе Салтане",Дюймовочка,"Вечно живые","Девочка со спичками"}	{Корабельщик,Мышь,"Анна Михайловна Ковалёва",Хореограф}	http://localhost:9000/antrakt-images/actors/2025/07/11/1740c27d-eedb-45d1-a761-0798bcfbcf65.jpg
10	2025-07-11 21:07:52.419018+07	\N	\N	Умблия Ольга	ПАО " ГМК "Норильский Никель" , Медный завод , инженер.	3	{"Эрих Мария Ремарк"}	{"Бриджит Джонс"}	{"Сальвадор Дали"}	{"Гордость и Предубеждения (1994 г)","Дневник Бриджит Джонс ( 2001 г)","Городской романс (1971 г)","Одесса (2019 г)"}	{"Вишневый сад (А.П. Чехов)"}	«Пьеса и "роль" для актёра- только "текст". От текста же до игры - расстояние громадное»	Густав Шпет	{"Роковая женщина"}	{"В. Кузьмин"}	{Свадьба,Дюймовочка,"Девочка со спичками","Трамвай \\"Желание\\""}	{Дашенька,Жаба,Гордыня,"Бланш Дюбуа"}	http://localhost:9000/antrakt-images/actors/2025/07/11/5ef10774-72f4-44d3-a37d-02bc6e61603e.jpg
11	2025-07-13 20:49:28.361468+07	\N	\N	Кравченко Сергей	ООО "Норильскникельремонт", главный специалист отдела экологии лицензирования и качества.	2	{"Ричард Бах","Виктор Пелевин","Карлос Кастанеда","Братья Стругацкие","Габриэль Гарсия Маркес","Михаил Булгаков"}	{"Чертенок 13"}	{"Густав Климт"}	{Револьвер,"Упражнения в прекрасном","Танец Дели","Весна, лето, осень, зима и снова весна",Кин-Дза-Дза,"Бойцовский клуб","Собачье сердце","Как Царь Петр Арапа женил, Узник замка Иф"}	{"Сказка про последнего ангела"}	Весь мир - театр, а люди в нём - актёры! И каждый не одну играет роль	Уильям Шекспир	{"А знаешь, всё ещё будет..."}	{"А. Пугачева"}	{"Вечно живые","О царе Салтане","Трамвай \\"Желание\\"","Девочка со спичками"}	{Степан,"Царь Салтан",Стенли,"Отец девочки"}	http://localhost:9000/antrakt-images/actors/2025/07/13/be6b07d7-9cc0-4ff7-8bfb-89fa367340ae.jpg
12	2025-07-20 12:05:39.220656+07	\N	\N	Качаева Назира	Ресо-Гарантия специалист по страхованию	2	{"Михаил Булгаков"}	{"Хюррем (Великолепный век)","Джек Воробей"}	{"Сальвадор Дали"}	{"Унесённые ветром","Пираты Карибского моря"}	{"\\"Дядя Ваня\\" (А.П. Чехов)"}	Высшая степень мастерства комедийного актера - когда над его плачем, смеются; Высшая степень мастерства драматического актера - когда над его смехом, плачут	Неизвестно	{greedy}	{"Tate McRae"}	{"О царе Салтане","О козлёнке, который хотел стать взрослым"}	{"Царевна Лебедь","Мама Заяц"}	http://localhost:9000/antrakt-images/actors/2025/07/20/966d1801-3261-4001-865b-722c967c40f5.jpg
13	2025-07-20 12:18:49.222792+07	\N	\N	Авдиенко Инна	свободный "художник"	2	{"нет такого. Меня цепляют сами произведения, идеи, заложенные в них смыслы. Мне нравятся создания, а не создатели"}	{"нет такого"}	{"очень много разных художников у которых прекрасная передача событий, характеров и состояний через краски. У каждого можно найти что-то интересное, но я никого не могу выделить как \\"любимого\\". Любить можно искусство, любить художника-человека, это про другое"}	{"мне нравятся постановки Марка Захарова"}	{"\\"Обыкновенное чудо\\" (Евгений Шварц)"}	такие цитаты существуют	Неизвестно	{"тоже самое, что и про художников. Музыка подбирается под настроение. Слушаю то, где в словах есть смысл, поэтому современный \\"фольклор\\" я практически не слушаю."}	{Неизвестно}	{"О царе Салтане","Девочка со спичками",Лазарет}	{Повариха,"Бабушка девочки","Галина Петровна"}	http://localhost:9000/antrakt-images/actors/2025/07/20/4e0252c7-2b58-4833-a4a9-9c1b78da93ef.jpg
14	2025-07-20 12:23:29.587566+07	\N	\N	Евстигнеев Ярослав	ЗФ ПАО "ГМК Норильский Никель", Центр диагностики - Специалист по неразрушающему контролю	2	{"Эдмонд Гамильтон"}	{"Гаррет (Приключения Гаррета)","Глен Кука"}	{"А.А. Леонов"}	{"Назад в будущее"}	{Ханума,Примадонны}	Для хороших актеров нет дурных ролей	Неизвестно	{"My Dark Disquiet"}	{"Poets of the Fall"}	{"Девочка со спичками","Про козлёнка, который хотел стать взрослым","Вечно живые"}	{Чревоугодие,Петух,Степан}	http://localhost:9000/antrakt-images/actors/2025/07/20/e9de32f9-677c-4139-966f-55c19d753195.jpg
15	2025-07-20 12:29:42.726829+07	\N	\N	Захаров Илья	«IT-Куб.Норильск» — филиал автономной некоммерческой организации «Красноярский детский технопарк „Кванториум“»	4	{"Лев Толстой","Михаил Булгаков"}	{"Тоби Маршал (\\"Жажда скорости\\")","Тони (\\"Зелёная книга)"}	{"Репин Илья"}	{"\\"Жажда скорости\\" (2014г.)","\\"Зелёная книга\\" (2018г.)","\\"Пираты Карибского моря\\" (все части)"}	{"\\"Бесприданница\\" (А.Н. Островский)"}	Молодые актеры! Бойтесь ваших поклонниц! Ухаживайте за ними, если угодно, но не говорите с ними об искусстве! Учитесь вовремя, с первых шагов слушать, понимать и любить жестокую правду о себе! И знайте тех, кто вам поможет её сказать. Вот с такими людьми говорите побольше об искусстве. Пусть они почаще ругают вас	К.С. Станиславский	{"Рюмка водки на столе"}	{"Григорий Лепс"}	{"О царе Салтане",Дюймовочка,"Вечно живые","Девочка со спичками","Трамвай Желание",Свадьба,Лазарет}	{"Князь Гвидон","Майский Жук",Владимир,Мальчик,Юноша,Ять,"Терехов Иван"}	http://localhost:9000/antrakt-images/actors/2025/07/20/ac84e004-e54d-4cf8-ad1e-5247f0c536ec.jpg
16	2025-07-20 12:35:16.936235+07	\N	\N	Гасанова Оксана	ООО "ННР" ПО"НР" уч.49	4	{"И.А. Крылов","Л.Н. Толстой"}	{"Их много, и злые, добры, интересные"}	{"Люблю всех чьи картины вызывают эмоцию"}	{"Только который заставил задуматься"}	{Яма}	"Театр жив, пока на сцене «Три сестры», а в зале толпа народа. Вот если будет наоборот, тогда конец"	Неизвестно	{"Редко слушаю, фаворитов среди песен нет"}	{Неизвестно}	{"О царе Салтане","Девочка со спичками","О козлёнке, который хотел стать взрослым"}	{Ткачиха,Жадность,Лисица}	http://localhost:9000/antrakt-images/actors/2025/07/20/6e98cd9e-3a62-415c-8a1d-423a33f4c21a.jpg
17	2025-07-20 12:48:28.363721+07	\N	\N	Фартушина Юлия	архитектор, фотограф	4	{"Диана Гэблдон"}	{"Капитан Джек Воробей"}	{Тициан,"Сальвадор Дали"}	{"тот который хочется пересматривать много раз и таких фильмов много"}	{}	Театр никогда меня не оставляет. Мой театр всегда со мной"	О. Бузова	{"та которую хочется петь, которая поднимает настроение"}	{Неизвестно}	{"Девочка со спичками",Свадьба,"Вечно живые",Дюймовочка}	{"Мать девочки",Мозговая,"Варвара Капитоновна","Мама Дюймовочки"}	http://localhost:9000/antrakt-images/actors/2025/07/20/27e4fb5f-fc9a-444c-b59a-3b6ed273f32f.png
18	2025-07-20 12:51:14.67282+07	\N	\N	Протченко Татьяна	ПАО ГМК "Норильский Никель" Отдел организации документооборота. Специалист.	3	{"Эрих Мария Ремарк"}	{"Хюррем (сериал Великолепный век)"}	{"Иван Айвозовский"}	{"⁠Назад в будущее (1985г)"}	{"Гамлет (У. Шекспир)"}	Весь мир — театр, а люди в нём — актёры, для каждого судьба распределяет роли	Неизвестно	{"What have I got to do to make you love me"}	{"Elton John"}	{"О царе Салтане","О козлёнке, который хотел стать взрослым"}	{Бабариха,Заяц}	http://localhost:9000/antrakt-images/actors/2025/07/20/a83d4a35-eb0d-4922-9e30-eabdc33fa56c.jpg
19	2025-07-20 12:55:11.165008+07	\N	\N	Гузель Садртдинова	Норильскникельремонт	3	{"Эрих Мария Ремарк"}	{"Роберт Локамп, в принципе все главные герои Ремарка"}	{"Ван Гог",Пикассо,Дега,Моне,Сезан}	{Карате-пацан,"Тепло наших тел","Время жить"}	{"Трамвай \\"Желание\\""}	Театр сильнее всего воздействует тогда, когда он делает нереальные вещи реальными. Тогда сцена становится перископом души, позволяющим заглянуть в действительность изнутри	Франц Кафка	{"Here without you"}	{Неизвестно}	{"О царе Салтане","Девочка со спичками"}	{Прокурор,Уныние}	http://localhost:9000/antrakt-images/actors/2025/07/20/822acf41-2658-4de0-b31d-855baa90b8ab.jpg
9	2025-07-10 19:53:45.492165+07	\N	\N	Кононыхин Михаил	"РМ Инжиниринг Лимитед". Ведущий специалист по финансовому контролю	2	{"А.П. Чехов"}	{"Крот Фри (Дюймовочка)"}	{"М. Врубель"}	{"Летят журавли"}	{"Трамвай Желания (Т. Уильямс)"}	Учитесь слушать, понимать и любить правду о себе	К.С. Станиславский	{"Последняя поэма"}	{"к/ф \\"Вам и не снилось\\""}	{Дюймовочка,"Вечно живые","Трамвай Желание"}	{"Крот Фри","Фёдор Иванович",Митч}	http://localhost:9000/antrakt-images/actors/2025/07/10/5a88ca58-1174-4c2c-8ec2-783445192599.jpg
\.


--
-- Data for Name: archive; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.archive (id, created_at, updated_at, deleted_at, description, premiere_date, afisha, image_url, title, archive_image, age_limit, images_list) FROM stdin;
1	2025-07-12 21:49:33.835069+07	\N	\N	12 апреля в 18:00 в Малом зале Городского центра культуры состоялся литературный вечер, посвященный русскому драматургу Александру Николаевичу Островскому.\n\n12 апреля исполнится 202 года со дня рождения Александра Николаевича Островского. Гений русской драматургии, чьи произведения до сих пор покоряют сердца зрителей по всему миру. Его пьесы — это зеркало русской души, отражающее жизнь во всем её многообразии.\n\nВ этот особенный день театр-студия «Антракт» приглашает вас окунуться в мир Островского! Наши артисты, с любовью и преданностью делу, подготовили для вас уникальную программу - отрывки из самых известных и любимых пьес великого драматурга. Вы увидите, как оживают сцены, давно ставшие классикой, но не утратившие своей остроты и актуальности.	2025-04-12	f	http://localhost:9000/antrakt-images/archive/2025/07/18/92c749e4-ab4f-4c18-b89a-25a6b3c03c9a.jpg	Вечер, посвящённый русскому драматургу О.Н. Островскому	http://localhost:9000/antrakt-images/archive/2025/07/18/7d58f7c4-0f0f-472e-ae2a-76406fb8b8de.jpg	12+	{}
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
-- Data for Name: directors_theatre; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directors_theatre (id, created_at, updated_at, deleted_at, name, description, perfomances, years, team_name, image_url) FROM stdin;
1	2025-07-03 20:36:37.955881+07	2025-07-03 20:29:37.656+07	\N	Дустимов Андрей	Дустимов Андрей Аидмазонович в феврале 2020 года создал на базе учреждения детскую театральную студию «ДА». В 2021 году создал театр-студию «Антракт» для взрослых. Закончил в 2013 г. «Московский государственный университет культуры и искусств», в 2021 г. поступил в «Новосибирский государственный театральный институт» по специальности режиссер драмы, учится по сей день. В 2020 году прошел профессиональную переподготовку в АНО «Академия дополнительного профессионального образования» по специальности «Руководитель театрального коллектива». Стаж в должности – 5 лет.	{"Предновогодняя сказка «Морозко»","Драматическая сказка «Маленький принц»","Спектакль «Девочка со спичками»","Предновогодняя сказка «По Щучьему веленью»","Комедия А.П. Чехова «Свадьба»","Драматическая сказка «Алиса»","Комедия «Тёща браку не помеха»","Спектакль «Вечно живые»","Сказка «Дюймовочка»","Сказка-фарс «О царе Салтане»","Спектакль \\"Трамвай 'Желание'\\"","Трагикомедия \\"4айка\\"","Про козлёнка, который хотел стать взрослым"}	{2021,2022,2022,2023,2023,2023,2024,2024,2024,2024,2024,2025,2025}	{"Образцовый коллектив театральная студия «ДА»","Образцовый коллектив театральная студия «ДА»","Театр-студия «Антракт»","Образцовый коллектив театральная студия «ДА»","Театр-студия «Антракт»","Образцовый коллектив театральная студия «ДА»","Театр-студия «Антракт»","Театр-студия «Антракт»","Театр-студия «Антракт» и Образцовый коллектив театральная студия «ДА»","Театр-студия «Антракт»","Театр-студия \\"Антракт\\"","Театр-студия \\"Антракт\\"","Театр-студия \\"Антракт\\""}	http://localhost:9000/antrakt-images/directors/2025/07/21/df4c64b5-db89-4539-9429-eeda772c7327.jpg
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
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news (id, created_at, updated_at, deleted_at, title, description, image_url, summary, is_published, images_list, date_publish) FROM stdin;
2	2025-07-10 19:05:00.778217+07	\N	\N	Триумф на Рампе!	Триумф на «Рампе»! Театр выходит в финал краевого конкурса!\nОтличные новости! Театр принял участие в отборочном этапе краевого конкурса любительского театрального искусства «Рампа» и одержал блестящую победу, завоевав Диплом I степени!\n\nЭто огромное достижение, подтверждающее талант и усердие всего коллектива. Теперь, вдохновленные этим успехом, театр готовится к следующему, ещё более ответственному этапу.\n\nВ ноябре коллектив отправится в Красноярск, чтобы побороться за победу в финале конкурса «Рампа»! Это будет серьезное испытание, но театр полон решимости показать всё, на что способен.\n\nПоздравляем всех, кто причастен к этой замечательной победе, и желаем удачи в финале! Верим, что в Красноярске талант и страсть к театру приведут коллектив к новым высотам.	http://localhost:9000/antrakt-images/news/2025/07/10/c4312a33-4179-4c0b-a613-a2b552c3de24.jpg	Триумф на «Рампе»! Театр выходит в финал краевого конкурса!\nОтличные новости! Театр принял участие в отборочном этапе краевого конкурса любительского театрального искусства «Рампа» и одержал блестящую победу, завоевав Диплом I степени!	t	{}	\N
3	2025-07-16 19:29:04.717898+07	\N	\N	🚀 ПОБЕДА! 🚀	🚀 ПОБЕДА! 🚀\n\nНаш театр с огромной гордостью сообщает: мы приняли участие в международном фестивале-конкурсе искусства и творчества «Новые таланты» и заняли призовые места!\n\nЭто фантастический успех и подтверждение нашего таланта! Спасибо всем, кто был с нами!	http://localhost:9000/antrakt-images/news/2025/07/16/9fdc18f3-095e-44d7-a413-3d010110c3b7.jpg	Наш театр с огромной гордостью сообщает: мы приняли участие в международном фестивале-конкурсе искусства и творчества «Новые таланты» и заняли призовые места!	t	{http://localhost:9000/antrakt-images/news/2025/07/16/9c4c091c-b03c-4aa3-adca-3c536d0eca36.jpg,http://localhost:9000/antrakt-images/news/2025/07/16/b5bab893-114c-4e78-87a1-c5632dc81cb6.jpg,http://localhost:9000/antrakt-images/news/2025/07/16/b93a213e-6e65-468b-a67d-cbadb048c0c5.jpg,http://localhost:9000/antrakt-images/news/2025/07/16/6b2a8096-9b30-40b0-901b-43c0b692d446.jpg}	2025-07-16
1	2025-07-03 21:04:13.489618+07	2025-07-03 21:00:18.588+07	\N	Важная награда!	Сегодня в театре-студии «Антракт» особенный день, наполненный радостью и гордостью! Наш руководитель был удостоен благодарственного письма от главы города Дмитрия Владимировича Карасева за вклад в развитие культуры нашего города. Это признание – результат кропотливой и преданной работы всей нашей команды, и мы от всего сердца поздравляем Дустимова Андрея Аидмазоновича с этой заслуженной наградой!\n\nИ, конечно же, мы не можем не поздравить всех причастных с Днём работника культуры! Этот праздник – дань уважения тем, кто посвятил свою жизнь искусству, кто творит и вдохновляет, кто делает наш мир ярче и богаче.\n\nТеатр-студия «Антракт» желает всем работникам культуры неиссякаемого вдохновения, творческих взлётов, благодарных зрителей и слушателей! Пусть каждый ваш проект будет наполнен любовью и страстью, пусть искусство дарит вам радость и удовлетворение!\n\nМы верим, что культура – это душа общества, и мы гордимся тем, что являемся частью этого великого дела. Спасибо вам за ваш труд!	http://localhost:9000/antrakt-images/news/2025/07/10/ada24e8e-77cd-4984-a259-60d73239132a.jpg	Сегодня в театре-студии «Антракт» особенный день, наполненный радостью и гордостью! Наш руководитель был удостоен благодарственного письма от главы города Дмитрия Владимировича Карасева за вклад в развитие культуры нашего города.	t	{}	\N
\.


--
-- Data for Name: perfomances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.perfomances (id, created_at, updated_at, deleted_at, title, author, genre, age_limit, duration, premiere_date, production_team, the_cast, description, afisha, image_url, performances_image, images_list, ticket_url) FROM stdin;
8	2025-07-22 20:31:35.897916+07	\N	\N	4айка	Антон Чехов	Трагикомедия	16+	02:00:00	2025-03-22	{"Режиссер спектакля – Андрей Дустимов","Художник по свету – Иван Пирютко","Звукорежиссер – Дмитрий Цитович"}	{"Ксения Никифорук","Сергей Кравченко","Елена Курченкова","Андрей Дустимов","Михаил Кононыхин","Марина Постникова"}	В этом году мы отмечаем 165-летие со дня рождения великого русского драматурга Антона Павловича Чехова. Театр-студия "Антракт" подготовила для вас особенный подарок: нашу интерпретацию знаменитой пьесы. Режиссер предлагает свежий взгляд на классическое произведение, перенося нас в современный контекст. Цифра "4" в названии спектакля "4айка" не случайна. Она символизирует число кармических задач, которое, согласно нумерологии, призывает нас жить в реальности, отбросить иллюзии и смотреть правде в глаза.\nСпектакль представляет собой иллюзию, как смысл в жизни. Герои пьесы живут в мире, оторванном от реальности. Они мечтают о любви, славе, признании, о новой жизни, но эти мечты часто оказываются несбыточными. Чехов подчеркивает, что мечты, не подкрепленные реальными действиями и усилиями, обречены на провал.	f	http://localhost:9000/antrakt-images/perfomances/2025/07/22/43dcd958-68ea-4744-9813-edf253adc70b.jpg	http://localhost:9000/antrakt-images/perfomances/2025/07/22/68642784-ace4-4c7f-be39-06aa40eaad28.jpg	{http://localhost:9000/antrakt-images/perfomances/2025/07/22/035e6dbf-87a8-48fc-9cd8-b0644e828c80.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/82dd8745-20f0-4aca-9681-a462cc43be18.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/c956344b-2e33-4152-ba04-a2e039722e5d.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/27349886-2acc-4c9b-ba8f-e895d5d59cff.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/1f35a424-ea69-41ec-89ea-fd04f661fe59.jpg}	
3	2025-07-14 17:39:53.517562+07	\N	\N	О царе Салтане	Андрей Дустимов	Сказка-фарс	16+	00:50:00	2024-05-11	{"Режиссёр спектакля - Андрей Дустимов","Художник по свету – Ильяс Байсалов","Звукорежиссер – Артем Кузьменко"}	{"Ксения Никифорук","Сергей Кравченко","Татьяна Миронова","Илья Захаров","Назира Качаева","Инна Авдиенко","Оксана Гасанова","Татьяна Протченко","Ксения Герасимова","Елена Курченкова","Юлия Попова","Юлия Трефилова","Ирина Скорик","Светлана Новак","Гузель Садртдинова"}	«Не судите, да не судимы будете» — это библейское изречение уже тысячи лет остаётся актуальным. Главный герой постановки - царь Салтан, который предстаёт перед судом за совершённые проступки. Царь Салтан – великодушный и наивный правитель. Он, как большой ребенок, топающий ногами, слепо верящий придворной лжи и мечтающий о простом счастье. Но как он мог оказаться на скамье подсудимых? Это и предстоит выяснить нашему дорогому зрителю - действительно ли Салтан виновен, или же три сестрицы дерзко его оклеветали.	f	http://localhost:9000/antrakt-images/perfomances/2025/07/14/4420e7e8-eb46-44f6-b651-628156d5dc91.jpg	http://localhost:9000/antrakt-images/perfomances/2025/07/14/76781581-4693-483f-9b5d-0c56932fb902.jpg	{http://localhost:9000/antrakt-images/perfomances/2025/07/14/c4cd777b-630b-4d9a-93d1-3b3aea88e6f1.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/14/2c3587d9-d55b-4f12-b355-195587dbea02.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/14/294dab0f-e6e6-43b7-81a9-a90272b2e665.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/14/bc2c78bf-4c8d-4389-a649-2422feca66b1.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/14/78fd8fa1-8c9a-47aa-8a87-890754c0d20f.jpg}	\N
1	2025-07-02 22:04:43.080874+07	2025-07-02 21:54:13.096+07	\N	Дюймовочка	Ганс Христиан Андерсен	Сказка	6+	00:52:00	2024-03-24	{"Режиссер спектакля – Андрей Дустимов","Художник по свету – Иван Пирютко","Звукорежиссер – Андрей Колябин"}	{"Ксения Никифорук","Екатерина Наконечная","Михаил Кононыхин","Илья Захаров","Елена Курченкова","Юлия Фартушина","Снежана Рыбалко","Анна Иваненко","Егор Курченков","Семен Филатов","Ольга Умблия","Варвара Бажина","Дарья Солодовникова","Милана Галактионова","Полина Соловьева","Алиса Давыдова","Олеся Падалка","Дарья Козлова","Анна Боровикова","Дарья Диль"}	Знакомая всем с детства сказка Ганса Христиана Андерсена «Дюймовочка» предстанет перед вами в новом, необычном свете. Мало кто знает, что, создавая эту историю, Андерсен черпал вдохновение в древних легендах о крошечных человечках, которых в германо-скандинавских мифах называли «пикси». Эти миниатюрные существа обитали в самых разных уголках мира.\nНаш спектакль расскажет о маленькой девочке, которая оказывается лицом к лицу с большим и загадочным миром. Не имея опыта и знаний, она отправляется в увлекательное путешествие, полное приключений. На своем пути она встретит множество удивительных персонажей и столкнется с различными испытаниями. Вместе с Дюймовочкой зрители отправятся в поиски ее истинного предназначения.	f	http://localhost:9000/antrakt-images/perfomances/2025/07/11/43f3f1d4-5374-4bea-9f54-6597769554b7.jpg	http://localhost:9000/antrakt-images/perfomances/2025/07/14/dccd77e8-9312-42a6-becc-524b01af2c99.png	{http://localhost:9000/antrakt-images/perfomances/2025/07/14/8b05fe44-8a45-4859-bfa1-f54b4a2428b8.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/14/7ee672d1-e086-4453-959a-55c036821e8e.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/14/a0ade88a-0078-4815-9236-b93a95fedc7c.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/14/790c0629-2c41-474e-a40c-46501df7fd98.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/14/22b5fc22-609b-4922-9872-64309ff36da8.jpg}	
2	2025-07-11 14:45:25.809834+07	\N	\N	Трамвай "Желание"	Теннеси Уильямс	Драма	18+	01:40:00	2024-09-28	{"Режиссёр спектакля - Андрей Дустимов","Художник по свету – Иван Пирютко","Звукорежиссер – Дмитрий Цитович"}	{"Ольга Умблия","Сергей Кравченко","Марина Постникова","Михаил Кононыхин","Максим Шарагин","Марина Бордюгова","Захаров Илья"}	Бланш Дюбуа, хрупкая и уязвимая женщина, ищет спасения в объятиях сестры. Но вместо утешения находит лишь безжалостную реальность. Ее мир, построенный на иллюзиях и воспоминаниях, рушится на глазах. Психологическая драма "Трамвай "Желание" – это история о столкновении мечты и действительности, о потере и обретении.	t	http://localhost:9000/antrakt-images/perfomances/2025/07/11/25754f83-b50b-4d00-b647-ae4d1098f924.jpg	http://localhost:9000/antrakt-images/perfomances/2025/07/14/3ce17420-1eb4-494b-a712-ec9e8ee178ed.jpg	{http://localhost:9000/antrakt-images/perfomances/2025/07/14/6caf4ae7-2381-40b8-881d-cf0c523dbfc7.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/14/ed876340-d005-4091-a7af-a71f53628425.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/14/6c2cae65-5deb-4646-abfa-37c4d12b052c.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/14/a7c678f3-e0a1-4998-a82f-c488e458ec86.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/14/612e923b-c8c7-4b80-8d7a-4705c65b5aaf.jpg}	
9	2025-07-22 20:34:59.8631+07	\N	\N	Одна вторая	С. Дерби	Моноспектакль	16+	00:55:00	2025-05-17	{"Режиссёр спектакля - Марина Шевелер","Художник по свету - Алексей Казаринов"}	{"Елена Телегина"}	«Одна-Вторая» - участник престижного конкурса «Золотой фонд театральных постановок России 2025». Эта смешная и одновременно трогательная история проведет нас сквозь откровения женщины, чья жизнь неожиданно обрела публичность и узнаваемость. Несмотря на обстоятельства, которые, казалось бы, должны сломить, она учится жить с достоинством, сохраняя в себе удивительную женственность и неиссякаемую доброту. «Одна-Вторая» — это исследование стойкости духа, умения находить свет даже в самые темные времена, и напоминание о том, что истинная красота человека часто скрыта от поверхностного\nвзгляда.\nИсполнительница главной роли Елена Телегина является вдохновителем постановки. Талантливый режиссер, преподаватель кафедры актерского мастерства и режиссуры Новосибирского государственного театрального института, которая сотрудничает с непрофессиональным театром «Антракт» над спектаклем «Лазарет». Обладая глубоким пониманием человеческой психологии и богатым актерским опытом, Елена Телегина мастерски воплощает на сцене образ героини, передавая всю палитру ее эмоций. Зритель сможет проследить за ее внутренним миром, за тем, как неожиданная известность влияет на ее самовосприятие и взаимоотношения с окружающими, и вместе с ней попытаться ответить на вопросы, которые ставит спектакль.	f	http://localhost:9000/antrakt-images/perfomances/2025/07/22/f7286fb7-c84c-4858-bfa9-7c6ad9c5266e.jpg	http://localhost:9000/antrakt-images/perfomances/2025/07/22/3bd0cfa0-30e9-4db3-a6b9-108f99f97f6e.jpg	{http://localhost:9000/antrakt-images/perfomances/2025/07/22/55c92db0-c6c7-490e-8c85-7b461ccd7fd0.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/918456e8-793f-425e-98cb-2d14e57d8ccf.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/48012892-5082-4888-86f9-aaa86c60b5f7.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/5947b892-99f0-4aee-9f31-3f1abff8a694.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/dc39ea3b-43d5-4916-9c3a-88fb1acc01ea.jpg}	
4	2025-07-22 20:04:11.726655+07	\N	\N	Девочка со спичками	Ганс Христиан Андерсен	Драма	16+	01:00:00	2022-12-03	{"Режиссер спектакля – Андрей Дустимов","Художник по свету – Иван Пирютко","Звукорежиссер – Дмитрий Цитович","Видеограф – Михаил Шаров","Хореограф-постановщик - Елена Курченкова"}	{"Ксения Никифорук","Сергей Кравченко","Илья Захаров","Инна Авдиенко","Оксана Гасанова","Ксения Герасимова","Гузель Садртдинова","Ольга Умблия","Юлия Фартушина","Ярослав Евстигнеев","Анна Молодчая","Софья Никифорук","Екатерина Наконечная"}	В центре спектакля – история маленькой девочки, пытающейся согреться и утолить голод, продавая спички на холодной улице. Окружающие взрослые, погруженные в свои дела, не замечают ее страданий. Эта трогательная сказка напоминает нам о важности человечности, сострадания и взаимопомощи. Каждый из нас может сделать этот мир чуточку добрее.	f	http://localhost:9000/antrakt-images/perfomances/2025/07/22/6c29960c-4f1d-4921-a0e7-39def59fe91d.jpg	http://localhost:9000/antrakt-images/perfomances/2025/07/22/23ffaec4-dbb6-4506-8343-9254b2b56c57.jpg	{http://localhost:9000/antrakt-images/perfomances/2025/07/22/c29a6a63-5b94-47f6-ace7-eaed942a2cd1.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/0f15ed47-d781-4099-8a0c-e0258f2dba1a.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/3f655b4f-2f33-4fe9-97a3-b41e936be27b.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/fa56d3d9-e058-43b5-a20a-5dbad9151f69.jpg}	
5	2025-07-22 20:20:40.333226+07	\N	\N	Тёща браку не помеха	Лилия Моцарь	Комедия	18+	01:00:00	2022-09-30	{"Режиссер спектакля – Андрей Дустимов","Художник по свету – Ильяс Байсалов","Звукорежиссер – Артем Кузьменко"}	{"Ксения Никифорук","Андрей Дустимов","Екатерина Наконечная","Максим Шарагин"}	Амалия – не просто теща, а настоящая стратег. Скрупулезно изучив семейную динамику, она разрабатывает хитроумный план, чтобы спасти брак своей дочери. Ее методы нестандартны и часто вызывают смех. Но за каждой шуткой скрывается глубокое понимание человеческой психологии. В роли гениального режиссера Амалия умело манипулирует событиями, ставя перед героями спектакля нелегкие задачи. Каждый персонаж – это отдельная история, полная страхов, надежд и противоречий. Амалия же мастерски сплетает их в единый узор.	f	http://localhost:9000/antrakt-images/perfomances/2025/07/22/99e05764-e7c0-4300-bc07-97df95f29c5b.jpg	http://localhost:9000/antrakt-images/perfomances/2025/07/22/7fa2c127-f0de-4e0a-bb32-3f68e1611176.jpg	{http://localhost:9000/antrakt-images/perfomances/2025/07/22/524f4838-854a-4c4b-a73f-2ee481d8e292.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/53319039-2a85-49c2-b845-894e3d475318.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/e6a4abbb-b2ae-4859-8139-a05b82a99c4a.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/7bd7fcb6-c227-4078-a771-ce907e3241ef.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/16b5e317-b675-4af9-93f2-10f94207044e.jpg}	
6	2025-07-22 20:24:49.781842+07	\N	\N	Вечно живые	Виктор Розов	Драма	16+	01:25:00	2024-04-27	{"Режиссер спектакля – Андрей Дустимов","Художник по свету – Ильяс Байсалов","Звукорежиссер – Денис Золоторев"}	{"Ксения Никифорук","Андрей Дустимов","Екатерина Наконечная","Иван Баулин","Михаил Кононыхин","Сергей Кравченко","Анна Молодчая","Илья Захаров","Ева Харитонова","Артем Кузьменко","Елена Курченкова","Юлия Фартушина","Ксения Герасимова"}	"Вечно живые" - драматический спектакль о том, как война пришла в обычную советскую молодую семью. Он мог бы достичь небывалых высот в инженерии. Она могла бы стать талантливым скульптором. И они могли бы прожить долгую и насыщенную жизнь вместе. Но судьба преподносит героям суровое испытание, которое заставляет каждого сделать нелегкий нравственный выбор, поделив их на два лагеря: «ради людей» и «ради себя». Жестокая реальность войны проявляет в каждом человеке истинную сущность. Как выжить и не потерять себя в это поистине мрачное время в истории нашей Родины?	f	http://localhost:9000/antrakt-images/perfomances/2025/07/22/f8b64a83-7ea0-4582-9a21-8817439d0752.jpg	http://localhost:9000/antrakt-images/perfomances/2025/07/22/0d1faea6-dca8-43de-abbb-fff89f0c905e.jpg	{http://localhost:9000/antrakt-images/perfomances/2025/07/22/cc5bb828-f4a4-4f99-b8ff-e2dcd50966b7.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/3e1e3337-36cc-449c-926f-c7387fcc01fb.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/ad3972b9-abab-405d-b1d0-6518192cc229.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/98f50342-d328-402f-a04a-cda54ea4c165.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/d526933f-2249-4e88-9e87-0b117844bd2f.jpg}	
7	2025-07-22 20:27:56.495767+07	\N	\N	Свадьба	Антон Чехов	Комедия	16+	00:45:00	2023-04-23	{"Режиссер спектакля – Андрей Дустимов","Художник по свету – Ольга Карпова","Звукорежиссер – Артем Кузьменко"}	{"Ксения Никифорук","Ирина Балабанова","Евгений Сощенков","Илья Захаров","Максим Шарагин","Юлия Фартушина","Марина Бордюгова","Светлана Новак","Маргарита Максименко","Ольга Умблия"}	Водевиль «Свадьба» – созданный по одноимённой пьесе Антона Павловича Чехова, является язвительной сатирой на обывательские нравы мещан дореволюционной России. На свадьбе раскрываются все прекрасные эмоции... И не прекрасные... Любовь, благодарность родителям за жениха и невесту, подарки от души, веселье и радость... Но есть такие свадьбы, где раскрывается обман, алчность, зависть, злость и...	f	http://localhost:9000/antrakt-images/perfomances/2025/07/22/36efd50c-85d2-492e-ad5e-9bd01cbf6dd5.jpg	http://localhost:9000/antrakt-images/perfomances/2025/07/22/7818aed0-9157-40b8-a18a-c13e6dba97dc.jpg	{http://localhost:9000/antrakt-images/perfomances/2025/07/22/95e434b3-a913-4dd7-8c65-60ed0f75e854.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/90866e3d-571a-47c8-9f84-44433554c6de.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/f88c4894-8cab-42d5-9440-c1cdc1851566.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/02133494-d795-464a-90c4-66cca57b1362.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/8fc5935c-cab4-4937-bf57-72dfc62dd640.jpg}	
10	2025-07-22 20:43:24.40842+07	\N	\N	Лазарет	С. Дерби	Драмеди	16+	01:15:00	2025-05-30	{"Режиссёр спектакля - Елена Телегина","Художник по свету - Ольга Карпова"}	{"Авдиенко Инна","Курченкова Елена","Наконечная Екатерина","Герасимова Ксения","Дустимов Андрей","Захаров Илья"}	Театр-студия «Антракт» совместно с приглашенным режиссером Еленой Телегиной, преподавателем кафедры актерского мастерства и режиссуры Новосибирского государственного театрального института, представляет нашумевший в Новосибирске спектакль «Лазарет» в необычном жанре драмеди, который смогут увидеть зрители Норильска.\n\nО чем же спектакль? Спокойный субботний день в хорошей клинике не предвещает никаких событий. Откуда возникает любовь, разочарование, дружба? Может они всегда находятся с нами? И, от каждого зависит, что материализуется в итоге, кто платит по счетам, а кто получает награду. Спектакль покажет наполненный страстями путь из одиночества, подарит надежду тем, кто не ждёт никаких перемен в своей обыденной жизни.	f	http://localhost:9000/antrakt-images/perfomances/2025/07/22/ed6350e9-6938-4cd7-96ac-40138311d492.jpg	http://localhost:9000/antrakt-images/perfomances/2025/07/22/6f1a898e-8fd4-434b-93d1-8c68f42c4e26.jpg	{http://localhost:9000/antrakt-images/perfomances/2025/07/22/a3a5a21a-25c2-4b2d-9ec2-21aa43286940.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/88920b26-efb4-46d1-8c05-bf24ff3be8d4.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/aacff866-d233-4cdb-ae56-e7804eab5b90.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/9193bfe9-a079-415d-92c7-814028fb6559.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/22/1777bcb3-6baf-4c12-8724-2d33d77f7cf5.jpg}	
11	2025-07-28 19:04:43.491792+07	\N	\N	Про козлёнка, который хотел стать взрослым	Дмитрий Бочаров	Сказка	0+	00:45:00	2025-06-01	{"Режиссёр спектакля - Андрей Дустимов","Хореограф - Елена Курченкова"}	{"Молодчая Анна","Юсупова Зайнап","Протченко Татьяна","Евстигнеев Ярослав","Качаева Назира","Гасанова Оксана","Алексей Батькович (поменять)"}	1 июня в 15:00 Большом зале Городского центра культуры состоится премьера благотворительного спектакля «Про Козлёнка, который хотел стать взрослым», посвященный Международному дню защиты детей.\n\nАвтором этой замечательной истории является талантливый драматург Дмитрий Бочаров. Его пьесы отличаются теплотой, мудростью и способностью говорить с детьми на понятном и увлекательном языке.\n\nЭта постановка расскажет юным зрителям и их родителям о взрослении, о мечтах и о том, как важно оставаться собой, даже стремясь к чему-то новому. Спектакль обещает быть ярким, музыкальным и поучительным, наполненным добрым юмором и важными жизненными уроками.\n\nЧтобы сделать праздник по-настоящему незабываемым, в 14:30 в Выставочном зале начнётся развлекательная программа для детей! Вас ждут веселые игры, конкурсы, аниматоры и множество сюрпризов, которые подарят отличное настроение перед просмотром спектакля.\n\nОтметьте Международный день защиты детей всей семьей в Городском центре культуры!	f	http://localhost:9000/antrakt-images/perfomances/2025/07/28/fc229008-6895-4124-bf02-a40d16cfc38f.jpg	http://localhost:9000/antrakt-images/perfomances/2025/07/28/6bac2759-7498-4bc8-a21d-363fc60899e1.jpg	{http://localhost:9000/antrakt-images/perfomances/2025/07/28/4fae4959-b4bd-4ba0-9e33-41fba09dbd0c.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/28/6153b671-83c2-4e9a-9b8b-b9217e26a5d3.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/28/c4e6178a-410e-45d9-a932-79dc4ef42628.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/28/f478b195-8db2-40e6-a139-7cdac293757b.jpg,http://localhost:9000/antrakt-images/perfomances/2025/07/28/30c6bda1-1730-4cdb-917d-c2759a7ff1b3.jpg}	
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
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, created_at, updated_at, deleted_at, email, password, phone_number, last_login, is_superuser, is_staff, access_token, refresh_token, profile_photo) FROM stdin;
2	2025-07-07 20:29:16.649877+07	\N	\N	test1@test.com	pbkdf2_sha256$1000000$QAPOlIPrdUl2CjQaX2ZTWF$Xom43Paz0/366FNnUVf77ur25ZIahWugz9gQQYqSpoE=	+7-111-111-11-11	\N	f	f	\N	\N	
13	2025-07-08 14:50:06.962723+07	\N	2025-07-23 01:39:10.664619+07	test11@test.com	pbkdf2_sha256$1000000$ylxJkwDvro9HMmN7GeqaVU$OjapoTbgnD5IPaRSmEF9sbb6EN5WiKR+7lqGIbAHie8=	+7 (111) 111-11-11	2025-07-22 18:39:02.738197+07	f	f	\N	\N	
3	2025-07-07 20:43:18.613318+07	\N	\N	test2@test.com	pbkdf2_sha256$1000000$ZLqvDabkJtNAN0AtzLM8Hc$PA03BOAqvJXRNU4PAGkylck5MsXOkquJPhucLs6gjpU=	+7 (222) 222-22-22	2025-07-07 20:44:06.273456+07	f	f	\N	\N	
14	2025-07-09 14:50:03.284459+07	\N	\N	test12@test.com	pbkdf2_sha256$1000000$axv22rd4UI2hN8y6sRRe42$rX68Q3I83hxFHEUnEudYKa9BxF37kpTExj+IHMvYp/8=	+7 (212) 121-21-21	2025-07-09 14:50:12.150554+07	f	f	\N	\N	
4	2025-07-07 20:46:17.277225+07	\N	\N	test3@test.com	pbkdf2_sha256$1000000$jAwUHyvnH14GvYqr6c971z$/kFlUqnZq5VIohvBFDGHhXvSiJc4jDC/ddc9wuZwGH4=	+7 (333) 333-33-33	2025-07-07 21:28:22.215726+07	f	f	\N	\N	
1	2025-07-06 19:22:49.019166+07	\N	\N	zaharovila780@gmail.com	pbkdf2_sha256$1000000$LAYSZknv41rAagxIICmKd3$NcIUIpNNUtx5VCHVjyBFkQvDIVY9CDZHy+L41yywkfM=	+7-983-277-80-75	2025-07-07 20:41:48.645306+07	f	f	\N	\N	
6	2025-07-07 21:43:42.429466+07	\N	\N	test5@test.com	pbkdf2_sha256$1000000$FU424ex6l0Wc7qMKefo0dy$ueb0UVlxliu4Zdjc/r+H+CP5ORHJX7I6EGs+25CoOFY=	+7 (555) 555-55-55	\N	f	f	\N	\N	
7	2025-07-08 10:29:33.505277+07	\N	\N	test6@test.com	pbkdf2_sha256$1000000$kNaxH6zwQpb6yTE7HKR34T$MzQfqawTf6p79zun+HvKwiUxk412LPrifWFYR03LgbM=	+7 (666) 666-66-66	2025-07-08 10:29:43.920868+07	f	f	\N	\N	
5	2025-07-07 21:37:11.320834+07	\N	\N	test4@test.com	pbkdf2_sha256$1000000$jUhLnqJtPkCWrmnkkAQy7i$wE4Du7xE30BJe5Uxe6kcBDRjqpF92NUor6Xx2pQcyIA=	+7 (444) 444-44-44	2025-07-08 14:12:07.925803+07	f	f	\N	\N	
9	2025-07-08 14:45:18.839992+07	\N	\N	test7@test.com	pbkdf2_sha256$1000000$OgxNSZ47QjvOP8V4ZM9jWO$EO0UL4nb/IWZRO6wgkwZysMz5WjW6dzesDPtxkjJDRE=	+7 (777) 777-77-77	\N	f	f	\N	\N	
10	2025-07-08 14:46:14.781586+07	\N	\N	test8@test.com	pbkdf2_sha256$1000000$ySfV5gE0AtjwZ4G8s4SwHX$CcYG/msPK4NLGfKpUddDuK/vTeGZ2MtisU8XkJOfl+A=	+7 (888) 888-88-88	\N	f	f	\N	\N	
11	2025-07-08 14:47:16.744241+07	\N	\N	test9@test.com	pbkdf2_sha256$1000000$dyEIPm5uYqAXgqgp1WiYDU$u/GltRumlmyjqQCgx20WYitxI8oWBBLczAmId9yGbmg=	+7 (999) 999-99-99	\N	f	f	\N	\N	
12	2025-07-08 14:48:28.321704+07	\N	\N	test10@test.com	pbkdf2_sha256$1000000$GLOUkhrjIVxRePBvLeIcPj$/oqZHxvjJ5gMXFDbhUbKHFIRS/fE8CDN9zY1pQPJYmU=	+7 (010) 101-01-01	\N	f	f	\N	\N	
17	2025-07-09 15:42:06.908023+07	\N	\N	admin777@admin.com	pbkdf2_sha256$1000000$MLFI7AZ8Rvn4GNG6uuCNYq$MJWLGwkTryWcuQOWrFtWqzxNGlnEM++iUCtPOt1oTTU=	+7-982-343-56-13	\N	f	f	\N	\N	
8	2025-07-08 14:20:18.714952+07	\N	\N	admin@admin.com	pbkdf2_sha256$1000000$0sNGEkelBZdHNQBkKzNhVi$VfLHy7EgfKi4KX92rrVE46dLB5osT+SvYrWHXu8cVpU=	+7-913-589-34-57	2025-07-08 15:08:01.458797+07	f	f	\N	\N	
15	2025-07-09 15:34:56.283214+07	\N	\N	admin123@admin.com	pbkdf2_sha256$1000000$afiCX3IdbSofJk51M3zJbF$bFhKO0dDLDzHg1lhPj4Y8rltSwG74PgwpDr6zOT+L94=	+7-982-343-56-13	\N	f	f	\N	\N	
16	2025-07-09 15:36:58.711448+07	\N	\N	admin111@admin.com	pbkdf2_sha256$1000000$BXzsrQCPu9MfJgeSWC0Wy8$XAKXusFfS4az597+2NvKwWG6j1DPWC4wMyiqJQN/JIA=	+7-982-343-56-13	\N	f	f	\N	\N	
18	2025-07-09 15:44:01.072223+07	\N	\N	np1r777@admin.com	pbkdf2_sha256$1000000$Rb1I6jrxw6VoGU7tCrLRbV$R0NOg++NlyZPuTXGddT/9blB6bS6ROKGH/g4VNN0BAo=	+7-982-343-56-13	2025-07-28 19:00:51.238256+07	t	f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUzNzA3NjUxLCJpYXQiOjE3NTM3MDQwNTEsImp0aSI6IjFhYTg4N2U4NzE4NTRiNDg5MTRmNTMxNWNjMzFjZjczIiwidXNlcl9pZCI6MTgsImVtYWlsIjoibnAxcjc3N0BhZG1pbi5jb20iLCJwaG9uZV9udW1iZXIiOiIrNy05ODItMzQzLTU2LTEzIn0.V0Eqv-uAYMiAe56276Ht5C_9Qhy1UJ6umoT_y-iy9hg	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Mzc5MDQ1MSwiaWF0IjoxNzUzNzA0MDUxLCJqdGkiOiI4OWRmODJhNDEwZjU0Y2I4YTI3OTNkMzg4N2RiZGViNiIsInVzZXJfaWQiOjE4LCJlbWFpbCI6Im5wMXI3NzdAYWRtaW4uY29tIiwicGhvbmVfbnVtYmVyIjoiKzctOTgyLTM0My01Ni0xMyJ9.IvmMJ6GSz83WTG9oOgyZTAXq26uTYuh-ThjKMhZcN9U	
\.


--
-- Name: achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.achievements_id_seq', 4, true);


--
-- Name: actors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.actors_id_seq', 19, true);


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

SELECT pg_catalog.setval('public.auth_permission_id_seq', 64, true);


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

SELECT pg_catalog.setval('public.django_content_type_id_seq', 15, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 68, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_id_seq', 3, true);


--
-- Name: perfomances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.perfomances_id_seq', 11, true);


--
-- Name: token_blacklist_blacklistedtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.token_blacklist_blacklistedtoken_id_seq', 81, true);


--
-- Name: token_blacklist_outstandingtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.token_blacklist_outstandingtoken_id_seq', 101, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_id_seq', 18, true);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


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
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


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
-- Name: token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like ON public.token_blacklist_outstandingtoken USING btree (jti varchar_pattern_ops);


--
-- Name: token_blacklist_outstandingtoken_user_id_83bc629a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX token_blacklist_outstandingtoken_user_id_83bc629a ON public.token_blacklist_outstandingtoken USING btree (user_id);


--
-- Name: user_email_54dc62b2_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_email_54dc62b2_like ON public."user" USING btree (email varchar_pattern_ops);


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

