--
-- PostgreSQL database cluster dump
--

\restrict cYGwsNqQO09sd3PoKEPOAWmPS3WTaISVBHxGZvkTvJo8jOOFJWKto1xQdvYV7ln

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE admin_db;
DROP DATABASE auth_db;
DROP DATABASE cart_db;
DROP DATABASE inventory_db;
DROP DATABASE notification_db;
DROP DATABASE order_db;
DROP DATABASE payment_db;
DROP DATABASE product_db;
DROP DATABASE promotion_db;
DROP DATABASE review_db;
DROP DATABASE shipping_db;
DROP DATABASE user_db;
DROP DATABASE wishlist_db;




--
-- Drop roles
--

DROP ROLE postgres;


--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:UPPfgqMWl2p/WGt198GNFQ==$nRA5fi0Hm7NqQXrNPJpUWxAD+cv0WG+NRApVaZFfXn4=:PBBENMQVFn6GO1STQsOX2K38L+hGbSrRBFQcbfUKHU0=';

--
-- User Configurations
--








\unrestrict cYGwsNqQO09sd3PoKEPOAWmPS3WTaISVBHxGZvkTvJo8jOOFJWKto1xQdvYV7ln

--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

\restrict IkaWeeOlFK4CqrBU9XUbgQaklY3JUtMSYLiMTwKo9jNGlYUl809rXedTLe5EOz9

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO postgres;

\unrestrict IkaWeeOlFK4CqrBU9XUbgQaklY3JUtMSYLiMTwKo9jNGlYUl809rXedTLe5EOz9
\connect template1
\restrict IkaWeeOlFK4CqrBU9XUbgQaklY3JUtMSYLiMTwKo9jNGlYUl809rXedTLe5EOz9

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
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\unrestrict IkaWeeOlFK4CqrBU9XUbgQaklY3JUtMSYLiMTwKo9jNGlYUl809rXedTLe5EOz9
\connect template1
\restrict IkaWeeOlFK4CqrBU9XUbgQaklY3JUtMSYLiMTwKo9jNGlYUl809rXedTLe5EOz9

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
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: postgres
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict IkaWeeOlFK4CqrBU9XUbgQaklY3JUtMSYLiMTwKo9jNGlYUl809rXedTLe5EOz9

--
-- Database "admin_db" dump
--

--
-- PostgreSQL database dump
--

\restrict Qzxc3dMhSKDpjEcQk6dhWD6ae7PGgf5M3t8GbfPfRwkMcGC5l0J5zbYjAjwAXkr

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: admin_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE admin_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE admin_db OWNER TO postgres;

\unrestrict Qzxc3dMhSKDpjEcQk6dhWD6ae7PGgf5M3t8GbfPfRwkMcGC5l0J5zbYjAjwAXkr
\connect admin_db
\restrict Qzxc3dMhSKDpjEcQk6dhWD6ae7PGgf5M3t8GbfPfRwkMcGC5l0J5zbYjAjwAXkr

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
-- PostgreSQL database dump complete
--

\unrestrict Qzxc3dMhSKDpjEcQk6dhWD6ae7PGgf5M3t8GbfPfRwkMcGC5l0J5zbYjAjwAXkr

--
-- Database "auth_db" dump
--

--
-- PostgreSQL database dump
--

\restrict 8afrG0P8V58YfPW9cix3ZFT9QGlvgJcZbteng0m2lg3gvx2I0WZ3lef0w5ehCYz

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: auth_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE auth_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE auth_db OWNER TO postgres;

\unrestrict 8afrG0P8V58YfPW9cix3ZFT9QGlvgJcZbteng0m2lg3gvx2I0WZ3lef0w5ehCYz
\connect auth_db
\restrict 8afrG0P8V58YfPW9cix3ZFT9QGlvgJcZbteng0m2lg3gvx2I0WZ3lef0w5ehCYz

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    expiry_date timestamp(6) without time zone NOT NULL,
    token character varying(255) NOT NULL,
    used boolean NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.password_reset_tokens_id_seq OWNER TO postgres;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    expiry_date timestamp(6) without time zone NOT NULL,
    revoked boolean NOT NULL,
    token character varying(512) NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.refresh_tokens_id_seq OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: user_auths; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_auths (
    id bigint NOT NULL,
    active boolean NOT NULL,
    blocked boolean NOT NULL,
    created_at timestamp(6) without time zone,
    email character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone_number character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone,
    CONSTRAINT user_auths_role_check CHECK (((role)::text = ANY ((ARRAY['CUSTOMER'::character varying, 'ADMIN'::character varying])::text[])))
);


ALTER TABLE public.user_auths OWNER TO postgres;

--
-- Name: user_auths_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_auths_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_auths_id_seq OWNER TO postgres;

--
-- Name: user_auths_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_auths_id_seq OWNED BY public.user_auths.id;


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: user_auths id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_auths ALTER COLUMN id SET DEFAULT nextval('public.user_auths_id_seq'::regclass);


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, created_at, expiry_date, token, used, user_id) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, created_at, expiry_date, revoked, token, user_id) FROM stdin;
1	2026-08-22 10:43:21.351374	2026-08-29 10:43:21.266893	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODczOTU0MDEsImV4cCI6MTc4ODAwMDIwMX0.RRMQT6CHpu-xksfKOcMAj2pd_b1GfiYl29W7RrpK9JWzM-a8YM73LV_POqNkQ2OsmIucNBdOTdbq3xVpiEqmcA	1
2	2026-08-22 10:44:20.532	2026-08-29 10:44:20.520894	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODczOTU0NjAsImV4cCI6MTc4ODAwMDI2MH0.rIe1wdcARuPbm9k-qad7dDyJeobObXjistgj-dX4OYbt11RBWHkzuwaMiI86lWXQ7o0RxP2HlYG-e6FNxKi-bw	2
3	2026-08-22 11:21:26.751789	2026-08-29 11:21:26.735974	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODczOTc2ODYsImV4cCI6MTc4ODAwMjQ4Nn0.YZ0_bY4_KLiDOhnow6PjLPbuinrkwH5NoQb2AfWylZ4CgV0yllEkzUjONpH1azVQExBMUVAUpzFCAwX8fwBb_w	2
4	2026-08-22 11:33:00.895415	2026-08-29 11:33:00.877896	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODczOTgzODAsImV4cCI6MTc4ODAwMzE4MH0.pUK1oH4TvvECRajehK9leWGFxMxmAlrhdNB7Pe0kFjwzVhUiPtviboiuh4SGIeeKDXeTLjEGdUOZjYe0Ljah1A	1
5	2026-08-22 11:41:17.158197	2026-08-29 11:41:17.112804	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODczOTg4NzcsImV4cCI6MTc4ODAwMzY3N30.jXK1tRh0vEfFOjLcv5r0-XURLbNYxFOn8x6nICsxpNq6_GpKvu-IvH9qJWdiyQMWN49gnpLpN4sy_Rh9LBjMXQ	2
6	2026-08-22 11:43:33.681446	2026-08-29 11:43:33.666284	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODczOTkwMTMsImV4cCI6MTc4ODAwMzgxM30.mvDJGy2itKGSN7SnO2JRNSICbRSV6UmtMOQDzmGL2FI04vDddybc44NwTKn_MKXyTOgVzjyGIUxNmYJofU9IAg	3
7	2026-08-22 11:43:38.970774	2026-08-29 11:43:38.957793	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODczOTkwMTgsImV4cCI6MTc4ODAwMzgxOH0.uDmOSN1Mn3V_3N-wJAEWn9Fa1Q7FXNFTotzlEYBGvfuuM7DledJnP_1LB9J96pqxzPwDlK-r5M1KxG133pHK3A	3
8	2026-08-22 11:46:52.66029	2026-08-29 11:46:52.61096	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODczOTkyMTIsImV4cCI6MTc4ODAwNDAxMn0.4C-KYXf7l-GUcUPiIl1W_reIoxP6CoaKXStiKgdVxboHdiOZqUSfxXXa7kace46BvKnilhw2-0DYeT-dbo3gQg	3
9	2026-08-22 14:03:34.721777	2026-08-29 14:03:34.393202	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MDc0MTQsImV4cCI6MTc4ODAxMjIxNH0.jLBkWw4X7dNcjH7YLTAwHnZYAshBnB_bRlAAa7IjxnVq-Koz1SCdWBTqgSxL2wiJBic5WA9IvYIrDmTceYeKgQ	3
10	2026-08-22 14:16:03.700098	2026-08-29 14:16:03.572704	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MDgxNjMsImV4cCI6MTc4ODAxMjk2M30.HtKGlv4-1Nh7PoLoqxSgEwgh-XPAZEdYw23ZI-TpCwbWUbaYQSlRTrVpX-E8nPwxl2xluffaaZAM-3q8djriLg	3
11	2026-08-22 14:28:46.918567	2026-08-29 14:28:46.753501	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MDg5MjYsImV4cCI6MTc4ODAxMzcyNn0.MqZR_r0AS74aa3wZr_RoNbSSFkmgY7f7NATs5NEhBGCZEwMyx0sLSmvNgohxbqQykjvyEIShD4c6JTGABbiceA	3
12	2026-08-22 15:21:28.245722	2026-08-29 15:21:28.16056	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MTIwODgsImV4cCI6MTc4ODAxNjg4OH0.7jSa3PK-GoTQRftaX8QxbatPIDb-ONDwjePnbaDCW5c-gsOZHdBjzdtc9ojT2cDhdLt0xyB6XNOyx5rnKyu1Xg	1
13	2026-08-22 15:25:41.097289	2026-08-29 15:25:41.033616	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MTIzNDEsImV4cCI6MTc4ODAxNzE0MX0.WFt5fs8LNpA6r47G8F0cgVSSpvp9csy-cC4vVa4Y7iwbmPAzXKF_wYnSJXZjEGuuBIE_fZNkcDr_WUBX9nhMfg	3
14	2026-08-22 16:37:54.192926	2026-08-29 16:37:54.151549	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MTY2NzQsImV4cCI6MTc4ODAyMTQ3NH0.3IJ6DwB_gZH82SVSm-GwSCB2U-Mpb3MbDsRu5AaHZQ0O3o3_yFz5icKqOeol4OWpySqvi0nYzXY9Pb4jBgipsw	3
16	2026-08-22 16:39:28.986409	2026-08-29 16:39:28.961047	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MTY3NjgsImV4cCI6MTc4ODAyMTU2OH0.Nr2HSn614fqzFQpMw6_8Jl0IfTQcAc6Miy_rejg7nDLoSCY-lE6LDmQ1QPbV-AvKAw9UFGC3GV_46-ntIeWL5g	1
17	2026-08-22 17:03:23.739523	2026-08-29 17:03:23.097568	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MTgyMDIsImV4cCI6MTc4ODAyMzAwMn0.GAZaSDToNmGO3IpOmXyKwqqI5_bNY7vUTKJAfgPKF6_pJhA9biGf9jKd8EDUWqCIKlkYqtuv_PJzcFPGCTfyrQ	3
18	2026-08-22 17:20:43.541294	2026-08-29 17:20:43.506318	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MTkyNDMsImV4cCI6MTc4ODAyNDA0M30.kWikq1-HUbVUY4i4ognoKzTmokxxYW8nMRpXCsb9fHkt68Xnkhvk8Z05TFyoTdzJAZP0w4h_rivJbZZdW9R6vA	1
19	2026-08-22 18:01:38.609583	2026-08-29 18:01:38.559192	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MjE2OTgsImV4cCI6MTc4ODAyNjQ5OH0.Ueu4hnTk8M1TUlafOc6Htkbgw_V4XKVAVvOOG1LOQFA-xgJauuPD9VM9nca3islifjH1671CCMYBLYstsbYbGg	3
20	2026-08-22 18:33:09.000733	2026-08-29 18:33:08.964285	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MjM1ODgsImV4cCI6MTc4ODAyODM4OH0.fpeyDgdhvQC93N93LvT4NCeA5o01j__lxK32Vd2jVr_LdkPsQd_O_vbrd9t0w1hQLl1eVQSUVbs86E6wRgEz-g	1
21	2026-08-22 19:03:33.263115	2026-08-29 19:03:33.189071	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MjU0MTMsImV4cCI6MTc4ODAzMDIxM30.Dj7QWJ-uWSm4e7z_DbYU5OeX1Io-xyx3rkPqZvei1Sx7FKZFajMGBsTf9vdbHMl1U3SClqCNibORPVjIMwg55Q	3
22	2026-08-22 19:03:44.088486	2026-08-29 19:03:44.087791	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MjU0MjQsImV4cCI6MTc4ODAzMDIyNH0.sDT274-nCaBG9mH--cZ-364RQqkU9PrJ1qrCxl88QrjUSZZRc5UmdxRVNJeczwy1rYKGT6mFMPNT4qNCEQ3aNw	3
23	2026-08-22 19:05:09.70353	2026-08-29 19:05:08.911997	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MjU1MDgsImV4cCI6MTc4ODAzMDMwOH0.WLb6E7XAbq6VnddquL7P-oaBNcSJaVJpwF9P03bxtPmZ_1_MmMDiSQiJ0KiS2Y_zaYu-aX22zj7DLoN5NlAq1A	1
24	2026-08-22 19:05:15.655216	2026-08-29 19:05:15.654013	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MjU1MTUsImV4cCI6MTc4ODAzMDMxNX0.u-lR1tV5GwIiP91c0fK3c4R60eXiKYZAqEy-O8K7bmqhTvvdIon_mRqkjtSELqg8uaUe2KR2bKqKJiRXpri1Gg	1
25	2026-08-22 19:30:28.362088	2026-08-29 19:30:28.2875	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MjcwMjgsImV4cCI6MTc4ODAzMTgyOH0.6iPwFRkIY_dEdVdvt6Y4IPynMD3OQcPa8_B6V7YeNnJk7umaXyq6tZMKorkvFNyujQ1jggu8VLj0r7esot6U6Q	3
26	2026-08-22 19:32:16.413277	2026-08-29 19:32:16.275146	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MjcxMzYsImV4cCI6MTc4ODAzMTkzNn0.Z-iAa-K__r6I9uC4bM5yZeoRWEyErMbCVw5REbGEqq8EuK1V_tqx_eaOXwhwgsFngZD7i5fxw4HiFeSmgJX2Wg	2
27	2026-08-22 19:33:06.962371	2026-08-29 19:33:06.848529	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MjcxODYsImV4cCI6MTc4ODAzMTk4Nn0.IKhbWd5535Z6RVkqulYtxe4vtbd96JpYI6EpnyoFDshCXlPF-0_fAvpDGYwE6M9FvfZAnaSG6OtosDbGZDCGew	1
28	2026-08-22 19:33:11.966959	2026-08-29 19:33:11.958984	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MjcxOTEsImV4cCI6MTc4ODAzMTk5MX0.K_SMS2SJhnGJ9vC84a4DSvcmCaM5fXn7r0gb5-p46fNcG8IaBooZWeeUn3MH140brjB61uES3wqmqEzTcOP-mQ	1
29	2026-08-22 20:22:29.671966	2026-08-29 20:22:29.268045	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MzAxNDksImV4cCI6MTc4ODAzNDk0OX0.OdvaeeGDjDZsNDfO_CvryZ3IXjxCscQoO73M0AgqDWkk9lR3kSt6CFkd5TH9Nr6d5d88aoI3R-g6F6O5Pcwqcg	1
30	2026-08-22 20:31:10.230113	2026-08-29 20:31:10.085877	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MzA2NzAsImV4cCI6MTc4ODAzNTQ3MH0.HVL17gy5KKVv-51CQIRUh-7Rpk1NhyBSPLZgNmbQtC31Ry8vbqR_Ed8pB2UCkboxDXiEV6B5Xxd63MXFjgBSSw	3
31	2026-08-22 20:31:11.4317	2026-08-29 20:31:11.430739	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MzA2NzEsImV4cCI6MTc4ODAzNTQ3MX0.TwcbM83wjGIALelg5WZjERYZ_8Ew-tERNRVMWVpTnzg_xxbCD0LwE5xBYWXXzuXTZKPiR025MU9SdvOqIT1ZnQ	3
32	2026-08-22 20:34:30.48148	2026-08-29 20:34:30.411137	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0MzA4NzAsImV4cCI6MTc4ODAzNTY3MH0.frmTtMAQCzDeqM2MGjsktSsLitVq0Ib0szp4xNBA8B6W3r57LWarmFD_0kLqEnfHToFytHkZsUgPcpi4db64xg	1
33	2026-08-23 07:56:44.445874	2026-08-30 07:56:44.281924	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0NzE4MDQsImV4cCI6MTc4ODA3NjYwNH0.7nxZWoUc_ZX2JyUMudbIABJY70BzWLLQ7z_MWzihp1Za33lpOx2TUk8bzxICfhxTNu9AcwL7ftac1vT1M51TwQ	3
34	2026-08-23 07:56:47.026161	2026-08-30 07:56:47.025345	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0NzE4MDcsImV4cCI6MTc4ODA3NjYwN30.-87icjMlfbxeN_YHJn0htS99CigXlv3X4f76V5quJDpfS2iLqKgBZ_MrRoD_nJX-eci_Q3POHHquTuKgO7jlgw	3
35	2026-08-23 07:59:42.411408	2026-08-30 07:59:42.356325	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0NzE5ODIsImV4cCI6MTc4ODA3Njc4Mn0.HFgsu-enHUv_2D1n-FzuSL50t3eursA1AmyOsGwjMUQ3LGijz8g9i_n-gdxfh_7iRrCN7tOSu6yX68SMzPGT0Q	1
36	2026-08-23 08:05:05.847902	2026-08-30 08:05:05.791132	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0NzIzMDUsImV4cCI6MTc4ODA3NzEwNX0.1Oh2UHkHp6ZoNNgupUOEvfNtRrg8Z252SnmMVq4BCx8siOep5cHrwynjPeUi6kEqB5C71PWFFsaeqH2isl1m9w	3
37	2026-08-23 08:13:36.693444	2026-08-30 08:13:36.633086	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0NzI4MTYsImV4cCI6MTc4ODA3NzYxNn0.WXv1hq0w9XSBxwc4P4TMzZOyK0vD-rC9Ym_wkMhUURgDYDlQj7PCYklJ0qaGffrVtQi7UCXpGtUJEsZxJxpWzw	3
38	2026-08-23 08:34:23.782925	2026-08-30 08:34:23.711179	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0NzQwNjMsImV4cCI6MTc4ODA3ODg2M30.GtXjvdpfOYKuFjMemAq6rbC4zWysMSsxqDNSyEwmkiOXSULzgfoiciwFplttn11JCZSpZDpKWjGnv3zBXBcfig	1
39	2026-08-23 08:38:11.476835	2026-08-30 08:38:11.466191	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0IiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0NzQyOTEsImV4cCI6MTc4ODA3OTA5MX0.hi4E7LmcqctPvd6SRGYpodoUwBXT8wgQw9JAHmAkC2AQiRN7c0oLEkipPcpQKy2J7J9O1LawAWK9SuSmtN054w	4
40	2026-08-23 08:38:17.166189	2026-08-30 08:38:17.164804	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0IiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0NzQyOTcsImV4cCI6MTc4ODA3OTA5N30.gfM28f5IQxOcwiN4VFpbSOjGVnBal8fAHPY7dr67uUgtc0adXPTuyNg-L6y9d2m668z3GoLuBZDbNAbgoRn5eQ	4
41	2026-08-23 08:53:12.170424	2026-08-30 08:53:12.111799	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0NzUxOTIsImV4cCI6MTc4ODA3OTk5Mn0.zjsh5wnofSIBTmf9xuj3iORmkYKd9EMVZsrPnVNedXsoQk_Os2Zhu2bbbtheZgfy7m6y0z9qurWl3wEz2YqGbQ	1
42	2026-08-23 10:44:20.647704	2026-08-30 10:44:20.36214	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0ODE4NjAsImV4cCI6MTc4ODA4NjY2MH0.ik0CEWMK5MP-SRqDtuzhSF2cC_g-tybFfmdu4oITWCOyBFnZzDvS8d4eQ-ZIELrJ2M9VKL2zFomaZT82xgucNw	3
43	2026-08-23 10:44:47.527869	2026-08-30 10:44:47.516719	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0ODE4ODcsImV4cCI6MTc4ODA4NjY4N30.xRTnR3QLLY2T6IemNL2Q8Tl0lzuVrHyUfFwCu6J_hFFPePXsOk_5YGlNcRgMM2arGaQCVfeB2hbntwahrCYYbg	3
44	2026-08-23 10:46:41.067791	2026-08-30 10:46:41.029899	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0ODIwMDEsImV4cCI6MTc4ODA4NjgwMX0.d7URbZxHAMji9uWey3bedro0tWfjnuMxqF-PQQcaaVeBz25uknFJqMeDALg0XmKvb5QmCUSglFKWB50G9e-4mQ	1
45	2026-08-23 10:47:01.158434	2026-08-30 10:47:01.154275	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0ODIwMjEsImV4cCI6MTc4ODA4NjgyMX0.IuasGz2KrOu0vYxSFa4QcOob6XsLGFFevaFALmESSnHbdz0dQRJMcBJK8B3SEhBMmYFxfyaQxU2tCJg442wXug	1
46	2026-08-23 10:47:23.18101	2026-08-30 10:47:23.1648	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0ODIwNDMsImV4cCI6MTc4ODA4Njg0M30.-Thym7OOkfLcqUsK7hPvQ4kx267adyN-1jorEkuzcVDvHlkgKJeFLKVBl4dV311MSByIY4Y2rf17RCDqUzmrAg	1
47	2026-08-23 10:47:35.263349	2026-08-30 10:47:35.262599	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0IiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0ODIwNTUsImV4cCI6MTc4ODA4Njg1NX0.SvmF5Nw56thYTZFrt_bb18QymG2tQHxawAmxs8Pe0vK_YlC8D3mr3xzmVj4G1P5fXy8Y-I9-WmD1AfssThw3yw	4
48	2026-08-23 10:47:50.182655	2026-08-30 10:47:50.174971	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0ODIwNzAsImV4cCI6MTc4ODA4Njg3MH0.ZOSs2LOpIzPWLAyhA4W9bkmvg0FTouvmotvAwd0Mq5lkiW1cFnCKN1LP4jHzd7AMYnGVncDzGT-gvnAQXNo28Q	3
49	2026-08-23 10:48:21.799212	2026-08-30 10:48:21.779469	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0ODIxMDEsImV4cCI6MTc4ODA4NjkwMX0.w1JnOS2mpzDYQbyHzyQc7WzU4UkrLLtzk8LXvi0KQLrbzBVhoBjayyVY-Yb9GMJQRNWlgYzo9PiE6LW1nIV4pg	2
50	2026-08-23 10:49:13.881355	2026-08-30 10:49:13.878235	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1IiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0ODIxNTMsImV4cCI6MTc4ODA4Njk1M30.3yurgwLRY0ZsCGJDLz0x5pycYsq1Vci0scso6VUIVCcb5PR0_R6zIEv-9won_F4zEMwOP3-tptut86A2wHPeQw	5
51	2026-08-23 10:49:18.474699	2026-08-30 10:49:18.474053	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1IiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0ODIxNTgsImV4cCI6MTc4ODA4Njk1OH0.dpfP8m6V5lW5jFMdhL6GRGe7YB2tYIMVchruT7Y7gdsY8gjUDGu8bbRtoEPSHBZolS1YPx_YmzTTfAngIQHT6A	5
52	2026-08-23 10:51:20.439097	2026-08-30 10:51:20.395967	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc0ODIyODAsImV4cCI6MTc4ODA4NzA4MH0.A5Q6_mCfZWbTKWuOn-xoOdR3pdkxgBhwruDS1pKORTdBUwS2YWP-wOpF6VmADTrBPfFpwN3C6T2GclULg7tw6Q	1
53	2026-08-24 05:54:37.081252	2026-08-31 05:54:36.808724	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc1NTA4NzYsImV4cCI6MTc4ODE1NTY3Nn0.FponfaT8E4DcnZZsaOwoXAZi2Kgr1EwGC6qIySRjzaw79k2Y_VpkBAvH_geVCvOWqqRHKnDdM4oXt3D4hQ4gSw	3
54	2026-08-24 05:56:14.92975	2026-08-31 05:56:14.835632	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc1NTA5NzQsImV4cCI6MTc4ODE1NTc3NH0.X8FYbK6aYu_gwYodznlBxVnekahNHdL2cSV2TCyLBDBsIKqkrviHRcRPrY8E0O8i7ymkjVAso75qNKiHK00a1g	1
55	2026-08-24 05:59:46.517815	2026-08-31 05:59:46.497664	f	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidHlwZSI6IlJFRlJFU0giLCJpYXQiOjE3ODc1NTExODYsImV4cCI6MTc4ODE1NTk4Nn0.o_cvobEc-wt1y3ijsQkqd82pze0N9uDyG52-ebPBPrAXGiNaBjul_VCdq57rLKjI-PoPYcSnpts1pa_OWUvmMA	3
\.


--
-- Data for Name: user_auths; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_auths (id, active, blocked, created_at, email, full_name, password, phone_number, role, updated_at) FROM stdin;
1	t	f	2026-08-22 09:32:04.727992	admin@perfume.com	System Administrator	$2a$10$FSCrVdmliEii609sdJt8yOmIT4VBFcFd5FKkrxTwH.04aeRLWmxRi	0901234567	ADMIN	2026-08-22 09:32:04.728872
2	t	f	2026-08-22 09:32:04.917228	customer@perfume.com	Nguyen Van A	$2a$10$wGcjh5QT47wemi9nqyq6A.s8qBkonceUXASKiOv3eFiIVQZVz6ySC	0987654321	CUSTOMER	2026-08-22 09:32:04.917279
3	t	f	2026-08-22 11:43:32.4026	minhanhtobi2005@gmail.com	Nguyá»…n Tráº§n Minh Anh	$2a$10$WTAKB0vpwVRCAFy.hu5jieg0nx87jcV73Vw5IUsJv7nAHnEwjfcvS	0961358967	CUSTOMER	2026-08-22 11:43:32.411208
4	t	f	2026-08-23 08:38:10.465615	minhanhpubg1072005@gmail.com	Äáº·ng NguyĂªn DÆ°Æ¡ng	$2a$10$glZfsSUnv5L2fmRRFLnAYOIVtw/rBLEB9V5TFchHbhNt3W3TEJPr.	036896174	CUSTOMER	2026-08-23 08:38:10.472758
5	t	f	2026-08-23 10:49:13.01696	datle01012005@gmail.com	LĂª Danh Äáº¡t	$2a$10$K3d/JJuOgiDya5b32lOIgeyH8QtyklTnUQrRqjPPmbVLrhz3pa.sy	039647851	CUSTOMER	2026-08-23 10:49:13.021268
\.


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 1, false);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 55, true);


--
-- Name: user_auths_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_auths_id_seq', 5, true);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: user_auths uk_22jnt469yakasbr5a7cblt1px; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_auths
    ADD CONSTRAINT uk_22jnt469yakasbr5a7cblt1px UNIQUE (email);


--
-- Name: password_reset_tokens uk_71lqwbwtklmljk3qlsugr1mig; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT uk_71lqwbwtklmljk3qlsugr1mig UNIQUE (token);


--
-- Name: user_auths uk_8ywm27u2lq6y18vq8wv6g8csn; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_auths
    ADD CONSTRAINT uk_8ywm27u2lq6y18vq8wv6g8csn UNIQUE (phone_number);


--
-- Name: refresh_tokens uk_ghpmfn23vmxfu3spu3lfg4r2d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT uk_ghpmfn23vmxfu3spu3lfg4r2d UNIQUE (token);


--
-- Name: user_auths user_auths_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_auths
    ADD CONSTRAINT user_auths_pkey PRIMARY KEY (id);


--
-- Name: idx_refresh_tokens_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_tokens_user_id ON public.refresh_tokens USING btree (user_id);


--
-- Name: idx_user_auths_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_auths_role ON public.user_auths USING btree (role);


--
-- PostgreSQL database dump complete
--

\unrestrict 8afrG0P8V58YfPW9cix3ZFT9QGlvgJcZbteng0m2lg3gvx2I0WZ3lef0w5ehCYz

--
-- Database "cart_db" dump
--

--
-- PostgreSQL database dump
--

\restrict ZAL2LUSObdAQ0j9zNdMG2S0EgqhZVIUXIf7kqaJrzeQKeEhqsjw9RQQN7nDHs83

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: cart_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE cart_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cart_db OWNER TO postgres;

\unrestrict ZAL2LUSObdAQ0j9zNdMG2S0EgqhZVIUXIf7kqaJrzeQKeEhqsjw9RQQN7nDHs83
\connect cart_db
\restrict ZAL2LUSObdAQ0j9zNdMG2S0EgqhZVIUXIf7kqaJrzeQKeEhqsjw9RQQN7nDHs83

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    image_url character varying(255),
    product_id bigint NOT NULL,
    product_name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(38,2) NOT NULL,
    updated_at timestamp(6) without time zone,
    user_id bigint NOT NULL,
    variant_id bigint,
    variant_name character varying(255)
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cart_items_id_seq OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, created_at, image_url, product_id, product_name, quantity, unit_price, updated_at, user_id, variant_id, variant_name) FROM stdin;
1	2026-08-22 11:41:47.403432	/images/lancome-la-vie-est-belle.jpg	54	Lancome La Vie Est Belle	1	2800000.00	2026-08-22 11:41:47.405278	2	\N	\N
2	2026-08-22 11:42:37.512005	/images/gucci-bloom.jpg	55	Gucci Bloom	1	3100000.00	2026-08-22 11:42:37.513616	2	\N	\N
\.


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 24, true);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: idx_cart_items_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cart_items_user_id ON public.cart_items USING btree (user_id);


--
-- Name: idx_cart_items_user_prod_var; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cart_items_user_prod_var ON public.cart_items USING btree (user_id, product_id, variant_id);


--
-- PostgreSQL database dump complete
--

\unrestrict ZAL2LUSObdAQ0j9zNdMG2S0EgqhZVIUXIf7kqaJrzeQKeEhqsjw9RQQN7nDHs83

--
-- Database "inventory_db" dump
--

--
-- PostgreSQL database dump
--

\restrict JXVG1jjpy8OzxXqb4qRxVEyxxbxKo3PCAUcH0e92eLwVDulTkPmgKBI2inm0isb

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: inventory_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE inventory_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE inventory_db OWNER TO postgres;

\unrestrict JXVG1jjpy8OzxXqb4qRxVEyxxbxKo3PCAUcH0e92eLwVDulTkPmgKBI2inm0isb
\connect inventory_db
\restrict JXVG1jjpy8OzxXqb4qRxVEyxxbxKo3PCAUcH0e92eLwVDulTkPmgKBI2inm0isb

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: inventory_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_items (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    low_stock_threshold integer,
    product_id bigint NOT NULL,
    product_name character varying(255) NOT NULL,
    reserved_quantity integer NOT NULL,
    sku character varying(255),
    total_quantity integer NOT NULL,
    updated_at timestamp(6) without time zone,
    variant_id bigint,
    variant_name character varying(255)
);


ALTER TABLE public.inventory_items OWNER TO postgres;

--
-- Name: inventory_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventory_items_id_seq OWNER TO postgres;

--
-- Name: inventory_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_items_id_seq OWNED BY public.inventory_items.id;


--
-- Name: inventory_reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_reservations (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer NOT NULL,
    status character varying(255) NOT NULL,
    variant_id bigint
);


ALTER TABLE public.inventory_reservations OWNER TO postgres;

--
-- Name: inventory_reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_reservations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventory_reservations_id_seq OWNER TO postgres;

--
-- Name: inventory_reservations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_reservations_id_seq OWNED BY public.inventory_reservations.id;


--
-- Name: inventory_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_transactions (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    order_id bigint,
    product_id bigint NOT NULL,
    quantity integer NOT NULL,
    reason character varying(255),
    supplier character varying(255),
    transaction_type character varying(255) NOT NULL,
    variant_id bigint
);


ALTER TABLE public.inventory_transactions OWNER TO postgres;

--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventory_transactions_id_seq OWNER TO postgres;

--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_transactions_id_seq OWNED BY public.inventory_transactions.id;


--
-- Name: processed_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.processed_events (
    event_id character varying(255) NOT NULL,
    event_type character varying(255) NOT NULL,
    processed_at timestamp(6) without time zone
);


ALTER TABLE public.processed_events OWNER TO postgres;

--
-- Name: inventory_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_items ALTER COLUMN id SET DEFAULT nextval('public.inventory_items_id_seq'::regclass);


--
-- Name: inventory_reservations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_reservations ALTER COLUMN id SET DEFAULT nextval('public.inventory_reservations_id_seq'::regclass);


--
-- Name: inventory_transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions ALTER COLUMN id SET DEFAULT nextval('public.inventory_transactions_id_seq'::regclass);


--
-- Data for Name: inventory_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_items (id, created_at, low_stock_threshold, product_id, product_name, reserved_quantity, sku, total_quantity, updated_at, variant_id, variant_name) FROM stdin;
1	2026-08-22 09:32:00.76617	5	1	Dior Sauvage Eau de Parfum	0	DIOR-SAUVAGE-60ML	50	2026-08-22 09:32:00.787032	1	60ml
2	2026-08-22 09:32:01.174018	5	1	Dior Sauvage Eau de Parfum	0	DIOR-SAUVAGE-100ML	80	2026-08-22 09:32:01.174092	2	100ml
3	2026-08-22 09:32:01.188655	5	2	Bleu de Chanel Eau de Parfum	0	CHANEL-BLEU-50ML	45	2026-08-22 09:32:01.188734	3	50ml
4	2026-08-22 09:32:01.196907	5	2	Bleu de Chanel Eau de Parfum	0	CHANEL-BLEU-100ML	60	2026-08-22 09:32:01.196975	4	100ml
5	2026-08-22 09:32:01.208602	5	3	Tom Ford Black Orchid	0	TF-BLACKORCHID-50ML	30	2026-08-22 09:32:01.208678	5	50ml
6	2026-08-22 09:32:01.222199	5	3	Tom Ford Black Orchid	0	TF-BLACKORCHID-100ML	40	2026-08-22 09:32:01.222292	6	100ml
7	2026-08-22 09:32:01.233164	8	4	YSL Libre Eau de Parfum	0	YSL-LIBRE-50ML	70	2026-08-22 09:32:01.233254	7	50ml
8	2026-08-22 09:32:01.243881	8	4	YSL Libre Eau de Parfum	0	YSL-LIBRE-90ML	55	2026-08-22 09:32:01.244023	8	90ml
9	2026-08-22 09:32:01.256336	5	5	Le Labo Santal 33	0	LELABO-SANTAL33-50ML	25	2026-08-22 09:32:01.256431	9	50ml
10	2026-08-22 09:32:01.269551	5	5	Le Labo Santal 33	0	LELABO-SANTAL33-100ML	20	2026-08-22 09:32:01.269618	10	100ml
11	2026-08-22 19:04:40.648539	5	57	MInh Anh	0	SKU-57	100	2026-08-22 19:32:07.098173	1	Standard
12	2026-08-22 20:33:35.595463	5	56	Marc Jacobs Daisy	6	SKU-56	100	2026-08-22 20:33:41.725592	1	Standard
15	2026-08-23 08:39:18.696912	5	49	Diptyque Tam Dao	2	SKU-49	100	2026-08-23 08:39:18.92745	1	Standard
13	2026-08-23 07:58:17.846547	5	51	Tom Ford Tobacco Vanille	6	SKU-51	100	2026-08-23 08:39:18.938104	1	Standard
16	2026-08-23 10:50:50.29968	5	36	Amouage Interlude	1	SKU-36	100	2026-08-23 10:50:50.778237	1	Standard
17	2026-08-23 10:50:50.491252	5	45	Montale Intense Cafe	1	SKU-45	100	2026-08-23 10:50:50.810974	1	Standard
18	2026-08-24 05:55:45.341595	5	50	Maison Margiela Jazz Club	2	SKU-50	100	2026-08-24 05:56:04.789642	1	Standard
19	2026-08-24 05:55:45.504253	5	53	Dior J adore	1	SKU-53	100	2026-08-24 05:56:04.837641	1	Standard
14	2026-08-23 08:33:42.358095	5	54	Lancome La Vie Est Belle	2	SKU-54	100	2026-08-24 06:57:00.25672	1	Standard
\.


--
-- Data for Name: inventory_reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_reservations (id, created_at, order_id, product_id, quantity, status, variant_id) FROM stdin;
1	2026-08-22 19:04:40.932554	9	57	2	RELEASED	\N
2	2026-08-22 20:33:35.761803	11	56	2	RESERVED	\N
3	2026-08-22 20:33:36.196458	10	56	2	RESERVED	\N
4	2026-08-22 20:33:41.714759	12	56	2	RESERVED	\N
5	2026-08-23 07:58:18.032988	13	51	1	RESERVED	\N
6	2026-08-23 07:58:18.500046	14	51	1	RESERVED	\N
7	2026-08-23 07:58:18.526401	15	51	1	RESERVED	\N
8	2026-08-23 08:33:42.462452	16	54	1	RESERVED	\N
9	2026-08-23 08:39:18.843501	17	49	2	RESERVED	\N
10	2026-08-23 08:39:18.847855	17	51	3	RESERVED	\N
11	2026-08-23 10:50:50.512138	18	36	1	RESERVED	\N
12	2026-08-23 10:50:50.52087	18	45	1	RESERVED	\N
15	2026-08-24 05:55:47.482587	20	50	2	RESERVED	\N
16	2026-08-24 05:55:47.486182	20	53	1	RESERVED	\N
13	2026-08-24 05:55:45.526972	19	50	2	RELEASED	\N
14	2026-08-24 05:55:45.535647	19	53	1	RELEASED	\N
17	2026-08-24 06:57:00.107527	21	54	1	RESERVED	\N
\.


--
-- Data for Name: inventory_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_transactions (id, created_at, order_id, product_id, quantity, reason, supplier, transaction_type, variant_id) FROM stdin;
1	2026-08-22 19:32:04.201039	9	57	2	KhĂ¡ch há»§y Ä‘Æ¡n	\N	RELEASE	\N
2	2026-08-24 05:56:04.776056	19	50	2	KhĂ¡ch há»§y Ä‘Æ¡n	\N	RELEASE	\N
3	2026-08-24 05:56:04.814288	19	53	1	KhĂ¡ch há»§y Ä‘Æ¡n	\N	RELEASE	\N
\.


--
-- Data for Name: processed_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.processed_events (event_id, event_type, processed_at) FROM stdin;
eed9e36d-cad4-4190-8b74-9241e6b7de35	OrderCreated	2026-08-22 19:04:41.288253
5a8e576e-f732-4740-9ad8-da3923026196	OrderCancelled	2026-08-22 19:32:06.976375
985c31ac-a3ce-4f63-bd41-78832ad4b5c7	OrderCreated	2026-08-22 20:33:36.053561
b169eac9-77bd-4be1-b736-683b246ec870	OrderCreated	2026-08-22 20:33:36.202925
a4f8eeae-fff3-4768-9da1-06578f3ffa66	OrderCreated	2026-08-22 20:33:41.722795
c0f59b57-b255-4c47-8482-cb45125b7ca6	OrderCreated	2026-08-23 07:58:18.385106
50d7d8c1-a840-4262-b260-aa6d1ee3ce12	OrderCreated	2026-08-23 07:58:18.508761
0bb21179-fa20-42a4-aab0-c84d257cc277	OrderCreated	2026-08-23 07:58:18.532924
40c18261-6b9d-457e-b06d-7d196064ff8b	OrderCreated	2026-08-23 08:33:42.610982
b1e99957-6827-4ad1-bc98-fd9ccb33c3e0	OrderCreated	2026-08-23 08:39:18.919912
a92a7013-0747-45f8-88eb-b970384623c2	OrderCreated	2026-08-23 10:50:50.752831
1222b0db-7502-414a-8f13-ce6b51125749	OrderCreated	2026-08-24 05:55:45.715221
40eed95f-6755-4206-ae40-41a6d37be14c	OrderCreated	2026-08-24 05:55:47.494175
e290af15-6b04-4e6e-ad75-8e443e17cf35	OrderCancelled	2026-08-24 05:56:04.828689
62caf797-c925-4ace-b60c-d4489b17ac3d	OrderCreated	2026-08-24 06:57:00.248175
\.


--
-- Name: inventory_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_items_id_seq', 19, true);


--
-- Name: inventory_reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_reservations_id_seq', 17, true);


--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_transactions_id_seq', 3, true);


--
-- Name: inventory_items inventory_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_pkey PRIMARY KEY (id);


--
-- Name: inventory_reservations inventory_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_reservations
    ADD CONSTRAINT inventory_reservations_pkey PRIMARY KEY (id);


--
-- Name: inventory_transactions inventory_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_pkey PRIMARY KEY (id);


--
-- Name: processed_events processed_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processed_events
    ADD CONSTRAINT processed_events_pkey PRIMARY KEY (event_id);


--
-- Name: idx_inventory_items_prod_var; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_items_prod_var ON public.inventory_items USING btree (product_id, variant_id);


--
-- Name: idx_inventory_reservations_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_reservations_order_id ON public.inventory_reservations USING btree (order_id);


--
-- PostgreSQL database dump complete
--

\unrestrict JXVG1jjpy8OzxXqb4qRxVEyxxbxKo3PCAUcH0e92eLwVDulTkPmgKBI2inm0isb

--
-- Database "notification_db" dump
--

--
-- PostgreSQL database dump
--

\restrict gcs0yQaaPVxgvqnL9bJOgEG2qk5IZHVsPczAWHdudHXbWTmW3fdI8JnEt8irhiU

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: notification_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE notification_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE notification_db OWNER TO postgres;

\unrestrict gcs0yQaaPVxgvqnL9bJOgEG2qk5IZHVsPczAWHdudHXbWTmW3fdI8JnEt8irhiU
\connect notification_db
\restrict gcs0yQaaPVxgvqnL9bJOgEG2qk5IZHVsPczAWHdudHXbWTmW3fdI8JnEt8irhiU

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
-- PostgreSQL database dump complete
--

\unrestrict gcs0yQaaPVxgvqnL9bJOgEG2qk5IZHVsPczAWHdudHXbWTmW3fdI8JnEt8irhiU

--
-- Database "order_db" dump
--

--
-- PostgreSQL database dump
--

\restrict dGNIezg1KlZI94xdJFdRvcEar8Oemr98fJCtMfDHeBX3Rb4ML6OrsIQnf35bahO

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: order_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE order_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE order_db OWNER TO postgres;

\unrestrict dGNIezg1KlZI94xdJFdRvcEar8Oemr98fJCtMfDHeBX3Rb4ML6OrsIQnf35bahO
\connect order_db
\restrict dGNIezg1KlZI94xdJFdRvcEar8Oemr98fJCtMfDHeBX3Rb4ML6OrsIQnf35bahO

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    image_url character varying(255),
    product_id bigint NOT NULL,
    product_name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    subtotal numeric(38,2) NOT NULL,
    unit_price numeric(38,2) NOT NULL,
    variant_id bigint,
    variant_name character varying(255),
    order_id bigint NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    customer_email character varying(255),
    customer_id bigint NOT NULL,
    customer_name character varying(255),
    customer_phone character varying(255),
    discount_amount numeric(38,2),
    notes character varying(255),
    order_status character varying(255) NOT NULL,
    payment_method character varying(255),
    payment_status character varying(255) NOT NULL,
    promotion_code character varying(255),
    shipping_address character varying(1000) NOT NULL,
    shipping_fee numeric(38,2),
    shipping_method character varying(255),
    subtotal numeric(38,2) NOT NULL,
    total_amount numeric(38,2) NOT NULL,
    tracking_number character varying(255),
    updated_at timestamp(6) without time zone,
    CONSTRAINT orders_order_status_check CHECK (((order_status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'PROCESSING'::character varying, 'SHIPPED'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying, 'PAYMENT_FAILED'::character varying, 'EXPIRED'::character varying])::text[]))),
    CONSTRAINT orders_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['PENDING'::character varying, 'PROCESSING'::character varying, 'SUCCESS'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: processed_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.processed_events (
    event_id character varying(255) NOT NULL,
    event_type character varying(255) NOT NULL,
    processed_at timestamp(6) without time zone
);


ALTER TABLE public.processed_events OWNER TO postgres;

--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, image_url, product_id, product_name, quantity, subtotal, unit_price, variant_id, variant_name, order_id) FROM stdin;
1	/images/gucci-bloom.jpg	55	Gucci Bloom	1	3100000.00	3100000.00	\N	\N	1
2	/images/lancome-la-vie-est-belle.jpg	54	Lancome La Vie Est Belle	1	2800000.00	2800000.00	\N	\N	1
3	/images/acqua-di-gio-profumo.jpg	38	Acqua di Gio Profumo	1	3000000.00	3000000.00	\N	\N	1
4	/images/marc-jacobs-daisy.jpg	56	Marc Jacobs Daisy	2	5000000.00	2500000.00	\N	\N	2
5	/images/roja-elysium.jpg	47	Roja Elysium	1	9500000.00	9500000.00	\N	\N	5
6	/images/roja-elysium.jpg	47	Roja Elysium	1	9500000.00	9500000.00	\N	\N	3
7	/images/roja-elysium.jpg	47	Roja Elysium	1	9500000.00	9500000.00	\N	\N	4
8	/images/maison-margiela-jazz-club.png	50	Maison Margiela Jazz Club	2	7000000.00	3500000.00	\N	\N	6
9	/images/gucci-bloom.jpg	55	Gucci Bloom	1	3100000.00	3100000.00	\N	\N	6
10	/images/gucci-bloom.jpg	55	Gucci Bloom	1	3100000.00	3100000.00	\N	\N	7
11	/images/maison-margiela-jazz-club.png	50	Maison Margiela Jazz Club	2	7000000.00	3500000.00	\N	\N	8
12	/images/gucci-bloom.jpg	55	Gucci Bloom	1	3100000.00	3100000.00	\N	\N	8
13	https://piger.vn/wp-content/uploads/2023/05/top-10-nuoc-hoa-nu-piger-vn.jpg	57	MInh Anh	2	5000000.00	2500000.00	\N	\N	9
15	/images/marc-jacobs-daisy.jpg	56	Marc Jacobs Daisy	2	5000000.00	2500000.00	\N	\N	11
14	/images/marc-jacobs-daisy.jpg	56	Marc Jacobs Daisy	2	5000000.00	2500000.00	\N	\N	10
16	/images/marc-jacobs-daisy.jpg	56	Marc Jacobs Daisy	2	5000000.00	2500000.00	\N	\N	12
17	/images/tom-ford-tobacco-vanille.png	51	Tom Ford Tobacco Vanille	1	7800000.00	7800000.00	\N	\N	13
18	/images/tom-ford-tobacco-vanille.png	51	Tom Ford Tobacco Vanille	1	7800000.00	7800000.00	\N	\N	14
19	/images/tom-ford-tobacco-vanille.png	51	Tom Ford Tobacco Vanille	1	7800000.00	7800000.00	\N	\N	15
20	/images/lancome-la-vie-est-belle.jpg	54	Lancome La Vie Est Belle	1	2800000.00	2800000.00	\N	\N	16
21	/images/diptyque-tam-dao.jpg	49	Diptyque Tam Dao	2	9600000.00	4800000.00	\N	\N	17
22	/images/tom-ford-tobacco-vanille.png	51	Tom Ford Tobacco Vanille	3	23400000.00	7800000.00	\N	\N	17
23	/images/amouage-interlude.jpg	36	Amouage Interlude	1	8800000.00	8800000.00	\N	\N	18
24	/images/montale-intense-cafe.jpg	45	Montale Intense Cafe	1	3000000.00	3000000.00	\N	\N	18
25	/images/maison-margiela-jazz-club.png	50	Maison Margiela Jazz Club	2	7000000.00	3500000.00	\N	\N	19
26	/images/dior-jadore.jpg	53	Dior J adore	1	3800000.00	3800000.00	\N	\N	19
27	/images/maison-margiela-jazz-club.png	50	Maison Margiela Jazz Club	2	7000000.00	3500000.00	\N	\N	20
28	/images/dior-jadore.jpg	53	Dior J adore	1	3800000.00	3800000.00	\N	\N	20
29	/images/lancome-la-vie-est-belle.jpg	54	Lancome La Vie Est Belle	1	2800000.00	2800000.00	\N	\N	21
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, created_at, customer_email, customer_id, customer_name, customer_phone, discount_amount, notes, order_status, payment_method, payment_status, promotion_code, shipping_address, shipping_fee, shipping_method, subtotal, total_amount, tracking_number, updated_at) FROM stdin;
2	2026-08-22 15:20:23.913794	\N	3	\N	\N	0.00	Cancelled: Inventory insufficient (One or more items in the cart are out of stock)	CANCELLED	COD	PENDING	\N	sdsdf	0.00	STANDARD	5000000.00	5000000.00	\N	2026-08-22 15:43:02.846229
3	2026-08-22 16:00:53.13586	\N	3	\N	\N	0.00	Cancelled: Inventory insufficient (One or more items in the cart are out of stock)	CANCELLED	COD	PENDING	\N	Ă¢sd	0.00	STANDARD	9500000.00	9500000.00	\N	2026-08-22 16:01:02.030955
4	2026-08-22 16:00:53.1364	\N	3	\N	\N	0.00	Cancelled: Inventory insufficient (One or more items in the cart are out of stock)	CANCELLED	COD	PENDING	\N	Ă¢sd	0.00	STANDARD	9500000.00	9500000.00	\N	2026-08-22 16:01:02.063731
5	2026-08-22 16:00:53.135651	\N	3	\N	\N	0.00	Cancelled: Inventory insufficient (One or more items in the cart are out of stock)	CANCELLED	COD	PENDING	\N	Ă¢sd	0.00	STANDARD	9500000.00	9500000.00	\N	2026-08-22 16:01:02.156799
6	2026-08-22 16:38:47.620185	\N	3	Nguyá»…n Tráº§n Minh Anh	091212312	0.00	Cancelled: Inventory insufficient (One or more items in the cart are out of stock)	CANCELLED	COD	PENDING	\N	aaa	35000.00	STANDARD	10100000.00	10135000.00	\N	2026-08-22 16:38:48.996994
7	2026-08-22 17:03:39.024364	\N	3	Nguyá»…n Tráº§n Minh Anh	0911123	0.00	Cancelled: Inventory insufficient (One or more items in the cart are out of stock)	CANCELLED	COD	PENDING	\N	aa	35000.00	STANDARD	3100000.00	3135000.00	\N	2026-08-22 17:03:41.07628
8	2026-08-22 17:17:33.373492	\N	3	Nguyá»…n Tráº§n Minh Anh	0978678	0.00	Cancelled: Inventory insufficient (One or more items in the cart are out of stock)	CANCELLED	COD	PENDING	\N	aaa	35000.00	STANDARD	10100000.00	10135000.00	\N	2026-08-22 17:17:35.196396
1	2026-08-22 12:07:22.257086	\N	3	\N	\N	0.00	\N	DELIVERED	COD	SUCCESS	\N	AAA	0.00	STANDARD	8900000.00	8900000.00	\N	2026-08-22 19:07:55.895419
9	2026-08-22 19:04:24.856916	\N	3	Nguyá»…n Tráº§n Minh Anh	112	0.00	12123	CANCELLED	COD	PENDING	\N	aa	35000.00	STANDARD	5000000.00	5035000.00	\N	2026-08-22 19:31:02.402136
12	2026-08-22 20:33:41.579255	\N	3	Nguyá»…n Tráº§n Minh Anh	091212312	0.00	a	SHIPPED	COD	PENDING	\N	a	35000.00	STANDARD	5000000.00	5035000.00	\N	2026-08-22 20:39:32.319834
11	2026-08-22 20:33:30.094108	\N	3	Nguyá»…n Tráº§n Minh Anh	091212312	0.00	a	DELIVERED	COD	SUCCESS	\N	a	35000.00	STANDARD	5000000.00	5035000.00	\N	2026-08-22 20:39:46.477302
10	2026-08-22 20:33:30.094108	\N	3	Nguyá»…n Tráº§n Minh Anh	091212312	0.00	a	SHIPPED	COD	PENDING	\N	a	35000.00	STANDARD	5000000.00	5035000.00	\N	2026-08-22 20:39:52.324954
13	2026-08-23 07:57:57.647288	\N	3	Nguyá»…n Tráº§n Minh Anh	9867567	0.00	1	PENDING	COD	PENDING	\N	aa	35000.00	STANDARD	7800000.00	7835000.00	\N	2026-08-23 07:57:57.653174
16	2026-08-23 08:33:39.834928	\N	3	Nguyá»…n Tráº§n Minh Anh	33	0.00	1	SHIPPED	COD	PENDING	\N	22	35000.00	STANDARD	2800000.00	2835000.00	\N	2026-08-23 08:35:17.219856
15	2026-08-23 07:58:08.686068	\N	3	Nguyá»…n Tráº§n Minh Anh	9867567	0.00	1	DELIVERED	COD	SUCCESS	\N	aa	35000.00	STANDARD	7800000.00	7835000.00	\N	2026-08-23 08:35:21.676932
14	2026-08-23 07:58:05.227679	\N	3	Nguyá»…n Tráº§n Minh Anh	9867567	0.00	1	CONFIRMED	COD	PENDING	\N	aa	35000.00	STANDARD	7800000.00	7835000.00	\N	2026-08-23 08:35:29.506821
18	2026-08-23 10:50:45.368308	\N	5	LĂª Danh Äáº¡t	09314521	0.00	Cáº©n tháº­n dá»… vá»¡	DELIVERED	COD	SUCCESS	\N	XĂ£ ÄĂ´ LÆ°Æ¡ng, Tá»‰nh Nghá»‡ An	35000.00	STANDARD	11800000.00	11835000.00	\N	2026-08-23 10:53:06.495066
20	2026-08-24 05:55:47.423677	\N	3	Nguyá»…n Tráº§n Minh Anh	091123123	0.00	123	PENDING	COD	PENDING	\N	aa	35000.00	STANDARD	10800000.00	10835000.00	\N	2026-08-24 05:55:47.423726
19	2026-08-24 05:55:38.59558	\N	3	Nguyá»…n Tráº§n Minh Anh	091123123	0.00	123	CANCELLED	COD	PENDING	\N	aa	35000.00	STANDARD	10800000.00	10835000.00	\N	2026-08-24 05:56:04.685914
17	2026-08-23 08:39:16.851246	\N	4	Äáº·ng NguyĂªn DÆ°Æ¡ng	031785669	0.00	KhĂ´ng cĂ³	DELIVERED	COD	SUCCESS	\N	XĂ£ Thá»§y NguyĂªn, TP Háº£i PhĂ²ng	35000.00	STANDARD	33000000.00	33035000.00	\N	2026-08-24 05:57:32.753694
21	2026-08-24 06:56:58.350718	\N	3	Nguyá»…n Tráº§n Minh Anh	091231231	0.00	khĂ´ng cĂ³	PENDING	COD	PENDING	\N	XĂ£ Kim Chung, TP HĂ  Ná»™i	35000.00	STANDARD	2800000.00	2835000.00	\N	2026-08-24 06:56:58.368727
\.


--
-- Data for Name: processed_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.processed_events (event_id, event_type, processed_at) FROM stdin;
\.


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 29, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 21, true);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: processed_events processed_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processed_events
    ADD CONSTRAINT processed_events_pkey PRIMARY KEY (event_id);


--
-- Name: idx_order_items_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_items_order_id ON public.order_items USING btree (order_id);


--
-- Name: idx_order_items_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_items_product_id ON public.order_items USING btree (product_id);


--
-- Name: idx_orders_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_created_at ON public.orders USING btree (created_at DESC);


--
-- Name: idx_orders_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_customer_id ON public.orders USING btree (customer_id);


--
-- Name: idx_orders_order_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_order_status ON public.orders USING btree (order_status);


--
-- Name: idx_orders_payment_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_payment_status ON public.orders USING btree (payment_status);


--
-- Name: order_items fkbioxgbv59vetrxe0ejfubep1w; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkbioxgbv59vetrxe0ejfubep1w FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- PostgreSQL database dump complete
--

\unrestrict dGNIezg1KlZI94xdJFdRvcEar8Oemr98fJCtMfDHeBX3Rb4ML6OrsIQnf35bahO

--
-- Database "payment_db" dump
--

--
-- PostgreSQL database dump
--

\restrict KgTuAWVqItcQLlbwAbFIb0NkzhY1OxdlpFDnW7cSvLGKVhigGxuEbgl3dxAMiXy

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: payment_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE payment_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE payment_db OWNER TO postgres;

\unrestrict KgTuAWVqItcQLlbwAbFIb0NkzhY1OxdlpFDnW7cSvLGKVhigGxuEbgl3dxAMiXy
\connect payment_db
\restrict KgTuAWVqItcQLlbwAbFIb0NkzhY1OxdlpFDnW7cSvLGKVhigGxuEbgl3dxAMiXy

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id bigint NOT NULL,
    amount numeric(38,2) NOT NULL,
    created_at timestamp(6) without time zone,
    customer_id bigint NOT NULL,
    failure_reason character varying(255),
    order_id bigint NOT NULL,
    payment_method character varying(255) NOT NULL,
    payment_url character varying(255),
    status character varying(255) NOT NULL,
    transaction_id character varying(255),
    updated_at timestamp(6) without time zone,
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'PROCESSING'::character varying, 'SUCCESS'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: processed_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.processed_events (
    event_id character varying(255) NOT NULL,
    event_type character varying(255) NOT NULL,
    processed_at timestamp(6) without time zone
);


ALTER TABLE public.processed_events OWNER TO postgres;

--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, amount, created_at, customer_id, failure_reason, order_id, payment_method, payment_url, status, transaction_id, updated_at) FROM stdin;
\.


--
-- Data for Name: processed_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.processed_events (event_id, event_type, processed_at) FROM stdin;
6e7f0932-ba35-4310-97c3-5850b921ab07	InventoryReserved	2026-08-22 19:04:49.735129
eba53797-ca1a-42bd-91a7-826ba88458e1	InventoryReserved	2026-08-22 20:33:43.061698
6b7e6910-c4d8-4905-8080-1fa6f74d12fa	InventoryReserved	2026-08-22 20:33:43.14505
af6af922-d613-4ce6-97a1-4b47c7cba523	InventoryReserved	2026-08-22 20:33:43.154167
ffd937b5-6f69-4a19-9c5a-bff843102911	InventoryReserved	2026-08-23 07:58:27.145807
ecb6f74b-c31a-4c78-a06a-866773b82446	InventoryReserved	2026-08-23 07:58:27.23773
f35270ec-1770-47c1-a768-90e04d27cb0b	InventoryReserved	2026-08-23 07:58:27.245885
1c9b45a4-fe60-455d-95a1-2b87977eaa60	InventoryReserved	2026-08-23 08:33:43.700084
90ca57e3-b3d1-44b1-b844-3a95090c9498	InventoryReserved	2026-08-23 08:39:19.364607
512a8a77-59c9-4848-a63f-1517e2dca788	InventoryReserved	2026-08-23 10:50:58.176566
7f11a0d2-d3c1-461d-9a07-08d313bd0b53	InventoryReserved	2026-08-24 05:55:53.050846
cfdb3167-0f65-497f-97e7-e595e2dcea97	InventoryReserved	2026-08-24 05:55:53.11911
fe4d8657-2c35-4cc3-926a-d9f5cb7772e6	InventoryReserved	2026-08-24 06:57:01.093792
\.


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: processed_events processed_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processed_events
    ADD CONSTRAINT processed_events_pkey PRIMARY KEY (event_id);


--
-- PostgreSQL database dump complete
--

\unrestrict KgTuAWVqItcQLlbwAbFIb0NkzhY1OxdlpFDnW7cSvLGKVhigGxuEbgl3dxAMiXy

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

\restrict fqGK0DxdBxPdUWgzO72UqtYVEZLc20Iz9PxkJMoz0kiPT3Ym8BFTAapDVqOXxdC

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO postgres;

\unrestrict fqGK0DxdBxPdUWgzO72UqtYVEZLc20Iz9PxkJMoz0kiPT3Ym8BFTAapDVqOXxdC
\connect postgres
\restrict fqGK0DxdBxPdUWgzO72UqtYVEZLc20Iz9PxkJMoz0kiPT3Ym8BFTAapDVqOXxdC

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
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

\unrestrict fqGK0DxdBxPdUWgzO72UqtYVEZLc20Iz9PxkJMoz0kiPT3Ym8BFTAapDVqOXxdC

--
-- Database "product_db" dump
--

--
-- PostgreSQL database dump
--

\restrict XKye4yD4hZRGHPaH7mH0vhu3LUc2BXzaOSCnxID3ND9lLc8XXnCMgmXVHagJxtr

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: product_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE product_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE product_db OWNER TO postgres;

\unrestrict XKye4yD4hZRGHPaH7mH0vhu3LUc2BXzaOSCnxID3ND9lLc8XXnCMgmXVHagJxtr
\connect product_db
\restrict XKye4yD4hZRGHPaH7mH0vhu3LUc2BXzaOSCnxID3ND9lLc8XXnCMgmXVHagJxtr

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    id bigint NOT NULL,
    active boolean NOT NULL,
    country character varying(255),
    created_at timestamp(6) without time zone,
    description character varying(255),
    logo_url character varying(255),
    name character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brands_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.brands_id_seq OWNER TO postgres;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    active boolean NOT NULL,
    created_at timestamp(6) without time zone,
    description character varying(255),
    name character varying(255) NOT NULL,
    parent_id bigint,
    slug character varying(255),
    updated_at timestamp(6) without time zone
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    product_id bigint NOT NULL,
    image_url character varying(255)
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    id bigint NOT NULL,
    active boolean NOT NULL,
    price numeric(38,2) NOT NULL,
    promotional_price numeric(38,2),
    sku character varying(255) NOT NULL,
    variant_name character varying(255) NOT NULL,
    volume character varying(255),
    product_id bigint NOT NULL
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_variants_id_seq OWNER TO postgres;

--
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    base_notes character varying(255),
    base_price numeric(38,2) NOT NULL,
    brand character varying(255) NOT NULL,
    category character varying(255) NOT NULL,
    concentration character varying(255),
    created_at timestamp(6) without time zone,
    description character varying(2000),
    fragrance_family character varying(255),
    gender character varying(255),
    image_url character varying(1000),
    middle_notes character varying(255),
    name character varying(255) NOT NULL,
    promotional_price numeric(38,2),
    rating double precision,
    sold_count integer,
    status character varying(255) NOT NULL,
    top_notes character varying(255),
    total_reviews integer,
    updated_at timestamp(6) without time zone,
    CONSTRAINT products_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying, 'DISCONTINUED'::character varying])::text[])))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, active, country, created_at, description, logo_url, name, updated_at) FROM stdin;
1	t	France	2026-08-22 09:32:01.534104	ThÆ°Æ¡ng hiá»‡u xa xá»‰ tá»« PhĂ¡p	\N	Dior	2026-08-22 09:32:01.534171
2	t	France	2026-08-22 09:32:01.54257	Äáº³ng cáº¥p nÆ°á»›c hoa huyá»n thoáº¡i	\N	Chanel	2026-08-22 09:32:01.542633
3	t	USA	2026-08-22 09:32:01.550624	NÆ°á»›c hoa Niche quyáº¿n rÅ©	\N	Tom Ford	2026-08-22 09:32:01.550681
4	t	France	2026-08-22 09:32:01.557413	HoĂ ng gia Anh vĂ  quĂ½ tá»™c	\N	Creed	2026-08-22 09:32:01.557467
5	t	France	2026-08-22 09:32:01.563919	Yves Saint Laurent Paris	\N	YSL	2026-08-22 09:32:01.563978
6	t	USA	2026-08-22 09:32:01.57335	NÆ°á»›c hoa thá»§ cĂ´ng Niche	\N	Le Labo	2026-08-22 09:32:01.573396
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, active, created_at, description, name, parent_id, slug, updated_at) FROM stdin;
1	t	2026-08-22 09:32:01.596248	DĂ nh cho quĂ½ Ă´ng lá»‹ch lĂ£m	NÆ°á»›c hoa Nam	\N	nuoc-hoa-nam	2026-08-22 09:32:01.596301
2	t	2026-08-22 09:32:01.603897	DĂ nh cho quĂ½ cĂ´ thanh lá»‹ch	NÆ°á»›c hoa Ná»¯	\N	nuoc-hoa-nu	2026-08-22 09:32:01.603953
3	t	2026-08-22 09:32:01.609435	Phong cĂ¡ch phi giá»›i tĂ­nh cĂ¡ tĂ­nh	NÆ°á»›c hoa Unisex	\N	nuoc-hoa-unisex	2026-08-22 09:32:01.609499
4	t	2026-08-22 09:32:01.614827	DĂ²ng nÆ°á»›c hoa thá»§ cĂ´ng Ä‘á»™c báº£n	NÆ°á»›c hoa Niche	\N	nuoc-hoa-niche	2026-08-22 09:32:01.614871
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (product_id, image_url) FROM stdin;
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variants (id, active, price, promotional_price, sku, variant_name, volume, product_id) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, base_notes, base_price, brand, category, concentration, created_at, description, fragrance_family, gender, image_url, middle_notes, name, promotional_price, rating, sold_count, status, top_notes, total_reviews, updated_at) FROM stdin;
31	\N	6800000.00	Le Labo	Niche	EDP	2026-08-22 10:18:11.980491	HÆ°Æ¡ng gá»— Ä‘Ă n hÆ°Æ¡ng kinh Ä‘iá»ƒn	\N	UNISEX	/images/le-labo-santal-33.png	\N	Le Labo Santal 33	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:11.980532
29	\N	7500000.00	Creed	Niche	EDP	2026-08-22 10:18:11.928977	HÆ°Æ¡ng thÆ¡m biá»ƒu tÆ°á»£ng dĂ nh cho nam giá»›i	\N	MEN	/images/creed-aventus.png	\N	Creed Aventus	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:11.929053
32	\N	8100000.00	Tom Ford	Designer	EDP	2026-08-22 10:18:11.982331	Tráº§m hÆ°Æ¡ng vĂ  báº¡ch Ä‘áº­u kháº¥u	\N	UNISEX	/images/tom-ford-oud-wood.jpg	\N	Tom Ford Oud Wood	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:11.982354
33	\N	3200000.00	Dior	Designer	EDP	2026-08-22 10:18:11.984358	HÆ°Æ¡ng thÆ¡m phĂ³ng khoĂ¡ng	\N	MEN	/images/dior-sauvage.jpg	\N	Dior Sauvage	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:11.984389
34	\N	4500000.00	Chanel	Designer	EDP	2026-08-22 10:18:11.988601	NÆ°á»›c hoa huyá»n thoáº¡i	\N	WOMEN	/images/chanel-no5.jpg	\N	Chanel No5	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:11.988634
35	\N	11000000.00	Xerjoff	Niche	EDP	2026-08-22 10:18:11.990859	HĂ²a quyá»‡n máº­t ong, hoa cam	\N	MEN	/images/xerjoff-naxos.jpg	\N	Xerjoff Naxos	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:11.990894
37	\N	3500000.00	Chanel	Designer	EDP	2026-08-22 10:18:11.99485	Nam tĂ­nh, máº¡nh máº½	\N	MEN	/images/bleu-de-chanel.jpg	\N	Bleu de Chanel	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:11.994881
38	\N	3000000.00	Giorgio Armani	Designer	Parfum	2026-08-22 10:18:11.996902	HÆ°Æ¡ng biá»ƒn sáº£ng khoĂ¡i	\N	MEN	/images/acqua-di-gio-profumo.jpg	\N	Acqua di Gio Profumo	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:11.996939
39	\N	3100000.00	Yves Saint Laurent	Designer	EDP	2026-08-22 10:18:12.00044	Hiá»‡n Ä‘áº¡i, cuá»‘n hĂºt	\N	MEN	/images/ysl-y-edp.jpg	\N	YSL Y EDP	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.00051
40	\N	2900000.00	Hermes	Designer	EDT	2026-08-22 10:18:12.002953	HÆ°Æ¡ng gá»— cay ná»“ng	\N	MEN	/images/terre-d-hermes.png	\N	Terre d Hermes	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.002991
42	\N	4200000.00	Jo Malone	Niche	Cologne	2026-08-22 10:18:12.006699	HÆ°Æ¡ng muá»‘i biá»ƒn vĂ  xĂ´ thÆ¡m	\N	UNISEX	/images/jo-malone-wood-sage.jpg	\N	Jo Malone Wood Sage	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.006733
43	\N	7500000.00	Kilian	Niche	EDP	2026-08-22 10:18:12.00905	HÆ°Æ¡ng rÆ°á»£u cognac say Ä‘áº¯m	\N	UNISEX	/images/kilian-angels-share.jpg	\N	Kilian Angels Share	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.009089
44	\N	3200000.00	Mancera	Niche	EDP	2026-08-22 10:18:12.01156	HÆ°Æ¡ng chanh vĂ  gá»— tuyáº¿t tĂ¹ng	\N	UNISEX	/images/mancera-cedrat-boise.jpg	\N	Mancera Cedrat Boise	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.011596
46	\N	6500000.00	Parfums de Marly	Niche	EDP	2026-08-22 10:18:12.015286	HÆ°Æ¡ng tĂ¡o vĂ  vanilla	\N	MEN	/images/parfums-de-marly-layton.png	\N	Parfums de Marly Layton	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.015314
47	\N	9500000.00	Roja Dove	Niche	Parfum	2026-08-22 10:18:12.016682	HÆ°Æ¡ng cam chanh tÆ°Æ¡i mĂ¡t	\N	MEN	/images/roja-elysium.jpg	\N	Roja Elysium	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.016702
48	\N	5500000.00	Byredo	Niche	EDP	2026-08-22 10:18:12.018148	HÆ°Æ¡ng thÆ¡m cá»§a tá»± do	\N	UNISEX	/images/byredo-gypsy-water.jpg	\N	Byredo Gypsy Water	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.018168
49	\N	4800000.00	Diptyque	Niche	EDP	2026-08-22 10:18:12.019073	HÆ°Æ¡ng gá»— Ä‘Ă n hÆ°Æ¡ng chĂ¢u Ă	\N	UNISEX	/images/diptyque-tam-dao.jpg	\N	Diptyque Tam Dao	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.019087
51	\N	7800000.00	Tom Ford	Designer	EDP	2026-08-22 10:18:12.022236	Thuá»‘c lĂ¡ vĂ  vanilla	\N	UNISEX	/images/tom-ford-tobacco-vanille.png	\N	Tom Ford Tobacco Vanille	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.022261
52	\N	4200000.00	Chanel	Designer	EDP	2026-08-22 10:18:12.023677	Ná»¯ tĂ­nh, quyáº¿n rÅ©	\N	WOMEN	/images/chanel-coco-mademoiselle.jpg	\N	Chanel Coco Mademoiselle	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.023697
53	\N	3800000.00	Dior	Designer	EDP	2026-08-22 10:18:12.024961	HÆ°Æ¡ng hoa nhĂ i tinh táº¿	\N	WOMEN	/images/dior-jadore.jpg	\N	Dior J adore	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.024981
54	\N	2800000.00	Lancome	Designer	EDP	2026-08-22 10:18:12.026308	Cuá»™c sá»‘ng tÆ°Æ¡i Ä‘áº¹p	\N	WOMEN	/images/lancome-la-vie-est-belle.jpg	\N	Lancome La Vie Est Belle	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.026354
55	\N	3100000.00	Gucci	Designer	EDP	2026-08-22 10:18:12.027657	VÆ°á»n hoa rá»±c rá»¡	\N	WOMEN	/images/gucci-bloom.jpg	\N	Gucci Bloom	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.027688
56	\N	2500000.00	Marc Jacobs	Designer	EDT	2026-08-22 10:18:12.028958	Ngá»t ngĂ o, dá»… thÆ°Æ¡ng	\N	WOMEN	/images/marc-jacobs-daisy.jpg	\N	Marc Jacobs Daisy	\N	5	0	ACTIVE	\N	0	2026-08-24 05:57:01.039955
30	\N	9200000.00	MFK	Niche	EDP	2026-08-22 10:18:11.97808	Tuyá»‡t tĂ¡c hÆ°Æ¡ng thÆ¡m ngá»t ngĂ o	\N	UNISEX	/images/baccarat-rouge-540.jpg	\N	Baccarat Rouge 540	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:11.978112
36	\N	8800000.00	Amouage	Niche	EDP	2026-08-22 10:18:11.992733	HÆ°Æ¡ng tráº§m hÆ°Æ¡ng bĂ­ áº©n	\N	MEN	/images/amouage-interlude.jpg	\N	Amouage Interlude	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:11.992761
41	\N	2200000.00	Versace	Designer	EDT	2026-08-22 10:18:12.004999	TĂ¬nh yĂªu vĂ  Ä‘am mĂª	\N	MEN	/images/versace-eros.jpg	\N	Versace Eros	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.005032
45	\N	3000000.00	Montale	Niche	EDP	2026-08-22 10:18:12.013487	HÆ°Æ¡ng cĂ  phĂª vĂ  hoa há»“ng	\N	UNISEX	/images/montale-intense-cafe.jpg	\N	Montale Intense Cafe	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.013516
50	\N	3500000.00	Maison Margiela	Designer	EDT	2026-08-22 10:18:12.020822	KhĂ´ng khĂ­ cĂ¢u láº¡c bá»™ Jazz	\N	MEN	/images/maison-margiela-jazz-club.png	\N	Maison Margiela Jazz Club	\N	5	0	ACTIVE	\N	0	2026-08-22 10:18:12.020839
\.


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brands_id_seq', 6, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 4, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 41, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 57, true);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: brands uk_oce3937d2f4mpfqrycbr0l93m; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT uk_oce3937d2f4mpfqrycbr0l93m UNIQUE (name);


--
-- Name: categories uk_t8o6pivur7nn124jehx7cygw5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT uk_t8o6pivur7nn124jehx7cygw5 UNIQUE (name);


--
-- Name: idx_categories_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_categories_slug ON public.categories USING btree (slug);


--
-- Name: idx_product_images_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_images_product_id ON public.product_images USING btree (product_id);


--
-- Name: idx_product_variants_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_variants_product_id ON public.product_variants USING btree (product_id);


--
-- Name: idx_products_base_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_base_price ON public.products USING btree (base_price);


--
-- Name: idx_products_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_brand ON public.products USING btree (brand);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_category ON public.products USING btree (category);


--
-- Name: idx_products_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_created_at ON public.products USING btree (created_at DESC);


--
-- Name: idx_products_gender; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_gender ON public.products USING btree (gender);


--
-- Name: idx_products_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_rating ON public.products USING btree (rating);


--
-- Name: idx_products_sold_count; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_sold_count ON public.products USING btree (sold_count);


--
-- Name: idx_products_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_status ON public.products USING btree (status);


--
-- Name: product_variants fkosqitn4s405cynmhb87lkvuau; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT fkosqitn4s405cynmhb87lkvuau FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_images fkqnq71xsohugpqwf3c9gxmsuy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT fkqnq71xsohugpqwf3c9gxmsuy FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- PostgreSQL database dump complete
--

\unrestrict XKye4yD4hZRGHPaH7mH0vhu3LUc2BXzaOSCnxID3ND9lLc8XXnCMgmXVHagJxtr

--
-- Database "promotion_db" dump
--

--
-- PostgreSQL database dump
--

\restrict AlwVqnmOdQqeJZLNJWSZFKgleeeTMfj2yJHgb8tL1soxkvhfzzRYOEVfLDaejze

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: promotion_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE promotion_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE promotion_db OWNER TO postgres;

\unrestrict AlwVqnmOdQqeJZLNJWSZFKgleeeTMfj2yJHgb8tL1soxkvhfzzRYOEVfLDaejze
\connect promotion_db
\restrict AlwVqnmOdQqeJZLNJWSZFKgleeeTMfj2yJHgb8tL1soxkvhfzzRYOEVfLDaejze

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    id bigint NOT NULL,
    active boolean NOT NULL,
    code character varying(255) NOT NULL,
    created_at timestamp(6) without time zone,
    description character varying(255),
    discount_type character varying(255) NOT NULL,
    discount_value numeric(38,2) NOT NULL,
    end_date timestamp(6) without time zone,
    maximum_discount numeric(38,2),
    minimum_order numeric(38,2),
    start_date timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    usage_limit integer,
    used_count integer,
    CONSTRAINT coupons_discount_type_check CHECK (((discount_type)::text = ANY ((ARRAY['PERCENTAGE'::character varying, 'FIXED_AMOUNT'::character varying])::text[])))
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- Name: coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coupons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.coupons_id_seq OWNER TO postgres;

--
-- Name: coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coupons_id_seq OWNED BY public.coupons.id;


--
-- Name: coupons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons ALTER COLUMN id SET DEFAULT nextval('public.coupons_id_seq'::regclass);


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupons (id, active, code, created_at, description, discount_type, discount_value, end_date, maximum_discount, minimum_order, start_date, updated_at, usage_limit, used_count) FROM stdin;
1	t	MINHANH	2026-08-24 05:59:27.376248	10% cho Ä‘Æ¡n tá»« 500k	PERCENTAGE	10.00	\N	\N	\N	\N	2026-08-24 05:59:27.37699	1000	0
\.


--
-- Name: coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coupons_id_seq', 1, true);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: coupons uk_eplt0kkm9yf2of2lnx6c1oy9b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT uk_eplt0kkm9yf2of2lnx6c1oy9b UNIQUE (code);


--
-- PostgreSQL database dump complete
--

\unrestrict AlwVqnmOdQqeJZLNJWSZFKgleeeTMfj2yJHgb8tL1soxkvhfzzRYOEVfLDaejze

--
-- Database "review_db" dump
--

--
-- PostgreSQL database dump
--

\restrict AgR2uNeBvsRibOnzyh4LSPUwFimG81dChgwVmtZasJ1ES13HETOJSkDmZkDA6uH

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: review_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE review_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE review_db OWNER TO postgres;

\unrestrict AgR2uNeBvsRibOnzyh4LSPUwFimG81dChgwVmtZasJ1ES13HETOJSkDmZkDA6uH
\connect review_db
\restrict AgR2uNeBvsRibOnzyh4LSPUwFimG81dChgwVmtZasJ1ES13HETOJSkDmZkDA6uH

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
-- PostgreSQL database dump complete
--

\unrestrict AgR2uNeBvsRibOnzyh4LSPUwFimG81dChgwVmtZasJ1ES13HETOJSkDmZkDA6uH

--
-- Database "shipping_db" dump
--

--
-- PostgreSQL database dump
--

\restrict XlT2t0THbMjSDxJdjzpI1gh327kWCjZlxJmwM2f6T2tq2G5i58K2yvO275j9RUd

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: shipping_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE shipping_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE shipping_db OWNER TO postgres;

\unrestrict XlT2t0THbMjSDxJdjzpI1gh327kWCjZlxJmwM2f6T2tq2G5i58K2yvO275j9RUd
\connect shipping_db
\restrict XlT2t0THbMjSDxJdjzpI1gh327kWCjZlxJmwM2f6T2tq2G5i58K2yvO275j9RUd

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
-- PostgreSQL database dump complete
--

\unrestrict XlT2t0THbMjSDxJdjzpI1gh327kWCjZlxJmwM2f6T2tq2G5i58K2yvO275j9RUd

--
-- Database "user_db" dump
--

--
-- PostgreSQL database dump
--

\restrict UnRKk2UEEq21LhVdZWfhysmEbjisLnhbqiaBNOrz1uxv6gynEPDNKU7ESKacGhm

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: user_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE user_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE user_db OWNER TO postgres;

\unrestrict UnRKk2UEEq21LhVdZWfhysmEbjisLnhbqiaBNOrz1uxv6gynEPDNKU7ESKacGhm
\connect user_db
\restrict UnRKk2UEEq21LhVdZWfhysmEbjisLnhbqiaBNOrz1uxv6gynEPDNKU7ESKacGhm

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    detail_address character varying(255) NOT NULL,
    district character varying(255) NOT NULL,
    is_default boolean NOT NULL,
    phone_number character varying(255) NOT NULL,
    province character varying(255) NOT NULL,
    recipient_name character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone,
    user_id bigint NOT NULL,
    ward character varying(255) NOT NULL
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.addresses_id_seq OWNER TO postgres;

--
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profiles (
    id bigint NOT NULL,
    avatar character varying(255),
    blocked boolean NOT NULL,
    created_at timestamp(6) without time zone,
    email character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    phone_number character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone,
    CONSTRAINT user_profiles_role_check CHECK (((role)::text = ANY ((ARRAY['CUSTOMER'::character varying, 'ADMIN'::character varying])::text[])))
);


ALTER TABLE public.user_profiles OWNER TO postgres;

--
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (id, created_at, detail_address, district, is_default, phone_number, province, recipient_name, updated_at, user_id, ward) FROM stdin;
1	2026-08-22 09:32:01.343797	123 LĂª Duáº©n, TĂ²a nhĂ  Diamond	Quáº­n 1	t	0987654321	Há»“ ChĂ­ Minh	Nguyen Van A	2026-08-22 09:32:01.343874	2	PhÆ°á»ng Báº¿n NghĂ©
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_profiles (id, avatar, blocked, created_at, email, full_name, phone_number, role, updated_at) FROM stdin;
1	https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150	f	2026-08-22 09:32:01.201385	admin@perfume.com	System Administrator	0901234567	ADMIN	2026-08-22 09:32:01.202932
2	https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150	f	2026-08-22 09:32:01.326974	customer@perfume.com	Nguyen Van A	0987654321	CUSTOMER	2026-08-22 09:32:01.327052
3	\N	f	2026-08-22 11:43:40.618026	minhanhtobi2005@gmail.com	Nguyá»…n Tráº§n Minh Anh	0961358967	CUSTOMER	2026-08-22 11:43:40.620978
4	\N	f	2026-08-23 08:38:14.720933	minhanhpubg1072005@gmail.com	Äáº·ng NguyĂªn DÆ°Æ¡ng	036896174	CUSTOMER	2026-08-23 08:38:14.722228
5	\N	f	2026-08-23 10:49:17.693546	datle01012005@gmail.com	LĂª Danh Äáº¡t	039647851	CUSTOMER	2026-08-23 10:49:17.693734
\.


--
-- Name: addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.addresses_id_seq', 1, true);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: user_profiles uk_dqltqkaw58m11jbov0udx8xqg; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT uk_dqltqkaw58m11jbov0udx8xqg UNIQUE (email);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: idx_user_profiles_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_profiles_created_at ON public.user_profiles USING btree (created_at DESC);


--
-- Name: idx_user_profiles_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_profiles_email ON public.user_profiles USING btree (email);


--
-- Name: idx_user_profiles_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_profiles_role ON public.user_profiles USING btree (role);


--
-- PostgreSQL database dump complete
--

\unrestrict UnRKk2UEEq21LhVdZWfhysmEbjisLnhbqiaBNOrz1uxv6gynEPDNKU7ESKacGhm

--
-- Database "wishlist_db" dump
--

--
-- PostgreSQL database dump
--

\restrict wwTv1uK4JMcK5VrBFE7oUEfp6xz48fCkS6qc4UeuQLF9bOCktVwShEvFTsakfJd

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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
-- Name: wishlist_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE wishlist_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE wishlist_db OWNER TO postgres;

\unrestrict wwTv1uK4JMcK5VrBFE7oUEfp6xz48fCkS6qc4UeuQLF9bOCktVwShEvFTsakfJd
\connect wishlist_db
\restrict wwTv1uK4JMcK5VrBFE7oUEfp6xz48fCkS6qc4UeuQLF9bOCktVwShEvFTsakfJd

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist_items (
    id bigint NOT NULL,
    brand character varying(255),
    created_at timestamp(6) without time zone,
    image_url character varying(255),
    in_stock boolean NOT NULL,
    price numeric(38,2),
    product_id bigint NOT NULL,
    product_name character varying(255) NOT NULL,
    rating double precision,
    user_id bigint NOT NULL
);


ALTER TABLE public.wishlist_items OWNER TO postgres;

--
-- Name: wishlist_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wishlist_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.wishlist_items_id_seq OWNER TO postgres;

--
-- Name: wishlist_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wishlist_items_id_seq OWNED BY public.wishlist_items.id;


--
-- Name: wishlist_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items ALTER COLUMN id SET DEFAULT nextval('public.wishlist_items_id_seq'::regclass);


--
-- Data for Name: wishlist_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlist_items (id, brand, created_at, image_url, in_stock, price, product_id, product_name, rating, user_id) FROM stdin;
2	Gucci	2026-08-22 12:09:10.598411	/images/gucci-bloom.jpg	t	3100000.00	55	Gucci Bloom	5	3
3	Chanel	2026-08-23 08:06:11.466129	/images/bleu-de-chanel.jpg	t	3500000.00	37	Bleu de Chanel	5	3
\.


--
-- Name: wishlist_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wishlist_items_id_seq', 3, true);


--
-- Name: wishlist_items ukla3a0bbofa2epdpw2jrkmw2e3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT ukla3a0bbofa2epdpw2jrkmw2e3 UNIQUE (user_id, product_id);


--
-- Name: wishlist_items wishlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);


--
-- Name: idx_wishlist_items_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wishlist_items_user_id ON public.wishlist_items USING btree (user_id);


--
-- Name: idx_wishlist_items_user_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wishlist_items_user_product ON public.wishlist_items USING btree (user_id, product_id);


--
-- PostgreSQL database dump complete
--

\unrestrict wwTv1uK4JMcK5VrBFE7oUEfp6xz48fCkS6qc4UeuQLF9bOCktVwShEvFTsakfJd

--
-- PostgreSQL database cluster dump complete
--

