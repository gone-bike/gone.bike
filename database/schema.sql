--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg110+1)
-- Dumped by pg_dump version 15.3 (Debian 15.3-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tiger;


ALTER SCHEMA tiger OWNER TO postgres;

--
-- Name: tiger_data; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tiger_data;


ALTER SCHEMA tiger_data OWNER TO postgres;

--
-- Name: topology; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO postgres;

--
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: postgis_tiger_geocoder; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;


--
-- Name: EXTENSION postgis_tiger_geocoder; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';


--
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bike_brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bike_brand (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    name character varying(255)
);


ALTER TABLE public.bike_brand OWNER TO postgres;

--
-- Name: bike_brand_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bike_brand_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bike_brand_id_seq OWNER TO postgres;

--
-- Name: bike_brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bike_brand_id_seq OWNED BY public.bike_brand.id;


--
-- Name: bike_brand_model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bike_brand_model (
    id integer NOT NULL,
    bike_brand integer,
    name character varying(255) NOT NULL
);


ALTER TABLE public.bike_brand_model OWNER TO postgres;

--
-- Name: bike_brand_model_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bike_brand_model_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bike_brand_model_id_seq OWNER TO postgres;

--
-- Name: bike_brand_model_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bike_brand_model_id_seq OWNED BY public.bike_brand_model.id;


--
-- Name: i18n; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.i18n (
    id integer NOT NULL,
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    key character varying(255),
    base_translation text NOT NULL
);


ALTER TABLE public.i18n OWNER TO postgres;

--
-- Name: i18n_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.i18n_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.i18n_id_seq OWNER TO postgres;

--
-- Name: i18n_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.i18n_id_seq OWNED BY public.i18n.id;


--
-- Name: i18n_translation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.i18n_translation (
    id integer NOT NULL,
    user_updated uuid,
    date_updated timestamp with time zone,
    i18n_key integer NOT NULL,
    language integer NOT NULL,
    translation text,
    auto_translated boolean DEFAULT false NOT NULL
);


ALTER TABLE public.i18n_translation OWNER TO postgres;

--
-- Name: i18n_translation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.i18n_translation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.i18n_translation_id_seq OWNER TO postgres;

--
-- Name: i18n_translation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.i18n_translation_id_seq OWNED BY public.i18n_translation.id;


--
-- Name: language; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.language (
    id integer NOT NULL,
    locale_code character varying(16) NOT NULL
);


ALTER TABLE public.language OWNER TO postgres;

--
-- Name: language_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.language_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.language_id_seq OWNER TO postgres;

--
-- Name: language_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.language_id_seq OWNED BY public.language.id;


--
-- Name: report; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report (
    id integer NOT NULL,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    user_created uuid,
    date_created timestamp with time zone,
    user_updated uuid,
    date_updated timestamp with time zone,
    location public.geometry(Point,4326),
    bike_brand_model integer,
    theft_date date NOT NULL,
    description text,
    colors json,
    serial_number character varying(255),
    bike_type character varying(255),
    approximate_value integer,
    approximate_value_currency character varying(3),
    theft_location_type character varying(255),
    lock_type character varying(255),
    lock_anchor character varying(255),
    language integer,
    main_photo uuid,
    is_electric boolean DEFAULT false,
    theft_timeframe character varying(255)
);


ALTER TABLE public.report OWNER TO postgres;

--
-- Name: report_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report_files (
    id integer NOT NULL,
    report_id integer,
    directus_files_id uuid
);


ALTER TABLE public.report_files OWNER TO postgres;

--
-- Name: report_files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.report_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.report_files_id_seq OWNER TO postgres;

--
-- Name: report_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.report_files_id_seq OWNED BY public.report_files.id;


--
-- Name: report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.report_id_seq OWNER TO postgres;

--
-- Name: report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.report_id_seq OWNED BY public.report.id;


--
-- Name: bike_brand id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bike_brand ALTER COLUMN id SET DEFAULT nextval('public.bike_brand_id_seq'::regclass);


--
-- Name: bike_brand_model id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bike_brand_model ALTER COLUMN id SET DEFAULT nextval('public.bike_brand_model_id_seq'::regclass);


--
-- Name: i18n id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.i18n ALTER COLUMN id SET DEFAULT nextval('public.i18n_id_seq'::regclass);


--
-- Name: i18n_translation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.i18n_translation ALTER COLUMN id SET DEFAULT nextval('public.i18n_translation_id_seq'::regclass);


--
-- Name: language id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.language ALTER COLUMN id SET DEFAULT nextval('public.language_id_seq'::regclass);


--
-- Name: report id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report ALTER COLUMN id SET DEFAULT nextval('public.report_id_seq'::regclass);


--
-- Name: report_files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_files ALTER COLUMN id SET DEFAULT nextval('public.report_files_id_seq'::regclass);


--
-- Name: bike_brand bike_brand_key_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bike_brand
    ADD CONSTRAINT bike_brand_key_unique UNIQUE (key);


--
-- Name: bike_brand_model bike_brand_model_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bike_brand_model
    ADD CONSTRAINT bike_brand_model_name_unique UNIQUE (name);


--
-- Name: bike_brand_model bike_brand_model_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bike_brand_model
    ADD CONSTRAINT bike_brand_model_pkey PRIMARY KEY (id);


--
-- Name: bike_brand bike_brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bike_brand
    ADD CONSTRAINT bike_brand_pkey PRIMARY KEY (id);


--
-- Name: i18n i18n_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.i18n
    ADD CONSTRAINT i18n_pkey PRIMARY KEY (id);


--
-- Name: i18n_translation i18n_translation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.i18n_translation
    ADD CONSTRAINT i18n_translation_pkey PRIMARY KEY (id);


--
-- Name: language language_locale_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.language
    ADD CONSTRAINT language_locale_code_unique UNIQUE (locale_code);


--
-- Name: language language_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.language
    ADD CONSTRAINT language_pkey PRIMARY KEY (id);


--
-- Name: report_files report_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_files
    ADD CONSTRAINT report_files_pkey PRIMARY KEY (id);


--
-- Name: report report_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_pkey PRIMARY KEY (id);


--
-- Name: bike_brand_model bike_brand_model_bike_brand_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bike_brand_model
    ADD CONSTRAINT bike_brand_model_bike_brand_foreign FOREIGN KEY (bike_brand) REFERENCES public.bike_brand(id) ON DELETE SET NULL;


--
-- Name: i18n_translation i18n_translation_i18n_key_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.i18n_translation
    ADD CONSTRAINT i18n_translation_i18n_key_foreign FOREIGN KEY (i18n_key) REFERENCES public.i18n(id) ON DELETE CASCADE;


--
-- Name: i18n_translation i18n_translation_language_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.i18n_translation
    ADD CONSTRAINT i18n_translation_language_foreign FOREIGN KEY (language) REFERENCES public.language(id) ON DELETE SET DEFAULT;


--
-- Name: i18n_translation i18n_translation_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.i18n_translation
    ADD CONSTRAINT i18n_translation_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: report report_bike_brand_model_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_bike_brand_model_foreign FOREIGN KEY (bike_brand_model) REFERENCES public.bike_brand_model(id) ON DELETE SET NULL;


--
-- Name: report_files report_files_directus_files_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_files
    ADD CONSTRAINT report_files_directus_files_id_foreign FOREIGN KEY (directus_files_id) REFERENCES public.directus_files(id) ON DELETE CASCADE;


--
-- Name: report_files report_files_report_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_files
    ADD CONSTRAINT report_files_report_id_foreign FOREIGN KEY (report_id) REFERENCES public.report(id) ON DELETE CASCADE;


--
-- Name: report report_language_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_language_foreign FOREIGN KEY (language) REFERENCES public.language(id);


--
-- Name: report report_main_photo_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_main_photo_foreign FOREIGN KEY (main_photo) REFERENCES public.directus_files(id) ON DELETE SET NULL;


--
-- Name: report report_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: report report_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- PostgreSQL database dump complete
--

